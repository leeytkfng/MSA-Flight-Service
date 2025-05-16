import GoogleMapInternational from "../components/GoogleMap.jsx";
import Sidebar from "../components/Sidebar.jsx";

const MapPage = () => {
    return (
      <div style={{overflow: "hidden"}}>
        <div style={{
            display: "flex",
            height: "calc(100vh - 64px)",  // 헤더 높이만큼 제외
            marginTop: "82px",             // fixed header 고려
            overflow: "hidden"             // 전체 스크롤 차단
        }}>
            <div style={{ flex: 3 }}>
                <GoogleMapInternational />
            </div>
            <div style={{
                flex: 1,
                overflowY: "auto",         // ✅ 사이드바만 세로 스크롤
                maxHeight: "100%"          // 부모 높이 안 넘게
            }}>
                <Sidebar departure="인천" arrival="미정" />
            </div>
        </div>
      </div>
    );
};

export default MapPage;
