import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface ProfileForm {
  fullName: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  location: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  college: string;
  degree: string;
  graduationYear: string;
  noticePeriod: string;
  certifications: Certification[];
  resumeUrl: string;
  profilePicture: string;
}

export default function CandidateProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    bio: "",
    skills: [],
    experienceYears: 0,
    location: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    college: "",
    degree: "",
    graduationYear: "",
    noticePeriod: "",
    certifications: [],
    resumeUrl: "",
    profilePicture: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCert, setNewCert] = useState<Certification>({
    name: "",
    issuer: "",
    year: "",
  });
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/users/profile")
      .then((res) => {
        const d = res.data.data;
        setForm({
          fullName: d.fullName || "",
          bio: d.bio || "",
          skills: d.skills || [],
          experienceYears: d.experienceYears || 0,
          location: d.location || "",
          phone: d.phone || "",
          linkedinUrl: d.linkedinUrl || "",
          githubUrl: d.githubUrl || "",
          portfolioUrl: d.portfolioUrl || "",
          college: d.college || "",
          degree: d.degree || "",
          graduationYear: d.graduationYear || "",
          noticePeriod: d.noticePeriod || "",
          certifications: d.certifications || [],
          resumeUrl: d.resumeUrl || "",
          profilePicture: d.profilePicture || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const addCert = () => {
    if (!newCert.name.trim()) return;
    setForm((p) => ({ ...p, certifications: [...p.certifications, newCert] }));
    setNewCert({ name: "", issuer: "", year: "" });
  };

  const removeCert = (i: number) =>
    setForm((p) => ({
      ...p,
      certifications: p.certifications.filter((_, idx) => idx !== i),
    }));

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, resumeUrl: reader.result as string }));
    reader.readAsDataURL(file);
    toast.success("Resume loaded — save profile to apply it");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, profilePicture: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/users/profile", form);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#475569", fontFamily: "DM Sans, sans-serif" }}>
            Loading profile...
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
          .profile-page { min-height: 100vh; background: #0f172a; padding: 2rem 1rem 4rem; font-family: 'DM Sans', sans-serif; }
          .profile-container { max-width: 780px; margin: 0 auto; }
          .profile-header { margin-bottom: 2rem; display: flex; align-items: center; gap: 1.5rem; }
          .profile-avatar-wrap { position: relative; flex-shrink: 0; }
          .profile-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #1e293b; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 2rem; overflow: hidden; }
          .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
          .profile-avatar-btn { position: absolute; bottom: 0; right: 0; width: 26px; height: 26px; border-radius: 50%; background: #3b82f6; border: 2px solid #0f172a; cursor: pointer; display: flex; align-items: center; justify-content: center; }
          .profile-header-info h1 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
          .profile-header-info p { color: #475569; font-size: 0.875rem; margin: 0; }
          .profile-score { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.75rem; color: #3b82f6; font-weight: 600; margin-top: 0.5rem; }
          .profile-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.25rem; }
          .section-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #3b82f6; margin: 0 0 1.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e3a5f; }
          .form-grid { display: grid; gap: 1rem; }
          .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
          @media (max-width: 600px) { .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; } }
          .field { display: flex; flex-direction: column; gap: 0.35rem; }
          .field label { font-size: 0.78rem; font-weight: 600; color: #94a3b8; }
          .field input, .field textarea, .field select { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; color: #f1f5f9; font-size: 0.875rem; padding: 0.6rem 0.85rem; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box; }
          .field input:focus, .field textarea:focus, .field select:focus { border-color: #3b82f6; }
          .field input::placeholder, .field textarea::placeholder { color: #334155; }
          .field textarea { resize: vertical; min-height: 90px; line-height: 1.5; }
          .field select { appearance: none; cursor: pointer; }
          .skills-input-row { display: flex; gap: 0.5rem; }
          .skills-input-row input { flex: 1; }
          .btn-add { background: #3b82f6; border: none; border-radius: 8px; color: white; font-size: 0.8rem; font-weight: 600; padding: 0 1rem; cursor: pointer; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
          .skills-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
          .skill-tag { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); color: #3b82f6; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; display: flex; align-items: center; gap: 0.4rem; }
          .skill-tag button { background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 0.9rem; padding: 0; line-height: 1; opacity: 0.7; }
          .skill-tag button:hover { opacity: 1; }
          .cert-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
          .cert-item { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; }
          .cert-item-info { display: flex; flex-direction: column; gap: 0.15rem; }
          .cert-item-name { color: #f1f5f9; font-weight: 500; }
          .cert-item-sub { color: #475569; font-size: 0.72rem; }
          .cert-remove { background: none; border: none; color: #475569; cursor: pointer; font-size: 1rem; padding: 0.2rem; }
          .cert-remove:hover { color: #ef4444; }
          .cert-add-row { display: grid; grid-template-columns: 2fr 1.5fr 0.8fr auto; gap: 0.5rem; align-items: end; }
          @media (max-width: 600px) { .cert-add-row { grid-template-columns: 1fr 1fr; } }
          .resume-upload-area { border: 2px dashed #334155; border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s; background: #0f172a; }
          .resume-upload-area:hover { border-color: #3b82f6; background: rgba(59,130,246,0.04); }
          .resume-upload-area.has-file { border-color: #22c55e; background: rgba(34,197,94,0.04); }
          .resume-icon { font-size: 2rem; margin-bottom: 0.5rem; }
          .resume-upload-text { color: #64748b; font-size: 0.85rem; }
          .resume-upload-text strong { color: #3b82f6; }
          .resume-filename { color: #22c55e; font-weight: 600; font-size: 0.85rem; margin-top: 0.25rem; }
          .save-btn { width: 100%; background: #3b82f6; border: none; border-radius: 12px; color: white; font-size: 0.95rem; font-weight: 700; padding: 0.85rem; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; }
          .save-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
          .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          .save-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                {form.profilePicture ? (
                  <img src={form.profilePicture} alt="Profile" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <button
                className="profile-avatar-btn"
                onClick={() => avatarInputRef.current?.click()}
                title="Change photo"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="profile-header-info">
              <h1>{form.fullName || "Your Profile"}</h1>
              <p>Complete your profile to boost your AI Match Score</p>
              <div className="profile-score">
                🎯 {form.skills.length} skills · {form.experienceYears} yrs exp
                · {form.certifications.length} certs
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="profile-card">
            <p className="section-title">Basic Information</p>
            <div className="form-grid">
              <div className="form-grid-2">
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Chinnegowlla Devendra Prasad"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>Bio / Summary</label>
                <textarea
                  placeholder="A short summary about yourself — your experience, what you're looking for..."
                  value={form.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Bengaluru, Karnataka"
                    value={form.location}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, location: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Notice Period / Availability</label>
                  <select
                    value={form.noticePeriod}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, noticePeriod: e.target.value }))
                    }
                  >
                    <option value="">Select availability</option>
                    <option value="Immediate">Immediate joiner</option>
                    <option value="15 days">15 days notice</option>
                    <option value="30 days">30 days notice</option>
                    <option value="60 days">60 days notice</option>
                    <option value="90 days">90 days notice</option>
                    <option value="Currently employed">
                      Currently employed
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="profile-card">
            <p className="section-title">Education</p>
            <div className="form-grid">
              <div className="form-grid-2">
                <div className="field">
                  <label>College / University</label>
                  <input
                    type="text"
                    placeholder="e.g. JNTU Hyderabad"
                    value={form.college}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, college: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Degree &amp; Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={form.degree}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, degree: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Graduation Year</label>
                  <select
                    value={form.graduationYear}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, graduationYear: e.target.value }))
                    }
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={form.experienceYears}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        experienceYears: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="profile-card">
            <p className="section-title">Skills</p>
            <div className="skills-input-row">
              <input
                type="text"
                placeholder="Type a skill and press Enter (e.g. React, Java, SQL)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "0.875rem",
                  padding: "0.6rem 0.85rem",
                  outline: "none",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />
              <button className="btn-add" onClick={addSkill}>
                + Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="skills-tags">
                {form.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="profile-card">
            <p className="section-title">Certifications</p>
            {form.certifications.length > 0 && (
              <div className="cert-list">
                {form.certifications.map((cert, i) => (
                  <div key={i} className="cert-item">
                    <div className="cert-item-info">
                      <span className="cert-item-name">🏆 {cert.name}</span>
                      <span className="cert-item-sub">
                        {cert.issuer}
                        {cert.year ? ` · ${cert.year}` : ""}
                      </span>
                    </div>
                    <button
                      className="cert-remove"
                      onClick={() => removeCert(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="cert-add-row">
              <div className="field">
                <label>Certification Name</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Solutions Architect"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Issuer</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon"
                  value={newCert.issuer}
                  onChange={(e) =>
                    setNewCert((p) => ({ ...p, issuer: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Year</label>
                <input
                  type="text"
                  placeholder="2024"
                  value={newCert.year}
                  onChange={(e) =>
                    setNewCert((p) => ({ ...p, year: e.target.value }))
                  }
                />
              </div>
              <button
                className="btn-add"
                style={{ height: "38px", marginTop: "auto" }}
                onClick={addCert}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="profile-card">
            <p className="section-title">Links &amp; Social</p>
            <div className="form-grid">
              <div className="form-grid-2">
                <div className="field">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={form.linkedinUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, linkedinUrl: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourname"
                    value={form.githubUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, githubUrl: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>Portfolio Website</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={form.portfolioUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, portfolioUrl: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="profile-card">
            <p className="section-title">Default Resume</p>
            <p
              style={{
                color: "#475569",
                fontSize: "0.8rem",
                marginTop: "-0.5rem",
                marginBottom: "1rem",
              }}
            >
              Upload your default resume — it will auto-fill when you apply to
              jobs
            </p>
            <div
              className={`resume-upload-area ${form.resumeUrl ? "has-file" : ""}`}
              onClick={() => resumeInputRef.current?.click()}
            >
              <div className="resume-icon">{form.resumeUrl ? "✅" : "📄"}</div>
              {form.resumeUrl ? (
                <div className="resume-filename">
                  Resume uploaded — click to change
                </div>
              ) : (
                <div className="resume-upload-text">
                  <strong>Click to upload</strong> your resume PDF
                  <br />
                  Max 5MB · PDF only
                </div>
              )}
            </div>
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleResumeUpload}
            />
          </div>

          {/* Save */}
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="save-spinner" /> Saving...
              </>
            ) : (
              "💾 Save Profile"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
