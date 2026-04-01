import React, { useState, useEffect, useRef, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const { setTheme } = useContext(ThemeContext);

  // ✅ Get logged-in user dynamically
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username || "Plant Parent";

  // Close settings panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard-container">

      {/* Top Bar */}
      <div className="top-bar d-flex align-items-center px-3 position-relative">

        {/* Hamburger */}
        <i
          className="bi bi-list fs-3"
          style={{ cursor: "pointer" }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        ></i>

        {/* Dynamic Greeting */}
        <div className="welcome-text mx-auto text-center">
          <h3>Hello, {username}! 🌿</h3>
        </div>

        {/* ✅ Profile Icon Clickable */}
        <i
          className="bi bi-person-circle fs-3"
          style={{ cursor: "pointer" }}
          onClick={handleProfileClick}
        ></i>

        {/* Settings Panel */}
        {isMenuOpen && (
          <div ref={menuRef} className="settings-panel">

            <div className="menu-section-title">Themes</div>

            <div
              className="menu-item"
              onClick={() => {
                setTheme("pastel");
                setIsMenuOpen(false);
              }}
            >
              🌸 Pastel
            </div>

            <div
              className="menu-item"
              onClick={() => {
                setTheme("forest");
                setIsMenuOpen(false);
              }}
            >
              🌿 Forest
            </div>

            <div
              className="menu-item"
              onClick={() => {
                setTheme("midnight");
                setIsMenuOpen(false);
              }}
            >
              🌙 Midnight
            </div>

            <div
              className="menu-item"
              onClick={() => {
                setTheme("");
                setIsMenuOpen(false);
              }}
            >
              🚫 None (Default)
            </div>

            <hr />

            <div
              className="modal-content custom-modal menu-item text-danger"
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutModal(true);
              }}
            >
              🚪 Logout
            </div>

          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="main-content">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav d-flex justify-content-around">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active-icon" : ""}>
          <i className="bi bi-house-door-fill"></i>
        </NavLink>

        <NavLink to="/Growthlog" className={({ isActive }) => isActive ? "active-icon" : ""}>
          <i className="bi bi-journal-text"></i>
        </NavLink>

        <NavLink to="/Calendar" className={({ isActive }) => isActive ? "active-icon" : ""}>
          <i className="bi bi-calendar-event"></i>
        </NavLink>

        <NavLink to="/CareHub" className={({ isActive }) => isActive ? "active-icon" : ""}>
          <i className="bi bi-heart-pulse"></i>
        </NavLink>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
           <p style={{ color: "#2f5d3a", fontWeight: 500 }}>
  Are you sure you want to logout?
</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;