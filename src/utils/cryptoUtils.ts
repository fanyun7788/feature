import { KeyPair } from '@/types';

function simpleSHA256(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export function generateRandomPrivateKey(): string {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * 16));
  }
  return result;
}

export function privateKeyToPublicKey(privateKey: string): string {
  const hash1 = simpleSHA256(privateKey);
  const hash2 = simpleSHA256(hash1);
  return '04' + hash1 + hash2.slice(0, 32);
}

export function publicKeyToAddress(publicKey: string): string {
  const sha256Hash = simpleSHA256(publicKey);
  const ripemd160Hash = simpleSHA256(sha256Hash).slice(0, 40);
  const versionedHash = '00' + ripemd160Hash;
  const checksum = simpleSHA256(simpleSHA256(versionedHash)).slice(0, 8);
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
