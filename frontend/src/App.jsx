import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CreateRfp from "./pages/CreateRfp";
import Vendors from "./pages/Vendors";
import Proposals from "./pages/Proposals";
import Compare from "./pages/Compare";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">RFP Manager</div>
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Create RFP
            </NavLink>
            <NavLink
              to="/vendors"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Vendors
            </NavLink>
            <NavLink
              to="/proposals"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Proposals
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
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
