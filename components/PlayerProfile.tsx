import React, { useState, useMemo } from 'react';
import { Search, Trophy, Sparkles, Star, Zap, Activity, Award } from 'lucide-react';
import { Player, Team } from '../types.ts';

interface PlayerProfileProps {
  players: Player[];
  teams: Team[];
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ players, teams }) => {
  const [search, setSearch] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const teamMap = useMemo(() => {
    return new Map(teams.map(t => [t.id, t.name]));
  }, [teams]);

  const filteredPlayers = useMemo(() => {
    const s = search.toLowerCase();
    return players.filter(p => p.name.toLowerCase().includes(s) || (teamMap.get(p.teamId) || '').toLowerCase().includes(s));
  }, [players, search, teamMap]);

  // Set first player as selected if none is selected
  const activePlayer = useMemo(() => {
    if (selectedPlayerId) {
      return players.find(p => p.id === selectedPlayerId) || null;
    }
    return filteredPlayers[0] || null;
  }, [players, selectedPlayerId, filteredPlayers]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Search Header */}
      <div className="relative flex items-center bg-[#0E1726]/60 border border-[#D4AF37]/20 rounded-2xl px-4 py-3 shadow-md group">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
        <input 
          type="text" 
          placeholder="Search Imperial Player Database by Name or Team..."
          className="bg-transparent border-none focus:outline-none text-sm ml-3 w-full placeholder:text-gray-600 text-white font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Players Sidebar list */}
        <div className="bg-[#0E1726]/80 border border-[#D4AF37]/10 rounded-3xl p-4 overflow-y-auto max-h-[500px] shadow-lg space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] px-2 mb-2">Registered Legends ({filteredPlayers.length})</p>
          {filteredPlayers.map((p) => {
            const teamName = teamMap.get(p.teamId) || 'Unknown Guild';
            const isActive = activePlayer?.id === p.id;
            
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlayerId(p.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition flex items-center justify-between border ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-[#D4AF37] text-white shadow' 
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs">{p.name}</h4>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider font-mono">{teamName}</p>
                </div>
                <Trophy className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
              </button>
            );
          })}
          {filteredPlayers.length === 0 && (
            <p className="text-xs text-gray-500 italic text-center py-6">No records match your query</p>
          )}
        </div>

        {/* Detailed Stats Card View */}
        <div className="md:col-span-2">
          {activePlayer ? (
            <div className="bg-gradient-to-b from-[#0E1726] to-[#040914] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-8 animate-in fade-in duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

              {/* Character Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#D4AF37] p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-[#0E1726] rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#D4AF37] animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-2xl font-black font-sans tracking-wide">{activePlayer.name}</h3>
                  <p className="text-xs text-[#D4AF37]/80 font-mono uppercase tracking-widest mt-1">
                    {teamMap.get(activePlayer.teamId) || 'Independent Warrior'}
                  </p>
                </div>
              </div>

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Total Matches */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Matches</span>
                  <span className="text-white text-2xl font-black mt-1 font-serif">
                    {activePlayer.stats?.matchesPlayed || 0}
                  </span>
                </div>

                {/* Runs */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest">Runs Scored</span>
                  <span className="text-[#D4AF37] text-2xl font-black mt-1 font-serif">
                    {activePlayer.stats?.runs || 0}
                  </span>
                </div>

                {/* Wickets */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Wickets</span>
                  <span className="text-white text-2xl font-black mt-1 font-serif">
                    {activePlayer.stats?.wickets || 0}
                  </span>
                </div>

                {/* Strike Rate proxy */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Highest Runs</span>
                  <span className="text-white text-2xl font-black mt-1 font-serif">
                    {activePlayer.stats?.highestScore || 0}
                  </span>
                </div>
              </div>

              {/* Complete Performance Ledger */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> Extended Ledger Metrics
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Batting Detailed */}
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Batting Attributes</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400">Average Runs / Match:</span>
                        <span className="text-white">
                          {activePlayer.stats?.matchesPlayed > 0 
                            ? (activePlayer.stats.runs / activePlayer.stats.matchesPlayed).toFixed(1)
                            : '0.0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400 font-mono">Special Crest status:</span>
                        <span className="text-green-400 flex items-center">
                          <Award className="w-3.5 h-3.5 mr-1" /> Elite Class
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bowling Detailed */}
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Bowling Garrison Attributes</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400">Balls Delivered:</span>
                        <span className="text-white">{activePlayer.stats?.ballsBowled || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400">Economy Rate:</span>
                        <span className="text-white">
                          {activePlayer.stats?.ballsBowled > 0 
                            ? (activePlayer.stats.runsConceded / (activePlayer.stats.ballsBowled / 6)).toFixed(2)
                            : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0E1726]/80 p-12 rounded-3xl border border-white/5 text-center">
              <Star className="w-12 h-12 text-[#D4AF37]/50 mx-auto" />
              <h3 className="text-white text-lg font-bold mt-4">Select a Legend Profile</h3>
              <p className="text-gray-400 text-xs mt-1">Select any registered legend player from the list to view their detailed royal stats sheet.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PlayerProfile;
