import { useNavigate } from 'react-router-dom'
import { useTournaments } from '@/hooks'
import { Button } from '@/components/common/Button'
import type { TournamentStatus } from '@/domain'

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-yellow-100 text-yellow-800',
  ONGOING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function TournamentsPage() {
  const navigate = useNavigate()
  const { data: tournaments, isLoading, error } = useTournaments()

  if (isLoading) {
    return <div className="text-muted-foreground">Loading tournaments...</div>
  }

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <Button onClick={() => navigate('/tournaments/new')}>Create Tournament</Button>
      </div>

      {tournaments && tournaments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground">{tournament.game}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[tournament.status]}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{tournament.format.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{tournament.max_teams} teams max</span>
                </div>
                {tournament.start_date && (
                  <p className="text-xs text-muted-foreground">
                    Starts: {new Date(tournament.start_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No tournaments found. Create your first tournament!
        </div>
      )}
    </div>
  )
}
