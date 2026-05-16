package com.jobportal.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {
    private UUID userId;
    private String email;
    private String role;
    private String fullName;
    private String bio;
    private List<String> skills;
    private Integer experienceYears;
    private String location;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
}