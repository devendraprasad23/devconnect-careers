package com.jobportal.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private static final String GEMINI_API_KEY = "AIzaSyBwlpqHOY1HnyQSGlv1Au7bybKwK3vnIFg";
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<Map<String, Object>> messages = (List<Map<String, Object>>) request.get("messages");
            List<Map<String, Object>> contents = new ArrayList<>();

            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("role", "user");
            systemContent.put("parts", List.of(Map.of("text", "You are DevBot, AI assistant for DevConnect Careers - a job portal for developers in India. Help with job search, career advice, resume tips. Be friendly and brief, max 150 words.")));
            contents.add(systemContent);

            Map<String, Object> ackContent = new HashMap<>();
            ackContent.put("role", "model");
            ackContent.put("parts", List.of(Map.of("text", "Got it! I am DevBot, ready to help.")));
            contents.add(ackContent);

            if (messages != null) {
                for (Map<String, Object> msg : messages) {
                    String role = (String) msg.get("role");
                    String content = (String) msg.get("content");
                    Map<String, Object> geminiMsg = new HashMap<>();
                    geminiMsg.put("role", "assistant".equals(role) ? "model" : "user");
                    geminiMsg.put("parts", List.of(Map.of("text", content)));
                    contents.add(geminiMsg);
                }
            }

            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);

            Map responseBody = response.getBody();
            List candidates = (List) responseBody.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String text = (String) firstPart.get("text");

            return ResponseEntity.ok(Map.of("content", List.of(Map.of("type", "text", "text", text))));

        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}