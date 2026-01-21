import { api } from './api'
import type { Player, CreatePlayerInput } from '@/domain'

export const playerService = {
  getAll: async (): Promise<Player[]> => {
    const { data } = await api.get<Player[]>('/player')
    return data
  },

  getById: async (id: string): Promise<Player> => {
    const { data } = await api.get<Player>(`/player/${id}`)
    return data
  },

  getByTeam: async (teamId: string): Promise<Player[]> => {
    const { data } = await api.get<Player[]>(`/player/team/${teamId}`)
    return data
  },

  create: async (input: CreatePlayerInput): Promise<Player> => {
    const { data } = await api.post<Player>('/player', input)
    return data
  },

  update: async (id: string, input: Partial<CreatePlayerInput>): Promise<Player> => {
    const { data } = await api.put<Player>(`/player/${id}`, input)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/player/${id}`)
  },

  addToTeam: async (playerId: string, teamId: string, role: string): Promise<void> => {
    await api.post(`/player/${playerId}/team`, { team_id: teamId, role })
  },

  removeFromTeam: async (playerId: string, teamId: string): Promise<void> => {
    await api.delete(`/player/${playerId}/team/${teamId}`)
  },
}
