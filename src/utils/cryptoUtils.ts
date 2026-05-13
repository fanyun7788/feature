import { KeyPair } from '@/types';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';

const ECPair = ECPairFactory(ecc);

/**
 * 将 hex 字符串转换为字节数组
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * 将字节数组转换为 hex 字符串
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成随机私钥
 */
export function generateRandomPrivateKey(): string {
  const keyPair = ECPair.makeRandom();
  const privateKeyBuffer = keyPair.privateKey;
  if (!privateKeyBuffer) {
    throw new Error('Failed to generate private key');
  }
  return bytesToHex(privateKeyBuffer);
}

/**
 * 从私钥生成所有类型的地址
 */
export function privateKeyToAddresses(privateKeyHex: string): {
  privateKey: string;
  publicKey: string;
  legacy: string;
  segwitCompatible: string;
  segwitNative: string;
  taproot: string;
} {
  try {
    // 从 hex 私钥创建密钥对
    const privateKeyBytes = hexToBytes(privateKeyHex);
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyBytes as any));
    
    const publicKey = bytesToHex(keyPair.publicKey);
    
    // Legacy 地址 (P2PKH) - 1开头
    const legacy = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address || '';
    
    // SegWit Compatible 地址 (P2WPKH-nested-in-P2SH) - 3开头
    const segwitCompatible = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
    }).address || '';
    
    // SegWit Native 地址 (P2WPKH) - bc1q开头
    const segwitNative = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }).address || '';
    
    // Taproot 地址 (P2TR) - bc1p开头
    let taproot = '';
    try {
      const p2tr = bitcoin.payments.p2tr({
        internalPubkey: keyPair.publicKey.slice(1, 33)
      });
      taproot = p2tr.address || '';
    } catch (e) {
      taproot = '';
    }
    
    return {
      privateKey: privateKeyHex,
      publicKey,
      legacy,
      segwitCompatible,
      segwitNative,
      taproot
    };
  } catch (error) {
    console.error('Error in privateKeyToAddresses:', error);
    return {
      privateKey: privateKeyHex,
      publicKey: '',
      legacy: '',
      segwitCompatible: '',
      segwitNative: '',
      taproot: ''
    };
  }
}

/**
 * 生成密钥对
 */
export function generateKeyPair(): KeyPair {
  const privateKey = generateRandomPrivateKey();
  const addresses = privateKeyToAddresses(privateKey);
  
  return {
    privateKey: addresses.privateKey,
    publicKey: addresses.publicKey,
    address: addresses.legacy, // 默认使用 Legacy 地址
    legacy: addresses.legacy,
    segwitCompatible: addresses.segwitCompatible,
    segwitNative: addresses.segwitNative,
    taproot: addresses.taproot
  };
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

// 保持旧的函数名称兼容性
export function privateKeyToPublicKey(privateKey: string): string {
  try {
    const privateKeyBytes = hexToBytes(privateKey);
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyBytes as any));
    return bytesToHex(keyPair.publicKey);
  } catch {
    return '';
  }
}

export function publicKeyToAddress(publicKey: string): string {
  try {
    const publicKeyBytes = hexToBytes(publicKey);
    return bitcoin.payments.p2pkh({ pubkey: Buffer.from(publicKeyBytes as any) }).address || '';
  } catch {
    return '';
  }
}