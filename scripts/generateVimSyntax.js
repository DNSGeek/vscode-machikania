/*
 * Generates vim/syntax/machikania.vim from the KM-BASIC keyword model.
 *
 * The vim plugin and the VS Code extension describe the same language, so
 * they read the same tables. Keeping two hand-written keyword lists in sync
 * is a losing game.
 *
 * Run: node scripts/generateVimSyntax.js
 */

const fs = require("fs");
const path = require("path");

const { ALL_KEYWORDS } = require("../out/kmbasic/keywords.js");

function typed(name) {
  return name.replace(/\s*\(interrupt\)$/, "").replace(/\($/, "");
}

/** Single-word names only. Multi word entries become syn match rules below. */
function words(predicate) {
  const out = new Set();
  for (const kw of ALL_KEYWORDS) {
    if (!predicate(kw)) {
      continue;
    }
    const name = typed(kw.name);
    if (/^[A-Za-z][A-Za-z0-9_]*[#$]?$/.test(name)) {
      out.add(name);
    }
  }
  return [...out].sort();
}

/** Wraps a keyword list into syn keyword lines of a readable width. */
function keywordLines(group, names, width = 68) {
  const lines = [];
  let current = "";

  for (const name of names) {
    const candidate = current ? `${current} ${name}` : name;
    if (candidate.length > width && current) {
      lines.push(`syntax keyword ${group} ${current}`);
      current = name;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(`syntax keyword ${group} ${current}`);
  }

  return lines.join("\n");
}

const CONTROL = new Set(["IF", "THEN", "ELSE", "ELSEIF", "ENDIF"]);

const REPEAT = new Set([
  "DO",
  "LOOP",
  "WHILE",
  "WEND",
  "FOR",
  "NEXT",
  "BREAK",
  "CONTINUE",
]);

const FLOW = new Set(["GOSUB", "GOTO", "LABEL", "RETURN", "END"]);

const OOP = new Set([
  "USECLASS",
  "FIELD",
  "STATIC",
  "METHOD",
  "NEW",
  "DELETE",
  "CALL",
  "PUBLIC",
  "PRIVATE",
  "CLASSCODE",
  "INIT",
]);

const isControl = (kw) => CONTROL.has(typed(kw.name));
const isRepeat = (kw) => REPEAT.has(typed(kw.name));
const isFlow = (kw) => FLOW.has(typed(kw.name));
const isOop = (kw) => OOP.has(typed(kw.name));
const isOperator = (kw) => kw.kind === "operator";
const isClass = (kw) => kw.kind === "class";
const isConstant = (kw) =>
  kw.kind === "constant" && !isControl(kw) && !isRepeat(kw);

// REM is handled by the comment rule below. It must NOT also be a syn
// keyword: in Vim a keyword outranks a match starting at the same position,
// so a keyword REM would win and the comment would never highlight.
const HANDLED_ELSEWHERE = new Set(["REM"]);

const statements = words(
  (kw) =>
    (kw.kind === "statement" || kw.kind === "keyword") &&
    !isControl(kw) &&
    !isRepeat(kw) &&
    !isFlow(kw) &&
    !isOop(kw) &&
    !HANDLED_ELSEWHERE.has(typed(kw.name)),
);

// "A$" in the model documents the substring syntax x$(y,z), which applies to
// any string variable. As a syn keyword it would highlight every variable
// literally named A$, so it is excluded here.
const PSEUDO = new Set(["A$"]);

const functions = words(
  (kw) =>
    kw.kind === "function" &&
    !isOop(kw) &&
    !isFlow(kw) &&
    !PSEUDO.has(typed(kw.name)),
);

const constants = words(isConstant);
const classes = words(isClass);
const operators = words(isOperator);

// Keywords that only exist in the block-structure and OOP vocabulary but are
// not in the model as standalone entries.
const extraRepeat = ["TO", "STEP", "UNTIL"];
const extraOop = ["PUBLIC", "PRIVATE", "INIT", "CLASSCODE"];
const extraStatements = ["STOP"]; // as in INTERRUPT STOP

const header = `" Vim syntax file
" Language:     MachiKania KM-BASIC
" Reference:    KM-1512 / Phyllosoma-Puerulus 1.70 (June 2026)
" Maintainer:   Thomas Knox
" Generated:    by scripts/generateVimSyntax.js - do not edit by hand

if exists('b:current_syntax')
    finish
endif

syntax case ignore

" KM-BASIC type suffixes are part of the identifier: SQRT# and HEX$ are not
" SQRT and HEX. 'syn iskeyword' scopes this to syntax matching only, so it
" does not disturb 'w' motions or the user's own 'iskeyword'.
if has('patch-7.4.1142')
    syntax iskeyword @,48-57,_,35,36
else
    setlocal iskeyword+=35,36
endif
`;

const body = `
" ---------------------------------------------------------------- statements
${keywordLines("machiKaniaLanguageKeywords", [...statements, ...extraStatements].sort())}
highlight default link machiKaniaLanguageKeywords Keyword

" ----------------------------------------------------------------- functions
${keywordLines("machiKaniaBuiltin", functions)}
highlight default link machiKaniaBuiltin Function

" ----------------------------------------------------------- flow of control
${keywordLines("machiKaniaFunction", [...FLOW].sort())}
highlight default link machiKaniaFunction Function

" --------------------------------------------------------------- conditional
${keywordLines("machiKaniaConditional", [...CONTROL].sort())}
highlight default link machiKaniaConditional Conditional

" -------------------------------------------------------------------- repeat
${keywordLines("machiKaniaRepeat", [...REPEAT, ...extraRepeat].sort())}
highlight default link machiKaniaRepeat Repeat

" -------------------------------------------------- classes and object model
${keywordLines("machiKaniaStructure", [...new Set([...OOP, ...extraOop])].sort())}
syntax match machiKaniaStructure "::"
highlight default link machiKaniaStructure Structure

" ------------------------------------------------------------ library classes
${keywordLines("machiKaniaLibClass", classes)}
highlight default link machiKaniaLibClass Type

" ----------------------------------------------------------------- constants
${keywordLines("machiKaniaConstant", constants)}
highlight default link machiKaniaConstant Constant

" ----------------------------------------------------------------- operators
${keywordLines("machiKaniaOperator", operators)}
" Longest first so != is not eaten by ! and << is not eaten by <.
syntax match machiKaniaOperator "<<\\|>>\\|<=\\|>=\\|!=\\|[-+*/%<>=&]"
highlight default link machiKaniaOperator Operator

" ------------------------------------------------------------------- comment
" Anchored with a word boundary. Without it, REM matches inside FREMOVE and
" comments the rest of the line.
syntax match machiKaniaTodo contained "\\<\\(TODO\\|FIXME\\|XXX\\|NOTE\\)\\>"
syntax match machiKaniaComment "\\<REM\\>.*$" contains=machiKaniaTodo
highlight default link machiKaniaComment Comment
highlight default link machiKaniaTodo Todo

" -------------------------------------------------------------------- string
" KM-BASIC has no backslash escapes. A double quote inside a string is built
" with CHR$(\$22), so there is nothing to skip over, and a string cannot span
" a line.
syntax region machiKaniaString start=+"+ end=+"+ oneline
highlight default link machiKaniaString String

" -------------------------------------------------------------------- number
" Hexadecimal is written \$1200 or 0x1200. Floats may carry an exponent.
syntax match machiKaniaNumber "\\<\\d\\+\\>"
syntax match machiKaniaNumber "\\<\\d\\+\\.\\d*\\([eE][-+]\\=\\d\\+\\)\\="
syntax match machiKaniaNumber "\\<\\d\\+[eE][-+]\\=\\d\\+\\>"
syntax match machiKaniaNumber "\\<\\.\\d\\+\\>"
syntax match machiKaniaNumber "\\$\\x\\+\\>"
syntax match machiKaniaNumber "\\<0[xX]\\x\\+\\>"
highlight default link machiKaniaNumber Number

" --------------------------------------------------------------------- label
" A label declaration and a bare line number are both jump targets.
syntax match machiKaniaLabel "^\\s*\\<LABEL\\>\\s\\+\\zs\\w\\+"
syntax match machiKaniaLabel "^\\s*\\zs\\d\\+\\ze\\s"
highlight default link machiKaniaLabel Label

let b:current_syntax = 'machikania'
`;

const outDir = path.join(__dirname, "..", "vim", "syntax");
fs.mkdirSync(outDir, { recursive: true });

const out = path.join(outDir, "machikania.vim");
fs.writeFileSync(out, header + body, "utf8");

console.log(
  `Wrote ${out}\n` +
    `  ${statements.length} statements, ${functions.length} functions, ` +
    `${constants.length} constants, ${classes.length} library classes`,
);
