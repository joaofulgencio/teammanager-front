import { useState } from 'react'
import { usePlayers } from '@/hooks'
import { Button } from '@/components/common/Button'
import { PlayerFormModal } from '@/components/players/PlayerFormModal'
import type { Player } from '@/domain'

export function PlayersPage() {
  const { data: players, isLoading, error } = usePlayers()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const handleCreate = () => {
    setSelectedPlayer(null)
    setModalOpen(true)
  }

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player)
    setModalOpen(true)
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading players...</div>
  }

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Players</h1>
        <Button onClick={handleCreate}>Add Player</Button>
      </div>

      {players && players.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
              onClick={() => handleEdit(player)}
            >
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold">{player.nickname}</h3>
                  <p className="text-sm text-muted-foreground">{player.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{player.country}</span>
                  {player.steam_id_64 && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs">{player.steam_id_64}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No players found. Add your first player!
        </div>
      )}

      <PlayerFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        player={selectedPlayer}
      />
    </div>
  )
}
