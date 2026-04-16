export type Timestamp = bigint;

export interface PromptWithViews {
  id: bigint;
  title: string;
  content: string;
  complexity: bigint;
  created_at: Timestamp;
  view_count: bigint;
}

export interface CreatePromptArgs {
  title: string;
  content: string;
  complexity: number;
}

export type PromptError =
  | { __kind__: "NotFound"; NotFound: null }
  | { __kind__: "InvalidTitle"; InvalidTitle: string }
  | { __kind__: "InvalidContent"; InvalidContent: string }
  | { __kind__: "InvalidComplexity"; InvalidComplexity: string };

export type PromptResult =
  | { __kind__: "ok"; ok: PromptWithViews }
  | { __kind__: "err"; err: PromptError };

export type ComplexityLevel = "low" | "medium" | "high";

export function getComplexityLevel(
  complexity: number | bigint,
): ComplexityLevel {
  const val = typeof complexity === "bigint" ? Number(complexity) : complexity;
  if (val <= 3) return "low";
  if (val <= 7) return "medium";
  return "high";
}

export function getPromptErrorMessage(error: PromptError): string {
  if (error.__kind__ === "NotFound") return "Prompt not found.";
  if (error.__kind__ === "InvalidTitle") return error.InvalidTitle;
  if (error.__kind__ === "InvalidContent") return error.InvalidContent;
  if (error.__kind__ === "InvalidComplexity") return error.InvalidComplexity;
  return "An unexpected error occurred.";
}
