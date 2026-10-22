// Offline only: originals are immutable local files; never uploads to Supabase or Vercel.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
const input = process.argv[2];
const originals = process.argv[3];
if (!input || !originals) throw Error('Usage: node scripts/generate-image-variants.mjs <originals.json> <original-directory>');
const manifest = {};
const output = path.resolve('public/optimized-recipes');
mkdirSync(output, { recursive: true });
const entries = JSON.parse(readFileSync(input, 'utf8'));
// Local heroes do not incur Storage egress, but can use the same free encoding pipeline.
for (const [url, file] of [
 ['/icons/icon-512.png', 'public/icons/icon-512.png'],
 ['/images/airfryer-hero.jpg', 'public/images/airfryer-hero.jpg'],
 ['https://receitas-do-que-ha.vercel.app/mesa-ingredientes.jpg', 'public/mesa-ingredientes.jpg'],
]) if (existsSync(file)) entries.push({ url, localFile: path.resolve(file), bytes: statSync(file).size });
let completed = 0;
for (const entry of entries) {
  const source = readFileSync(entry.localFile || path.join(originals, entry.file));
  const digest = createHash('sha256').update(source).digest('hex').slice(0, 16);
  const metadata = await sharp(source).metadata();
  const width = metadata.orientation && metadata.orientation >= 5 ? metadata.height : metadata.width;
  const sizes = [...new Set([480, 960, 1600].map(w => Math.min(w, width)))].sort((a, b) => a - b);
  const variants = [];
  for (const targetWidth of sizes) {
    const name = `${digest}-${targetWidth}w.webp`;
    const target = path.join(output, name);
    if (!existsSync(target)) await sharp(source).rotate().resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: targetWidth > 960 ? 88 : 86, effort: 6 }).toFile(target);
    const m = await sharp(target).metadata();
    variants.push({ src: `/optimized-recipes/${name}`, width: m.width, height: m.height, bytes: statSync(target).size });
  }
  manifest[entry.url] = { originalBytes: entry.bytes, variants };
  if (++completed % 10 === 0) console.log('Optimized', completed, 'of', entries.length);
}
mkdirSync('src/generated', { recursive: true });
writeFileSync('src/generated/imageVariants.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Generated variants for', completed, 'images; originals unchanged.');
