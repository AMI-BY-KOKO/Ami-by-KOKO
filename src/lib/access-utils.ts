/**
 * Access control utilities — pure functions for checking free vs paid content.
 * These are server-safe and can be called from both Server and Client Components.
 * NO "use client" directive — this is a pure server module.
 *
 * Free tier limits:
 * - English letters: A–F only
 * - Yorùbá letters: A, B, D, E, Ẹ, F only (first 6 of 25)
 * - French letters: A–F only
 * - Numbers: 1–3 only
 * - World: Body Parts category only
 * - Story: first 3 shards (A, B, C)
 * - DJ Booth: first 3 pads (A, B, C)
 * - Languages: English only (Yorùbá and French require paid access)
 */

/** 
 * Check if a letter is free based on language.
 * NOW: Always returns true — all letters are free for all users.
 */
export function isLetterFree(letter: string, language: string = "english"): boolean {
  return true;
}

/** Numbers 1–10 are all free — no paywall. */
export function isNumberFree(num: number | string): boolean {
  return true;
}

/** All world categories are free — no paywall. */
export function isCategoryFree(category: string): boolean {
  return true;
}

/** All story shards (0–9) are free — no paywall. */
export function isShardFree(index: number): boolean {
  return true;
}

/** All DJ pads (0–7) are free — no paywall. */
export function isPadFree(index: number): boolean {
  return true;
}
