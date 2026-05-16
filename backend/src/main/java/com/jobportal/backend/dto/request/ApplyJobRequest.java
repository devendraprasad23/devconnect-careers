package com.jobportal.backend.dto.request;

import lombok.Data;

@Data
public class ApplyJobRequest {
    private String coverLetter;
    private String resumeUrl;   // base64 data URL
}