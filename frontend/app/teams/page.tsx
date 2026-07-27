'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Check, Eye, Trash2, Edit2 } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  organization: string;
  playersCount: number;
  code: string;
  sport: string;
  playersList: string[];
}

const DEFAULT_TEAMS: Team[] = [
  { 
    id: 1, 
    name: 'Apex Titans', 
    organization: 'Apex Sports Academy', 
    playersCount: 5, 
    code: 'APX',
    sport: 'Basketball',
    playersList: ['M. Jordan (G)', 'K. Bryant (G)', 'L. James (F)', 'K. Durant (F)', 'S. O\'Neal (C)']
  },
  { 
    id: 2, 
    name: 'Shadow Dragons', 
    organization: 'Darkwood Athletic Club', 
    playersCount: 5, 
    code: 'SDG',
    sport: 'Basketball',
    playersList: ['S. Curry (G)', 'J. Harden (G)', 'K. Leonard (F)', 'G. Antetokounmpo (F)', 'N. Jokic (C)']
  },
  { 
    id: 3, 
    name: 'Blaze Warriors', 
    organization: 'Warriors Union', 
    playersCount: 5, 
    code: 'BWR',
    sport: 'Basketball',
    playersList: ['D. Lillard (G)', 'D. Booker (G)', 'J. Tatum (F)', 'A. Davis (F)', 'J. Embiid (C)']
  },
  { 
    id: 4, 
    name: 'Strikers FC', 
    organization: 'Strikers Association', 
    playersCount: 6, 
    code: 'SFC',
    sport: 'Soccer',
    playersList: ['L. Messi (FW)', 'L. Suarez (FW)', 'Neymar Jr (FW)', 'Sergio Busquets (MF)', 'Jordi Alba (DF)', 'Alisson (GK)']
  },
  { 
    id: 5, 
    name: 'United FC', 
    organization: 'Manchester Alliance', 
    playersCount: 6, 
    code: 'UFC',
    sport: 'Soccer',
    playersList: ['E. Haaland (FW)', 'K. De Bruyne (MF)', 'B. Silva (MF)', 'Rodri (MF)', 'P. Foden (FW)', 'Ederson (GK)']
  },
  { 
    id: 6, 
    name: 'Royal Challengers', 
    organization: 'Bangalore Sports', 
    playersCount: 6, 
    code: 'RCB',
    sport: 'Cricket',
    playersList: ['V. Kohli (Batter)', 'F. du Plessis (Captain)', 'G. Maxwell (All-Rounder)', 'M. Siraj (Bowler)', 'D. Karthik (WK)', 'R. Patidar (Batter)']
  },
  { 
    id: 7, 
    name: 'Mumbai Kings', 
    organization: 'Mumbai Cricket Union', 
    playersCount: 6, 
    code: 'MIK',
    sport: 'Cricket',
    playersList: ['R. Sharma (Captain)', 'H. Pandya (All-Rounder)', 'S. Yadav (Batter)', 'J. Bumrah (Bowler)', 'I. Kishan (WK)', 'T. David (All-Rounder)']
  },
  { 
    id: 8, 
    name: 'Punjab Strikers', 
    organization: 'Punjab Hockey Academy', 
    playersCount: 6, 
    code: 'PJS',
    sport: 'Hockey',
    playersList: ['Harmanpreet Singh (Captain)', 'PR Sreejesh (GK)', 'Mandeep Singh (Forward)', 'Manpreet Singh (Midfielder)', 'Amit Rohidas (Defender)', 'Abhishek (Forward)']
  },
  { 
    id: 9, 
    name: 'Berlin Spikers', 
    organization: 'Berlin Volleyball Club', 
    playersCount: 5, 
    code: 'BNS',
    sport: 'Volleyball',
    playersList: ['Y. Ishikawa (Spiker)', 'Y. Nishida (Spiker)', 'R. Takahashi (Spiker)', 'T. Sekita (Setter)', 'S. Kagawa (Libero)']
  },
  { 
    id: 10, 
    name: 'Smashers TC', 
    organization: 'Smashers Tennis Club', 
    playersCount: 6, 
    code: 'SMH',
    sport: 'Tennis',
    playersList: ['R. Federer', 'R. Nadal', 'N. Djokovic', 'C. Alcaraz', 'J. Sinner', 'I. Swiatek']
  }
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Modal and Toast States
  const [selectedRosterTeam, setSelectedRosterTeam] = useState<Team | null>(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Add Team Form States
  const [formName, setFormName] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formSport, setFormSport] = useState('Cricket');
  const [formCode, setFormCode] = useState('');
  const [formPlayers, setFormPlayers] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('teams');
    if (saved) {
      setTeams(JSON.parse(saved));
    } else {
      localStorage.setItem('teams', JSON.stringify(DEFAULT_TEAMS));
      setTeams(DEFAULT_TEAMS);
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const sports = ['Cricket', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Hockey'];
  const isAdmin = currentUser?.role === 'admin';

  // Open modal for new team
  const handleOpenNewModal = () => {
    setEditingTeam(null);
    setFormName('');
    setFormOrg('');
    setFormSport('Cricket');
    setFormCode('');
    setFormPlayers('');
    setIsAddTeamOpen(true);
  };

  // Open modal for editing team
  const handleOpenEditModal = (team: Team) => {
    setEditingTeam(team);
    setFormName(team.name);
    setFormOrg(team.organization);
    setFormSport(team.sport);
    setFormCode(team.code);
    setFormPlayers(team.playersList.join(', '));
    setIsAddTeamOpen(true);
  };

  // Delete team
  const handleDeleteTeam = (id: number) => {
    if (window.confirm("Are you sure you want to delete this team and its players list?")) {
      const updated = teams.filter(t => t.id !== id);
      setTeams(updated);
      localStorage.setItem('teams', JSON.stringify(updated));
    }
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    // Parse player names split by commas, semicolons, or newlines
    const parsedPlayers = formPlayers
      .split(/,|\n|;/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (editingTeam) {
      const oldTeamName = editingTeam.name;
      const newTeamName = formName;

      // Update existing team details
      const updated = teams.map(t => {
        if (t.id === editingTeam.id) {
          return {
            ...t,
            name: formName,
            organization: formOrg || 'Independent Club',
            code: formCode.toUpperCase().slice(0, 4),
            sport: formSport,
            playersCount: parsedPlayers.length || 0,
            playersList: parsedPlayers.length > 0 ? parsedPlayers : ['Roster Pending...']
          };
        }
        return t;
      });
      setTeams(updated);
      localStorage.setItem('teams', JSON.stringify(updated));

      // Propagate name change to matches
      const savedMatches = localStorage.getItem('matches');
      if (savedMatches) {
        const matchesList = JSON.parse(savedMatches);
        const updatedMatches = matchesList.map((m: any) => {
          let hasChange = false;
          let a = m.teamA;
          let b = m.teamB;
          if (m.teamA === oldTeamName) {
            a = newTeamName;
            hasChange = true;
          }
          if (m.teamB === oldTeamName) {
            b = newTeamName;
            hasChange = true;
          }
          if (hasChange) {
            return { ...m, teamA: a, teamB: b };
          }
          return m;
        });
        localStorage.setItem('matches', JSON.stringify(updatedMatches));
      }
    } else {
      // Create new team card
      const newTeam: Team = {
        id: Date.now(),
        name: formName,
        organization: formOrg || 'Independent Club',
        code: formCode.toUpperCase().slice(0, 4),
        sport: formSport,
        playersCount: parsedPlayers.length || 0,
        playersList: parsedPlayers.length > 0 ? parsedPlayers : ['Roster Pending...']
      };

      const updated = [newTeam, ...teams];
      setTeams(updated);
      localStorage.setItem('teams', JSON.stringify(updated));
    }
    
    setIsAddTeamOpen(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

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
              {editingTeam ? 'Team details updated.' : 'Team added with customized roster.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Teams & Players</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage team rosters, player memberships, and organization affiliations.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenNewModal}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team</span>
          </button>
        )}
      </header>

      {/* Grid containing teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-slate-100/80 apple-card-shadow rounded-2xl p-6 space-y-4 hover:-translate-y-0.5 transition-all duration-200 group relative">
            
            {/* Edit/Delete Overlay Panel on hover - Admin only */}
            {isAdmin && (
              <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur rounded-lg p-1 border border-slate-100 shadow-sm z-10">
                <button 
                  onClick={() => handleOpenEditModal(team)}
                  title="Edit Team"
                  className="text-slate-600 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDeleteTeam(team.id)}
                  title="Delete Team"
                  className="text-slate-600 hover:text-red-600 p-1.5 rounded-md hover:bg-slate-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-primary font-extrabold rounded-2xl flex items-center justify-center border border-slate-100 text-base shadow-sm">
                  {team.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground leading-tight">{team.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold">{team.organization}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase ${isAdmin ? 'pr-16 group-hover:pr-2' : ''} transition-all duration-200`}>
                {team.sport}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{team.playersCount} Players</span>
              </span>
              <button 
                onClick={() => setSelectedRosterTeam(team)}
                className="text-primary hover:text-primary/80 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Roster</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Roster Viewer Modal (Shows Player Names) */}
      {selectedRosterTeam && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center border border-primary/20 text-sm">
                  {selectedRosterTeam.code}
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground leading-tight">{selectedRosterTeam.name} Roster</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{selectedRosterTeam.sport} • {selectedRosterTeam.organization}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRosterTeam(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Players List */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-muted-foreground uppercase border-b border-slate-100 pb-2">
                <span>Player Details</span>
                <span>Jersey #</span>
              </div>
              <ul className="divide-y divide-slate-50">
                {selectedRosterTeam.playersList.map((player, index) => (
                  <li key={index} className="py-2.5 flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <span>{player}</span>
                    </span>
                    <span className="text-muted-foreground font-mono bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedRosterTeam(null)}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-primary/10 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Team Modal */}
      {isAddTeamOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="font-extrabold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{editingTeam ? 'Edit Team Details' : 'Add New Team'}</span>
              </span>
              <button 
                onClick={() => setIsAddTeamOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTeam} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Team Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Chennai Superstars"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Badge Code</label>
                  <input 
                    type="text" 
                    required
                    maxLength={4}
                    placeholder="e.g. CHS"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
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
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Club/Organization</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Madras Athletic Union"
                    value={formOrg}
                    onChange={(e) => setFormOrg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Roster Player Names (Comma/Newline Separated)</label>
                <textarea 
                  placeholder="Virat Kohli, MS Dhoni, Ravindra Jadeja"
                  value={formPlayers}
                  onChange={(e) => setFormPlayers(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setIsAddTeamOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-foreground font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-primary/10 transition"
                >
                  {editingTeam ? 'Save Changes' : 'Save Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
