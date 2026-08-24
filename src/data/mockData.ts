import { NationalStats, ParcelRecord, ProjectData } from '../types';

export const initialNationalStats: NationalStats = {
  totalProjectsActive: 1248,
  hectaresUnderSurvey: 84592,
  criticalRiskZones: 37,
  pendingRegistrations: 492,
  lastSync: '2023-10-27T08:45:00Z',
};

export const initialProjects: ProjectData[] = [
  {
    id: 'NHAI-DEL-MUM-2024-X9F',
    title: 'Greenfield Highway Expansion',
    district: 'Gurugram',
    state: 'Haryana',
    landType: 'Highway Infrastructure',
    acquisitionStage: 'SECTION 11 NOTIFICATION',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    hectares: 142.8,
    affectedFamilies: 340,
    projectAgeMonths: 18,
    plannedDurationMonths: 36,
    lat: '28.4595° N',
    lon: '77.0266° E',
    surveyorId: 'OP-992-G',
    entryDate: '2024.01.15',
    lastSync: '2024.05.24 14:32:00',
    probabilityOfDelay: '82%',
    delayPredictionText: '+180 days delay predicted',
    likelihoodPercent: 89.4,
    phase: 'Land Acquisition',
    locationDetails: 'Gurugram, Haryana • Greenfield Highway Expansion',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: true,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Unresolved Multi-heir Titles', vector: 'up', impact: 24.5 },
      { driver: 'Proximity to Urban Agglomeration', vector: 'up', impact: 18.2 },
      { driver: 'Previous Litigation History on Parcel', vector: 'up', impact: 12.0 },
      { driver: 'Community Consultation Record', vector: 'down', impact: -8.5 },
    ],
    directives: [
      {
        id: 'dir-1',
        title: 'Initiate Section 21 Special Hearing',
        description: 'Schedule targeted hearings for parcels with >3 listed heirs to preempt injunctions.',
        completed: false,
      },
      {
        id: 'dir-2',
        title: 'Deploy Gram Sabha Consensus Team',
        description: 'Focus on Sector 4 where community consultation scores are critically low.',
        completed: false,
      },
      {
        id: 'dir-3',
        title: 'Review Compensation Multiplier',
        description: 'Re-evaluate urban proximity modifier based on recent High Court ruling (Ref: HC-2023-99).',
        completed: false,
      },
    ],
    milestones: [
      { timestamp: '2024-03-10 11:30', entryType: 'SECTION_11_ISSUED', description: 'Official notification under Section 11 gazetted in district records.', refNo: 'SEC-11-99', tagType: 'GAZETTE' },
      { timestamp: '2024-02-01 09:00', entryType: 'OBJECTION_REGISTERED', description: 'Multi-heir title objection petition received from 12 landowners.', refNo: 'OBJ-442', tagType: 'JUDICIAL STAY' },
      { timestamp: '2024-01-15 14:00', entryType: 'INITIAL_FILING', description: 'Project scope and cadastral maps submitted to ADM registry.', refNo: 'IN-2024-X9F', tagType: 'INITIAL_FILING' }
    ],
    riskPredictionBreakdown: [
      { factor: 'MULTI-HEIR TITLE CONFLICT', score: 92, level: 'critical', description: 'High probability of court stay due to undivided heir rights.' },
      { factor: 'URBAN PROXIMITY INDEX', score: 78, level: 'warning', description: 'Inflated commercial land compensation claims.' },
      { factor: 'ENVIRONMENTAL CLEARANCE', score: 15, level: 'low', description: 'Non-forest land type, minimal clearance bottleneck.' }
    ]
  },
  {
    id: 'K-904-B',
    title: 'Gomti Riverside Development',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    landType: 'Commercial Recalibration / Flood Plain',
    acquisitionStage: 'Dispute Resolution',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    hectares: 14.2,
    affectedFamilies: 120,
    projectAgeMonths: 10,
    plannedDurationMonths: 24,
    lat: '28.6139° N',
    lon: '77.2090° E',
    surveyorId: 'OP-772-V',
    entryDate: '14.11.2023',
    lastSync: '2023-11-12 14:30:00',
    probabilityOfDelay: '88%',
    delayPredictionText: '+120 days delay predicted',
    likelihoodPercent: 88.0,
    phase: 'Dispute Resolution',
    locationDetails: 'ZONE: URBAN-FRINGE • SCALE: 1:5000',
    lifecyclePipeline: {
      approval: true,
      compensation: false,
      rrActive: true,
      legal: true,
      possession: false,
    },
    shapFactors: [
      { driver: 'Judicial Stay on Flood Plain Alteration', vector: 'up', impact: 32.1 },
      { driver: 'Public Protest & NGO Mobilization', vector: 'up', impact: 21.4 },
      { driver: 'Ecological Buffer Clearance', vector: 'up', impact: 15.0 },
      { driver: 'Survey Demarcation Verification', vector: 'down', impact: -6.2 },
    ],
    directives: [
      { id: 'k9-1', title: 'Engage State Legal Panel', description: 'Prepare counter-affidavit against High Court stay order regarding zoning.', completed: false },
      { id: 'k9-2', title: 'Commission Environmental Impact Assessment', description: 'Submit updated flood plain survey by independent accredited contractor.', completed: true }
    ],
    milestones: [
      { timestamp: '2023-11-12 14:30', entryType: 'JUDICIAL STAY', description: 'High Court order suspending zoning alteration pending environmental review.', refNo: 'HC-23-A9', tagType: 'JUDICIAL STAY' },
      { timestamp: '2023-10-05 09:15', entryType: 'SURVEY_UPDATE', description: 'Topographical reassessment submitted by independent contractor.', refNo: 'SV-88-B2', tagType: 'SURVEY_UPDATE' },
      { timestamp: '2023-08-22 11:00', entryType: 'PUBLIC_HEARING', description: 'Minutes filed from local municipal council review session.', refNo: 'PH-44-C1', tagType: 'PUBLIC_HEARING' },
      { timestamp: '2023-01-14 16:45', entryType: 'INITIAL_FILING', description: 'Original project demarcation proposal entered into registry.', refNo: 'IN-01-AA', tagType: 'INITIAL_FILING' },
    ],
    riskPredictionBreakdown: [
      { factor: 'JUDICIAL STAY PROBABILITY', score: 88, level: 'critical', description: 'High correlation with recent supreme court rulings on floodplain construction.' },
      { factor: 'PUBLIC PROTEST INDEX', score: 64, level: 'warning', description: 'Elevated sentiment analyzing local news and NGO activity in the region.' },
      { factor: 'BOUNDARY DISPUTE', score: 12, level: 'low', description: 'Adjacent parcels clearly demarcated; historical ledger aligns.' },
    ],
  },
  {
    id: 'PRJ-2023-09A',
    title: 'Northern Sector Z1',
    district: 'Northern Sector Z1',
    state: 'Punjab',
    landType: 'Agricultural (Class 2)',
    acquisitionStage: 'Preliminary Survey',
    riskScore: 12,
    riskLevel: 'LOW',
    hectares: 1250,
    affectedFamilies: 45,
    projectAgeMonths: 4,
    plannedDurationMonths: 18,
    lat: '30.7333° N',
    lon: '76.7794° E',
    surveyorId: 'OP-104-A',
    entryDate: '2023.09.10',
    lastSync: '2023-10-20 10:00:00',
    probabilityOfDelay: '10%',
    delayPredictionText: 'On Schedule',
    likelihoodPercent: 12.0,
    phase: 'Preliminary Survey',
    locationDetails: 'Sector Z1, Agricultural Zone',
    lifecyclePipeline: {
      approval: true,
      compensation: false,
      rrActive: false,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Clear Title Records', vector: 'down', impact: -14.2 },
      { driver: 'High Farmer Consensus', vector: 'down', impact: -10.5 },
    ],
    directives: [
      { id: 'dir-09a-1', title: 'Complete Drone Boundary Mapping', description: 'Finalize high-resolution aerial cadastral verification.', completed: true },
    ],
    milestones: [
      { timestamp: '2023-09-10 10:00', entryType: 'PRELIMINARY_SURVEY', description: 'Initial drone survey completed across 1250 hectares.', refNo: 'SV-09A-1', tagType: 'SURVEY_UPDATE' }
    ],
    riskPredictionBreakdown: [
      { factor: 'TITLE VERIFICATION', score: 12, level: 'low', description: 'Records match state revenue portal.' }
    ]
  },
  {
    id: 'PRJ-2023-14C',
    title: 'Eastern Delta Region',
    district: 'Eastern Delta Region',
    state: 'West Bengal',
    landType: 'Wetlands Buffer',
    acquisitionStage: 'Dispute Resolution',
    riskScore: 84,
    riskLevel: 'HIGH',
    hectares: 480,
    affectedFamilies: 210,
    projectAgeMonths: 14,
    plannedDurationMonths: 24,
    lat: '22.5726° N',
    lon: '88.3639° E',
    surveyorId: 'OP-412-W',
    entryDate: '2023.05.12',
    lastSync: '2023-10-25 16:20:00',
    probabilityOfDelay: '78%',
    delayPredictionText: '+90 days delay predicted',
    likelihoodPercent: 84.0,
    phase: 'Dispute Resolution',
    locationDetails: 'Eastern Delta Wetlands Zone',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: true,
      legal: true,
      possession: false,
    },
    shapFactors: [
      { driver: 'Wetland Protection Law Suit', vector: 'up', impact: 28.4 },
      { driver: 'Encroachment Verification Delay', vector: 'up', impact: 14.1 },
    ],
    directives: [
      { id: 'dir-14c-1', title: 'Environmental Advisory Consult', description: 'Appoint wetlands conservation panel to evaluate buffer zone.', completed: false },
    ],
    milestones: [
      { timestamp: '2023-08-14 11:00', entryType: 'ECOLOGICAL_NOTICE', description: 'Notice issued regarding buffer zone encroachment.', refNo: 'EC-14C', tagType: 'JUDICIAL STAY' }
    ],
    riskPredictionBreakdown: [
      { factor: 'ECOLOGICAL DISPUTE', score: 84, level: 'critical', description: 'Active petition in National Green Tribunal.' }
    ]
  },
  {
    id: 'PRJ-2023-42X',
    title: 'Urban Periphery S3',
    district: 'Urban Periphery S3',
    state: 'Maharashtra',
    landType: 'Mixed Use Commercial',
    acquisitionStage: 'Final Assessment',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    hectares: 95,
    affectedFamilies: 80,
    projectAgeMonths: 8,
    plannedDurationMonths: 18,
    lat: '19.0760° N',
    lon: '72.8777° E',
    surveyorId: 'OP-209-M',
    entryDate: '2023.07.01',
    lastSync: '2023-10-26 12:15:00',
    probabilityOfDelay: '42%',
    delayPredictionText: '+30 days delay predicted',
    likelihoodPercent: 45.0,
    phase: 'Final Assessment',
    locationDetails: 'S3 Periphery Ward',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: false,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Commercial Compensation Disputes', vector: 'up', impact: 12.3 },
      { driver: 'Strong Inter-Agency Alignment', vector: 'down', impact: -8.1 },
    ],
    directives: [
      { id: 'dir-42x-1', title: 'Finalize Commercial Rates', description: 'Publish updated circle rates for mixed-use plots.', completed: true }
    ],
    milestones: [
      { timestamp: '2023-09-01 10:30', entryType: 'VALUATION_REPORT', description: 'Commercial land valuation report finalized.', refNo: 'VAL-42X', tagType: 'PUBLIC_HEARING' }
    ],
    riskPredictionBreakdown: [
      { factor: 'COMPENSATION EXPECTATIONS', score: 45, level: 'warning', description: 'Minor disagreement on commercial valuation multipliers.' }
    ]
  },
  {
    id: 'PRJ-2023-88B',
    title: 'Western Corridor',
    district: 'Western Corridor',
    state: 'Gujarat',
    landType: 'Industrial Reserve',
    acquisitionStage: 'Initial Notification',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    hectares: 3200,
    affectedFamilies: 520,
    projectAgeMonths: 12,
    plannedDurationMonths: 36,
    lat: '23.0225° N',
    lon: '72.5714° E',
    surveyorId: 'OP-888-G',
    entryDate: '2023.02.18',
    lastSync: '2023-10-27 08:00:00',
    probabilityOfDelay: '89%',
    delayPredictionText: '+150 days delay predicted',
    likelihoodPercent: 92.0,
    phase: 'Initial Notification',
    locationDetails: 'Industrial Hub Zone A',
    lifecyclePipeline: {
      approval: true,
      compensation: false,
      rrActive: true,
      legal: true,
      possession: false,
    },
    shapFactors: [
      { driver: 'Large Scale Displacement Resistance', vector: 'up', impact: 29.8 },
      { driver: 'Historical District Delay Rate', vector: 'up', impact: 19.5 },
    ],
    directives: [
      { id: 'dir-88b-1', title: 'Establish R&R Special Task Force', description: 'Set up dedicated desk for 520 affected industrial families.', completed: false }
    ],
    milestones: [
      { timestamp: '2023-03-01 09:00', entryType: 'INITIAL_NOTIFICATION', description: 'Public notice published in regional daily gazette.', refNo: 'GAZ-88B', tagType: 'INITIAL_FILING' }
    ],
    riskPredictionBreakdown: [
      { factor: 'STAKEHOLDER RESISTANCE', score: 92, level: 'critical', description: 'High displacement count requires multi-agency R&R intervention.' }
    ]
  },
  {
    id: 'PRJ-884',
    title: 'Eastern Expressway Ext.',
    district: 'SEC-09, PLOT B-42',
    state: 'Delhi NCR',
    landType: 'Highway / Transport Corridor',
    acquisitionStage: 'Land Acquisition',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    hectares: 88.5,
    affectedFamilies: 190,
    projectAgeMonths: 15,
    plannedDurationMonths: 30,
    lat: '28.7041° N',
    lon: '77.1025° E',
    surveyorId: 'OP-884-D',
    entryDate: '2023.11.01',
    lastSync: '2024.05.24 14:32:00',
    probabilityOfDelay: '89.4%',
    delayPredictionText: '+120 days delay predicted',
    likelihoodPercent: 89.4,
    phase: 'Land Acquisition',
    locationDetails: 'SEC-09, PLOT B-42',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: true,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Encroachment along ROW', vector: 'up', impact: 26.2 },
      { driver: 'Pending High Court Writ', vector: 'up', impact: 18.9 },
    ],
    directives: [
      { id: 'dir-884-1', title: 'Expedite High Court Bench Hearing', description: 'File urgent listing petition for Plot B-42 ROW clearance.', completed: false }
    ],
    milestones: [
      { timestamp: '2023-11-01 10:00', entryType: 'ROW_INSPECTION', description: 'Right of way survey recorded 14 illegal commercial structures.', refNo: 'ROW-884', tagType: 'SURVEY_UPDATE' }
    ],
    riskPredictionBreakdown: [
      { factor: 'ROW CLEARANCE', score: 94, level: 'critical', description: 'Critical bottleneck due to commercial structure encroachments.' }
    ]
  },
  {
    id: 'PRJ-902',
    title: 'Municipal Reservoir T2',
    district: 'ZONE NORTH, DIST 4',
    state: 'Madhya Pradesh',
    landType: 'Water Resources / Reservoir Buffer',
    acquisitionStage: 'Environmental Survey',
    riskScore: 68,
    riskLevel: 'MED-HIGH',
    hectares: 210,
    affectedFamilies: 95,
    projectAgeMonths: 9,
    plannedDurationMonths: 20,
    lat: '23.2599° N',
    lon: '77.4126° E',
    surveyorId: 'OP-902-M',
    entryDate: '2024.01.10',
    lastSync: '2024.05.24 14:32:00',
    probabilityOfDelay: '64.2%',
    delayPredictionText: '+45 days delay predicted',
    likelihoodPercent: 64.2,
    phase: 'Environmental Survey',
    locationDetails: 'ZONE NORTH, DIST 4',
    lifecyclePipeline: {
      approval: true,
      compensation: false,
      rrActive: false,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Catchment Area Soil Stability', vector: 'up', impact: 16.4 },
    ],
    directives: [
      { id: 'dir-902-1', title: 'Geotechnical Soil Sampling', description: 'Complete deep core testing for reservoir boundary.', completed: false }
    ],
    milestones: [],
    riskPredictionBreakdown: [
      { factor: 'GEOTECHNICAL CLEARANCE', score: 68, level: 'warning', description: 'Pending clearance from State Water Board.' }
    ]
  },
  {
    id: 'PRJ-751',
    title: 'Metro Line Blue-South',
    district: 'TRANSIT CORRIDOR 8',
    state: 'Karnataka',
    landType: 'Urban Transit Corridor',
    acquisitionStage: 'Utility Shifting',
    riskScore: 61,
    riskLevel: 'MED-HIGH',
    hectares: 34.2,
    affectedFamilies: 60,
    projectAgeMonths: 11,
    plannedDurationMonths: 24,
    lat: '12.9716° N',
    lon: '77.5946° E',
    surveyorId: 'OP-751-B',
    entryDate: '2023.10.15',
    lastSync: '2024.05.24 14:32:00',
    probabilityOfDelay: '58.7%',
    delayPredictionText: '+30 days delay predicted',
    likelihoodPercent: 58.7,
    phase: 'Utility Shifting',
    locationDetails: 'TRANSIT CORRIDOR 8',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: false,
      legal: false,
      possession: false,
    },
    shapFactors: [
      { driver: 'Underground Gas Line Relocation', vector: 'up', impact: 14.8 },
    ],
    directives: [
      { id: 'dir-751-1', title: 'Joint Inter-Agency Utility Map', description: 'Coordinate with GAIL and BESCOM for pipeline diversion.', completed: true }
    ],
    milestones: [],
    riskPredictionBreakdown: [
      { factor: 'UTILITY RELOCATION', score: 61, level: 'warning', description: 'Inter-agency coordination delay for high-pressure gas line.' }
    ]
  },
  {
    id: 'PRJ-633',
    title: 'Civic Center Plaza',
    district: 'DOWNTOWN WARD 2',
    state: 'Rajasthan',
    landType: 'Civic & Institutional',
    acquisitionStage: 'Foundation Works',
    riskScore: 14,
    riskLevel: 'LOW',
    hectares: 12.0,
    affectedFamilies: 0,
    projectAgeMonths: 6,
    plannedDurationMonths: 12,
    lat: '26.9124° N',
    lon: '75.7873° E',
    surveyorId: 'OP-633-J',
    entryDate: '2024.02.01',
    lastSync: '2024.05.24 14:32:00',
    probabilityOfDelay: '12.5%',
    delayPredictionText: 'On Schedule',
    likelihoodPercent: 12.5,
    phase: 'Foundation Works',
    locationDetails: 'DOWNTOWN WARD 2',
    lifecyclePipeline: {
      approval: true,
      compensation: true,
      rrActive: false,
      legal: false,
      possession: true,
    },
    shapFactors: [
      { driver: 'Unencumbered Government Land', vector: 'down', impact: -18.0 },
    ],
    directives: [
      { id: 'dir-633-1', title: 'Monitor Excavation Milestone', description: 'Quarterly review on site foundation progress.', completed: true }
    ],
    milestones: [],
    riskPredictionBreakdown: [
      { factor: 'LAND CLEARANCE', score: 14, level: 'low', description: 'Full possession handed over without encumbrance.' }
    ]
  }
];

export const initialParcels: ParcelRecord[] = [
  {
    id: 'PRC-2023-884A',
    owner: 'National Highway Authority',
    deedRef: 'Deed: D-8849-ZZ',
    cadastralRef: 'CAD-992-SEC-4',
    geoCoords: '28°36\'50.4"N 77°12\'32.1"E',
    status: 'ACQUIRED',
  },
  {
    id: 'PRC-2024-102B',
    owner: 'Estate of R. Krishnan',
    deedRef: 'Claimant Pending Verification',
    cadastralRef: 'CAD-104-SEC-9',
    geoCoords: '28°37\'12.0"N 77°11\'45.8"E',
    status: 'SURVEYED',
  },
  {
    id: 'PRC-2024-445X',
    owner: 'Ganga Industrial Corp.',
    deedRef: 'Dispute Ref: DR-992',
    cadastralRef: 'CAD-332-SEC-1',
    geoCoords: '28°35\'44.2"N 77°14\'10.5"E',
    status: 'NOTIFIED',
  },
  {
    id: 'PRC-2022-110A',
    owner: 'State Infrastructure Board',
    deedRef: 'Deed: D-1102-AA',
    cadastralRef: 'CAD-005-SEC-2',
    geoCoords: '28°38\'01.1"N 77°10\'55.4"E',
    status: 'ACQUIRED',
  },
  {
    id: 'PRC-2024-998C',
    owner: 'Municipal Council Sector 4',
    deedRef: 'Zoning Update Pending',
    cadastralRef: 'CAD-112-SEC-4',
    geoCoords: '28°36\'22.9"N 77°13\'08.2"E',
    status: 'SURVEYED',
  },
  {
    id: 'PRC-2024-771D',
    owner: 'Saraswati Farmers Collective',
    deedRef: 'Deed: D-4401-FL',
    cadastralRef: 'CAD-441-SEC-3',
    geoCoords: '28°39\'15.2"N 77°15\'22.0"E',
    status: 'DISPUTED',
  },
  {
    id: 'PRC-2024-302E',
    owner: 'Southern Railways Logistics Division',
    deedRef: 'Deed: D-9912-RL',
    cadastralRef: 'CAD-802-SEC-7',
    geoCoords: '28°34\'10.8"N 77°09\'44.1"E',
    status: 'PENDING',
  }
];
