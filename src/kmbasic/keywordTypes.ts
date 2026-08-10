/**
 * Shared data model for KM-BASIC language knowledge.
 *
 * The completion provider and the hover provider both read from this model,
 * so a keyword is described once and only once.
 *
 * Syntax signatures follow the MachiKania KM-BASIC reference (help-e.txt,
 * KM-1512 / Puerulus 1.70). Descriptions and examples are written for this
 * extension.
 */

export type KMBasicKind =
  | "statement"
  | "function"
  | "keyword"
  | "operator"
  | "system"
  | "constant"
  | "class";

/**
 * MachiKania variants a keyword applies to. Omit for anything available
 * everywhere.
 */
export type KMBasicVariant =
  "TypeP" | "TypePU" | "WiFi" | "RP2350" | "Keyboard";

/**
 * KM-BASIC has three value types, distinguished by a suffix on the name.
 * Recording it lets completion show the right icon and lets hover explain
 * why FLOAT#() and FLOAT$() are different things.
 */
export type KMBasicValueType = "integer" | "float" | "string" | "none";

export interface KMBasicKeyword {
  /**
   * Canonical name as typed, including any type suffix.
   * Examples: "PRINT", "SQRT#", "HEX$", "INTERRUPT STOP".
   */
  name: string;

  kind: KMBasicKind;

  /** Group shown in the completion detail line, e.g. "Graphics". */
  category: string;

  /** Return or operand type. Use "none" for statements. */
  valueType: KMBasicValueType;

  /** One or more syntax forms. The first is the canonical one. */
  syntax: string[];

  /** Single sentence shown in the completion list and hover heading. */
  summary: string;

  /** Extra bullet lines for the hover popup. */
  notes?: string[];

  /** Example KM-BASIC source, rendered as a fenced code block. */
  example?: string;

  /** Completion snippet body. Defaults to the plain name. */
  snippet?: string;

  /** Variants this keyword is restricted to. Omit for "all". */
  variants?: KMBasicVariant[];

  /**
   * Some names exist as both a statement and a function, for example FSEEK
   * and MKDIR. Set this so hover can mention the other form.
   */
  alsoA?: KMBasicKind;

  /** Firmware release the keyword first appeared in, e.g. "KM-1512". */
  since?: string;
}

export type KMBasicKeywordList = readonly KMBasicKeyword[];
