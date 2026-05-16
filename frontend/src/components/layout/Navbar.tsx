import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import toast from "react-hot-toast";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="dc-navbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .dc-navbar {
          background: rgba(8, 15, 26, 0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e293b;
          padding: 0 2rem;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
        }

        .dc-navbar-left { display: flex; align-items: center; gap: 2rem; }

        .dc-nav-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .dc-nav-logo-text { display: flex; flex-direction: column; line-height: 1; }

        .dc-nav-logo-main {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .dc-nav-logo-sub {
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #3b82f6;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .dc-nav-links { display: flex; align-items: center; gap: 0.15rem; }

        .dc-nav-link {
          color: #64748b;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.38rem 0.75rem;
          border-radius: 8px;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .dc-nav-link:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }
        .dc-nav-link.active { color: #f1f5f9; background: rgba(59,130,246,0.1); }

        .dc-navbar-right { display: flex; align-items: center; gap: 0.75rem; }

        .dc-nav-user {
          font-size: 0.8rem;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dc-nav-role-badge {
          background: rgba(59,130,246,0.12);
          color: #3b82f6;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.18rem 0.5rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .dc-nav-btn {
          padding: 0.38rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
        }

        .dc-nav-btn-ghost {
          background: transparent;
          border: 1px solid #1e293b;
          color: #94a3b8;
        }

        .dc-nav-btn-ghost:hover { border-color: #334155; color: #f1f5f9; }

        .dc-nav-btn-primary {
          background: #3b82f6;
          border: 1px solid #3b82f6;
          color: white;
        }

        .dc-nav-btn-primary:hover { background: #2563eb; border-color: #2563eb; }

        @media (max-width: 700px) {
          .dc-navbar { padding: 0 1rem; }
          .dc-nav-links { display: none; }
          .dc-nav-user span:first-child { display: none; }
          .dc-nav-logo-sub { display: none; }
        }
      `}</style>

      <div className="dc-navbar-left">
        <Link to="/" className="dc-nav-logo">
          {/* DC monogram mark — same as footer */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="42"
              height="42"
              rx="10"
              fill="#0f172a"
              stroke="#1e3a5f"
              strokeWidth="1"
            />
            <rect x="6" y="9" width="4" height="24" rx="1.5" fill="#3b82f6" />
            <rect x="6" y="9" width="14" height="4" rx="1.5" fill="#3b82f6" />
            <rect x="6" y="29" width="14" height="4" rx="1.5" fill="#3b82f6" />
            <rect x="17" y="13" width="4" height="3" rx="1" fill="#3b82f6" />
            <rect x="19" y="16" width="4" height="10" rx="1" fill="#3b82f6" />
            <rect x="17" y="26" width="4" height="3" rx="1" fill="#3b82f6" />
            <rect x="23" y="9" width="13" height="4" rx="1.5" fill="#ffffff" />
            <rect x="23" y="29" width="13" height="4" rx="1.5" fill="#ffffff" />
            <rect x="32" y="13" width="4" height="16" rx="1" fill="#ffffff" />
            <rect x="23" y="13" width="4" height="4" rx="1" fill="#0f172a" />
            <rect x="23" y="25" width="4" height="4" rx="1" fill="#0f172a" />
            <circle cx="21.5" cy="21" r="1.5" fill="#3b82f6" opacity="0.7" />
          </svg>
          <div className="dc-nav-logo-text">
            <span className="dc-nav-logo-main">DevConnect</span>
            <span className="dc-nav-logo-sub">Careers</span>
          </div>
        </Link>

        <div className="dc-nav-links">
          <Link
            to="/jobs"
            className={`dc-nav-link ${isActive("/jobs") ? "active" : ""}`}
          >
            Browse Jobs
          </Link>

          {isAuthenticated && user?.role === "CANDIDATE" && (
            <>
              <Link
                to="/my-applications"
                className={`dc-nav-link ${isActive("/my-applications") ? "active" : ""}`}
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                className={`dc-nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "RECRUITER" && (
            <>
              <Link
                to="/recruiter"
                className={`dc-nav-link ${isActive("/recruiter") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/post-job"
                className={`dc-nav-link ${isActive("/recruiter/post-job") ? "active" : ""}`}
              >
                Post Job
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="dc-navbar-right">
        {isAuthenticated ? (
          <>
            <div className="dc-nav-user">
              <span>{user?.email}</span>
              <span className="dc-nav-role-badge">{user?.role}</span>
            </div>
            <button
              className="dc-nav-btn dc-nav-btn-ghost"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="dc-nav-btn dc-nav-btn-ghost">
              Log In
            </Link>
            <Link to="/register" className="dc-nav-btn dc-nav-btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
