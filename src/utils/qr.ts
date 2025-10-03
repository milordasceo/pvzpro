import CryptoJS from 'crypto-js';
import { APP_CONFIG } from '../config/app';

export interface ParsedQr {
  kind: 'signed';
  pvzId: string;
  exp: number; // epoch seconds
  mac: string; // hex
}

const QR_PREFIX = 'wb';

export const createQrPayload = (
  pvzId: string,
  exp: number,
  secret: string = APP_CONFIG.QR.SECRET,
): string => {
  const mac = computeMac(`${pvzId}:${exp}`, secret);
  return `${QR_PREFIX}:${pvzId}:${exp}:${mac}`;
};

export const parseQrPayload = (data: string): ParsedQr | null => {
  if (!data || typeof data !== 'string') return null;
  if (!data.startsWith(`${QR_PREFIX}:`)) return null;

  const parts = data.split(':');
  if (parts.length !== 4) return null;

  const [, pvzId, expStr, mac] = parts;
  const exp = Number(expStr);

  if (!pvzId || !Number.isFinite(exp) || !mac || mac.length < 16) return null;

  return { kind: 'signed', pvzId, exp, mac };
};

export const isExpired = (exp: number, nowEpochSec: number = Math.floor(Date.now() / 1000)) =>
  nowEpochSec > exp;

export const computeMac = (message: string, secret: string = APP_CONFIG.QR.SECRET): string => {
  return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
};

export const verifyMac = (
  message: string,
  mac: string,
  secret: string = APP_CONFIG.QR.SECRET,
): boolean => {
  const expected = computeMac(message, secret);
  return expected === mac;
};

export const verifyParsedQr = (
  parsed: ParsedQr,
  secret: string = APP_CONFIG.QR.SECRET,
): boolean => {
  const message = `${parsed.pvzId}:${parsed.exp}`;
  return verifyMac(message, parsed.mac, secret);
};
