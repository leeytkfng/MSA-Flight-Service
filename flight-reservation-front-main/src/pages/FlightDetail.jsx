import React from 'react';
import { useLocation } from 'react-router-dom';
import FlightDetailCard from '../components/FlightDetailCard';

const FlightDetail = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const departureId = Number(searchParams.get('departureId'));
  const arrivalIdRaw = searchParams.get('arrivalId');
  const arrivalId = arrivalIdRaw ? Number(arrivalIdRaw) : null;

  const isRoundTrip = !!arrivalId;

  return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>
          {isRoundTrip ? '✈️ 왕복 항공편 상세' : '🛫 편도 항공편 상세'}
        </h2>

        {/* 출발 항공편 */}
        {departureId ? (
            <FlightDetailCard fId={departureId} />
        ) : (
            <p style={{ color: 'red' }}>출발 항공편 정보 없음</p>
        )}

        {/* 돌아오는 항공편 (있을 경우만 출력) */}
        {arrivalId && <FlightDetailCard fId={arrivalId} />}
      </div>
  );
};

export default FlightDetail;
