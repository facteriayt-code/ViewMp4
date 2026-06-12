import React, { useState } from 'react';
import { Users, UserPlus, Shield, Plus, Trash2, Home, Star, ArrowRight } from 'lucide-react';
import { Team, Player } from '../types.ts';
import { db } from '../firebase.ts';
import { collection, setDoc, doc, deleteDoc } from 'firebase/firestore';

interface TeamsManagerProps {
  teams: Team[];
  players: Player[];
  onTeamAdded: () => void;
  onPlayerAdded: () => void;
  user: any;
}

const TeamsManager: React.FC<TeamsManagerProps> = ({ teams, players, onTeamAdded, onPlayerAdded, user }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeamIdForPlayer, setSelectedTeamIdForPlayer] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playerInputMode, setPlayerInputMode] = useState<'single' | 'bulk'>('single');
  const [bulkPlayerNames, setBulkPlayerNames] = useState('');
  const [activeTab, setActiveTab ] = useState<'list' | 'add'>('list');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    const teamId = 't-' + Date.now();
    const newTeam: Team = {
      id: teamId,
      name: newTeamName.trim(),
      logoUrl: `https://images.unsplash.com/photo-1540747737956-[#D4AF37]?q=80&w=150`,
      createdAt: new Date().toISOString()
    };

    // Always persist to local fallback storage first for instant updates & offline resiliency
    const storedTeams = JSON.parse(localStorage.getItem('royal_cricket_teams') || '[]');
    storedTeams.push(newTeam);
    localStorage.setItem('royal_cricket_teams', JSON.stringify(storedTeams));

    if (user) {
      try {
        await setDoc(doc(db, 'teams', teamId), newTeam);
      } catch (err: any) {
        console.error("Cloud Err Team Creation", err);
        setErrorMsg(`Team saved locally, but failed to sync to Cloud: ${err.message || err}`);
      }
    }

    setNewTeamName('');
    setIsLoading(false);
    onTeamAdded();
  };

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamIdForPlayer) return;

    const namesToProcess: string[] = [];
    if (playerInputMode === 'single') {
      if (!newPlayerName.trim()) return;
      namesToProcess.push(newPlayerName.trim());
    } else {
      if (!bulkPlayerNames.trim()) return;
      // Split by newline or comma
      const splitNames = bulkPlayerNames.split(/[\n,]+/);
      splitNames.forEach(name => {
        const trimmed = name.trim();
        if (trimmed.length > 0) {
          namesToProcess.push(trimmed);
        }
      });
    }

    if (namesToProcess.length === 0) return;

    setIsLoading(true);
    setErrorMsg(null);

    const createdPlayers: Player[] = namesToProcess.map((name, index) => {
      const playerId = `p-${Date.now()}-${index}`;
      return {
        id: playerId,
        name,
        teamId: selectedTeamIdForPlayer,
        createdAt: new Date().toISOString(),
        stats: {
          matchesPlayed: 0,
          runs: 0,
          wickets: 0,
          ballsBowled: 0,
          runsConceded: 0,
          highestScore: 0,
          bestBowlingWickets: 0,
          bestBowlingRuns: 0
        }
      };
    });

    // Always persist to local fallback storage first for instant updates & offline resiliency
    const storedPlayers = JSON.parse(localStorage.getItem('royal_cricket_players') || '[]');
    storedPlayers.push(...createdPlayers);
    localStorage.setItem('royal_cricket_players', JSON.stringify(storedPlayers));

    if (user) {
      try {
        // Safe parallel creation using setDoc
        await Promise.all(
          createdPlayers.map(p => setDoc(doc(db, 'players', p.id), p))
        );
      } catch (err: any) {
        console.error("Cloud Err Player Creation", err);
        setErrorMsg(`Players saved locally, but failed to sync to Cloud: ${err.message || err}`);
      }
    }

    setNewPlayerName('');
    setBulkPlayerNames('');
    setIsLoading(false);
    onPlayerAdded();
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team? All associated players will be orphaned.")) return;
    
    // Always delete locally first
    const stored = JSON.parse(localStorage.getItem('royal_cricket_teams') || '[]');
    localStorage.setItem('royal_cricket_teams', JSON.stringify(stored.filter((t: any) => t.id !== teamId)));

    if (user) {
      try {
        await deleteDoc(doc(db, 'teams', teamId));
      } catch (err: any) {
        console.error("Cloud Err Team Deletion", err);
        setErrorMsg(`Failed to delete team from Cloud: ${err.message || err}`);
      }
    }
    onTeamAdded();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Selector view sub-tabs */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => { setActiveTab('list'); setErrorMsg(null); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeTab === 'list' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
        >
          View Royal Guilds
        </button>
        <button
          onClick={() => { setActiveTab('add'); setErrorMsg(null); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeTab === 'add' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
        >
          Add Team or Player
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 text-center animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {teams.length === 0 ? (
            <div className="col-span-2 text-center p-12 bg-[#0E1726]/80 rounded-3xl border border-white/5">
              <Users className="w-12 h-12 text-[#D4AF37]/50 mx-auto" />
              <h3 className="text-white text-lg font-bold mt-4 font-sans">No Teams Registered Yet</h3>
              <p className="text-gray-400 text-xs mt-1">Visit 'Add Team or Player' to build your local cricket rosters.</p>
            </div>
          ) : (
            teams.map((team) => {
              const teamRoster = players.filter(p => p.teamId === team.id);
              
              return (
                <div key={team.id} className="bg-gradient-to-br from-[#0E1726]/90 to-[#0A0F1A] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden transition group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-[#0B132B] font-bold text-lg shadow-md font-sans">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-bold font-sans tracking-wide">{team.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono">ESTABLISHED {new Date(team.createdAt).getFullYear()}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Active Roster ({teamRoster.length} Players)</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                      {teamRoster.map((player) => (
                        <div key={player.id} className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center space-x-2 text-xs">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-gray-200 truncate font-semibold">{player.name}</span>
                        </div>
                      ))}
                      {teamRoster.length === 0 && (
                        <p className="text-[10px] text-gray-500 italic col-span-2 py-2">No warriors added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          
          {/* Create Team Form */}
          <div className="bg-[#0E1726]/80 p-8 rounded-3xl border border-[#D4AF37]/20 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-white text-lg font-bold font-sans flex items-center">
                <Shield className="w-5 h-5 text-[#D4AF37] mr-2" /> Add Royal Guild (Team)
              </h3>
              <p className="text-gray-400 text-xs">Create a new local team record in the imperial database.</p>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Team Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Crown Knights"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                Inscribe Team Record
              </button>
            </form>
          </div>

          {/* Create Player Form */}
          <div className="bg-[#0E1726]/80 p-8 rounded-3xl border border-[#D4AF37]/20 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-white text-lg font-bold font-sans flex items-center">
                <UserPlus className="w-5 h-5 text-[#D4AF37] mr-2" /> Add Player
              </h3>
              <p className="text-gray-400 text-xs">Map new local player profiles into a registered team.</p>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Belongs to Team</label>
                <select 
                  value={selectedTeamIdForPlayer}
                  onChange={(e) => setSelectedTeamIdForPlayer(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[#D4AF37] outline-none"
                  required
                >
                  <option value="" className="bg-[#0E1726]">-- Select Destination Guild --</option>
                  {teams.map(t => <option key={t.id} value={t.id} className="bg-[#0E1726]">{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Registration Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayerInputMode('single')}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${playerInputMode === 'single' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    Single Warrior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerInputMode('bulk')}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${playerInputMode === 'bulk' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    Bulk Inscription
                  </button>
                </div>
              </div>

              {playerInputMode === 'single' ? (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Player Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Arthur Pendragon"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Warriors Roster (One per line or comma-separated)</label>
                  <textarea 
                    placeholder="e.g.&#10;Arthur Pendragon&#10;Lancelot du Lac&#10;Gawain of Orkney"
                    rows={4}
                    value={bulkPlayerNames}
                    onChange={(e) => setBulkPlayerNames(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:border-[#D4AF37] outline-none min-h-[100px]"
                    required
                  />
                  <p className="text-[10px] text-gray-500 italic">Separate warrior names with commas or line breaks.</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading || !selectedTeamIdForPlayer || (playerInputMode === 'single' ? !newPlayerName.trim() : !bulkPlayerNames.trim())}
                className="w-full py-4 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {playerInputMode === 'single' ? 'Inscribe Player Profile' : 'Inscribe Warriors Bulk'}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default TeamsManager;
