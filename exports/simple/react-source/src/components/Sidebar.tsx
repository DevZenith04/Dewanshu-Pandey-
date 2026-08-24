import React from 'react';
import { ViewTab } from '../types';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenReport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
}) => {
  const navItems: { id: ViewTab; label: string; desc: string }[] = [
    { id: 'dashboard', label: 'National Overview', desc: 'Aggregated Survey Data' },
    { id: 'projects', label: 'Project Ledger', desc: 'Cadastral Lifecycle & Risk' },
    { id: 'analysis', label: 'Risk Engine', desc: 'Forecast & Bottlenecks' },
    { id: 'registry', label: 'Parcel Registry', desc: 'Acquisition Database' },
    { id: 'archive', label: 'Archive', desc: 'Closed Registrations' },
  ];

  return (
    <aside className="w-64 bg-[#f5faff] border-r border-[#d7c2bd] flex flex-col justify-between h-[calc(100vh-57px)] sticky top-[57px] shrink-0 p-4 font-display">
      <div>
        {/* Government Emblem / Header Banner */}
        <div className="bg-[#ffffff] border border-[#d7c2bd] p-3 rounded-lg mb-6 shadow-2xs text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#874f43]"></div>
          <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center rounded-full bg-[#f3e0c8] text-[#874f43] border border-[#d7c2bd]">
            <span className="font-display font-bold text-xs">ADM</span>
          </div>
          <h2 className="font-display font-bold text-sm tracking-widest text-[#001e2d] uppercase">
            ADM REGISTRY
          </h2>
          <p className="font-label text-[11px] text-[#85736f]">
            V2.04-SURVEY ENGINE
          </p>
        </div>

        {/* Plain Text Navigation List with Hairline Dividers */}
        <div>
          <p className="font-label text-[10px] text-[#85736f] uppercase tracking-wider px-2 mb-2 font-semibold">
            REGISTRY DIRECTORY
          </p>
          <div className="border-t border-b border-[#d7c2bd] divide-y divide-[#d7c2bd]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left py-3 px-3 block transition-colors bg-transparent ${
                    isActive
                      ? 'border-l-4 border-[#1B2A2F] text-[#001e2d] font-bold'
                      : 'border-l-4 border-transparent text-[#524340] hover:text-[#001e2d] hover:bg-[#f0e6e2]/40 font-medium'
                  }`}
                >
                  <div className="text-xs uppercase font-display tracking-wider leading-none">
                    {item.label}
                  </div>
                  <div className="font-label text-[10px] text-[#85736f] leading-tight mt-1">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA & System Status */}
      <div className="space-y-3 pt-4 border-t border-[#d7c2bd]">
        <button
          onClick={onOpenReport}
          className="w-full bg-[#36675c] hover:bg-[#1c4f45] text-white font-display font-semibold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 uppercase tracking-wider transition-all"
        >
          <span>Generate Report</span>
        </button>

        <div className="bg-[#ffffff] border border-[#d7c2bd] p-2.5 rounded-lg text-xs space-y-1 font-label">
          <div className="flex items-center justify-between">
            <span className="text-[#85736f]">System Status:</span>
            <span className="flex items-center space-x-1 text-[#36675c] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36675c]"></span>
              <span>ONLINE</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#85736f]">
            <span>Database Sync:</span>
            <span>2024.05.24</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

