import { KeyPair } from '@/types';
import CryptoJS from 'crypto-js';

/**
 * 生成比特币私钥
 * 32字节的随机数（64个十六进制字符）
 */
export function generateRandomPrivateKey(): string {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * 16));
  }
  return result;
}

/**
 * 将十六进制字符串转换为字节数组
 */
function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

/**
 * 将字节数组转换为十六进制字符串
 */
function bytesToHex(bytes: number[]): string {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 哈希
 */
function sha256(data: string | number[]): string {
  let dataStr: string;
  if (Array.isArray(data)) {
    dataStr = bytesToHex(data);
  } else {
    dataStr = data;
  }
  
  const wordArray = CryptoJS.enc.Hex.parse(dataStr);
  const hash = CryptoJS.SHA256(wordArray);
  return hash.toString(CryptoJS.enc.Hex);
}

/**
 * RIPEMD-160 哈希
 */
function ripemd160(data: string): string {
  const wordArray = CryptoJS.enc.Hex.parse(data);
  const hash = CryptoJS.RIPEMD160(wordArray);
  return hash.toString(CryptoJS.enc.Hex);
}

/**
 * 模拟椭圆曲线公钥生成（简化版）
 * 真实的比特币使用 secp256k1 曲线，这里用一个确定性的模拟方法
 */
export function privateKeyToPublicKey(privateKey: string): string {
  // 模拟公钥生成：04 + x坐标 + y坐标 (未压缩格式)
  // 真实的比特币公钥是 65字节（33字节压缩或65字节未压缩）
  const x = sha256(privateKey + 'x');
  const y = sha256(privateKey + 'y');
  return '04' + x + y.slice(0, 32);
}

/**
 * 将公钥转换为比特币地址
 * 完整的比特币地址生成流程
 */
export function publicKeyToAddress(publicKey: string): string {
  // 步骤1：SHA-256 哈希公钥
  const sha256Hash = sha256(publicKey);
  
  // 步骤2：RIPEMD-160 哈希
  const ripemd160Hash = ripemd160(sha256Hash);
  
  // 步骤3：添加版本字节 (0x00 = 比特币主网)
  const versionedHash = '00' + ripemd160Hash;
  
  // 步骤4：双重SHA-256 哈希计算校验和
  const doubleSHA = sha256(sha256(versionedHash));
  
  // 步骤5：取前4个字节作为校验和
  const checksum = doubleSHA.slice(0, 8);
  
  // 步骤6：拼接版本+哈希+校验和
  const binaryHash = versionedHash + checksum;
  
  // 步骤7：Base58编码
  return base58Encode(binaryHash);
}

/**
 * Base58 编码（比特币格式）
 */
function base58Encode(hex: string): string {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt('0x' + hex);
  let result = '';
  
  while (num > 0n) {
    const remainder = num % 58n;
    result = alphabet[Number(remainder)] + result;
    num = num / 58n;
  }
  
  // 处理前导零
  for (let i = 0; i < hex.length && hex[i] === '0'; i += 2) {
    result = '1' + result;
  }
  
  return result || '1';
}

/**
 * 生成完整的密钥对
 */
export function generateKeyPair(): KeyPair {
  const privateKey = generateRandomPrivateKey();
  const publicKey = privateKeyToPublicKey(privateKey);
  const address = publicKeyToAddress(publicKey);
  return { privateKey, publicKey, address };
}

/**
 * 批量生成密钥对
 */
export function generateBatchKeyPairs(count: number): KeyPair[] {
  const pairs: KeyPair[] = [];
  for (let i = 0; i < count; i++) {
    pairs.push(generateKeyPair());
  }
  return pairs;
}