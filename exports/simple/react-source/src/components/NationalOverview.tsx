import React, { useState } from 'react';
import { NationalStats, ProjectData, ViewTab } from '../types';
import { RiskSeal } from './RiskSeal';

interface NationalOverviewProps {
  stats: NationalStats;
  projects: ProjectData[];
  onSelectProject: (proj: ProjectData) => void;
  setActiveTab: (tab: ViewTab) => void;
  onOpenReport: () => void;
}

export const NationalOverview: React.FC<NationalOverviewProps> = ({
  stats,
  projects,
  onSelectProject,
  setActiveTab,
  onOpenReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLandType, setSelectedLandType] = useState('ALL');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedLandType === 'ALL' || p.landType.includes(selectedLandType);
    return matchesSearch && matchesType;
  });

  const landTypes = [
    'ALL',
    'Agricultural',
    'Commercial',
    'Highway',
    'Wetlands',
    'Industrial',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c2bd] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d]">
              National Overview
            </h1>
            <span className="bg-[#f0e6e2] text-[#874f43] border border-[#d7c2bd] text-xs font-display px-2.5 py-0.5 rounded-full font-semibold">
              NATIONAL LEDGER
            </span>
          </div>
          <p className="font-label italic text-sm text-[#85736f]">
            Aggregated survey data and risk metrics across all active acquisition zones.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#ffffff] border border-[#d7c2bd] px-3 py-1.5 rounded-lg text-right font-display shadow-2xs">
            <span className="text-[10px] text-[#85736f] uppercase block leading-none font-semibold">
              LAST SYNC
            </span>
            <span className="text-xs font-data-mono font-bold text-[#001e2d]">
              {stats.lastSync}
            </span>
          </div>
          <button
            onClick={onOpenReport}
            className="bg-[#874f43] hover:bg-[#6f382d] text-white font-display text-xs uppercase px-4 py-2 rounded-full font-semibold shadow-xs flex items-center space-x-1 tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-sm">ios_share</span>
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] p-4 rounded-xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#874f43]"></div>
          <p className="font-display text-xs text-[#85736f] uppercase tracking-wider font-semibold">
            TOTAL PROJECTS ACTIVE
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-display font-bold text-3xl md:text-4xl text-[#001e2d]">
              {stats.totalProjectsActive.toLocaleString()}
            </span>
            <span className="material-symbols-outlined text-[#874f43] text-2xl">
              account_tree
            </span>
          </div>
          <p className="font-label text-xs text-[#36675c] mt-2 flex items-center space-x-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+14 newly registered this month</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] p-4 rounded-xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#36675c]"></div>
          <p className="font-display text-xs text-[#85736f] uppercase tracking-wider font-semibold">
            HECTARES UNDER SURVEY
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-display font-bold text-3xl md:text-4xl text-[#001e2d]">
              {stats.hectaresUnderSurvey.toLocaleString()}
            </span>
            <span className="material-symbols-outlined text-[#36675c] text-2xl">
              square_foot
            </span>
          </div>
          <p className="font-label text-xs text-[#85736f] mt-2">
            28 Districts actively mapped
          </p>
        </div>

        {/* Card 3 (Critical Risk) */}
        <div className="bg-[#fff5f4] border border-[#ffb6a6] p-4 rounded-xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba1a1a]"></div>
          <p className="font-display text-xs text-[#ba1a1a] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>CRITICAL RISK ZONES</span>
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-display font-bold text-3xl md:text-4xl text-[#ba1a1a]">
              {stats.criticalRiskZones}
            </span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">
              warning
            </span>
          </div>
          <p className="font-label text-xs text-[#ba1a1a] mt-2 font-semibold">
            High probability of court stay / delay &gt; 6 mo
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] p-4 rounded-xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#6a5c4a]"></div>
          <p className="font-display text-xs text-[#85736f] uppercase tracking-wider font-semibold">
            PENDING REGISTRATIONS
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-display font-bold text-3xl md:text-4xl text-[#001e2d]">
              {stats.pendingRegistrations}
            </span>
            <span className="material-symbols-outlined text-[#6a5c4a] text-2xl">
              pending_actions
            </span>
          </div>
          <p className="font-label text-xs text-[#85736f] mt-2">
            Verification queue: 4.2 days avg turnaround
          </p>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl shadow-2xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-[#d7c2bd] bg-[#fdfaf8] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#85736f] text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search Project ID, District or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#ffffff] border border-[#d7c2bd] rounded-full font-display text-sm text-[#001e2d] focus:outline-none focus:border-[#874f43]"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <span className="font-display text-xs text-[#85736f] uppercase font-semibold shrink-0">
              Land Type:
            </span>
            {landTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedLandType(type)}
                className={`font-display text-xs uppercase px-3 py-1 rounded-full border transition-all shrink-0 ${
                  selectedLandType === type
                    ? 'bg-[#874f43] text-white border-[#874f43] font-semibold'
                    : 'bg-[#ffffff] text-[#001e2d] border-[#d7c2bd] hover:bg-[#eae0dc]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0e6e2] border-b border-[#d7c2bd] font-display text-xs uppercase tracking-wider text-[#001e2d]">
                <th className="py-3 px-4 font-bold">PROJECT ID</th>
                <th className="py-3 px-4 font-bold">DISTRICT & LOCATION</th>
                <th className="py-3 px-4 font-bold">LAND TYPE</th>
                <th className="py-3 px-4 font-bold">ACQUISITION STAGE</th>
                <th className="py-3 px-4 font-bold text-center">RISK SCORE</th>
                <th className="py-3 px-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c2bd] font-body text-sm">
              {filteredProjects.map((proj) => {
                let badgeStyle = 'bg-[#b9eddf] text-[#1c4f45] border-[#36675c]';
                if (proj.riskLevel === 'CRITICAL') {
                  badgeStyle = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] font-bold';
                } else if (proj.riskLevel === 'HIGH') {
                  badgeStyle = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]';
                } else if (proj.riskLevel === 'MEDIUM' || proj.riskLevel === 'MED-HIGH') {
                  badgeStyle = 'bg-[#f3e0c8] text-[#6a5c4a] border-[#6a5c4a]';
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
                    <td className="py-3.5 px-4 font-data-mono font-bold text-[#001e2d] whitespace-nowrap">
                      {proj.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-display font-semibold text-[#001e2d]">
                        {proj.title}
                      </div>
                      <div className="font-label text-xs text-[#85736f]">
                        {proj.district}, {proj.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-display text-xs text-[#001e2d]">
                      {proj.landType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-display text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f0e6e2] text-[#001e2d]">
                        {proj.acquisitionStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <RiskSeal score={proj.riskScore} level={proj.riskLevel} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-[#874f43] hover:text-[#6f382d] font-display font-semibold text-xs uppercase flex items-center space-x-1 ml-auto">
                        <span>Inspect</span>
                        <span className="material-symbols-outlined text-sm">
                          chevron_right
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#fdfaf8] border-t border-[#d7c2bd] text-right font-label text-xs text-[#85736f]">
          Showing {filteredProjects.length} of {projects.length} Active Acquisition Records
        </div>
      </div>
    </div>
  );
};
