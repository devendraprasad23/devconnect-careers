package com.jobportal.backend.controller;

import com.jobportal.backend.domain.user.User;
import com.jobportal.backend.dto.request.UserProfileRequest;
import com.jobportal.backend.dto.response.ApiResponse;
import com.jobportal.backend.dto.response.UserProfileResponse;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", mapToResponse(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @RequestBody UserProfileRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getSkills() != null) user.setSkills(String.join(",", request.getSkills()));
        if (request.getExperienceYears() != null) user.setExperienceYears(request.getExperienceYears());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getGithubUrl() != null) user.setGithubUrl(request.getGithubUrl());
        if (request.getPortfolioUrl() != null) user.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getGraduationYear() != null) user.setGraduationYear(request.getGraduationYear());
        if (request.getNoticePeriod() != null) user.setNoticePeriod(request.getNoticePeriod());
        if (request.getCertifications() != null) user.setCertifications(request.getCertifications());
        if (request.getResumeUrl() != null) user.setResumeUrl(request.getResumeUrl());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", mapToResponse(user)));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserProfileResponse mapToResponse(User user) {
        List<String> skills = (user.getSkills() != null && !user.getSkills().isBlank())
                ? Arrays.asList(user.getSkills().split(","))
                : List.of();

        return UserProfileResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .skills(skills)
                .experienceYears(user.getExperienceYears())
                .location(user.getLocation())
                .phone(user.getPhone())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .portfolioUrl(user.getPortfolioUrl())
                .college(user.getCollege())
                .degree(user.getDegree())
                .graduationYear(user.getGraduationYear())
                .noticePeriod(user.getNoticePeriod())
                .certifications(user.getCertifications())
                .resumeUrl(user.getResumeUrl())
                .profilePicture(user.getProfilePicture())
                .build();
    }
}