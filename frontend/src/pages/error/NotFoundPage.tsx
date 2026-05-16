import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const home = user?.role === "RECRUITER" ? "/recruiter" : "/";

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="text-center relative z-10">
        <div className="relative mb-6">
          <p
            className="text-[9rem] font-black leading-none select-none"
            style={{
              fontFamily: "Sora, sans-serif",
              background: "linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">🔍</span>
          </div>
        </div>

        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Page not found
        </h1>
        <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-secondary px-6">
            ← Go Back
          </button>
          <button onClick={() => navigate(home)} className="btn-primary px-6">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
