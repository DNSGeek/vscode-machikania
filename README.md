# vscode-kmbasic

Visual Studio Code language support for **KM-BASIC**, the BASIC compiler
built into [MachiKania](https://machikania.net/) type P and type PU on the
Raspberry Pi Pico family.

Reference documentation follows the KM-BASIC manual as of KM-1512 /
Phyllosoma-Puerulus 1.70 (June 2026).

## Features

- Completion for 248 statements, functions, operators, interrupt sources and
  library classes, each with a syntax signature and its value type
- Hover documentation with syntax, notes and a worked example
- Snippet bodies with tab stops, including choice lists for enumerated
  arguments such as the interrupt source in `INTERRUPT` and the mode string
  in `FOPEN`
- Syntax highlighting, generated from the same keyword tables the providers
  use so the two cannot drift apart
- Outline and Go to Symbol built from `LABEL`, `METHOD`, `FIELD` and `STATIC`
  declarations
- Context-aware completion after `USECLASS`, which offers only class names
- Type suffixes are handled properly: `SQRT#` and `HEX$` resolve as
  themselves rather than as `SQRT` and `HEX`

## What this extension deliberately does not do

MachiKania has no serial REPL. Programs reach the board through the SD card,
through the `pcconnect` tool over USB, or by being embedded in a `.uf2`. There
is no protocol here for an editor to drive, so this extension is language
support only - no upload command, no device file browser, no debugger.

If you use `pcconnect`, point its `ROOT=` at your workspace and the normal
edit-then-reset loop works unchanged.

## Installation

### From a VSIX

```bash
npm install
npm run compile
npx vsce package
code --install-extension vscode-kmbasic-0.1.0.vsix
```

### From source

```bash
git clone <your repo url>
cd vscode-kmbasic
npm install
npm run compile
```

Press `F5` to launch an Extension Development Host.

## A note on the .bas extension

This extension claims `.bas`, which several other BASIC extensions also claim.
If you have more than one installed, set the language explicitly per workspace:

```json
{
  "files.associations": {
    "**/*.bas": "kmbasic"
  }
}
```

Class files use the same extension, so a file named `CLASS1.BAS` containing
`FIELD` and `METHOD` declarations gets the same treatment as a main program.

## Project layout

```
src/
  extension.ts            activation and provider registration
  completionProvider.ts   completion items built from the keyword model
  hoverProvider.ts        hover lookup, including multi word keywords
  symbolProvider.ts       outline from LABEL / METHOD / FIELD / STATIC
  kmbasic/
    keywordTypes.ts       the KMBasicKeyword shape
    keywords.ts           aggregation, lookup index, markdown rendering
    data/                 keyword tables, split by domain
scripts/
  generateGrammar.js      regenerates the TextMate grammar from the tables
syntaxes/
  kmbasic.tmLanguage.json generated, do not edit by hand
```

### Adding or correcting a keyword

Everything lives in `src/kmbasic/data/`. Add an entry to the file matching its
domain, then regenerate the grammar:

```ts
{
  name: "DELAYMS",
  kind: "statement",
  category: "Timing",
  valueType: "none",
  syntax: ["DELAYMS x"],
  summary: "Pauses for x milliseconds.",
  snippet: "DELAYMS ${1:100}",
}
```

```bash
npm run grammar
```

`valueType` records what the keyword returns, which is what drives the type
suffix shown in completion. `alsoA` marks the many KM-BASIC names that exist
as both a statement and a function (`FSEEK`, `MKDIR`, `TCPSEND` and friends).
`variants` restricts an entry to `WiFi`, `TypePU`, `Keyboard` and so on.

## Known limitations

- Per-class methods are not completed. Each library class documents its own
  methods in its `help.txt`, which this extension does not parse, so
  `WGET::FORSTRING$` will not autocomplete.
- `SYSTEM(n)` is documented as a family rather than one entry per index. The
  hover lists the ranges; it will not tell you what `SYSTEM(103)` returns
  without you reading the note.
- The `A$(x,y)` substring syntax is documented but cannot be completed,
  because it applies to any string variable rather than a fixed name.
- The indentation rules are heuristic. `LABEL` and `METHOD` increase indent
  and `RETURN` decreases it, which is right for most code but wrong for a
  single line `IF ... THEN ... RETURN`.
- No compile or syntax checking. That requires the on-device compiler.

## Acknowledgements

MachiKania and KM-BASIC are the work of KenKen and Katsumi. This extension is
an independent project and is not affiliated with or endorsed by them.

Descriptions and examples in the keyword tables are written for this project.
The MachiKania documentation is the authority; where they disagree, the
documentation is right and this is a bug.

## License

MIT. See [LICENSE](LICENSE).
