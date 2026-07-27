'use client';

import React from 'react';
import { User, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure profile states, user roles, and monitor backend database engines.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-6 md:p-8 space-y-8 max-w-3xl">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-primary" />
            <span>Profile & Account</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
              <input type="text" value="admin" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Role</label>
              <input type="text" value="Super Administrator" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-primary" />
            <span>Database Integration</span>
          </h2>
          <div className="space-y-3.5 text-sm font-semibold text-muted-foreground">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span>PostgreSQL Connection</span>
              <span className="text-emerald-600 font-bold">Connected</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span>Redis Cache Engine</span>
              <span className="text-emerald-600 font-bold">Connected (Pub/Sub Active)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Django Channels Version</span>
              <span className="text-foreground">4.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
