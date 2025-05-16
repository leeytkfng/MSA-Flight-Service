import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../apiClient.jsx";

const FlightDetail1 = () =>  {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/api/flights/${id}`)
            .then((res) => setFlight(res.data))
            .catch((err) => console.error("항공편 정보 불러오기 실패", err));
    }, [id]);

    const handleReserve = async () => {
        try {
            await apiClient.post("/api/kafka/publish", flight);
            alert("예약이 완료되었습니다.");
            navigate("/loading");
        } catch (error) {
            console.error("Kafka 전송 실패", error);
            alert("예약 실패");
        }
    };

    if (!flight) return <p>로딩 중...</p>;

    return (
        <div className="flight-detail">
            <h2>{flight.departureName} → {flight.arrivalName}</h2>
            <p>출발: {flight.departureTime}</p>
            <p>도착: {flight.arrivalTime}</p>
            <p>기종: {flight.aircraftType}</p>
            <p>남은 좌석: {flight.seatCount}</p>

            <button onClick={handleReserve}>이 항공편 예약하기</button>
        </div>
    );
}

export default FlightDetail1;
