import { Routes, Route } from "react-router";
import Login from "./login/page";

import Signup from "./signup/page";
import HomePage from "./page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
