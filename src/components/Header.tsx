import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";
import { useAuth } from "./AuthContext";

interface HeaderProps {
  currentPage?: 'home' | 'browse-professors' | 'departments' | 'add-professor' | 'signin' | 'signup';
}

export default function Header({ currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinkClass = (page: string) => {
    if (currentPage === page) {
      return "text-green-700 font-medium";
    }
    return "text-gray-700 hover:text-green-600";
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <GraduationCap className="w-6 h-6 text-green-600" />
          <span className="text-xl">
            <span className="text-green-600 font-semibold">UNT</span>
            <span className="text-orange-400 font-semibold">Rate</span>
          </span>
          <span className="text-sm text-gray-500 ml-2">
            University of North Texas Professor Reviews
          </span>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-8">
          <nav className="hidden sm:flex items-center space-x-6">
            <button onClick={() => navigate("/")} className={getNavLinkClass('home')}>
              Home
            </button>
            <button onClick={() => navigate("/browse-professors")} className={getNavLinkClass('browse-professors')}>
              Browse Professors
            </button>
            <button onClick={() => navigate("/departments")} className={getNavLinkClass('departments')}>
              Departments
            </button>
            <button onClick={() => navigate("/add-professor")} className={getNavLinkClass('add-professor')}>
              Add Professor
            </button>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-600 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/signin")}
                  className={`px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 ${
                    currentPage === 'signin' ? 'bg-green-600 text-white' : ''
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className={`px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 ${
                    currentPage === 'signup' ? 'bg-green-700' : ''
                  }`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}