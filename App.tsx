import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-3xl font-bold text-green-600 text-center mt-20">UNT Rate App Initialized 🚀</h1>} />
      </Routes>
    </Router>
  );
}
