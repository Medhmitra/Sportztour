'use client';

import React from 'react';
import { TrendingUp, Award, Activity } from 'lucide-react';

export default function ScoreboardPage() {
  const standings = [
    { rank: 1, team: 'Apex Titans', sport: 'Basketball', gp: 10, w: 9, l: 1, diff: '+92', pts: 28, code: 'APX' },
    { rank: 2, team: 'Blaze Warriors', sport: 'Basketball', gp: 10, w: 8, l: 2, diff: '+56', pts: 25, code: 'BWR' },
    { rank: 3, team: 'Royal Challengers', sport: 'Cricket', gp: 10, w: 8, l: 2, diff: '+42', pts: 24, code: 'RCB' },
    { rank: 4, team: 'Shadow Dragons', sport: 'Basketball', gp: 10, w: 7, l: 3, diff: '+12', pts: 22, code: 'SDG' },
    { rank: 5, team: 'Punjab Strikers', sport: 'Hockey', gp: 10, w: 7, l: 3, diff: '+18', pts: 21, code: 'PJS' },
    { rank: 6, team: 'United FC', sport: 'Soccer', gp: 10, w: 6, l: 4, diff: '+14', pts: 20, code: 'UFC' },
    { rank: 7, team: 'Strikers FC', sport: 'Soccer', gp: 10, w: 6, l: 4, diff: '-8', pts: 19, code: 'SFC' },
    { rank: 8, team: 'Berlin Spikers', sport: 'Volleyball', gp: 10, w: 5, l: 5, diff: '+4', pts: 15, code: 'BNS' },
    { rank: 9, team: 'Smashers TC', sport: 'Tennis', gp: 10, w: 4, l: 6, diff: '-10', pts: 12, code: 'SMH' },
    { rank: 10, team: 'Mumbai Kings', sport: 'Cricket', gp: 10, w: 3, l: 7, diff: '-28', pts: 9, code: 'MIK' },
  ];

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Scoreboard & Standings</h1>
          <p className="text-muted-foreground text-sm mt-1">Live standings, points differentiation, wins, losses, and tournament statistics.</p>
        </div>
      </header>

      {/* Leaderboard Table Container */}
      <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Global Championship Leaderboard</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-foreground uppercase tracking-wider">
                <th className="py-4 px-4 w-16">Rank</th>
                <th className="py-4 px-4">Team</th>
                <th className="py-4 px-4">Sport Category</th>
                <th className="py-4 px-4 text-center">Played (GP)</th>
                <th className="py-4 px-4 text-center text-emerald-600">Won (W)</th>
                <th className="py-4 px-4 text-center text-red-500">Lost (L)</th>
                <th className="py-4 px-4 text-center">Diff (+/-)</th>
                <th className="py-4 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standings.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-bold text-primary">#{row.rank}</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-[10px] font-black text-slate-500 flex items-center justify-center border border-slate-150 shadow-sm">
                      {row.code}
                    </div>
                    <span className="font-bold text-foreground">{row.team}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                      {row.sport}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold">{row.gp}</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">{row.w}</td>
                  <td className="py-4 px-4 text-center text-red-600 font-semibold">{row.l}</td>
                  <td className="py-4 px-4 text-center font-mono font-semibold">{row.diff}</td>
                  <td className="py-4 px-4 text-right font-extrabold text-foreground">{row.pts} PTS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
