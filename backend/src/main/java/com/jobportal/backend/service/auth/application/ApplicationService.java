package com.jobportal.backend.service.auth.application;

import com.jobportal.backend.domain.user.User;
import com.jobportal.backend.domain.user.application.Application;
import com.jobportal.backend.domain.user.application.ApplicationStatus;
import com.jobportal.backend.domain.user.job.Job;
import com.jobportal.backend.dto.request.ApplyJobRequest;
import com.jobportal.backend.dto.response.ApplicationResponse;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // ── called by ApplicationController: applyToJob(jobId, request) ──
    @Transactional
    public ApplicationResponse applyToJob(UUID jobId, ApplyJobRequest request) {
        User candidate = currentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new RuntimeException("Already applied to this job");
        }

        int matchScore = calculateMatchScore(candidate, job);

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl())
                .matchScore(matchScore)
                .build();

        applicationRepository.save(application);

        // increment applications count on job
        job.setApplicationsCount(job.getApplicationsCount() + 1);
        jobRepository.save(job);

        return toResponse(application);
    }

    // ── called by ApplicationController: getMyApplications(page, size) ──
    public Page<ApplicationResponse> getMyApplications(int page, int size) {
        User candidate = currentUser();
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return applicationRepository.findByCandidateId(candidate.getId(), pageable)
                .map(this::toResponse);
    }

    // ── called by ApplicationController: getJobApplications(jobId, page, size) ──
    public Page<ApplicationResponse> getJobApplications(UUID jobId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("matchScore").descending());
        return applicationRepository.findByJobId(jobId, pageable)
                .map(this::toResponse);
    }

    // ── called by ApplicationController: updateStatus(id, status, note) ──
    @Transactional
    public ApplicationResponse updateStatus(UUID applicationId, ApplicationStatus status, String note) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        if (note != null) application.setNote(note);
        applicationRepository.save(application);

        return toResponse(application);
    }

    // ── called by ApplicationController: withdraw(id) ──
    @Transactional
    public ApplicationResponse withdraw(UUID applicationId) {
        User candidate = currentUser();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("Not authorized");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);

        // decrement count
        Job job = application.getJob();
        if (job.getApplicationsCount() > 0) {
            job.setApplicationsCount(job.getApplicationsCount() - 1);
            jobRepository.save(job);
        }

        return toResponse(application);
    }

    // ── helpers ──

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private int calculateMatchScore(User candidate, Job job) {
        if (candidate.getSkills() == null || candidate.getSkills().isBlank()) return 5;
        if (job.getSkillsRequired() == null || job.getSkillsRequired().isEmpty()) return 50;

        List<String> candidateSkills = Arrays.stream(candidate.getSkills().split(","))
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toList());

        List<String> jobSkills = job.getSkillsRequired().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        long matched = jobSkills.stream()
                .filter(skill -> candidateSkills.stream()
                        .anyMatch(cs -> cs.contains(skill) || skill.contains(cs)))
                .count();

        int skillScore = (int) ((matched * 100.0) / jobSkills.size());

        // Experience bonus — Job uses experienceMin field
        int expBonus = 0;
        if (candidate.getExperienceYears() != null && job.getExperienceMin() != null) {
            if (candidate.getExperienceYears() >= job.getExperienceMin()) expBonus = 10;
        }

        return Math.min(100, skillScore + expBonus);
    }

    private ApplicationResponse toResponse(Application app) {
        Job job = app.getJob();
        User candidate = app.getCandidate();

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .recruiterEmail(job.getRecruiter() != null ? job.getRecruiter().getEmail() : null)
                .location(job.getLocation())
                .jobType(job.getJobType() != null ? job.getJobType().name() : null)
                .status(app.getStatus().name())
                .coverLetter(app.getCoverLetter())
                .resumeUrl(app.getResumeUrl())
                .matchScore(app.getMatchScore())
                .note(app.getNote())
                .appliedAt(app.getAppliedAt())
                .candidateEmail(candidate.getEmail())
                .candidateName(candidate.getFullName() != null ? candidate.getFullName() : candidate.getEmail())
                .salaryMin(job.getSalaryMin() != null ? job.getSalaryMin().doubleValue() : null)
                .salaryMax(job.getSalaryMax() != null ? job.getSalaryMax().doubleValue() : null)
                .build();
    }
}