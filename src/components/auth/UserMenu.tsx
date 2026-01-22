import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'

export function UserMenu() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
    )
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={login} variant="outline" size="sm">
        Login
      </Button>
    )
  }

  const displayName = user?.profile?.name || user?.profile?.email || 'User'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {displayName}
      </span>
      <Button onClick={logout} variant="ghost" size="sm">
        Logout
      </Button>
    </div>
  )
}
