import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  status: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
}

interface Application {
  id: string;
  jobTitle: string;
  candidateEmail: string;
  candidateName: string;
  coverLetter: string;
  resumeUrl: string;
  matchScore: number;
  status: string;
  note: string;
  appliedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-400",
  PENDING: "bg-yellow-500/10 text-yellow-400",
  CLOSED: "bg-slate-500/10 text-slate-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

const APP_STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-400",
  REVIEWED: "bg-purple-500/10 text-purple-400",
  SHORTLISTED: "bg-green-500/10 text-green-400",
  INTERVIEW: "bg-yellow-500/10 text-yellow-400",
  OFFERED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  WITHDRAWN: "bg-slate-500/10 text-slate-400",
};

const APP_STATUSES = [
  "REVIEWED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "REJECTED",
];

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/jobs/my")
      .then((res) => setJobs(res.data.data?.content || res.data.data || []))
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const loadApplications = async (job: Job) => {
    setSelectedJob(job);
    setApplications([]);
    setExpandedApp(null);
    setAppsLoading(true);
    try {
      const res = await api.get(`/applications/jobs/${job.id}?page=0&size=50`);
      const data = res.data.data?.content ?? res.data.data ?? [];
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setAppsLoading(false);
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status?status=${status}`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a)),
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const downloadResume = (resumeUrl: string, email: string) => {
    // resumeUrl is base64 data URL — create a download link
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `resume_${email.split("@")[0]}.pdf`;
    link.click();
  };

  const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);
  const totalApps = jobs.reduce(
    (sum, j) => sum + (j.applicationsCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-6xl mx-auto px-4 py-10" style={{ paddingTop: 90 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Recruiter Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Manage your job postings</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary">
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Jobs", value: jobs.length, icon: "💼" },
            { label: "Total Views", value: totalViews, icon: "👁" },
            { label: "Applications", value: totalApps, icon: "📋" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs list */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">Your Jobs</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card animate-pulse h-24" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-slate-500 mb-4">No jobs posted yet</p>
                <Link
                  to="/recruiter/post-job"
                  className="btn-primary inline-block"
                >
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => loadApplications(job)}
                    className={`card cursor-pointer transition-all duration-200 ${selectedJob?.id === job.id ? "border-blue-500" : "hover:border-slate-600"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-medium">
                            {job.title}
                          </h3>
                          <span
                            className={`badge text-xs ${STATUS_COLORS[job.status] || "bg-slate-700 text-slate-300"}`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">
                          📍 {job.location}
                        </p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>👁 {job.viewsCount} views</span>
                          <span>📋 {job.applicationsCount} applications</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(job.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm ml-3 transition-colors flex-shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicants panel */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              {selectedJob
                ? `Applicants — ${selectedJob.title}`
                : "Select a job to view applicants"}
            </h2>

            {!selectedJob ? (
              <div className="card text-center py-12">
                <p className="text-slate-500">
                  Click on a job to view its applicants
                </p>
              </div>
            ) : appsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card animate-pulse h-20" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-slate-500">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="card">
                    {/* Header row */}
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedApp(expandedApp === app.id ? null : app.id)
                      }
                    >
                      <div>
                        <p className="text-white font-medium text-sm">
                          {app.candidateName &&
                          app.candidateName !== app.candidateEmail
                            ? app.candidateName
                            : app.candidateEmail}
                        </p>
                        {app.candidateName &&
                          app.candidateName !== app.candidateEmail && (
                            <p className="text-slate-500 text-xs">
                              {app.candidateEmail}
                            </p>
                          )}
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`badge text-xs ${APP_STATUS_COLORS[app.status] || ""}`}
                          >
                            {app.status}
                          </span>
                          <span className="text-slate-500 text-xs">
                            Match: {Number(app.matchScore).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs mt-1">
                        {expandedApp === app.id ? "▲" : "▼"}
                      </span>
                    </div>

                    {/* Expanded details */}
                    {expandedApp === app.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        {/* Match score bar */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-slate-500 text-xs w-20 flex-shrink-0">
                            AI Match
                          </span>
                          <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(Number(app.matchScore), 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-blue-400 text-xs">
                            {Number(app.matchScore).toFixed(0)}%
                          </span>
                        </div>

                        {/* Cover letter */}
                        {app.coverLetter && (
                          <div className="bg-slate-800 rounded-lg p-3 mb-3">
                            <p className="text-slate-400 text-xs font-medium mb-1">
                              Cover Letter
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Resume download */}
                        {app.resumeUrl && (
                          <button
                            onClick={() =>
                              downloadResume(app.resumeUrl, app.candidateEmail)
                            }
                            className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 mb-3 transition-colors"
                          >
                            <span>📄</span>
                            <span>Download Resume</span>
                          </button>
                        )}

                        {/* Applied date */}
                        <p className="text-slate-600 text-xs mb-3">
                          Applied:{" "}
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
                        </p>

                        {/* Status buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {APP_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateAppStatus(app.id, s)}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                                app.status === s
                                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                                  : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
