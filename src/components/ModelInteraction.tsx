import React, { useState } from 'react';
import { Brain, Send } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/Empty';

export const ModelInteraction: React.FC = () => {
  const { predictPrivateKey, modelTrained, trainingData } = useAppStore();
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handlePredict = () => {
    if (!address.trim()) return;
    const prediction = predictPrivateKey(address);
    setResult(prediction);
  };

  const useRandomAddress = () => {
    if (trainingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * trainingData.length);
      setAddress(trainingData[randomIndex].address);
      setResult(null);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        模型预测演示
      </h3>
      
      <div className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ <strong>重要提示:</strong> 这只是一个演示，实际中无法从地址反推私钥！
            区块链使用的是单向加密函数，保护您的资产安全。
          </p>
        </div>

        {!modelTrained && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-400 text-sm">
              ℹ️ 请先完成训练后再使用预测功能
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-gray-400">输入地址 (Address)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="输入区块链地址..."
              className="flex-1 bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <Button
              onClick={useRandomAddress}
              disabled={trainingData.length === 0}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              随机
            </Button>
          </div>
        </div>

        <Button
          onClick={handlePredict}
          disabled={!address.trim() || !modelTrained}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          预测私钥
        </Button>

        {result && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">预测结果:</div>
            <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-4">
              <div className="font-mono text-sm text-cyan-300 break-all">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
