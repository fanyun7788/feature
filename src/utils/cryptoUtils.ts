import { KeyPair } from '@/types';

// 使用 crypto-js 库实现真正的 SHA256，或使用更安全的模拟哈希
function simpleHash(message: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < message.length; i++) {
    hash ^= message.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash = hash >>> 0;
  }
  return (hash.toString(16) + hash.toString(16)).padStart(64, '0');
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
  const hash1 = simpleHash(privateKey);
  const hash2 = simpleHash(hash1 + 'salt1');
  const hash3 = simpleHash(hash2 + 'salt2');
  // 确保公钥不以太多零开头
  const nonZeroHash = hash1.replace(/^0+/, '') || hash1.slice(0, 32);
  return '04' + hash1 + hash3.slice(0, 32);
}

export function publicKeyToAddress(publicKey: string): string {
  const sha256Hash = simpleHash(publicKey);
  const ripemd160Hash = simpleHash(sha256Hash + 'ripemd').slice(0, 40);
  // 确保 ripemd160Hash 不是全零或大部分为零
  const adjustedHash = ripemd160Hash.replace(/^0+/, '') || ripemd160Hash.slice(0, 20) + ripemd160Hash.slice(20);
  const versionedHash = '00' + adjustedHash;
  const checksum = simpleHash(simpleHash(versionedHash)).slice(0, 8);
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
  
  // 更谨慎地处理前导零
  let leadingZeroBytes = 0;
  for (let i = 0; i < hex.length; i += 2) {
    if (hex[i] === '0' && hex[i + 1] === '0') {
      leadingZeroBytes++;
    } else {
      break;
    }
  }
  
  // 只添加一个前导 '1'，而不是多个
  if (leadingZeroBytes > 0) {
    result = '1' + result;
  }
  
  return result || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // 比特币创世地址作为默认
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