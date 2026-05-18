package com.jobportal.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private static final String GEMINI_API_KEY = "AIzaSyBwlpqHOY1HnyQSGlv1Au7bybKwK3vnIFg";
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build conversation history for Gemini
            List<Map<String, Object>> messages = (List<Map<String, Object>>) request.get("messages");
            List<Map<String, Object>> contents = new ArrayList<>();

            // Add system context as first user message
            Map<String, Object> systemPart = new HashMap<>();
            systemPart.put("text", "You are DevBot, the helpful AI assistant for DevConnect Careers - a job portal connecting developers with top tech companies in India. Help candidates find jobs, give career advice for freshers and experienced developers, and answer questions about DevConnect. Be friendly, brief and practical. Keep responses under 150 words.");
            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("role", "user");
            systemContent.put("parts", List.of(systemPart));
            contents.add(systemContent);

            // Add model acknowledgment
            Map<String, Object> ackPart = new HashMap<>();
            ackPart.put("text", "Understood! I am DevBot, ready to help with jobs and career advice.");
            Map<String, Object> ackContent = new HashMap<>();
            ackContent.put("role", "model");
            ackContent.put("parts", List.of(ackPart));
            contents.add(ackContent);

            // Add conversation messages
            if (messages != null) {
                for (Map<String, Object> msg : messages) {
                    String role = (String) msg.get("role");
                    String content = (String) msg.get("content");
                    Map<String, Object> part = new HashMap<>();
                    part.put("text", content);
                    Map<String, Object> geminiMsg = new HashMap<>();
                    geminiMsg.put("role", "assistant".equals(role) ? "model" : "user");
                    geminiMsg.put("parts", List.of(part));
                    contents.add(geminiMsg);
                }
            }

            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);

            // Extract text from Gemini response
            Map responseBody = response.getBody();
            List candidates = (List) responseBody.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String text = (String) firstPart.get("text");

            // Return in Anthropic-compatible format for frontend
            Map<String, Object> result = new HashMap<>();
            result.put("content", List.of(Map.of("type", "text", "text", text)));
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
