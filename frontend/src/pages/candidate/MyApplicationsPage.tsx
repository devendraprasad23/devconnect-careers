import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  recruiterEmail: string;
  location: string;
  jobType: string;
  status: string;
  coverLetter: string;
  resumeUrl: string;
  matchScore: number;
  appliedAt: string;
  salaryMin: number;
  salaryMax: number;
}

const STATUS_PIPELINE = [
  "APPLIED",
  "REVIEWED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  REVIEWED: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
  SHORTLISTED: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  INTERVIEW: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  OFFERED: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
  REJECTED: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  WITHDRAWN: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api
      .get("/applications/my?page=0&size=100")
      .then((res) => {
        const data = res.data?.data?.content ?? res.data?.data ?? [];
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (id: string) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "WITHDRAWN" } : a)),
      );
      toast.success("Application withdrawn");
    } catch {
      toast.error("Failed to withdraw");
    }
  };

  const filtered =
    filter === "ALL"
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = applications.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const activeCount = applications.filter(
    (a) => !["REJECTED", "WITHDRAWN"].includes(a.status),
  ).length;

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          paddingTop: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>Loading applications...</p>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            My Applications
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            {applications.length} total · {activeCount} active
          </p>
        </div>

        {applications.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No applications yet
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
              Start applying to jobs to track your progress here
            </p>
            <button
              onClick={() => navigate("/jobs")}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <>
            {/* Filter pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {["ALL", ...Object.keys(counts)]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid",
                      borderColor:
                        filter === s ? "var(--accent)" : "var(--border-color)",
                      background:
                        filter === s ? "var(--accent)" : "transparent",
                      color: filter === s ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {s}{" "}
                    {s !== "ALL" && counts[s]
                      ? `(${counts[s]})`
                      : s === "ALL"
                        ? `(${applications.length})`
                        : ""}
                  </button>
                ))}
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 48,
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  border: "1px solid var(--border-color)",
                }}
              >
                <p style={{ color: "var(--text-muted)" }}>
                  No applications with status "{filter}"
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {filtered.map((app) => {
                  const sc = STATUS_COLORS[app.status] || {
                    bg: "rgba(100,116,139,0.1)",
                    color: "#94a3b8",
                  };
                  const pipelineIdx = STATUS_PIPELINE.indexOf(app.status);

                  return (
                    <div
                      key={app.id}
                      style={{
                        background: "var(--bg-card)",
                        borderRadius: 14,
                        border: "1px solid var(--border-color)",
                        padding: 24,
                      }}
                    >
                      {/* Top row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 16,
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <div>
                          <h3
                            onClick={() => navigate(`/jobs/${app.jobId}`)}
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              fontSize: 18,
                              marginBottom: 4,
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "var(--accent)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color =
                                "var(--text-primary)")
                            }
                          >
                            {app.jobTitle}
                          </h3>
                          <p
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: 14,
                            }}
                          >
                            {app.recruiterEmail} · {app.location}
                            {app.jobType &&
                              ` · ${app.jobType.replace(/_/g, " ")}`}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              padding: "5px 12px",
                              borderRadius: 20,
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.color}40`,
                            }}
                          >
                            {app.status}
                          </span>
                          {app.status !== "WITHDRAWN" &&
                            app.status !== "REJECTED" && (
                              <button
                                onClick={() => withdraw(app.id)}
                                style={{
                                  fontSize: 12,
                                  color: "#ef4444",
                                  background: "none",
                                  border: "1px solid rgba(239,68,68,0.3)",
                                  borderRadius: 8,
                                  padding: "4px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                Withdraw
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Pipeline tracker */}
                      {pipelineIdx >= 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0,
                            }}
                          >
                            {STATUS_PIPELINE.map((step, i) => {
                              const done = i <= pipelineIdx;
                              const isLast = i === STATUS_PIPELINE.length - 1;
                              return (
                                <div
                                  key={step}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flex: isLast ? "none" : 1,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: 4,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        background: done
                                          ? "var(--accent)"
                                          : "var(--border-color)",
                                        border: `2px solid ${done ? "var(--accent)" : "var(--border-color)"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {done && (
                                        <span
                                          style={{
                                            color: "#fff",
                                            fontSize: 10,
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: 9,
                                        color: done
                                          ? "var(--accent)"
                                          : "var(--text-muted)",
                                        whiteSpace: "nowrap",
                                        fontWeight: done ? 600 : 400,
                                      }}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                  {!isLast && (
                                    <div
                                      style={{
                                        flex: 1,
                                        height: 2,
                                        background:
                                          i < pipelineIdx
                                            ? "var(--accent)"
                                            : "var(--border-color)",
                                        marginBottom: 16,
                                        margin: "0 4px 16px",
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Match score + salary */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flex: 1,
                            minWidth: 150,
                          }}
                        >
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            AI Match
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: 4,
                              background: "var(--border-color)",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(app.matchScore, 100)}%`,
                                height: "100%",
                                background:
                                  app.matchScore >= 70
                                    ? "#22c55e"
                                    : app.matchScore >= 40
                                      ? "var(--accent)"
                                      : "#f59e0b",
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: "var(--accent)",
                              fontSize: 12,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {app.matchScore}%
                          </span>
                        </div>
                        {app.salaryMin > 0 && (
                          <span style={{ color: "#4ade80", fontSize: 13 }}>
                            ₹{(app.salaryMin / 100000).toFixed(1)}L – ₹
                            {(app.salaryMax / 100000).toFixed(1)}L
                          </span>
                        )}
                        <span
                          style={{ color: "var(--text-muted)", fontSize: 12 }}
                        >
                          Applied{" "}
                          {app.appliedAt
                            ? new Date(app.appliedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "recently"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
