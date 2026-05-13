export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  learningRate: number;
  timestamp: number;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  address: string;
}

export interface TrainingState {
  isTraining: boolean;
  currentEpoch: number;
  totalEpochs: number;
  metrics: TrainingMetrics[];
  trainingData: KeyPair[];
  modelTrained: boolean;
}
