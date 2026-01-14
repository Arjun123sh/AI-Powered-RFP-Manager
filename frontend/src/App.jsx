import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CreateRfp from "./pages/CreateRfp";
import Vendors from "./pages/Vendors";
import Proposals from "./pages/Proposals";
import Compare from "./pages/Compare";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              RFP Manager
            </div>
          </div>
          
          <div className="flex gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              Create RFP
            </NavLink>
            <NavLink
              to="/vendors"
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              Vendors
            </NavLink>
            <NavLink
              to="/proposals"
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              Proposals
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              Compare
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CreateRfp />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}