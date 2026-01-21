import { Link } from 'react-router-dom'
import { useTeams, usePlayers, useTournaments } from '@/hooks'
import type { TournamentStatus } from '@/domain'

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-yellow-100 text-yellow-800',
  ONGOING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function HomePage() {
  const { data: teams, isLoading: loadingTeams } = useTeams()
  const { data: players, isLoading: loadingPlayers } = usePlayers()
  const { data: tournaments, isLoading: loadingTournaments } = useTournaments()

  const isLoading = loadingTeams || loadingPlayers || loadingTournaments

  const activeTournaments = tournaments?.filter(t => ['OPEN', 'ONGOING'].includes(t.status)) || []
  const completedTournaments = tournaments?.filter(t => t.status === 'COMPLETED') || []

  if (isLoading) {
    return <div className="text-muted-foreground">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Teams"
          value={teams?.length || 0}
          link="/teams"
        />
        <StatCard
          title="Players"
          value={players?.length || 0}
          link="/players"
        />
        <StatCard
          title="Active Tournaments"
          value={activeTournaments.length}
          link="/tournaments"
          highlight
        />
        <StatCard
          title="Completed"
          value={completedTournaments.length}
          link="/tournaments"
        />
      </div>

      {/* Active Tournaments */}
      {activeTournaments.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Active Tournaments</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTournaments.map(tournament => (
              <Link
                key={tournament.id}
                to={`/tournaments/${tournament.id}`}
                className="block border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{tournament.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[tournament.status]}`}>
                    {tournament.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tournament.game} - {tournament.format.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tournament.max_teams} teams max
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Teams */}
      {teams && teams.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Teams</h2>
            <Link to="/teams" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teams.slice(0, 4).map(team => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="block border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-bold text-sm">{team.tag}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{team.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!teams || teams.length === 0) && (!tournaments || tournaments.length === 0) && (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="font-semibold mb-2">Welcome to TeamManager!</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first team or tournament.</p>
          <div className="flex justify-center gap-4">
            <Link to="/teams" className="text-primary hover:underline">Create Team</Link>
            <Link to="/tournaments/new" className="text-primary hover:underline">Create Tournament</Link>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  link,
  highlight = false
}: {
  title: string
  value: number
  link: string
  highlight?: boolean
}) {
  return (
    <Link
      to={link}
      className={`block border rounded-lg p-4 hover:bg-accent transition-colors ${
        highlight ? 'border-primary' : ''
      }`}
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</p>
    </Link>
  )
}
