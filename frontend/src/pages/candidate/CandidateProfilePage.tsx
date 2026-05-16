import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Profile {
  fullName: string;
  bio: string;
  skills: string;
  experienceYears: number;
  location: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
}

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    bio: "",
    skills: "",
    experienceYears: 0,
    location: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>([]);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          setProfile({
            fullName: d.fullName ?? "",
            bio: d.bio ?? "",
            skills: Array.isArray(d.skills)
              ? d.skills.join(", ")
              : (d.skills ?? ""),
            experienceYears: d.experienceYears ?? 0,
            location: d.location ?? "",
            phone: d.phone ?? "",
            linkedinUrl: d.linkedinUrl ?? "",
            githubUrl: d.githubUrl ?? "",
          });
          setSkillTags(Array.isArray(d.skills) ? d.skills.filter(Boolean) : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skillTags.includes(s)) {
      const updated = [...skillTags, s];
      setSkillTags(updated);
      setProfile((p) => ({ ...p, skills: updated.join(", ") }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    const updated = skillTags.filter((s) => s !== skill);
    setSkillTags(updated);
    setProfile((p) => ({ ...p, skills: updated.join(", ") }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/users/me", {
        ...profile,
        skills: skillTags.join(","),
        experienceYears: Number(profile.experienceYears),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    background: "#1e293b",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "var(--text-secondary)",
    fontSize: 13,
    fontWeight: 500,
    display: "block",
    marginBottom: 6,
  };

  if (loading) {
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
        <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            My Profile
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Complete your profile to improve your AI Match Score on job
            applications.
          </p>
        </div>

        {/* Match score hint */}
        <div
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>💡</span>
          <p style={{ color: "#a5b4fc", fontSize: 14, lineHeight: 1.5 }}>
            Adding your skills and experience years increases your AI Match
            Score on job applications. Recruiters sort applicants by match score
            — a higher score gets you noticed first.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            border: "1px solid var(--border-color)",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              value={profile.fullName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, fullName: e.target.value }))
              }
              placeholder="e.g. Rahul Sharma"
              style={inputStyle}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio / Summary</label>
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              placeholder="A short summary about yourself — your experience, what you're looking for..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

          {/* Skills */}
          <div>
            <label style={labelStyle}>Skills</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter (e.g. React, Java, SQL)"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addSkill}
                style={{
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "var(--accent)",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                + Add
              </button>
            </div>
            {skillTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skillTags.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "rgba(99,102,241,0.15)",
                      color: "#818cf8",
                      border: "1px solid rgba(99,102,241,0.3)",
                      fontSize: 13,
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#818cf8",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: 14,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience + Location row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <label style={labelStyle}>Experience (years)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={profile.experienceYears}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    experienceYears: Number(e.target.value),
                  }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="e.g. Bengaluru, Karnataka"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+91 98765 43210"
              style={inputStyle}
            />
          </div>

          {/* LinkedIn + GitHub */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input
                value={profile.linkedinUrl}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, linkedinUrl: e.target.value }))
                }
                placeholder="https://linkedin.com/in/..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input
                value={profile.githubUrl}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
                style={inputStyle}
              />
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "14px",
              borderRadius: 10,
              background: saved
                ? "rgba(34,197,94,0.8)"
                : saving
                  ? "rgba(99,102,241,0.5)"
                  : "var(--accent)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {saved ? "✓ Profile Saved!" : saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
