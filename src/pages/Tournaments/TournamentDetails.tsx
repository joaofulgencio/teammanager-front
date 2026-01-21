import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useTournament,
  useTournamentActions,
  useRegistrations,
  useApproveRegistration,
  useRejectRegistration,
  useRegisterTeam,
  useTournamentBracket,
  useMatches,
  useReportMatchResult,
  useDeleteTournament,
} from '@/hooks'
import { useTeams } from '@/hooks'
import { Button } from '@/components/common/Button'
import type { TournamentStatus, RegistrationStatus, MatchStatus, Registration, Match, Bracket } from '@/domain'

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-yellow-100 text-yellow-800',
  ONGOING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const registrationStatusColors: Record<RegistrationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  WITHDRAWN: 'bg-gray-100 text-gray-800',
}

const matchStatusColors: Record<MatchStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  LIVE: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

type TabType = 'info' | 'registrations' | 'bracket' | 'matches'

export function TournamentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('info')

  const { data: tournament, isLoading, error } = useTournament(id!)
  const { open, close, start } = useTournamentActions(id!)
  const deleteTournament = useDeleteTournament()

  if (isLoading) {
    return <div className="text-muted-foreground">Loading tournament...</div>
  }

  if (error || !tournament) {
    return <div className="text-destructive">Error loading tournament</div>
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      await deleteTournament.mutateAsync(id!)
      navigate('/tournaments')
    }
  }

  const getAvailableActions = () => {
    const actions: { label: string; onClick: () => void; variant?: 'default' | 'destructive' | 'outline' }[] = []

    switch (tournament.status) {
      case 'DRAFT':
        actions.push({ label: 'Open Registrations', onClick: () => open.mutate() })
        actions.push({ label: 'Edit', onClick: () => navigate(`/tournaments/${id}/edit`), variant: 'outline' })
        actions.push({ label: 'Delete', onClick: handleDelete, variant: 'destructive' })
        break
      case 'OPEN':
        actions.push({ label: 'Close Registrations', onClick: () => close.mutate() })
        break
      case 'CLOSED':
        actions.push({ label: 'Start Tournament', onClick: () => start.mutate() })
        break
      case 'ONGOING':
        // No actions during ongoing
        break
      case 'COMPLETED':
      case 'CANCELLED':
        actions.push({ label: 'Delete', onClick: handleDelete, variant: 'destructive' })
        break
    }

    return actions
  }

  const tabs: { id: TabType; label: string; show: boolean }[] = [
    { id: 'info', label: 'Info', show: true },
    { id: 'registrations', label: 'Registrations', show: ['OPEN', 'CLOSED', 'ONGOING', 'COMPLETED'].includes(tournament.status) },
    { id: 'bracket', label: 'Bracket', show: ['ONGOING', 'COMPLETED'].includes(tournament.status) },
    { id: 'matches', label: 'Matches', show: ['ONGOING', 'COMPLETED'].includes(tournament.status) },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[tournament.status]}`}>
              {tournament.status}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {tournament.game} - {tournament.format.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex gap-2">
          {getAvailableActions().map((action, i) => (
            <Button
              key={i}
              onClick={action.onClick}
              variant={action.variant || 'default'}
              disabled={open.isPending || close.isPending || start.isPending || deleteTournament.isPending}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {tabs.filter(t => t.show).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && <InfoTab tournament={tournament} />}
      {activeTab === 'registrations' && <RegistrationsTab tournamentId={id!} status={tournament.status} />}
      {activeTab === 'bracket' && <BracketTab tournamentId={id!} />}
      {activeTab === 'matches' && <MatchesTab tournamentId={id!} />}
    </div>
  )
}

// Info Tab
function InfoTab({ tournament }: { tournament: NonNullable<ReturnType<typeof useTournament>['data']> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-semibold">Tournament Details</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Game</dt>
            <dd>{tournament.game}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Format</dt>
            <dd>{tournament.format.replace(/_/g, ' ')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Team Size</dt>
            <dd>{tournament.team_size} players</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Teams</dt>
            <dd>{tournament.min_teams} - {tournament.max_teams}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Dates</h3>
        <dl className="space-y-2 text-sm">
          {tournament.registration_start && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Registration Start</dt>
              <dd>{new Date(tournament.registration_start).toLocaleDateString()}</dd>
            </div>
          )}
          {tournament.registration_end && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Registration End</dt>
              <dd>{new Date(tournament.registration_end).toLocaleDateString()}</dd>
            </div>
          )}
          {tournament.start_date && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Start Date</dt>
              <dd>{new Date(tournament.start_date).toLocaleDateString()}</dd>
            </div>
          )}
          {tournament.end_date && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">End Date</dt>
              <dd>{new Date(tournament.end_date).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
      </div>

      {tournament.description && (
        <div className="md:col-span-2 space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground">{tournament.description}</p>
        </div>
      )}
    </div>
  )
}

// Dev mode approver ID (same used in backend tests)
const DEV_APPROVER_ID = '019bde00-0000-7000-8000-000000000001'

// Registrations Tab
function RegistrationsTab({ tournamentId, status }: { tournamentId: string; status: TournamentStatus }) {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const { data: registrations, isLoading } = useRegistrations(tournamentId)
  const { data: teams } = useTeams()
  const approveRegistration = useApproveRegistration(tournamentId)
  const rejectRegistration = useRejectRegistration(tournamentId)
  const registerTeam = useRegisterTeam(tournamentId)

  const canRegister = status === 'OPEN'
  const canManageRegistrations = ['OPEN', 'CLOSED'].includes(status)

  const handleRegister = async (teamId: string) => {
    await registerTeam.mutateAsync({ team_id: teamId })
    setShowRegisterModal(false)
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading registrations...</div>
  }

  // Create a map of team_id -> team for quick lookup
  const teamsMap = new Map(teams?.map(t => [t.id, t]) || [])

  const registeredTeamIds = new Set(registrations?.map(r => r.team_id) || [])
  const availableTeams = teams?.filter(t => !registeredTeamIds.has(t.id)) || []

  // Enrich registrations with team data
  const enrichedRegistrations = registrations?.map(reg => ({
    ...reg,
    team_name: teamsMap.get(reg.team_id)?.name || reg.team_name,
    team_tag: teamsMap.get(reg.team_id)?.tag || reg.team_tag,
  })) || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Registered Teams ({registrations?.filter(r => r.status === 'APPROVED').length || 0})
        </h3>
        {canRegister && (
          <Button onClick={() => setShowRegisterModal(true)}>Register Team</Button>
        )}
      </div>

      {enrichedRegistrations.length > 0 ? (
        <div className="space-y-2">
          {enrichedRegistrations.map((reg) => (
            <RegistrationCard
              key={reg.id}
              registration={reg}
              canManage={canManageRegistrations}
              onApprove={() => approveRegistration.mutate({ registrationId: reg.id, approverId: DEV_APPROVER_ID })}
              onReject={() => rejectRegistration.mutate({ registrationId: reg.id, approverId: DEV_APPROVER_ID })}
              isLoading={approveRegistration.isPending || rejectRegistration.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No registrations yet
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold mb-4">Register Team</h3>
            {availableTeams.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleRegister(team.id)}
                    disabled={registerTeam.isPending}
                    className="w-full text-left p-3 border rounded hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{team.name}</span>
                    <span className="text-muted-foreground ml-2">[{team.tag}]</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No available teams to register</p>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowRegisterModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RegistrationCard({
  registration,
  canManage,
  onApprove,
  onReject,
  isLoading,
}: {
  registration: Registration
  canManage: boolean
  onApprove: () => void
  onReject: () => void
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div className="flex items-center gap-3">
        <div>
          <span className="font-medium">{registration.team_name || 'Unknown Team'}</span>
          {registration.team_tag && (
            <span className="text-muted-foreground ml-2">[{registration.team_tag}]</span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${registrationStatusColors[registration.status]}`}>
          {registration.status}
        </span>
      </div>
      {canManage && registration.status === 'PENDING' && (
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove} disabled={isLoading}>
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={onReject} disabled={isLoading}>
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}

// Bracket Tab
function BracketTab({ tournamentId }: { tournamentId: string }) {
  const { data: bracket, isLoading, error } = useTournamentBracket(tournamentId)

  if (isLoading) {
    return <div className="text-muted-foreground">Loading bracket...</div>
  }

  if (error) {
    return <div className="text-destructive">Error loading bracket</div>
  }

  if (!bracket) {
    return <div className="text-muted-foreground">No bracket available</div>
  }

  const typedBracket = bracket as Bracket

  // Group matches by round
  const matchesByRound = typedBracket.matches?.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = []
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, typeof typedBracket.matches>) || {}

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b)

  const getRoundName = (round: number, totalRounds: number) => {
    const fromEnd = totalRounds - round
    if (fromEnd === 0) return 'Final'
    if (fromEnd === 1) return 'Semi-Final'
    if (fromEnd === 2) return 'Quarter-Final'
    return `Round ${round}`
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 min-w-max p-4">
        {rounds.map(round => (
          <div key={round} className="space-y-4">
            <h4 className="font-semibold text-center text-sm">
              {getRoundName(round, typedBracket.rounds)}
            </h4>
            <div className="space-y-4 flex flex-col justify-around h-full">
              {matchesByRound[round]
                .sort((a, b) => a.position - b.position)
                .map(match => (
                  <div
                    key={match.id}
                    className="border rounded p-3 w-48 bg-card"
                  >
                    <div className={`flex justify-between items-center p-1 rounded ${
                      match.winner_id === match.team1_id ? 'bg-green-50' : ''
                    }`}>
                      <span className="text-sm truncate">
                        {match.team1_name || 'TBD'}
                      </span>
                      <span className="font-mono font-bold">{match.team1_score}</span>
                    </div>
                    <div className={`flex justify-between items-center p-1 rounded ${
                      match.winner_id === match.team2_id ? 'bg-green-50' : ''
                    }`}>
                      <span className="text-sm truncate">
                        {match.team2_name || 'TBD'}
                      </span>
                      <span className="font-mono font-bold">{match.team2_score}</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${matchStatusColors[match.status]}`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Matches Tab
function MatchesTab({ tournamentId }: { tournamentId: string }) {
  const { data: matches, isLoading } = useMatches(tournamentId)
  const reportResult = useReportMatchResult(tournamentId)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)

  if (isLoading) {
    return <div className="text-muted-foreground">Loading matches...</div>
  }

  const handleReportResult = async () => {
    if (!selectedMatch) return

    const winnerId = team1Score > team2Score ? selectedMatch.team1_id : selectedMatch.team2_id
    if (!winnerId) return

    await reportResult.mutateAsync({
      matchId: selectedMatch.id,
      input: {
        team1_score: team1Score,
        team2_score: team2Score,
        winner_id: winnerId,
      },
    })
    setSelectedMatch(null)
    setTeam1Score(0)
    setTeam2Score(0)
  }

  const pendingMatches = matches?.filter(m => m.status === 'PENDING' && m.team1_id && m.team2_id) || []
  const completedMatches = matches?.filter(m => m.status === 'COMPLETED') || []

  return (
    <div className="space-y-6">
      {/* Pending Matches */}
      {pendingMatches.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Pending Matches</h3>
          {pendingMatches.map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">R{match.round}</span>
                <span className="font-medium">{match.team1_name || 'TBD'}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="font-medium">{match.team2_name || 'TBD'}</span>
              </div>
              <Button size="sm" onClick={() => setSelectedMatch(match)}>
                Report Result
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Completed Matches</h3>
          {completedMatches.map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">R{match.round}</span>
                <span className={match.winner_id === match.team1_id ? 'font-bold' : ''}>
                  {match.team1_name || 'TBD'}
                </span>
                <span className="font-mono">
                  {match.team1_score} - {match.team2_score}
                </span>
                <span className={match.winner_id === match.team2_id ? 'font-bold' : ''}>
                  {match.team2_name || 'TBD'}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${matchStatusColors[match.status]}`}>
                {match.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {matches?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No matches available yet
        </div>
      )}

      {/* Report Result Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold mb-4">Report Match Result</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <p className="font-medium mb-2">{selectedMatch.team1_name}</p>
                  <input
                    type="number"
                    min="0"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                    className="w-20 text-center text-2xl font-bold border rounded p-2"
                  />
                </div>
                <span className="text-muted-foreground">vs</span>
                <div className="flex-1 text-center">
                  <p className="font-medium mb-2">{selectedMatch.team2_name}</p>
                  <input
                    type="number"
                    min="0"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                    className="w-20 text-center text-2xl font-bold border rounded p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleReportResult}
                  disabled={reportResult.isPending || team1Score === team2Score}
                >
                  {reportResult.isPending ? 'Saving...' : 'Save Result'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
