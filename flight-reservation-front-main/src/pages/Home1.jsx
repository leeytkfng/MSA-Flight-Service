import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import apiClient from "../apiClient.jsx";
import { jwtDecode } from "jwt-decode";

function ReservationPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const handlePostRequest = async () => {
            setError(null);
            let userId;

            try {
                const decoded = jwtDecode(accessToken);
                userId = decoded.userid;
            } catch (e) {
                console.error("토큰 디코딩 실패:", e);
                navigate("/login");
                return;
            }

            try {
                const { data: userDataRaw } = await apiClient.get(`/api/users/id/${userId}`);
                const user = Array.isArray(userDataRaw) ? userDataRaw[0] : userDataRaw;

                if (!user || !user.id) {
                    throw new Error("사용자 정보 불완전");
                }

                const response = await apiClient.post("/api/reservations/", null, {
                    params: {
                        uId: user.id,
                        uName: user.userFirstName + user.userLastName
                    }
                });

                const receivedKey = response.data;
                console.log("Received Key:", receivedKey);
                navigate(`/select/${receivedKey}`);
            } catch (err) {
                console.error("Error occurred during POST request:", err);
                setError("POST 요청 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        handlePostRequest(); // ✅ 한 번만 호출됨
    }, []); // ✅ 최초 렌더링 시 1회만 실행

    return (
        <div>
            <h1>예약 요청 페이지</h1>
            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default ReservationPage;