import { KMBasicKeywordList } from "../keywordTypes";

/**
 * Filesystem access. Several of these exist as both a statement and a
 * function, where the function form returns a status or a count.
 */
export const FILE_KEYWORDS: KMBasicKeywordList = [
  {
    name: "FOPEN",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FOPEN x$,y$[,z]", "FOPEN(x$,y$[,z])"],
    summary:
      "Opens a file. The function form returns the file handle. At most two files may be open at once.",
    alsoA: "function",
    notes: [
      '"r" read, "r+" read and write.',
      '"w" write, truncating any existing file, "w+" the same but readable.',
      '"a" append, "a+" append and read.',
    ],
    example: [
      'F=FOPEN("DATA.TXT","r")',
      "DO UNTIL FEOF()",
      "  PRINT FINPUT$()",
      "LOOP",
      "FCLOSE",
    ].join("\n"),
    snippet: 'FOPEN "${1:FILE.TXT}","${2|r,r+,w,w+,a,a+|}"',
  },
  {
    name: "FCLOSE",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FCLOSE [x]"],
    summary:
      "Closes the active file, or the file with the given handle when one is supplied.",
    snippet: "FCLOSE",
  },
  {
    name: "FILE",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FILE x"],
    summary:
      "Selects which of the two open file handles (1 or 2) later file operations act on.",
    snippet: "FILE ${1:1}",
  },
  {
    name: "FEOF",
    kind: "function",
    category: "Files",
    valueType: "integer",
    syntax: ["FEOF()"],
    summary: "1 when the active file has reached the end, 0 otherwise.",
    snippet: "FEOF()",
  },
  {
    name: "FLEN",
    kind: "function",
    category: "Files",
    valueType: "integer",
    syntax: ["FLEN()"],
    summary: "Length of the active file in bytes.",
    snippet: "FLEN()",
  },
  {
    name: "FSEEK",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FSEEK x", "FSEEK()"],
    summary:
      "Moves to a byte position in the active file. The function form returns the current position.",
    alsoA: "function",
    snippet: "FSEEK ${1:0}",
  },
  {
    name: "FGETC",
    kind: "function",
    category: "Files",
    valueType: "integer",
    syntax: ["FGETC()"],
    summary:
      "Reads one byte from the active file, or -1 at end of file or on error.",
    snippet: "FGETC()",
  },
  {
    name: "FPUTC",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FPUTC x", "FPUTC(x)"],
    summary:
      "Writes one byte. The function form returns the number of bytes written, 1 or 0.",
    alsoA: "function",
    snippet: "FPUTC ${1:x}",
  },
  {
    name: "FGET",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FGET x,y", "FGET(x,y)"],
    summary:
      "Reads y bytes into the array buffer x. The function form returns the count actually read.",
    alsoA: "function",
    example: ["DIM B(256)", "N=FGET(B,1024)"].join("\n"),
    snippet: "FGET ${1:buffer},${2:bytes}",
  },
  {
    name: "FPUT",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FPUT x,y", "FPUT(x,y)"],
    summary:
      "Writes y bytes from the array buffer x. The function form returns the count written.",
    alsoA: "function",
    snippet: "FPUT ${1:buffer},${2:bytes}",
  },
  {
    name: "FINPUT$",
    kind: "function",
    category: "Files",
    valueType: "string",
    syntax: ["FINPUT$([x])"],
    summary:
      "Reads x characters from the active file, or the rest of the line when x is omitted.",
    snippet: "FINPUT$()",
  },
  {
    name: "FPRINT",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FPRINT [x|x$|x# [,|; [y|y$|y# [...]]]]"],
    summary: "Like PRINT, but writes to the active file.",
    example: ['FPRINT "count=";N'].join("\n"),
    snippet: "FPRINT ${1:value}",
  },
  {
    name: "FREMOVE",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FREMOVE x$", "FREMOVE(x$)"],
    summary:
      "Deletes a file or an empty directory. The function form returns 0 on success.",
    alsoA: "function",
    snippet: 'FREMOVE "${1:FILE.TXT}"',
  },
  {
    name: "FRENAME",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["FRENAME x$,y$", "FRENAME(x$,y$)"],
    summary:
      "Renames a file or directory. The function form returns 0 on success or -1 on failure.",
    alsoA: "function",
    since: "KM-1505",
    snippet: 'FRENAME "${1:OLD}","${2:NEW}"',
  },
  {
    name: "MKDIR",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["MKDIR x$", "MKDIR(x$)"],
    summary:
      "Creates a directory. The function form returns 0 on success or -1 on failure.",
    alsoA: "function",
    since: "KM-1505",
    snippet: 'MKDIR "${1:DIR}"',
  },
  {
    name: "SETDIR",
    kind: "statement",
    category: "Files",
    valueType: "none",
    syntax: ["SETDIR x$", "SETDIR(x$)"],
    summary:
      "Changes the current directory. The function form returns 0 on success.",
    alsoA: "function",
    snippet: 'SETDIR "${1:/}"',
  },
  {
    name: "GETDIR$",
    kind: "function",
    category: "Files",
    valueType: "string",
    syntax: ["GETDIR$()"],
    summary: "The current directory as a string.",
    snippet: "GETDIR$()",
  },
  {
    name: "FFIND$",
    kind: "function",
    category: "Files",
    valueType: "string",
    syntax: ["FFIND$([x$[,y$]])"],
    summary:
      "Directory search. Pass a pattern for the first match, then call it with no arguments for each following one. Empty string when nothing is left.",
    notes: ["y$ searches a directory other than the current one."],
    example: [
      'F$=FFIND$("*.BAS")',
      "DO WHILE LEN(F$)",
      "  PRINT F$",
      "  F$=FFIND$()",
      "LOOP",
    ].join("\n"),
    snippet: 'FFIND$("${1:*.*}")',
  },
  {
    name: "FINFO",
    kind: "function",
    category: "Files",
    valueType: "integer",
    syntax: ["FINFO(x)"],
    summary: "Numeric details of the file last found by FFIND$().",
    notes: [
      "0: size in bytes.",
      "1: creation date and time, packed.",
      "3: attribute flags. bit 0 read only, bit 1 hidden, bit 2 system, bit 4 directory, bit 5 archive.",
    ],
    example: ['F$=FFIND$("*.BAS")', 'PRINT F$;" ";FINFO(0);" bytes"'].join(
      "\n",
    ),
    snippet: "FINFO(${1:0})",
  },
  {
    name: "FINFO$",
    kind: "function",
    category: "Files",
    valueType: "string",
    syntax: ["FINFO$(x)"],
    summary:
      "String details of the file last found by FFIND$(). x=0 gives the creation timestamp as an ISO-8601 string.",
    snippet: "FINFO$(${1:0})",
  },
];
