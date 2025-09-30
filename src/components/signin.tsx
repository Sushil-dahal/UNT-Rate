import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  GraduationCap,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useAuth, validateUNTEmail, getEmailValidationError } from "./AuthContext";
import Header from "./Header";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate UNT email
    const emailError = getEmailValidationError(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    // Simulate login process (in real app, this would call an API)
    try {
      // For demonstration, we'll create a mock user from the email
      // In a real app, this would validate credentials with a backend
      const emailParts = email.split('@')[0];
      const nameParts = emailParts.split('.');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Student';
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'User';

      const userData = {
        firstName,
        lastName,
        email,
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      login(userData);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-600">
      <Header currentPage="signin" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-green-600" />
            <span className="text-2xl ml-2">
              <span className="text-green-600 font-semibold">
                UNT
              </span>
              <span className="text-orange-400 font-semibold">
                Rate
              </span>
            </span>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl text-green-600 font-semibold mb-2">
              Student Login
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in with your UNT student email
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase">
                UNT STUDENT EMAIL
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="yourname@my.unt.edu"
                className={`w-full h-11 px-4 rounded-lg border bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm ${
                  error && !validateUNTEmail(email) ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
                }`}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase">
                PASSWORD
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your password"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={loading}
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-gray-600"
                >
                  REMEMBER ME
                </label>
              </div>
              <button
                type="button"
                className="text-xs text-green-600 hover:text-green-700"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold text-sm hover:from-green-700 hover:to-yellow-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </div>
          </form>

          {/* Create Account */}
          <div className="rounded-xl p-4 text-center border">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-green-600 font-semibold hover:underline"
                disabled={loading}
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Why UNT */}
          <div className="rounded-2xl p-6 space-y-3 bg-gradient-to-tr from-green-50 to-yellow-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Why UNT Students Only?
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Verify UNT students
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <Ban className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Prevent fake ratings
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Keep reviews authentic
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-xl bg-gradient-to-tr from-green-50 to-gray-50 p-4 flex gap-3">
            <Lock className="w-5 h-5 text-green-600 mt-1" />
            <p className="text-gray-700 text-sm">
              Your privacy is protected. We only store UNT email
              for verification. Reviews are anonymous to others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}