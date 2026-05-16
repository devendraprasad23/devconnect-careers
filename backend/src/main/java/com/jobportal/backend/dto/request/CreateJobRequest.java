package com.jobportal.backend.dto.request;

import com.jobportal.backend.domain.user.job.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String companyName;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;
    private List<String> skillsRequired;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private Integer experienceMin = 0;
    private Integer experienceMax;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private boolean isRemote = false;
}