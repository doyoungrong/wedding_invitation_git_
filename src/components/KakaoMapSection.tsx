import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMapSection() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;
    if (!key) {
      console.warn("VITE_KAKAO_MAP_KEY is missing");
      return;
    }

    const initMap = () => {
      if (!mapRef.current) return;
      const { kakao } = window;
      if (!kakao?.maps?.services) return;

      // 1) 지도 생성(임시 중심)
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      });

      // 2) 주소 -> 좌표 변환 (트라디노이)
      const geocoder = new kakao.maps.services.Geocoder();
      const address = "서울 강남구 도곡로99길 16";

      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status !== kakao.maps.services.Status.OK) return;

        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        map.setCenter(coords);

        const marker = new kakao.maps.Marker({
          map,
          position: coords,
        });

        const info = new kakao.maps.InfoWindow({
          content: `
            <div style="padding:6px 8px;font-size:12px;line-height:1.4;">
              <strong>트라디노이</strong><br/>
              서울 강남구 도곡로99길 16 6층
            </div>
          `,
        });

        info.open(map, marker);
      });
    };

    // SDK가 이미 있으면 바로 초기화
    if (window.kakao?.maps?.services) {
      initMap();
      return;
    }

    // SDK 스크립트 로드 (services 라이브러리 포함 필수!)
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="invitation">
      <div className="map-wrap">
        <div ref={mapRef} className="map-box" aria-label="Kakao Map" />
      </div>
    </div>
  );
}
