package com.jobportal.backend.controller;

import com.jobportal.backend.domain.user.application.ApplicationStatus;
import com.jobportal.backend.dto.request.ApplyJobRequest;
import com.jobportal.backend.dto.response.ApiResponse;
import com.jobportal.backend.dto.response.ApplicationResponse;
import com.jobportal.backend.service.auth.application.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @PathVariable UUID jobId,
            @RequestBody ApplyJobRequest request) {
        ApplicationResponse response = applicationService.applyToJob(jobId, request);
        return ResponseEntity.ok(
                ApiResponse.success("Applied successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> myApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Applications retrieved",
                        applicationService.getMyApplications(page, size)));
    }

    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> jobApplications(
            @PathVariable UUID jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success("Applicants retrieved",
                        applicationService.getJobApplications(jobId, page, size)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated",
                        applicationService.updateStatus(id, status, note)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdraw(
            @PathVariable UUID id) {
        return ResponseEntity.ok(
                ApiResponse.success("Application withdrawn",
                        applicationService.withdraw(id)));
    }
}