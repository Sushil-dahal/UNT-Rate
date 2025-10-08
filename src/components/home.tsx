import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  UserCircle2,
} from "lucide-react";
import Header from "./Header";

type Professor = {
  id: number;
  name: string;
  department: string;
  rating: number;        // 0–5
  reviews: number;
  tags: string[];
};

const topProfessors: Professor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    department: "Computer Science & Engineering",
    rating: 4.8,
    reviews: 42,
    tags: ["Clear Communication", "Engaging Lectures", "Fair Exams"],
  },
  {
    id: 2,
    name: "Dr. Lisa Thompson",
    department: "Education",
    rating: 4.7,
    reviews: 51,
    tags: ["Caring", "Extra Credit", "Organized"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    department: "Engineering",
    rating: 4.6,
    reviews: 38,
    tags: ["Tough Grader", "Fair Exams", "Helpful Office Hours"],
  },
  {
    id: 4,
    name: "Prof. Michael Chen",
    department: "Business",
    rating: 4.2,
    reviews: 67,
    tags: ["Good Grader", "Organized", "Caring"],
  },
  {
    id: 5,
    name: "Prof. David Wilson",
    department: "Arts & Sciences",
    rating: 3.9,
    reviews: 29,
    tags: ["Attendance Matters", "Lots Of Assignments"],
  },
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

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="home" />

      {/* Hero */}
      <section className="bg-green-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Find Your Perfect Professor at UNT
          </h1>
          <p className="mt-4 text-white/90">
            Help your fellow Mean Green students make informed decisions about
            their courses and professors at the University of North Texas.
          </p>

          {/* Search / Filters */}
          <div className="mt-8 space-y-3">
            <div className="mx-auto max-w-3xl flex">
              <div className="flex-1 bg-white rounded-l-lg">
                <div className="flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search professors by name, department, or course..."
                    className="border-0 focus-visible:ring-0 focus:border-0 bg-transparent"
                  />
                </div>
              </div>
              <button className="rounded-r-lg px-5 bg-green-600 hover:bg-green-700">
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <select className="bg-white/10 backdrop-blur border border-white/30 rounded-lg px-4 py-2 text-white">
                <option className="text-gray-800">All Departments</option>
                <option className="text-gray-800">Computer Science</option>
                <option className="text-gray-800">Engineering</option>
                <option className="text-gray-800">Business</option>
                <option className="text-gray-800">Education</option>
                <option className="text-gray-800">Arts & Sciences</option>
              </select>

              <select className="bg-white/10 backdrop-blur border border-white/30 rounded-lg px-4 py-2 text-white">
                <option className="text-gray-800">All Ratings</option>
                <option className="text-gray-800">4.5+ stars</option>
                <option className="text-gray-800">4.0+ stars</option>
                <option className="text-gray-800">3.5+ stars</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6">Top Rated Professors</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProfessors.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.department}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Stars value={p.rating} />
                      <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">
                        ({p.reviews} reviews)
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500">
        © {new Date().getFullYear()} UNTRate — Built by Quadra Tech.
      </footer>
    </div>
  );
}