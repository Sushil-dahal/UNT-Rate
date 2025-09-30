import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Home from "./components/home";
import Signin from "./components/signin";
import Signup from "./components/signup";
import BrowseProfessors from "./components/browseprofessors";
import Departments from "./components/departments";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse-professors" element={<BrowseProfessors />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}