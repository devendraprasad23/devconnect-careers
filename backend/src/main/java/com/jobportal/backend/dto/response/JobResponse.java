package com.jobportal.backend.dto.response;

import com.jobportal.backend.domain.user.job.JobStatus;
import com.jobportal.backend.domain.user.job.JobType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class JobResponse {
    private UUID id;
    private String title;
    private String companyName;
    private String slug;
    private String description;
    private String requirements;
    private List<String> skillsRequired;
    private JobType jobType;
    private Integer experienceMin;
    private Integer experienceMax;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private boolean isRemote;
    private JobStatus status;
    private Integer viewsCount;
    private Integer applicationsCount;
    private String recruiterName;
    private String recruiterEmail;
    private Instant createdAt;
    private Instant expiresAt;
}