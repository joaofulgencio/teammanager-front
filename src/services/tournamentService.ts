import { api } from './api'
import type {
  Tournament,
  CreateTournamentInput,
  Registration,
  RegisterTeamInput,
  Match,
  ScheduleMatchInput,
  ReportMatchResultInput,
  Game,
  AddGameInput,
  Bracket
} from '@/domain'

export const tournamentService = {
  getAll: async (): Promise<Tournament[]> => {
    const { data } = await api.get<Tournament[]>('/tournament')
    return data
  },

  getById: async (id: string): Promise<Tournament> => {
    const { data } = await api.get<Tournament>(`/tournament/${id}`)
    return data
  },

  getBySlug: async (slug: string): Promise<Tournament> => {
    const { data } = await api.get<Tournament>(`/tournament/slug/${slug}`)
    return data
  },

  create: async (input: CreateTournamentInput): Promise<Tournament> => {
    const { data } = await api.post<Tournament>('/tournament', input)
    return data
  },

  update: async (id: string, input: Partial<CreateTournamentInput>): Promise<Tournament> => {
    const { data } = await api.put<Tournament>(`/tournament/${id}`, input)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tournament/${id}`)
  },

  open: async (id: string): Promise<Tournament> => {
    const { data } = await api.post<Tournament>(`/tournament/${id}/open`)
    return data
  },

  close: async (id: string): Promise<Tournament> => {
    const { data } = await api.post<Tournament>(`/tournament/${id}/close`)
    return data
  },

  start: async (id: string): Promise<Tournament> => {
    const { data } = await api.post<Tournament>(`/tournament/${id}/start`)
    return data
  },

  getBracket: async (id: string): Promise<Bracket> => {
    const { data } = await api.get<Bracket>(`/tournament/${id}/bracket`)
    return data
  },

  // Registration methods
  getRegistrations: async (tournamentId: string): Promise<Registration[]> => {
    const { data } = await api.get<Registration[]>(`/tournament/${tournamentId}/registrations`)
    return data
  },

  register: async (tournamentId: string, input: RegisterTeamInput): Promise<Registration> => {
    const { data } = await api.post<Registration>(`/tournament/${tournamentId}/register`, input)
    return data
  },

  approveRegistration: async (registrationId: string, approverId: string): Promise<Registration> => {
    const { data } = await api.post<Registration>(`/registration/${registrationId}/approve`, {
      approver_id: approverId
    })
    return data
  },

  rejectRegistration: async (registrationId: string, approverId: string): Promise<Registration> => {
    const { data } = await api.post<Registration>(`/registration/${registrationId}/reject`, {
      approver_id: approverId
    })
    return data
  },

  withdrawRegistration: async (registrationId: string): Promise<void> => {
    await api.delete(`/registration/${registrationId}`)
  },

  // Match methods
  getMatches: async (tournamentId: string): Promise<Match[]> => {
    const { data } = await api.get<Match[]>(`/tournament/${tournamentId}/matches`)
    return data
  },

  getMatch: async (matchId: string): Promise<Match> => {
    const { data } = await api.get<Match>(`/match/${matchId}`)
    return data
  },

  scheduleMatch: async (matchId: string, input: ScheduleMatchInput): Promise<Match> => {
    const { data } = await api.put<Match>(`/match/${matchId}/schedule`, input)
    return data
  },

  reportMatchResult: async (matchId: string, input: ReportMatchResultInput): Promise<Match> => {
    const { data } = await api.post<Match>(`/match/${matchId}/result`, input)
    return data
  },

  // Game methods
  getGames: async (matchId: string): Promise<Game[]> => {
    const { data } = await api.get<Game[]>(`/match/${matchId}/games`)
    return data
  },

  addGame: async (matchId: string, input: AddGameInput): Promise<Game> => {
    const { data } = await api.post<Game>(`/match/${matchId}/games`, input)
    return data
  },
}
