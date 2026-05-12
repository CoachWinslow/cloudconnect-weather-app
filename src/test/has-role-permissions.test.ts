/**
 * has_role() execute-permission tests.
 *
 * Background: `public.has_role(_user_id uuid, _role app_role)` is a
 * SECURITY DEFINER function used by every RLS policy that checks roles.
 * After the 2026-05-12 hardening migration:
 *   - EXECUTE was REVOKED from `public` (and therefore `anon`)
 *   - EXECUTE was GRANTED back to `authenticated` only
 *
 * These tests guard that posture so a future migration can't silently
 * re-expose the function to anonymous callers (which would let an attacker
 * enumerate role assignments via probing).
 *
 * We also re-assert a couple of role-gated RLS policies to catch the case
 * where has_role works but the policies that depend on it regress.
 */
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_KEY);

const anon = hasSupabaseEnv
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : (null as never);

const FAKE_USER_ID = "00000000-0000-0000-0000-000000000001";

/** PostgREST surfaces a missing EXECUTE grant as a 4xx with a permission
 *  / function-not-found message. We accept either signal. */
function isPermissionDenied(err: { message?: string; code?: string } | null) {
  if (!err) return false;
  const msg = (err.message ?? "").toLowerCase();
  return (
    msg.includes("permission denied") ||
    msg.includes("not allowed") ||
    msg.includes("could not find the function") ||
    msg.includes("function") && msg.includes("does not exist")
  );
}

describe.skipIf(!hasSupabaseEnv)("has_role(): anon execute is revoked", () => {
  it("anon cannot call has_role() via RPC", async () => {
    const { data, error } = await anon.rpc("has_role", {
      _user_id: FAKE_USER_ID,
      _role: "admin",
    });
    // Must NOT return a boolean to an anonymous caller.
    expect(data).not.toBe(true);
    expect(data).not.toBe(false);
    expect(error).not.toBeNull();
    expect(isPermissionDenied(error)).toBe(true);
  });

  it("anon cannot probe non-admin roles either", async () => {
    for (const role of ["editor", "viewer"] as const) {
      const { data, error } = await anon.rpc("has_role", {
        _user_id: FAKE_USER_ID,
        _role: role,
      });
      expect(data).not.toBe(true);
      expect(data).not.toBe(false);
      expect(error).not.toBeNull();
    }
  });
});

describe.skipIf(!hasSupabaseEnv)("RLS policies that depend on has_role()", () => {
  it("anon cannot enumerate user_roles (admin-only SELECT policy)", async () => {
    const { data, error } = await anon
      .from("user_roles")
      .select("user_id, role")
      .limit(5);
    // Either RLS returns 0 rows or the request errors. Never leak rows.
    if (error) {
      expect(error.message.length).toBeGreaterThan(0);
    } else {
      expect(Array.isArray(data)).toBe(true);
      expect((data ?? []).length).toBe(0);
    }
  });

  it("anon cannot insert into cities (admin/editor-only INSERT policy)", async () => {
    const { error } = await anon.from("cities").insert({
      id: "has-role-test-city",
      name: "Should Not Insert",
      country: "Nowhere",
      lat: 0,
      lng: 0,
      fun_fact: "x",
      connection_description: "x",
    });
    expect(error).not.toBeNull();
  });

  it("anon CAN still SELECT cities (public read policy intact)", async () => {
    const { error } = await anon.from("cities").select("id").limit(1);
    expect(error).toBeNull();
  });
});