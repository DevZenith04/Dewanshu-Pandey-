import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  FilePlus2,
  FileText,
  Filter,
  FolderKanban,
  Gauge,
  Globe2,
  LayoutDashboard,
  MapPinned,
  Menu,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { NewProjectModal } from './components/NewProjectModal';
import { ReportModal } from './components/ReportModal';
import { InitialSplash } from './components/InitialSplash';
import { initialNationalStats, initialParcels, initialProjects } from './data/mockData';
import { NationalStats, ParcelRecord, ProjectData, ViewTab } from './types';

const navItems: { id: ViewTab; label: string; icon: React.ElementType; hint: string }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, hint: 'National pulse' },
  { id: 'projects', label: 'Project desk', icon: FolderKanban, hint: 'Active acquisition' },
  { id: 'analysis', label: 'Risk studio', icon: Gauge, hint: 'Model signals' },
  { id: 'registry', label: 'Parcel registry', icon: MapPinned, hint: 'Cadastral records' },
  { id: 'archive', label: 'Archive', icon: BookOpen, hint: 'Closed cases' },
];

function riskTone(level: ProjectData['riskLevel']) {
  if (level === 'CRITICAL') return { label: 'Critical', className: 'risk-critical', dot: 'bg-[#c45f4b]' };
  if (level === 'HIGH' || level === 'MED-HIGH') return { label: 'High', className: 'risk-high', dot: 'bg-[#d18a42]' };
  if (level === 'MEDIUM') return { label: 'Medium', className: 'risk-medium', dot: 'bg-[#568b87]' };
  return { label: 'Low', className: 'risk-low', dot: 'bg-[#5f9b7d]' };
}

function Metric({ label, value, detail, icon: Icon, accent = 'coral' }: { label: string; value: string; detail: string; icon: React.ElementType; accent?: string }) {
  return (
    <div className={`metric-card accent-${accent}`}>
      <div className="metric-icon"><Icon size={18} strokeWidth={1.8} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function RiskPill({ level }: { level: ProjectData['riskLevel'] }) {
  const tone = riskTone(level);
  return <span className={`risk-pill ${tone.className}`}><span className={`risk-dot ${tone.dot}`} />{tone.label}</span>;
}

function ProjectRow({ project, selected, onClick }: { project: ProjectData; selected: boolean; onClick: () => void; key?: React.Key }) {
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

function SignalBar({ label, value, tone = 'coral' }: { label: string; value: number; tone?: 'coral' | 'teal' | 'ochre' }) {
  return <div className="signal-row"><div className="signal-head"><span>{label}</span><strong>{value}%</strong></div><div className="signal-track"><div className={`signal-fill ${tone}`} style={{ width: `${value}%` }} /></div></div>;
}

function MiniMap({ projects, onSelect }: { projects: ProjectData[]; onSelect: (p: ProjectData) => void }) {
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

function Overview({ projects, stats, onSelect, onNavigate, onReport }: { projects: ProjectData[]; stats: NationalStats; onSelect: (p: ProjectData) => void; onNavigate: (tab: ViewTab) => void; onReport: () => void }) {
  const critical = projects.filter((p) => p.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  return <div className="page-stack">
    <section className="hero-row">
      <div><div className="eyebrow">MONDAY · 27 MAY 2024 <span className="live-dot" /> live registry</div><h1>Know what will<br /><em>stall next.</em></h1><p className="hero-copy">A decision surface for land acquisition teams. Read the signal, find the bottleneck, move the file.</p></div>
      <div className="hero-actions"><button className="button secondary" onClick={onReport}><FileText size={16} /> Export brief</button><button className="button primary" onClick={() => onNavigate('projects')}><FilePlus2 size={16} /> New assessment</button></div>
    </section>
    <section className="metrics-grid"><Metric label="Active projects" value={stats.totalProjectsActive.toLocaleString()} detail="+38 this quarter" icon={FolderKanban} /><Metric label="Critical exposure" value={`${stats.criticalRiskZones}`} detail="Needs review today" icon={AlertTriangle} accent="coral" /><Metric label="Land under survey" value="84.6k ha" detail="Across 17 states" icon={Globe2} accent="teal" /><Metric label="Interventions due" value="21" detail="7 overdue by 14+ days" icon={Target} accent="ochre" /></section>
    <section className="dashboard-grid">
      <div className="panel map-card"><div className="panel-heading"><div><span className="eyebrow">Geographic pulse</span><h2>Where attention is gathering</h2></div><button className="icon-button" onClick={() => onNavigate('analysis')}><MoreHorizontal size={18} /></button></div><MiniMap projects={projects} onSelect={onSelect} /></div>
      <div className="panel priority-card"><div className="panel-heading"><div><span className="eyebrow">Priority queue</span><h2>Decisions due now</h2></div><button className="text-button" onClick={() => onNavigate('projects')}>View all <ChevronRight size={14} /></button></div><div className="priority-list">{critical.slice(0, 3).map((project) => <button className="priority-item" key={project.id} onClick={() => onSelect(project)}><div className="priority-score">{project.riskScore}<small>risk</small></div><div><strong>{project.title}</strong><span>{project.district} · {project.phase}</span></div><ChevronRight size={16} /></button>)}</div><div className="panel-foot"><Bell size={15} /> 3 new signals since last sync <button onClick={() => onNavigate('analysis')}>Open risk studio</button></div></div>
    </section>
    <section className="dashboard-grid lower-grid"><div className="panel table-card"><div className="panel-heading"><div><span className="eyebrow">Most exposed files</span><h2>Projects to watch</h2></div><button className="text-button" onClick={() => onNavigate('projects')}>Project desk <ChevronRight size={14} /></button></div><div className="project-table">{projects.slice(0, 5).map((project) => <ProjectRow key={project.id} project={project} selected={false} onClick={() => onSelect(project)} />)}</div></div><div className="panel trend-card"><div className="panel-heading"><div><span className="eyebrow">Model readout</span><h2>Stage bottlenecks</h2></div><Activity size={18} className="muted-icon" /></div><div className="trend-summary"><strong>Compensation</strong><span>is the slowest-moving stage this month</span><ArrowUpRight size={16} /></div><SignalBar label="Compensation" value={72} tone="coral" /><SignalBar label="Dispute resolution" value={61} tone="ochre" /><SignalBar label="Rehabilitation & R&R" value={48} tone="teal" /><SignalBar label="Approval" value={26} tone="teal" /><div className="sparkline"><span>Apr 01</span><div className="spark-bars">{[36, 44, 42, 58, 49, 67, 62, 78, 73, 85, 82, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><span>May 27</span></div></div></section>
  </div>;
}

function ProjectDesk({ projects, selected, onSelect, onNew }: { projects: ProjectData[]; selected: ProjectData; onSelect: (p: ProjectData) => void; onNew: () => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All risk');
  const filtered = useMemo(() => projects.filter((p) => `${p.title} ${p.id} ${p.district} ${p.state}`.toLowerCase().includes(query.toLowerCase())).filter((p) => filter === 'All risk' || riskTone(p.riskLevel).label === filter), [projects, query, filter]);
  return <div className="page-stack"><section className="page-heading"><div><div className="eyebrow">ACTIVE REGISTER · {projects.length} tracked files</div><h1>Project desk</h1><p>One queue for every acquisition that needs a human decision.</p></div><button className="button primary" onClick={onNew}><FilePlus2 size={16} /> New assessment</button></section><div className="workspace-grid"><div className="panel project-panel"><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project, district or ID" /></div><div className="filter-tabs">{['All risk', 'Critical', 'High', 'Medium', 'Low'].map((f) => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><button className="icon-button"><Filter size={16} /></button></div><div className="table-head"><span>Project</span><span>Current stage</span><span>Score</span><span>Signal</span><span /></div><div className="project-table">{filtered.map((p) => <ProjectRow key={p.id} project={p} selected={selected.id === p.id} onClick={() => onSelect(p)} />)}{filtered.length === 0 && <div className="empty-state"><Search size={25} /><strong>No files match that search</strong><span>Try a project ID, district, or another risk band.</span></div>}</div></div><ProjectSnapshot project={selected} /></div></div>;
}

function ProjectSnapshot({ project }: { project: ProjectData }) {
  return <aside className="panel snapshot"><div className="snapshot-top"><div><span className="eyebrow">Selected file</span><h2>{project.title}</h2><span className="code-chip">{project.id}</span></div><RiskPill level={project.riskLevel} /></div><div className="score-orbit"><div className="orbit-ring" style={{ '--score': `${project.riskScore * 3.6}deg` } as React.CSSProperties}><strong>{project.riskScore}</strong><span>risk score</span></div><div className="delay-copy"><span>Likely delay</span><strong>{project.probabilityOfDelay}</strong><small>{project.delayPredictionText}</small></div></div><div className="snapshot-facts"><div><span>Current stage</span><strong>{project.phase}</strong></div><div><span>Land parcel</span><strong>{project.hectares} hectares</strong></div><div><span>Families affected</span><strong>{project.affectedFamilies}</strong></div></div><div className="snapshot-section"><div className="section-label">Top drivers <span>explainable model</span></div>{project.shapFactors.slice(0, 3).map((factor) => <div className="driver" key={factor.driver}><div className={`driver-arrow ${factor.vector === 'up' ? 'up' : 'down'}`}>{factor.vector === 'up' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}</div><span>{factor.driver}</span><strong>{factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}</strong></div>)}</div><button className="button full secondary"><FileText size={15} /> Open full project brief</button></aside>;
}

function RiskStudio({ projects, onSelect }: { projects: ProjectData[]; onSelect: (p: ProjectData) => void }) {
  const average = Math.round(projects.reduce((sum, p) => sum + p.riskScore, 0) / projects.length);
  return <div className="page-stack"><section className="page-heading"><div><div className="eyebrow">EXPLAINABLE PREDICTION LAYER</div><h1>Risk studio</h1><p>Turn model output into an operational next step.</p></div><div className="model-status"><span className="live-dot" /> Model v1.4.2 <small>validated 2 days ago</small></div></section><section className="studio-grid"><div className="panel model-card"><div className="panel-heading"><div><span className="eyebrow">National signal</span><h2>Risk distribution</h2></div><Sparkles size={18} className="muted-icon" /></div><div className="big-score"><strong>{average}</strong><span>average risk score</span><div className="score-change"><TrendingUp size={14} /> 8 pts above last month</div></div><div className="distribution"><div className="distribution-bar"><i className="low" style={{ width: '32%' }} /><i className="medium" style={{ width: '28%' }} /><i className="high" style={{ width: '24%' }} /><i className="critical" style={{ width: '16%' }} /></div><div className="distribution-key"><span><i className="legend-dot stable" /> Low <b>402</b></span><span><i className="legend-dot medium" /> Medium <b>350</b></span><span><i className="legend-dot high" /> High <b>300</b></span><span><i className="legend-dot critical" /> Critical <b>196</b></span></div></div></div><div className="panel explain-card"><div className="panel-heading"><div><span className="eyebrow">Signal anatomy</span><h2>What moves risk</h2></div><span className="confidence">86% confidence</span></div><div className="factor-stack"><SignalBar label="Legal / dispute load" value={82} tone="coral" /><SignalBar label="Compensation progress" value={69} tone="coral" /><SignalBar label="Notification age" value={54} tone="ochre" /><SignalBar label="Stakeholder response" value={31} tone="teal" /><SignalBar label="R&R readiness" value={22} tone="teal" /></div><div className="insight-callout"><ShieldCheck size={17} /><span>Strongest risk reducer: <b>clear title records</b> in early-stage projects.</span></div></div></section><section className="panel analysis-table"><div className="panel-heading"><div><span className="eyebrow">Review queue</span><h2>Files with model movement</h2></div><button className="text-button">Download CSV <ChevronRight size={14} /></button></div>{projects.map((p) => <button className="analysis-row" key={p.id} onClick={() => onSelect(p)}><div className="analysis-name"><span className={`signal-badge ${riskTone(p.riskLevel).className}`}><Activity size={14} /></span><div><strong>{p.title}</strong><span>{p.id} · {p.district}</span></div></div><div><span className="micro-label">Delay likelihood</span><strong>{p.probabilityOfDelay}</strong></div><div><span className="micro-label">Top driver</span><strong>{p.shapFactors[0]?.driver}</strong></div><RiskPill level={p.riskLevel} /><ChevronRight size={16} /></button>)}</section></div>;
}

function Registry({ parcels, onNew }: { parcels: ParcelRecord[]; onNew: () => void }) {
  return <div className="page-stack"><section className="page-heading"><div><div className="eyebrow">CADASTRAL RECORDS · {parcels.length} recent entries</div><h1>Parcel registry</h1><p>Keep the legal ground truth close to the risk signal.</p></div><button className="button primary" onClick={onNew}><FilePlus2 size={16} /> Register parcel</button></section><div className="panel registry-panel"><div className="registry-note"><ShieldCheck size={19} /><span><strong>Verified chain of custody.</strong> Every parcel record is linked to a project file and last synced by an assigned operator.</span></div><div className="registry-table-head"><span>Parcel ID</span><span>Owner / authority</span><span>Cadastral reference</span><span>State</span><span /></div>{parcels.map((parcel) => <div className="registry-row" key={parcel.id}><div><strong>{parcel.id}</strong><span>{parcel.deedRef}</span></div><span>{parcel.owner}</span><span className="mono">{parcel.cadastralRef}</span><span className={`status-text ${parcel.status.toLowerCase()}`}><CircleDot size={13} /> {parcel.status}</span><ChevronRight size={16} /></div>)}</div></div>;
}

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && sessionStorage.getItem('zv_splash_seen') !== 'true';
  });
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectData>(initialProjects[0]);
  const [parcels, setParcels] = useState<ParcelRecord[]>(initialParcels);
  const [stats, setStats] = useState<NationalStats>(initialNationalStats);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const navigate = (tab: ViewTab) => { setActiveTab(tab); setMobileNavOpen(false); };
  const selectProject = (project: ProjectData) => { setSelectedProject(project); if (activeTab === 'dashboard') setActiveTab('projects'); };
  const handleAddProject = (newProject: ProjectData) => { setProjects((prev) => [newProject, ...prev]); setSelectedProject(newProject); setStats((prev) => ({ ...prev, totalProjectsActive: prev.totalProjectsActive + 1 })); setParcels((prev) => [{ id: `PRC-${Date.now().toString().slice(-5)}`, owner: `${newProject.district} Land Development Authority`, deedRef: `Ref: ${newProject.id}`, cadastralRef: `CAD-${Math.floor(100 + Math.random() * 900)}-SEC-1`, geoCoords: `${newProject.lat} ${newProject.lon}`, status: 'SURVEYED' }, ...prev]); setIsNewEntryOpen(false); setActiveTab('projects'); };
  return <div className="app-shell"><aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}><div className="brand"><div className="brand-mark"><span /></div><div><strong>Zameen</strong><small>Vivaad / intelligence</small></div><button className="close-nav icon-button" onClick={() => setMobileNavOpen(false)}><X size={18} /></button></div><div className="nav-label">Workspace</div><nav>{navItems.map(({ id, label, icon: Icon, hint }) => <button key={id} className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => navigate(id)}><Icon size={18} strokeWidth={activeTab === id ? 2.2 : 1.8} /><span>{label}</span><small>{hint}</small>{activeTab === id && <i />}</button>)}</nav><div className="sidebar-spacer" /><div className="sidebar-status"><div className="status-mark"><CheckCircle2 size={16} /></div><div><strong>Registry synced</strong><span>Today, 08:45 IST</span></div></div><div className="user-card"><div className="avatar">AM</div><div><strong>Aditi Menon</strong><span>State administrator</span></div><MoreHorizontal size={17} /></div></aside><div className="main-shell"><header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><div className="crumb"><span>India / Land acquisition</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === activeTab)?.label}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-date"><CalendarDays size={15} /> 27 May 2024</div></div></header><main className="content"><>{activeTab === 'dashboard' && <Overview projects={projects} stats={stats} onSelect={selectProject} onNavigate={navigate} onReport={() => setIsReportOpen(true)} />}{activeTab === 'projects' && <ProjectDesk projects={projects} selected={selectedProject} onSelect={setSelectedProject} onNew={() => setIsNewEntryOpen(true)} />}{activeTab === 'analysis' && <RiskStudio projects={projects} onSelect={setSelectedProject} />}{activeTab === 'registry' && <Registry parcels={parcels} onNew={() => setIsNewEntryOpen(true)} />}{activeTab === 'archive' && <div className="page-stack"><section className="page-heading"><div><div className="eyebrow">CLOSED CASES · HISTORICAL LEDGER</div><h1>Archive</h1><p>Completed acquisitions, settlements, and possession transfers.</p></div></section><div className="archive-card"><div className="archive-graphic"><BookOpen size={34} /></div><div><span className="eyebrow">14,209 records indexed</span><h2>The paper trail, kept alive.</h2><p>Historical cases before 2023 are preserved here for comparison, audits, and the next model refresh.</p><button className="button secondary"><ClipboardList size={15} /> Browse archive</button></div></div></div>}</></main></div><NewProjectModal isOpen={isNewEntryOpen} onClose={() => setIsNewEntryOpen(false)} onAddProject={handleAddProject} /><ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} selectedProject={selectedProject} />{showIntro && <InitialSplash onComplete={() => setShowIntro(false)} />}</div>;
}

export default App;
