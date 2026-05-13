import React, { useEffect } from 'react';
import { Activity, TrendingDown, TrendingUp, Clock, Target, Zap, Award, CheckCircle } from 'lucide-react';
import { TrainingControl } from '@/components/TrainingControl';
import { MetricCard } from '@/components/MetricCard';
import { TrainingChart } from '@/components/TrainingChart';
import { DataDisplay } from '@/components/DataDisplay';
import { ModelInteraction } from '@/components/ModelInteraction';
import { ExplanationSection } from '@/components/ExplanationSection';
import { useAppStore } from '@/store';

export default function Home() {
  const { 
    isTraining, 
    currentEpoch, 
    totalEpochs, 
    metrics, 
    trainingData,
    addMetric,
    simulator,
    modelTrained,
    stopTraining
  } = useAppStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTraining && simulator) {
      interval = setInterval(() => {
        const metric = simulator.getNextEpoch();
        if (metric) {
          addMetric(metric);
        } else {
          stopTraining();
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, simulator, addMetric, stopTraining]);

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const finalAccuracy = latestMetric ? (latestMetric.accuracy * 100).toFixed(2) : '0.00';
  const finalLoss = latestMetric ? latestMetric.loss.toFixed(4) : '0.0000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium">区块链 AI 训练演示</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            私钥-地址
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              生成模型
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            模拟大模型学习从地址反推私钥的训练过程，深入理解区块链加密安全
          </p>
        </header>

        {isTraining && (
          <div className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h3 className="text-xl font-bold text-white">训练进行中...</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{currentEpoch}</div>
                <div className="text-sm text-gray-400">当前轮次</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${totalEpochs > 0 ? (currentEpoch / totalEpochs) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {latestMetric ? (latestMetric.accuracy * 100).toFixed(1) : '0.0'}%
                </div>
                <div className="text-sm text-gray-400">当前正确率</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">持续提升中</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {latestMetric ? latestMetric.loss.toFixed(4) : '0.0000'}
                </div>
                <div className="text-sm text-gray-400">损失值 (Loss)</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">正在下降</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {modelTrained && (
          <div className="mb-8 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">训练完成！</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-900/50 rounded-xl">
                <Award className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <div className="text-5xl font-bold text-green-400 mb-2">{finalAccuracy}%</div>
                <div className="text-lg text-gray-300">最终正确率</div>
                <div className="text-sm text-gray-500 mt-2">基于 {totalEpochs} 轮训练</div>
              </div>
              <div className="text-center p-6 bg-gray-900/50 rounded-xl">
                <Target className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <div className="text-5xl font-bold text-red-400 mb-2">{finalLoss}</div>
                <div className="text-lg text-gray-300">最终损失值</div>
                <div className="text-sm text-gray-500 mt-2">Loss 越低越好</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                💡 模型训练完成，现在可以使用"模型预测演示"功能测试地址到私钥的预测
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="当前轮次"
            value={`${currentEpoch} / ${totalEpochs}`}
            icon={<Clock className="w-6 h-6" />}
            color="bg-blue-500/20 text-blue-400"
          />
          <MetricCard
            title="损失值 (Loss)"
            value={latestMetric ? latestMetric.loss.toFixed(4) : '---'}
            icon={<TrendingDown className="w-6 h-6" />}
            trend="down"
            color="bg-red-500/20 text-red-400"
          />
          <MetricCard
            title="准确率 (Accuracy)"
            value={latestMetric ? `${(latestMetric.accuracy * 100).toFixed(2)}%` : '---'}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            color="bg-green-500/20 text-green-400"
          />
          <MetricCard
            title="训练状态"
            value={isTraining ? '训练中...' : (modelTrained ? '已完成' : '未开始')}
            icon={<Activity className="w-6 h-6" />}
            color="bg-cyan-500/20 text-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrainingControl />
          <TrainingChart metrics={metrics} />
        </div>

        <div className="mb-8">
          <ExplanationSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataDisplay data={trainingData} />
          <ModelInteraction />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            ⚠️ 此项目仅供教育演示使用，实际中无法从地址反推私钥
          </p>
          <p className="mt-2">
            区块链的安全基于数学难题，保障您的数字资产安全
          </p>
        </footer>
      </div>
    </div>
  );
}
