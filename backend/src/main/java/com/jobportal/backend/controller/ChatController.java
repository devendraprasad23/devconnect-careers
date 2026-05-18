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
            body.put("model", "claude-3-5-sonnet-20241022");
            body.put("max_tokens", 1000);
            body.put("system", "You are DevBot, the helpful AI assistant for DevConnect Careers - a job portal connecting developers with top tech companies in India and globally. Help candidates find jobs, give career advice, and answer questions about DevConnect. Be friendly, brief and practical. Keep responses under 150 words.");
            body.put("messages", request.get("messages"));
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.anthropic.com/v1/messages",
                entity,
                Map.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
