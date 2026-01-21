import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentService } from '@/services'
import type {
  CreateTournamentInput,
  RegisterTeamInput,
  ScheduleMatchInput,
  ReportMatchResultInput,
  AddGameInput
} from '@/domain'

export function useTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getAll,
  })
}

export function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: () => tournamentService.getById(id),
    enabled: !!id,
  })
}

export function useTournamentBySlug(slug: string) {
  return useQuery({
    queryKey: ['tournaments', 'slug', slug],
    queryFn: () => tournamentService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTournamentInput) => tournamentService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export function useUpdateTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateTournamentInput> }) =>
      tournamentService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export function useDeleteTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tournamentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export function useTournamentActions(id: string) {
  const queryClient = useQueryClient()

  const open = useMutation({
    mutationFn: () => tournamentService.open(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })

  const close = useMutation({
    mutationFn: () => tournamentService.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })

  const start = useMutation({
    mutationFn: () => tournamentService.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })

  return { open, close, start }
}

export function useTournamentBracket(id: string) {
  return useQuery({
    queryKey: ['tournaments', id, 'bracket'],
    queryFn: () => tournamentService.getBracket(id),
    enabled: !!id,
  })
}

// Registration hooks
export function useRegistrations(tournamentId: string) {
  return useQuery({
    queryKey: ['tournaments', tournamentId, 'registrations'],
    queryFn: () => tournamentService.getRegistrations(tournamentId),
    enabled: !!tournamentId,
  })
}

export function useRegisterTeam(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RegisterTeamInput) => tournamentService.register(tournamentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'registrations'] })
    },
  })
}

export function useApproveRegistration(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ registrationId, approverId }: { registrationId: string; approverId: string }) =>
      tournamentService.approveRegistration(registrationId, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'registrations'] })
    },
  })
}

export function useRejectRegistration(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ registrationId, approverId }: { registrationId: string; approverId: string }) =>
      tournamentService.rejectRegistration(registrationId, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'registrations'] })
    },
  })
}

export function useWithdrawRegistration(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (registrationId: string) => tournamentService.withdrawRegistration(registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'registrations'] })
    },
  })
}

// Match hooks
export function useMatches(tournamentId: string) {
  return useQuery({
    queryKey: ['tournaments', tournamentId, 'matches'],
    queryFn: () => tournamentService.getMatches(tournamentId),
    enabled: !!tournamentId,
  })
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => tournamentService.getMatch(matchId),
    enabled: !!matchId,
  })
}

export function useScheduleMatch(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ matchId, input }: { matchId: string; input: ScheduleMatchInput }) =>
      tournamentService.scheduleMatch(matchId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'matches'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'bracket'] })
    },
  })
}

export function useReportMatchResult(tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ matchId, input }: { matchId: string; input: ReportMatchResultInput }) =>
      tournamentService.reportMatchResult(matchId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'matches'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'bracket'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

// Game hooks
export function useGames(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId, 'games'],
    queryFn: () => tournamentService.getGames(matchId),
    enabled: !!matchId,
  })
}

export function useAddGame(matchId: string, tournamentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AddGameInput) => tournamentService.addGame(matchId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', matchId, 'games'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'matches'] })
    },
  })
}
