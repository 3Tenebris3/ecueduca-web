import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth';

import DashboardLayout from '../pages/dashboard/DashboardLayout';
import HomeDashboard   from '../pages/dashboard/HomeDashboard';
import LoginPage       from '../pages/auth/Login';
import type { JSX } from 'react';
import UsersTable from '../pages/users/UsersTable';
import ClassesTable from '../pages/classes/ClassesTable';
import QuizzesTable from '../pages/quizzes/QuizzesTable';
import ScenariosGrid from '../pages/scenarios/ScenariosGrid';
import MinigamesHub from '../pages/minigames/MinigamesHub';
import TriviaTable from '../pages/trivia/TriviaTable';
import ReportsPage from '../pages/report/ReportsPage';
import MemorySetsPage from '../pages/memory/MemorySetsPage';
import RewardsTable from '../pages/rewards/RewardsTable';

/* ---------- Guard ---------- */
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { state } = useAuth();
  return state.token ? children : <Navigate to="/login" replace />;
};

/* ---------- Router ---------- */
export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Área segura */}
      <Route
        path="/dashboard/*"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index   element={<Navigate to="home" replace />} />
        <Route path="users" element={<UsersTable />} />
        <Route path="home"   element={<HomeDashboard />} />
        <Route path="classes" element={<ClassesTable />} />
        <Route path="quizzes" element={<QuizzesTable />} />
        <Route path="scenarios" element={<ScenariosGrid />} />
        <Route path="minigames" element={<MinigamesHub />} />
        <Route path="minigames/trivia" element={<TriviaTable />} />
        <Route path="minigames/memory" element={<MemorySetsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="rewards" element={<RewardsTable />} />

      </Route>

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);
