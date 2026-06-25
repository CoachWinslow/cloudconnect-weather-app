/**
 * Authenticated has_role() tests with isolated per-test fixtures.
 *
 * What this guards:
 *   - `authenticated` users CAN execute public.has_role()
 *   - has_role() returns TRUE for the role the user actually has
 *   - has_role() returns FALSE for roles the user does NOT have
 *   - admin and editor users see different truth tables
 *
 * Fixture isolation:
 *   - Each test creates a brand-new auth user via the service role,
 *     assigns exactly one role row, signs in as that user with a
 *     fresh client, runs assertions, and tears the user down in
 *     `afterEach` (cascade deletes the user_roles + profiles rows).
 *   - No shared state between tests. No reliance on seed data.
 *
 * Required env (only present in CI / local with secrets):
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_PUBLISHABLE_KEY
 *   - SUPABASE_SERVICE_ROLE_KEY   (CI secret; never bundled to client)
 *
 * The whole suite skips gracefully when SERVICE_ROLE_KEY is absent,
 * so local dev runs don't fail.
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
// Service role key is read from process.env (Node), not import.meta.env,
// so it never gets bundled into the browser build.
declare const process: { env?: Record<string, string | undefined> } | undefined;
const SERVICE_ROLE_KEY =
  (typeof process !== "undefined" && process.env?.SUPABASE_SERVICE_ROLE_KEY) ||
  "";

const hasFixtures = Boolean(SUPABASE_URL && ANON_KEY && SERVICE_ROLE_KEY);

type AppRole = "admin" | "editor" | "viewer";

interface Fixture {
  userId: string;
  email: string;
  password: string;
  client: SupabaseClient;
}

let admin: SupabaseClient;
const createdUserIds: string[] = [];

beforeAll(() => {
  if (!hasFixtures) return;
  admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
});

/** Creates an auth user, assigns the given role, signs them in.
 *  Returns a per-fixture client bound to that user's session. */
async function createUserWithRole(role: AppRole): Promise<Fixture> {
  const tag = `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `test+${tag}@lovable-tests.local`;
  const password = `Pw!${Math.random().toString(36).slice(2)}Aa1`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    throw new Error(`createUser failed: ${createErr?.message}`);
  }
  const userId = created.user.id;
  createdUserIds.push(userId);

  const { error: roleErr } = await admin
    .from("user_roles")
    .insert({ user_id: userId, role });
  if (roleErr) throw new Error(`assign role failed: ${roleErr.message}`);

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: signInErr } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) throw new Error(`signIn failed: ${signInErr.message}`);

  return { userId, email, password, client };
}

afterEach(async () => {
  if (!hasFixtures) return;
  // Cascade-deletes user_roles and profiles rows tied to this user.
  while (createdUserIds.length) {
    const id = createdUserIds.pop()!;
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
});

describe.skipIf(!hasFixtures)("has_role(): authenticated execute is allowed", () => {
  it("admin user: has_role(self, 'admin') === true", async () => {
    const f = await createUserWithRole("admin");
    const { data, error } = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "admin",
    });
    expect(error).toBeNull();
    expect(data).toBe(true);
  });

  it("admin user: has_role(self, 'editor') === false", async () => {
    const f = await createUserWithRole("admin");
    const { data, error } = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "editor",
    });
    expect(error).toBeNull();
    expect(data).toBe(false);
  });

  it("editor user: has_role(self, 'editor') === true", async () => {
    const f = await createUserWithRole("editor");
    const { data, error } = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "editor",
    });
    expect(error).toBeNull();
    expect(data).toBe(true);
  });

  it("editor user: has_role(self, 'admin') === false", async () => {
    const f = await createUserWithRole("editor");
    const { data, error } = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "admin",
    });
    expect(error).toBeNull();
    expect(data).toBe(false);
  });

  it("viewer user: has_role returns false for both admin and editor", async () => {
    const f = await createUserWithRole("viewer");
    const adminCheck = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "admin",
    });
    const editorCheck = await f.client.rpc("has_role", {
      _user_id: f.userId,
      _role: "editor",
    });
    expect(adminCheck.error).toBeNull();
    expect(editorCheck.error).toBeNull();
    expect(adminCheck.data).toBe(false);
    expect(editorCheck.data).toBe(false);
  });

  it("admin user can SELECT user_roles (RLS policy gated by has_role)", async () => {
    const f = await createUserWithRole("admin");
    const { data, error } = await f.client
      .from("user_roles")
      .select("user_id, role")
      .eq("user_id", f.userId);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    // Admin can read their own role row through the admin SELECT policy.
    expect((data ?? []).length).toBe(1);
    expect(data?.[0].role).toBe("admin");
  });

  it("editor user CANNOT SELECT user_roles (admin-only policy)", async () => {
    const f = await createUserWithRole("editor");
    const { data, error } = await f.client
      .from("user_roles")
      .select("user_id, role")
      .limit(5);
    // RLS yields zero rows (or an error) for non-admins.
    if (error) {
      expect(error.message.length).toBeGreaterThan(0);
    } else {
      expect((data ?? []).length).toBe(0);
    }
  });

  it("editor user CAN insert into cities (editor-gated INSERT policy)", async () => {
    const f = await createUserWithRole("editor");
    const cityId = `rls-fixture-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const { error: insertErr } = await f.client.from("cities").insert({
      id: cityId,
      name: "RLS Fixture City",
      country: "Testland",
      lat: 0,
      lng: 0,
      fun_fact: "fixture",
      connection_description: "fixture",
    });
    expect(insertErr).toBeNull();
    // Cleanup via service role (editors can DELETE their own writes too,
    // but service role guarantees teardown even if the policy changes).
    await admin.from("cities").delete().eq("id", cityId);
  });
});