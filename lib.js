import iconv from 'iconv-lite'
import chardet from 'chardet'

// filetype-detection signatures
const signatures = {
  ole: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, 0x00],
  rtf: [0x7B, 0x5C, 0x72, 0x74, 0x66],
  word97: [0xdb, 0xa5, 0x00],
  write: [0x31, 0xBE, 0x00]
}

// header status flags
const header_flags = {
  dot: 0x0001,
  glossary: 0x0002,
  complex: 0x0004,
  pictures: 0x0008,
  encrypted: 0x100,
  read_only: 0x400,
  reserved: 0x800,
  extended_char: 0x1000
}

// main entry-point: convert string into plain text
export default function catdoc (string, offset) {
  offset = offset || 0

  // analyze_header
  // - RTF: parse
  // - Word: getheader, parse
  const detected_charset = chardet.detect(string)
  if (!detected_charset) throw new Error('Could not detect charset.')

  const format = analyze_header(string.substring(0, 9))
  if (!format) throw new Error('Could not detect document format.')

  // detect other meta-info
  const flags = getshort(string, 10)

  if (flags & header_flags.dot) {
    console.log('This is a template (DOT) file.')
  } else {
    console.log('This is a document (DOC) file.')
  }

  if (flags & header_flags.glossary) {
    console.log('This is a glossary file.')
  }

  if (flags & header_flags.complex) {
    console.log(`This was fast-saved ${(flags & 0xF0) >> 4} times. Some information is lost!`)
  }

  if (flags & header_flags.read_only) {
    console.log('File is meant to be read-only.')
  }

  if (flags & header_flags.reserved) {
    console.log('File is write-reserved')
  }

  if (flags & header_flags.extended_char) {
    console.log('File uses extended character set')
  }

  if (string.charCodeAt(18)) {
    console.log('This file was created on a Macintosh.')
  } else {
    console.log('This file was created on a Windows machine.')
  }

  if (flags & header_flags.encrypted) {
    throw new Error(`File is encrypted. Key is "${getlong(string, 14)}"`)
  }

  const charset = getshort(string, 20)
  if (charset && charset !== 256) {
    console.log(`Using charset: ${charset}.`)
  } else {
    console.log('Using default character set.')
  }

  const textstart = getlong(string, 24) + offset
  const textlen = getlong(string, 28) - textstart
  console.log(`Start: ${textstart}\nLength: ${textlen}`)

  console.log(detected_charset, format)
}

// read signature, and detect format
export function analyze_header (header) {
  for (let i in signatures) {
    for (let c in signatures[i]) {
      if (signatures[i][c] !== header.charCodeAt(c)) {
        continue
      }
      if (parseInt(c) === (signatures[i].length - 1)) {
        return i
      }
    }
  }
}

function getshort (buffer, offset) {
  return buffer.charCodeAt(offset) | (buffer.charCodeAt(offset + 1) << 8)
}

function getlong (buffer, offset) {
  return buffer.charCodeAt(offset) | (buffer.charCodeAt(offset + 1) << 8) | (buffer.charCodeAt(offset + 1) << 16) | (buffer.charCodeAt(offset + 3) << 24)
}

var getulong = getlong

// testing
var fs = require('fs')
var buffer = fs.readFileSync('test.doc')
console.log(catdoc(buffer.toString()))
