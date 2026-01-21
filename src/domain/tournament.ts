export type TournamentStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type TournamentFormat = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS' | 'GROUPS_PLAYOFFS'
export type GameType = 'DOTA2' | 'CS2'

export interface Tournament {
  id: string
  name: string
  slug: string
  description?: string
  game: GameType
  format: TournamentFormat
  status: TournamentStatus
  organizer_id: string
  max_teams: number
  min_teams: number
  team_size: number
  registration_start?: string
  registration_end?: string
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface CreateTournamentInput {
  name: string
  slug?: string
  description?: string
  game: GameType
  format: TournamentFormat
  max_teams?: number
  min_teams?: number
  team_size?: number
}

// Registration types
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'

export interface Registration {
  id: string
  tournament_id: string
  team_id: string
  team_name?: string
  team_tag?: string
  status: RegistrationStatus
  registered_by: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RegisterTeamInput {
  team_id: string
  notes?: string
}

// Match types
export type MatchStatus = 'PENDING' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'

export interface Match {
  id: string
  tournament_id: string
  round: number
  position: number
  team1_id?: string
  team2_id?: string
  team1_name?: string
  team2_name?: string
  team1_score: number
  team2_score: number
  winner_id?: string
  status: MatchStatus
  scheduled_at?: string
  started_at?: string
  ended_at?: string
  best_of: number
  created_at: string
  updated_at: string
}

export interface ScheduleMatchInput {
  scheduled_at: string
}

export interface ReportMatchResultInput {
  team1_score: number
  team2_score: number
  winner_id: string
}

// Game types (individual games within a match, e.g., Bo3)
export interface Game {
  id: string
  match_id: string
  game_number: number
  team1_score: number
  team2_score: number
  winner_id?: string
  duration_minutes?: number
  map?: string
  created_at: string
}

export interface AddGameInput {
  game_number: number
  team1_score: number
  team2_score: number
  winner_id: string
  duration_minutes?: number
  map?: string
}

// Bracket types
export interface BracketMatch {
  id: string
  round: number
  position: number
  team1_id?: string
  team2_id?: string
  team1_name?: string
  team2_name?: string
  team1_score: number
  team2_score: number
  winner_id?: string
  status: MatchStatus
  next_match_id?: string
}

export interface Bracket {
  tournament_id: string
  format: TournamentFormat
  rounds: number
  matches: BracketMatch[]
}
