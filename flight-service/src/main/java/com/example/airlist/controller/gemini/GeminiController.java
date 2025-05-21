package com.example.airlist.controller.gemini;


import com.example.airlist.service.api.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService){
        this.geminiService =geminiService;
    }

    @GetMapping("/summary")
    public ResponseEntity<String> getSummary(@RequestParam String city){
        String propmt = city + "를 여행할떄 유의할 점이나 문화 , 행사, 팁을 요약해줘. 한국인을 위한 설명을 좀더해줘";
        String result = geminiService.requestGemini(propmt);
        return ResponseEntity.ok(result);
    }
}


