import React, { useState } from 'react';
import { Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Menu, MoreHorizontal, Search, X } from 'lucide-react';
import { NewProjectModal } from './components/NewProjectModal';
import { ReportModal } from './components/ReportModal';
import { InitialSplash } from './components/InitialSplash';
import { initialNationalStats, initialParcels, initialProjects } from './data/mockData';
import { NationalStats, ParcelRecord, ProjectData, ViewTab } from './types';
import { navItems } from './lib/navigation';
import { Overview } from './app/screens/Overview';
import { ProjectDesk } from './app/screens/ProjectDesk';
import { RiskStudio } from './app/screens/RiskStudio';
import { Registry } from './app/screens/Registry';











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
