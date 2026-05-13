import { create } from 'zustand';
import { TrainingState, TrainingMetrics, KeyPair } from '@/types';
import { TrainingSimulator } from '@/utils/trainingSimulator';
import { generateBatchKeyPairs } from '@/utils/cryptoUtils';

interface AppState extends TrainingState {
  simulator: TrainingSimulator;
  startTraining: (epochs?: number) => void;
  stopTraining: () => void;
  resetTraining: () => void;
  addMetric: (metric: TrainingMetrics) => void;
  setTrainingData: (data: KeyPair[]) => void;
  generateTrainingData: (count?: number) => void;
  predictPrivateKey: (address: string) => string;
}

export const useAppStore = create<AppState>((set, get) => {
  const initialSimulator = new TrainingSimulator(100);
  
  return {
    isTraining: false,
    currentEpoch: 0,
    totalEpochs: 100,
    metrics: [],
    trainingData: [],
    modelTrained: false,
    simulator: initialSimulator,
    
    startTraining: (epochs = 100) => {
      const newSimulator = new TrainingSimulator(epochs);
      newSimulator.startTraining();
      
      set({
        simulator: newSimulator,
        isTraining: true,
        currentEpoch: 0,
        totalEpochs: epochs,
        metrics: [],
        modelTrained: false
      });
    },
    
    stopTraining: () => {
      const state = get();
      state.simulator.stopTraining();
      set({ isTraining: false });
    },
    
    resetTraining: () => {
      const state = get();
      state.simulator.reset();
      set({
        isTraining: false,
        currentEpoch: 0,
        metrics: [],
        modelTrained: false
      });
    },
    
    addMetric: (metric: TrainingMetrics) => {
      set((state) => ({
        metrics: [...state.metrics, metric],
        currentEpoch: metric.epoch,
        modelTrained: metric.epoch >= state.totalEpochs
      }));
    },
    
    setTrainingData: (data: KeyPair[]) => {
      set({ trainingData: data });
    },
    
    generateTrainingData: (count = 50) => {
      const data = generateBatchKeyPairs(count);
      set({ trainingData: data });
    },
    
    predictPrivateKey: (address: string) => {
      const state = get();
      return state.simulator.predictPrivateKey(address, state.trainingData);
    }
  };
});
