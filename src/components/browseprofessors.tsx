import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import {
  Search,
  Star,
  UserCircle2,
  Filter,
  ChevronDown,
} from "lucide-react";
import Header from "./Header";

type Professor = {
  id: number;
  name: string;
  title: string;
  department: string;
  rating: number;
  reviews: number;
  tags: string[];
  courses: string[];
  office?: string;
};

const allProfessors: Professor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Dr.",
    department: "Computer Science & Engineering",
    rating: 4.8,
    reviews: 42,
    tags: ["Clear Communication", "Engaging Lectures", "Fair Exams"],
    courses: ["CSCE 1030", "CSCE 2100", "CSCE 3110"],
    office: "NCHM 3.220"
  },
  {
    id: 2,
    name: "Dr. Lisa Thompson",
    title: "Dr.",
    department: "Education",
    rating: 4.7,
    reviews: 51,
    tags: ["Caring", "Extra Credit", "Organized"],
    courses: ["EDUC 2010", "EDUC 3500"],
    office: "MAT 205"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Dr.",
    department: "Engineering",
    rating: 4.6,
    reviews: 38,
    tags: ["Tough Grader", "Fair Exams", "Helpful Office Hours"],
    courses: ["ENGR 1010", "ENGR 2050"],
    office: "DISC 315"
  },
  {
    id: 4,
    name: "Prof. Michael Chen",
    title: "Prof.",
    department: "Business",
    rating: 4.2,
    reviews: 67,
    tags: ["Good Grader", "Organized", "Caring"],
    courses: ["BUSI 2010", "BUSI 3200"],
    office: "BLB 330"
  },
  {
    id: 5,
    name: "Prof. David Wilson",
    title: "Prof.",
    department: "Arts & Sciences",
    rating: 3.9,
    reviews: 29,
    tags: ["Attendance Matters", "Lots Of Assignments"],
    courses: ["HIST 1010", "HIST 2030"],
    office: "WH 108"
  },
  {
    id: 6,
    name: "Dr. Maria Garcia",
    title: "Dr.",
    department: "Computer Science & Engineering",
    rating: 4.5,
    reviews: 33,
    tags: ["Helpful", "Clear Instructions", "Fair Grader"],
    courses: ["CSCE 2610", "CSCE 3600"],
    office: "NCHM 4.120"
  },
  {
    id: 7,
    name: "Prof. James Anderson",
    title: "Prof.",
    department: "Business",
    rating: 4.0,
    reviews: 45,
    tags: ["Practical Examples", "Good Feedback", "Accessible"],
    courses: ["BUSI 1010", "BUSI 2500"],
    office: "BLB 220"
  },
  {
    id: 8,
    name: "Dr. Jennifer Kim",
    title: "Dr.",
    department: "Engineering",
    rating: 4.3,
    reviews: 28,
    tags: ["Challenging", "Fair", "Well Prepared"],
    courses: ["ENGR 3010", "ENGR 4500"],
    office: "DISC 210"
  }
];

const departments = [
  "All Departments",
  "Computer Science & Engineering", 
  "Engineering",
  "Business", 
  "Education",
  "Arts & Sciences"
];

const ratings = [
  "All Ratings",
  "4.5+ stars",
  "4.0+ stars", 
  "3.5+ stars",
  "3.0+ stars"
];

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

export default function BrowseProfessors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProfessors = allProfessors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === "All Departments" || 
                             prof.department === selectedDepartment;
    
    const matchesRating = selectedRating === "All Ratings" ||
                         (selectedRating === "4.5+ stars" && prof.rating >= 4.5) ||
                         (selectedRating === "4.0+ stars" && prof.rating >= 4.0) ||
                         (selectedRating === "3.5+ stars" && prof.rating >= 3.5) ||
                         (selectedRating === "3.0+ stars" && prof.rating >= 3.0);
    
    return matchesSearch && matchesDepartment && matchesRating;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="browse-professors" />

      {/* Page Header */}
      <section className="bg-green-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Browse UNT Professors
            </h1>
            <p className="text-white/90 text-lg">
              Find detailed reviews and ratings for professors across all departments at UNT
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white rounded-lg">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by professor name, department, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus:border-0 bg-transparent flex-1"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-green-600 hover:bg-green-800 rounded-lg flex items-center gap-2 justify-center"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <select 
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/30 bg-white/20 text-white"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept} className="text-gray-800">{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                    <select 
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/30 bg-white/20 text-white"
                    >
                      {ratings.map(rating => (
                        <option key={rating} value={rating} className="text-gray-800">{rating}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              {filteredProfessors.length} Professor{filteredProfessors.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredProfessors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No professors found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All Departments");
                  setSelectedRating("All Ratings");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessors.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center">
                        <UserCircle2 className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{prof.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{prof.department}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Stars value={prof.rating} />
                        <span className="text-sm font-medium">{prof.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">
                          ({prof.reviews} reviews)
                        </span>
                      </div>

                      {prof.office && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Office:</span> {prof.office}
                        </p>
                      )}

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Courses:</p>
                        <div className="flex flex-wrap gap-1">
                          {prof.courses.slice(0, 3).map((course, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1"
                            >
                              {course}
                            </span>
                          ))}
                          {prof.courses.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{prof.courses.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {prof.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                        {prof.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{prof.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500">
        © {new Date().getFullYear()} UNTRate — Built by Quadra Tech.
      </footer>
    </div>
  );
}