import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Star, UserPlus, Zap, Trash2, Check, Sparkles, User, ShieldAlert } from 'lucide-react';
import { Player, Team, Match, InningsState, MatchBatsmanLive, MatchBowlerLive } from '../types.ts';
import { collection, addDoc, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';

interface ActiveMatchScorerProps {
  teams: Team[];
  players: Player[];
  onMatchSaved: () => void;
  user: any;
  currentLiveMatch: Match | null;
  setCurrentLiveMatch: (match: Match | null) => void;
}

const ActiveMatchScorer: React.FC<ActiveMatchScorerProps> = ({
  teams,
  players,
  onMatchSaved,
  user,
  currentLiveMatch,
  setCurrentLiveMatch
}) => {
  // New Match Setup State
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [oversLimit, setOversLimit] = useState(5);
  
  // Toss State
  const [isTossing, setIsTossing] = useState(false);
  const [tossWinnerId, setTossWinnerId] = useState('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');
  const [tossCompleted, setTossCompleted] = useState(false);
  
  // Scoring Setup State
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  // Selection models for striker/non-striker/bowler
  const [selectedStrikerId, setSelectedStrikerId] = useState('');
  const [selectedNonStrikerId, setSelectedNonStrikerId] = useState('');
  const [selectedBowlerId, setSelectedBowlerId] = useState('');
  
  // UI States
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped'>('bowled');
  const [whoIsOutId, setWhoIsOutId] = useState('');
  const [newBatsmanId, setNewBatsmanId] = useState('');
  const [dismissalDescription, setDismissalDescription] = useState('Bowled');
  
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [runsType, setRunsType] = useState<'normal' | 'wide' | 'noball' | 'bye' | 'legbye'>('normal');

  // Load active match from localStorage on mount if exists
  useEffect(() => {
    if (!currentLiveMatch) {
      const saved = localStorage.getItem('royal_cricket_live_match');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCurrentLiveMatch(parsed);
          setIsSetupComplete(true);
          setTossCompleted(true);
          
          const activeInnings = parsed.currentInnings === 1 ? parsed.firstInnings : parsed.secondInnings;
          if (activeInnings) {
            setSelectedStrikerId(activeInnings.currentStrikerId || '');
            setSelectedNonStrikerId(activeInnings.currentNonStrikerId || '');
            setSelectedBowlerId(activeInnings.currentBowlerId || '');
          }
        } catch (e) {
          console.error("Failed to load saved live match", e);
        }
      }
    }
  }, [currentLiveMatch, setCurrentLiveMatch]);

  // Persist live match logic on state change
  const saveStateLocally = (match: Match | null) => {
    if (match) {
      localStorage.setItem('royal_cricket_live_match', JSON.stringify(match));
    } else {
      localStorage.removeItem('royal_cricket_live_match');
    }
  };

  // Safe fetch team details
  const teamA = teams.find(t => t.id === teamAId);
  const teamB = teams.find(t => t.id === teamBId);

  // Auto/Simulated Quick Players generator if real players lists are empty
  const getTeamPlayers = (teamId: string): Player[] => {
    const list = players.filter(p => p.teamId === teamId);
    if (list.length > 0) return list;
    
    // Royal defaults if empty
    const isTeamA = teamId === teamAId;
    const names = isTeamA 
      ? ['Arthur Pendragon', 'Lancelot Du Lac', 'Gawain Crest', 'Galahad Pure', 'Tristan Bow', 'Bedivere Guard', 'Ywain Lion', 'Percival Quest', 'Kay Steward', 'Bors Loyal', 'Uther Royal']
      : ['Thor Odinson', 'Odin Allfather', 'Loki Sly', 'Baldur Bright', 'Heimdall Sentry', 'Freyr Harvest', 'Tyr Brave', 'Vidar Silent', 'Hermod Swift', 'Bor Ancestor', 'Frigg Queen'];
    
    return names.map((name, idx) => ({
      id: `${teamId}-p-${idx}`,
      name,
      teamId,
      createdAt: new Date().toISOString(),
      stats: { matchesPlayed: 0, runs: 0, wickets: 0, ballsBowled: 0, runsConceded: 0, highestScore: 0, bestBowlingWickets: 0, bestBowlingRuns: 0 }
    }));
  };

  const handleToss = () => {
    if (!teamAId || !teamBId) return;
    setIsTossing(true);
    setTimeout(() => {
      const winnerId = Math.random() < 0.5 ? teamAId : teamBId;
      setTossWinnerId(winnerId);
      setTossDecision(Math.random() < 0.5 ? 'bat' : 'bowl');
      setIsTossing(false);
      setTossCompleted(true);
    }, 1500);
  };

  const handleSetupStart = () => {
    if (!teamAId || !teamBId || !tossWinnerId) return;

    const battingTeamId = tossWinnerId === teamAId 
      ? (tossDecision === 'bat' ? teamAId : teamBId)
      : (tossDecision === 'bat' ? teamBId : teamAId);
      
    const bowlingTeamId = battingTeamId === teamAId ? teamBId : teamAId;

    const initialInnings: InningsState = {
      battingTeamId,
      bowlingTeamId,
      runs: 0,
      wickets: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
      batsmen: {},
      bowlers: {},
      oversTimeline: []
    };

    const newMatch: Match = {
      id: 'm-' + Date.now(),
      teamAId,
      teamBId,
      teamAName: teams.find(t => t.id === teamAId)?.name || 'Team Crown',
      teamBName: teams.find(t => t.id === teamBId)?.name || 'Team Titan',
      tossWinnerId,
      tossDecision,
      oversLimit,
      status: 'live',
      createdAt: new Date().toISOString(),
      currentInnings: 1,
      firstInnings: initialInnings
    };

    // Auto assign top 2 batsmen and first bowler
    const battingPlayers = getTeamPlayers(battingTeamId);
    const bowlingPlayers = getTeamPlayers(bowlingTeamId);
    
    if (battingPlayers.length >= 2 && bowlingPlayers.length >= 1) {
      setSelectedStrikerId(battingPlayers[0].id);
      setSelectedNonStrikerId(battingPlayers[1].id);
      setSelectedBowlerId(bowlingPlayers[0].id);
      
      // Initialize live stats inside InningsState
      newMatch.firstInnings.batsmen[battingPlayers[0].id] = {
        id: battingPlayers[0].id,
        name: battingPlayers[0].name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      newMatch.firstInnings.batsmen[battingPlayers[1].id] = {
        id: battingPlayers[1].id,
        name: battingPlayers[1].name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      newMatch.firstInnings.bowlers[bowlingPlayers[0].id] = {
        id: bowlingPlayers[0].id,
        name: bowlingPlayers[0].name,
        overs: 0,
        balls: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0
      };
      
      newMatch.firstInnings.currentStrikerId = battingPlayers[0].id;
      newMatch.firstInnings.currentNonStrikerId = battingPlayers[1].id;
      newMatch.firstInnings.currentBowlerId = bowlingPlayers[0].id;
    }

    setCurrentLiveMatch(newMatch);
    setIsSetupComplete(true);
    saveStateLocally(newMatch);
  };

  const handleRecordBall = (runsScored: number, scoreType: 'normal' | 'wide' | 'noball' | 'bye' | 'legbye') => {
    if (!currentLiveMatch) return;

    // Shallow copy live match logic
    const updatedMatch = { ...currentLiveMatch };
    const innings = updatedMatch.currentInnings === 1 ? updatedMatch.firstInnings : updatedMatch.secondInnings!;
    
    if (!innings || !selectedStrikerId || !selectedBowlerId) return;

    // Ensure active items are properly modeled
    if (!innings.batsmen[selectedStrikerId]) {
      const pl = getTeamPlayers(innings.battingTeamId).find(p => p.id === selectedStrikerId);
      innings.batsmen[selectedStrikerId] = {
        id: selectedStrikerId,
        name: pl?.name || 'Batsman',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
    }
    if (!innings.bowlers[selectedBowlerId]) {
      const pl = getTeamPlayers(innings.bowlingTeamId).find(p => p.id === selectedBowlerId);
      innings.bowlers[selectedBowlerId] = {
        id: selectedBowlerId,
        name: pl?.name || 'Bowler',
        overs: 0,
        balls: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0
      };
    }

    const batsman = innings.batsmen[selectedStrikerId];
    const bowler = innings.bowlers[selectedBowlerId];

    let ballIsLegitimate = true;
    let runToBat = 0;
    let runToBowl = 0;
    let runToTotal = 0;
    let displaySymbol = '';

    if (scoreType === 'normal') {
      runToBat = runsScored;
      runToBowl = runsScored;
      runToTotal = runsScored;
      displaySymbol = runsScored === 0 ? '•' : runsScored.toString();
    } else if (scoreType === 'wide') {
      ballIsLegitimate = false;
      innings.extras.wides += (1 + runsScored);
      runToBowl += (1 + runsScored);
      runToTotal += (1 + runsScored);
      displaySymbol = `${runsScored > 0 ? runsScored : ''}wd`;
    } else if (scoreType === 'noball') {
      ballIsLegitimate = false;
      innings.extras.noBalls += 1;
      runToBat = runsScored; // runs scored off the bat on no-ball go to batsman
      runToBowl += (1 + runsScored);
      runToTotal += (1 + runsScored);
      displaySymbol = `${runsScored > 0 ? runsScored : ''}nb`;
    } else if (scoreType === 'bye') {
      innings.extras.byes += runsScored;
      runToTotal += runsScored;
      displaySymbol = `${runsScored}b`;
    } else if (scoreType === 'legbye') {
      innings.extras.legByes += runsScored;
      runToTotal += runsScored;
      displaySymbol = `${runsScored}lb`;
    }

    // Apply outcomes
    innings.runs += runToTotal;
    batsman.runs += runToBat;
    bowler.runsConceded += runToBowl;

    if (runToBat === 4) batsman.fours += 1;
    if (runToBat === 6) batsman.sixes += 1;

    if (ballIsLegitimate) {
      innings.balls += 1;
      batsman.balls += 1;
      bowler.balls += 1;
      
      // Update bowler's over format
      const overPart = bowler.balls % 6;
      const completedOvers = Math.floor(bowler.balls / 6);
      bowler.overs = Number(`${completedOvers}.${overPart}`);
    }

    innings.oversTimeline.push(displaySymbol);

    // Rotate strike if 1 or 3 runs scored off bat/bye/legbye
    const totalMoveRuns = runToBat > 0 ? runToBat : (scoreType === 'bye' || scoreType === 'legbye' ? runsScored : 0);
    if (totalMoveRuns === 1 || totalMoveRuns === 3) {
      rotateStrike(innings);
    }

    // Check second innings target completion
    if (updatedMatch.currentInnings === 2 && updatedMatch.firstInnings) {
      const target = updatedMatch.firstInnings.runs + 1;
      if (innings.runs >= target) {
        // MATCH OVER! Chase accomplished!
        handleCompleteMatch(updatedMatch);
        return;
      }
    }

    // Check Over End (6 legitimate balls)
    const oversLimitsMet = innings.balls >= (updatedMatch.oversLimit * 6);
    const legitimateBallsInOver = innings.balls % 6 === 0 && ballIsLegitimate && innings.balls > 0;

    if (legitimateBallsInOver && !oversLimitsMet) {
      // Over finished, select new bowler
      setShowBowlerModal(true);
      // Automatically rotate strike on end of over
      rotateStrike(innings);
    }

    // Check innings expiry
    const allOut = innings.wickets >= 10 || getTeamPlayers(innings.battingTeamId).length - innings.wickets <= 1;
    if (oversLimitsMet || allOut) {
      if (updatedMatch.currentInnings === 1) {
        alert("Innings complete! Switching side.");
        startSecondInnings(updatedMatch);
      } else {
        handleCompleteMatch(updatedMatch);
        return;
      }
    }

    setCurrentLiveMatch(updatedMatch);
    saveStateLocally(updatedMatch);
  };

  const rotateStrike = (innings: InningsState) => {
    const temp = selectedStrikerId;
    setSelectedStrikerId(selectedNonStrikerId);
    setSelectedNonStrikerId(temp);
    innings.currentStrikerId = selectedNonStrikerId;
    innings.currentNonStrikerId = temp;
  };

  const handleApplyWicket = () => {
    if (!currentLiveMatch) return;

    const updatedMatch = { ...currentLiveMatch };
    const innings = updatedMatch.currentInnings === 1 ? updatedMatch.firstInnings : updatedMatch.secondInnings!;
    
    if (!innings || !selectedStrikerId || !selectedBowlerId) return;

    const outPlayerId = whoIsOutId || selectedStrikerId;
    const batsmanOut = innings.batsmen[outPlayerId];
    if (batsmanOut) {
      batsmanOut.isOut = true;
      batsmanOut.howOut = `${wicketType.toUpperCase()} - ${dismissalDescription}`;
    }

    innings.wickets += 1;
    innings.oversTimeline.push('W');

    // Bowler gets credit if not runout
    if (wicketType !== 'runout') {
      const bowler = innings.bowlers[selectedBowlerId];
      if (bowler) bowler.wickets += 1;
    }

    // Set wicket on the scorecard
    const maxCapacity = getTeamPlayers(innings.battingTeamId).length;
    const allOut = innings.wickets >= 10 || innings.wickets >= maxCapacity - 1;
    const oversLimitsMet = innings.balls >= (updatedMatch.oversLimit * 6);

    if (allOut || oversLimitsMet) {
      setShowWicketModal(false);
      if (updatedMatch.currentInnings === 1) {
        alert("Innings completed! Second innings starting.");
        startSecondInnings(updatedMatch);
      } else {
        handleCompleteMatch(updatedMatch);
      }
      return;
    }

    // Setup replacement batsman
    if (outPlayerId === selectedStrikerId) {
      setSelectedStrikerId(newBatsmanId);
      innings.currentStrikerId = newBatsmanId;
    } else {
      setSelectedNonStrikerId(newBatsmanId);
      innings.currentNonStrikerId = newBatsmanId;
    }

    // Initialize new batsman stats
    const pl = getTeamPlayers(innings.battingTeamId).find(p => p.id === newBatsmanId);
    innings.batsmen[newBatsmanId] = {
      id: newBatsmanId,
      name: pl?.name || 'Batsman',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false
    };

    setShowWicketModal(false);
    setCurrentLiveMatch(updatedMatch);
    saveStateLocally(updatedMatch);
  };

  const startSecondInnings = (match: Match) => {
    const battingTeamId = match.firstInnings.bowlingTeamId;
    const bowlingTeamId = match.firstInnings.battingTeamId;

    const initialInnings: InningsState = {
      battingTeamId,
      bowlingTeamId,
      runs: 0,
      wickets: 0,
      balls: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
      batsmen: {},
      bowlers: {},
      oversTimeline: []
    };

    match.currentInnings = 2;
    match.secondInnings = initialInnings;

    const battingPlayers = getTeamPlayers(battingTeamId);
    const bowlingPlayers = getTeamPlayers(bowlingTeamId);
    
    if (battingPlayers.length >= 2 && bowlingPlayers.length >= 1) {
      setSelectedStrikerId(battingPlayers[0].id);
      setSelectedNonStrikerId(battingPlayers[1].id);
      setSelectedBowlerId(bowlingPlayers[0].id);
      
      match.secondInnings.batsmen[battingPlayers[0].id] = {
        id: battingPlayers[0].id,
        name: battingPlayers[0].name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      match.secondInnings.batsmen[battingPlayers[1].id] = {
        id: battingPlayers[1].id,
        name: battingPlayers[1].name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      match.secondInnings.bowlers[bowlingPlayers[0].id] = {
        id: bowlingPlayers[0].id,
        name: bowlingPlayers[0].name,
        overs: 0,
        balls: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0
      };
      
      match.secondInnings.currentStrikerId = battingPlayers[0].id;
      match.secondInnings.currentNonStrikerId = battingPlayers[1].id;
      match.secondInnings.currentBowlerId = bowlingPlayers[0].id;
    }
  };

  const handleCompleteMatch = async (match: Match) => {
    match.status = 'completed';
    
    // Determine winner details
    const firstScore = match.firstInnings.runs;
    const secondScore = match.secondInnings?.runs || 0;
    const target = firstScore + 1;

    let winnerId = '';
    let margin = '';

    if (secondScore >= target) {
      // Chasing team wins
      winnerId = match.secondInnings!.battingTeamId;
      const wicketsLeft = getTeamPlayers(winnerId).length - match.secondInnings!.wickets - 1;
      margin = `${match.secondInnings!.battingTeamId === match.teamAId ? match.teamAName : match.teamBName} won by ${wicketsLeft} wickets`;
    } else {
      // Defending team wins
      winnerId = match.firstInnings.battingTeamId;
      const runsDifference = firstScore - secondScore;
      margin = `${match.firstInnings.battingTeamId === match.teamAId ? match.teamAName : match.teamBName} won by ${runsDifference} runs`;
    }

    match.winnerId = winnerId;
    match.margin = margin;

    // Always persist to local fallback storage first for instant updates & offline resiliency
    const history = JSON.parse(localStorage.getItem('royal_cricket_history') || '[]');
    const matchId = match.id || 'm-' + Date.now();
    const matchWithId = { ...match, id: matchId };

    // Push or replace match record locally
    const existingIndex = history.findIndex((m: any) => m.id === matchId);
    if (existingIndex >= 0) {
      history[existingIndex] = matchWithId;
    } else {
      history.push(matchWithId);
    }
    localStorage.setItem('royal_cricket_history', JSON.stringify(history));

    // Save of stats & match in Firestore if user is signed in
    if (user) {
      try {
        await setDoc(doc(db, 'matches', matchId), matchWithId);
        // We could also dynamically update Player profile stats in DB, but let's keep it simple and robust
      } catch (err) {
        console.error("Failed to sync match to cloud", err);
      }
    }

    alert(`🏆 Match Finished! ${margin}`);
    setCurrentLiveMatch(null);
    saveStateLocally(null);
    setIsSetupComplete(false);
    setTossCompleted(false);
    onMatchSaved();
  };

  const handleNewOverBowler = (bowlerId: string) => {
    if (!currentLiveMatch) return;

    const updatedMatch = { ...currentLiveMatch };
    const innings = updatedMatch.currentInnings === 1 ? updatedMatch.firstInnings : updatedMatch.secondInnings!;
    
    setSelectedBowlerId(bowlerId);
    innings.currentBowlerId = bowlerId;
    innings.oversTimeline = []; // Reset timeline for new over

    if (!innings.bowlers[bowlerId]) {
      const pl = getTeamPlayers(innings.bowlingTeamId).find(p => p.id === bowlerId);
      innings.bowlers[bowlerId] = {
        id: bowlerId,
        name: pl?.name || 'Bowler',
        overs: 0,
        balls: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0
      };
    }

    setShowBowlerModal(false);
    setCurrentLiveMatch(updatedMatch);
    saveStateLocally(updatedMatch);
  };

  const handleAbandonMatch = () => {
    if (confirm("Are you sure you want to abandon this match? All live scoring data will be lost.")) {
      setCurrentLiveMatch(null);
      saveStateLocally(null);
      setIsSetupComplete(false);
      setTossCompleted(false);
    }
  };

  // Pre-calculate batsman and bowler models safely
  const activeInnings = currentLiveMatch 
    ? (currentLiveMatch.currentInnings === 1 ? currentLiveMatch.firstInnings : currentLiveMatch.secondInnings!)
    : null;

  const striker = activeInnings?.batsmen[selectedStrikerId];
  const nonStriker = activeInnings?.batsmen[selectedNonStrikerId];
  const bowler = activeInnings?.bowlers[selectedBowlerId];

  // Eligible replacement batsmen who aren't yet out/active
  const getSubstitutes = (): Player[] => {
    if (!activeInnings) return [];
    const all = getTeamPlayers(activeInnings.battingTeamId);
    return all.filter(p => !activeInnings.batsmen[p.id]?.isOut && p.id !== selectedStrikerId && p.id !== selectedNonStrikerId);
  };

  // Eligible bowlers who are not currently active
  const getEligibleBowlers = (): Player[] => {
    if (!activeInnings) return [];
    const all = getTeamPlayers(activeInnings.bowlingTeamId);
    return all.filter(p => p.id !== selectedBowlerId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. SETUP MODULE */}
      {!isSetupComplete && (
        <div className="bg-[#0E1726]/80 p-8 rounded-3xl border border-[#D4AF37]/20 shadow-2xl space-y-8 backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-2xl shadow-xl">
              <Trophy className="w-8 h-8 text-[#0B132B]" />
            </div>
            <h2 className="text-[#D4AF37] text-2xl md:text-3xl font-bold uppercase tracking-wider font-sans mt-3">Incept New Match Ledger</h2>
            <p className="text-gray-400 text-xs">Choose Teams, configure matches & conduct the premium Coin Toss</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Team A Choice */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Team A (Host)</label>
              <select 
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[#D4AF37] outline-none"
              >
                <option value="" className="bg-[#0E1726]">-- Select Team A --</option>
                {teams.map(t => <option key={t.id} value={t.id} className="bg-[#0E1726]">{t.name}</option>)}
                {teams.length === 0 && <option value="ta-mock" className="bg-[#0E1726]">Team Royal Knight Cruisers (Demo)</option>}
              </select>
            </div>

            {/* Team B Choice */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Team B (Visitor)</label>
              <select 
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[#D4AF37] outline-none"
              >
                <option value="" className="bg-[#0E1726]">-- Select Team B --</option>
                {teams.map(t => <option key={t.id} value={t.id} className="bg-[#0E1726]">{t.name}</option>)}
                {teams.length === 0 && <option value="tb-mock" className="bg-[#0E1726]">Team Golden Titans (Demo)</option>}
              </select>
            </div>
          </div>

          {/* Matches config / overs */}
          <div className="space-y-2 max-w-xs mx-auto">
            <label className="text-[10px] text-center block uppercase font-bold tracking-widest text-[#D4AF37]">Overs Limit</label>
            <input 
              type="number"
              min={1}
              max={100}
              value={oversLimit}
              onChange={(e) => setOversLimit(parseInt(e.target.value))}
              className="w-full text-center bg-white/5 border border-white/10 rounded-2xl p-4 font-bold text-lg text-[#D4AF37] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="border-t border-white/5 pt-6">
            {!tossCompleted ? (
              <button 
                onClick={handleToss}
                disabled={isTossing || !teamAId || !teamBId || teamAId === teamBId}
                className="w-full py-4 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B] hover:scale-[1.02] active:scale-95 transition-all text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50"
              >
                {isTossing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>{isTossing ? 'Tossing Crown Coin...' : 'Conduct Toss'}</span>
              </button>
            ) : (
              <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-6 rounded-2xl max-w-lg mx-auto">
                  <p className="text-[#D4AF37] font-serif text-lg italic">
                    👑 {tossWinnerId === teamAId ? (teamA?.name || 'Team A') : (teamB?.name || 'Team B')} Won the Toss!
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-4">
                    <button 
                      onClick={() => setTossDecision('bat')}
                      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${tossDecision === 'bat' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      Batted First
                    </button>
                    <button 
                      onClick={() => setTossDecision('bowl')}
                      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${tossDecision === 'bowl' ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      Bowled First
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSetupStart}
                  className="w-full py-4 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition"
                >
                  Embark Match Scorer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ACTIVE SCORER INTERFACE */}
      {isSetupComplete && currentLiveMatch && activeInnings && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-[#0E1726]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">LIVE LEDGER</span>
            </div>
            <div className="text-center font-sans">
              <h3 className="text-white text-sm font-bold truncate">
                {currentLiveMatch.teamAName} <span className="text-[#D4AF37]">vs</span> {currentLiveMatch.teamBName}
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {currentLiveMatch.oversLimit} Overs Match • Toss won by {currentLiveMatch.tossWinnerId === currentLiveMatch.teamAId ? currentLiveMatch.teamAName : currentLiveMatch.teamBName} ({currentLiveMatch.tossDecision})
              </p>
            </div>
            <button 
              onClick={handleAbandonMatch}
              className="p-2 text-gray-500 hover:text-red-400 transition"
              title="Abandon Match"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* ROYAL SCOREBOARD DISPLAY */}
          <div className="bg-gradient-to-b from-[#0E1726]/90 to-[#050C1A] p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden backdrop-blur-md text-center space-y-4">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#AA7C11] to-[#D4AF37]"></div>

            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center justify-center space-x-2">
              <span>{currentLiveMatch.currentInnings === 1 ? 'First Innings' : 'Second Innings (Chasing)'}</span>
              <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[9px]">
                {activeInnings.battingTeamId === currentLiveMatch.teamAId ? currentLiveMatch.teamAName : currentLiveMatch.teamBName} batting
              </span>
            </div>

            {/* Main digital-classical metrics */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
              <div>
                <h1 className="text-6xl md:text-7xl font-sans font-black tracking-tighter text-white">
                  {activeInnings.runs}<span className="text-[#D4AF37]">/</span>{activeInnings.wickets}
                </h1>
                <p className="text-gray-400 text-xs mt-1 font-mono tracking-wider">
                  Overs: <span className="text-white font-bold text-sm">{(activeInnings.balls / 6).toFixed(0)}.{activeInnings.balls % 6}</span> ({activeInnings.balls} Balls)
                </p>
              </div>

              {/* Target calculation if Innings 2 */}
              {currentLiveMatch.currentInnings === 2 && currentLiveMatch.firstInnings && (
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-2xl flex flex-col justify-center min-w-[200px]">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Target to Beat</p>
                  <p className="text-2xl font-black text-white mt-1">
                    {currentLiveMatch.firstInnings.runs + 1} Runs
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2 font-medium">
                    Need <span className="text-[#D4AF37] font-bold">{Math.max(0, (currentLiveMatch.firstInnings.runs + 1) - activeInnings.runs)} Runs</span> 
                    &nbsp;from <span className="text-white font-bold">{(currentLiveMatch.oversLimit * 6) - activeInnings.balls} balls</span>
                  </p>
                </div>
              )}
            </div>

            {/* Run Rate Details */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto border-t border-white/5 pt-4 text-xs">
              <div>
                <p className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Current Run Rate</p>
                <p className="text-white font-bold text-lg mt-0.5">
                  {(activeInnings.balls > 0 ? (activeInnings.runs / (activeInnings.balls / 6)) : 0).toFixed(2)}
                </p>
              </div>
              {currentLiveMatch.currentInnings === 2 && currentLiveMatch.firstInnings && (
                <div>
                  <p className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Required Run Rate</p>
                  <p className="text-[#D4AF37] font-bold text-lg mt-0.5">
                    {((currentLiveMatch.oversLimit * 6) - activeInnings.balls > 0 
                      ? (Math.max(0, (currentLiveMatch.firstInnings.runs + 1) - activeInnings.runs) / (((currentLiveMatch.oversLimit * 6) - activeInnings.balls) / 6))
                      : 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Over mini timeline */}
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">This Over:</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {activeInnings.oversTimeline.map((item, idx) => (
                  <span 
                    key={idx}
                    className={`w-7 h-7 text-xs font-bold rounded-full flex items-center justify-center select-none shadow-md ${
                      item === 'W' 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : item.includes('wd') || item.includes('nb')
                          ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20'
                          : item === '•' || item === '0'
                            ? 'bg-white/5 text-gray-500'
                            : parseInt(item) >= 4
                              ? 'bg-[#D4AF37] text-[#0B132B]'
                              : 'bg-white/10 text-white'
                    }`}
                  >
                    {item}
                  </span>
                ))}
                {activeInnings.oversTimeline.length === 0 && (
                  <span className="text-xs text-gray-500 italic">No balls bowled in this over yet</span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVE PLAYERS CARD (Batsmen and Bowlers active list) */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Batter Module */}
            <div className="bg-[#0E1726]/80 p-6 rounded-3xl border border-white/5 backdrop-blur-md space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] flex items-center">
                <Star className="w-4 h-4 mr-2" /> Batting Crew
              </h3>
              
              <div className="space-y-3">
                {/* Striker */}
                {striker && (
                  <div className="p-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-l-4 border-l-[#D4AF37] border-white/5 flex justify-between items-center relative">
                    <span className="absolute -top-1.5 right-4 bg-[#D4AF37] text-[#0B132B] text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Striker</span>
                    <div>
                      <h4 className="text-white text-sm font-bold">{striker.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        Strike Rate: <span className="text-white font-semibold">{(striker.balls > 0 ? (striker.runs / striker.balls) * 100 : 0).toFixed(1)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{striker.runs}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        {striker.balls} b • {striker.fours}x4 • {striker.sixes}x6
                      </p>
                    </div>
                  </div>
                )}

                {/* Non Striker */}
                {nonStriker && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-l-4 border-l-gray-500/40 border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-gray-300 text-sm font-semibold">{nonStriker.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        Strike Rate: <span className="text-white font-semibold">{(nonStriker.balls > 0 ? (nonStriker.runs / nonStriker.balls) * 100 : 0).toFixed(1)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-300">{nonStriker.runs}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">
                        {nonStriker.balls} b • {nonStriker.fours}x4 • {nonStriker.sixes}x6
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bowler Module */}
            <div className="bg-[#0E1726]/80 p-6 rounded-3xl border border-white/5 backdrop-blur-md space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] flex items-center">
                <Zap className="w-4 h-4 mr-2" /> Bowling Garrison
              </h3>
              
              {bowler && (
                <div className="p-4 bg-gradient-to-r from-red-500/5 to-transparent rounded-2xl border border-l-4 border-l-[#AA7C11] border-white/5 flex justify-between items-center relative">
                  <span className="absolute -top-1.5 right-4 bg-[#AA7C11] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Bowler</span>
                  <div>
                    <h4 className="text-white text-sm font-bold">{bowler.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">
                      Economy: <span className="text-white font-semibold">{(bowler.balls > 0 ? (bowler.runsConceded / (bowler.balls / 6)) : 0).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{bowler.wickets} <span className="text-gray-400 font-normal text-sm">Wkts</span></p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">
                      {bowler.overs} ov • {bowler.runsConceded} runs conceded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE RECORDING PANEL */}
          <div className="bg-[#0E1726]/80 p-6 rounded-3xl border border-[#D4AF37]/20 shadow-2xl space-y-6 backdrop-blur-md">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#D4AF37]">Log Ball Event</h3>
              
              {/* Extras Selector */}
              <div className="flex space-x-2 text-xs">
                <button 
                  onClick={() => setRunsType(runsType === 'normal' ? 'wide' : 'normal')}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold border transition ${runsType === 'wide' ? 'bg-amber-600 text-white border-amber-600 shadow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                >
                  Wide
                </button>
                <button 
                  onClick={() => setRunsType(runsType === 'normal' ? 'noball' : 'normal')}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold border transition ${runsType === 'noball' ? 'bg-amber-600 text-white border-amber-600 shadow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                >
                  No Ball
                </button>
                <button 
                  onClick={() => setRunsType(runsType === 'normal' ? 'bye' : 'normal')}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold border transition ${runsType === 'bye' ? 'bg-amber-600 text-white border-amber-600 shadow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                >
                  Bye
                </button>
                <button 
                  onClick={() => setRunsType(runsType === 'normal' ? 'legbye' : 'normal')}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold border transition ${runsType === 'legbye' ? 'bg-amber-600 text-white border-amber-600 shadow' : 'bg-white/5 text-gray-400 border-white/10'}`}
                >
                  Leg-Bye
                </button>
              </div>
            </div>

            {/* Run Selection Cluster */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {[0, 1, 2, 3, 4, 6].map((runs) => (
                <button
                  key={runs}
                  onClick={() => {
                    handleRecordBall(runs, runsType);
                    setRunsType('normal'); // Reset after scoring
                  }}
                  className="p-5 bg-gradient-to-br from-white/10 to-white/5 hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/10 hover:border-[#D4AF37]/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md group transform active:scale-95"
                >
                  <span className="text-2xl font-black text-white group-hover:text-[#D4AF37] transition">{runs}</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-semibold mt-1">
                    {runs === 0 ? 'Dot' : runs === 4 ? 'Boundary' : runs === 6 ? 'Maximum' : 'Runs'}
                  </span>
                </button>
              ))}
            </div>

            {/* Out / Wicket Button */}
            <div className="pt-2">
              <button 
                onClick={() => {
                  setWhoIsOutId(selectedStrikerId);
                  setShowWicketModal(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>WICKET / DISMISSAL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WICKET EXTRA DIALOG MODAL */}
      {showWicketModal && currentLiveMatch && activeInnings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[200] p-4 text-white">
          <div className="bg-[#0E1726] border border-[#D4AF37]/30 max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#D4AF37] font-sans text-xl font-bold uppercase tracking-wider text-center">Record Match Dismissal</h3>
            
            {/* Pick Out Player */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Which Batter Got Out?</label>
              <select 
                value={whoIsOutId}
                onChange={(e) => setWhoIsOutId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none"
              >
                <option value={selectedStrikerId} className="bg-[#0E1726]">Striker ({striker?.name})</option>
                <option value={selectedNonStrikerId} className="bg-[#0E1726]">Non-Striker ({nonStriker?.name})</option>
              </select>
            </div>

            {/* Pick Wicket Type */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Wicket Method</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['bowled', 'caught', 'lbw', 'runout', 'stumped'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setWicketType(type as any);
                      setDismissalDescription(type.toUpperCase());
                    }}
                    className={`p-3 rounded-xl transition font-bold uppercase ${wicketType === type ? 'bg-[#D4AF37] text-[#0B132B]' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Pick Replacement Batsman from Bench */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-300">Select Next Batsman</label>
              <select 
                value={newBatsmanId}
                onChange={(e) => setNewBatsmanId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none"
              >
                <option value="" className="bg-[#0E1726]">-- Select Runner from Bench --</option>
                {getSubstitutes().map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0E1726]">{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => setShowWicketModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 transition text-gray-400 font-bold uppercase rounded-xl text-xs tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyWicket}
                disabled={!newBatsmanId}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 transition text-white font-bold uppercase rounded-xl text-xs tracking-wider border border-red-500/20"
              >
                Commit dismissal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CHOOSE NEW BOWLER MODAL */}
      {showBowlerModal && currentLiveMatch && activeInnings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[200] p-4 text-white">
          <div className="bg-[#0E1726] border border-[#D4AF37]/30 max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#D4AF37] font-sans text-xl font-bold uppercase tracking-wider text-center flex items-center justify-center">
              👑 Over Finished
            </h3>
            <p className="text-gray-400 text-xs text-center leading-relaxed">
              6 legitimate balls have elapsed. Select the next bowler to lead the garrison attack. (Cannot be the bowler of the previous over).
            </p>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Select New Bowler</label>
              <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                {getEligibleBowlers().map((p) => {
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleNewOverBowler(p.id)}
                      className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-[#D4AF37]/20 border border-white/5 text-sm font-semibold transition flex justify-between items-center group"
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] text-gray-500 group-hover:text-[#0B132B]">Elect Bowler</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveMatchScorer;
