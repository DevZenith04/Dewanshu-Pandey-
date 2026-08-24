import React, { useState } from 'react';
import { ParcelRecord } from '../types';

interface ParcelRegistryViewProps {
  parcels: ParcelRecord[];
  onOpenNewEntry: () => void;
  onOpenReport: () => void;
}

export const ParcelRegistryView: React.FC<ParcelRegistryViewProps> = ({
  parcels,
  onOpenNewEntry,
  onOpenReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = parcels.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cadastralRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 font-display">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c2bd] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-[#001e2d]">
              Acquisition Database
            </h1>
            <span className="bg-[#f0e6e2] text-[#874f43] border border-[#d7c2bd] text-xs font-data-mono px-2.5 py-0.5 rounded font-bold">
              CADASTRAL PARCEL LEDGER
            </span>
          </div>
          <p className="font-label italic text-sm text-[#85736f]">
            Registry of active and historic land parcel acquisitions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewEntry}
            className="bg-[#874f43] hover:bg-[#6f382d] text-white text-xs uppercase px-4 py-2 rounded-full font-semibold shadow-xs flex items-center space-x-1 tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Add Parcel Record</span>
          </button>
          <button
            onClick={onOpenReport}
            className="bg-[#36675c] hover:bg-[#1c4f45] text-white text-xs uppercase px-4 py-2 rounded-full font-semibold shadow-xs flex items-center space-x-1 tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-sm">file_download</span>
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#85736f] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search Parcel ID, Registered Owner, or Cadastral Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fdfaf8] border border-[#d7c2bd] rounded-full text-sm text-[#001e2d] focus:outline-none focus:border-[#874f43]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs uppercase text-[#85736f] font-semibold shrink-0">
            Status:
          </span>
          {['ALL', 'ACQUIRED', 'SURVEYED', 'NOTIFIED', 'DISPUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs uppercase px-3 py-1.5 rounded-full border transition-all ${
                statusFilter === st
                  ? 'bg-[#874f43] text-white border-[#874f43] font-semibold'
                  : 'bg-white text-[#001e2d] border-[#d7c2bd] hover:bg-[#eae0dc]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Parcel Table */}
      <div className="bg-[#ffffff] border border-[#d7c2bd] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0e6e2] border-b border-[#d7c2bd] text-xs uppercase tracking-wider text-[#001e2d]">
                <th className="py-3 px-4 font-bold">PARCEL ID</th>
                <th className="py-3 px-4 font-bold">REGISTERED OWNER / ENTITY</th>
                <th className="py-3 px-4 font-bold">CADASTRAL REF</th>
                <th className="py-3 px-4 font-bold">GEO-COORDINATES</th>
                <th className="py-3 px-4 font-bold text-center">ACQUISITION STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c2bd] font-body text-sm">
              {filtered.map((parcel) => {
                let badgeStyle = 'bg-[#b9eddf] text-[#1c4f45] border-[#36675c]';
                if (parcel.status === 'DISPUTED') {
                  badgeStyle = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] font-bold';
                } else if (parcel.status === 'NOTIFIED') {
                  badgeStyle = 'bg-[#f3e0c8] text-[#6a5c4a] border-[#6a5c4a]';
                } else if (parcel.status === 'SURVEYED') {
                  badgeStyle = 'bg-[#f0e6e2] text-[#001e2d] border-[#d7c2bd]';
                }

                return (
                  <tr key={parcel.id} className="hover:bg-[#f5faff] transition-colors">
                    <td className="py-3.5 px-4 font-data-mono font-bold text-[#001e2d]">
                      {parcel.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-display font-semibold text-[#001e2d]">
                        {parcel.owner}
                      </div>
                      <div className="font-label text-xs text-[#85736f]">
                        {parcel.deedRef}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-data-mono text-xs text-[#874f43]">
                      {parcel.cadastralRef}
                    </td>
                    <td className="py-3.5 px-4 font-data-mono text-xs text-[#001e2d]">
                      {parcel.geoCoords}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-xs font-display font-semibold uppercase tracking-wider ${badgeStyle}`}
                      >
                        {parcel.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-[#fdfaf8] border-t border-[#d7c2bd] flex items-center justify-between text-xs font-display text-[#85736f]">
          <span>SHOWING 1-{filtered.length} OF 2,492 RECORDS</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white border border-[#d7c2bd] rounded hover:bg-[#eae0dc] uppercase font-semibold text-[11px]">
              PREV
            </button>
            <span className="font-bold text-[#001e2d]">1</span>
            <button className="px-3 py-1 bg-white border border-[#d7c2bd] rounded hover:bg-[#eae0dc] uppercase font-semibold text-[11px]">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
