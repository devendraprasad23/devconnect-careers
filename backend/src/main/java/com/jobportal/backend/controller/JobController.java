package com.jobportal.backend.controller;

import com.jobportal.backend.domain.user.job.JobStatus;
import com.jobportal.backend.dto.request.CreateJobRequest;
import com.jobportal.backend.dto.response.ApiResponse;
import com.jobportal.backend.dto.response.JobResponse;
import com.jobportal.backend.service.auth.job.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody CreateJobRequest request) {
        JobResponse response = jobService.createJob(request);
        return ResponseEntity.ok(
                ApiResponse.success("Job created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getActiveJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Page<JobResponse> jobs = jobService.getActiveJobs(page, size, sortBy);
        return ResponseEntity.ok(
                ApiResponse.success("Jobs retrieved", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable UUID id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Job retrieved", job));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<JobResponse> jobs = jobService.getMyJobs(page, size);
        return ResponseEntity.ok(
                ApiResponse.success("Your jobs retrieved", jobs));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam JobStatus status,
            @RequestParam(required = false) String note) {
        JobResponse job = jobService.updateJobStatus(id, status, note);
        return ResponseEntity.ok(
                ApiResponse.success("Job status updated", job));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable UUID id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(
                ApiResponse.success("Job deleted", null));
    }
}