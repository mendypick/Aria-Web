"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Review {
  id?: string;
  review_text?: string;
  rating?: string;
  name?: string;
}

interface CardMotion {
  x: number;
  y: number;
  rotation: number;
  scale?: number;
}

const HARDCODED_REVIEWS: Review[] = [
  {
    id: "1",
    review_text: "Real app, real people. Loving it 🖤",
    rating: "5",
    name: "Jamal Carter",
  },
  {
    id: "2",
    review_text: "This is where I met my person 💫",
    rating: "5",
    name: "Darnell Jackson",
  },
  {
    id: "3",
    review_text: "Good app, works smooth and easy",
    rating: "5",
    name: "Malik Thompson",
  },
  {
    id: "4",
    review_text: "Finally an app that makes sense 🔥",
    rating: "5",
    name: "Andre Mitchell",
  },
  {
    id: "5",
    review_text: "Simple, clean, and actually works",
    rating: "5",
    name: "Lauren Brooks",
  },
  {
    id: "6",
    review_text: "Found my man here. So grateful ❤️",
    rating: "5",
    name: "Kayla Simmons",
  }
];

const DISPLAY_REVIEWS = [...HARDCODED_REVIEWS].slice(0, 6);
while (DISPLAY_REVIEWS.length < 6) {
  DISPLAY_REVIEWS.push({
    id: `placeholder-${DISPLAY_REVIEWS.length}`,
    review_text: "Amazing experience! Highly recommended.",
    rating: "5",
    name: "Aria User",
  });
}

const DESKTOP_CARD_MOTION: CardMotion[] = [
  { x: -450, y: -240, rotation: -9 },
  { x: 450, y: -220, rotation: 8 },
  { x: -500, y: -20, rotation: -4 },
  { x: 490, y: 0, rotation: 3 },
  { x: -450, y: 200, rotation: 5 },
  { x: 440, y: 220, rotation: -6 },
];

const MOBILE_CARD_MOTION: CardMotion[] = [
  { x: 0, y: -180, rotation: -4, scale: 0.9 },
  { x: 0, y: -60, rotation: 3, scale: 0.92 },
  { x: 0, y: 60, rotation: -2, scale: 0.95 },
  { x: 0, y: 180, rotation: 4, scale: 0.92 },
];

export default function NewReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cards = cardsRef.current.filter(Boolean);
    const globalDarkOverlay = document.getElementById("global-dark-overlay");

    gsap.set([phoneRef.current, glowRef.current, ...cards].filter(Boolean), {
      force3D: true,
      willChange: "transform,opacity",
    });

    if (reduceMotion) {
      const staticCardMotion =
        window.innerWidth < 768 ? MOBILE_CARD_MOTION : DESKTOP_CARD_MOTION;
      gsap.set(phoneRef.current, { clearProps: "transform", opacity: 1 });
      gsap.set(glowRef.current, { opacity: 0.28, scale: 0.9 });
      cards.forEach((card, index) => {
        const motion = staticCardMotion[index];
        gsap.set(card, {
          ...motion,
          opacity: motion ? 1 : 0,
          scale: motion?.scale ?? 1,
        });
      });
      return;
    }

    const mm = gsap.matchMedia();

    // Desktop Animation
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=1200", // Smooth scroll distance for the reveal
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Subtly shrink the phone to make room for cards (more refined, less dramatic)
      tl.to(
        phoneRef.current,
        { scale: 0.9, duration: 1, ease: "power2.out" },
        0
      );

      // Fade in the global fixed background darkness (Cinematic full-page dimming)
      if (globalDarkOverlay) {
        tl.to(
          globalDarkOverlay,
          { opacity: 0.5, duration: 1, ease: "power2.out" },
          0
        );
      }

      // Fade and scale in the red/pink aura (soft glow)
      tl.to(
        glowRef.current,
        { opacity: 0.5, scale: 1, duration: 1, ease: "power2.out" },
        0
      );

      DESKTOP_CARD_MOTION.forEach((motion, index) => {
        const card = cardsRef.current[index];
        if (!card) return;
        tl.to(
          card,
          {
            ...motion,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          0.05 + index * 0.05,
        );
      });
    });

    // Mobile Animation
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=1200",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Fade out and shrink phone drastically on mobile to pull it back into the background
      tl.to(
        phoneRef.current,
        { scale: 0.65, opacity: 0.3, duration: 1, ease: "power2.out" },
        0
      );

      // Darken global fixed background specifically for mobile to create deep contrast
      if (globalDarkOverlay) {
        tl.to(
          globalDarkOverlay,
          { opacity: 0.8, duration: 1, ease: "power2.out" },
          0
        );
      }

      // Subtle glow, very soft
      tl.to(
        glowRef.current,
        { opacity: 0.4, scale: 0.8, duration: 1, ease: "power2.out" },
        0
      );

      MOBILE_CARD_MOTION.forEach((motion, index) => {
        const card = cardsRef.current[index];
        if (!card) return;
        tl.to(
          card,
          {
            ...motion,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          0.05 + index * 0.1,
        );
      });
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-24 md:py-32 px-4 overflow-hidden z-20"
    >
      {/* Background Glow / Aura */}
      <div 
        ref={glowRef}
        className="absolute w-[300px] h-[500px] md:w-[500px] md:h-[700px] rounded-full bg-gradient-to-tr from-[#a61c3c] to-[#450d1a] blur-[60px] md:blur-[100px] opacity-0 scale-75 pointer-events-none z-0"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />

      {/* Central Interactive Layer (Cards + Phone) */}
      <div className="relative w-full max-w-[1200px] mx-auto flex items-center justify-center h-full z-30 pointer-events-none">
        
        {/* Dynamic HTML Review Cards */}
        {DISPLAY_REVIEWS.map((review, idx) => (
          <div 
            key={review.id || idx}
            ref={el => { cardsRef.current[idx] = el; }} 
            className="absolute z-30 opacity-0 scale-90 w-[280px] md:w-[380px] origin-center"
          >
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 px-5 py-4 md:px-7 md:py-5 rounded-[20px] md:rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center space-y-2 md:space-y-2.5 relative overflow-hidden">
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Star Rating — Top */}
              <div className="flex space-x-1.5 pt-1">
                {Array.from({ length: 5 }).map((_, starIdx) => {
                  const ratingVal = review.rating ? parseFloat(review.rating) : 5;
                  const isFilled = starIdx < ratingVal;
                  return (
                    <svg 
                      key={starIdx} 
                      aria-hidden="true"
                      className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px] ${isFilled ? "text-[#fbcbf0] fill-[#fbcbf0]" : "text-white/10 fill-white/10"}`} 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
              </div>
              
              {/* Review Text — Middle (STRICT single line, never wraps) */}
              <p
                className="text-[#ededed] text-[13px] md:text-[14.5px] font-semibold tracking-tight"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxWidth: '100%',
                }}
              >
                &ldquo;{review.review_text}&rdquo;
              </p>

              {/* Name — Bottom */}
              <span className="text-[#a1a1aa] text-[11px] md:text-[12px] font-normal tracking-wide pb-0.5">
                {review.name || "Aria User"}
              </span>
            </div>
          </div>
        ))}

        {/* Central Anchor Phone */}
        <div ref={phoneRef} className="relative z-20 w-[240px] md:w-[340px] lg:w-[380px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] origin-center">
          <Image 
            src="/aria-black-dating-app-reviews-interface.png" 
            alt="Aria black dating app real user reviews and serious dating interface" 
            width={400} 
            height={800} 
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 240px, (max-width: 1024px) 340px, 380px"
            quality={88}
          />
        </div>
      </div>
    </section>
  );
}
