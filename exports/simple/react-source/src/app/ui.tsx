import React from 'react';
import { ChevronRight, MapPinned } from 'lucide-react';
import type { ProjectData } from '../types';

export function riskTone(level: ProjectData['riskLevel']) {
  if (level === 'CRITICAL') return { label: 'Critical', className: 'risk-critical', dot: 'bg-[#c45f4b]' };
  if (level === 'HIGH' || level === 'MED-HIGH') return { label: 'High', className: 'risk-high', dot: 'bg-[#d18a42]' };
  if (level === 'MEDIUM') return { label: 'Medium', className: 'risk-medium', dot: 'bg-[#568b87]' };
  return { label: 'Low', className: 'risk-low', dot: 'bg-[#5f9b7d]' };
}

export function Metric({ label, value, detail, icon: Icon, accent = 'coral' }: { label: string; value: string; detail: string; icon: React.ElementType; accent?: string }) {
  return (
    <div className={`metric-card accent-${accent}`}>
      <div className="metric-icon"><Icon size={18} strokeWidth={1.8} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

export function RiskPill({ level }: { level: ProjectData['riskLevel'] }) {
  const tone = riskTone(level);
  return <span className={`risk-pill ${tone.className}`}><span className={`risk-dot ${tone.dot}`} />{tone.label}</span>;
}

export function ProjectRow({ project, selected, onClick }: { project: ProjectData; selected: boolean; onClick: () => void; key?: React.Key }) {
  return (
    <button className={`project-row ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="row-main">
        <div className="row-code">{project.id}</div>
        <div className="row-title">{project.title}</div>
        <div className="row-meta"><MapPinned size={13} /> {project.district}, {project.state} <span className="meta-sep">•</span> {project.hectares} ha</div>
      </div>
      <div className="row-stage">{project.phase}</div>
      <div className="row-score"><span>{project.riskScore}</span><small>/100</small></div>
      <RiskPill level={project.riskLevel} />
      <ChevronRight className="row-chevron" size={18} />
    </button>
  );
}

export function SignalBar({ label, value, tone = 'coral' }: { label: string; value: number; tone?: 'coral' | 'teal' | 'ochre' }) {
  return <div className="signal-row"><div className="signal-head"><span>{label}</span><strong>{value}%</strong></div><div className="signal-track"><div className={`signal-fill ${tone}`} style={{ width: `${value}%` }} /></div></div>;
}

export function MiniMap({ projects, onSelect }: { projects: ProjectData[]; onSelect: (p: ProjectData) => void }) {
  const points = [
    { x: 72, y: 24 }, { x: 43, y: 35 }, { x: 57, y: 42 }, { x: 73, y: 57 }, { x: 34, y: 63 }, { x: 66, y: 77 },
  ];
  return <div className="map-panel">
    <div className="map-grid" />
    <div className="map-outline map-outline-one" /><div className="map-outline map-outline-two" /><div className="map-outline map-outline-three" />
    <div className="map-river" />
    {projects.slice(0, 6).map((project, index) => <button key={project.id} onClick={() => onSelect(project)} className={`map-pin ${riskTone(project.riskLevel).className}`} style={{ left: `${points[index].x}%`, top: `${points[index].y}%` }} title={project.title}><span /><em>{project.riskScore}</em></button>)}
    <div className="map-legend"><span><i className="legend-dot critical" /> Critical</span><span><i className="legend-dot high" /> Elevated</span><span><i className="legend-dot stable" /> Stable</span></div>
    <div className="map-caption"><span className="eyebrow">Spatial view</span><strong>6 live risk signals</strong><small>Indicative locations · sync 08:45 IST</small></div>
  </div>;
}

