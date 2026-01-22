import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react'
import { UserManager, User, WebStorageStateStore } from 'oidc-client-ts'
import { setAuthTokenGetter } from '@/services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

const ZITADEL_AUTHORITY = import.meta.env.VITE_ZITADEL_AUTHORITY || 'http://localhost:8085'
const ZITADEL_CLIENT_ID = import.meta.env.VITE_ZITADEL_CLIENT_ID || ''
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

const userManager = new UserManager({
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${APP_URL}/callback`,
  post_logout_redirect_uri: APP_URL,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const userRef = useRef<User | null>(null)

  // Keep ref in sync for token getter
  useEffect(() => {
    userRef.current = user
  }, [user])

  // Register token getter with api service
  useEffect(() => {
    setAuthTokenGetter(() => userRef.current?.access_token || null)
  }, [])

  useEffect(() => {
    // Check if we're on the callback page
    if (window.location.pathname === '/callback') {
      userManager.signinRedirectCallback()
        .then((user) => {
          setUser(user)
          // Redirect to home or saved location
          const returnUrl = sessionStorage.getItem('auth_return_url') || '/'
          sessionStorage.removeItem('auth_return_url')
          window.history.replaceState({}, document.title, returnUrl)
        })
        .catch((error) => {
          console.error('Callback error:', error)
          window.history.replaceState({}, document.title, '/')
        })
        .finally(() => setIsLoading(false))
      return
    }

    // Try to get user from storage
    userManager.getUser()
      .then((user) => {
        if (user && !user.expired) {
          setUser(user)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))

    // Listen for user loaded/unloaded events
    const handleUserLoaded = (user: User) => setUser(user)
    const handleUserUnloaded = () => setUser(null)

    userManager.events.addUserLoaded(handleUserLoaded)
    userManager.events.addUserUnloaded(handleUserUnloaded)

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded)
      userManager.events.removeUserUnloaded(handleUserUnloaded)
    }
  }, [])

  const login = useCallback(async () => {
    // Save current URL to return after login
    sessionStorage.setItem('auth_return_url', window.location.pathname)
    await userManager.signinRedirect()
  }, [])

  const logout = useCallback(async () => {
    await userManager.signoutRedirect()
  }, [])

  const getAccessToken = useCallback(() => {
    return user?.access_token || null
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !user.expired,
    isLoading,
    login,
    logout,
    getAccessToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
