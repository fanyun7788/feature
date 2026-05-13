import React, { useState } from 'react';
import { KeyPair } from '@/types';
import { Eye, Copy, Check, ExternalLink, Key, Upload } from 'lucide-react';
import { Button } from '@/components/Empty';

interface DataDisplayProps {
  data: KeyPair[];
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importedKey, setImportedKey] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; address?: string; message: string } | null>(null);

  const copyAllData = () => {
    const text = data.map((item, index) => 
      `样本 ${index + 1}:\n私钥: ${item.privateKey}\n地址: ${item.address}\n公钥: ${item.publicKey}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImportKey = () => {
    if (!importedKey.trim()) {
      setVerificationResult({ success: false, message: '请输入私钥' });
      return;
    }

    const key = importedKey.trim();
    
    if (key.length !== 64) {
      setVerificationResult({ success: false, message: '私钥长度必须为64个十六进制字符' });
      return;
    }

    const matchingPair = data.find(item => item.privateKey === key);
    
    if (matchingPair) {
      setVerificationResult({
        success: true,
        address: matchingPair.address,
        message: '私钥验证成功！找到对应的地址。'
      });
    } else {
      setVerificationResult({
        success: false,
        message: '该私钥不在当前训练集中'
      });
    }
  };

  const openVerifySite = (address: string) => {
    window.open(`https://www.blockchain.com/explorer/search?search=${address}`, '_blank');
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          训练数据集 ({data.length} 条)
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImport(!showImport)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm py-2 px-3"
          >
            <Key className="w-4 h-4 mr-1" />
            导入验证
          </Button>
          <Button
            onClick={copyAllData}
            disabled={data.length === 0}
            className="bg-green-600 hover:bg-green-500 text-white text-sm py-2 px-3"
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? '已复制' : '一键复制'}
          </Button>
        </div>
      </div>
      
      {showImport && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
          <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            导入私钥验证地址
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              value={importedKey}
              onChange={(e) => setImportedKey(e.target.value)}
              placeholder="粘贴私钥（64位十六进制字符串）..."
              className="w-full bg-gray-900 border border-purple-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleImportKey}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                验证私钥
              </Button>
              <Button
                onClick={() => {
                  setImportedKey('');
                  setVerificationResult(null);
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white"
              >
                重置
              </Button>
            </div>
            
            {verificationResult && (
              <div className={`p-3 rounded-lg border ${
                verificationResult.success 
                  ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                  : 'bg-red-500/20 border-red-500/50 text-red-400'
              }`}>
                <div className="font-bold text-sm mb-1">{verificationResult.message}</div>
                {verificationResult.success && verificationResult.address && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">对应地址:</div>
                    <div className="font-mono text-xs break-all bg-gray-900/50 p-2 rounded">
                      {verificationResult.address}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          点击"生成数据"按钮创建训练样本
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {data.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-500">样本 #{index + 1}</div>
                <button
                  onClick={() => openVerifySite(item.address)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  在区块链浏览器查看
                </button>
              </div>
              
              <div className="space-y-3">
                {/* 私钥 */}
                <div>
                  <div className="text-xs text-purple-400 mb-1">私钥 (Private Key)</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded flex-1">
                      {item.privateKey}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.privateKey)}
                      className="text-purple-400 hover:text-purple-300 p-1"
                      title="复制私钥"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Legacy 地址 */}
                {item.legacy && (
                  <div>
                    <div className="text-xs text-yellow-400 mb-1">普通地址 (Legacy / 1开头)</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded flex-1">
                        {item.legacy}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.legacy!)}
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                        title="复制地址"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* SegWit Compatible */}
                {item.segwitCompatible && (
                  <div>
                    <div className="text-xs text-blue-400 mb-1">隔离见证兼容地址 (SegWit / 3开头)</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded flex-1">
                        {item.segwitCompatible}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.segwitCompatible!)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="复制地址"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* SegWit Native */}
                {item.segwitNative && (
                  <div>
                    <div className="text-xs text-cyan-400 mb-1">隔离见证原生地址 (SegWit Native / bc1q开头)</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded flex-1">
                        {item.segwitNative}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.segwitNative!)}
                        className="text-cyan-400 hover:text-cyan-300 p-1"
                        title="复制地址"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Taproot */}
                {item.taproot && (
                  <div>
                    <div className="text-xs text-green-400 mb-1">Taproot 地址 (bc1p开头)</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded flex-1">
                        {item.taproot}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.taproot!)}
                        className="text-green-400 hover:text-green-300 p-1"
                        title="复制地址"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 公钥 */}
                <div>
                  <div className="text-xs text-gray-400 mb-1">公钥 (Public Key)</div>
                  <div className="font-mono text-xs text-gray-400 break-all bg-gray-900/50 p-2 rounded">
                    {item.publicKey.slice(0, 64)}...
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {data.length > 10 && (
            <div className="text-center text-gray-500 text-sm py-4">
              还有 {data.length - 10} 条数据未显示...
            </div>
          )}
        </div>
      )}
    </div>
  );
};