/*
 * Generates syntaxes/kmbasic.tmLanguage.json from the keyword model.
 *
 * The grammar needs the same keyword lists the providers use. Maintaining
 * them twice guarantees they drift, so the grammar is generated instead.
 *
 * Run: npm run grammar   (compiles first, then regenerates)
 */

const fs = require("fs");
const path = require("path");

const { ALL_KEYWORDS } = require("../out/kmbasic/keywords.js");

/** Strips the disambiguation markers used in the model. */
function typed(name) {
  return name.replace(/\s*\(interrupt\)$/, "").replace(/\($/, "");
}

/** Escapes a keyword for use inside a regex alternation. */
function esc(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds an alternation, longest first so that INTERRUPT STOP is matched
 * before INTERRUPT, and SQRT# before a hypothetical SQRT.
 */
function alternation(names) {
  const unique = [...new Set(names)];
  unique.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return unique.map(esc).join("|");
}

function namesOfKind(...kinds) {
  return ALL_KEYWORDS.filter((kw) => kinds.includes(kw.kind))
    .map((kw) => typed(kw.name))
    .filter((n) => /^[A-Za-z][A-Za-z0-9_ #$]*$/.test(n));
}

const statements = alternation(namesOfKind("statement", "keyword"));
const functions = alternation(namesOfKind("function", "constant"));
const classes = alternation(namesOfKind("class"));

const grammar = {
  $schema:
    "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  name: "KM-BASIC",
  scopeName: "source.kmbasic",
  patterns: [
    { include: "#comment" },
    { include: "#string" },
    { include: "#number" },
    { include: "#label" },
    { include: "#statement" },
    { include: "#function" },
    { include: "#class" },
    { include: "#operator" },
    { include: "#variable" },
  ],
  repository: {
    comment: {
      name: "comment.line.rem.kmbasic",
      match: "(?i)\\bREM\\b.*$",
    },
    string: {
      name: "string.quoted.double.kmbasic",
      begin: '"',
      end: '"',
    },
    number: {
      patterns: [
        {
          // KM-BASIC hex is $1200 or 0x1200.
          name: "constant.numeric.hex.kmbasic",
          match: "(\\$[0-9A-Fa-f]+|0[xX][0-9A-Fa-f]+)",
        },
        {
          name: "constant.numeric.float.kmbasic",
          match: "\\b[0-9]+\\.[0-9]*([eE][-+]?[0-9]+)?\\b|\\b[0-9]+[eE][-+]?[0-9]+\\b",
        },
        {
          name: "constant.numeric.integer.kmbasic",
          match: "\\b[0-9]+\\b",
        },
      ],
    },
    label: {
      patterns: [
        {
          match: "(?i)^\\s*(LABEL)\\s+([A-Za-z_][A-Za-z0-9_]*)",
          captures: {
            1: { name: "keyword.control.kmbasic" },
            2: { name: "entity.name.function.kmbasic" },
          },
        },
        {
          match: "(?i)^\\s*(METHOD)\\s+([A-Za-z_][A-Za-z0-9_]*)",
          captures: {
            1: { name: "storage.type.kmbasic" },
            2: { name: "entity.name.function.kmbasic" },
          },
        },
        {
          name: "constant.numeric.line.kmbasic",
          match: "^\\s*[0-9]+(?=\\s)",
        },
      ],
    },
    statement: {
      name: "keyword.control.kmbasic",
      match: `(?i)\\b(${statements})\\b`,
    },
    function: {
      name: "support.function.kmbasic",
      match: `(?i)\\b(${functions})(?=\\s*[($#]|\\b)`,
    },
    class: {
      name: "support.class.kmbasic",
      match: `(?i)\\b(${classes})\\b`,
    },
    operator: {
      patterns: [
        {
          name: "keyword.operator.logical.kmbasic",
          match: "(?i)\\b(AND|OR|XOR)\\b",
        },
        {
          name: "keyword.operator.kmbasic",
          match: "(<<|>>|<=|>=|!=|[-+*/%<>=&])",
        },
      ],
    },
    variable: {
      patterns: [
        {
          name: "variable.other.string.kmbasic",
          match: "\\b[A-Za-z_][A-Za-z0-9_]*\\$",
        },
        {
          name: "variable.other.float.kmbasic",
          match: "\\b[A-Za-z_][A-Za-z0-9_]*#",
        },
        {
          name: "variable.other.kmbasic",
          match: "\\b[A-Za-z_][A-Za-z0-9_]*\\b",
        },
      ],
    },
  },
};

const out = path.join(__dirname, "..", "syntaxes", "kmbasic.tmLanguage.json");
fs.writeFileSync(out, JSON.stringify(grammar, null, 2) + "\n", "utf8");

console.log(
  `Wrote ${out} (${ALL_KEYWORDS.length} keywords: ` +
    `${namesOfKind("statement", "keyword").length} statements, ` +
    `${namesOfKind("function", "constant").length} functions, ` +
    `${namesOfKind("class").length} classes)`,
);
