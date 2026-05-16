package com.jobportal.backend.service.auth.job;

import com.jobportal.backend.domain.user.User;
import com.jobportal.backend.domain.user.job.Job;
import com.jobportal.backend.domain.user.job.JobStatus;
import com.jobportal.backend.dto.request.CreateJobRequest;
import com.jobportal.backend.dto.response.JobResponse;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobResponse createJob(CreateJobRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String slug = generateSlug(request.getTitle());

        Job job = Job.builder()
                .recruiter(recruiter)
                .title(request.getTitle())
                .companyName(request.getCompanyName())
                .slug(slug)
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .skillsRequired(request.getSkillsRequired())
                .jobType(request.getJobType())
                .experienceMin(request.getExperienceMin())
                .experienceMax(request.getExperienceMax())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation())
                .isRemote(request.isRemote())
                .status(JobStatus.ACTIVE)
                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                .build();

        jobRepository.save(job);
        return mapToResponse(job);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> getActiveJobs(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, sortBy));
        return jobRepository.findByStatus(JobStatus.ACTIVE, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public JobResponse getJobById(UUID id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.incrementViews(id);
        return mapToResponse(job);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> getMyJobs(int page, int size) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return jobRepository.findByRecruiterId(recruiter.getId(), pageable)
                .map(this::mapToResponse);
    }

    public JobResponse updateJobStatus(UUID id, JobStatus status, String note) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(status);
        job.setModerationNote(note);
        jobRepository.save(job);
        return mapToResponse(job);
    }

    public void deleteJob(UUID id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
    }

    private String generateSlug(String title) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        return base + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private JobResponse mapToResponse(Job job) {
        // companyName: use stored value or fall back to recruiter email
        String company = (job.getCompanyName() != null && !job.getCompanyName().isBlank())
                ? job.getCompanyName()
                : job.getRecruiter().getEmail();

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(company)
                .slug(job.getSlug())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .skillsRequired(job.getSkillsRequired())
                .jobType(job.getJobType())
                .experienceMin(job.getExperienceMin())
                .experienceMax(job.getExperienceMax())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .isRemote(job.isRemote())
                .status(job.getStatus())
                .viewsCount(job.getViewsCount())
                .applicationsCount(job.getApplicationsCount())
                .recruiterName(job.getRecruiter().getEmail())
                .recruiterEmail(job.getRecruiter().getEmail())
                .createdAt(job.getCreatedAt())
                .expiresAt(job.getExpiresAt())
                .build();
    }
}