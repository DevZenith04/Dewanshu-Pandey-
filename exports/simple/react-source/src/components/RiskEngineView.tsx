import React, { useState } from 'react';
import { ProjectData, ViewTab } from '../types';
import { RiskSeal } from './RiskSeal';

interface RiskEngineViewProps {
  projects: ProjectData[];
  onSelectProject: (proj: ProjectData) => void;
  setActiveTab: (tab: ViewTab) => void;
  onOpenReport: () => void;
}

export const RiskEngineView: React.FC<RiskEngineViewProps> = ({
  projects,
  onSelectProject,
  setActiveTab,
  onOpenReport,
}) => {
  const [districtFilter, setDistrictFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');

  const filtered = projects.filter((p) => {
    const matchDist =
      !districtFilter ||
      p.district.toLowerCase().includes(districtFilter.toLowerCase()) ||
      p.locationDetails.toLowerCase().includes(districtFilter.toLowerCase());
    const matchCat =
      categoryFilter === 'ALL' || p.riskLevel === categoryFilter;
    const matchPhase =
      phaseFilter === 'ALL' || p.phase === phaseFilter;
    return matchDist && matchCat && matchPhase;
  });

  return (
    <div className="space-y-6 pb-12 font-display">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c2bd] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d]">
              Risk Forecast Engine
            </h1>
            <span className="bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a] text-xs font-display px-2.5 py-0.5 rounded-full font-bold uppercase">
              AI RISK ANALYSIS V2.04
            </span>
          </div>
          <p className="font-label italic text-sm text-[#85736f]">
            High-density bottleneck identification scanning across project portfolio.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#ffffff] border border-[#d7c2bd] px-3 py-1.5 rounded-lg text-right shadow-2xs">
            <span className="text-[10px] text-[#85736f] uppercase block leading-none font-semibold">
              SCAN COMPLETED
            </span>
            <span className="text-xs font-data-mono font-bold text-[#001e2d]">
              2024.05.24 14:32:00
            </span>
          </div>
          <button
            onClick={onOpenReport}
            className="bg-[#36675c] hover:bg-[#1c4f45] text-white text-xs uppercase px-4 py-2 rounded-full font-semibold shadow-xs flex items-center space-x-1 tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Risk Brief</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] p-4 rounded-xl shadow-2xs space-y-3">
        <p className="text-xs uppercase text-[#85736f] font-semibold tracking-wider">
          Filter Forecast Parameters
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-label text-[#85736f] uppercase mb-1">
              District / Location
            </label>
            <input
              type="text"
              placeholder="Filter by district..."
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-sm text-[#001e2d] focus:outline-none focus:border-[#874f43]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-label text-[#85736f] uppercase mb-1">
              Risk Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-sm text-[#001e2d] focus:outline-none focus:border-[#874f43]"
            >
              <option value="ALL">ALL CATEGORIES</option>
              <option value="CRITICAL">CRITICAL RISK</option>
              <option value="HIGH">HIGH RISK</option>
              <option value="MED-HIGH">MED-HIGH RISK</option>
              <option value="MEDIUM">MEDIUM RISK</option>
              <option value="LOW">LOW RISK</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-label text-[#85736f] uppercase mb-1">
              Acquisition Phase
            </label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg text-sm text-[#001e2d] focus:outline-none focus:border-[#874f43]"
            >
              <option value="ALL">ALL PHASES</option>
              <option value="Land Acquisition">Land Acquisition</option>
              <option value="Environmental Survey">Environmental Survey</option>
              <option value="Utility Shifting">Utility Shifting</option>
              <option value="Foundation Works">Foundation Works</option>
              <option value="Dispute Resolution">Dispute Resolution</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDistrictFilter('');
                setCategoryFilter('ALL');
                setPhaseFilter('ALL');
              }}
              className="w-full bg-[#f0e6e2] hover:bg-[#e4d6d0] text-[#001e2d] border border-[#d7c2bd] text-xs font-semibold uppercase py-2 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Risk Table */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0e6e2] border-b border-[#d7c2bd] text-xs uppercase tracking-wider text-[#001e2d]">
                <th className="py-3 px-4 font-bold">ID</th>
                <th className="py-3 px-4 font-bold">PROJECT & LOCATION</th>
                <th className="py-3 px-4 font-bold">PHASE</th>
                <th className="py-3 px-4 font-bold text-center">LIKELIHOOD</th>
                <th className="py-3 px-4 font-bold">TIMELINE PROJECTION</th>
                <th className="py-3 px-4 font-bold text-center">RISK STAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c2bd] font-body text-sm">
              {filtered.map((proj) => {
                let stampClass = 'seal-stamp-low';
                if (proj.riskLevel === 'CRITICAL' || proj.riskLevel === 'HIGH') {
                  stampClass = 'seal-stamp-critical';
                } else if (proj.riskLevel === 'MED-HIGH' || proj.riskLevel === 'MEDIUM') {
                  stampClass = 'seal-stamp-warning';
                }

                return (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      setActiveTab('projects');
                    }}
                    className="hover:bg-[#f5faff] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-data-mono font-bold text-[#001e2d]">
                      {proj.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-display font-semibold text-[#001e2d]">
                        {proj.title}
                      </div>
                      <div className="font-label text-xs text-[#85736f]">
                        {proj.locationDetails || `${proj.district}, ${proj.state}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-display text-xs text-[#001e2d]">
                      <span className="px-2.5 py-1 bg-[#f0e6e2] rounded-md font-semibold">
                        {proj.phase || proj.acquisitionStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-data-mono font-bold text-[#001e2d]">
                      {proj.likelihoodPercent || proj.riskScore}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-display text-xs font-semibold px-2.5 py-1 rounded-md ${
                          proj.delayPredictionText.includes('delay')
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#b9eddf] text-[#1c4f45]'
                        }`}
                      >
                        {proj.delayPredictionText}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <RiskSeal score={proj.riskScore} level={proj.riskLevel} size="md" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
