import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NationalOverview } from './components/NationalOverview';
import { RiskEngineView } from './components/RiskEngineView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { ProjectRegisterView } from './components/ProjectRegisterView';
import { ParcelRegistryView } from './components/ParcelRegistryView';
import { NewProjectModal } from './components/NewProjectModal';
import { ReportModal } from './components/ReportModal';
import { InitialSplash } from './components/InitialSplash';
import { initialNationalStats, initialParcels, initialProjects } from './data/mockData';
import { NationalStats, ParcelRecord, ProjectData, ViewTab } from './types';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeen = sessionStorage.getItem('zv_splash_seen');
    return !prefersReducedMotion && hasSeen !== 'true';
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectData>(initialProjects[0]);
  const [parcels, setParcels] = useState<ParcelRecord[]>(initialParcels);
  const [stats, setStats] = useState<NationalStats>(initialNationalStats);

  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleSelectProject = (proj: ProjectData) => {
    setSelectedProject(proj);
  };

  const handleUpdateProject = (updated: ProjectData) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    if (selectedProject.id === updated.id) {
      setSelectedProject(updated);
    }
  };

  const handleAddProject = (newProj: ProjectData) => {
    setProjects((prev) => [newProj, ...prev]);
    setSelectedProject(newProj);
    setStats((prev) => ({
      ...prev,
      totalProjectsActive: prev.totalProjectsActive + 1,
      hectaresUnderSurvey: prev.hectaresUnderSurvey + Math.round(newProj.hectares),
      criticalRiskZones: newProj.riskScore >= 75 ? prev.criticalRiskZones + 1 : prev.criticalRiskZones,
    }));
    // Also create a parcel entry for the project
    const newParcel: ParcelRecord = {
      id: `PRC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}A`,
      owner: `${newProj.district} Land Development Authority`,
      deedRef: `Ref: ${newProj.id}`,
      cadastralRef: `CAD-${Math.floor(100 + Math.random() * 900)}-SEC-1`,
      geoCoords: `${newProj.lat} ${newProj.lon}`,
      status: 'SURVEYED',
    };
    setParcels((prev) => [newParcel, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2d] flex flex-col font-display selection:bg-[#874f43] selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewEntry={() => setIsNewEntryOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <NationalOverview
              stats={stats}
              projects={projects}
              onSelectProject={handleSelectProject}
              setActiveTab={setActiveTab}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'analysis' && (
            <RiskEngineView
              projects={projects}
              onSelectProject={handleSelectProject}
              setActiveTab={setActiveTab}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Toggle Sub-View between Lifecycle Register & Detailed Gazette Ledger */}
              <div className="bg-[#ffffff] border border-[#d7c2bd] p-2 rounded-xl shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-semibold text-xs text-[#85736f] uppercase px-2">
                    Viewing Ledger:
                  </span>
                  <span className="font-data-mono font-bold text-sm text-[#001e2d] bg-[#f0e6e2] px-3 py-1 rounded-md">
                    {selectedProject.id} • {selectedProject.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-display text-xs">
                  <span className="text-[#85736f]">Quick Switch:</span>
                  <select
                    value={selectedProject.id}
                    onChange={(e) => {
                      const found = projects.find((p) => p.id === e.target.value);
                      if (found) setSelectedProject(found);
                    }}
                    className="bg-[#fdfaf8] border border-[#d7c2bd] rounded-lg px-3 py-1 font-semibold text-[#001e2d]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.title} ({p.riskLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ProjectRegisterView
                project={selectedProject}
                onUpdateProject={handleUpdateProject}
                onOpenReport={() => setIsReportOpen(true)}
              />

              <ProjectDetailView
                project={selectedProject}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </div>
          )}

          {activeTab === 'registry' && (
            <ParcelRegistryView
              parcels={parcels}
              onOpenNewEntry={() => setIsNewEntryOpen(true)}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'archive' && (
            <div className="space-y-6 pb-12">
              <div className="border-b border-[#d7c2bd] pb-4">
                <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d]">
                  Archived Registrations
                </h1>
                <p className="font-label italic text-sm text-[#85736f]">
                  Historical completed land acquisitions and closed dispute cases.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-8 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#85736f]">
                  folder_special
                </span>
                <h3 className="font-display font-bold text-lg text-[#001e2d] uppercase">
                  14,209 Historical Cases Archived
                </h3>
                <p className="font-label text-xs text-[#85736f] max-w-md mx-auto">
                  All legal settlements, gazette notifications, and final possession transfer deeds prior to 2023 are indexed in the central district archives.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Initial Page Load Splash Screen */}
      {showSplash && (
        <InitialSplash onComplete={() => setShowSplash(false)} />
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        onAddProject={handleAddProject}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedProject={selectedProject}
      />
    </div>
  );
}

export default App;
