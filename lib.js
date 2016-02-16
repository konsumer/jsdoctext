/**
 * Convert word to plain text
 * @param  {String} string Inputted word binary text
 * @return {String}        Outputted text
 */
export default function catdoc (string) {
  var tab_mode = 0
  var hyperlink_mode = 0
  var buffer = []
  for (let s in string) {
    const c = string.charCodeAt(s)
    if (tab_mode) {
      tab_mode = 0
      if (c === 0x007) {
        buffer.push(0x1E)
        continue
      } else {
        buffer.push(0x1C)
      }
    }

    if (c < 32) {
      switch (c) {
        case 0x07:
          tab_mode = 1
          break
        case 0x0D:
        case 0x0B:
          buffer.push(0x0A)
          break
        case 0x02:
          break
        case 0x1F:
          buffer.push(0xAD)
          /* translate to Unicode soft hyphen */
          break
        case 0x0C:
        case 0x09:
          buffer.push(c)
          break
        case 0x13:
          hyperlink_mode = 1
          buffer.push(0x20)
          break
        case 0x14:
          hyperlink_mode = 0
          /* fall through */
        case 0x1E:
        case 0x15:
          /* just treat hyperlink separators as space */
          buffer.push(0x20)
          break
        case 0x01:
          if (hyperlink_mode) {
            break
          }
      }
    }
  }
  return buffer.map(c => { return String.fromCharCode(c) }).join('')
}
