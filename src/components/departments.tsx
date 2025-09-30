import { useNavigate } from "react-router-dom";
import {
  Users,
  Star,
  BookOpen,
  Building2,
  Calculator,
  Briefcase,
  GraduationCapIcon,
  Palette,
  ArrowRight,
} from "lucide-react";
import Header from "./Header";

type Department = {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  professorCount: number;
  averageRating: number;
  totalReviews: number;
  popularCourses: string[];
  color: string;
};

const departments: Department[] = [
  {
    id: 1,
    name: "Computer Science & Engineering",
    icon: <Building2 className="w-8 h-8" />,
    description: "Cutting-edge technology education with hands-on programming, software engineering, and computer systems courses.",
    professorCount: 45,
    averageRating: 4.3,
    totalReviews: 892,
    popularCourses: ["CSCE 1030", "CSCE 2100", "CSCE 3110", "CSCE 3600"],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Engineering",
    icon: <Calculator className="w-8 h-8" />,
    description: "Comprehensive engineering programs covering mechanical, electrical, materials, and biomedical engineering disciplines.",
    professorCount: 38,
    averageRating: 4.1,
    totalReviews: 654,
    popularCourses: ["ENGR 1010", "ENGR 2050", "ENGR 3010", "ENGR 4500"],
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 3,
    name: "Business",
    icon: <Briefcase className="w-8 h-8" />,
    description: "Dynamic business education including accounting, finance, marketing, management, and entrepreneurship programs.",
    professorCount: 52,
    averageRating: 4.0,
    totalReviews: 1143,
    popularCourses: ["BUSI 1010", "BUSI 2010", "BUSI 3200", "BUSI 2500"],
    color: "from-green-500 to-green-600"
  },
  {
    id: 4,
    name: "Education",
    icon: <GraduationCapIcon className="w-8 h-8" />,
    description: "Preparing future educators with innovative teaching methods, curriculum development, and educational psychology.",
    professorCount: 34,
    averageRating: 4.4,
    totalReviews: 567,
    popularCourses: ["EDUC 2010", "EDUC 3500", "EDUC 4200", "EDUC 3100"],
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 5,
    name: "Arts & Sciences",
    icon: <Palette className="w-8 h-8" />,
    description: "Diverse liberal arts education spanning history, literature, psychology, biology, chemistry, and fine arts.",
    professorCount: 67,
    averageRating: 4.2,
    totalReviews: 1456,
    popularCourses: ["HIST 1010", "PSYC 1010", "BIOL 1010", "CHEM 1410"],
    color: "from-pink-500 to-pink-600"
  },
  {
    id: 6,
    name: "Health & Public Service",
    icon: <Users className="w-8 h-8" />,
    description: "Healthcare, social work, and public service programs focused on improving community health and wellbeing.",
    professorCount: 29,
    averageRating: 4.5,
    totalReviews: 423,
    popularCourses: ["HBHE 2300", "SOWK 3010", "KINE 1000", "NURS 2010"],
    color: "from-teal-500 to-teal-600"
  }
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

export default function Departments() {
  const navigate = useNavigate();

  const handleDepartmentClick = (departmentName: string) => {
    // Navigate to browse professors with department filter
    navigate(`/browse-professors?department=${encodeURIComponent(departmentName)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="departments" />

      {/* Page Header */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            UNT Departments
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Explore professors and courses across all academic departments at the University of North Texas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-extrabold">{departments.reduce((sum, dept) => sum + dept.professorCount, 0)}</div>
              <div className="text-white/80">Total Professors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold">{departments.length}</div>
              <div className="text-white/80">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold">{departments.reduce((sum, dept) => sum + dept.totalReviews, 0).toLocaleString()}</div>
              <div className="text-white/80">Student Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold">4.2</div>
              <div className="text-white/80">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Browse by Department</h2>
            <p className="text-lg text-gray-600">Find professors and courses in your area of study</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => handleDepartmentClick(dept.name)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {/* Department Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {dept.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Department Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Professors</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dept.professorCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Average Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars value={dept.averageRating} />
                      <span className="font-semibold text-gray-900">{dept.averageRating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Total Reviews</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dept.totalReviews.toLocaleString()}</span>
                  </div>
                </div>

                {/* Popular Courses */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Courses</h4>
                  <div className="flex flex-wrap gap-2">
                    {dept.popularCourses.slice(0, 4).map((course, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-1 group-hover:bg-green-50 group-hover:text-green-700 transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Can't Find Your Professor?</h2>
          <p className="text-lg text-white/90 mb-8">
            Help expand our database by adding professors that aren't listed yet. Your contribution helps fellow students make informed decisions.
          </p>
          <button 
            onClick={() => navigate("/add-professor")}
            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Add a Professor
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500">
        © {new Date().getFullYear()} UNTRate — Built by students for students.
      </footer>
    </div>
  );
}