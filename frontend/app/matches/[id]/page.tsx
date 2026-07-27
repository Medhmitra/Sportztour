'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Tv, BarChart2, MessageSquare, Clock, Send
} from 'lucide-react';

interface MatchData {
  id: number;
  sport: string;
  tournament: string;
  teamA: string;
  teamB: string;
  scoreA: string | number;
  scoreB: string | number;
  status: string;
  videoUrl: string; // Path to local video
  viewers: string;
  stats: { label: string; valueA: string | number; valueB: string | number }[];
  lineupA: string[];
  lineupB: string[];
}

export default function MatchCenterPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'stats' | 'lineups'>('stats');
  const [chatMessage, setChatMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock match database using local assets
  const matchesDb: Record<string, MatchData> = {
    '1': {
      id: 1,
      sport: 'Basketball',
      tournament: 'Championship Cup 2026',
      teamA: 'Apex Titans',
      teamB: 'Shadow Dragons',
      scoreA: 98,
      scoreB: 92,
      status: 'Q4 - 01:10',
      videoUrl: '/videos/basketball.mp4',
      viewers: '14.8K',
      stats: [
        { label: 'Field Goal %', valueA: '51%', valueB: '48%' },
        { label: '3-Pointers', valueA: '12/24', valueB: '10/26' },
        { label: 'Rebounds', valueA: 42, valueB: 38 },
        { label: 'Assists', valueA: 24, valueB: 20 },
        { label: 'Turnovers', valueA: 11, valueB: 14 },
      ],
      lineupA: ['M. Jordan (G)', 'K. Bryant (G)', 'L. James (F)', 'K. Durant (F)', 'S. O\'Neal (C)'],
      lineupB: ['S. Curry (G)', 'J. Harden (G)', 'K. Leonard (F)', 'G. Antetokounmpo (F)', 'N. Jokic (C)']
    },
    '2': {
      id: 2,
      sport: 'Soccer',
      tournament: 'Super League Division 1',
      teamA: 'Strikers FC',
      teamB: 'United FC',
      scoreA: 3,
      scoreB: 2,
      status: '88 min',
      videoUrl: '/videos/soccer.mp4',
      viewers: '22.3K',
      stats: [
        { label: 'Shots (On Target)', valueA: '14 (8)', valueB: '11 (6)' },
        { label: 'Possession', valueA: '54%', valueB: '46%' },
        { label: 'Fouls', valueA: 8, valueB: 12 },
        { label: 'Corners', valueA: 6, valueB: 4 },
        { label: 'Yellow Cards', valueA: 1, valueB: 2 },
      ],
      lineupA: ['Alisson (GK)', 'Trent (DF)', 'Van Dijk (DF)', 'Robertson (DF)', 'Mac Allister (MF)', 'Salah (FW)', 'Diaz (FW)'],
      lineupB: ['Ederson (GK)', 'Walker (DF)', 'Dias (DF)', 'Gvardiol (DF)', 'Rodri (MF)', 'De Bruyne (MF)', 'Haaland (FW)']
    },
    '3': {
      id: 3,
      sport: 'Cricket',
      tournament: 'T20 International League',
      teamA: 'India',
      teamB: 'Australia',
      scoreA: '184/4',
      scoreB: '142/6',
      status: '16.4 Overs',
      videoUrl: '/videos/cricket.mp4',
      viewers: '254.1K',
      stats: [
        { label: 'Run Rate', valueA: '11.04', valueB: '8.52' },
        { label: 'Sixes', valueA: 12, valueB: 8 },
        { label: 'Fours', valueA: 16, valueB: 11 },
        { label: 'Extras', valueA: 6, valueB: 9 },
        { label: 'Projected Score', valueA: '224', valueB: '172' },
      ],
      lineupA: ['R. Sharma (C)', 'Y. Jaiswal', 'V. Kohli', 'S. Yadav', 'H. Pandya', 'R. Pant (WK)', 'A. Patel'],
      lineupB: ['T. Head', 'M. Marsh (C)', 'G. Maxwell', 'M. Stoinis', 'T. David', 'M. Wade (WK)', 'P. Cummins']
    },
    '4': {
      id: 4,
      sport: 'Hockey',
      tournament: 'Pro Hockey Cup',
      teamA: 'India',
      teamB: 'Germany',
      scoreA: 4,
      scoreB: 3,
      status: 'Q4 - 05:40',
      videoUrl: '/videos/hockey.mp4',
      viewers: '18.9K',
      stats: [
        { label: 'Circle Entries', valueA: 22, valueB: 18 },
        { label: 'Penalty Corners', valueA: '5/2', valueB: '4/1' },
        { label: 'Possession', valueA: '52%', valueB: '48%' },
        { label: 'Shots on Goal', valueA: 9, valueB: 7 },
        { label: 'Green Cards', valueA: 1, valueB: 0 },
      ],
      lineupA: ['PR Sreejesh (GK)', 'Harmanpreet Singh (C)', 'Amit Rohidas', 'Manpreet Singh', 'Hardik Singh', 'Abhishek', 'Mandeep Singh'],
      lineupB: ['J. Stadler (GK)', 'M. Grambusch (C)', 'L. Windfeder', 'T. Oruz', 'N. Wellen', 'C. Rühr', 'J. Peillat']
    }
  };

  const match = matchesDb[params.id] || matchesDb['1'];

  // Initialize and Sync user details & chat history on mount
  useEffect(() => {
    const savedChat = localStorage.getItem(`match_chat_${params.id}`);
    if (savedChat) {
      // Filter out legacy template mock comments
      const parsed = JSON.parse(savedChat);
      const filtered = parsed.filter((msg: any) => 
        msg.user !== 'Rohan_99' && msg.user !== 'Sara_Lee' && msg.user !== 'Coach_Dave'
      );
      setChatHistory(filtered);
      localStorage.setItem(`match_chat_${params.id}`, JSON.stringify(filtered));
    } else {
      localStorage.setItem(`match_chat_${params.id}`, JSON.stringify([]));
      setChatHistory([]);
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Set up storage sync to read updates from other logged in user tabs in real-time
    const handleStorageChange = () => {
      const updatedChat = localStorage.getItem(`match_chat_${params.id}`);
      if (updatedChat) {
        setChatHistory(JSON.parse(updatedChat));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [params.id]);

  // Handle message send
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userDisplayName = currentUser ? currentUser.name : 'Guest';
    const newMessage = {
      user: userDisplayName,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = [...chatHistory, newMessage];
    setChatHistory(updatedChat);
    localStorage.setItem(`match_chat_${params.id}`, JSON.stringify(updatedChat));

    // Publish alert notification to workspace-wide bell dropdown
    const newNotif = {
      id: Date.now(),
      message: `${userDisplayName} commented: "${chatMessage.slice(0, 30)}${chatMessage.length > 30 ? '...' : ''}" in ${match.teamA} vs ${match.teamB} Live Chat`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    const savedNotifs = localStorage.getItem('notifications');
    const notifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    localStorage.setItem('notifications', JSON.stringify([newNotif, ...notifs]));

    setChatMessage('');
  };

  // Scroll chat list directly using container scrollTop
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-screen w-full bg-slate-50/50 overflow-hidden">
      
      {/* Left Column: Player & Stats */}
      <div className="flex-1 flex flex-col overflow-y-auto h-full p-4 md:p-8 space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="bg-white border border-slate-200 text-slate-600 hover:text-primary p-2 rounded-xl apple-card-shadow transition duration-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                <span>{match.sport}</span>
                <span>•</span>
                <span>{match.tournament}</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {match.teamA} vs {match.teamB}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 text-xs font-bold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>LIVE STREAM</span>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-lg border border-slate-200/20">
          <video 
            src={match.videoUrl} 
            autoPlay 
            loop 
            muted 
            controls 
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Viewer Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/10 text-white shadow-sm">
              <Users className="w-3.5 h-3.5 text-primary" />
              {match.viewers} Watching
            </span>
          </div>
        </div>

        {/* Live Score Display Card */}
        <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-700 border border-slate-200 shadow-sm">
              {match.teamA.charAt(0)}
            </div>
            <div>
              <p className="font-extrabold text-foreground">{match.teamA}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Home</p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="bg-slate-50 text-foreground px-5 py-2 rounded-xl text-2xl font-black font-mono border border-slate-200/50">
              {match.scoreA} : {match.scoreB}
            </div>
            <span className="text-xs text-primary font-bold flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {match.status}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-right">
            <div>
              <p className="font-extrabold text-foreground">{match.teamB}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Away</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-700 border border-slate-200 shadow-sm">
              {match.teamB.charAt(0)}
            </div>
          </div>
        </div>

        {/* Tabs for Info */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'stats', label: 'Match Statistics', icon: BarChart2 },
              { id: 'lineups', label: 'Roster Lineups', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-6 space-y-4">
              {match.stats.map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>{stat.valueA}</span>
                    <span className="text-muted-foreground font-semibold uppercase">{stat.label}</span>
                    <span>{stat.valueB}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ 
                        width: typeof stat.valueA === 'string' && stat.valueA.includes('%')
                          ? stat.valueA 
                          : `${(Number(stat.valueA) / (Number(stat.valueA) + Number(stat.valueB) || 1)) * 100}%` 
                      }}
                    ></div>
                    <div className="flex-1 bg-slate-200"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lineups Tab */}
          {activeTab === 'lineups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-6 space-y-3">
                <h3 className="font-extrabold text-foreground border-b border-slate-100 pb-2">{match.teamA} Lineup</h3>
                <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
                  {match.lineupA.map((player, i) => (
                    <li key={i} className="flex items-center space-x-2.5">
                      <span className="w-5 text-xs text-primary font-bold">#{i+1}</span>
                      <span className="text-foreground">{player}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-6 space-y-3">
                <h3 className="font-extrabold text-foreground border-b border-slate-100 pb-2">{match.teamB} Lineup</h3>
                <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
                  {match.lineupB.map((player, i) => (
                    <li key={i} className="flex items-center space-x-2.5">
                      <span className="w-5 text-xs text-primary font-bold">#{i+1}</span>
                      <span className="text-foreground">{player}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Live Chat Panel */}
      <div className="w-full md:w-80 apple-glass border-l border-slate-200/50 flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">Live Fan Chat</span>
          </div>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </div>

        {/* Messages list */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
          {chatHistory.map((msg, i) => (
            <div key={i} className="space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className={`text-[11px] font-bold ${msg.user === (currentUser ? currentUser.name : 'You') ? 'text-primary' : 'text-slate-700'}`}>
                  {msg.user}
                </span>
                <span className="text-[9px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-xs bg-white border border-slate-100 p-2.5 rounded-xl apple-card-shadow text-foreground font-medium leading-relaxed">
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-white/50 flex gap-2">
          <input 
            type="text" 
            placeholder="Type comment..." 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-xl hover:bg-primary/95 shadow-md shadow-primary/10 transition">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
