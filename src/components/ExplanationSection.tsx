import React from 'react';
import { BookOpen, Lock, Key, ArrowRight, ShieldAlert } from 'lucide-react';

export const ExplanationSection: React.FC = () => {
  const steps = [
    {
      icon: <Key className="w-6 h-6" />,
      title: '1. 生成私钥',
      description: '生成一个 256 位的随机数作为私钥，这是控制资产的唯一密钥'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: '2. 计算公钥',
      description: '使用椭圆曲线加密 (secp256k1) 从私钥计算出公钥'
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: '3. 哈希转换',
      description: '对公钥进行 SHA-256 和 RIPEMD-160 双重哈希'
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: '4. 生成地址',
      description: '添加版本字节和校验和，最后用 Base58 编码生成最终地址'
    }
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        私钥-地址生成原理
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
          >
            <div className="text-cyan-400 mb-3">
              {step.icon}
            </div>
            <h4 className="text-white font-semibold mb-2">{step.title}</h4>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30">
        <h4 className="text-purple-300 font-semibold mb-2">单向加密特性</h4>
        <p className="text-gray-400 text-sm">
          从私钥到地址的过程是单向的，这意味着可以轻松地从私钥推导出地址，
          但从地址几乎不可能反推出私钥。这是区块链安全的基础。
        </p>
      </div>
    </div>
  );
};
