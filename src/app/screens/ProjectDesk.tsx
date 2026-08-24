import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, ChevronRight, CircleDot, FilePlus2, FileText, Filter, FolderKanban, Globe2, MapPinned, MoreHorizontal, Search, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import type { NationalStats, ParcelRecord, ProjectData, ViewTab } from '../../types';
import { Metric, MiniMap, ProjectRow, RiskPill, SignalBar, riskTone } from '../ui';

import { ProjectSnapshot } from "./ProjectSnapshot";

export function ProjectDesk({ projects, selected, onSelect, onNew }: { projects: ProjectData[]; selected: ProjectData; onSelect: (p: ProjectData) => void; onNew: () => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All risk');
  const filtered = useMemo(() => projects.filter((p) => `${p.title} ${p.id} ${p.district} ${p.state}`.toLowerCase().includes(query.toLowerCase())).filter((p) => filter === 'All risk' || riskTone(p.riskLevel).label === filter), [projects, query, filter]);
  return <div className="page-stack"><section className="page-heading"><div><div className="eyebrow">ACTIVE REGISTER · {projects.length} tracked files</div><h1>Project desk</h1><p>One queue for every acquisition that needs a human decision.</p></div><button className="button primary" onClick={onNew}><FilePlus2 size={16} /> New assessment</button></section><div className="workspace-grid"><div className="panel project-panel"><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project, district or ID" /></div><div className="filter-tabs">{['All risk', 'Critical', 'High', 'Medium', 'Low'].map((f) => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><button className="icon-button"><Filter size={16} /></button></div><div className="table-head"><span>Project</span><span>Current stage</span><span>Score</span><span>Signal</span><span /></div><div className="project-table">{filtered.map((p) => <ProjectRow key={p.id} project={p} selected={selected.id === p.id} onClick={() => onSelect(p)} />)}{filtered.length === 0 && <div className="empty-state"><Search size={25} /><strong>No files match that search</strong><span>Try a project ID, district, or another risk band.</span></div>}</div></div><ProjectSnapshot project={selected} /></div></div>;
}
