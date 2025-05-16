

import React from "react";

const Sidebar = ({ departure = "인천", arrival = "미정" }) => {
    return (
        <div style={{
            padding: "1.5rem",
            height: "100%",
            backgroundColor: "#f9f9f9",
            borderLeft: "1px solid #ddd",
            fontFamily: "sans-serif"
        }}>
            <h2 style={{ color: "#007bff", marginBottom: "1rem" }}>선택된 항공편</h2>

            <div style={{ marginBottom: "2rem" }}>
                ✈ <strong>출발지:</strong> {departure}
                <br />
                🛬 <strong>도착지:</strong> {arrival}
            </div>

            <hr />

            <div>
                <h3 style={{ marginBottom: "0.5rem" }}>🔥 추천 항공편</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "1rem" }}>
                        도쿄 ✈ ₩175,100~
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        싱가포르 ✈ ₩215,000~
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        시드니 ✈ ₩980,000~
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
