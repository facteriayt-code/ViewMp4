export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  runs: number;
  wickets: number;
  ballsBowled: number;
  runsConceded: number;
  highestScore: number;
  bestBowlingWickets: number;
  bestBowlingRuns: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

export interface MatchBatsmanLive {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut?: string;
}

export interface MatchBowlerLive {
  id: string;
  name: string;
  overs: number; // calculated as balls / 6
  balls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
}

export interface InningsState {
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  balls: number; // total balls bowled in this innings
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  batsmen: { [playerId: string]: MatchBatsmanLive };
  bowlers: { [playerId: string]: MatchBowlerLive };
  currentStrikerId?: string;
  currentNonStrikerId?: string;
  currentBowlerId?: string;
  oversTimeline: string[]; // e.g. ["1", ".", "4", "W", "wd"] for current over
}

export interface Match {
  id: string;
  teamAId: string;
  teamAName: string;
  teamBId: string;
  teamBName: string;
  tossWinnerId: string;
  tossDecision: 'bat' | 'bowl';
  oversLimit: number;
  status: 'live' | 'completed' | 'abandoned';
  winnerId?: string;
  margin?: string;
  createdAt: string;
  currentInnings: 1 | 2;
  firstInnings: InningsState;
  secondInnings?: InningsState;
}
