import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import {
  GraduationCap,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Lock,
  AlertCircle,
  ArrowLeft,
  Mail
} from "lucide-react";
import { validateUNTEmail, getEmailValidationError } from "./AuthContext";
import { supabase } from "../utils/supabase/client";
import Header from "./Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate UNT email
    const emailError = getEmailValidationError(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess("If this email exists in our system, a password reset link has been sent to your UNT email.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-600">
      <Header currentPage="forgotpassword" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Sign In</span>
            </button>
          </div>

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
              Forgot Your Password?
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your UNT email and we'll send you a link to reset your password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold text-sm hover:from-green-700 hover:to-yellow-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "SENDING RESET LINK..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      SEND RESET LINK
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {success && (
            <div className="pt-4">
              <button
                onClick={() => navigate("/signin")}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold text-sm hover:from-green-700 hover:to-yellow-500 shadow-lg"
              >
                BACK TO SIGN IN
              </button>
            </div>
          )}

          {/* Security Info */}
          <div className="rounded-2xl p-6 space-y-3 bg-gradient-to-tr from-green-50 to-yellow-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Security Information
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <Ban className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Reset link expires in 15 minutes
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 text-sm">
                  Only works with registered UNT emails
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-xl bg-gradient-to-tr from-green-50 to-gray-50 p-4 flex gap-3">
            <Lock className="w-5 h-5 text-green-600 mt-1" />
            <p className="text-gray-700 text-sm">
              For security reasons, we don't reveal whether an email exists in our system.
              Check your UNT email inbox and spam folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
