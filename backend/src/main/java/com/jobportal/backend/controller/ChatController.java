package com.jobportal.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    @Value("${anthropic.api-key:}")
    private String anthropicApiKey;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = new HashMap<>();
            body.put("model", "claude-sonnet-4-20250514");
            body.put("max_tokens", 1000);
            body.put("system", "You are DevBot, the helpful AI assistant for DevConnect Careers — a job portal connecting developers with top tech companies in India and globally.\n\nYour role:\n- Help candidates find suitable jobs\n- Give career advice for freshers and experienced developers\n- Answer questions about how DevConnect works\n- Be encouraging, concise, and practical\n\nTone: Friendly, professional, brief. Keep responses under 150 words unless asked for detail.");
            body.put("messages", request.get("messages"));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.anthropic.com/v1/messages",
                    entity,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Chat service unavailable"));
        }
    }
}