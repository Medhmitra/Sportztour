'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, Activity, Users, Calendar, 
  TrendingUp, Plus, Search, Clock, ArrowRight, Shield, X, Check
} from 'lucide-react';

const DEFAULT_TOURNAMENTS = [
  { id: 1, name: 'Championship Cup 2026', sport: 'Basketball', teams: 16, start: 'Jul 28, 2026', status: 'Upcoming' },
  { id: 2, name: 'Super League Division 1', sport: 'Soccer', teams: 20, start: 'Jun 10, 2026', status: 'Ongoing' },
  { id: 3, name: 'Summer Tennis Open', sport: 'Tennis', teams: 32, start: 'May 15, 2026', status: 'Finished' },
  { id: 4, name: 'National Hockey League', sport: 'Hockey', teams: 12, start: 'Aug 02, 2026', status: 'Upcoming' },
  { id: 5, name: 'Pro Volleyball Series', sport: 'Volleyball', teams: 8, start: 'Jun 22, 2026', status: 'Ongoing' },
  { id: 6, name: 'All India Cricket League', sport: 'Cricket', teams: 10, start: 'Sep 05, 2026', status: 'Upcoming' },
];

const DEFAULT_MATCHES = [
  // Live Matches
  { id: 1, sport: 'Basketball', tournament: 'Championship Cup 2026', teamA: 'Apex Titans', teamB: 'Shadow Dragons', scoreA: 88, scoreB: 85, status: 'Q4 - 02:15', category: 'live' },
  { id: 2, sport: 'Soccer', tournament: 'Super League Division 1', teamA: 'Strikers FC', teamB: 'United FC', scoreA: 2, scoreB: 2, status: '82 min', category: 'live' },
  { id: 3, sport: 'Cricket', tournament: 'T20 International League', teamA: 'India', teamB: 'Australia', scoreA: '184/4', scoreB: '142/6', status: '16.4 Overs', category: 'live' },
  { id: 4, sport: 'Hockey', tournament: 'Pro Hockey Cup', teamA: 'India', teamB: 'Germany', scoreA: 4, scoreB: 3, status: 'Q4 - 05:40', category: 'live' },
  
  // Upcoming Matches
  { id: 5, sport: 'Basketball', tournament: 'Championship Cup 2026', teamA: 'Blaze Warriors', teamB: 'Viper Squad', scoreA: '-', scoreB: '-', status: 'Tomorrow 18:00 UTC', category: 'upcoming' },
  { id: 6, sport: 'Volleyball', tournament: 'Pro Volleyball Series', teamA: 'Berlin Spikers', teamB: 'Paris Volley', scoreA: '-', scoreB: '-', status: 'Jul 31, 17:30 UTC', category: 'upcoming' },
  { id: 7, sport: 'Tennis', tournament: 'Summer Tennis Open', teamA: 'Smashers TC', teamB: 'Aces Club', scoreA: '-', scoreB: '-', status: 'Aug 01, 15:00 UTC', category: 'upcoming' },
  
  // Finished Matches
  { id: 8, sport: 'Cricket', tournament: 'T20 International League', teamA: 'England', teamB: 'South Africa', scoreA: '164/5', scoreB: '168/2', status: 'Completed', category: 'finished' },
  { id: 9, sport: 'Soccer', tournament: 'Super League Division 1', teamA: 'Apex Titans', teamB: 'Blaze Warriors', scoreA: '3', scoreB: '1', status: 'Completed', category: 'finished' },
  { id: 10, sport: 'Hockey', tournament: 'Pro Hockey Cup', teamA: 'Germany', teamB: 'Netherlands', scoreA: '2', scoreB: '4', status: 'Completed', category: 'finished' },
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

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'finished'>('live');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals and Alerts
  const [isBracketModalOpen, setIsBracketModalOpen] = useState(false);
  
  // Dynamic Datasets
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTournaments = localStorage.getItem('tournaments');
    if (savedTournaments) {
      setTournaments(JSON.parse(savedTournaments));
    } else {
      localStorage.setItem('tournaments', JSON.stringify(DEFAULT_TOURNAMENTS));
      setTournaments(DEFAULT_TOURNAMENTS);
    }

    const savedMatches = localStorage.getItem('matches');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    } else {
      localStorage.setItem('matches', JSON.stringify(DEFAULT_MATCHES));
      setMatches(DEFAULT_MATCHES);
    }

    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    } else {
      localStorage.setItem('teams', JSON.stringify(DEFAULT_TEAMS));
      setTeams(DEFAULT_TEAMS);
    }
  }, []);

  // Simulate WebSocket live score updates for live matches
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => {
        const updated = prev.map(match => {
          if (match.category !== 'live') return match;
          
          const updateChance = Math.random();
          if (updateChance > 0.6) {
            if (match.sport === 'Basketball') {
              const points = Math.floor(Math.random() * 3) + 1;
              const isTeamA = Math.random() > 0.5;
              return { 
                ...match, 
                scoreA: isTeamA ? (match.scoreA as number) + points : match.scoreA, 
                scoreB: !isTeamA ? (match.scoreB as number) + points : match.scoreB 
              };
            } else if (match.sport === 'Soccer' || match.sport === 'Hockey') {
              const isTeamA = Math.random() > 0.7;
              return { 
                ...match, 
                scoreA: isTeamA ? (match.scoreA as number) + 1 : match.scoreA, 
                scoreB: !isTeamA ? (match.scoreB as number) + 1 : match.scoreB 
              };
            } else if (match.sport === 'Cricket') {
              const isTeamA = Math.random() > 0.5;
              if (isTeamA) {
                const [runs, wickets] = (match.scoreA as string).split('/').map(Number);
                const runAdd = Math.floor(Math.random() * 6) + 1;
                const wicketAdd = Math.random() > 0.9 ? 1 : 0;
                return { ...match, scoreA: `${runs + runAdd}/${Math.min(10, wickets + wicketAdd)}` };
              } else {
                const [runs, wickets] = (match.scoreB as string).split('/').map(Number);
                const runAdd = Math.floor(Math.random() * 4) + 1;
                const wicketAdd = Math.random() > 0.8 ? 1 : 0;
                return { ...match, scoreB: `${runs + runAdd}/${Math.min(10, wickets + wicketAdd)}` };
              }
            }
          }
          return match;
        });
        
        // Sync back to local storage
        localStorage.setItem('matches', JSON.stringify(updated));
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const sports = ['All', 'Cricket', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Hockey'];

  const stats = [
    { name: 'Active Tournaments', value: tournaments.filter(t => t.status === 'Ongoing' || t.status === 'Live' || t.status === 'Upcoming').length.toString(), icon: Trophy, color: 'bg-blue-50 text-blue-600' },
    { name: 'Registered Teams', value: teams.length.toString(), icon: Users, color: 'bg-purple-50 text-purple-600' },
    { name: 'Matches Live Now', value: matches.filter(m => m.category === 'live').length.toString(), icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'System Health', value: '99.9%', icon: Shield, color: 'bg-orange-50 text-orange-600' },
  ];

  // Reactive filtering of matches by category, sport, and search query
  const filteredMatches = matches.filter(match => {
    const matchesCategory = match.category === activeTab;
    const matchesSport = selectedSport === 'All' || match.sport === selectedSport;
    const matchesQuery = searchQuery.trim() === '' || 
      match.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSport && matchesQuery;
  });

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto relative">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tournament Workspace</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time control center for organizational admins and fans.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tournaments or teams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-60 apple-card-shadow transition duration-200"
            />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-5 flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{stat.name}</span>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3.5 rounded-xl border border-slate-100/50 shadow-sm`}>
              <stat.icon className="w-5.5 h-5.5" />
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Match Center Column */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">Match Center</h2>
            </div>
            
            {/* Tabs */}
            <div className="flex border border-slate-200 p-0.5 rounded-xl bg-slate-100">
              {(['live', 'upcoming', 'finished'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize text-xs font-bold px-3.5 py-1.5 rounded-lg transition duration-200 ${
                    activeTab === tab 
                      ? 'bg-white text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sports Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition duration-200 whitespace-nowrap ${
                  selectedSport === sport 
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' 
                    : 'bg-white text-muted-foreground border-slate-200 hover:border-slate-300 hover:text-foreground'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <div key={match.id} className="relative bg-white border border-slate-100/80 rounded-2xl p-5 md:p-6 apple-card-shadow hover:-translate-y-0.5 transition-all duration-300 group">
                  {match.category === 'live' && (
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full border border-red-100 text-xs font-bold">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  )}
                  {match.category === 'upcoming' && (
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100 text-xs font-bold">
                      <span>UPCOMING</span>
                    </div>
                  )}
                  {match.category === 'finished' && (
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200 text-xs font-bold">
                      <span>FINISHED</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                      <span>{match.sport}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-primary font-semibold">{match.tournament}</span>
                    </div>

                    <div className="flex items-center justify-between gap-6 py-2">
                      {/* Team A */}
                      <div className="flex-1 flex items-center justify-end space-x-3 text-right">
                        <span className="font-bold text-foreground text-base md:text-lg group-hover:text-primary transition duration-200">{match.teamA}</span>
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 font-bold rounded-full flex items-center justify-center border border-slate-150 text-sm shadow-sm">
                          {match.teamA.charAt(0)}
                        </div>
                      </div>

                      {/* Score display */}
                      <div className="flex items-center space-x-3.5 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-200/50">
                        <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono tracking-tight">{match.scoreA}</span>
                        <span className="text-slate-400 font-bold">:</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono tracking-tight">{match.scoreB}</span>
                      </div>

                      {/* Team B */}
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 font-bold rounded-full flex items-center justify-center border border-slate-150 text-sm shadow-sm">
                          {match.teamB.charAt(0)}
                        </div>
                        <span className="font-bold text-foreground text-base md:text-lg group-hover:text-primary transition duration-200">{match.teamB}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{match.status}</span>
                      </span>
                      {match.category === 'live' ? (
                        <Link href={`/matches/${match.id}`} className="text-primary hover:text-primary/80 font-bold flex items-center gap-1">
                          <span>View Live Stream</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 font-bold">Match Center</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-10 text-center text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold">No matches available for the selected filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Cards */}
        <section className="space-y-6">
          {/* Brackets */}
          <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span>Brackets</span>
              </h3>
              <button 
                onClick={() => setIsBracketModalOpen(true)}
                className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0 outline-none"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Semi-Final A</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span>Apex Titans</span>
                    <span className="text-emerald-600 font-mono">92 (W)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                    <span>Viper Squad</span>
                    <span className="font-mono">81</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Semi-Final B</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                    <span>Shadow Dragons</span>
                    <span className="font-mono">75</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span>Blaze Warriors</span>
                    <span className="text-emerald-600 font-mono">84 (W)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center py-0.5">
                <div className="h-4 w-px bg-slate-200"></div>
              </div>

              <div className="border border-primary/10 rounded-xl p-4 bg-blue-50/40 text-center space-y-1.5">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Championship Final</div>
                <div className="text-xs font-bold text-foreground">Apex Titans vs Blaze Warriors</div>
                <div className="text-[10px] text-muted-foreground">Tomorrow at 18:00 UTC</div>
              </div>
            </div>
          </div>

          {/* Standings */}
          <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Leaderboard</span>
              </h3>
              <Link href="/scoreboard" className="text-xs text-primary font-bold hover:underline cursor-pointer">
                Standings
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { rank: 1, team: 'Apex Titans', gp: 10, pts: 28, logo: 'A' },
                { rank: 2, team: 'Blaze Warriors', gp: 10, pts: 25, logo: 'B' },
                { rank: 3, team: 'Shadow Dragons', gp: 10, pts: 22, logo: 'S' },
                { rank: 4, team: 'Strikers FC', gp: 10, pts: 19, logo: 'T' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold w-5 text-center ${row.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      #{row.rank}
                    </span>
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                      {row.logo}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{row.team}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-semibold">
                    <span className="text-muted-foreground">{row.gp} GP</span>
                    <span className="text-foreground font-bold">{row.pts} PTS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Bracket Visualizer Modal */}
      {isBracketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <Trophy className="w-5.5 h-5.5 text-primary" />
                <div>
                  <h3 className="font-extrabold text-foreground leading-tight">Championship Bracket Visualization</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">Real-time Knockout Progression</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBracketModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bracket Structure Tree view */}
            <div className="p-8 bg-slate-50/30 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px] gap-8 relative py-4">
                
                {/* Quarter Finals */}
                <div className="flex flex-col justify-around h-[320px] w-48 space-y-4">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase text-center border-b border-slate-200 pb-1">Quarter-Finals</div>
                  
                  {/* QF 1 */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3 apple-card-shadow space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>Apex Titans</span>
                      <span className="text-emerald-600 font-mono">102 (W)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Strikers FC</span>
                      <span className="font-mono">88</span>
                    </div>
                  </div>

                  {/* QF 2 */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3 apple-card-shadow space-y-1">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Viper Squad</span>
                      <span className="font-mono">90 (W)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>United FC</span>
                      <span className="font-mono">78</span>
                    </div>
                  </div>

                  {/* QF 3 */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3 apple-card-shadow space-y-1">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Shadow Dragons</span>
                      <span className="font-mono">82 (W)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Berlin Spikers</span>
                      <span className="font-mono">70</span>
                    </div>
                  </div>

                  {/* QF 4 */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3 apple-card-shadow space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>Blaze Warriors</span>
                      <span className="text-emerald-600 font-mono">95 (W)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Smashers TC</span>
                      <span className="font-mono">82</span>
                    </div>
                  </div>
                </div>

                {/* Connector lines QF -> SF */}
                <div className="flex flex-col justify-around h-[320px] text-primary font-bold text-xs select-none">
                  <span>➔</span>
                  <span>➔</span>
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col justify-around h-[320px] w-48 space-y-8">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase text-center border-b border-slate-200 pb-1">Semi-Finals</div>
                  
                  {/* SF 1 */}
                  <div className="bg-white border border-slate-150 rounded-xl p-4.5 apple-card-shadow space-y-1.5 border-l-4 border-l-primary">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>Apex Titans</span>
                      <span className="text-emerald-600 font-mono font-black">92 (W)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Viper Squad</span>
                      <span className="font-mono">81</span>
                    </div>
                  </div>

                  {/* SF 2 */}
                  <div className="bg-white border border-slate-150 rounded-xl p-4.5 apple-card-shadow space-y-1.5 border-l-4 border-l-primary">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Shadow Dragons</span>
                      <span className="font-mono">75</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>Blaze Warriors</span>
                      <span className="text-emerald-600 font-mono font-black">84 (W)</span>
                    </div>
                  </div>
                </div>

                {/* Connector lines SF -> Final */}
                <div className="text-primary font-bold text-sm select-none">
                  <span>➔</span>
                </div>

                {/* Championship Final */}
                <div className="flex flex-col justify-center h-[320px] w-52">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase text-center border-b border-slate-200 pb-1 mb-6">Championship Final</div>
                  
                  <div className="bg-blue-50/50 border border-primary/20 rounded-2xl p-5 text-center space-y-3 apple-card-shadow ring-4 ring-primary/5">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground">Championship Match</h4>
                      <p className="text-xs font-bold text-primary mt-1">Apex Titans</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">vs</p>
                      <p className="text-xs font-bold text-primary">Blaze Warriors</p>
                    </div>
                    <div className="text-[9px] font-bold bg-white text-muted-foreground border border-slate-100 rounded-lg py-1 px-2.5 inline-block">
                      Tomorrow at 18:00 UTC
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button 
                onClick={() => setIsBracketModalOpen(false)}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-primary/10"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
