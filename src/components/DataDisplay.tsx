import React from 'react';
import { KeyPair } from '@/types';
import { Eye } from 'lucide-react';

interface DataDisplayProps {
  data: KeyPair[];
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ data }) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5" />
        训练数据集 ({data.length} 条)
      </h3>
      
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
              <div className="text-xs text-gray-500 mb-2">样本 #{index + 1}</div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-cyan-400 mb-1">地址 (Address)</div>
                  <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded">
                    {item.address}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-purple-400 mb-1">私钥 (Private Key)</div>
                  <div className="font-mono text-sm text-gray-300 break-all bg-gray-900/50 p-2 rounded">
                    {item.privateKey}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-green-400 mb-1">公钥 (Public Key)</div>
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
