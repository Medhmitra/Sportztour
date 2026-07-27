'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, Activity, Users, Calendar, 
  Tv, Settings, Zap, Bell, LogOut, Lock, Mail, User, Check
} from 'lucide-react';
import "./globals.css";

interface UserProfile {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface NotificationItem {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Auth States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'admin' | 'user'>('user');
  const [authError, setAuthError] = useState('');

  // Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Load user session and notifications on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedNotifs = localStorage.getItem('notifications');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }

    // Set up storage listener to sync notifications and auth updates across pages in real-time
    const handleStorageChange = () => {
      const updatedNotifs = localStorage.getItem('notifications');
      if (updatedNotifs) {
        setNotifications(JSON.parse(updatedNotifs));
      }
      const updatedUser = localStorage.getItem('currentUser');
      if (updatedUser) {
        setCurrentUser(JSON.parse(updatedUser));
      } else {
        setCurrentUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Run legacy local-storage user accounts migration to Postgres database
  useEffect(() => {
    const syncLocalAccounts = async () => {
      const localAccountsStr = localStorage.getItem('user_accounts');
      if (!localAccountsStr) return;

      try {
        const localAccounts = JSON.parse(localAccountsStr);
        if (!Array.isArray(localAccounts) || localAccounts.length === 0) return;

        for (const acc of localAccounts) {
          if (!acc.email) continue;
          
          // Send request to register user account in Postgres
          await fetch('http://localhost:8000/api/v1/users/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: acc.email.toLowerCase(),
              password: 'password123', // default fallback password for legacy accounts
              name: acc.name || 'Legacy User',
              role: acc.role || 'user',
              organization: 'Independent Club'
            }),
          });
        }
        // Remove raw local storage copy after migration
        localStorage.removeItem('user_accounts');
      } catch (err) {
        console.error('Failed to sync local accounts to Postgres:', err);
      }
    };

    syncLocalAccounts();
  }, []);

  // Handle Login Action (Postgres Linked, Case-insensitive email support)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const normalizedEmail = authEmail.trim().toLowerCase();

    try {
      const response = await fetch('http://localhost:8000/api/v1/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedEmail, password: authPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAuthError(errorData.detail || 'Invalid credentials. Legacy accounts synced password to: password123');
        return;
      }

      const data = await response.json();
      const user = data.user;
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    } catch (err) {
      console.error(err);
      setAuthError('Unable to connect to the backend server. Make sure Django is running.');
    }
  };

  // Handle Signup Action (Postgres Linked, Real-time Notification Dispatch)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const normalizedEmail = authEmail.trim().toLowerCase();

    if (!normalizedEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (authPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: authPassword,
          name: authName.trim() || 'Custom User',
          role: authRole,
          organization: 'Independent Club'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAuthError(errorData.error || 'Failed to sign up.');
        return;
      }

      const registerData = await response.json();
      const user = registerData.user;

      // Broadcast real-time signup notification to storage alerts channel
      const newNotif = {
        id: Date.now(),
        message: `New account "${user.name}" registered as ${user.role.toUpperCase()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      const savedNotifs = localStorage.getItem('notifications');
      const notifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const updatedNotifs = [newNotif, ...notifs];
      localStorage.setItem('notifications', JSON.stringify(updatedNotifs));
      setNotifications(updatedNotifs);

      // Auto login by requesting token
      const tokenResponse = await fetch('http://localhost:8000/api/v1/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedEmail, password: authPassword }),
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const loggedUser = tokenData.user;
        setCurrentUser(loggedUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        localStorage.setItem('access_token', tokenData.access);
        localStorage.setItem('refresh_token', tokenData.refresh);
      } else {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (err) {
      console.error(err);
      setAuthError('Unable to connect to the backend server. Make sure Django is running.');
    }
  };

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
    setIsNotifOpen(false);
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  // Clear notifications list
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Tournaments', href: '/tournaments', icon: Trophy },
    { name: 'Teams & Players', href: '/teams', icon: Users },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Scoreboard', href: '/scoreboard', icon: Tv },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Unauthenticated Auth Gate View
  if (!currentUser) {
    return (
      <html lang="en">
        <body className="antialiased bg-slate-100 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-md max-w-md w-full rounded-3xl p-8 apple-card-shadow space-y-6">
            
            {/* Logo */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-primary p-3.5 rounded-2xl text-white shadow-lg shadow-primary/20">
                <Trophy className="w-7 h-7" />
              </div>
              <h1 className="font-extrabold text-2xl tracking-tight text-foreground mt-2">
                Sportztour Workspace
              </h1>
              <p className="text-xs text-muted-foreground">
                Log in to coordinate leagues, match schedules, and rosters.
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                {authError}
              </div>
            )}

            {/* Login / Sign Up Forms */}
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider font-bold">Assign Role</label>
                  <select 
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                  >
                    <option value="user">User (Viewer only)</option>
                    <option value="admin">Admin (Full Edit privileges)</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-primary/10 transition mt-2"
              >
                {isSignUp ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            {/* Quick Demo Credentials Widget */}
            {!isSignUp && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] space-y-1.5 text-muted-foreground font-semibold">
                <p className="font-extrabold text-slate-700 uppercase tracking-wider mb-1">Quick-Login Presets:</p>
                <div className="flex justify-between">
                  <span>Admin: <strong className="text-foreground">admin@sportztour.com</strong> (PW: <strong className="text-foreground">admin</strong>)</span>
                </div>
                <div className="flex justify-between">
                  <span>User: <strong className="text-foreground">user@sportztour.com</strong> (PW: <strong className="text-foreground">user</strong>)</span>
                </div>
              </div>
            )}

            <div className="text-center pt-2 border-t border-slate-150/40 mt-4">
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up as User/Admin'}
              </button>
            </div>

          </div>
        </body>
      </html>
    );
  }

  // Authenticated Workspace Layout View
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50/50 text-foreground min-h-screen flex">
        
        {/* Sidebar */}
        <aside className="w-64 apple-glass border-r border-slate-200/50 backdrop-blur-md hidden md:flex flex-col p-6 space-y-8 sticky top-0 h-screen z-20">
          
          {/* Workspace Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-xl text-white shadow-md shadow-primary/20">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Sportztour
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Card & Logout */}
          <div className="bg-white border border-slate-100 apple-card-shadow rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-sm shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-foreground truncate">{currentUser.name}</p>
                <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${
                  currentUser.role === 'admin' 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl py-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-bold">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Content Container wrapper */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
          
          {/* Header toolbar featuring Notifications and Breadcrumbs */}
          <header className="h-16 border-b border-slate-200/50 bg-white/40 backdrop-blur px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center space-x-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-foreground font-black">{pathname === '/' ? 'Dashboard' : pathname.replace('/', '')}</span>
            </div>
            
            {/* Alerts Bell notification block */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsRead();
                }}
                className="relative bg-white border border-slate-200/80 p-2.5 rounded-xl apple-card-shadow text-slate-600 hover:text-primary transition duration-150"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[8px] w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification drop-down panel list */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-black text-foreground">Notifications</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={markNotificationsRead}
                        className="text-[10px] text-primary hover:underline font-bold"
                      >
                        Read All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button 
                        onClick={clearNotifications}
                        className="text-[10px] text-red-500 hover:underline font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 space-y-1 hover:bg-slate-50/50 transition ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                          <p className="text-xs text-foreground font-semibold leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-muted-foreground font-medium block">
                            {notif.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground space-y-2">
                        <Bell className="w-8 h-8 mx-auto text-slate-200" />
                        <p className="text-xs font-bold">All caught up! No notifications.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Children View Container */}
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
