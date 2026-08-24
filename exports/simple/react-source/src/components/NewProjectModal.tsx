import React, { useState } from 'react';
import { ProjectData } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProj: ProjectData) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [state, setState] = useState('Haryana');
  const [district, setDistrict] = useState('Gurugram');
  const [title, setTitle] = useState('Greenfield Highway Sector 4');
  const [landType, setLandType] = useState('Highway / Transport Corridor');
  const [affectedFamilies, setAffectedFamilies] = useState(180);
  const [hectares, setHectares] = useState(65.4);
  const [projectAgeMonths, setProjectAgeMonths] = useState(12);
  const [plannedDurationMonths, setPlannedDurationMonths] = useState(24);

  const [compensationStatus, setCompensationStatus] = useState('In Progress');
  const [compDisbursedPercent, setCompDisbursedPercent] = useState(45);
  const [rehabProgressPercent, setRehabProgressPercent] = useState(30);

  const [approvalStage, setApprovalStage] = useState('SECTION 11 NOTIFICATION');
  const [legalDisputeStatus, setLegalDisputeStatus] = useState('Objections Filed');
  const [legalDisputesCount, setLegalDisputesCount] = useState(3);
  const [possessionStatus, setPossessionStatus] = useState('Not Possessed');
  const [daysSinceNotification, setDaysSinceNotification] = useState(90);

  const [coordinationIssues, setCoordinationIssues] = useState('Yes');
  const [historicalDistrictDelayRate, setHistoricalDistrictDelayRate] = useState(0.45);
  const [stakeholderResponsiveness, setStakeholderResponsiveness] = useState(4);

  const handlePredictAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = {
      state,
      district,
      title,
      landType,
      affectedFamilies,
      hectares,
      projectAgeMonths,
      plannedDurationMonths,
      compensationStatus,
      compDisbursedPercent,
      rehabProgressPercent,
      approvalStage,
      legalDisputeStatus,
      legalDisputesCount,
      possessionStatus,
      daysSinceNotification,
      coordinationIssues,
      historicalDistrictDelayRate,
      stakeholderResponsiveness,
    };

    try {
      const res = await fetch('/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to compute risk prediction from server');
      }

      const prediction = await res.json();

      const newProjectId = `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newProject: ProjectData = {
        id: newProjectId,
        title,
        district,
        state,
        landType,
        acquisitionStage: approvalStage,
        riskScore: prediction.riskScore || 75,
        riskLevel: prediction.riskLevel || 'HIGH',
        hectares,
        affectedFamilies,
        projectAgeMonths,
        plannedDurationMonths,
        lat: '28.4595° N',
        lon: '77.0266° E',
        surveyorId: `OP-${Math.floor(100 + Math.random() * 900)}-ADM`,
        entryDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        lastSync: new Date().toISOString(),
        probabilityOfDelay: prediction.probabilityOfDelay || '75%',
        delayPredictionText: prediction.delayPredictionText || '+90 days delay predicted',
        likelihoodPercent: prediction.likelihoodPercent || 75.0,
        phase: 'Land Acquisition',
        locationDetails: `${district}, ${state} • ${landType}`,
        compensationStatus,
        compDisbursedPercent,
        rehabProgressPercent,
        approvalStage,
        legalDisputeStatus,
        legalDisputesCount,
        possessionStatus,
        daysSinceNotification,
        coordinationIssues,
        historicalDistrictDelayRate,
        stakeholderResponsiveness,
        lifecyclePipeline: {
          approval: true,
          compensation: compDisbursedPercent > 50,
          rrActive: true,
          legal: legalDisputesCount > 0,
          possession: possessionStatus === 'Full Possession',
        },
        shapFactors: prediction.shapFactors || [
          { driver: 'Multi-heir Title Claims', vector: 'up', impact: 22.4 },
          { driver: 'Compensation Disbursal Rate', vector: 'up', impact: 14.1 },
        ],
        directives: prediction.directives || [
          {
            id: `dir-${Date.now()}-1`,
            title: 'Schedule Section 21 Hearing',
            description: 'Issue magistrate notice for accelerated dispute resolution panel.',
            completed: false,
          },
        ],
        milestones: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            entryType: 'INITIAL_FILING',
            description: 'Project survey proposal entered into ADM registry.',
            refNo: `IN-${newProjectId}`,
            tagType: 'INITIAL_FILING',
          },
        ],
        riskPredictionBreakdown: prediction.riskPredictionBreakdown || [
          {
            factor: 'TITLE & HEIR CONFLICT',
            score: prediction.riskScore || 75,
            level: prediction.riskScore > 70 ? 'critical' : 'warning',
            description: 'Assessed likelihood of court stay or injunctions.',
          },
        ],
      };

      onAddProject(newProject);
      setLoading(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing risk prediction model');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden font-display my-8 relative">
        {/* Modal Top Banner */}
        <div className="bg-[#f0e6e2] border-b border-[#d7c2bd] p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-xl uppercase tracking-wide text-[#001e2d]">
                NEW PROJECT SURVEY ENTRY
              </h2>
              <span className="bg-[#874f43] text-white text-[10px] font-data-mono px-2 py-0.5 rounded font-bold">
                SYS.REF: ZV-REG-992
              </span>
            </div>
            <p className="font-label italic text-xs text-[#85736f]">
              Enter cadastral survey metrics for automated AI risk &amp; delay forecasting.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#d7c2bd] flex items-center justify-center text-[#001e2d] hover:bg-[#eae0dc]"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] p-3 text-xs border-b border-[#ba1a1a] font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handlePredictAndSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 01 */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase text-[#874f43] border-b border-[#d7c2bd] pb-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">folder_open</span>
              <span>SECTION 01: PROJECT INFORMATION</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Land / Infrastructure Type</label>
                <input
                  type="text"
                  value={landType}
                  onChange={(e) => setLandType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Affected Families</label>
                <input
                  type="number"
                  value={affectedFamilies}
                  onChange={(e) => setAffectedFamilies(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Land Area (Hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  value={hectares}
                  onChange={(e) => setHectares(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Project Age (Months)</label>
                <input
                  type="number"
                  value={projectAgeMonths}
                  onChange={(e) => setProjectAgeMonths(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Planned Duration (Months)</label>
                <input
                  type="number"
                  value={plannedDurationMonths}
                  onChange={(e) => setPlannedDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d] focus:border-[#874f43]"
                />
              </div>
            </div>
          </div>

          {/* Section 02 */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase text-[#874f43] border-b border-[#d7c2bd] pb-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">payments</span>
              <span>SECTION 02: COMPENSATION &amp; REHABILITATION</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Compensation Status</label>
                <select
                  value={compensationStatus}
                  onChange={(e) => setCompensationStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Disputed">Disputed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Disbursed %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={compDisbursedPercent}
                  onChange={(e) => setCompDisbursedPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Rehab Progress %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rehabProgressPercent}
                  onChange={(e) => setRehabProgressPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase text-[#874f43] border-b border-[#d7c2bd] pb-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">gavel</span>
              <span>SECTION 03: LEGAL &amp; APPROVAL</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Approval Stage</label>
                <input
                  type="text"
                  value={approvalStage}
                  onChange={(e) => setApprovalStage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Legal Dispute Status</label>
                <select
                  value={legalDisputeStatus}
                  onChange={(e) => setLegalDisputeStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                >
                  <option value="Objections Filed">Objections Filed</option>
                  <option value="High Court Stay">High Court Stay</option>
                  <option value="No Active Dispute">No Active Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Legal Disputes Count</label>
                <input
                  type="number"
                  value={legalDisputesCount}
                  onChange={(e) => setLegalDisputesCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Possession Status</label>
                <select
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                >
                  <option value="Not Possessed">Not Possessed</option>
                  <option value="Partial Possession">Partial Possession</option>
                  <option value="Full Possession">Full Possession</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Days Since Notification</label>
                <input
                  type="number"
                  value={daysSinceNotification}
                  onChange={(e) => setDaysSinceNotification(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>
            </div>
          </div>

          {/* Section 04 */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase text-[#874f43] border-b border-[#d7c2bd] pb-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">hub</span>
              <span>SECTION 04: COORDINATION &amp; HISTORY</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Coordination Issues</label>
                <select
                  value={coordinationIssues}
                  onChange={(e) => setCoordinationIssues(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">District Delay Rate (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={historicalDistrictDelayRate}
                  onChange={(e) => setHistoricalDistrictDelayRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001e2d] uppercase mb-1">Stakeholder Score (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={stakeholderResponsiveness}
                  onChange={(e) => setStakeholderResponsiveness(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-xs font-display text-[#001e2d]"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#d7c2bd] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f0e6e2] hover:bg-[#e4d6d0] text-[#001e2d] border border-[#d7c2bd] text-xs font-semibold uppercase rounded-full"
            >
              Cancel / Save Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#874f43] hover:bg-[#6f382d] text-white text-xs uppercase font-bold rounded-full shadow-md flex items-center space-x-2 tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Running AI Forecast...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">online_prediction</span>
                  <span>Predict Risk &amp; Save Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
