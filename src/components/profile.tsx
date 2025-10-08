import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Star, UserCircle2, Lock, Bookmark, Calendar, BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Input } from "./ui/input";
import Header from "./Header";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render anything while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'Profile', label: 'Profile' },
    { id: 'Account Settings', label: 'Account Settings' },
    { id: 'Ratings', label: 'Ratings' },
    { id: 'Saved Professors', label: 'Saved Professors' }
  ];

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to change the password
    console.log('Password change submitted:', passwordForm);
    // Reset form after successful submission
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  function Stars({ value }: { value: number }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              className={`w-4 h-4 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium">First Name</span>
                <span className="text-gray-900">{user.firstName}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Last Name</span>
                <span className="text-gray-900">{user.lastName}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium">School</span>
                <span className="text-gray-900">University of North Texas</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Field of Study</span>
                <span className="text-gray-900">{user.major || ''}</span>
              </div>
              
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-700 font-medium">Expected Year of Graduation</span>
                <span className="text-gray-900">{user.graduation || ''}</span>
              </div>
            </div>
          </div>
        );
      
      case 'Account Settings':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Update your password to keep your account secure. Make sure to use a strong password with at least 8 characters.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      
      case 'Ratings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Professor Ratings</h3>
              <span className="text-sm text-gray-500">
                {user.ratedProfessors?.length || 0} ratings
              </span>
            </div>

            {user.ratedProfessors && user.ratedProfessors.length > 0 ? (
              <div className="space-y-4">
                {user.ratedProfessors.map((professor) => (
                  <div key={professor.id} className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                          <UserCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{professor.name}</h4>
                          <p className="text-sm text-gray-600">{professor.department}</p>
                          <p className="text-sm text-green-600 font-medium">{professor.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Stars value={professor.rating} />
                          <span className="font-semibold text-gray-900">{professor.rating}.0</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(professor.dateRated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="text-gray-700 text-sm leading-relaxed">"{professor.review}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Ratings Yet</h3>
                <p className="text-gray-500 mb-4">You haven't rated any professors yet.</p>
                <button 
                  onClick={() => navigate("/browse-professors")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Professors
                </button>
              </div>
            )}
          </div>
        );
      
      case 'Saved Professors':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Saved Professors</h3>
              <span className="text-sm text-gray-500">
                {user.savedProfessors?.length || 0} saved
              </span>
            </div>

            {user.savedProfessors && user.savedProfessors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {user.savedProfessors.map((professor) => (
                  <div key={professor.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                          <UserCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{professor.name}</h4>
                          <p className="text-sm text-gray-600">{professor.department}</p>
                        </div>
                      </div>
                      <Bookmark className="w-5 h-5 text-green-600 fill-green-600" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Stars value={professor.rating} />
                        <span className="text-sm font-medium">{professor.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({professor.reviews} reviews)</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Courses:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {professor.courses.map((course, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white text-green-700 rounded px-2 py-1 border border-green-200"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Saved on {new Date(professor.dateSaved).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Professors</h3>
                <p className="text-gray-500 mb-4">You haven't saved any professors yet.</p>
                <button 
                  onClick={() => navigate("/browse-professors")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Professors
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Header currentPage="profile" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Hey, {user.firstName}!
          </h1>
          <p className="text-green-100">
            Manage your profile, view your ratings, and access your saved professors.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation and Edit Button */}
        <div className="flex items-center justify-between mb-8">
          {/* Tab Navigation */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 relative font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Edit Button - Only show on Profile tab */}
          {activeTab === 'Profile' && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-sm">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 bg-gray-50 mt-16">
        © {new Date().getFullYear()} UNTRate — Built by Quadra Tech.
      </footer>
    </div>
  );
}