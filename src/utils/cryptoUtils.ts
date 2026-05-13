import CryptoJS from 'crypto-js';
import { KeyPair } from '@/types';

export function generateRandomPrivateKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function privateKeyToPublicKey(privateKey: string): string {
  const hash = CryptoJS.SHA256(privateKey).toString();
  return '04' + hash + hash.slice(0, 32);
}

export function publicKeyToAddress(publicKey: string): string {
  const sha256Hash = CryptoJS.SHA256(publicKey).toString();
  const ripemd160Hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(sha256Hash)).toString();
  const versionedHash = '00' + ripemd160Hash;
  const checksum = CryptoJS.SHA256(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(versionedHash))).toString().slice(0, 8);
  const binaryHash = versionedHash + checksum;
  return base58Encode(binaryHash);
}

function base58Encode(hex: string): string {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt('0x' + hex);
  let result = '';
  
  while (num > 0n) {
    const remainder = num % 58n;
    result = alphabet[Number(remainder)] + result;
    num = num / 58n;
  }
  
  for (let i = 0; i < hex.length && hex[i] === '0'; i += 2) {
    result = '1' + result;
  }
  
  return result || '1';
}

export function generateKeyPair(): KeyPair {
  const privateKey = generateRandomPrivateKey();
  const publicKey = privateKeyToPublicKey(privateKey);
  const address = publicKeyToAddress(publicKey);
  return { privateKey, publicKey, address };
}

export function generateBatchKeyPairs(count: number): KeyPair[] {
  const pairs: KeyPair[] = [];
  for (let i = 0; i < count; i++) {
    pairs.push(generateKeyPair());
  }
  return pairs;
}
