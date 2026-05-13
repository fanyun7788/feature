import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrainingMetrics } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrainingChartProps {
  metrics: TrainingMetrics[];
}

export const TrainingChart: React.FC<TrainingChartProps> = ({ metrics }) => {
  const data = {
    labels: metrics.map(m => `Epoch ${m.epoch}`),
    datasets: [
      {
        label: 'Loss',
        data: metrics.map(m => m.loss),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Accuracy',
        data: metrics.map(m => m.accuracy * 100),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 10
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Loss',
          color: '#9ca3af'
        },
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: '#9ca3af'
        },
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          drawOnChartArea: false
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">训练指标</h3>
      {metrics.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          开始训练后将显示图表数据
        </div>
      ) : (
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
};
