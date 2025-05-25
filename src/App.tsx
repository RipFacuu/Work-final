import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LeagueProvider } from './contexts/LeagueContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TeamsPage from './pages/admin/TeamsPage';
import FixturesPage from './pages/admin/FixturesPage';
import ResultsPage from './pages/admin/ResultsPage';
import StandingsPage from './pages/admin/StandingsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ZonesPage from './pages/admin/ZonesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LeagueProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="league/:leagueId" element={<LeaguePage />} />
              <Route path="admin/login" element={<AdminLogin />} />
              
              <Route path="admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }>
                <Route path="teams" element={<TeamsPage />} />
                <Route path="fixtures" element={<FixturesPage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="standings" element={<StandingsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="zones" element={<ZonesPage />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </LeagueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;