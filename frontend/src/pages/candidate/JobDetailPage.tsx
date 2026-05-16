import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/auth.store";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  skillsRequired: string[];
  applicationsCount: number;
  status: string;
  createdAt: string;
  recruiterEmail?: string;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState("");
  const [applying, setApplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data?.data ?? res.data))
      .catch(() => navigate("/jobs"))
      .finally(() => setLoading(false));

    if (user) {
      api
        .get("/applications/my")
        .then((res) => {
          const apps = res.data?.data?.content ?? res.data?.data ?? [];
          setApplied(apps.some((a: any) => a.jobId === id));
        })
        .catch(() => {});
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("PDF only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Max 5MB");
      return;
    }
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => setResumeBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await api.post(`/applications/jobs/${job.id}`, {
        coverLetter,
        resumeUrl: resumeBase64 || null,
      });
      setApplied(true);
      setShowModal(false);
      setCoverLetter("");
      setResumeFile(null);
      setResumeBase64("");
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

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
        <p style={{ color: "var(--text-muted)" }}>Loading job...</p>
      </div>
    );

  if (!job) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        {/* Back button */}
        <button
          onClick={() => navigate("/jobs")}
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to Jobs
        </button>

        {/* Header card */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            border: "1px solid var(--border-color)",
            padding: 32,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  color: "var(--text-primary)",
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {job.title}
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 16,
                  marginBottom: 16,
                }}
              >
                {job.location}
              </p>

              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    fontSize: 13,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "rgba(99,102,241,0.15)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  {job.jobType?.replace(/_/g, " ")}
                </span>
                {job.salaryMin && (
                  <span
                    style={{
                      fontSize: 13,
                      padding: "4px 12px",
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
                <span
                  style={{
                    fontSize: 13,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "rgba(251,191,36,0.1)",
                    color: "#fbbf24",
                    border: "1px solid rgba(251,191,36,0.2)",
                  }}
                >
                  {job.experienceMin}–{job.experienceMax} yrs exp
                </span>
                <span
                  style={{
                    fontSize: 13,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "rgba(148,163,184,0.1)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {job.applicationsCount ?? 0} applicants
                </span>
              </div>
            </div>

            {/* Apply button */}
            <div>
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "12px 28px",
                    borderRadius: 10,
                    background: "var(--accent)",
                    border: "none",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Login to Apply
                </button>
              ) : applied ? (
                <span
                  style={{
                    padding: "12px 28px",
                    borderRadius: 10,
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.3)",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  ✓ Applied
                </span>
              ) : user.role === "CANDIDATE" ? (
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    padding: "12px 28px",
                    borderRadius: 10,
                    background: "var(--accent)",
                    border: "none",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Apply Now
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Skills */}
        {job.skillsRequired?.length > 0 && (
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              border: "1px solid var(--border-color)",
              padding: 24,
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 14,
              }}
            >
              Skills Required
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {job.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 13,
                    padding: "5px 14px",
                    borderRadius: 20,
                    background: "rgba(99,102,241,0.1)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 14,
            border: "1px solid var(--border-color)",
            padding: 24,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 14,
            }}
          >
            Job Description
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              border: "1px solid var(--border-color)",
              padding: 24,
            }}
          >
            <h2
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 14,
              }}
            >
              Requirements
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {job.requirements}
            </p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
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
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border-color)",
              padding: 32,
              width: "100%",
              maxWidth: 500,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 4,
              }}
            >
              Apply for {job.title}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              {job.location}
            </p>

            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a great fit? (optional)"
              rows={5}
              style={{
                width: "100%",
                marginTop: 6,
                marginBottom: 20,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#1e293b",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Resume (PDF, max 5MB)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                marginTop: 6,
                marginBottom: 24,
                padding: 18,
                borderRadius: 10,
                border: `2px dashed ${resumeFile ? "rgba(34,197,94,0.5)" : "var(--border-color)"}`,
                textAlign: "center",
                cursor: "pointer",
                background: resumeFile ? "rgba(34,197,94,0.05)" : "transparent",
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
                  <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    Click to upload resume
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
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "transparent",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
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
