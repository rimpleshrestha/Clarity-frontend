import { Routes, Route } from "react-router";
import Login from "./login/page";
import HomePage from "./page";
import Signup from "./signup/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedLayout, { ProtectedRoute } from "./(authenticated)/layout";
import Dashboard from "./(authenticated)/dashboard/page";
import Test from "./Test";
import SavedJournal from "./(authenticated)/dashboard/saved-jounals/page";
import Error from "./error";
import SettingPage from "./(authenticated)/dashboard/setting/page";
import Journal from "./(authenticated)/dashboard/journals/page";
import PromptsPage from "./(authenticated)/dashboard/propts/page";
import JournalDetail from "./(authenticated)/dashboard/journals/JournalDetails";
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 60 * 1000, // 👈 milliseconds
        gcTime: 5 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Error />} path="*" />

          <Route index element={<Dashboard />} />
          <Route path="entries" element={<Journal />} />
          <Route path="journal/:id" element={<JournalDetail />} />
          <Route path="favorates" element={<SavedJournal />} />
          <Route path="settings" element={<SettingPage />} />
          <Route path="prompts" element={<PromptsPage />} />
        </Route>
        <Route element={<Error />} path="*" />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
