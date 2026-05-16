package com.jobportal.backend.dto.request;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String fullName;
    private String bio;
    private String skills;         // comma-separated: "Java,Spring,React"
    private Integer experienceYears;
    private String location;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
}