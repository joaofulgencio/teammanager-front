import { api } from './api'
import type { Team, CreateTeamInput, UpdateTeamInput } from '@/domain'

export const teamService = {
  getAll: async (): Promise<Team[]> => {
    const { data } = await api.get('/team')
    return data
  },

  getById: async (id: string): Promise<Team> => {
    const { data } = await api.get(`/team/${id}`)
    return data
  },

  create: async (input: CreateTeamInput): Promise<Team> => {
    const { data } = await api.post('/team', input)
    return data
  },

  update: async (id: string, input: UpdateTeamInput): Promise<Team> => {
    const { data } = await api.put(`/team/${id}`, input)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/team/${id}`)
  },
}
