package com.example.airlist.service;

import com.example.airlist.dto.FlightDto;
import com.example.airlist.dto.FlightReservationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FlightKafkaProducer {

    private final KafkaTemplate<String, FlightReservationDto> kafkaTemplate;
    private final String topicName = "flight-topic";

    public void sendFlightData(FlightReservationDto flightReservationDto){
        kafkaTemplate.send(topicName, flightReservationDto);
        System.out.println("항공편 전송완료" + flightReservationDto.getReservationId());
    }
}
