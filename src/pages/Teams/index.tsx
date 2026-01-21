import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeams } from '@/hooks'
import { Button } from '@/components/common/Button'
import { TeamFormModal } from '@/components/teams/TeamFormModal'

export function TeamsPage() {
  const navigate = useNavigate()
  const { data: teams, isLoading, error } = useTeams()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreate = () => {
    setModalOpen(true)
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading teams...</div>
  }

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button onClick={handleCreate}>Create Team</Button>
      </div>

      {teams && teams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <div className="flex items-center gap-3">
                {team.logo_url ? (
                  <img
                    src={team.logo_url}
                    alt={team.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-bold">{team.tag}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {team.tag} • {team.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No teams found. Create your first team!
        </div>
      )}

      <TeamFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        team={null}
      />
    </div>
  )
}
