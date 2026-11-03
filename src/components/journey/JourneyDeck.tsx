import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

import { BondSlide } from "./BondSlide";
import { GallerySlide } from "./GallerySlide";
import { ReasonsSlide } from "./ReasonsSlide";
import { HiddenMessagesSlide } from "./HiddenMessagesSlide";
import { LetterSlide } from "./LetterSlide";
import { CakeSlide } from "./CakeSlide";
import { WishesSlide } from "./WishesSlide";
import { MyEffortsSlide } from "./MyEffortsSlide";
import { Fireworks } from "./Fireworks";
import { playFireworksSound } from "@/components/scene1/birthdaySounds";

/**
 * Phase 3 + 4 — swipeable full-screen card sections.
 */
export function JourneyDeck({ muted }: { muted: boolean }) {
  const [fireworksRun, setFireworksRun] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const finishFireworks = useCallback(() => setFireworksRun(0), []);

  return (
    <div className="absolute inset-0 z-10">
      <Fireworks key={fireworksRun} active={fireworksRun > 0} onComplete={finishFireworks} />
      <Swiper
        modules={[Mousewheel, Keyboard, Pagination, EffectCreative]}
        effect="creative"
        creativeEffect={{
          prev: { shadow: false, translate: [0, 0, -420], opacity: 0 },
          next: { translate: ["100%", 0, 0] },
        }}
        speed={800}
        mousewheel={{ forceToAxis: true }}
        keyboard
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={
          {
            "--swiper-pagination-bottom": "calc(4.75rem + env(safe-area-inset-bottom, 0px))",
            "--swiper-pagination-bullet-inactive-color": "var(--starlight)",
            "--swiper-pagination-color": "var(--glow-gold)",
          } as React.CSSProperties
        }
        className="h-full w-full"
      >
        {[
          <BondSlide key="b" isActive={activeIndex === 0} />,
          <GallerySlide key="g" isActive={activeIndex === 1} />,
          <ReasonsSlide key="r" isActive={activeIndex === 2} />,
          <HiddenMessagesSlide key="h" isActive={activeIndex === 3} />,
          <LetterSlide key="l" isActive={activeIndex === 4} />,
          <CakeSlide
            key="c"
            isActive={activeIndex === 5}
            muted={muted}
            onLaunchFireworks={() => {
              playFireworksSound(muted);
              setFireworksRun((run) => run + 1);
            }}
          />,
          <WishesSlide key="w" />,
          <MyEffortsSlide key="efforts" isActive={activeIndex === 7} />,
        ].map((slide) => (
          <SwiperSlide key={slide.key}>{slide}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
