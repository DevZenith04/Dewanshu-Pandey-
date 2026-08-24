import React from 'react';
import { ViewTab } from '../types';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenNewEntry: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewEntry,
  onOpenReport,
}) => {
  return (
    <header className="bg-[#f5faff] border-b border-[#d7c2bd] px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand & Emblem Title */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-[#874f43] text-white flex items-center justify-center font-display font-bold text-lg shadow-sm border border-[#6f382d]">
          ZV
        </div>
        <div>
          <h1 className="font-display font-bold text-xl md:text-2xl tracking-wider text-[#001e2d] leading-none uppercase">
            ZAMEEN VIVAAD AI
          </h1>
          <p className="font-label text-xs text-[#85736f] tracking-tight">
            ADM REGISTRY V2.04-SURVEY
          </p>
        </div>
      </div>

      {/* Top Navigation Links */}
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-display text-sm uppercase tracking-wide">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#874f43] text-white font-semibold shadow-xs'
              : 'text-[#001e2d] hover:bg-[#eae0dc]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'projects'
              ? 'bg-[#874f43] text-white font-semibold shadow-xs'
              : 'text-[#001e2d] hover:bg-[#eae0dc]'
          }`}
        >
          Project Ledger
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'analysis'
              ? 'bg-[#874f43] text-white font-semibold shadow-xs'
              : 'text-[#001e2d] hover:bg-[#eae0dc]'
          }`}
        >
          Risk Engine
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'registry'
              ? 'bg-[#874f43] text-white font-semibold shadow-xs'
              : 'text-[#001e2d] hover:bg-[#eae0dc]'
          }`}
        >
          Parcel Registry
        </button>
      </nav>

      {/* Actions & Officer Profile */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onOpenNewEntry}
          className="bg-[#874f43] hover:bg-[#6f382d] text-white font-display font-semibold text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full shadow-xs flex items-center space-x-1.5 uppercase transition-all tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>+ New Entry</span>
        </button>

        <button
          onClick={onOpenReport}
          title="Generate Executive Report"
          className="bg-[#f0e6e2] hover:bg-[#e4d6d0] text-[#001e2d] border border-[#d7c2bd] font-display text-xs px-2.5 py-1.5 rounded-full flex items-center space-x-1 transition-all"
        >
          <span className="material-symbols-outlined text-base">description</span>
          <span className="hidden sm:inline">Report</span>
        </button>

        <div className="flex items-center space-x-2 pl-2 border-l border-[#d7c2bd]">
          <div className="relative">
            <span className="material-symbols-outlined text-[#85736f] p-1.5 rounded-full hover:bg-[#eae0dc] cursor-pointer">
              notifications
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#36675c] text-white font-display font-semibold flex items-center justify-center text-xs shadow-xs border border-[#1c4f45]">
              DM
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-display font-semibold text-xs text-[#001e2d] leading-none">
                Officer In-Charge
              </p>
              <p className="font-label text-[10px] text-[#85736f]">
                ADM (Land)
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
