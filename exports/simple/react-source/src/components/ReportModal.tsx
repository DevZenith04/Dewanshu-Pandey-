import React, { useState, useEffect } from 'react';
import { ProjectData } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: ProjectData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProject?.id || 'NAT-OVERVIEW-2024',
            projectData: selectedProject || {
              title: 'National Land Acquisition Overview',
              district: 'Multiple Districts',
              state: 'India',
              riskScore: 78,
              riskLevel: 'HIGH',
              hectares: 84592,
              affectedFamilies: 12480,
              delayPredictionText: '+120 days average delay predicted across 37 critical risk zones',
            },
          }),
        });
        const data = await res.json();
        setReportMarkdown(data.reportMarkdown || 'Failed to generate report text.');
      } catch (err) {
        console.error(err);
        setReportMarkdown('Error connecting to report engine.');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [selectedProject]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden font-display my-8 relative">
        {/* Header */}
        <div className="bg-[#f0e6e2] border-b border-[#d7c2bd] p-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-wide text-[#001e2d]">
              EXECUTIVE LAND ACQUISITION &amp; DISPUTE BRIEF
            </h2>
            <p className="font-label italic text-xs text-[#85736f]">
              Certified ADM Magistrate Record • ZAMEEN VIVAAD AI V2.04
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-[#36675c] hover:bg-[#1c4f45] text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#d7c2bd] flex items-center justify-center text-[#001e2d] hover:bg-[#eae0dc]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 font-body text-sm text-[#001e2d]">
          {loading ? (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-3xl animate-spin text-[#874f43]">
                refresh
              </span>
              <p className="font-display text-sm text-[#85736f]">
                Generating official ADM Land Registry Executive Report using Gemini AI...
              </p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed bg-[#fdfaf8] p-4 rounded-lg border border-[#d7c2bd] text-[#001e2d]">
              {reportMarkdown}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f0e6e2] border-t border-[#d7c2bd] p-3 text-right font-label text-xs text-[#85736f]">
          System Reference: ADM-DOC-2024-OFFICIAL • Seal Verified
        </div>
      </div>
    </div>
  );
};
