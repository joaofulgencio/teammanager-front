import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from '@/pages/Home'
import { TeamsPage } from '@/pages/Teams'
import { TeamDetails } from '@/pages/Teams/TeamDetails'
import { PlayersPage } from '@/pages/Players'
import { TournamentsPage } from '@/pages/Tournaments'
import { TournamentForm } from '@/pages/Tournaments/TournamentForm'
import { TournamentDetails } from '@/pages/Tournaments/TournamentDetails'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex gap-6">
          <Link to="/" className="font-semibold">TeamManager</Link>
          <Link to="/teams" className="text-muted-foreground hover:text-foreground">Teams</Link>
          <Link to="/players" className="text-muted-foreground hover:text-foreground">Players</Link>
          <Link to="/tournaments" className="text-muted-foreground hover:text-foreground">Tournaments</Link>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetails />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/new" element={<TournamentForm />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/tournaments/:id/edit" element={<TournamentForm />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
