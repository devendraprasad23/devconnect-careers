import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuthStore } from "../../store/auth.store";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  experienceMin: number;
  experienceMax: number;
  skillsRequired: string[];
  description: string;
  status: string;
  applicationsCount: number;
  postedAt: string;
}

const JOB_TYPES = [
  "ALL",
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];
const PAGE_SIZE = 9;

export default function JobBoardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isRecruiter = user?.role === "RECRUITER";

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxSalary, setMaxSalary] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [applyModal, setApplyModal] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>("");
  const [applying, setApplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadJobs();
    if (user && !isRecruiter) loadMyApplications();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get("/jobs?page=0&size=100");
      const data = res.data?.data?.content ?? res.data?.data ?? res.data ?? [];
      setAllJobs(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load jobs");
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      const res = await api.get("/applications/my?page=0&size=100");
      const apps = res.data?.data?.content ?? res.data?.data ?? [];
      setAppliedJobIds(new Set(apps.map((a: any) => a.jobId)));
    } catch {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("PDF files only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => setResumeBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!applyModal) return;
    // Resume is required
    if (!resumeBase64) {
      toast.error("Please upload your resume before submitting");
      return;
    }
    // Cover letter is required
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }
    setApplying(true);
    try {
      await api.post(`/applications/jobs/${applyModal.id}`, {
        coverLetter,
        resumeUrl: resumeBase64,
      });
      setAppliedJobIds((prev) => new Set([...prev, applyModal.id]));
      setApplyModal(null);
      setCoverLetter("");
      setResumeFile(null);
      setResumeBase64("");
      toast.success("Application submitted! 🎉");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to apply";
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  const filtered = allJobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      job.title?.toLowerCase().includes(q) ||
      job.companyName?.toLowerCase().includes(q) ||
      job.skillsRequired?.some((s) => s.toLowerCase().includes(q));
    const matchType = typeFilter === "ALL" || job.jobType === typeFilter;
    const matchLocation =
      !locationFilter ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchSalary =
      !maxSalary || (job.salaryMin ?? 0) <= maxSalary * 100000;
    return matchSearch && matchType && matchLocation && matchSalary;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const salaryLabel = (v: number) => (v === 0 ? "Any" : `₹${v}L`);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, typeFilter, locationFilter, maxSalary]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: 80,
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          {isRecruiter ? "Browse Job Listings" : "Find Your Next Role"}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} available
          {isRecruiter && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "#f59e0b",
                background: "rgba(245,158,11,0.1)",
                padding: "2px 8px",
                borderRadius: 20,
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              Recruiter View — Read Only
            </span>
          )}
        </p>

        {/* Search + location */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, skills, companies..."
            style={{
              flex: 2,
              minWidth: 200,
              padding: "12px 16px",
              borderRadius: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Location..."
            style={{
              flex: 1,
              minWidth: 140,
              padding: "12px 16px",
              borderRadius: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        {/* Salary slider */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            Max Salary:{" "}
            <strong style={{ color: "var(--accent)" }}>
              {salaryLabel(maxSalary)}
            </strong>
          </span>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={maxSalary}
            onChange={(e) => setMaxSalary(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
          />
          {maxSalary > 0 && (
            <button
              onClick={() => setMaxSalary(0)}
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                borderColor:
                  typeFilter === t ? "var(--accent)" : "var(--border-color)",
                background: typeFilter === t ? "var(--accent)" : "transparent",
                color: typeFilter === t ? "#fff" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t === "ALL" ? "All Types" : t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Job grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        {loading ? (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  height: 220,
                  borderRadius: 14,
                  background: "var(--bg-card)",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No jobs found
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setLocationFilter("");
                setMaxSalary(0);
              }}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              }}
            >
              {visible.map((job) => {
                const applied = appliedJobIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    style={{
                      background: "var(--bg-card)",
                      borderRadius: 14,
                      border: "1px solid var(--border-color)",
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      transition: "transform 0.2s, border-color 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "none";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border-color)";
                    }}
                  >
                    {/* Title row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <h3
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          fontSize: 17,
                          lineHeight: 1.3,
                          flex: 1,
                        }}
                      >
                        {job.title}
                      </h3>
                      {applied && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "rgba(34,197,94,0.15)",
                            color: "#22c55e",
                            border: "1px solid rgba(34,197,94,0.3)",
                            whiteSpace: "nowrap",
                            marginLeft: 8,
                          }}
                        >
                          ✓ Applied
                        </span>
                      )}
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                      {job.companyName} · {job.location}
                    </p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 12,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: "rgba(99,102,241,0.15)",
                          color: "#818cf8",
                          border: "1px solid rgba(99,102,241,0.2)",
                        }}
                      >
                        {job.jobType?.replace(/_/g, " ")}
                      </span>
                      {job.salaryMin > 0 && (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "rgba(34,197,94,0.1)",
                            color: "#4ade80",
                            border: "1px solid rgba(34,197,94,0.2)",
                          }}
                        >
                          ₹{(job.salaryMin / 100000).toFixed(1)}L – ₹
                          {(job.salaryMax / 100000).toFixed(1)}L
                        </span>
                      )}
                      {job.experienceMin != null && (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "rgba(251,191,36,0.1)",
                            color: "#fbbf24",
                            border: "1px solid rgba(251,191,36,0.2)",
                          }}
                        >
                          {job.experienceMin}– yrs
                        </span>
                      )}
                    </div>

                    {job.skillsRequired?.length > 0 && (
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {job.skillsRequired.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 6,
                              background: "var(--bg-secondary)",
                              color: "var(--text-muted)",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 4 && (
                          <span
                            style={{ fontSize: 11, color: "var(--text-muted)" }}
                          >
                            +{job.skillsRequired.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                      }}
                    >
                      <span
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        {job.applicationsCount ?? 0} applicants
                      </span>

                      {/* Apply button — hidden for recruiters */}
                      {!isRecruiter && user && !applied && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setApplyModal(job);
                          }}
                          style={{
                            padding: "8px 18px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            background: "var(--accent)",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          Apply Now
                        </button>
                      )}

                      {/* Login to apply — for guests */}
                      {!user && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/login");
                          }}
                          style={{
                            padding: "8px 18px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            background: "var(--accent)",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Login to Apply
                        </button>
                      )}

                      {/* Recruiter view indicator */}
                      {isRecruiter && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#f59e0b",
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.2)",
                          }}
                        >
                          View Only
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  style={{
                    padding: "12px 36px",
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--accent)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--accent)";
                  }}
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Apply Modal — only for candidates */}
      {applyModal && !isRecruiter && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setApplyModal(null);
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border-color)",
              padding: 32,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 4,
              }}
            >
              Apply for {applyModal.title}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              {applyModal.companyName} · {applyModal.location}
            </p>

            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Cover Letter <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a great fit for this role?"
              rows={5}
              style={{
                width: "100%",
                marginTop: 6,
                marginBottom: 20,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#1e293b",
                border: `1px solid ${!coverLetter.trim() && applying ? "#ef4444" : "var(--border-color)"}`,
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />

            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Resume (PDF, max 5MB) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: 6,
                marginBottom: 24,
                padding: 18,
                borderRadius: 10,
                border: `2px dashed ${resumeFile ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.4)"}`,
                textAlign: "center",
                cursor: "pointer",
                background: resumeFile
                  ? "rgba(34,197,94,0.05)"
                  : "rgba(239,68,68,0.03)",
              }}
            >
              {resumeFile ? (
                <div>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📄</div>
                  <p
                    style={{ color: "#22c55e", fontSize: 14, fontWeight: 500 }}
                  >
                    {resumeFile.name}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {(resumeFile.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                  <p
                    style={{ color: "#ef4444", fontSize: 14, fontWeight: 500 }}
                  >
                    Resume required — click to upload
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    PDF only · max 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setApplyModal(null);
                  setCoverLetter("");
                  setResumeFile(null);
                  setResumeBase64("");
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "transparent",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                style={{
                  flex: 2,
                  padding: 12,
                  borderRadius: 10,
                  background: applying
                    ? "rgba(99,102,241,0.5)"
                    : "var(--accent)",
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: applying ? "not-allowed" : "pointer",
                }}
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
