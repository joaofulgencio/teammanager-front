export interface Player {
  id: string
  name: string
  nickname: string
  country: string
  steam_id_64?: string
  steam_id_32?: string
  discord_id?: string
  socials?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface CreatePlayerInput {
  name: string
  nickname: string
  country: string
  steam_id_64?: string
  discord_id?: string
  team_id?: string
  role?: string
}
