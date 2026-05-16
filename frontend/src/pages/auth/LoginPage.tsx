import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/auth.store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const {
        accessToken,
        refreshToken,
        role,
        email: userEmail,
        userId,
        verified,
      } = res.data.data;
      setAuth(
        { userId, email: userEmail, role, verified: verified ?? true },
        accessToken,
        refreshToken,
      );
      toast.success("Welcome back!");
      navigate(role === "RECRUITER" ? "/recruiter" : "/jobs");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .login-page { min-height: 100vh; background: #080f1a; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
        .login-page::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); pointer-events: none; }
        .login-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 420px; position: relative; z-index: 1; }
        .login-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 1.75rem; text-decoration: none; }
        .login-wordmark { display: flex; flex-direction: column; line-height: 1; }
        .login-wordmark-main { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: #f1f5f9; letter-spacing: -0.02em; }
        .login-wordmark-sub { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; color: #3b82f6; text-transform: uppercase; margin-top: 2px; }
        .login-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; text-align: center; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .login-subtitle { color: #475569; font-size: 0.875rem; text-align: center; margin: 0 0 2rem; }
        .login-form { display: flex; flex-direction: column; gap: 1rem; }
        .login-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .login-label { font-size: 0.8rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.02em; }
        .login-input-wrap { position: relative; }
        .login-input-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #334155; pointer-events: none; }
        .login-input { width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; color: #f1f5f9; font-size: 0.9rem; padding: 0.7rem 0.85rem 0.7rem 2.5rem; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .login-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .login-input::placeholder { color: #334155; }
        .login-btn { background: #3b82f6; color: white; border: none; border-radius: 10px; padding: 0.75rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; }
        .login-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #475569; }
        .login-footer a { color: #3b82f6; text-decoration: none; font-weight: 500; }
        .login-footer a:hover { text-decoration: underline; }
        .login-divider { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; }
        .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: #1e293b; }
        .login-divider span { color: #334155; font-size: 0.75rem; }
        .login-demo { background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.15); border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.78rem; color: #475569; text-align: center; line-height: 1.6; }
        .login-demo strong { color: #3b82f6; }
      `}</style>

      <div className="login-card">
        <Link to="/" className="login-logo">
          <svg width="38" height="38" viewBox="0 0 42 42" fill="none">
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
          <div className="login-wordmark">
            <span className="login-wordmark-main">DevConnect</span>
            <span className="login-wordmark-sub">Careers</span>
          </div>
        </Link>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue your journey</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <svg
                className="login-input-icon"
                width="16"
                height="16"
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
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <svg
                className="login-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" /> Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-demo">
          <strong>Demo:</strong> Register as Recruiter or Candidate to explore
          all features
        </div>

        <div className="login-footer">
          Don't have an account? <Link to="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
