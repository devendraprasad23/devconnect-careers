package com.jobportal.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileRequest {
    private String fullName;
    private String bio;
    private List<String> skills;
    private Integer experienceYears;
    private String location;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String college;
    private String degree;
    private String graduationYear;
    private String noticePeriod;
    private String certifications; // stored as JSON string
    private String resumeUrl;
    private String profilePicture;
}