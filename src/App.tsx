import { Routes, Route, Navigate } from "react-router";
import Login from "./login/page";
import HomePage from "./page";
import Signup from "./signup/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedLayout, { ProtectedRoute } from "./(authenticated)/layout";
import Dashboard from "./(authenticated)/dashboard/page";
import SavedJournal from "./(authenticated)/dashboard/saved-jounals/page";
import Error from "./error";
import SettingPage from "./(authenticated)/dashboard/setting/page";
import Journal from "./(authenticated)/dashboard/journals/page";
import PromptsPage from "./(authenticated)/dashboard/propts/page";
import JournalDetail from "./(authenticated)/dashboard/journals/JournalDetails";
import ProfilePage from "./(authenticated)/dashboard/profile/page";
import ChangePasswordForm from "./(authenticated)/dashboard/change-password/page";
import CommunityPage from "./(authenticated)/dashboard/community/page";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 60 * 1000,
        gcTime: 5 * 60 * 60 * 1000,
      },
    },
  });

  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="entries" element={<Journal />} />
          <Route path="journal/:id" element={<JournalDetail />} />
          <Route path="favorites" element={<SavedJournal />} />
          <Route path="settings" element={<SettingPage />} />
          <Route path="prompts" element={<PromptsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordForm />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="*" element={<Error />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
