import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'uploads', 'assets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Minimal standard ZIP file builder in pure Node.js
function createZipBuffer(files) {
  // files is array of { filename: string, content: Buffer | string }
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  function crc32(buf) {
    let crc = ~0;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc ^ byte) & 1 ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return ~crc >>> 0;
  }

  for (const f of files) {
    const dataBuf = Buffer.isBuffer(f.content) ? f.content : Buffer.from(f.content, 'utf8');
    const nameBuf = Buffer.from(f.filename, 'utf8');
    const crc = crc32(dataBuf);
    const size = dataBuf.length;

    // Local file header (30 bytes + nameBuf.length + size)
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); // signature
    lh.writeUInt16LE(10, 4);         // version needed
    lh.writeUInt16LE(0, 6);          // flags
    lh.writeUInt16LE(0, 8);          // compression (0 = stored)
    lh.writeUInt16LE(0x4000, 10);    // mod time
    lh.writeUInt16LE(0x5421, 12);    // mod date
    lh.writeUInt32LE(crc, 14);       // crc32
    lh.writeUInt32LE(size, 18);      // compressed size
    lh.writeUInt32LE(size, 22);      // uncompressed size
    lh.writeUInt16LE(nameBuf.length, 26); // file name length
    lh.writeUInt16LE(0, 28);         // extra field length

    localHeaders.push(lh, nameBuf, dataBuf);

    // Central directory header (46 bytes + nameBuf.length)
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // signature
    cd.writeUInt16LE(20, 4);         // version made by
    cd.writeUInt16LE(10, 6);         // version needed
    cd.writeUInt16LE(0, 8);          // flags
    cd.writeUInt16LE(0, 10);         // compression
    cd.writeUInt16LE(0x4000, 12);    // mod time
    cd.writeUInt16LE(0x5421, 14);    // mod date
    cd.writeUInt32LE(crc, 16);       // crc32
    cd.writeUInt32LE(size, 20);      // compressed size
    cd.writeUInt32LE(size, 24);      // uncompressed size
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);         // extra field len
    cd.writeUInt16LE(0, 32);         // comment len
    cd.writeUInt16LE(0, 34);         // disk number start
    cd.writeUInt16LE(0, 36);         // internal attrs
    cd.writeUInt32LE(0x20, 38);      // external attrs
    cd.writeUInt32LE(offset, 42);    // offset of local header

    centralHeaders.push(cd, nameBuf);

    offset += 30 + nameBuf.length + size;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const b of centralHeaders) {
    centralDirSize += b.length;
  }

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4);          // disk num
  eocd.writeUInt16LE(0, 6);          // central dir disk
  eocd.writeUInt16LE(files.length, 8); // entries on disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20); // comment len

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

const packages = [
  {
    name: 'sunnyland_pixel_pack',
    title: 'SunnyLand 2D Pixel Adventure',
    creator: 'ansimuz',
    license: 'CC0 (Public Domain)',
  },
  {
    name: 'cyberpunk_brawler',
    title: 'Cyberpunk Street Brawler Spritesheet',
    creator: 'ansimuz',
    license: 'Standard Indie Commercial License',
  },
  {
    name: 'lowpoly_fantasy_dungeon',
    title: 'Low Poly Fantasy Dungeon 3D',
    creator: 'kenney_nl',
    license: 'Standard Indie Commercial License',
  },
  {
    name: 'retro_arcade_sfx',
    title: 'Retro 8-Bit Arcade SFX Collection',
    creator: 'kenney_nl',
    license: 'CC-BY (Attribution)',
  },
  {
    name: 'scifi_gui_hud',
    title: 'Medieval Sci-Fi GUI & HUD Kit',
    creator: 'craftpix',
    license: 'Standard Indie Commercial License',
  },
];

for (const pkg of packages) {
  const files = [
    {
      filename: 'README.md',
      content: `# ${pkg.title}\n\nCreator: ${pkg.creator}\nLicense: ${pkg.license}\nFormat: Standard Engine Package\n\nIncluded Files:\n- Sprites & Textures\n- Documentation & Integration Guide\n- Commercial License Agreement\n\nDownloaded from GameAsset Marketplace.`,
    },
    {
      filename: 'LICENSE.txt',
      content: `LICENSE AGREEMENT:\nPackage: ${pkg.title}\nLicense Type: ${pkg.license}\nAuthor: ${pkg.creator}\n\nYou are granted rights to use these assets in personal and commercial interactive game projects.\nRaw redistribution as an asset pack is prohibited.`,
    },
    {
      filename: 'manifest.json',
      content: JSON.stringify(
        {
          name: pkg.name,
          title: pkg.title,
          version: '1.2.0',
          creator: pkg.creator,
          license: pkg.license,
          verified: true,
          downloadDate: new Date().toISOString(),
        },
        null,
        2,
      ),
    },
    {
      filename: 'assets/sample_resource.txt',
      content: `Game Asset payload placeholder for ${pkg.title}. Fully verified and ready for project import.`,
    },
  ];

  const zipBuf = createZipBuffer(files);
  const outPath = path.join(targetDir, `${pkg.name}.zip`);
  fs.writeFileSync(outPath, zipBuf);
  console.log(`Created valid zip: ${outPath} (${zipBuf.length} bytes)`);
}
