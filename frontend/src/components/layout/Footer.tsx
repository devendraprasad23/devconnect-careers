import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dc-footer">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dc-footer {
          background: #080f1a;
          border-top: 1px solid #1e293b;
          padding: 4rem 2rem 2rem;
          font-family: 'DM Sans', sans-serif;
          margin-top: auto;
        }

        .dc-footer-inner { max-width: 1200px; margin: 0 auto; }

        .dc-footer-top {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #1e293b;
        }

        @media (max-width: 960px) {
          .dc-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .dc-footer-top { grid-template-columns: 1fr; }
          .dc-footer { padding: 2.5rem 1.25rem 1.5rem; }
        }

        .dc-footer-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
          text-decoration: none;
        }

        .dc-footer-wordmark { display: flex; flex-direction: column; line-height: 1; }

        .dc-footer-wordmark-main {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .dc-footer-wordmark-sub {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #3b82f6;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .dc-footer-tagline {
          color: #475569;
          font-size: 0.875rem;
          line-height: 1.65;
          max-width: 270px;
          margin: 0 0 1.25rem;
        }

        .dc-footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 1.4rem;
        }

        .dc-footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.825rem;
          text-decoration: none;
          transition: color 0.15s;
        }

        .dc-footer-contact-item:hover { color: #94a3b8; }

        .dc-contact-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          opacity: 0.65;
        }

        .dc-footer-socials { display: flex; gap: 0.5rem; }

        .dc-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid #1e293b;
          background: #0f172a;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .dc-social-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59,130,246,0.08);
          transform: translateY(-2px);
        }

        .dc-social-btn svg { width: 15px; height: 15px; fill: currentColor; }

        .dc-footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(59,130,246,0.07);
          border: 1px solid rgba(59,130,246,0.18);
          border-radius: 20px;
          padding: 0.28rem 0.75rem;
          font-size: 0.7rem;
          color: #3b82f6;
          font-weight: 500;
          margin-top: 1rem;
        }

        .dc-footer-badge::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse-dc 2s ease-in-out infinite;
        }

        @keyframes pulse-dc {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .dc-footer-col-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b82f6;
          margin: 0 0 1.1rem;
        }

        .dc-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .dc-footer-links a {
          color: #64748b;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
        }

        .dc-footer-links a:hover { color: #cbd5e1; }

        .dc-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dc-footer-copy { color: #334155; font-size: 0.8rem; margin: 0; }
        .dc-footer-copy span { color: #475569; }

        .dc-footer-bottom-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }

        .dc-footer-bottom-links a {
          color: #334155;
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.15s;
        }

        .dc-footer-bottom-links a:hover { color: #64748b; }
      `}</style>

      <div className="dc-footer-inner">
        <div className="dc-footer-top">
          {/* ── Brand ── */}
          <div>
            <Link to="/" className="dc-footer-logo-wrap">
              {/* DC monogram mark */}
              <svg
                width="42"
                height="42"
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
                <rect
                  x="6"
                  y="9"
                  width="4"
                  height="24"
                  rx="1.5"
                  fill="#3b82f6"
                />
                <rect
                  x="6"
                  y="9"
                  width="14"
                  height="4"
                  rx="1.5"
                  fill="#3b82f6"
                />
                <rect
                  x="6"
                  y="29"
                  width="14"
                  height="4"
                  rx="1.5"
                  fill="#3b82f6"
                />
                <rect
                  x="17"
                  y="13"
                  width="4"
                  height="3"
                  rx="1"
                  fill="#3b82f6"
                />
                <rect
                  x="19"
                  y="16"
                  width="4"
                  height="10"
                  rx="1"
                  fill="#3b82f6"
                />
                <rect
                  x="17"
                  y="26"
                  width="4"
                  height="3"
                  rx="1"
                  fill="#3b82f6"
                />
                <rect
                  x="23"
                  y="9"
                  width="13"
                  height="4"
                  rx="1.5"
                  fill="#ffffff"
                />
                <rect
                  x="23"
                  y="29"
                  width="13"
                  height="4"
                  rx="1.5"
                  fill="#ffffff"
                />
                <rect
                  x="32"
                  y="13"
                  width="4"
                  height="16"
                  rx="1"
                  fill="#ffffff"
                />
                <rect
                  x="23"
                  y="13"
                  width="4"
                  height="4"
                  rx="1"
                  fill="#0f172a"
                />
                <rect
                  x="23"
                  y="25"
                  width="4"
                  height="4"
                  rx="1"
                  fill="#0f172a"
                />
                <circle
                  cx="21.5"
                  cy="21"
                  r="1.5"
                  fill="#3b82f6"
                  opacity="0.7"
                />
              </svg>
              <div className="dc-footer-wordmark">
                <span className="dc-footer-wordmark-main">DevConnect</span>
                <span className="dc-footer-wordmark-sub">Careers</span>
              </div>
            </Link>

            <p className="dc-footer-tagline">
              Connecting ambitious developers with companies that value great
              engineering. Built for the next generation of tech talent.
            </p>

            <div className="dc-footer-contact">
              <a
                href="mailto:support@devconnect.com"
                className="dc-footer-contact-item"
              >
                <svg
                  className="dc-contact-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
                support@devconnect.com
              </a>
              <span className="dc-footer-contact-item">
                <svg
                  className="dc-contact-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Bangalore, India
              </span>
              <a href="tel:+919876543210" className="dc-footer-contact-item">
                <svg
                  className="dc-contact-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                </svg>
                +91 98765 43210
              </a>
            </div>

            {/* Your real social accounts */}
            <div className="dc-footer-socials">
              <a
                href="https://www.linkedin.com/in/devendra-c-5224h/"
                target="_blank"
                rel="noopener noreferrer"
                className="dc-social-btn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/devendraprasad23"
                target="_blank"
                rel="noopener noreferrer"
                className="dc-social-btn"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/_anonymous_soul_0905"
                target="_blank"
                rel="noopener noreferrer"
                className="dc-social-btn"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://x.com/Msd_Dev07"
                target="_blank"
                rel="noopener noreferrer"
                className="dc-social-btn"
                title="X / Twitter"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <div className="dc-footer-badge">Platform live — join the beta</div>
          </div>

          {/* ── Company ── */}
          <div>
            <p className="dc-footer-col-title">Company</p>
            <ul className="dc-footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Our Mission</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Careers at DevConnect</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* ── For Candidates ── */}
          <div>
            <p className="dc-footer-col-title">For Candidates</p>
            <ul className="dc-footer-links">
              <li>
                <Link to="/jobs">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/register">Create Profile</Link>
              </li>
              <li>
                <Link to="/my-applications">My Applications</Link>
              </li>
              <li>
                <a href="#">Career Resources</a>
              </li>
              <li>
                <a href="#">Resume Tips</a>
              </li>
            </ul>
          </div>

          {/* ── For Recruiters ── */}
          <div>
            <p className="dc-footer-col-title">For Recruiters</p>
            <ul className="dc-footer-links">
              <li>
                <Link to="/recruiter/post-job">Post a Job</Link>
              </li>
              <li>
                <Link to="/recruiter">Dashboard</Link>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Hiring Guide</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="dc-footer-bottom">
          <p className="dc-footer-copy">
            © {year} <span>DevConnect Careers</span>. All Rights Reserved.
          </p>
          <div className="dc-footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
