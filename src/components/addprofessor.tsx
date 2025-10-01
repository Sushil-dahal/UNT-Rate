import { useNavigate } from "react-router-dom";
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import Header from "./Header";

export default function AddProfessor() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="add-professor" />

      {/* Page Header */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Add Professor
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Help expand our UNT professor database by adding a new professor. Your contribution helps fellow students make informed decisions about their courses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-semibold">Easy Process</div>
              <div className="text-white/80 text-sm">Simple form to add professor details</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-semibold">Verified Info</div>
              <div className="text-white/80 text-sm">All submissions are reviewed for accuracy</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-semibold">Help Students</div>
              <div className="text-white/80 text-sm">Your contribution helps the UNT community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Smith"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors">
                    <option>Select Title</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors">
                    <option>Select Department</option>
                    <option>Computer Science & Engineering</option>
                    <option>Engineering</option>
                    <option>Business</option>
                    <option>Education</option>
                    <option>Arts & Sciences</option>
                    <option>Health & Public Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Additional Details (Optional)
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UNT Email
                    </label>
                    <input
                      type="email"
                      placeholder="professor@unt.edu"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., NCHM 3.220"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courses Taught
                  </label>
                  <textarea
                    rows={4}
                    placeholder="List courses this professor teaches (e.g., CSCE 1030, CSCE 2100, CSCE 3110)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Maximum 200 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professor Bio/Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Any additional information about this professor that might be helpful for students..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Maximum 500 characters</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <button 
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                ← Back to Home
              </button>
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center gap-2 hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                <UserPlus className="w-5 h-5" /> 
                Add Professor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Guidelines for Adding Professors</h2>
            <p className="text-lg text-gray-600">Please follow these guidelines to ensure quality and accuracy</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Faculty Only</h3>
              <p className="text-gray-700 text-sm">
                Only add professors who currently teach at UNT and are actively offering courses.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Information</h3>
              <p className="text-gray-700 text-sm">
                Ensure all name, department, and contact information is accurate and up-to-date.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Before Submitting</h3>
              <p className="text-gray-700 text-sm">
                Double-check all professor details against official UNT directories before submission.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avoid Duplicates</h3>
              <p className="text-gray-700 text-sm">
                Check if the professor already exists in our database. Duplicates will be reviewed and merged.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h3>
              <p className="text-gray-700 text-sm">
                New professors may take up to 24 hours to appear as submissions go through our review process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Help the Community</h3>
              <p className="text-gray-700 text-sm">
                Your contribution helps fellow UNT students make informed decisions about their courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Need Help?</h2>
          <p className="text-lg text-white/90 mb-8">
            If you're having trouble finding professor information or need assistance with the form, check the UNT faculty directory or contact us for help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/browse-professors")}
              className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Existing Professors
            </button>
            <button 
              onClick={() => navigate("/departments")}
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              View All Departments
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 bg-gray-50">
        © {new Date().getFullYear()} UNTRate — Built by students for students.
      </footer>
    </div>
  );
}