/**
 * A runnable code block extracted from a markdown document, paired with the
 * heading that immediately precedes it (or the empty string when none does).
 */
export type Block = { heading: string; code: string }
