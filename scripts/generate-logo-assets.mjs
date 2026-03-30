// Genera logo-symbol-400.png e favicon.ico dal simbolo M SVG
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

// SVG del simbolo M con sfondo arancione e M bianca (per social 400x400)
const symbolSocialSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#f97316"/>
  <g transform="translate(60,60) scale(7)">
    <path d="M3,4 L11,4 L20,25 L29,4 L37,4 L37,36 L29,36 L29,13 L22,31 L18,31 L11,13 L11,36 L3,36 Z" fill="#ffffff"/>
  </g>
</svg>`;

// SVG del simbolo per favicon 32x32 (sfondo arancione, M bianca)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#f97316" rx="4"/>
  <g transform="translate(2,2) scale(0.7)">
    <path d="M3,4 L11,4 L20,25 L29,4 L37,4 L37,36 L29,36 L29,13 L22,31 L18,31 L11,13 L11,36 L3,36 Z" fill="#ffffff"/>
  </g>
</svg>`;

// Genera logo-symbol-400.png
const png400 = await sharp(Buffer.from(symbolSocialSvg))
  .png()
  .toBuffer();
writeFileSync(`${publicDir}/logo-symbol-400.png`, png400);
console.log('✓ logo-symbol-400.png generato (400x400)');

// Genera favicon.ico (32x32 PNG wrapped in ICO container)
const png32 = await sharp(Buffer.from(faviconSvg))
  .resize(32, 32)
  .png()
  .toBuffer();

// ICO format: header + directory + PNG data
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);  // reserved
icoHeader.writeUInt16LE(1, 2);  // type: ICO
icoHeader.writeUInt16LE(1, 4);  // count: 1 image

const icoDir = Buffer.alloc(16);
icoDir.writeUInt8(32, 0);       // width
icoDir.writeUInt8(32, 1);       // height
icoDir.writeUInt8(0, 2);        // color count
icoDir.writeUInt8(0, 3);        // reserved
icoDir.writeUInt16LE(1, 4);     // color planes
icoDir.writeUInt16LE(32, 6);    // bits per pixel
icoDir.writeUInt32LE(png32.length, 8);  // image size
icoDir.writeUInt32LE(6 + 16, 12);       // image offset

const icoBuffer = Buffer.concat([icoHeader, icoDir, png32]);
writeFileSync(`${publicDir}/favicon.ico`, icoBuffer);
console.log('✓ favicon.ico generato (32x32)');
