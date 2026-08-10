import { KMBasicKeywordList } from "../keywordTypes";

/**
 * Operators and the bare constants. KM-BASIC operators behave differently
 * depending on operand type, which is the single most common source of
 * confusion, so each entry says which type it belongs to.
 */
export const OPERATOR_KEYWORDS: KMBasicKeywordList = [
  {
    name: "AND",
    kind: "operator",
    category: "Operators",
    valueType: "integer",
    syntax: ["x AND y", "x# AND y#", "x$ AND y$"],
    summary:
      "Bitwise AND on integers, but logical AND on floats and on strings. This asymmetry is deliberate and easy to trip over.",
    notes: [
      "Integer: bitwise AND of the two values.",
      "Float: logical conjunction, not a bit operation.",
      'String: "0" when either operand starts with "0", otherwise "1". Added in KM-1512.',
    ],
    example: [
      "A = $F0 AND $3C     REM 48, bitwise",
      "IF X#>0.0# AND Y#>0.0# THEN GOSUB DRAW",
    ].join("\n"),
  },
  {
    name: "OR",
    kind: "operator",
    category: "Operators",
    valueType: "integer",
    syntax: ["x OR y", "x# OR y#", "x$ OR y$"],
    summary:
      "Bitwise OR on integers, logical OR on floats and on strings.",
    notes: [
      'String: "0" only when both operands start with "0", otherwise "1". Added in KM-1512.',
    ],
  },
  {
    name: "XOR",
    kind: "operator",
    category: "Operators",
    valueType: "integer",
    syntax: ["x XOR y"],
    summary: "Bitwise exclusive OR. Integers only.",
  },

  // ------------------------------------------------------ interrupt sources
  {
    name: "TIMER (interrupt)",
    kind: "constant",
    category: "Interrupt sources",
    valueType: "none",
    syntax: ["INTERRUPT TIMER,yyy"],
    summary: "Fires each time the general purpose timer value increments.",
  },
  {
    name: "DRAWCOUNT (interrupt)",
    kind: "constant",
    category: "Interrupt sources",
    valueType: "none",
    syntax: ["INTERRUPT DRAWCOUNT,yyy"],
    summary: "Fires every 1/60 second, once per video frame.",
  },
  {
    name: "KEYS (interrupt)",
    kind: "constant",
    category: "Interrupt sources",
    valueType: "none",
    syntax: ["INTERRUPT KEYS,yyy"],
    summary: "Fires when the button press state changes.",
  },
  {
    name: "INKEY (interrupt)",
    kind: "constant",
    category: "Interrupt sources",
    valueType: "none",
    syntax: ["INTERRUPT INKEY,yyy"],
    summary:
      "Fires on a keyboard press. Pair it with READKEY() to drain the buffer.",
    variants: ["Keyboard"],
  },
  {
    name: "WAVE (interrupt)",
    kind: "constant",
    category: "Interrupt sources",
    valueType: "none",
    syntax: ["INTERRUPT WAVE,yyy"],
    summary: "Fires when WAVE file playback finishes.",
  },

  // -------------------------------------------------------- button constants
  {
    name: "KEYUP",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(1)"],
    summary: "Bit 1 of the KEYS() mask, the up direction.",
  },
  {
    name: "KEYDOWN",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(2)"],
    summary: "Bit 2 of the KEYS() mask, the down direction.",
  },
  {
    name: "KEYLEFT",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(4)"],
    summary: "Bit 4 of the KEYS() mask, the left direction.",
  },
  {
    name: "KEYRIGHT",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(8)"],
    summary: "Bit 8 of the KEYS() mask, the right direction.",
  },
  {
    name: "KEYSTART",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(16)"],
    summary: "Bit 16 of the KEYS() mask, the START button.",
  },
  {
    name: "KEYFIRE",
    kind: "constant",
    category: "Button constants",
    valueType: "integer",
    syntax: ["KEYS(32)"],
    summary: "Bit 32 of the KEYS() mask, the FIRE button.",
  },
];
