import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/common/Dialog'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { useCreatePlayer, useUpdatePlayer } from '@/hooks'
import type { Player, CreatePlayerInput } from '@/domain'

interface PlayerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  player?: Player | null
}

export function PlayerFormModal({ open, onOpenChange, player }: PlayerFormModalProps) {
  const [formData, setFormData] = useState<CreatePlayerInput>({
    name: '',
    nickname: '',
    country: '',
    steam_id_64: '',
    discord_id: '',
  })

  const createPlayer = useCreatePlayer()
  const updatePlayer = useUpdatePlayer()
  const isEditing = !!player

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        nickname: player.nickname,
        country: player.country,
        steam_id_64: player.steam_id_64 || '',
        discord_id: player.discord_id || '',
      })
    } else {
      setFormData({ name: '', nickname: '', country: '', steam_id_64: '', discord_id: '' })
    }
  }, [player, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && player) {
        await updatePlayer.mutateAsync({ id: player.id, input: formData })
      } else {
        await createPlayer.mutateAsync(formData)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save player:', error)
    }
  }

  const isPending = createPlayer.isPending || updatePlayer.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Player' : 'Add Player'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Johan Sundstein"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="N0tail"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="DK"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="steam_id_64">Steam ID 64 (optional)</Label>
            <Input
              id="steam_id_64"
              value={formData.steam_id_64}
              onChange={(e) => setFormData({ ...formData, steam_id_64: e.target.value })}
              placeholder="76561198..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord_id">Discord ID (optional)</Label>
            <Input
              id="discord_id"
              value={formData.discord_id}
              onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
              placeholder="123456789..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
