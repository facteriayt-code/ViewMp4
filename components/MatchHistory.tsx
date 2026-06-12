import React, { useState, useMemo } from 'react';
import { BookOpen, Trophy, Compass, Star, ChevronDown, Award, Sparkles, Sliders } from 'lucide-react';
import { Match, Team } from '../types.ts';

interface MatchHistoryProps {
  matches: Match[];
  teams: Team[];
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches, teams }) => {
  const [filterTeamId, setFilterTeamId] = useState('');
  
  // Head to Head calculation state
  const [h2hTeamA, setH2HTeamA] = useState('');
  const [h2hTeamB, setH2HTeamB] = useState('');

  const filteredMatches = useMemo(() => {
    if (!filterTeamId) return matches;
    return matches.filter(m => m.teamAId === filterTeamId || m.teamBId === filterTeamId);
  }, [matches, filterTeamId]);

  // Head to Head stats computation
  const h2hStats = useMemo(() => {
    if (!h2hTeamA || !h2hTeamB || h2hTeamA === h2hTeamB) return null;
    
    const games = matches.filter(m => 
      (m.teamAId === h2hTeamA && m.teamBId === h2hTeamB) || 
      (m.teamAId === h2hTeamB && m.teamBId === h2hTeamA)
    );

    const teamAWins = games.filter(m => m.winnerId === h2hTeamA).length;
    const teamBWins = games.filter(m => m.winnerId === h2hTeamB).length;
    const abandoned = games.filter(m => m.status === 'abandoned').length;

    const teamAName = teams.find(t => t.id === h2hTeamA)?.name || 'Team A';
    const teamBName = teams.find(t => t.id === h2hTeamB)?.name || 'Team B';

    const ratioPercentA = games.length > 0 ? (teamAWins / games.length) * 100 : 0;
    const ratioPercentB = games.length > 0 ? (teamBWins / games.length) * 100 : 0;

    return {
      totalGames: games.length,
      teamAWins,
      teamBWins,
      abandoned,
      teamAName,
      teamBName,
      ratioPercentA,
      ratioPercentB
    };
  }, [matches, h2hTeamA, h2hTeamB, teams]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. HEAD TO HEAD PORTAL (Logic-driven layout) */}
      <div className="bg-gradient-to-br from-[#0E1726]/90 to-[#050C1A] border border-[#D4AF37]/30 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]"></div>
        
        <div className="text-center space-y-1">
          <h3 className="text-[#D4AF37] text-lg font-black uppercase tracking-widest font-sans flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2" /> Head-to-Head Archive Lounge
          </h3>
          <p className="text-gray-400 text-xs">Query historic matches and compare direct win ratio margins.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Team Selectors */}
          <select 
            value={h2hTeamA}
            onChange={(e) => setH2HTeamA(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-[#D4AF37] outline-none"
          >
            <option value="" className="bg-[#0E1726]">-- Select Gladiator Team A --</option>
            {teams.map(t => <option key={t.id} value={t.id} className="bg-[#0E1726]">{t.name}</option>)}
          </select>

          <select 
            value={h2hTeamB}
            onChange={(e) => setH2HTeamB(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-[#D4AF37] outline-none"
          >
            <option value="" className="bg-[#0E1726]">-- Select Gladiator Team B --</option>
            {teams.map(t => <option key={t.id} value={t.id} className="bg-[#0E1726]">{t.name}</option>)}
          </select>
        </div>

        {/* Display H2H Results */}
        {h2hStats ? (
          <div className="space-y-6 pt-4 border-t border-white/5 animate-in zoom-in-95 duration-200">
            {h2hStats.totalGames === 0 ? (
              <p className="text-xs text-gray-500 italic text-center">No historic games logged between these two teams yet.</p>
            ) : (
              <div className="space-y-4 max-w-xl mx-auto text-center">
                <p className="text-sm font-bold text-gray-300">
                  {h2hStats.totalGames} Direct Engagements Fought
                </p>

                {/* Split Win metrics */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-right">
                    <h4 className="text-[#D4AF37] font-black text-2xl font-serif">{h2hStats.teamAWins} Wins</h4>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{h2hStats.teamAName}</p>
                  </div>
                  <div className="text-gray-500 text-xs font-mono">VS</div>
                  <div className="text-left">
                    <h4 className="text-white font-black text-2xl font-serif">{h2hStats.teamBWins} Wins</h4>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{h2hStats.teamBName}</p>
                  </div>
                </div>

                {/* Multi-ratio bar indicator */}
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/10">
                  <div 
                    style={{ width: `${h2hStats.ratioPercentA}%` }} 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]" 
                    title={`${h2hStats.teamAName}: ${h2hStats.ratioPercentA.toFixed(1)}%`}
                  ></div>
                  <div 
                    style={{ width: `${h2hStats.ratioPercentB}%` }} 
                    className="h-full bg-white/20" 
                    title={`${h2hStats.teamBName}: ${h2hStats.ratioPercentB.toFixed(1)}%`}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest px-1">
                  <span>{h2hStats.ratioPercentA.toFixed(0)}% WIN RATE</span>
                  <span>{h2hStats.ratioPercentB.toFixed(0)}% WIN RATE</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          h2hTeamA && h2hTeamB && (
            <p className="text-xs text-center text-red-400 font-bold bg-red-400/10 p-3 rounded-2xl max-w-sm mx-auto">
              Please choose two distinct opposing teams to query comparisons.
            </p>
          )
        )}
      </div>

      {/* 2. MATCH RECORDS LIST */}
      <div className="space-y-4">
        
        {/* Filtering Options */}
        <div className="flex items-center justify-between">
          <h3 className="text-white text-md font-bold font-sans flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#D4AF37]" strokeWidth={2.5} /> Match Annals
          </h3>
          
          <select
            value={filterTeamId}
            onChange={(e) => setFilterTeamId(e.target.value)}
            className="bg-[#0E1726] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="">Filter by Team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* History Stream */}
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const dateStr = new Date(match.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            });

            return (
              <div key={match.id} className="bg-[#0E1726]/80 border border-white/5 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#D4AF37]/20 transition animate-in slide-in-from-bottom-3 duration-200">
                
                {/* Match Identity */}
                <div className="space-y-2 flex-grow max-w-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-white/10 font-bold px-2 py-0.5 rounded-full text-gray-400">{dateStr}</span>
                    <span className="text-[10px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 font-bold px-2 py-0.5 rounded-full text-[#D4AF37]">
                      {match.oversLimit} Overs Match
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-md font-bold text-white font-sans mt-2">
                    <span>{match.teamAName}</span>
                    <span className="text-[#D4AF37] text-xs lowercase">vs</span>
                    <span>{match.teamBName}</span>
                  </div>

                  <p className="text-xs text-gray-400 font-medium">
                    {match.firstInnings.runs}/{match.firstInnings.wickets} in {match.oversLimit} overs &nbsp;•&nbsp;&nbsp;
                    {match.secondInnings ? `${match.secondInnings.runs}/${match.secondInnings.wickets} scored` : 'Completed innings'}
                  </p>
                </div>

                {/* Outcome Margin Crest */}
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center md:min-w-[200px]">
                  <Trophy className="w-5 h-5 text-[#D4AF37] mb-1.5" />
                  <p className="text-white text-xs font-bold leading-tight uppercase font-sans tracking-wide">
                    {match.winnerId === match.teamAId ? match.teamAName : match.teamBName} Wins
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium font-mono mt-1 italic">{match.margin}</p>
                </div>
              </div>
            );
          })}
          {filteredMatches.length === 0 && (
            <div className="text-center p-12 bg-[#0E1726]/85 border border-white/5 rounded-3xl">
              <Trophy className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-white font-bold mt-4">Unfinished Battles</h4>
              <p className="text-gray-400 text-xs mt-1">Select Live Match Scorer above to record outcomes and populate the annals.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MatchHistory;
