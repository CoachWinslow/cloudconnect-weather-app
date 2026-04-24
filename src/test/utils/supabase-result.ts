/**
 * Test utilities for inspecting Supabase query/mutation results.
 *
 * Supabase responses always have shape `{ data: T[] | null, error: ... }`.
 * In RLS-blocked scenarios `data` is often `null`, which makes naive
 * `.length` access throw. These helpers normalize that.
 */

export type SupabaseResultLike<T = unknown> = {
  data: T[] | T | null;
  error: { message: string } | null;
};

/**
 * Returns `result.data` as an array. `null` and non-array values become `[]`.
 * Use this anywhere you want to count rows without null checks.
 */
export function asRows<T = unknown>(result: SupabaseResultLike<T>): T[] {
  if (Array.isArray(result.data)) return result.data;
  return [];
}

/** Convenience: row count from a Supabase result, treating `null` as 0. */
export function rowCount(result: SupabaseResultLike): number {
  return asRows(result).length;
}

/** True when the response contains zero rows (or `data` is `null`). */
export function isEmpty(result: SupabaseResultLike): boolean {
  return rowCount(result) === 0;
}