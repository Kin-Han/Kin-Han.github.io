// ============================================================
// 图片一键转换脚本：PNG/JPG 等 -> WebP（压缩后供博客使用）
//
// 用法（在 D:\myblog 下运行）：
//   node tools/convert-images.mjs                      # 转换 _inbox 里的图 -> source/img（质量80）
//   node tools/convert-images.mjs _inbox source/img\gallery   # 转换到图库目录
//   node tools/convert-images.mjs _inbox source/img 85  # 自定义质量(1-100)
//
// 说明：
//   - 已存在的同名 .webp 会跳过，不会覆盖
//   - 原图保留在 _inbox 里不动，转完可自行移动/删除
// ============================================================
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const [, , inArg = '_inbox', outArg = 'source/img', qArg = '80'] = process.argv;
const inDir = path.resolve(inArg);
const outDir = path.resolve(outArg);
const quality = Math.max(1, Math.min(100, parseInt(qArg, 10) || 80));

if (!fs.existsSync(inDir)) {
  console.error('找不到输入目录：' + inDir);
  console.error('请先创建该文件夹并把图片放进去，再重新运行。');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const exts = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'];
const files = fs.readdirSync(inDir)
  .filter(f => exts.includes(path.extname(f).toLowerCase()))
  .sort();

if (files.length === 0) {
  console.log('输入目录里没有图片（支持 png/jpg/jpeg/webp/bmp/tiff）。');
  process.exit(0);
}

let totalIn = 0, totalOut = 0, converted = 0, skipped = 0;
for (const f of files) {
  const src = path.join(inDir, f);
  const outName = path.basename(f, path.extname(f)) + '.webp';
  const out = path.join(outDir, outName);
  if (fs.existsSync(out)) {
    console.log('跳过(已存在同名): ' + outName);
    skipped++;
    continue;
  }
  const before = fs.statSync(src).size;
  await sharp(src).webp({ quality }).toFile(out);
  const after = fs.statSync(out).size;
  totalIn += before; totalOut += after; converted++;
  console.log('转换: ' + f + ' -> ' + outName +
    '  (' + (before / 1024).toFixed(0) + 'KB -> ' + (after / 1024).toFixed(0) + 'KB, ' + Math.round(after / before * 100) + '%)');
}

console.log('----------------------------------------');
console.log(`完成：转换 ${converted} 张，跳过 ${skipped} 张`);
console.log(`体积：${(totalIn / 1048576).toFixed(1)} MB -> ${(totalOut / 1048576).toFixed(1)} MB`);
console.log('输出目录：' + outDir);
console.log('下一步：在文章/图库页面里引用 /img/文件名.webp 即可。');
