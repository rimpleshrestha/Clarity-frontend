import { Routes, Route } from "react-router";
import Login from "./login/page";
import HomePage from "./page";
import Signup from "./signup/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
