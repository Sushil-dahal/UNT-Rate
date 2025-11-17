import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  UserCircle2,
  MapPin,
  Mail,
  BookOpen,
  ArrowLeft,
  Plus,
  MessageSquare,
  ChevronRight,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { fetchProfessors, fetchProfessorRatings } from "../utils/api";
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

type Rating = {
  id: string;
  course_code: string;
  is_online: boolean;
  rating: number;
  difficulty: number;
  would_take_again: boolean;
  for_credit?: boolean;
  used_textbooks?: boolean;
  attendance_mandatory?: boolean;
  grade?: string;
  tags: string[];
  review: string;
  created_at: string;
  user_id: string;
};

type RatingStats = {
  totalRatings: number;
  avgRating: number;
  avgDifficulty: number;
  topTags: Array<{ tag: string; count: number }>;
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
            className={`w-5 h-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        );
      })}
    </div>
  );
}

export default function ProfessorProfile() {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, refreshSavedProfessors } = useAuth();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [savingProfessor, setSavingProfessor] = useState(false);

  useEffect(() => {
    console.log('🔄 ProfessorProfile useEffect triggered, professorId:', professorId);
    if (professorId) {
      console.log('✅ ProfessorId exists, loading data...');
      loadProfessor();
      loadRatings();
    } else {
      console.log('❌ No professorId provided');
    }
  }, [professorId]);

  // Check for success message from rating submission
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      // Show success message (you could use a toast library here)
      console.log(state.message);
    }
  }, [location]);

  const loadProfessor = async () => {
    if (!professorId) {
      setError("Professor ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log('Loading professor with ID:', professorId);
      
      const professors = await fetchProfessors();
      console.log('All professors:', professors);
      
      const foundProfessor = professors.find(p => p.id === professorId);
      console.log('Found professor:', foundProfessor);
      
      if (foundProfessor) {
        setProfessor(foundProfessor);
      } else {
        setError("Professor not found");
      }
    } catch (err) {
      console.error('❌ Error fetching professor:', err);
      setError(err instanceof Error ? err.message : 'Failed to load professor');
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    if (!professorId) {
      setRatingsLoading(false);
      return;
    }

    try {
      setRatingsLoading(true);
      console.log('Loading ratings for professor:', professorId);
      
      const result = await fetchProfessorRatings(professorId);
      console.log('Ratings result:', result);
      
      if (result && typeof result === 'object') {
        setRatings(Array.isArray(result.ratings) ? result.ratings : []);
        setRatingStats(result.stats || {
          totalRatings: 0,
          avgRating: 0,
          avgDifficulty: 0,
          topTags: []
        });
      } else {
        setRatings([]);
        setRatingStats({
          totalRatings: 0,
          avgRating: 0,
          avgDifficulty: 0,
          topTags: []
        });
      }
    } catch (err) {
      console.error('❌ Error fetching ratings:', err);
      // Set empty arrays instead of failing
      setRatings([]);
      setRatingStats({
        totalRatings: 0,
        avgRating: 0,
        avgDifficulty: 0,
        topTags: []
      });
    } finally {
      setRatingsLoading(false);
    }
  };

  // Check if professor is saved on component mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated && user?.accessToken && professorId) {
      checkIfProfessorIsSaved();
    }
  }, [isAuthenticated, user?.accessToken, professorId]);

  const checkIfProfessorIsSaved = async () => {
    if (!isAuthenticated || !user?.accessToken || !professorId) {
      setIsSaved(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${await import("../utils/supabase/info").then(m => m.projectId)}.supabase.co/functions/v1/make-server-f3396eba/professors/${professorId}/saved`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
      }
    } catch (error) {
      console.error("Error checking if professor is saved:", error);
    }
  };

  const toggleSaveProfessor = async () => {
    if (!isAuthenticated || !user?.accessToken || !professorId) {
      return;
    }

    setSavingProfessor(true);
    try {
      const projectId = (await import("../utils/supabase/info")).projectId;
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f3396eba/professors/${professorId}/save`,
        {
          method,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
        // Refresh saved professors in AuthContext
        if (refreshSavedProfessors) {
          await refreshSavedProfessors();
        }
      } else {
        const error = await response.json();
        console.error("Failed to toggle save professor:", error);
      }
    } catch (error) {
      console.error("Error toggling save professor:", error);
    } finally {
      setSavingProfessor(false);
    }
  };

  if (loading || !professorId) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="professor-profile" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading professor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="professor-profile" />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <UserCircle2 className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Professor Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The professor you're looking for doesn't exist."}</p>
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

  const courses = professor.courses ? professor.courses.split(',').map(c => c.trim()).filter(c => c) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="professor-profile" />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate('/browse-professors')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Professors
        </button>
      </div>

      {/* Professor Header */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-32 h-32 rounded-full bg-green-700 flex items-center justify-center">
                <UserCircle2 className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Professor Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {professor.title} {professor.first_name} {professor.last_name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{professor.department}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Stars value={ratingStats?.avgRating || 0} />
                  <span className="text-lg font-semibold">
                    {ratingStats?.avgRating ? ratingStats.avgRating.toFixed(1) : 'No ratings yet'}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({ratingStats?.totalRatings || 0} review{(ratingStats?.totalRatings || 0) !== 1 ? 's' : ''})
                </span>
                {ratingStats?.avgDifficulty && ratingStats.avgDifficulty > 0 && (
                  <span className="text-sm text-gray-600">
                    • Difficulty: {ratingStats.avgDifficulty.toFixed(1)}/5
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                {professor.office_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{professor.office_location}</span>
                  </div>
                )}
                {professor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{professor.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="shrink-0 flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/rate-professor/${professor.id}`)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold rounded-lg hover:from-green-700 hover:to-yellow-500 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Rate Professor
                </button>
                <button
                  onClick={toggleSaveProfessor}
                  disabled={savingProfessor}
                  className={`px-6 py-3 border-2 font-semibold rounded-lg flex items-center gap-2 transition-colors ${
                    isSaved 
                      ? 'border-green-600 bg-green-50 text-green-700 hover:bg-green-100' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-600 hover:text-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {savingProfessor ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  {isSaved ? 'Saved' : 'Save Professor'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {professor.bio && (
              <section className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{professor.bio}</p>
              </section>
            )}

            {/* Courses */}
            {courses.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {courses.map((course, i) => (
                    <div
                      key={i}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <span className="font-medium text-blue-900">{course}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Student Reviews ({ratings.length})
                </h2>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate(`/rate-professor/${professor.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Write Review
                  </button>
                )}
              </div>
              
              {ratingsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : ratings.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-4">
                    Be the first to review {professor.title} {professor.last_name}!
                  </p>
                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate(`/rate-professor/${professor.id}`)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Write the First Review
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      <button
                        onClick={() => navigate('/signin')}
                        className="text-green-600 hover:underline"
                      >
                        Sign in
                      </button>
                      {' '}to write a review
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {Array.isArray(ratings) && ratings.map((rating) => (
                    <div key={rating.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Stars value={rating.rating} />
                            <span className="font-semibold">{rating.rating}/5</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Difficulty: {rating.difficulty}/5
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {rating.course_code}
                          </span>
                          {rating.is_online && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Online
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded ${
                            rating.would_take_again 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rating.would_take_again ? 'Would take again' : 'Would not take again'}
                          </span>
                          {rating.grade && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              Grade: {rating.grade}
                            </span>
                          )}
                        </div>
                      </div>

                      {rating.tags && Array.isArray(rating.tags) && rating.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {rating.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        By Anonymous Student • {rating.course_code}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Rating</span>
                  <span className="font-medium">
                    {ratingStats?.avgRating ? `${ratingStats.avgRating.toFixed(1)}/5` : 'No ratings'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600"># of Reviews</span>
                  <span className="font-medium">{ratingStats?.totalRatings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Difficulty</span>
                  <span className="font-medium">
                    {ratingStats?.avgDifficulty ? `${ratingStats.avgDifficulty.toFixed(1)}/5` : 'No data'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium text-sm">{professor.department}</span>
                </div>
              </div>

              {/* Top Tags */}
              {ratingStats?.topTags && Array.isArray(ratingStats.topTags) && ratingStats.topTags.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Top Tags</h4>
                  <div className="space-y-2">
                    {ratingStats.topTags.map(({ tag, count }) => (
                      <div key={tag} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{tag}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl border border-green-200 p-6">
                <h3 className="font-semibold text-green-900 mb-2">Want to rate this professor?</h3>
                <p className="text-green-700 text-sm mb-4">
                  Sign in with your UNT email to share your experience with fellow students.
                </p>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  Sign In to Rate
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
