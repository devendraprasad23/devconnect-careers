package com.jobportal.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private static final String GEMINI_API_KEY = "AIzaSyBwlpqHOY1HnyQSGlv1Au7bybKwK3vnIFg";
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            List<Map<String, Object>> messages = (List<Map<String, Object>>) request.get("messages");
            List<Map<String, Object>> contents = new ArrayList<>();
            contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", "You are DevBot, AI assistant for DevConnect Careers. Help with job search and career advice. Be friendly and brief."))));
            contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "Got it! I am DevBot, ready to help."))));
            if (messages != null) {
                for (Map<String, Object> msg : messages) {
                    String role = (String) msg.get("role");
                    String content = (String) msg.get("content");
                    contents.add(Map.of("role", "assistant".equals(role) ? "model" : "user", "parts", List.of(Map.of("text", content))));
                }
            }
            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);
            Map responseBody = response.getBody();
            List candidates = (List) responseBody.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map contentMap = (Map) firstCandidate.get("content");
            List parts = (List) contentMap.get("parts");
            String text = (String) ((Map) parts.get(0)).get("text");
            return ResponseEntity.ok(Map.of("content", List.of(Map.of("type", "text", "text", text))));
        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}