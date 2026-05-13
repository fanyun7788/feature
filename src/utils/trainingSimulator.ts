import { TrainingMetrics, KeyPair } from '@/types';

export class TrainingSimulator {
  private totalEpochs: number;
  private currentEpoch: number = 0;
  private metrics: TrainingMetrics[] = [];
  private isTraining: boolean = false;

  constructor(totalEpochs: number = 100) {
    this.totalEpochs = totalEpochs;
  }

  public startTraining(): void {
    this.isTraining = true;
    this.currentEpoch = 0;
    this.metrics = [];
  }

  public getNextEpoch(): TrainingMetrics | null {
    if (this.currentEpoch >= this.totalEpochs || !this.isTraining) {
      this.isTraining = false;
      return null;
    }

    this.currentEpoch++;
    
    const initialLoss = 1.0;
    const decayRate = 0.05;
    const loss = initialLoss * Math.exp(-decayRate * this.currentEpoch) + Math.random() * 0.1;
    
    const accuracy = Math.min(0.99, 0.1 + 0.8 * (1 - Math.exp(-decayRate * this.currentEpoch)) + Math.random() * 0.05);
    
    const learningRate = 0.01 * Math.exp(-0.02 * this.currentEpoch);

    const metric: TrainingMetrics = {
      epoch: this.currentEpoch,
      loss: Math.max(0.001, loss),
      accuracy: accuracy,
      learningRate: learningRate,
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    return metric;
  }

  public getMetrics(): TrainingMetrics[] {
    return [...this.metrics];
  }

  public getCurrentEpoch(): number {
    return this.currentEpoch;
  }

  public getTotalEpochs(): number {
    return this.totalEpochs;
  }

  public getIsTraining(): boolean {
    return this.isTraining;
  }

  public stopTraining(): void {
    this.isTraining = false;
  }

  public reset(): void {
    this.isTraining = false;
    this.currentEpoch = 0;
    this.metrics = [];
  }

  public predictPrivateKey(address: string, trainingData: KeyPair[]): string {
    const bestMatch = trainingData.find(data => data.address.slice(0, 5) === address.slice(0, 5));
    if (bestMatch) {
      return bestMatch.privateKey.slice(0, 32) + '... (预测结果仅供演示)';
    }
    
    const fakeKey = Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    return fakeKey + ' (注意: 实际中无法从地址反推私钥!)';
  }
}
