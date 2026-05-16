import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

// ── Field components defined OUTSIDE PostJobPage ──────────────────────────────
// This is critical: if defined inside the parent component, React treats them
// as new component types on every render → unmounts/remounts on each keystroke
// → input loses focus. Defined outside = stable reference = no focus loss.

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <Field label={label} required={required}>
      <select
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface FormData {
  title: string;
  companyName: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  experienceMin: string;
  salaryMin: string;
  salaryMax: string;
  skills: string;
  openings: string;
  applicationDeadline: string;
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    title: "",
    companyName: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    experienceMin: "0",
    salaryMin: "",
    salaryMax: "",
    skills: "",
    openings: "1",
    applicationDeadline: "",
  });

  const set =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(form.salaryMin) > Number(form.salaryMax)) {
      toast.error("Minimum salary cannot exceed maximum salary");
      return;
    }

    setLoading(true);
    try {
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post("/jobs", {
        title: form.title,
        companyName: form.companyName,
        description: form.description,
        requirements: form.requirements,
        location: form.location,
        jobType: form.jobType,
        experienceMin: Number(form.experienceMin),
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        skills: skillsArray,
        openings: Number(form.openings),
        applicationDeadline: form.applicationDeadline || null,
      });

      toast.success("Job posted successfully!");
      navigate("/recruiter");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const jobTypeOptions = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
  ];

  const expOptions = Array.from({ length: 16 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? "Fresher (0 years)" : `${i}+ year${i > 1 ? "s" : ""}`,
  }));

  return (
    <>
      
      <div className="post-job-page">
        <style>{`
          .post-job-page {
            min-height: 100vh;
            background: #0f172a;
            padding: 2rem 1rem 4rem;
            font-family: 'Segoe UI', system-ui, sans-serif;
          }

          .post-job-container {
            max-width: 760px;
            margin: 0 auto;
          }

          .page-header {
            margin-bottom: 2rem;
          }

          .page-header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #f1f5f9;
            margin: 0 0 0.25rem;
          }

          .page-header p {
            color: #64748b;
            font-size: 0.9rem;
            margin: 0;
          }

          .form-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 2rem;
          }

          .section-title {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #3b82f6;
            margin: 0 0 1.25rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #1e3a5f;
          }

          .form-section {
            margin-bottom: 2rem;
          }

          .form-grid {
            display: grid;
            gap: 1.25rem;
          }

          .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }

          .form-grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.25rem;
          }

          @media (max-width: 600px) {
            .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
            .form-card { padding: 1.25rem; }
          }

          .field-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .field-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #94a3b8;
            letter-spacing: 0.02em;
          }

          .required-star {
            color: #ef4444;
            margin-left: 2px;
          }

          .field-hint {
            font-size: 0.75rem;
            color: #475569;
            margin: 0;
          }

          .form-input {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #f1f5f9;
            font-size: 0.9rem;
            padding: 0.6rem 0.85rem;
            width: 100%;
            transition: border-color 0.15s, box-shadow 0.15s;
            outline: none;
            box-sizing: border-box;
            font-family: inherit;
          }

          .form-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
          }

          .form-input::placeholder {
            color: #475569;
          }

          textarea.form-input {
            resize: vertical;
            min-height: 110px;
            line-height: 1.5;
          }

          select.form-input {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.85rem center;
            padding-right: 2.5rem;
          }

          .salary-row {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 0.75rem;
            align-items: end;
          }

          .salary-sep {
            color: #475569;
            font-size: 0.9rem;
            padding-bottom: 0.7rem;
            text-align: center;
          }

          .input-prefix {
            position: relative;
          }

          .input-prefix span {
            position: absolute;
            left: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            font-size: 0.85rem;
            pointer-events: none;
          }

          .input-prefix .form-input {
            padding-left: 2rem;
          }

          .divider {
            border: none;
            border-top: 1px solid #1e293b;
            margin: 2rem 0;
          }

          .form-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            padding-top: 1.5rem;
            border-top: 1px solid #334155;
          }

          .btn-secondary {
            padding: 0.65rem 1.4rem;
            border-radius: 8px;
            border: 1px solid #334155;
            background: transparent;
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
          }

          .btn-secondary:hover {
            background: #1e293b;
            color: #f1f5f9;
          }

          .btn-primary {
            padding: 0.65rem 1.75rem;
            border-radius: 8px;
            border: none;
            background: #3b82f6;
            color: white;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-primary:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-1px);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <div className="post-job-container">
          <div className="page-header">
            <h1>Post a New Job</h1>
            <p>Fill in the details below to attract the right candidates</p>
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            {/* ── Basic Info ── */}
            <div className="form-section">
              <p className="section-title">Basic Information</p>
              <div className="form-grid">
                <div className="form-grid-2">
                  <Field label="Job Title" required>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. Senior Java Developer"
                      value={form.title}
                      onChange={set("title")}
                      required
                    />
                  </Field>
                  <Field label="Company Name" required>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. Infosys"
                      value={form.companyName}
                      onChange={set("companyName")}
                      required
                    />
                  </Field>
                </div>

                <div className="form-grid-2">
                  <Field label="Location" required>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. Bengaluru / Remote"
                      value={form.location}
                      onChange={set("location")}
                      required
                    />
                  </Field>
                  <SelectField
                    label="Job Type"
                    required
                    value={form.jobType}
                    onChange={(v) => setForm((p) => ({ ...p, jobType: v }))}
                    options={jobTypeOptions}
                  />
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="form-section">
              <p className="section-title">Job Details</p>
              <div className="form-grid">
                <Field label="Job Description" required>
                  <textarea
                    className="form-input"
                    placeholder="Describe the role, responsibilities, and what makes it exciting..."
                    value={form.description}
                    onChange={set("description")}
                    required
                    rows={5}
                  />
                </Field>
                <Field label="Requirements">
                  <textarea
                    className="form-input"
                    placeholder="List qualifications, must-haves, and nice-to-haves..."
                    value={form.requirements}
                    onChange={set("requirements")}
                    rows={4}
                  />
                </Field>
                <Field
                  label="Skills Required"
                  hint="Comma-separated — e.g. Java, Spring Boot, React, SQL"
                >
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Java, Spring Boot, React, MySQL"
                    value={form.skills}
                    onChange={set("skills")}
                  />
                </Field>
              </div>
            </div>

            {/* ── Compensation ── */}
            <div className="form-section">
              <p className="section-title">Compensation &amp; Experience</p>
              <div className="form-grid">
                <div className="form-grid-3">
                  <SelectField
                    label="Min Experience"
                    value={form.experienceMin}
                    onChange={(v) =>
                      setForm((p) => ({ ...p, experienceMin: v }))
                    }
                    options={expOptions}
                  />
                  <Field label="Min Salary (₹/yr)">
                    <div className="input-prefix">
                      <span>₹</span>
                      <input
                        className="form-input"
                        type="number"
                        min={0}
                        placeholder="300000"
                        value={form.salaryMin}
                        onChange={set("salaryMin")}
                      />
                    </div>
                  </Field>
                  <Field label="Max Salary (₹/yr)">
                    <div className="input-prefix">
                      <span>₹</span>
                      <input
                        className="form-input"
                        type="number"
                        min={0}
                        placeholder="700000"
                        value={form.salaryMax}
                        onChange={set("salaryMax")}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Additional ── */}
            <div className="form-section">
              <p className="section-title">Additional Details</p>
              <div className="form-grid-2">
                <Field label="Number of Openings">
                  <input
                    className="form-input"
                    type="number"
                    min={1}
                    max={999}
                    value={form.openings}
                    onChange={set("openings")}
                  />
                </Field>
                <Field label="Application Deadline">
                  <input
                    className="form-input"
                    type="date"
                    value={form.applicationDeadline}
                    onChange={set("applicationDeadline")}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Field>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/recruiter")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Posting…
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
