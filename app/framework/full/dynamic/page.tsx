/**
 * Dynamic Framework Full Page
 * Loads Universal Commercial Framework from Supabase
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompleteFrameworkData, getPillarDetail } from '@/lib/framework-api';
import type {
  FrameworkPillar,
  FrameworkContentSection,
  FrameworkTable,
  FrameworkDocument
} from '@/types/framework-db';

export default function DynamicFrameworkPage() {
  const [pillars, setPillars] = useState<FrameworkPillar[]>([]);
  const [document, setDocument] = useState<FrameworkDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null);
  const [pillarDetail, setPillarDetail] = useState<any>(null);

  useEffect(() => {
    loadFrameworkData();
  }, []);

  async function loadFrameworkData() {
    try {
      setLoading(true);
      const data = await getCompleteFrameworkData();
      setPillars(data.pillars);
      setDocument(data.document);
      setError(null);
    } catch (err) {
      console.error('Error loading framework:', err);
      setError('Failed to load framework data from database');
    } finally {
      setLoading(false);
    }
  }

  async function loadPillarDetail(pillarNumber: number) {
    try {
      setSelectedPillar(pillarNumber);
      const detail = await getPillarDetail(pillarNumber);
      setPillarDetail(detail);
    } catch (err) {
      console.error('Error loading pillar detail:', err);
    }
  }

  if (loading) {
    return (
        {/* Coded by Benjamin Bowler */}
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-4">Error Loading Framework</h1>
          <p className="text-red-600 font-mono text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>
          <button onClick={loadFrameworkData} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/framework" className="text-slate-900 font-semibold hover:text-red-600">
            ← Back to Summary
          </Link>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Live from Supabase
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">25 Pillars</h2>
              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                {pillars.map((pillar) => (
                  <button
                    key={pillar.id}
                    onClick={() => loadPillarDetail(pillar.pillar_number)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedPillar === pillar.pillar_number
                        ? 'bg-red-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-semibold">P{pillar.pillar_number}</span>: {pillar.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <header className="mb-8 pb-8 border-b-2 border-slate-900">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Universal Commercial Framework</h1>
              <p className="text-xl text-slate-600 italic mb-4">{document?.description}</p>
              <div className="flex gap-4 text-sm text-slate-500">
                <span>Version: {document?.version}</span>
                <span>•</span>
                <span>{document?.total_pillars} Pillars</span>
                <span>•</span>
                <span>{document?.stakeholder_hubs} Hubs</span>
              </div>
            </header>

            {/* Pillar Detail */}
            {pillarDetail && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Pillar {pillarDetail.pillar.pillar_number}: {pillarDetail.pillar.name}
                </h2>
                
                {/* Content Sections */}
                {pillarDetail.content_sections?.map((section: FrameworkContentSection) => (
                  <div key={section.id} className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">{section.title}</h3>
                    {section.content && (
                      <div className="text-slate-600 whitespace-pre-wrap">{section.content}</div>
                    )}
                  </div>
                ))}

                {/* Tables */}
                {pillarDetail.tables?.map((table: FrameworkTable & { rows: any[] }) => (
                  <div key={table.id} className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">{table.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-100">
                            {table.headers?.map((header: string, idx: number) => (
                              <th key={idx} className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows?.map((row: any) => (
                            <tr key={row.id} className="border-b border-slate-200">
                              {row.cells?.map((cell: string, idx: number) => (
                                <td key={idx} className="border border-slate-200 px-4 py-2 text-sm">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!pillarDetail && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">Select a pillar from the sidebar to view details</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
