// 一次性图片优化脚本：图库 PNG→WebP、favicon 缩到 64px、背景图转 WebP
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function mb(n) { return (n / 1048576).toFixed(1) + ' MB'; }
function kb(n) { return (n / 1024).toFixed(1) + ' KB'; }

(async () => {
  // 1) favicon.png → 64x64 PNG（先写临时文件再覆盖）
  const favSrc = 'D:/myblog/source/img/favicon.png';
  const favTmp = 'D:/myblog/source/img/favicon.tmp.png';
  const favBefore = fs.statSync(favSrc).size;
  await sharp(favSrc).resize(64, 64, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(favTmp);
  fs.renameSync(favTmp, favSrc);
  console.log('[favicon] ' + kb(favBefore) + ' -> ' + kb(fs.statSync(favSrc).size));

  // 3) bg.png → bg.webp (宽 1920，q82)
  const bgSrc = 'D:/myblog/source/img/bg.png';
  const bgBefore = fs.statSync(bgSrc).size;
  await sharp(bgSrc).resize(1920, null, { withoutEnlargement: true }).webp({ quality: 82 }).toFile('D:/myblog/source/img/bg.webp');
  console.log('[bg.png] ' + kb(bgBefore) + ' -> ' + kb(fs.statSync('D:/myblog/source/img/bg.webp').size));

  // 4) global-bg.jpg → global-bg.webp (q80)
  const gbSrc = 'D:/myblog/source/img/global-bg.jpg';
  const gbBefore = fs.statSync(gbSrc).size;
  await sharp(gbSrc).webp({ quality: 80 }).toFile('D:/myblog/source/img/global-bg.webp');
  console.log('[global-bg] ' + kb(gbBefore) + ' -> ' + kb(fs.statSync('D:/myblog/source/img/global-bg.webp').size));

  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
