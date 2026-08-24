import React, { useState } from 'react';
import { ProjectData } from '../types';
import { RiskSeal } from './RiskSeal';

interface ProjectRegisterViewProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onOpenReport: () => void;
}

export const ProjectRegisterView: React.FC<ProjectRegisterViewProps> = ({
  project,
  onUpdateProject,
  onOpenReport,
}) => {
  const [newDirectiveTitle, setNewDirectiveTitle] = useState('');
  const [newDirectiveDesc, setNewDirectiveDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleDirective = (dirId: string) => {
    const updatedDirectives = project.directives.map((d) =>
      d.id === dirId ? { ...d, completed: !d.completed } : d
    );
    onUpdateProject({ ...project, directives: updatedDirectives });
  };

  const handleAddDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectiveTitle.trim()) return;

    const newDir = {
      id: `dir-${Date.now()}`,
      title: newDirectiveTitle.trim(),
      description: newDirectiveDesc.trim() || 'Custom administrative directive added by officer.',
      completed: false,
    };

    onUpdateProject({
      ...project,
      directives: [...project.directives, newDir],
    });

    setNewDirectiveTitle('');
    setNewDirectiveDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pb-12 font-display">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c2bd] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-data-mono font-bold text-sm bg-[#874f43] text-white px-2.5 py-0.5 rounded">
              PROJECT ID: {project.id}
            </span>
            <span className="font-display font-semibold text-xs text-[#85736f] uppercase">
              {project.district}, {project.state}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d] mt-1">
            {project.title}
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs font-label text-[#85736f]">CURRENT STATUS:</span>
            <span className="font-display font-bold text-xs uppercase bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-0.5 rounded border border-[#ba1a1a]">
              {project.acquisitionStage}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenReport}
            className="bg-[#874f43] hover:bg-[#6f382d] text-white text-xs uppercase font-semibold px-4 py-2 rounded-full shadow-xs flex items-center space-x-1 tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Generate Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Cadastral Risk Assessment Card & Lifecycle Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Assessment Card */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba1a1a]"></div>
          <div>
            <p className="font-display text-xs text-[#85736f] uppercase tracking-wider font-semibold">
              Cadastral Risk Assessment
            </p>
            <div className="flex items-center justify-between my-3">
              <RiskSeal score={project.riskScore} level={project.riskLevel} size="lg" />
              <div className="text-right">
                <div className="font-display font-bold text-2xl text-[#ba1a1a]">
                  {project.probabilityOfDelay}
                </div>
                <div className="font-label text-xs text-[#85736f]">
                  Probability of Delay &gt; 6 MO
                </div>
                <div className="font-display text-xs text-[#001e2d] font-semibold mt-1 bg-[#f0e6e2] px-2 py-0.5 rounded inline-block">
                  {project.delayPredictionText}
                </div>
              </div>
            </div>
          </div>
          <p className="font-label italic text-xs text-[#85736f] pt-2 border-t border-[#d7c2bd]">
            SHAP Risk Engine v2.04 • Scanned 340 cadastral land records.
          </p>
        </div>

        {/* Project Lifecycle Pipeline */}
        <div className="lg:col-span-2 bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#d7c2bd] pb-2 mb-4">
              <h3 className="font-display font-bold text-sm uppercase text-[#001e2d] flex items-center space-x-1">
                <span className="material-symbols-outlined text-base text-[#874f43]">alt_route</span>
                <span>Project Lifecycle Pipeline</span>
              </h3>
              <span className="font-label text-xs text-[#85736f]">5-Stage Legal Cadastral Workflow</span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-5 gap-2 py-2 text-center">
              {/* Step 1: Approval */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${project.lifecyclePipeline.approval ? 'bg-[#36675c] text-white' : 'bg-[#eae0dc] text-[#85736f]'}`}>
                  {project.lifecyclePipeline.approval ? <span className="material-symbols-outlined text-base">check</span> : '1'}
                </div>
                <span className="font-display text-[11px] font-bold uppercase text-[#001e2d]">
                  APPROVAL
                </span>
                <span className="font-label text-[10px] text-[#36675c] font-semibold">
                  PASSED
                </span>
              </div>

              {/* Step 2: Compensation */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${project.lifecyclePipeline.compensation ? 'bg-[#36675c] text-white' : 'bg-[#eae0dc] text-[#85736f]'}`}>
                  {project.lifecyclePipeline.compensation ? <span className="material-symbols-outlined text-base">check</span> : '2'}
                </div>
                <span className="font-display text-[11px] font-bold uppercase text-[#001e2d]">
                  COMPENSATION
                </span>
                <span className="font-label text-[10px] text-[#36675c] font-semibold">
                  PASSED
                </span>
              </div>

              {/* Step 3: R&R Active */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${project.lifecyclePipeline.rrActive ? 'bg-[#ba1a1a] text-white animate-bounce' : 'bg-[#eae0dc] text-[#85736f]'}`}>
                  <span className="material-symbols-outlined text-base">priority_high</span>
                </div>
                <span className="font-display text-[11px] font-bold uppercase text-[#ba1a1a]">
                  R&amp;R ACTIVE
                </span>
                <span className="font-label text-[10px] text-[#ba1a1a] font-bold">
                  BOTTLENECK
                </span>
              </div>

              {/* Step 4: Legal */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${project.lifecyclePipeline.legal ? 'bg-[#36675c] text-white' : 'bg-[#f0e6e2] text-[#85736f] border border-[#d7c2bd]'}`}>
                  4
                </div>
                <span className="font-display text-[11px] font-bold uppercase text-[#85736f]">
                  LEGAL
                </span>
                <span className="font-label text-[10px] text-[#85736f]">
                  PENDING
                </span>
              </div>

              {/* Step 5: Possession */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${project.lifecyclePipeline.possession ? 'bg-[#36675c] text-white' : 'bg-[#f0e6e2] text-[#85736f] border border-[#d7c2bd]'}`}>
                  5
                </div>
                <span className="font-display text-[11px] font-bold uppercase text-[#85736f]">
                  POSSESSION
                </span>
                <span className="font-label text-[10px] text-[#85736f]">
                  LOCKED
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#fdfaf8] border border-[#d7c2bd] p-2.5 rounded-lg text-xs font-label text-[#85736f] mt-3">
            <span className="font-bold text-[#001e2d]">Current Stage Focus: </span>
            Rehabilitation &amp; Resettlement (R&amp;R) Section 21 Objections undergoing magistrate review.
          </div>
        </div>
      </div>

      {/* SHAP Risk Drivers & Directives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Primary Risk Factors Table */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d7c2bd] pb-2">
            <h3 className="font-display font-bold text-base uppercase text-[#001e2d] flex items-center space-x-2">
              <span className="material-symbols-outlined text-lg text-[#874f43]">insights</span>
              <span>Primary Risk Factors (SHAP Drivers)</span>
            </h3>
            <span className="font-data-mono text-xs text-[#85736f]">FEATURE WEIGHT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-display text-sm">
              <thead>
                <tr className="bg-[#f0e6e2] border-b border-[#d7c2bd] text-xs uppercase tracking-wider text-[#001e2d]">
                  <th className="py-2.5 px-3 font-bold">RISK DRIVER</th>
                  <th className="py-2.5 px-3 font-bold text-center">VECTOR</th>
                  <th className="py-2.5 px-3 font-bold text-right">IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7c2bd]">
                {project.shapFactors.map((factor, idx) => (
                  <tr key={idx} className="hover:bg-[#f5faff]">
                    <td className="py-3 px-3 font-semibold text-[#001e2d]">
                      {factor.driver}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {factor.vector === 'up' ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                          <span className="material-symbols-outlined text-sm font-bold">north</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#b9eddf] text-[#1c4f45]">
                          <span className="material-symbols-outlined text-sm font-bold">south</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-data-mono font-bold text-base">
                      <span className={factor.impact > 0 ? 'text-[#ba1a1a]' : 'text-[#36675c]'}>
                        {factor.impact > 0 ? `+${factor.impact}` : factor.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Directives & Interventions Checklist */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d7c2bd] pb-2">
            <h3 className="font-display font-bold text-base uppercase text-[#001e2d] flex items-center space-x-2">
              <span className="material-symbols-outlined text-lg text-[#874f43]">task_alt</span>
              <span>Directives &amp; Interventions</span>
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[#874f43] hover:text-[#6f382d] font-display font-semibold text-xs uppercase flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Add Directive</span>
            </button>
          </div>

          {/* Add Directive Form */}
          {showAddForm && (
            <form onSubmit={handleAddDirective} className="bg-[#fdfaf8] border border-[#d7c2bd] p-3 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Directive Title..."
                value={newDirectiveTitle}
                onChange={(e) => setNewDirectiveTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#d7c2bd] rounded text-xs font-display text-[#001e2d] focus:outline-none focus:border-[#874f43]"
                required
              />
              <textarea
                placeholder="Description & administrative context..."
                value={newDirectiveDesc}
                onChange={(e) => setNewDirectiveDesc(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#d7c2bd] rounded text-xs font-label text-[#001e2d] focus:outline-none focus:border-[#874f43]"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs font-display text-[#85736f] hover:bg-[#eae0dc] rounded uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-display bg-[#874f43] text-white rounded uppercase font-semibold"
                >
                  Save Directive
                </button>
              </div>
            </form>
          )}

          {/* Directives List */}
          <div className="space-y-3 font-display">
            {project.directives.map((dir) => (
              <div
                key={dir.id}
                onClick={() => toggleDirective(dir.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                  dir.completed
                    ? 'bg-[#f5faff] border-[#d7c2bd] opacity-70'
                    : 'bg-[#ffffff] border-[#d7c2bd] hover:border-[#874f43]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={dir.completed}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 text-[#874f43] rounded border-[#85736f] focus:ring-[#874f43]"
                />
                <div className="flex-1">
                  <div className={`font-bold text-sm ${dir.completed ? 'line-through text-[#85736f]' : 'text-[#001e2d]'}`}>
                    {dir.title}
                  </div>
                  <div className="font-label text-xs text-[#85736f] mt-0.5">
                    {dir.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duration Register Graphic */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#d7c2bd] pb-2">
          <h3 className="font-display font-bold text-base uppercase text-[#001e2d] flex items-center space-x-2">
            <span className="material-symbols-outlined text-lg text-[#874f43]">timeline</span>
            <span>Duration Register: Actual vs. Projected Timeline</span>
          </h3>
          <span className="font-data-mono text-xs text-[#ba1a1a] font-bold">
            EST. OVERRUN: +180 DAYS
          </span>
        </div>

        {/* Timeline Graphic Bar */}
        <div className="space-y-2 py-2">
          <div className="flex text-xs font-display text-[#85736f] justify-between">
            <span>Q1 2024</span>
            <span>Q2 2024</span>
            <span>Q3 2024</span>
            <span>Q4 2024</span>
            <span className="text-[#ba1a1a] font-bold">Q1 2025 (PROJECTED DELAY)</span>
          </div>
          <div className="w-full h-6 bg-[#f0e6e2] rounded-full overflow-hidden relative flex border border-[#d7c2bd]">
            <div className="h-full bg-[#36675c] w-2/5 flex items-center justify-center text-white text-[10px] font-bold">
              SURVEY &amp; COMP (COMPLETED)
            </div>
            <div className="h-full bg-[#6a5c4a] w-1/5 flex items-center justify-center text-white text-[10px] font-bold">
              R&amp;R (ACTIVE)
            </div>
            <div className="h-full bg-[#ba1a1a] w-2/5 flex items-center justify-center text-white text-[10px] font-bold">
              LEGAL DELAY BOTTLENECK (+180 DAYS)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
