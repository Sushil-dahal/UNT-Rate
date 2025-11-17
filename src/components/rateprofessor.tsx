import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Star,
  UserCircle2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { fetchProfessors, submitProfessorRating } from "../utils/api";
import { useAuth } from "./AuthContext";
import Header from "./Header";

type Professor = {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  department: string;
  email?: string;
  office_location?: string;
  courses?: string;
  bio?: string;
  created_at: string;
};

const courseCodes = [
  "CSCE 1030", "CSCE 1040", "CSCE 2100", "CSCE 2110", "CSCE 2600", "CSCE 3110", "CSCE 3600",
  "MATH 1650", "MATH 1710", "MATH 2700", "MATH 3680", "MATH 4100",
  "PHYS 1710", "PHYS 1730", "PHYS 2220", "PHYS 2240",
  "ENGL 1310", "ENGL 1320", "ENGL 2050", "ENGL 2210",
  "HIST 2610", "HIST 2620", "HIST 3200", "HIST 4100",
  "PSYC 1430", "PSYC 2100", "PSYC 3200", "PSYC 4050",
  "BIOL 1710", "BIOL 1720", "BIOL 2040", "BIOL 3200",
  "CHEM 1410", "CHEM 1420", "CHEM 2410", "CHEM 3560",
  "ECON 1100", "ECON 1110", "ECON 3200", "ECON 4200",
  "MGMT 3200", "MGMT 3500", "MGMT 4200", "MGMT 4800",
  "MARK 3200", "MARK 3500", "MARK 4200", "MARK 4500"
];

const grades = [
  "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", 
  "Pass", "No Pass", "Incomplete", "Withdraw", "Audit", "Rather not say"
];

const availableTags = [
  "Tough Grader", "Get Ready To Read", "Participation Matters", "Extra Credit",
  "Group Projects", "Amazing Lectures", "Clear Grading Criteria", "Gives Good Feedback",
  "Inspirational", "Lots Of Homework", "Hilarious", "Beware Of Pop Quizzes",
  "So Many Papers", "Caring", "Respected", "Lecture Heavy", "Test Heavy",
  "Graded By Few Things", "Accessible Outside Class", "Online Savvy"
];

function StarRating({ value, onChange, disabled = false }: { 
  value: number; 
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => !disabled && onChange(i + 1)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          disabled={disabled}
        >
          <Star
            className={`w-6 h-6 ${
              i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function RateProfessor() {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    courseCode: "",
    isOnlineCourse: false,
    overallRating: 0,
    difficulty: 0,
    wouldTakeAgain: "",
    takenForCredit: "",
    usedTextbooks: "",
    attendanceMandatory: "",
    gradeReceived: "",
    selectedTags: [] as string[],
    review: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    loadProfessor();
  }, [professorId, isAuthenticated]);

  const loadProfessor = async () => {
    if (!professorId) {
      setError("Professor ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const professors = await fetchProfessors();
      const foundProfessor = professors.find(p => p.id === professorId);
      
      if (foundProfessor) {
        setProfessor(foundProfessor);
      } else {
        setError("Professor not found");
      }
    } catch (err) {
      console.error('Error fetching professor:', err);
      setError(err instanceof Error ? err.message : 'Failed to load professor');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : prev.selectedTags.length < 3
        ? [...prev.selectedTags, tag]
        : prev.selectedTags // Don't add if already at max
    }));
  };

  const validateForm = () => {
    if (!formData.courseCode) return "Please select a course code";
    if (formData.overallRating === 0) return "Please rate your professor";
    if (formData.difficulty === 0) return "Please rate the difficulty";
    if (!formData.wouldTakeAgain) return "Please indicate if you would take this professor again";
    if (!formData.review.trim()) return "Please write a review";
    if (formData.review.length > 350) return "Review must be 350 characters or less";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user?.accessToken) {
      setError("You must be logged in to submit a rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const ratingData = {
        courseCode: formData.courseCode,
        isOnlineCourse: formData.isOnlineCourse,
        overallRating: formData.overallRating,
        difficulty: formData.difficulty,
        wouldTakeAgain: formData.wouldTakeAgain,
        takenForCredit: formData.takenForCredit,
        usedTextbooks: formData.usedTextbooks,
        attendanceMandatory: formData.attendanceMandatory,
        gradeReceived: formData.gradeReceived,
        selectedTags: formData.selectedTags,
        review: formData.review
      };

      console.log('Submitting rating:', ratingData);
      
      await submitProfessorRating(professorId!, ratingData, user.accessToken);
      
      // Navigate back to professor profile with success message
      navigate(`/professor/${professorId}`, { 
        state: { message: "Rating submitted successfully!" }
      });
    } catch (err) {
      console.error('Error submitting rating:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit rating. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="rate-professor" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading professor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !professor) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="rate-professor" />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <UserCircle2 className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Professor Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/browse-professors')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse Professors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="rate-professor" />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(`/professor/${professorId}`)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Professor Profile
        </button>
      </div>

      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center">
              <UserCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rate {professor?.title} {professor?.first_name} {professor?.last_name}
              </h1>
              <p className="text-gray-600">{professor?.department}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course Code *
            </label>
            <select
              value={formData.courseCode}
              onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select Course Code</option>
              {courseCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                id="online-course"
                checked={formData.isOnlineCourse}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isOnlineCourse: !!checked }))
                }
              />
              <label htmlFor="online-course" className="text-sm text-gray-600">
                This is an online course
              </label>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate your professor *
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={formData.overallRating}
                onChange={(value) => setFormData(prev => ({ ...prev, overallRating: value }))}
              />
              <div className="text-sm text-gray-600">
                {formData.overallRating === 0 && "Select rating"}
                {formData.overallRating === 1 && "Awful"}
                {formData.overallRating === 2 && "Poor"}
                {formData.overallRating === 3 && "Okay"}
                {formData.overallRating === 4 && "Good"}
                {formData.overallRating === 5 && "Awesome"}
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How difficult was this professor? *
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={formData.difficulty}
                onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              />
              <div className="text-sm text-gray-600">
                {formData.difficulty === 0 && "Select difficulty"}
                {formData.difficulty === 1 && "Very Easy"}
                {formData.difficulty === 2 && "Easy"}
                {formData.difficulty === 3 && "Average"}
                {formData.difficulty === 4 && "Difficult"}
                {formData.difficulty === 5 && "Very Difficult"}
              </div>
            </div>
          </div>

          {/* Would Take Again */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Would you take this professor again? *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wouldTakeAgain"
                  value="yes"
                  checked={formData.wouldTakeAgain === "yes"}
                  onChange={(e) => setFormData(prev => ({ ...prev, wouldTakeAgain: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wouldTakeAgain"
                  value="no"
                  checked={formData.wouldTakeAgain === "no"}
                  onChange={(e) => setFormData(prev => ({ ...prev, wouldTakeAgain: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* For Credit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Was this class taken for credit?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="takenForCredit"
                  value="yes"
                  checked={formData.takenForCredit === "yes"}
                  onChange={(e) => setFormData(prev => ({ ...prev, takenForCredit: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="takenForCredit"
                  value="no"
                  checked={formData.takenForCredit === "no"}
                  onChange={(e) => setFormData(prev => ({ ...prev, takenForCredit: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Textbooks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did this professor use textbooks?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="usedTextbooks"
                  value="yes"
                  checked={formData.usedTextbooks === "yes"}
                  onChange={(e) => setFormData(prev => ({ ...prev, usedTextbooks: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="usedTextbooks"
                  value="no"
                  checked={formData.usedTextbooks === "no"}
                  onChange={(e) => setFormData(prev => ({ ...prev, usedTextbooks: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Was attendance mandatory?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendanceMandatory"
                  value="yes"
                  checked={formData.attendanceMandatory === "yes"}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendanceMandatory: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendanceMandatory"
                  value="no"
                  checked={formData.attendanceMandatory === "no"}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendanceMandatory: e.target.value }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Grade Received */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select grade received
            </label>
            <select
              value={formData.gradeReceived}
              onChange={(e) => setFormData(prev => ({ ...prev, gradeReceived: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select up to 3 tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTags.map(tag => (
                <label key={tag} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={formData.selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                    disabled={!formData.selectedTags.includes(tag) && formData.selectedTags.length >= 3}
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.selectedTags.length}/3
            </p>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Write a Review *
            </label>
            <Textarea
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Discuss the professor's professional abilities including teaching style and ability to convey the material clearly."
              className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              maxLength={350}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">{formData.review.length}/350</p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Review Guidelines:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your rating could be removed if you use profanity or derogatory terms</li>
                  <li>• Don't claim that the professor shows bias or favoritism</li>
                  <li>• Don't forget to proofread!</li>
                </ul>
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-xs mt-2"
                  onClick={() => window.open('/guidelines', '_blank')}
                >
                  View all guidelines
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold hover:from-green-700 hover:to-yellow-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                "SUBMITTING RATING..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  SUBMIT RATING
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
