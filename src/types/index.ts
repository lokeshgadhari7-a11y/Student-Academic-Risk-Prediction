export type StudentType = 'college';

export interface DatasetInfo {
  name: string;
  type: string;
  source: string;
  url: string;
  rows: number;
  columns: number;
  targetColumn: string;
  targetType: 'classification' | 'regression';
  targetDescription: string;
  missingValues: number;
  subject?: string;
  scale?: string;
  status: 'Ready' | 'Trained' | 'Custom Loaded';
}

export interface SchemaField {
  name: string;
  label: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'ordinal';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  options?: { value: any; label: string }[];
  description: string;
  category: 'academic' | 'personal' | 'social' | 'institutional';
}

export interface PredictionResult {
  studentType: 'college';
  modelUsed: string;
  predictionType: 'classification' | 'regression';
  predictedScore?: number; // e.g. 7.8 out of 10.0 CGPA
  scoreScale?: string;
  predictedClass?: string; // 'Grade 5: BB (Good)' or 'Grade 0: Fail (At-Risk)'
  riskLevel: 'Low' | 'Medium' | 'High';
  probability?: number;
  confidenceScore: number;
  atRisk: boolean;
  recommendations: string[];
  explanation: string;
  featureContributions: { feature: string; impact: number; direction: 'positive' | 'negative' }[];
  timestamp: string;
}

export interface ModelMetric {
  name: string;
  type: 'regression' | 'classification';
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;
  mae?: number;
  mse?: number;
  rmse?: number;
  r2?: number;
  trainingTimeMs: number;
  confusionMatrix?: number[][]; // [[TN, FP], [FN, TP]]
  classificationReport?: {
    [key: string]: { precision: number; recall: number; f1Score: number; support: number };
  };
  actualVsPredicted?: { actual: number; predicted: number }[];
  residuals?: { predicted: number; residual: number }[];
}

export interface DimensionReductionResult {
  method: 'PCA' | 'LDA';
  components: number;
  varianceExplained?: number[];
  totalVarianceExplained?: number;
  originalAccuracy: number;
  transformedAccuracy: number;
  trainingTimeChange: string;
  insights: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  category: string;
  description: string;
}


export interface LabMapping {
  labNo: string;
  title: string;
  curriculumTopic: string;
  projectImplementation: string;
}

export interface FeatureQualityMeta {
  name: string;
  label: string;
  isDummy: boolean;
  category: 'academic' | 'dummy_noise' | 'personal' | 'habit';
  reasonUnusual?: string;
  correlationWithTarget: number;
  variance: number;
  pcaWeightPC1: number;
  pcaWeightPC2: number;
  ldaCoefficient: number;
  removalRecommendation: 'Retain' | 'Drop via PCA / LDA' | 'Direct Prune';
}

export interface StudentProjectionPoint {
  id: string;
  cgpa: number;
  attendance: number;
  backlogs: number;
  grade: string;
  status: 'Safe' | 'Moderate Risk' | 'Severe Risk' | 'At-Risk';
  pc1: number;
  pc2: number;
  ld1: number;
  dummyNoiseScore: number;
}

export interface ReductionBenchmark {
  stage: string;
  name: string;
  description: string;
  featureCount: number;
  featuresRetained: string[];
  featuresRemoved: string[];
  accuracy: number;
  f1Score: number;
  noiseRetentionPct: number;
  inferenceSpeedup: string;
  variancePreservedPct: number;
}

export interface FeatureEngineeringMetric {
  featureSetId: 'raw' | 'filtered' | 'pca' | 'lda';
  featureSetName: string;
  technique: string;
  featureCount: number;
  featuresList: string[];
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  logLoss: number;
  crossValAccuracy: string;
  trainingTimeMs: number;
  inferenceSpeedup: string;
  confusionMatrix: number[][]; // [[TN, FP], [FN, TP]]
  classificationReport: {
    [key: string]: { precision: number; recall: number; f1Score: number; support: number };
  };
  keyTakeaway: string;
}
