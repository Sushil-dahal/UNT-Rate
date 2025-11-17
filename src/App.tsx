import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/home";
import Signin from "./components/signin";
import Signup from "./components/signup";
import ForgotPassword from "./components/forgotpassword";
import AddProfessor from "./components/addprofessor";
import BrowseProfessors from "./components/browseprofessors";
import ProfessorProfile from "./components/professorprofile";
import RateProfessor from "./components/rateprofessor";
import Departments from "./components/departments";
import Profile from "./components/profile";
import StudentForum from "./components/studentforum";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/add-professor" 
            element={
              <ProtectedRoute>
                <AddProfessor />
              </ProtectedRoute>
            } 
          />
          <Route path="/browse-professors" element={<BrowseProfessors />} />
          <Route path="/professor/:professorId" element={<ProfessorProfile />} />
          <Route 
            path="/rate-professor/:professorId" 
            element={
              <ProtectedRoute>
                <RateProfessor />
              </ProtectedRoute>
            } 
          />
          <Route path="/departments" element={<Departments />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <StudentForum />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all route to redirect any unmatched paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
