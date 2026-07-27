'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Check, Edit2 } from 'lucide-react';

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  venue: string;
  sport: string;
  scoreA?: string | number;
  scoreB?: string | number;
  status?: string; // e.g. "Scheduled", "Completed", "Live"
}

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([
    { id: 1, teamA: 'Apex Titans', teamB: 'Blaze Warriors', date: '2026-07-25', time: '18:00 UTC', venue: 'Main Arena Court 1', sport: 'Basketball', status: 'Scheduled' },
    { id: 2, teamA: 'Viper Squad', teamB: 'Shadow Dragons', date: '2026-07-26', time: '20:30 UTC', venue: 'Central Arena Court 2', sport: 'Basketball', status: 'Scheduled' },
    { id: 3, teamA: 'India', teamB: 'Australia', date: '2026-07-27', time: '14:00 UTC', venue: 'Wankhede Cricket Stadium', sport: 'Cricket', status: 'Scheduled' },
    { id: 4, teamA: 'England', teamB: 'South Africa', date: '2026-07-28', time: '10:30 UTC', venue: 'Lord\'s Cricket Ground', sport: 'Cricket', status: 'Scheduled' },
    { id: 5, teamA: 'Strikers FC', teamB: 'United FC', date: '2026-07-29', time: '19:45 UTC', venue: 'City Soccer Ground', sport: 'Soccer', status: 'Scheduled' },
    { id: 6, teamA: 'India', teamB: 'Germany', date: '2026-07-30', time: '16:00 UTC', venue: 'National Hockey Stadium', sport: 'Hockey', status: 'Scheduled' },
    { id: 7, teamA: 'Berlin Spikers', teamB: 'Paris Volley', date: '2026-07-31', time: '17:30 UTC', venue: 'Arena Hall A', sport: 'Volleyball', status: 'Scheduled' },
    { id: 8, teamA: 'Smashers TC', teamB: 'Aces Club', date: '2026-08-01', time: '15:00 UTC', venue: 'Tennis Court Central', sport: 'Tennis', status: 'Scheduled' },
  ]);

  // Modals & Notifications
  const [selectedMatchToManage, setSelectedMatchToManage] = useState<Match | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Edit Match States
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editStatus, setEditStatus] = useState('Scheduled');
  const [editScoreA, setEditScoreA] = useState('');
  const [editScoreB, setEditScoreB] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Populate editor form fields when managing match
  const openManageModal = (match: Match) => {
    setSelectedMatchToManage(match);
    setEditDate(match.date);
    setEditTime(match.time);
    setEditVenue(match.venue);
    setEditStatus(match.status || 'Scheduled');
    setEditScoreA(match.scoreA !== undefined ? match.scoreA.toString() : '');
    setEditScoreB(match.scoreB !== undefined ? match.scoreB.toString() : '');
  };

  // Save changes to match in state
  const handleSaveManage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchToManage) return;

    setMatches(prev => prev.map(m => {
      if (m.id === selectedMatchToManage.id) {
        return {
          ...m,
          date: editDate,
          time: editTime,
          venue: editVenue,
          status: editStatus,
          scoreA: editStatus === 'Completed' || editStatus === 'Live' ? (editScoreA !== '' ? editScoreA : 0) : undefined,
          scoreB: editStatus === 'Completed' || editStatus === 'Live' ? (editScoreB !== '' ? editScoreB : 0) : undefined,
        };
      }
      return m;
    }));

    setSelectedMatchToManage(null);
    triggerToast("Match details updated successfully.");
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto relative">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 apple-glass border border-emerald-100 apple-card-shadow px-4 py-3 rounded-2xl flex items-center space-x-3 z-50 animate-bounce">
          <div className="bg-emerald-500 text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Success</p>
            <p className="text-[11px] text-muted-foreground">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">Calendar schedule of upcoming matches, fixtures, and court assignments.</p>
        </div>
      </header>

      {/* Schedule Fixtures list */}
      <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl divide-y divide-slate-100 overflow-hidden">
        {matches.map((match) => (
          <div key={match.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition duration-150">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-primary border border-blue-100/50 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-foreground">{match.teamA} vs {match.teamB}</h3>
                  
                  {/* Status Badge */}
                  {match.status && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      match.status === 'Live' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                      match.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {match.status}
                    </span>
                  )}

                  {/* Render Score if Completed/Live */}
                  {(match.status === 'Completed' || match.status === 'Live') && match.scoreA !== undefined && (
                    <span className="text-xs font-mono font-black bg-slate-100 px-2 py-0.5 rounded text-foreground">
                      ({match.scoreA} - {match.scoreB})
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {match.sport} • {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{match.time}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{match.venue}</span>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => openManageModal(match)}
                  className="bg-slate-100 text-foreground px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200/80 transition duration-150 flex items-center gap-1 border border-slate-200/20 shadow-sm"
                >
                  <Edit2 className="w-3 h-3 text-primary" />
                  <span>Manage</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Manage Match Modal Form */}
      {selectedMatchToManage && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-foreground leading-tight">Manage Match</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{selectedMatchToManage.teamA} vs {selectedMatchToManage.teamB}</p>
              </div>
              <button onClick={() => setSelectedMatchToManage(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveManage} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Match Date</label>
                  <input 
                    type="date" 
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Start Time</label>
                  <input 
                    type="text" 
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Venue / Court</label>
                  <input 
                    type="text" 
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Match Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Conditional Score Fields */}
              {(editStatus === 'Completed' || editStatus === 'Live') && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 animate-fadeIn">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">Log Live Scores</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase">{selectedMatchToManage.teamA}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 98 or 184/4"
                        value={editScoreA}
                        onChange={(e) => setEditScoreA(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase">{selectedMatchToManage.teamB}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 92 or 142/6"
                        value={editScoreB}
                        onChange={(e) => setEditScoreB(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setSelectedMatchToManage(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-foreground font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-primary/10 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
