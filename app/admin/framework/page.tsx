'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function FrameworkAdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
        {/* Coded by Benjamin Bowler */}
      <nav className="mb-6 flex items-center gap-4">
        <Link to="/framework" className="text-slate-900 font-semibold">← View Framework</Link>
        <h1 className="text-xl font-bold">Framework Admin</h1>
      </nav>

      <div className="bg-white rounded-lg border p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Universal Commercial Framework Admin</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 text-green-700 p-3 rounded">
            ✅ Framework is now fully managed via Supabase
          </div>
          
          <p className="text-slate-600">
            Use the functions in <code>lib/framework-admin.ts</code> to programmatically manage content:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
            <li><code>updatePillar()</code> - Edit pillar details</li>
            <li><code>addContentSection()</code> - Add content to a pillar</li>
            <li><code>addTable()</code> - Add data tables</li>
            <li><code>exportPillar()</code> - Backup pillar data</li>
            <li><code>importPillar()</code> - Import pillar data</li>
          </ul>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-500">
              Current database state: <strong>25 pillars, 49 content sections, 28 tables, 108 rows</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
