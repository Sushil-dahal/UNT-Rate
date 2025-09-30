import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  GraduationCap,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Users,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useAuth, validateUNTEmail, getEmailValidationError } from "./AuthContext";
import Header from "./Header";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    graduation: "",
    major: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setLoading(false);
      return;
    }

    // Validate UNT email
    const emailError = getEmailValidationError(formData.email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agree) {
      setError("You must agree to the terms of service");
      setLoading(false);
      return;
    }

    // Simulate signup process
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        studentId: formData.studentId,
        graduation: formData.graduation,
        major: formData.major,
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      login(userData);
      navigate("/");
    } catch (err) {
      setError("Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-600">
      <Header currentPage="signup" />

      {/* Main Signup Card */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center">
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
            <h1 className="text-2xl text-green-700 font-semibold mb-2">
              Student Sign Up
            </h1>
            <p className="text-gray-500 text-sm">
              Join the UNT community and share your professor
              experiences
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
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                  First Name *
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                  Last Name *
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                UNT Student Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@my.unt.edu"
                className={`w-full h-11 px-4 rounded-lg border bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm ${
                  error && !validateUNTEmail(formData.email) ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
                }`}
                disabled={loading}
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Student ID
              </label>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="11000000"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Expected Graduation
              </label>
              <select
                name="graduation"
                value={formData.graduation}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              >
                <option>Select Year</option>
                {Array.from(
                  { length: 11 },
                  (_, i) => 2024 + i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Major */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Major
              </label>
              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              >
                <option>Select Your Major</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Business Administration</option>
                <option>Accounting</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Engineering</option>
                <option>Biology</option>
                <option>Chemistry</option>
                <option>Psychology</option>
                <option>Political Science</option>
                <option>Education</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Password *
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              />
              <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-xs text-gray-700 space-y-1">
                <p className="font-semibold">
                  Password Requirements:
                </p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                Confirm Password *
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-green-600 focus:ring-green-600 text-sm"
                disabled={loading}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="agree"
                checked={formData.agree}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agree: !!checked })
                }
                className="mt-1"
                disabled={loading}
              />
              <label
                htmlFor="agree"
                className="text-xs text-gray-600 leading-snug"
              >
                I agree to the Terms of Service and Privacy
                Policy. I understand that only UNT students can
                create accounts, and my reviews will be
                anonymous to others while email is stored for
                verification only.
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold text-sm hover:from-green-700 hover:to-yellow-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Login Link */}
          <div className="rounded-xl p-4 text-center border">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-green-600 font-semibold hover:underline"
                disabled={loading}
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Why UNT Section */}
          <div className="rounded-2xl p-6 space-y-4 bg-gradient-to-tr from-green-50 to-yellow-50">
            <div className="flex items-center justify-center gap-2 mb-4">
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
                  Keeps reviews trustworthy and authentic
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <Users className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Build a genuine UNT community
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-xl bg-gradient-to-tr from-green-50 to-gray-50 p-4 flex gap-3 items-start">
            <Lock className="w-5 h-5 text-green-600 mt-1" />
            <p className="text-gray-700 text-sm">
              Your privacy is protected. We only store UNT email
              for verification. Reviews are anonymous to others.
              Your personal information is never shared with
              third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}