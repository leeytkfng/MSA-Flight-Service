//package com.example.airlist.config;
//
//import com.example.airlist.entity.*;
//import com.example.airlist.repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class DummyFlightDataLoader implements CommandLineRunner {
//
//    private final AirPortRepository airportRepository;
//    private final AirCraftRepository airCraftRepository;
//    private final FlightInfoRepository flightInfoRepository;
//
//    private static final int TOTAL_COUNT = 100_000;
//    private static final int BATCH_SIZE = 1000;
//
//    private final Random random = new Random();
//
//    @Override
//    public void run(String... args) throws Exception {
//        List<Airport> departureAirports = airportRepository.findByCodeIn(List.of("ICN", "GMP"));
//        List<Airport> arrivalAirports = airportRepository.findByContinentNot("korea");
//        List<AirCraft> airCrafts = airCraftRepository.findAll();
//
//        if (departureAirports.isEmpty() || arrivalAirports.isEmpty() || airCrafts.isEmpty()) {
//            log.warn("⚠️ 더미 데이터 생성을 위한 데이터가 부족합니다.");
//            return;
//        }
//
//        List<Flight_info> batch = new ArrayList<>();
//
//        for (int i = 0; i < TOTAL_COUNT; i++) {
//            Airport departure = getRandom(departureAirports);
//            Airport arrival = getRandom(arrivalAirports);
//            AirCraft aircraft = getRandom(airCrafts);
//
//            LocalDateTime departureTime = LocalDateTime.now()
//                    .plusDays(random.nextInt(30))  // 30일 이내
//                    .withHour(6 + random.nextInt(15))  // 6~20시
//                    .withMinute(0);
//
//            LocalDateTime arrivalTime = departureTime.plusHours(4 + random.nextInt(10));  // 비행시간 4~13시간
//
//            Flight_info flight = new Flight_info();
//            flight.setDeparture(departure);
//            flight.setArrival(arrival);
//            flight.setAircraft(aircraft);
//            flight.setDepartureTime(departureTime);
//            flight.setArrivalTime(arrivalTime);
//            flight.setSeatCount(80 + random.nextInt(150));  // 80~230
//
//            batch.add(flight);
//
//            // 1000개 단위 저장
//            if (batch.size() >= BATCH_SIZE) {
//                flightInfoRepository.saveAll(batch);
//                batch.clear();
//                log.info("✅ 1000개 저장 완료 ({}개 생성 중)", i + 1);
//            }
//        }
//
//        // 남은 항목 저장
//        if (!batch.isEmpty()) {
//            flightInfoRepository.saveAll(batch);
//            log.info("✅ 마지막 배치 저장 완료 (총 {}개)", TOTAL_COUNT);
//        }
//    }
//
//    private <T> T getRandom(List<T> list) {
//        return list.get(random.nextInt(list.size()));
//    }
//}
