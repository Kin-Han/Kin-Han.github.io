// 音频重编码：MP3 -> 128kbps MP3（解码用 mpg123 WASM，编码用 @breezystack/lamejs）
import { MPEGDecoder } from 'mpg123-decoder';
import fs from 'fs';
import path from 'path';

const lamejs = await import('@breezystack/lamejs');

function mb(n) { return (n / 1048576).toFixed(1) + ' MB'; }

async function convert(inPath, outPath) {
  const buf = fs.readFileSync(inPath);
  const dec = new MPEGDecoder();
  await dec.ready;
  const { channelData, samplesDecoded, sampleRate } = dec.decode(new Uint8Array(buf));
  dec.free();
  const channels = channelData.length;

  const toI16 = (f32) => {
    const out = new Int16Array(f32.length);
    for (let i = 0; i < f32.length; i++) {
      out[i] = Math.max(-32768, Math.min(32767, Math.round(f32[i] * 32767)));
    }
    return out;
  };
  const left = toI16(channelData[0]);
  const right = channels > 1 ? toI16(channelData[1]) : null;

  const enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
  const block = 1152;
  const chunks = [];
  for (let i = 0; i < samplesDecoded; i += block) {
    const end = Math.min(i + block, samplesDecoded);
    const l = left.subarray(i, end);
    const r = right ? right.subarray(i, end) : undefined;
    const c = r ? enc.encodeBuffer(l, r) : enc.encodeBuffer(l);
    if (c.length) chunks.push(Buffer.from(c));
  }
  const last = enc.flush();
  if (last.length) chunks.push(Buffer.from(last));
  fs.writeFileSync(outPath, Buffer.concat(chunks));
  return { before: buf.length, after: fs.statSync(outPath).size, rate: sampleRate, channels };
}

const files = ['それでも歩いてる.mp3', '世末歌者.mp3'];
const dir = 'D:/myblog/source/audio/';
for (const f of files) {
  const src = path.join(dir, f);
  const tmp = path.join(dir, f.replace(/\.mp3$/, '.tmp.mp3'));
  const r = await convert(src, tmp);
  fs.renameSync(tmp, src);
  console.log('[' + f + '] ' + mb(r.before) + ' -> ' + mb(r.after) + '  (' + r.rate + 'Hz, ' + r.channels + 'ch, 128kbps)');
}
console.log('DONE');
