// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;