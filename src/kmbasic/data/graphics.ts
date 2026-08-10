import { KMBasicKeywordList } from "../keywordTypes";

/**
 * Graphics. Note the bracket convention in the reference: [x,y] means the
 * coordinate pair may be omitted, in which case the current graphic position
 * set by POINT is used.
 */
export const GRAPHICS_KEYWORDS: KMBasicKeywordList = [
  {
    name: "USEGRAPHIC",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["USEGRAPHIC [x]"],
    summary:
      "Enables graphics mode and clears the screen. x=2 also reinitialises the palette.",
    notes: [
      "Type P always has both graphics and text available.",
      "Since KM-1509 a second argument selects between two graphic RAM areas for double buffering.",
    ],
    example: ["USEGRAPHIC 1", "GCLS"].join("\n"),
    snippet: "USEGRAPHIC ${1:1}",
  },
  {
    name: "GCLS",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["GCLS"],
    summary: "Clears the graphics screen.",
  },
  {
    name: "GCOLOR",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["GCOLOR c", "GCOLOR(x,y)"],
    summary:
      "Sets the default drawing colour used when a drawing statement omits c. The function form reads the palette number of a pixel.",
    alsoA: "function",
    example: ["GCOLOR 7", "LINE 0,0,100,100", "P=GCOLOR(50,50)"].join("\n"),
    snippet: "GCOLOR ${1:7}",
  },
  {
    name: "GPALETTE",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["GPALETTE n,r,g,b"],
    summary: "Sets graphics palette entry n.",
    snippet: "GPALETTE ${1:0},${2:0},${3:0},${4:0}",
  },
  {
    name: "POINT",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["POINT x,y"],
    summary:
      "Sets the current graphic position, which drawing statements use when their coordinates are omitted.",
    example: ["POINT 10,10", "LINE 100,100   REM from 10,10"].join("\n"),
    snippet: "POINT ${1:x},${2:y}",
  },
  {
    name: "PSET",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["PSET [x,y][,c]"],
    summary: "Draws a single point.",
    snippet: "PSET ${1:x},${2:y},${3:c}",
  },
  {
    name: "LINE",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["LINE [x1,y1],x2,y2[,c]"],
    summary:
      "Draws a line. With the first pair omitted it starts from the current position.",
    example: ["LINE 0,0,159,119,7"].join("\n"),
    snippet: "LINE ${1:x1},${2:y1},${3:x2},${4:y2},${5:c}",
  },
  {
    name: "BOXFILL",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["BOXFILL [x1,y1],x2,y2[,c]"],
    summary: "Draws a filled rectangle across the given diagonal.",
    snippet: "BOXFILL ${1:x1},${2:y1},${3:x2},${4:y2},${5:c}",
  },
  {
    name: "CIRCLE",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["CIRCLE [x,y],r[,c]"],
    summary: "Draws a circle outline of radius r.",
    example: ["CIRCLE 80,60,40,7"].join("\n"),
    snippet: "CIRCLE ${1:x},${2:y},${3:r},${4:c}",
  },
  {
    name: "CIRCLEFILL",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["CIRCLEFILL [x,y],r[,c]"],
    summary: "Draws a filled circle of radius r.",
    snippet: "CIRCLEFILL ${1:x},${2:y},${3:r},${4:c}",
  },
  {
    name: "GPRINT",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["GPRINT [x,y],c,bc,s$"],
    summary:
      "Draws a string on the graphics screen. A negative bc means no background fill.",
    example: ['GPRINT 10,10,7,-1,"SCORE"'].join("\n"),
    snippet: 'GPRINT ${1:x},${2:y},${3:c},${4:-1},"${5:text}"',
  },
  {
    name: "PUTBMP",
    kind: "statement",
    category: "Graphics",
    valueType: "none",
    syntax: ["PUTBMP [x,y],m,n,bbb"],
    summary:
      "Draws an m by n bitmap from an array of colour numbers, one byte per pixel.",
    snippet: "PUTBMP ${1:x},${2:y},${3:w},${4:h},${5:array}",
  },
];
