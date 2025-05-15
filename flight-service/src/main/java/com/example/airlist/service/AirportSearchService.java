package com.example.airlist.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.airlist.entity.AirportDocument;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AirportSearchService {

    private final ElasticsearchClient esClient;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public List<Map<String, String>> autocomplete(String keyword) throws IOException {
        String key = "airport::autocomplete::" + keyword;

        // 1. Redis 캐시 확인
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
           try {
               return objectMapper.convertValue(
                       cached,
                       new TypeReference<List<Map<String, String>>>() {}
               );
           } catch (IllegalArgumentException e) {
               redisTemplate.delete(key);
               System.out.println("캐시 역직렬화 실패, 삭재함:" + key);
           }

        }

        // 2. ES 검색
        SearchResponse<AirportDocument> response = esClient.search(s -> s
                        .index("airports")
                        .query(q -> q
                                .match(m -> m
                                        .field("nameKo")
                                        .query(keyword)
                                )
                        )
                        .size(10),
                AirportDocument.class);

        List<Map<String, String>> result = new ArrayList<>();
        for (AirportDocument doc : response.hits().hits().stream().map(Hit::source).filter(Objects::nonNull).toList()) {
            System.out.println("공항: " + doc.getNameKo() + " / 코드: " + doc.getCode());
            result.add(Map.of(
                    "nameKo", doc.getNameKo(),
                    "code", doc.getCode()
            ));
        }


        // 3. 캐시에 저장 (TTL 5분)
        redisTemplate.opsForValue().set(key, result, Duration.ofMinutes(5));

        return result;
    }
}
