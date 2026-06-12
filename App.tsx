import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.tsx';
import ActiveMatchScorer from './components/ActiveMatchScorer.tsx';
import TeamsManager from './components/TeamsManager.tsx';
import PlayerProfile from './components/PlayerProfile.tsx';
import MatchHistory from './components/MatchHistory.tsx';
import LoginModal from './components/LoginModal.tsx';
import { Team, Player, Match, User } from './types.ts';
import { db, auth } from './firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, getDocFromServer } from 'firebase/firestore';
import { Crown, Wifi, WifiOff, Sparkles, Trophy } from 'lucide-react';
import { signOut } from './services/authService.ts';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('scorer');

  // Database lists
  const [cloudTeams, setCloudTeams] = useState<Team[]>([]);
  const [cloudPlayers, setCloudPlayers] = useState<Player[]>([]);
  const [cloudMatches, setCloudMatches] = useState<Match[]>([]);

  // Local fallback lists (for offline fields)
  const [localTeams, setLocalTeams] = useState<Team[]>([]);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [localMatches, setLocalMatches] = useState<Match[]>([]);

  const [currentLiveMatch, setCurrentLiveMatch] = useState<Match | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // 1. Google/Email Auth Observer
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Legend Scorer',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Scorer')}&background=0B132B&color=D4AF37`
        });
        setShowLoginModal(false);
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Fetch local storage fallbacks on mount
  useEffect(() => {
    const storedTeams = localStorage.getItem('royal_cricket_teams');
    const storedPlayers = localStorage.getItem('royal_cricket_players');
    const storedMatches = localStorage.getItem('royal_cricket_history');

    if (storedTeams) setLocalTeams(JSON.parse(storedTeams));
    if (storedPlayers) setLocalPlayers(JSON.parse(storedPlayers));
    if (storedMatches) setLocalMatches(JSON.parse(storedMatches));
  }, []);

  // 3. Firestore Sync (Real-time subscriptions)
  useEffect(() => {
    if (!isAuthReady) return;

    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test-dummy', 'ping'));
        setIsOnline(true);
      } catch (err) {
        console.warn("Client offline or firestore rules locked", err);
        setIsOnline(false);
      }
    };
    testConnection();

    // Subscribe to Teams
    const qTeams = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
    const unsubTeams = onSnapshot(qTeams, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
      setCloudTeams(list);
    }, (err) => console.log("Silent cloud teams block", err.message));

    // Subscribe to Players
    const qPlayers = query(collection(db, 'players'), orderBy('createdAt', 'desc'));
    const unsubPlayers = onSnapshot(qPlayers, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
      setCloudPlayers(list);
    }, (err) => console.log("Silent cloud players block", err.message));

    // Subscribe to Matches
    const qMatches = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
    const unsubMatches = onSnapshot(qMatches, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      setCloudMatches(list);
    }, (err) => console.log("Silent cloud matches block", err.message));

    return () => {
      unsubTeams();
      unsubPlayers();
      unsubMatches();
    };
  }, [isAuthReady, user]);

  // Merge cloud with local lists
  const mergedTeams = useMemo(() => {
    const list = [...cloudTeams, ...localTeams];
    return Array.from(new Map(list.map(t => [t.id, t])).values());
  }, [cloudTeams, localTeams]);

  const mergedPlayers = useMemo(() => {
    const list = [...cloudPlayers, ...localPlayers];
    return Array.from(new Map(list.map(p => [p.id, p])).values());
  }, [cloudPlayers, localPlayers]);

  const mergedMatches = useMemo(() => {
    const list = [...cloudMatches, ...localMatches];
    return Array.from(new Map(list.map(m => [m.id, m])).values());
  }, [cloudMatches, localMatches]);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleMatchSaved = () => {
    // Reload local match files if any
    const storedMatches = localStorage.getItem('royal_cricket_history');
    if (storedMatches) setLocalMatches(JSON.parse(storedMatches));
  };

  return (
    <div className="min-h-screen bg-[#050C1A] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B132B]">
      
      {/* 1. ROYAL NAVBAR */}
      <Navbar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* Margined space for top navbar alignment */}
      <main className="flex-grow pt-24 px-4 md:px-12 pb-16 space-y-8">
        
        {/* Sync/Status notification area */}
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-[#0E1726]/40 px-6 py-3.5 rounded-2xl border border-white/5 shadow text-xs">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-gray-400 font-medium font-serif italic">
              {user 
                ? `Welcome, Legend Scorer: ${user.name} (Synchronized Cloud Enabled)` 
                : 'Scoring as Imperial Guest (Saved Locally)'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isOnline ? (
              <div className="flex items-center text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Wifi className="w-3.5 h-3.5 mr-1.5" /> Online
              </div>
            ) : (
              <div className="flex items-center text-amber-500 font-mono text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <WifiOff className="w-3.5 h-3.5 mr-1.5" /> Offline Field Fallback
              </div>
            )}
          </div>
        </div>

        {/* 2. CORE DYNAMIC VIEWS */}
        {activeTab === 'scorer' && (
          <ActiveMatchScorer 
            teams={mergedTeams}
            players={mergedPlayers}
            onMatchSaved={handleMatchSaved}
            user={user}
            currentLiveMatch={currentLiveMatch}
            setCurrentLiveMatch={setCurrentLiveMatch}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsManager 
            teams={mergedTeams}
            players={mergedPlayers}
            onTeamAdded={() => {
              const stored = localStorage.getItem('royal_cricket_teams');
              if (stored) setLocalTeams(JSON.parse(stored));
            }}
            onPlayerAdded={() => {
              const stored = localStorage.getItem('royal_cricket_players');
              if (stored) setLocalPlayers(JSON.parse(stored));
            }}
            user={user}
          />
        )}

        {activeTab === 'stats' && (
          <PlayerProfile 
            players={mergedPlayers}
            teams={mergedTeams}
          />
        )}

        {activeTab === 'history' && (
          <MatchHistory 
            matches={mergedMatches}
            teams={mergedTeams}
          />
        )}
      </main>

      {/* 3. ROYAL INTERLOCK AUTH OVERLAY */}
      {showLoginModal && (
        <LoginModal 
          onLogin={() => setShowLoginModal(false)}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Royal footer crown */}
      <footer className="bg-[#040813] border-t border-[#D4AF37]/10 py-6 text-center text-gray-600 text-[10px] uppercase tracking-widest">
        <p className="flex items-center justify-center space-x-2">
          <span>Royal Cricket Ledger</span>
          <span className="text-[#D4AF37]">•</span>
          <span>Imperial Domain Match Scorekeeper</span>
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppContent />
  );
}
