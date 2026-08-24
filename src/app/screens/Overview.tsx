import React from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, ChevronRight, FilePlus2, FileText, FolderKanban, Globe2, MoreHorizontal, ShieldCheck, Target } from 'lucide-react';
import type { NationalStats, ProjectData, ViewTab } from '../../types';
import { Metric, MiniMap, ProjectRow, SignalBar } from '../ui';

function SignalStrip() {
  return (
    <section className="signal-strip" aria-label="Morning brief">
      <div className="signal-strip-intro">
        <span className="eyebrow">Morning brief · 08:45 IST</span>
        <strong>Three signals changed overnight.</strong>
        <span>Read the movement before the meeting.</span>
      </div>
      <div className="signal-summary coral">
        <span className="signal-index">01</span>
        <div><span>Compensation</span><strong>4 files crossed 70%</strong></div>
        <ArrowUpRight size={15} />
      </div>
      <div className="signal-summary ochre">
        <span className="signal-index">02</span>
        <div><span>Dispute load</span><strong>2 new stays filed</strong></div>
        <ArrowUpRight size={15} />
      </div>
      <div className="signal-summary teal">
        <span className="signal-index">03</span>
        <div><span>Title clarity</span><strong>18 stable projects</strong></div>
        <ArrowDownRight size={15} />
      </div>
    </section>
  );
}

export function Overview({ projects, stats, onSelect, onNavigate, onReport }: { projects: ProjectData[]; stats: NationalStats; onSelect: (p: ProjectData) => void; onNavigate: (tab: ViewTab) => void; onReport: () => void }) {
  const critical = projects.filter((p) => p.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  return (
    <div className="page-stack">
      <section className="hero-row">
        <div><div className="eyebrow">MONDAY · 27 MAY 2024 <span className="live-dot" /> live registry</div><h1>Know what will<br /><em>stall next.</em></h1><p className="hero-copy">A decision surface for land acquisition teams. Read the signal, find the bottleneck, move the file.</p></div>
        <div className="hero-actions"><button className="button secondary" onClick={onReport}><FileText size={16} /> Export brief</button><button className="button primary" onClick={() => onNavigate('projects')}><FilePlus2 size={16} /> New assessment</button></div>
      </section>
      <section className="metrics-grid"><Metric label="Active projects" value={stats.totalProjectsActive.toLocaleString()} detail="+38 this quarter" icon={FolderKanban} /><Metric label="Critical exposure" value={`${stats.criticalRiskZones}`} detail="Needs review today" icon={AlertTriangle} accent="coral" /><Metric label="Land under survey" value="84.6k ha" detail="Across 17 states" icon={Globe2} accent="teal" /><Metric label="Interventions due" value="21" detail="7 overdue by 14+ days" icon={Target} accent="ochre" /></section>
      <SignalStrip />
      <section className="dashboard-grid">
        <div className="panel map-card"><div className="panel-heading"><div><span className="eyebrow">Geographic pulse</span><h2>Where attention is gathering</h2></div><button className="icon-button" onClick={() => onNavigate('analysis')}><MoreHorizontal size={18} /></button></div><MiniMap projects={projects} onSelect={onSelect} /></div>
        <div className="panel priority-card"><div className="panel-heading"><div><span className="eyebrow">Priority queue</span><h2>Decisions due now</h2></div><button className="text-button" onClick={() => onNavigate('projects')}>View all <ChevronRight size={14} /></button></div><div className="priority-list">{critical.slice(0, 3).map((project) => <button className="priority-item" key={project.id} onClick={() => onSelect(project)}><div className="priority-score">{project.riskScore}<small>risk</small></div><div><strong>{project.title}</strong><span>{project.district} · {project.phase}</span></div><ChevronRight size={16} /></button>)}</div><div className="panel-foot"><Bell size={15} /> 3 new signals since last sync <button onClick={() => onNavigate('analysis')}>Open risk studio</button></div></div>
      </section>
      <section className="dashboard-grid lower-grid"><div className="panel table-card"><div className="panel-heading"><div><span className="eyebrow">Most exposed files</span><h2>Projects to watch</h2></div><button className="text-button" onClick={() => onNavigate('projects')}>Project desk <ChevronRight size={14} /></button></div><div className="project-table">{projects.slice(0, 5).map((project) => <ProjectRow key={project.id} project={project} selected={false} onClick={() => onSelect(project)} />)}</div></div><div className="panel trend-card"><div className="panel-heading"><div><span className="eyebrow">Model readout</span><h2>Stage bottlenecks</h2></div><Activity size={18} className="muted-icon" /></div><div className="trend-summary"><strong>Compensation</strong><span>is the slowest-moving stage this month</span><ArrowUpRight size={16} /></div><SignalBar label="Compensation" value={72} tone="coral" /><SignalBar label="Dispute resolution" value={61} tone="ochre" /><SignalBar label="Rehabilitation & R&R" value={48} tone="teal" /><SignalBar label="Approval" value={26} tone="teal" /><div className="sparkline"><span>Apr 01</span><div className="spark-bars">{[36, 44, 42, 58, 49, 67, 62, 78, 73, 85, 82, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><span>May 27</span></div><div className="trend-foot"><ShieldCheck size={14} /> Confidence is strongest on early-stage files</div></div></section>
    </div>
  );
}
