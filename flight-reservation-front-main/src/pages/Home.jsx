import SearchFlight from "../components/SearchFlight";
import AdBanner from '../components/AdBanner';

import '../style/Home.css';
import QuickLink from "../components/QuickLink";
import Hotplace from "../components/Hotplace";
import SimpleAirportMap from "../components/SimpleAirportMap.jsx";
import {useState} from "react";
import GoogleMap from "../components/GoogleMap.jsx";
import WeatherForecast from "../components/WeatherForecast.jsx";
import Boards from "../components/Boards.jsx";
import {useNavigate} from "react-router-dom";
import GoogleMapPreview from "./GoogleMapPreview.jsx";

function Home() {
    const [flightType,setFlightType] = useState("domestic"); //국내선 기본
    const navigate = useNavigate();



    return (
        <div className="home">
            <div className="banner">
                <img
                    src="/images/img1.jpg"
                    alt="Banner Image"
                />
            </div>

            <div className="contents-box">
                <SearchFlight />
                {/* 지도 전환 */}
                <GoogleMapPreview />
                <QuickLink />
                <AdBanner />
                <Hotplace />
                <WeatherForecast />
                <Boards />
            </div>
        </div>
    )
}

export default Home;