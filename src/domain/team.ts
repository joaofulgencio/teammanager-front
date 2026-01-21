export interface Team {
  id: string
  name: string
  tag: string
  country: string
  logo_url?: string
  socials?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface CreateTeamInput {
  name: string
  tag: string
  country: string
  logo_url?: string
  socials?: Record<string, string>
}

export interface UpdateTeamInput {
  name?: string
  tag?: string
  country?: string
  logo_url?: string
  socials?: Record<string, string>
}
