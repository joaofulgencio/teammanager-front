import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Textarea } from '@/components/common/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select'
import { useTournament, useCreateTournament, useUpdateTournament } from '@/hooks'
import type { CreateTournamentInput, GameType, TournamentFormat } from '@/domain'

const GAMES: { value: GameType; label: string }[] = [
  { value: 'DOTA2', label: 'Dota 2' },
  { value: 'CS2', label: 'Counter-Strike 2' },
]

const FORMATS: { value: TournamentFormat; label: string }[] = [
  { value: 'SINGLE_ELIMINATION', label: 'Single Elimination' },
  { value: 'DOUBLE_ELIMINATION', label: 'Double Elimination' },
  { value: 'ROUND_ROBIN', label: 'Round Robin' },
  { value: 'SWISS', label: 'Swiss' },
  { value: 'GROUPS_PLAYOFFS', label: 'Groups + Playoffs' },
]

export function TournamentForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { data: tournament, isLoading } = useTournament(id || '')
  const createTournament = useCreateTournament()
  const updateTournament = useUpdateTournament()

  const [formData, setFormData] = useState<CreateTournamentInput>({
    name: '',
    slug: '',
    description: '',
    game: 'DOTA2',
    format: 'SINGLE_ELIMINATION',
    max_teams: 16,
    min_teams: 2,
    team_size: 5,
  })

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        slug: tournament.slug,
        description: tournament.description || '',
        game: tournament.game,
        format: tournament.format,
        max_teams: tournament.max_teams,
        min_teams: tournament.min_teams,
        team_size: tournament.team_size,
      })
    }
  }, [tournament])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && id) {
        await updateTournament.mutateAsync({ id, input: formData })
      } else {
        await createTournament.mutateAsync(formData)
      }
      navigate('/tournaments')
    } catch (error) {
      console.error('Failed to save tournament:', error)
    }
  }

  const isPending = createTournament.isPending || updateTournament.isPending

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/tournaments')}>
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Tournament' : 'Create Tournament'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="The International 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL-friendly)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ti-2024"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tournament description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Game</Label>
              <Select
                value={formData.game}
                onValueChange={(value: GameType) => setFormData({ ...formData, game: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((game) => (
                    <SelectItem key={game.value} value={game.value}>
                      {game.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={formData.format}
                onValueChange={(value: TournamentFormat) =>
                  setFormData({ ...formData, format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_teams">Max Teams</Label>
              <Input
                id="max_teams"
                type="number"
                min={2}
                value={formData.max_teams}
                onChange={(e) =>
                  setFormData({ ...formData, max_teams: parseInt(e.target.value) || 16 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_teams">Min Teams</Label>
              <Input
                id="min_teams"
                type="number"
                min={2}
                value={formData.min_teams}
                onChange={(e) =>
                  setFormData({ ...formData, min_teams: parseInt(e.target.value) || 2 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                type="number"
                min={1}
                value={formData.team_size}
                onChange={(e) =>
                  setFormData({ ...formData, team_size: parseInt(e.target.value) || 5 })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/tournaments')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Tournament'}
          </Button>
        </div>
      </form>
    </div>
  )
}
