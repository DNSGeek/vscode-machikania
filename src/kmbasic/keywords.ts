import { KMBasicKeyword, KMBasicKeywordList } from "./keywordTypes";
import { STATEMENT_KEYWORDS } from "./data/statements";
import { FUNCTION_KEYWORDS } from "./data/functions";
import { GRAPHICS_KEYWORDS } from "./data/graphics";
import { FILE_KEYWORDS } from "./data/files";
import { IO_KEYWORDS } from "./data/io";
import { SYSTEM_KEYWORDS } from "./data/system";
import { OPERATOR_KEYWORDS } from "./data/operators";
import { LIBRARY_KEYWORDS } from "./data/library";

export * from "./keywordTypes";

/** Every keyword the extension knows about. */
export const ALL_KEYWORDS: KMBasicKeywordList = [
  ...STATEMENT_KEYWORDS,
  ...FUNCTION_KEYWORDS,
  ...GRAPHICS_KEYWORDS,
  ...FILE_KEYWORDS,
  ...IO_KEYWORDS,
  ...SYSTEM_KEYWORDS,
  ...OPERATOR_KEYWORDS,
  ...LIBRARY_KEYWORDS,
];

/**
 * Word pattern for KM-BASIC identifiers.
 *
 * The VS Code default splits on # and $, which would make SQRT# match as
 * SQRT and HEX$ as HEX. Since a bare SQRT does not exist, hover would simply
 * fail on every float and string function without this.
 */
export const KMBASIC_WORD_PATTERN = /[A-Za-z_][A-Za-z0-9_]*[#$]?/;

/**
 * Some entries are disambiguation aliases rather than things the user types:
 * "SYSTEM(" distinguishes the function from the statement, "TIMER (interrupt)"
 * distinguishes the interrupt source from the statement. Strip the marker to
 * get the text that actually appears in source.
 */
function typedForm(name: string): string {
  return name.replace(/\s*\(interrupt\)$/, "").replace(/\($/, "");
}

/** Longest keyword name in words, for multi word lookup such as ON ERROR. */
export const MAX_KEYWORD_WORDS = ALL_KEYWORDS.reduce(
  (max, kw) => Math.max(max, typedForm(kw.name).split(" ").length),
  1,
);

const index = new Map<string, KMBasicKeyword>();
for (const kw of ALL_KEYWORDS) {
  const key = typedForm(kw.name).toUpperCase();
  // First definition wins so the statement form is not shadowed by an alias.
  if (!index.has(key)) {
    index.set(key, kw);
  }
}

/** Looks up a keyword by name, case insensitively. */
export function findKeyword(name: string): KMBasicKeyword | undefined {
  return index.get(name.trim().toUpperCase());
}

/**
 * Finds the most specific keyword matching a run of words, preferring the
 * longest match so INTERRUPT STOP wins over INTERRUPT.
 */
export function findLongestKeyword(
  words: string[],
): KMBasicKeyword | undefined {
  for (let len = Math.min(words.length, MAX_KEYWORD_WORDS); len > 0; len--) {
    const hit = findKeyword(words.slice(0, len).join(" "));
    if (hit) {
      return hit;
    }
  }
  return undefined;
}

/** The text a completion item should insert for this keyword. */
export function insertTextFor(kw: KMBasicKeyword): string {
  return kw.snippet ?? typedForm(kw.name);
}

/** The label a completion item should show. */
export function labelFor(kw: KMBasicKeyword): string {
  return typedForm(kw.name);
}

/** Builds the markdown body shown in hovers and completion documentation. */
export function renderKeywordMarkdown(kw: KMBasicKeyword): string {
  const parts: string[] = [];

  parts.push("```kmbasic\n" + kw.syntax.join("\n") + "\n```");
  parts.push(kw.summary);

  if (kw.alsoA) {
    parts.push(`_Also exists as a ${kw.alsoA}._`);
  }

  if (kw.variants && kw.variants.length > 0) {
    parts.push(`_Requires: ${kw.variants.join(", ")}_`);
  }

  if (kw.since) {
    parts.push(`_Added in ${kw.since}._`);
  }

  if (kw.notes && kw.notes.length > 0) {
    parts.push(kw.notes.map((n) => `- ${n}`).join("\n"));
  }

  if (kw.example) {
    parts.push("**Example**\n\n```kmbasic\n" + kw.example + "\n```");
  }

  return parts.join("\n\n");
}
