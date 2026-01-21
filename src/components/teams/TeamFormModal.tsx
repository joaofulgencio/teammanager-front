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
import { useCreateTeam, useUpdateTeam } from '@/hooks'
import type { Team, CreateTeamInput } from '@/domain'

interface TeamFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team | null
}

export function TeamFormModal({ open, onOpenChange, team }: TeamFormModalProps) {
  const [formData, setFormData] = useState<CreateTeamInput>({
    name: '',
    tag: '',
    country: '',
    logo_url: '',
  })

  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  const isEditing = !!team

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        tag: team.tag,
        country: team.country,
        logo_url: team.logo_url || '',
      })
    } else {
      setFormData({ name: '', tag: '', country: '', logo_url: '' })
    }
  }, [team, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && team) {
        await updateTeam.mutateAsync({ id: team.id, input: formData })
      } else {
        await createTeam.mutateAsync(formData)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save team:', error)
    }
  }

  const isPending = createTeam.isPending || updateTeam.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Team' : 'Create Team'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Team Liquid"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="TL"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="US"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL (optional)</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
