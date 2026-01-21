import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTeam, useDeleteTeam } from '@/hooks'
import { usePlayersByTeam, usePlayers, useAddPlayerToTeam, useRemovePlayerFromTeam } from '@/hooks'
import { Button } from '@/components/common/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/Select'
import { TeamFormModal } from '@/components/teams/TeamFormModal'
import type { Player } from '@/domain'

const memberRoles = ['PLAYER', 'SUBSTITUTE', 'COACH', 'MANAGER', 'ANALYST'] as const

export function TeamDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('PLAYER')

  const { data: team, isLoading, error } = useTeam(id!)
  const { data: roster } = usePlayersByTeam(id!)
  const { data: allPlayers } = usePlayers()
  const deleteTeam = useDeleteTeam()
  const addPlayer = useAddPlayerToTeam(id!)
  const removePlayer = useRemovePlayerFromTeam(id!)

  if (isLoading) {
    return <div className="text-muted-foreground">Loading team...</div>
  }

  if (error || !team) {
    return <div className="text-destructive">Error loading team</div>
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      await deleteTeam.mutateAsync(id!)
      navigate('/teams')
    }
  }

  const handleAddPlayer = async () => {
    if (!selectedPlayerId) return
    await addPlayer.mutateAsync({ playerId: selectedPlayerId, role: selectedRole })
    setShowAddModal(false)
    setSelectedPlayerId('')
    setSelectedRole('PLAYER')
  }

  const handleRemovePlayer = async (playerId: string) => {
    if (window.confirm('Remove this player from the team?')) {
      await removePlayer.mutateAsync(playerId)
    }
  }

  // Players not in this team
  const rosterIds = new Set(roster?.map(p => p.id) || [])
  const availablePlayers = allPlayers?.filter(p => !rosterIds.has(p.id)) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {team.logo_url ? (
            <img src={team.logo_url} alt={team.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold">{team.tag}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">{team.tag} - {team.country}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditModal(true)}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteTeam.isPending}>Delete</Button>
        </div>
      </div>

      {/* Roster */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Roster ({roster?.length || 0})</h2>
          <Button onClick={() => setShowAddModal(true)}>Add Player</Button>
        </div>

        {roster && roster.length > 0 ? (
          <div className="grid gap-3">
            {roster.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onRemove={() => handleRemovePlayer(player.id)}
                isRemoving={removePlayer.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            No players in this team yet
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold mb-4">Add Player to Team</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Player</label>
                {availablePlayers.length > 0 ? (
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a player" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlayers.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.nickname} ({player.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground text-sm">No available players</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {memberRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button
                  onClick={handleAddPlayer}
                  disabled={!selectedPlayerId || addPlayer.isPending}
                >
                  {addPlayer.isPending ? 'Adding...' : 'Add Player'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      <TeamFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        team={team}
      />
    </div>
  )
}

function PlayerCard({
  player,
  onRemove,
  isRemoving
}: {
  player: Player
  onRemove: () => void
  isRemoving: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="font-medium">{player.nickname.slice(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-medium">{player.nickname}</p>
          <p className="text-sm text-muted-foreground">{player.name} - {player.country}</p>
        </div>
        {player.role && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {player.role}
          </span>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={onRemove} disabled={isRemoving}>
        Remove
      </Button>
    </div>
  )
}
