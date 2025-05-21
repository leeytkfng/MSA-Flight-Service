// GeminiService.java
package com.example.airlist.service.api;

import com.example.airlist.config.WebClientConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService {

    @Value("${gcp.gemini.api-key}")
    private String apikey;

    private final WebClient geminiWebClient;

    public GeminiService(WebClient geminiWebClient) {
        this.geminiWebClient = geminiWebClient;
    }

    public String requestGemini(String prompt) {
        String requestJson = """
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """.formatted(prompt);

        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apikey).build())
                .bodyValue(requestJson)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}


