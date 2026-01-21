import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playerService } from '@/services'
import type { CreatePlayerInput } from '@/domain'

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: playerService.getAll,
  })
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => playerService.getById(id),
    enabled: !!id,
  })
}

export function usePlayersByTeam(teamId: string) {
  return useQuery({
    queryKey: ['players', 'team', teamId],
    queryFn: () => playerService.getByTeam(teamId),
    enabled: !!teamId,
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePlayerInput) => playerService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreatePlayerInput> }) =>
      playerService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useDeletePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => playerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useAddPlayerToTeam(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ playerId, role }: { playerId: string; role: string }) =>
      playerService.addToTeam(playerId, teamId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'team', teamId] })
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useRemovePlayerFromTeam(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (playerId: string) => playerService.removeFromTeam(playerId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'team', teamId] })
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}
