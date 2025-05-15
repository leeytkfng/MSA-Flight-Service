package com.example.airlist.controller;

import com.example.airlist.service.AirportSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/autocomplete")
public class ModalSearchController {

    private final AirportSearchService flightSearch;

    @GetMapping
    public List<Map<String,String>> autocomplete(@RequestParam String keyword) throws IOException {
        System.out.println(keyword);
        return flightSearch.autocomplete(keyword);
    }
}
