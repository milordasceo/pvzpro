#!/usr/bin/env node
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

// env: QR_SECRET, default for demo
const SECRET = process.env.QR_SECRET || 'wb-demo-secret-change-me';

function computeMac(secret, pvzId, exp) {
  const mac = CryptoJS.HmacSHA256(`${pvzId}:${exp}`, secret);
  return CryptoJS.enc.Hex.stringify(mac);
}

function payload(pvzId, ttlSec) {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const mac = computeMac(SECRET, pvzId, exp);
  return { text: `wb:${pvzId}:${exp}:${mac}`, exp };
}

async function main() {
  const pvzId = process.argv[2] || 'pvz-dev';
  const ttl = Number(process.argv[3] || 180);
  const { text, exp } = payload(pvzId, ttl);
  console.log('Payload:', text);
  console.log('Expires at (epoch):', exp);
  const svg = await QRCode.toString(text, { type: 'svg', width: 256, margin: 1 });
  console.log('\n--- SVG ---');
  console.log(svg);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


