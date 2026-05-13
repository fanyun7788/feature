## 1. Architecture Design
```mermaid
graph TB
    subgraph Frontend
        A[React应用] --> B[主页面组件]
        A --> C[训练可视化组件]
        A --> D[数据展示组件]
        A --> E[模型交互组件]
        C --> F[Chart.js 图表库]
    end
    subgraph CoreLogic
        G[私钥生成逻辑]
        H[地址生成逻辑]
        I[模拟训练逻辑]
        J[状态管理 - Zustand]
    end
    B --> G
    B --> H
    C --> I
    D --> G
    D --> H
    E --> I
    J --> A
```

## 2. Technology Description
- Frontend: React@18 + TypeScript + tailwindcss@3 + vite
- Initialization Tool: vite-init
- Backend: 无后端（纯前端应用）
- Database: 无
- 图表库: Chart.js
- 状态管理: Zustand
- 加密库: crypto-js (用于模拟加密过程)

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 主页面，包含所有功能模块 |

## 4. API Definitions (if backend exists)
本项目为纯前端应用，无需后端API

## 5. Server Architecture Diagram (if backend exists)
不适用

## 6. Data Model (if applicable)
### 6.1 Data Model Definition
```mermaid
classDiagram
    class TrainingMetrics {
        +number epoch
        +number loss
        +number accuracy
        +number learningRate
        +number timestamp
    }
    class KeyPair {
        +string privateKey
        +string publicKey
        +string address
    }
    class TrainingState {
        +boolean isTraining
        +number currentEpoch
        +number totalEpochs
        +TrainingMetrics[] metrics
        +KeyPair[] trainingData
    }
```

### 6.2 Data Definition Language
不适用（纯前端应用，无数据库）
