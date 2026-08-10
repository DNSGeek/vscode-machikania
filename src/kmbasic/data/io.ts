import { KMBasicKeywordList } from "../keywordTypes";

/** Digital and analog I/O, PWM, serial, I2C and SPI. */
export const IO_KEYWORDS: KMBasicKeywordList = [
  {
    name: "IN",
    kind: "function",
    category: "Digital I/O",
    valueType: "integer",
    syntax: ["IN(x)"],
    summary:
      "Reads bit x of the I/O port as 0 or 1. Inputs are pulled up inside the chip.",
    example: ['IF IN(0)=0 THEN PRINT "button pressed"'].join("\n"),
    snippet: "IN(${1:0})",
  },
  {
    name: "IN8L",
    kind: "function",
    category: "Digital I/O",
    valueType: "integer",
    syntax: ["IN8L()"],
    summary: "Reads the low 8 bits of the I/O port.",
    snippet: "IN8L()",
  },
  {
    name: "IN8H",
    kind: "function",
    category: "Digital I/O",
    valueType: "integer",
    syntax: ["IN8H()"],
    summary: "Reads the high 8 bits of the I/O port.",
    snippet: "IN8H()",
  },
  {
    name: "IN16",
    kind: "function",
    category: "Digital I/O",
    valueType: "integer",
    syntax: ["IN16()"],
    summary: "Reads all 16 bits of the I/O port.",
    snippet: "IN16()",
  },
  {
    name: "OUT",
    kind: "statement",
    category: "Digital I/O",
    valueType: "none",
    syntax: ["OUT x,y"],
    summary: "Writes 0 or 1 to bit x of the I/O port.",
    example: ["OUT 0,1", "DELAYMS 500", "OUT 0,0"].join("\n"),
    snippet: "OUT ${1:0},${2:1}",
  },
  {
    name: "OUT8L",
    kind: "statement",
    category: "Digital I/O",
    valueType: "none",
    syntax: ["OUT8L x"],
    summary: "Writes an 8 bit value to the low half of the I/O port.",
    snippet: "OUT8L ${1:0}",
  },
  {
    name: "OUT8H",
    kind: "statement",
    category: "Digital I/O",
    valueType: "none",
    syntax: ["OUT8H x"],
    summary: "Writes an 8 bit value to the high half of the I/O port.",
    snippet: "OUT8H ${1:0}",
  },
  {
    name: "OUT16",
    kind: "statement",
    category: "Digital I/O",
    valueType: "none",
    syntax: ["OUT16 x"],
    summary: "Writes a 16 bit value to the I/O port.",
    snippet: "OUT16 ${1:0}",
  },
  {
    name: "ANALOG",
    kind: "function",
    category: "Analog I/O",
    valueType: "integer",
    syntax: ["ANALOG(x)"],
    summary: "Reads an ADC input on GP26 to GP29 as a 12 bit value, 0 to 4095.",
    notes: [
      "GP26 for x = 0, 13 or 26.",
      "GP27 for x = 1, 14 or 27.",
      "GP28 for x = 2, 15 or 28.",
      "GP29 for x = 3, 16 or 29.",
    ],
    example: ["V#=FLOAT#(ANALOG(0))*3.3#/4095.0#"].join("\n"),
    snippet: "ANALOG(${1:0})",
  },
  {
    name: "PWM",
    kind: "statement",
    category: "PWM",
    valueType: "none",
    syntax: ["PWM x[,y[,z]]"],
    summary:
      "PWM output. x is the duty ratio 0 to 1000, y the frequency in Hz (6 to 95454, default 1000), z the channel PWM1 to PWM3.",
    notes: [
      "PWM4 to PWM9 are available since KM-1511, configured in the INI file.",
    ],
    example: ["PWM 500,1000,1   REM 50 percent at 1 kHz on PWM1"].join("\n"),
    snippet: "PWM ${1:500},${2:1000}",
  },

  // ------------------------------------------------------------------ serial
  {
    name: "SERIAL",
    kind: "statement",
    category: "Serial",
    valueType: "none",
    syntax: ["SERIAL x[,y[,z]]"],
    summary:
      "Starts serial communication at baud rate x. Pass x=0 to stop using the port.",
    notes: [
      "y selects parity: 0 none, 1 even, 2 odd, 3 nine bit without parity. Default 0.",
      "z sets the receive buffer size in characters. Omitted, it holds 1/60 second of continuous data.",
    ],
    example: ["SERIAL 9600", 'SERIALOUT ASC("A")'].join("\n"),
    snippet: "SERIAL ${1:9600}",
  },
  {
    name: "SERIALIN",
    kind: "function",
    category: "Serial",
    valueType: "integer",
    syntax: ["SERIALIN([x])"],
    summary:
      "Receives one character. SERIALIN(1) instead returns how many characters are waiting in the buffer.",
    notes: [
      "With 8 bit plus parity, a parity error returns a value of $100 or more.",
    ],
    example: ["DO WHILE SERIALIN(1)", "  PRINT CHR$(SERIALIN());", "LOOP"].join(
      "\n",
    ),
    snippet: "SERIALIN()",
  },
  {
    name: "SERIALOUT",
    kind: "statement",
    category: "Serial",
    valueType: "none",
    syntax: ["SERIALOUT x"],
    summary: "Transmits one character.",
    snippet: "SERIALOUT ${1:x}",
  },

  // --------------------------------------------------------------------- I2C
  {
    name: "I2C",
    kind: "statement",
    category: "I2C",
    valueType: "none",
    syntax: ["I2C [x]"],
    summary:
      "Starts I2C in master mode. x is the clock in kHz, 12 to 3409, default 100.",
    example: ["I2C 400", "I2CWRITE $48,$01", "V=I2CREAD($48)"].join("\n"),
    snippet: "I2C ${1:100}",
  },
  {
    name: "I2CWRITE",
    kind: "statement",
    category: "I2C",
    valueType: "none",
    syntax: ["I2CWRITE x[,y[,z[, ...]]]"],
    summary:
      "Fixed length I2C transmission to 7 bit slave address x, followed by optional byte values.",
    snippet: "I2CWRITE ${1:$48}",
  },
  {
    name: "I2CREAD",
    kind: "function",
    category: "I2C",
    valueType: "integer",
    syntax: ["I2CREAD(x[,y[,z[, ...]]])"],
    summary: "Sends the optional bytes to address x then reads one byte back.",
    snippet: "I2CREAD(${1:$48})",
  },
  {
    name: "I2CWRITEDATA",
    kind: "statement",
    category: "I2C",
    valueType: "none",
    syntax: ["I2CWRITEDATA x,y,z1[,z2[,z3...]]"],
    summary:
      "Multi byte I2C send. x is the address, y a pointer to the buffer, z1 the byte count.",
    snippet: "I2CWRITEDATA ${1:$48},${2:buffer},${3:count}",
  },
  {
    name: "I2CREADDATA",
    kind: "statement",
    category: "I2C",
    valueType: "none",
    syntax: ["I2CREADDATA x,y,z1[,z2[,z3...]]"],
    summary:
      "Multi byte I2C receive. x is the address, y a pointer to the receive buffer, z1 the byte count.",
    snippet: "I2CREADDATA ${1:$48},${2:buffer},${3:count}",
  },
  {
    name: "I2CERROR",
    kind: "function",
    category: "I2C",
    valueType: "integer",
    syntax: ["I2CERROR()"],
    summary: "Non-zero when the last I2C transfer failed.",
    example: ["I2CWRITE $48,$01", 'IF I2CERROR() THEN PRINT "I2C failed"'].join(
      "\n",
    ),
    snippet: "I2CERROR()",
  },

  // --------------------------------------------------------------------- SPI
  {
    name: "SPI",
    kind: "statement",
    category: "SPI",
    valueType: "none",
    syntax: ["SPI x[,y[,z1[,z2]]]"],
    summary:
      "Starts SPI in master mode. x is the clock in kHz, 93 to 47727, and y the word length in bits (8 or 16).",
    notes: ["spi1 can be used when the LCD is not in use, since KM-1505."],
    snippet: "SPI ${1:1000}",
  },
  {
    name: "SPIWRITE",
    kind: "statement",
    category: "SPI",
    valueType: "none",
    syntax: ["SPIWRITE x[,y[,z[, ...]]]"],
    summary: "Fixed length SPI transmission of the given words.",
    snippet: "SPIWRITE ${1:$00}",
  },
  {
    name: "SPIREAD",
    kind: "function",
    category: "SPI",
    valueType: "integer",
    syntax: ["SPIREAD([x[,y[,z[, ...]]]])"],
    summary:
      "Optionally sends the given words, then receives and returns one word.",
    snippet: "SPIREAD()",
  },
  {
    name: "SPIWRITEDATA",
    kind: "statement",
    category: "SPI",
    valueType: "none",
    syntax: ["SPIWRITEDATA x,y[,z1[,z2[,z3...]]]"],
    summary:
      "Multi word SPI send. x points at the buffer, y is the word count.",
    snippet: "SPIWRITEDATA ${1:buffer},${2:count}",
  },
  {
    name: "SPIREADDATA",
    kind: "statement",
    category: "SPI",
    valueType: "none",
    syntax: ["SPIREADDATA x,y[,z1[,z2[,z3...]]]"],
    summary:
      "Multi word SPI receive. x points at the buffer, y is the word count.",
    snippet: "SPIREADDATA ${1:buffer},${2:count}",
  },
  {
    name: "SPISWAPDATA",
    kind: "statement",
    category: "SPI",
    valueType: "none",
    syntax: ["SPISWAPDATA x,y[,z1[,z2[,z3...]]]"],
    summary:
      "Simultaneous SPI send and receive through one buffer, y words long.",
    snippet: "SPISWAPDATA ${1:buffer},${2:count}",
  },
];
