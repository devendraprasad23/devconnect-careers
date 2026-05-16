package com.jobportal.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ApplicationResponse {
    private UUID id;
    private UUID jobId;
    private String jobTitle;
    private String recruiterEmail;
    private String location;
    private String jobType;
    private String status;
    private String coverLetter;
    private String resumeUrl;
    private Integer matchScore;
    private String note;
    private Instant appliedAt;
    // Applicant info (for recruiter view)
    private String candidateEmail;
    private String candidateName;
    private Double salaryMin;
    private Double salaryMax;
}