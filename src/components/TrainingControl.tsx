import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Database } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/Empty';

export const TrainingControl: React.FC = () => {
  const { 
    isTraining, 
    startTraining, 
    stopTraining, 
    resetTraining, 
    generateTrainingData,
    currentEpoch,
    totalEpochs
  } = useAppStore();
  
  const [epochs, setEpochs] = useState(100);
  const [dataCount, setDataCount] = useState(100);

  const handleStart = () => {
    startTraining(epochs);
  };

  const progress = totalEpochs > 0 ? (currentEpoch / totalEpochs) * 100 : 0;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
        训练控制面板
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">训练轮数 (Epochs)</label>
            <input
              type="number"
              min="10"
              max="500"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value) || 100)}
              disabled={isTraining}
              className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">训练数据量</label>
            <input
              type="number"
              min="10"
              max="200"
              value={dataCount}
              onChange={(e) => setDataCount(parseInt(e.target.value) || 50)}
              disabled={isTraining}
              className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>进度: {currentEpoch} / {totalEpochs}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => generateTrainingData(dataCount)}
            disabled={isTraining}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
          >
            <Database className="w-4 h-4 mr-2" />
            生成数据
          </Button>
          
          {!isTraining ? (
            <Button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              开始训练
            </Button>
          ) : (
            <Button
              onClick={stopTraining}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white"
            >
              <Pause className="w-4 h-4 mr-2" />
              暂停训练
            </Button>
          )}
          
          <Button
            onClick={resetTraining}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>
      </div>
    </div>
  );
};
