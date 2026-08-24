export type RiskLevel = 'LOW' | 'MEDIUM' | 'MED-HIGH' | 'HIGH' | 'CRITICAL';

export type AcquisitionStatus = 'ACQUIRED' | 'SURVEYED' | 'NOTIFIED' | 'DISPUTED' | 'PENDING';

export interface ShapFactor {
  driver: string;
  vector: 'up' | 'down';
  impact: number;
}

export interface DirectiveItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface MilestoneEntry {
  timestamp: string;
  entryType: string;
  description: string;
  refNo: string;
  tagType?: 'JUDICIAL STAY' | 'PUBLIC_HEARING' | 'SURVEY_UPDATE' | 'INITIAL_FILING' | string;
}

export interface RiskFactorDetail {
  factor: string;
  score: number;
  level: 'critical' | 'warning' | 'low';
  description: string;
}

export interface ProjectData {
  id: string;
  title: string;
  district: string;
  state: string;
  landType: string;
  acquisitionStage: string;
  riskScore: number;
  riskLevel: RiskLevel;
  hectares: number;
  affectedFamilies: number;
  projectAgeMonths: number;
  plannedDurationMonths: number;
  lat: string;
  lon: string;
  surveyorId: string;
  entryDate: string;
  lastSync: string;
  probabilityOfDelay: string;
  delayPredictionText: string;
  likelihoodPercent: number;
  phase: string;
  locationDetails: string;
  
  compensationStatus?: string;
  compDisbursedPercent?: number;
  rehabProgressPercent?: number;
  approvalStage?: string;
  legalDisputeStatus?: string;
  legalDisputesCount?: number;
  possessionStatus?: string;
  daysSinceNotification?: number;
  coordinationIssues?: string;
  historicalDistrictDelayRate?: number;
  stakeholderResponsiveness?: number;

  lifecyclePipeline: {
    approval: boolean;
    compensation: boolean;
    rrActive: boolean;
    legal: boolean;
    possession: boolean;
  };
  shapFactors: ShapFactor[];
  directives: DirectiveItem[];
  milestones: MilestoneEntry[];
  riskPredictionBreakdown: RiskFactorDetail[];
}

export interface ParcelRecord {
  id: string;
  owner: string;
  deedRef: string;
  cadastralRef: string;
  geoCoords: string;
  status: AcquisitionStatus;
}

export interface NationalStats {
  totalProjectsActive: number;
  hectaresUnderSurvey: number;
  criticalRiskZones: number;
  pendingRegistrations: number;
  lastSync: string;
}

export type ViewTab = 'dashboard' | 'projects' | 'analysis' | 'registry' | 'archive';
