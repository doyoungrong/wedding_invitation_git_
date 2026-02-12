import { useEffect, useState } from "react";

import MainWithMusic from "./components/MainWithMusic";
import SubSection from "./components/SubSection";
import ParentsSection from "./components/ParentsSection";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";
import CalendarMapTitleSection from "./components/CalendarMapTitleSection";
import KakaoMapSection from "./components/KakaoMapSection";
import MapSection from "./components/MapSection";
import GuestSection from "./components/GuestSection";
import InvitationSvg from "./components/InvitationSvg";
import ShareSection from "./components/ShareSection";

import subPhoto from "./assets/Sub_Photo.jpg";

export default function App() {
  // 0: Main, 1: SubSection, 2: SubPhoto, 3: Parents, 4: Youtube, 5: We, 6: Gallery,
  // 7: CalendarTitle, 8: KakaoMap, 9: Map, 10: Guest, 11: InvitationSvg, 12: Share
  const [step, setStep] = useState(0);

  // 페이지 진입 시 무조건 맨 위 고정 (스크롤 점프 방지)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 다음 단계로 이동 (중복 호출 방지)
  const goNext = (nextStep: number) => {
    setStep((prev) => (prev < nextStep ? nextStep : prev));
  };

  return (
    <div className="page">
      {/* 0) MainWithMusic: "렌더"는 바로 하지만, 실제로 다음 단계로 넘어가는 타이밍은 이미지 로드에 맞추는 게 베스트 */}
      <div className="invitation">
        <MainWithMusic />
      </div>

      {/* ✅ Main의 핵심 이미지 로딩 완료를 App이 알 수 있으면 제일 완벽한데,
          지금은 App에서 직접 알 수 없으니 "Main이 먼저 보여지고 나서" 다음 단계부터는 순차 렌더로 제어할게.
          (더 완벽하게 하려면 MainWithMusic에 onReady 콜백을 추가하는 방식으로 개선 가능) */}
      {step < 1 && (
        <img
          src="/img/Main_Photo.jpg"
          alt=""
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          onLoad={() => goNext(1)}
          onError={() => goNext(1)}
        />
      )}

      {/* 1) SubSection */}
      {step >= 1 && (
        <SubSection />
      )}

      {/* 2) Sub_Photo (이미지 로드되면 다음 단계) */}
      {step >= 1 && (
        <div className="invitation">
          <img
            src={subPhoto}
            alt="Sub Photo"
            className="invitation-img"
            draggable={false}
            onLoad={() => goNext(3)}   // 이미지가 로드되면 Parents로
            onError={() => goNext(3)}  // 에러나도 다음으로 진행
          />
        </div>
      )}

      {/* 3) ParentsSection */}
      {step >= 3 && (
        <ParentsSection />
      )}

      {/* 4) YoutubeSection (iframe은 늦고 점프 원인이 될 수 있어 뒤로 미룸) */}
      {step >= 3 && (
        <YoutubeSection videoId="TM_SaCao0bI" />
      )}

      {/* 5) WeSection */}
      {step >= 3 && (
        <WeSection />
      )}

      {/* 6) GallerySection */}
      {step >= 3 && (
        <GallerySection />
      )}

      {/* 7) CalendarMapTitleSection */}
      {step >= 3 && (
        <CalendarMapTitleSection />
      )}

      {/* 8) KakaoMapSection */}
      {step >= 3 && (
        <KakaoMapSection />
      )}

      {/* 9) MapSection */}
      {step >= 3 && (
        <MapSection />
      )}

      {/* 10) GuestSection */}
      {step >= 3 && (
        <GuestSection />
      )}

      {/* 11) InvitationSvg */}
      {step >= 3 && (
        <InvitationSvg />
      )}

      {/* 12) ShareSection */}
      {step >= 3 && (
        <ShareSection />
      )}
    </div>
  );
}
