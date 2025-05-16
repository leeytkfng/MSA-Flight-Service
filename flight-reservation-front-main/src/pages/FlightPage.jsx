import { useEffect, useState } from "react";
import SearchFlight from "../components/SearchFlight.jsx";
import FlightList from "./FlightList.jsx";
import axios from "axios";
import MapWithPath from "../components/MapWithPath.jsx";
import "./FlightPage.css"
import GoogleMap from "../components/GoogleMap.jsx";
import apiClient from "../apiClient.jsx";
import {useNavigate} from "react-router-dom";

function FlightPage() {

    const [filters, setFilters] = useState(null);
    const [allFlights, setAllFlights] = useState([]);
    const [selectedFlights, setSelectedFlights] = useState([]);
    const navi = new useNavigate();

    const isLoggedIn = () => {
        const token = localStorage.getItem("accessToken");
        return !!token;
    }

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const res = await apiClient.get("/api/flights",{
                    params: {
                        page: 0,
                        size: 10,
                    },
                });
                setAllFlights(res.data);
                console.log(res);
            } catch (error) {
                console.error("초기 항공편 데이터 불러오기 실패", error);
            }
        };

        if (!filters) {
            fetchInitial();
        }
    }, [filters]);

    const handleSearch = (searchData) => {
        setFilters(searchData); // 상태 전달
    };

    const sendTokafka = async () =>{
        if (!isLoggedIn()) {
            alert("로그인이 필요합니다.");
            navi("/login"); // 또는 로그인 페이지로 이동
            return;
        }
        if (selectedFlights.length === 0) {
            alert("선택된 항공편이 없습니다.");
            return;
        }

        try {
            for (const flight of selectedFlights) {
                await apiClient.post("/api/kafka/publish" ,flight)
            }
            navi("/loading");
        } catch (error) {
            console.error("Kafka 전송실패:", error);
            alert("전송실패");
        }
    }

    const goToDetail = () => {
        if (!isLoggedIn()) {
            alert("로그인이 필요합니다.");
            navi("/login");
            return;
        }

        if (selectedFlights.length === 0) {
            alert("선택된 항공편이 없습니다.");
            return;
        }

        // 편도일 경우
        if (selectedFlights.length === 1) {
            navi(`/flight/${selectedFlights[0].id}`);
        }

        // 왕복일 경우는 선택사항: 쿼리스트링이나 상태(state)로 backFlight 넘길 수 있음
        else if (selectedFlights.length === 2) {
            navi(`/flight/${selectedFlights[0].id}`, {
                state: { backFlight: selectedFlights[1] }, // 선택 사항
            });
        }
    };


    return (
        <div style={{ marginTop: "20px"}}>
            <SearchFlight onSearch={handleSearch} />

            <div className="selected-flights-box">
                <MapWithPath flights={selectedFlights} />

                <div className="flight-info-box">
                    <h3 className="mb-5">선택된 항공편</h3>

                    <div className="flight-pair-container1">
                        {selectedFlights.length === 2 ? (
                            <>
                                {/* 출발 항공편 */}
                                <div className="flight-card1">
                                    <p className="route1">
                                        ✈ {selectedFlights[0].departureName} → {selectedFlights[0].arrivalName}
                                    </p>
                                    <p className="date1">🗓 {selectedFlights[0].departureTime?.split("T")[0]}</p>
                                </div>

                                {/* 돌아오는 항공편 */}
                                <div className="flight-card1">
                                    <p className="route1">
                                        ✈ {selectedFlights[1].departureName} → {selectedFlights[1].arrivalName}
                                    </p>
                                    <p className="date1">🗓 {selectedFlights[1].departureTime?.split("T")[0]}</p>
                                </div>
                            </>
                        ) : (
                            // 편도일 때는 그대로
                            selectedFlights.map((flight, idx) => (
                                <div key={idx} className="flight-card1">
                                    <p className="route1">
                                        ✈ {flight.departureName} → {flight.arrivalName}
                                    </p>
                                    <p className="date1">🗓 {flight.departureTime?.split("T")[0]}</p>
                                </div>
                            ))
                        )}
                    </div>


                    <button className="send-button mt-3" onClick={goToDetail}>
                        예약하기
                    </button>
                </div>
            </div>

            <FlightList
                filters={filters}
                allFlights={allFlights}
                onSelectedFlights={setSelectedFlights}
            />
        </div>
    );

}

export default FlightPage;
