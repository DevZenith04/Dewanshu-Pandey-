import React from 'react';
import { ProjectData } from '../types';
import { RiskSeal } from './RiskSeal';

interface ProjectDetailViewProps {
  project: ProjectData;
  onOpenReport: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onOpenReport,
}) => {
  return (
    <div className="space-y-6 pb-12 font-display">
      {/* Top Banner Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c2bd] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-label text-[#85736f] uppercase tracking-wider">
              REGISTRY ARCHIVE / PROJECT DETAIL
            </span>
            <span className="bg-[#f0e6e2] text-[#874f43] border border-[#d7c2bd] text-xs font-data-mono px-2 py-0.5 rounded font-bold">
              ID: {project.id}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d] mt-1">
            {project.title}
          </h1>
          <p className="font-label italic text-sm text-[#85736f]">
            {project.locationDetails || `${project.district}, ${project.state} • ${project.landType}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-data-mono text-xs">
          <span className="bg-[#ffffff] border border-[#d7c2bd] px-3 py-1.5 rounded-lg text-[#001e2d] shadow-2xs">
            LAT: {project.lat}
          </span>
          <span className="bg-[#ffffff] border border-[#d7c2bd] px-3 py-1.5 rounded-lg text-[#001e2d] shadow-2xs">
            LON: {project.lon}
          </span>
          <span className="bg-[#ffffff] border border-[#d7c2bd] px-3 py-1.5 rounded-lg text-[#001e2d] shadow-2xs">
            EXT: {project.hectares} HECTARES
          </span>
          <button
            onClick={onOpenReport}
            className="bg-[#874f43] text-white hover:bg-[#6f382d] px-3 py-1.5 rounded-lg font-display uppercase font-semibold text-xs shadow-2xs transition-all"
          >
            Export Record
          </button>
        </div>
      </div>

      {/* Identification Card */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-5 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#874f43]"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-[#001e2d]">
              {project.title}
            </h2>
            <p className="font-label text-sm text-[#85736f]">
              Comprehensive survey of contested cadastral plots and acquisition milestones recorded in district registry.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-display text-[#001e2d] pt-2">
              <div>
                <span className="text-[#85736f]">Date of Entry: </span>
                <span className="font-bold">{project.entryDate}</span>
              </div>
              <div>
                <span className="text-[#85736f]">Surveyor ID: </span>
                <span className="font-bold font-data-mono">{project.surveyorId}</span>
              </div>
              <div>
                <span className="text-[#85736f]">Stage: </span>
                <span className="font-bold">{project.acquisitionStage}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 text-center">
            <RiskSeal score={project.riskScore} level={project.riskLevel} size="lg" />
          </div>
        </div>
      </div>

      {/* 2 Column Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Gazette & Milestones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#d7c2bd] bg-[#fdfaf8] flex items-center justify-between">
              <h3 className="font-display font-bold text-lg uppercase text-[#001e2d] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#874f43]">gavel</span>
                <span>Gazette: Legal Milestones & Entries</span>
              </h3>
              <span className="font-label text-xs text-[#85736f]">
                {project.milestones.length} Certified Gazette Filings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0e6e2] border-b border-[#d7c2bd] text-xs uppercase tracking-wider text-[#001e2d]">
                    <th className="py-2.5 px-4 font-bold">TIMESTAMP</th>
                    <th className="py-2.5 px-4 font-bold">ENTRY TYPE</th>
                    <th className="py-2.5 px-4 font-bold">GAZETTE RECORD DESCRIPTION</th>
                    <th className="py-2.5 px-4 font-bold text-right">REF NO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d7c2bd] font-body text-xs">
                  {project.milestones.map((m, idx) => {
                    let badge = 'bg-[#f0e6e2] text-[#001e2d]';
                    if (m.tagType === 'JUDICIAL STAY') {
                      badge = 'bg-[#ffdad6] text-[#ba1a1a] font-bold border border-[#ba1a1a]';
                    } else if (m.tagType === 'SURVEY_UPDATE') {
                      badge = 'bg-[#b9eddf] text-[#1c4f45] font-semibold';
                    } else if (m.tagType === 'PUBLIC_HEARING') {
                      badge = 'bg-[#f3e0c8] text-[#6a5c4a] font-semibold';
                    }

                    return (
                      <tr key={idx} className="hover:bg-[#f5faff]">
                        <td className="py-3 px-4 font-data-mono font-semibold text-[#001e2d] whitespace-nowrap">
                          {m.timestamp}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-display uppercase ${badge}`}>
                            {m.entryType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#001e2d]">
                          {m.description}
                        </td>
                        <td className="py-3 px-4 text-right font-data-mono font-bold text-[#874f43] whitespace-nowrap">
                          {m.refNo}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Cartographic Map + Risk Breakdown */}
        <div className="space-y-6">
          {/* Cartographic Map Canvas */}
          <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#d7c2bd] pb-2">
              <h3 className="font-display font-bold text-sm uppercase text-[#001e2d] flex items-center space-x-1">
                <span className="material-symbols-outlined text-base text-[#874f43]">map</span>
                <span>Cartographic Ref Map View</span>
              </h3>
              <span className="font-data-mono text-[10px] text-[#85736f]">SCALE 1:5000</span>
            </div>

            {/* Interactive SVG Cartographic Map Display */}
            <div className="relative w-full h-48 bg-[#eef5f8] rounded-lg border border-[#d7c2bd] overflow-hidden flex items-center justify-center p-2">
              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#874f43" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Cadastral Polygon Contour */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                <polygon
                  points="40,30 220,20 270,140 180,180 50,150"
                  fill="rgba(135, 79, 67, 0.15)"
                  stroke="#874f43"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                <polygon
                  points="80,50 180,45 220,120 140,150 70,120"
                  fill="rgba(186, 26, 26, 0.25)"
                  stroke="#ba1a1a"
                  strokeWidth="1.5"
                />
                <circle cx="150" cy="90" r="6" fill="#ba1a1a" />
                <circle cx="150" cy="90" r="14" fill="none" stroke="#ba1a1a" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="150" y1="20" x2="150" y2="160" stroke="#001e2d" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="30" y1="90" x2="270" y2="90" stroke="#001e2d" strokeWidth="0.5" strokeDasharray="3,3" />
              </svg>

              <div className="absolute top-2 left-2 bg-white/90 border border-[#d7c2bd] text-[10px] font-data-mono px-2 py-0.5 rounded shadow-xs">
                CAD-REF: {project.id}
              </div>

              <div className="absolute bottom-2 right-2 bg-white/90 border border-[#d7c2bd] text-[10px] font-data-mono px-2 py-0.5 rounded shadow-xs">
                ZONE: URBAN-FRINGE
              </div>
            </div>
            <p className="font-label text-xs text-[#85736f] text-center italic">
              Red shaded zone represents judicial stay contour area under Section 11 review.
            </p>
          </div>

          {/* Risk Factors Panel */}
          <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="font-display font-bold text-sm uppercase text-[#001e2d] border-b border-[#d7c2bd] pb-2 flex items-center justify-between">
              <span>Risk Prediction Engine Factors</span>
              <span className="material-symbols-outlined text-base text-[#874f43]">monitoring</span>
            </h3>

            <div className="space-y-3 font-display">
              {project.riskPredictionBreakdown.map((rf, idx) => (
                <div key={idx} className="space-y-1 bg-[#fdfaf8] p-2.5 rounded-lg border border-[#d7c2bd]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#001e2d]">
                    <span>{rf.factor}</span>
                    <span className="font-data-mono font-bold text-sm">{rf.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eae0dc] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        rf.level === 'critical'
                          ? 'bg-[#ba1a1a]'
                          : rf.level === 'warning'
                          ? 'bg-[#6a5c4a]'
                          : 'bg-[#36675c]'
                      }`}
                      style={{ width: `${rf.score}%` }}
                    ></div>
                  </div>
                  <p className="font-label text-[11px] text-[#85736f] leading-tight pt-1">
                    {rf.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
