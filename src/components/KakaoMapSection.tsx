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
      console.error("VITE_KAKAO_MAP_KEY is missing");
      return;
    }

    const run = () => {
      const kakao = window.kakao;
      if (!kakao?.maps) {
        console.error("kakao.maps not ready");
        return;
      }

      kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        });

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch("서울 강남구 도곡로99길 16", (result: any, status: any) => {
          if (status !== kakao.maps.services.Status.OK) {
            console.error("addressSearch failed:", status, result);
            return;
          }

          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);

          const marker = new kakao.maps.Marker({ map, position: coords });

          const info = new kakao.maps.InfoWindow({
            content: `
              <div style="
                padding:6px 8px;
                font-size:12px;
                line-height:1.4;
                white-space:nowrap;
              ">
                <strong>트라디노이</strong><br/>
                서울 강남구 도곡로99길 16 6층
              </div>
            `,
          });
          info.open(map, marker);
        });
      });
    };

    // 이미 SDK가 로드됐으면 바로 실행
    if (window.kakao?.maps) {
      run();
      return;
    }

    // SDK 스크립트 로드 (autoload=false로 load 사용)
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = run;
    script.onerror = () => console.error("Kakao maps sdk load error");
    document.head.appendChild(script);
  }, []);

  return (
    <div className="invitation">
      <div className="kakao-map-wrap">
        <div ref={mapRef} className="map-box" aria-label="Kakao Map" />
      </div>
    </div>
  );
}
