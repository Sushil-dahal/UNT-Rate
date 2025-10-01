import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Home from "./components/home";
import Signin from "./components/signin";
import Signup from "./components/signup";
import AddProfessor from "./components/addprofessor";
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
          <Route path="/add-professor" element={<AddProfessor />} />
          <Route path="/browse-professors" element={<BrowseProfessors />} />
          <Route path="/departments" element={<Departments />} />
          {/* Catch-all route to redirect any unmatched paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}