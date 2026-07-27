'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Calendar, Users, X, Check, Search, Trash2, Edit2 } from 'lucide-react';

const DEFAULT_TOURNAMENTS = [
  { id: 1, name: 'Championship Cup 2026', sport: 'Basketball', teams: 16, start: 'Jul 28, 2026', status: 'Upcoming' },
  { id: 2, name: 'Super League Division 1', sport: 'Soccer', teams: 20, start: 'Jun 10, 2026', status: 'Ongoing' },
  { id: 3, name: 'Summer Tennis Open', sport: 'Tennis', teams: 32, start: 'May 15, 2026', status: 'Finished' },
  { id: 4, name: 'National Hockey League', sport: 'Hockey', teams: 12, start: 'Aug 02, 2026', status: 'Upcoming' },
  { id: 5, name: 'Pro Volleyball Series', sport: 'Volleyball', teams: 8, start: 'Jun 22, 2026', status: 'Ongoing' },
  { id: 6, name: 'All India Cricket League', sport: 'Cricket', teams: 10, start: 'Sep 05, 2026', status: 'Upcoming' },
];

const DEFAULT_TEAMS = [
  { id: 1, name: 'Apex Titans', organization: 'Apex Sports Academy', playersCount: 5, code: 'APX', sport: 'Basketball', playersList: ['M. Jordan (G)', 'K. Bryant (G)', 'L. James (F)', 'K. Durant (F)', 'S. O\'Neal (C)'] },
  { id: 2, name: 'Shadow Dragons', organization: 'Darkwood Athletic Club', playersCount: 5, code: 'SDG', sport: 'Basketball', playersList: ['S. Curry (G)', 'J. Harden (G)', 'K. Leonard (F)', 'G. Antetokounmpo (F)', 'N. Jokic (C)'] },
  { id: 3, name: 'Blaze Warriors', organization: 'Warriors Union', playersCount: 5, code: 'BWR', sport: 'Basketball', playersList: ['D. Lillard (G)', 'D. Booker (G)', 'J. Tatum (F)', 'A. Davis (F)', 'J. Embiid (C)'] },
  { id: 4, name: 'Strikers FC', organization: 'Strikers Association', playersCount: 6, code: 'SFC', sport: 'Soccer', playersList: ['L. Messi (FW)', 'L. Suarez (FW)', 'Neymar Jr (FW)', 'Sergio Busquets (MF)', 'Jordi Alba (DF)', 'Alisson (GK)'] },
  { id: 5, name: 'United FC', organization: 'Manchester Alliance', playersCount: 6, code: 'UFC', sport: 'Soccer', playersList: ['E. Haaland (FW)', 'K. De Bruyne (MF)', 'B. Silva (MF)', 'Rodri (MF)', 'P. Foden (FW)', 'Ederson (GK)'] },
  { id: 6, name: 'Royal Challengers', organization: 'Bangalore Sports', playersCount: 6, code: 'RCB', sport: 'Cricket', playersList: ['V. Kohli (Batter)', 'F. du Plessis (Captain)', 'G. Maxwell (All-Rounder)', 'M. Siraj (Bowler)', 'D. Karthik (WK)', 'R. Patidar (Batter)'] },
  { id: 7, name: 'Mumbai Kings', organization: 'Mumbai Cricket Union', playersCount: 6, code: 'MIK', sport: 'Cricket', playersList: ['R. Sharma (Captain)', 'H. Pandya (All-Rounder)', 'S. Yadav (Batter)', 'J. Bumrah (Bowler)', 'I. Kishan (WK)', 'T. David (All-Rounder)'] },
  { id: 8, name: 'Punjab Strikers', organization: 'Punjab Hockey Academy', playersCount: 6, code: 'PJS', sport: 'Hockey', playersList: ['Harmanpreet Singh (Captain)', 'PR Sreejesh (GK)', 'Mandeep Singh (Forward)', 'Manpreet Singh (Midfielder)', 'Amit Rohidas (Defender)', 'Abhishek (Forward)'] },
  { id: 9, name: 'Berlin Spikers', organization: 'Berlin Volleyball Club', playersCount: 5, code: 'BNS', sport: 'Volleyball', playersList: ['Y. Ishikawa (Spiker)', 'Y. Nishida (Spiker)', 'R. Takahashi (Spiker)', 'T. Sekita (Setter)', 'S. Kagawa (Libero)'] },
  { id: 10, name: 'Smashers TC', organization: 'Smashers Tennis Club', playersCount: 6, code: 'SMH', sport: 'Tennis', playersList: ['R. Federer', 'R. Nadal', 'N. Djokovic', 'C. Alcaraz', 'J. Sinner', 'I. Swiatek'] }
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any | null>(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formSport, setFormSport] = useState('Cricket');
  const [formTeams, setFormTeams] = useState('16');
  const [formDate, setFormDate] = useState('2026-08-15');
  const [formStatus, setFormStatus] = useState('Upcoming');
  const [formTeamA, setFormTeamA] = useState('India');
  const [formTeamB, setFormTeamB] = useState('Australia');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tournaments');
    if (saved) {
      setTournaments(JSON.parse(saved));
    } else {
      localStorage.setItem('tournaments', JSON.stringify(DEFAULT_TOURNAMENTS));
      setTournaments(DEFAULT_TOURNAMENTS);
    }

    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    } else {
      localStorage.setItem('teams', JSON.stringify(DEFAULT_TEAMS));
      setTeams(DEFAULT_TEAMS);
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Compute available teams list dynamically based on formSport
  const getAvailableTeams = () => {
    const sportTeams = teams.filter(t => t.sport.toLowerCase() === formSport.toLowerCase()).map(t => t.name);
    return sportTeams.length > 0 ? sportTeams : [];
  };

  const availableTeams = getAvailableTeams();

  // Update dynamic team selectors when formSport changes or teams load
  useEffect(() => {
    const list = getAvailableTeams();
    if (list.length > 0) {
      setFormTeamA(list[0]);
      setFormTeamB(list[1] || list[0]);
    }
  }, [formSport, teams]);

  // Open Modal for New Tournament
  const handleOpenNewModal = () => {
    setEditingTournament(null);
    setFormName('');
    setFormSport('Cricket');
    setFormTeams('16');
    setFormDate('2026-08-15');
    setFormStatus('Upcoming');
    setIsModalOpen(true);
  };

  // Open Modal for Editing Tournament
  const handleOpenEditModal = (t: any) => {
    setEditingTournament(t);
    setFormName(t.name);
    setFormSport(t.sport);
    setFormTeams(t.teams.toString());
    
    try {
      const d = new Date(t.start);
      if (!isNaN(d.getTime())) {
        setFormDate(d.toISOString().split('T')[0]);
      } else {
        setFormDate('2026-08-15');
      }
    } catch {
      setFormDate('2026-08-15');
    }

    setFormStatus(t.status === 'Ongoing' ? 'Ongoing' : t.status);
    setIsModalOpen(true);
  };

  // Delete Tournament
  const handleDeleteTournament = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      const updated = tournaments.filter(t => t.id !== id);
      setTournaments(updated);
      localStorage.setItem('tournaments', JSON.stringify(updated));
    }
  };

  // Submit Handler
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (formTeamA === formTeamB) {
      alert("Please select two different teams!");
      return;
    }

    const dateObj = new Date(formDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (editingTournament) {
      const oldName = editingTournament.name;
      const newName = formName;

      // Update existing tournament
      const updated = tournaments.map(t => {
        if (t.id === editingTournament.id) {
          return {
            ...t,
            name: formName,
            sport: formSport,
            teams: Number(formTeams),
            start: formattedDate,
            status: formStatus
          };
        }
        return t;
      });
      setTournaments(updated);
      localStorage.setItem('tournaments', JSON.stringify(updated));

      // Propagate name change to matches
      const savedMatches = localStorage.getItem('matches');
      if (savedMatches) {
        const matchesList = JSON.parse(savedMatches);
        const updatedMatches = matchesList.map((m: any) => {
          if (m.tournament === oldName) {
            return {
              ...m,
              tournament: newName,
              sport: formSport
            };
          }
          return m;
        });
        localStorage.setItem('matches', JSON.stringify(updatedMatches));
      }
    } else {
      // Add new tournament
      const newTournament = {
        id: Date.now(),
        name: formName,
        sport: formSport,
        teams: Number(formTeams),
        start: formattedDate,
        status: formStatus === 'Ongoing' || formStatus === 'Live' ? 'Ongoing' : formStatus
      };

      const updated = [newTournament, ...tournaments];
      setTournaments(updated);
      localStorage.setItem('tournaments', JSON.stringify(updated));

      // Create notification alert for regular users
      const newNotif = {
        id: Date.now() + 2,
        message: `New tournament "${formName}" (${formSport}) has been created!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      const savedNotifs = localStorage.getItem('notifications');
      const notifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      localStorage.setItem('notifications', JSON.stringify([newNotif, ...notifs]));

      // Also auto-generate a sample match using the USER'S selected relevant teams
      const savedMatches = localStorage.getItem('matches');
      const matches = savedMatches ? JSON.parse(savedMatches) : [];
      const newMatch = {
        id: Date.now() + 1,
        sport: formSport,
        tournament: formName,
        teamA: formTeamA,
        teamB: formTeamB,
        scoreA: formStatus === 'Finished' ? (formSport === 'Cricket' ? '182/4' : 3) : formStatus === 'Ongoing' || formStatus === 'Live' ? (formSport === 'Cricket' ? '42/0' : 1) : '-',
        scoreB: formStatus === 'Finished' ? (formSport === 'Cricket' ? '146/8' : 1) : formStatus === 'Ongoing' || formStatus === 'Live' ? (formSport === 'Cricket' ? '38/1' : 0) : '-',
        status: formStatus === 'Finished' ? 'Completed' : formStatus === 'Ongoing' || formStatus === 'Live' ? 'Live' : 'Scheduled',
        category: formStatus === 'Ongoing' || formStatus === 'Live' ? 'live' : formStatus.toLowerCase()
      };
      const updatedMatches = [newMatch, ...matches];
      localStorage.setItem('matches', JSON.stringify(updatedMatches));
    }

    setIsModalOpen(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  const sports = ['Cricket', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Hockey'];
  const isAdmin = currentUser?.role === 'admin';

  // Filter tournaments dynamically by search query
  const filteredTournaments = tournaments.filter(t => {
    const query = searchQuery.trim().toLowerCase();
    return query === '' || 
      t.name.toLowerCase().includes(query) || 
      t.sport.toLowerCase().includes(query) ||
      t.status.toLowerCase().includes(query);
  });

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
            <p className="text-[11px] text-muted-foreground">
              {editingTournament ? 'Tournament successfully updated.' : 'Tournament card added successfully.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tournaments</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure competition structures, registrations, stages, and venues.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-60 apple-card-shadow transition duration-200"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={handleOpenNewModal}
              className="bg-primary hover:bg-primary/95 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Tournament</span>
            </button>
          )}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
            <div key={t.id} className="bg-white border border-slate-100/80 apple-card-shadow rounded-2xl p-6 space-y-4 hover:-translate-y-0.5 transition-all duration-200 group relative">
              
              {/* Edit/Delete Overlay Icons on hover - Admin only */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur rounded-lg p-1 border border-slate-100 shadow-sm">
                  <button 
                    onClick={() => handleOpenEditModal(t)}
                    title="Edit Tournament"
                    className="text-slate-600 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTournament(t.id)}
                    title="Delete Tournament"
                    className="text-slate-600 hover:text-red-600 p-1.5 rounded-md hover:bg-slate-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  t.status === 'Ongoing' || t.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  t.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {t.status}
                </span>
                <span className={`text-xs text-muted-foreground font-semibold ${isAdmin ? 'pr-16 group-hover:pr-2' : ''} transition-all duration-200`}>{t.sport}</span>
              </div>
              
              <h3 className="text-lg font-bold text-foreground leading-tight">{t.name}</h3>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{t.teams} Teams</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{t.start}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-slate-100 apple-card-shadow rounded-2xl p-10 text-center text-muted-foreground">
            <Trophy className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No tournaments match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Creation / Editing Modal */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-extrabold text-foreground">
                  {editingTournament ? 'Edit Tournament Details' : 'New Tournament'}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTournament} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Tournament Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. World Volleyball Open 2026"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Select Sport</label>
                  <select 
                    value={formSport}
                    onChange={(e) => setFormSport(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  >
                    {sports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Number of Teams</label>
                  <input 
                    type="number" 
                    required
                    min="2"
                    max="128"
                    value={formTeams}
                    onChange={(e) => setFormTeams(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Dynamic Team Selection Inputs - Hide during edit for safety */}
              {!editingTournament && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Home Team (A)</label>
                    <select 
                      value={formTeamA}
                      onChange={(e) => setFormTeamA(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    >
                      {availableTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Away Team (B)</label>
                    <select 
                      value={formTeamB}
                      onChange={(e) => setFormTeamB(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    >
                      {availableTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing / Live</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-foreground font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-primary/10 transition"
                >
                  {editingTournament ? 'Save Changes' : 'Create Tournament'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
