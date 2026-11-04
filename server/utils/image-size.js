/**
 * Read an image's pixel dimensions from its header, so blog images can carry
 * width and height and the page doesn't jump as they load. Covers the formats
 * the blog uses: PNG, GIF, JPEG and WebP. Returns null for anything else.
 */

import { readFileSync } from 'fs'
import path from 'path'

const cache = new Map()

export function getImageSize(src) {
  if (!src || !src.startsWith('/')) return null
  if (cache.has(src)) return cache.get(src)

  let size = null
  try {
    const buf = readFileSync(path.resolve(process.cwd(), 'public', '.' + src))
    size = readSize(buf)
  } catch {
    // Missing or unreadable file: render the image without dimensions.
  }
  cache.set(src, size)
  return size
}

function readSize(buf) {
  // PNG: IHDR width and height, big-endian, after the 8-byte signature.
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  }
  // GIF: logical screen width and height, little-endian.
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
  }
  // WebP: RIFF container with a VP8, VP8L or VP8X chunk.
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16)
    if (chunk === 'VP8 ') {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
    }
    if (chunk === 'VP8L') {
      const bits = buf.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
    if (chunk === 'VP8X') {
      return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 }
    }
    return null
  }
  // JPEG: walk the segments to the first start-of-frame marker.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null
      const marker = buf[i + 1]
      const isSOF = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
      if (isSOF) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) }
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }
  return null
}
