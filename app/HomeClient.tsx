"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NewReviewsSection from "./components/NewReviewsSection";

// רישום ה-Plugin של הגלילה
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeClient() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  // Always start at the top on mount/refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable browser scroll restoration so it won't remember the previous position
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      // Clear GSAP scroll memory which often overrides standard scrolling on refresh
      if (ScrollTrigger) {
        ScrollTrigger.clearScrollMemory("manual");
      }

      // Force immediate instant scroll
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      // Secondary check to combat Next.js router or browser micro-delays
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, []);

  // ARIA Section Refs
  const ariaStoryRef = useRef(null);

  const ariaSection1Ref = useRef(null);
  const ariaText1Ref = useRef(null);
  const ariaPhone1Ref = useRef(null);
  const ariaArrowRef = useRef(null);

  const ariaSection2Ref = useRef(null);
  const ariaText2Ref = useRef(null);
  const ariaPhone2Ref = useRef(null);

  const storeButtonsRef = useRef<HTMLDivElement>(null);

  // Mobile full-screen overlays
  const mobileOverlay1Ref = useRef<HTMLDivElement>(null);
  const mobileOverlay2Ref = useRef<HTMLDivElement>(null);
  // Mobile text + arrow refs (separate from desktop refs)
  const mobileText1Ref = useRef<HTMLDivElement>(null);
  const mobileText2Ref = useRef<HTMLDivElement>(null);
  const mobileArrowRef = useRef<HTMLDivElement>(null);

  // Guarantee accurate landing position when navigating from Terms/Privacy
  useEffect(() => {
    if (window.location.hash === "#aria-section-1") {
      const timer = setTimeout(() => {
        const el = document.getElementById("aria-section-1");
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      }, 200); // 200ms allows GSAP ScrollTrigger to lock in layout and heights
      return () => clearTimeout(timer);
    }
  }, []);

  useGSAP(
    () => {
      // Cinematic Hero Text Fade
      gsap.to(logoRef.current, {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500",
          scrub: true,
        },
      });

      // ARIA Intelligence Scroll Narrative
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Pin Section 1
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ariaSection1Ref.current,
            start: "center center",
            end: "+=1200",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Calculate exact distance to center the phone mathematically AFTER image load
        tl1.from(
          ariaPhone1Ref.current,
          {
            x: () => {
              if (!ariaPhone1Ref.current) return 0;
              const el = ariaPhone1Ref.current as HTMLElement;
              const rect = el.getBoundingClientRect();
              const elCenter = rect.left + rect.width / 2;
              const screenCenter = document.documentElement.clientWidth / 2;
              return screenCenter - elCenter;
            },
            duration: 2,
            ease: "power2.out",
          },
          0,
        );

        // Text starts perfectly centered UNDER the phone, and slides left to its natural position
        tl1.from(
          ariaText1Ref.current,
          {
            x: () => {
              if (!ariaText1Ref.current) return 0;
              const el = ariaText1Ref.current as HTMLElement;
              const rect = el.getBoundingClientRect();
              const elCenter = rect.left + rect.width / 2;
              const screenCenter = document.documentElement.clientWidth / 2;
              return screenCenter - elCenter;
            },
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );

        // Arrow animation - reveals separately as a vertical drop AFTER text arrives
        tl1.from(
          ariaArrowRef.current,
          {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          1.0,
        );

        // Pin Section 2 Reveal
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ariaSection2Ref.current,
            start: "center center",
            end: "+=1200",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Calculate exact distance to center the phone mathematically
        tl2.from(
          ariaPhone2Ref.current,
          {
            x: () => {
              if (!ariaPhone2Ref.current) return 0;
              const el = ariaPhone2Ref.current as HTMLElement;
              const rect = el.getBoundingClientRect();
              const elCenter = rect.left + rect.width / 2;
              const screenCenter = document.documentElement.clientWidth / 2;
              return screenCenter - elCenter;
            },
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );

        // Text starts perfectly centered UNDER the phone, and slides right to its natural position
        tl2.from(
          ariaText2Ref.current,
          {
            x: () => {
              if (!ariaText2Ref.current) return 0;
              const el = ariaText2Ref.current as HTMLElement;
              const rect = el.getBoundingClientRect();
              const elCenter = rect.left + rect.width / 2;
              const screenCenter = document.documentElement.clientWidth / 2;
              return screenCenter - elCenter;
            },
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile Section 1
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ariaSection1Ref.current,
            start: "center center",
            end: "+=800",
            pin: true,
            scrub: 1,
          },
        });
        tl1.to(
          ariaPhone1Ref.current,
          { scale: 0.6, opacity: 0.25, duration: 1, ease: "power2.out" },
          0,
        );
        tl1.to(
          mobileOverlay1Ref.current,
          { opacity: 0.7, duration: 1, ease: "power2.out" },
          0,
        );
        tl1.fromTo(
          mobileText1Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          0,
        );
        // Arrow fades in at the end of section 1 scroll
        tl1.fromTo(
          mobileArrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.7,
        );

        // Mobile Section 2
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ariaSection2Ref.current,
            start: "center center",
            end: "+=800",
            pin: true,
            scrub: 1,
          },
        });
        tl2.to(
          ariaPhone2Ref.current,
          { scale: 0.6, opacity: 0.25, duration: 1, ease: "power2.out" },
          0,
        );
        tl2.to(
          mobileOverlay2Ref.current,
          { opacity: 0.7, duration: 1, ease: "power2.out" },
          0,
        );
        tl2.fromTo(
          mobileText2Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          0,
        );
      });

      // Floating CTA Anchoring Logic
      const ctaEl = document.querySelector(".floating-cta") as HTMLElement;
      if (ctaEl && storeButtonsRef.current) {
        const GAP = 40; // Fixed spacing offset
        
        ScrollTrigger.create({
          trigger: storeButtonsRef.current,
          // Calculate cleanly without DOM mutation. 
          // Mobile: floating CTA is bottom 64px + ~50px height = ~114px from bottom.
          // Desktop: floating CTA is bottom 85px + ~56px height = ~141px from bottom.
          start: () => {
             const isMobile = window.innerWidth < 768;
             const offsetFromBottom = isMobile ? 114 : 141;
             return `bottom+=${GAP} bottom-=${offsetFromBottom}`;
          },
          end: "max",
          onEnter: () => {
             const anchorBottom = storeButtonsRef.current!.getBoundingClientRect().bottom + window.scrollY;
             gsap.set(ctaEl, { position: "absolute", top: anchorBottom + GAP, bottom: "auto" });
          },
          onLeaveBack: () => {
             gsap.set(ctaEl, { clearProps: "position,top,bottom" });
          },
          onRefresh: (self) => {
             // Handle viewport resizes (e.g. mobile URL bar shrinking) smoothly without layout thrashing
             if (self.progress > 0) {
                 const anchorBottom = storeButtonsRef.current!.getBoundingClientRect().bottom + window.scrollY;
                 gsap.set(ctaEl, { position: "absolute", top: anchorBottom + GAP, bottom: "auto" });
             } else {
                 gsap.set(ctaEl, { clearProps: "position,top,bottom" });
             }
          }
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <main ref={containerRef} className="relative w-full">
      {/* Fixed Background Image - Stays locked in viewport while content scrolls over it */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/aria-black-dating-app-ambient-background.png"
          alt="Aria black dating app ambient background for serious relationships"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={100}
          unoptimized={true}
        />
        {/* Base dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Dynamic extra darkening overlay controlled by GSAP */}
        <div id="global-dark-overlay" className="absolute inset-0 bg-black opacity-0" />
      </div>

      {/* Cinematic Hero Section - Transparent to reveal fixed background */}
      <section className="relative flex min-h-screen w-full flex-col justify-end pl-10 md:pl-24 pb-48 md:pb-64 overflow-hidden z-10">
        <div ref={logoRef} className="z-10 text-left max-w-3xl">
          <h1 className="text-white text-[24px] md:text-5xl font-semibold leading-tight tracking-tight whitespace-nowrap">
            The black dating app
          </h1>
          <p className="text-white text-[24px] md:text-5xl font-semibold leading-tight tracking-tight mt-1 md:mt-2 whitespace-nowrap">
            Designed to keep it serious
          </p>
        </div>
      </section>

      {/* NEW REVIEWS SECTION - sits over transparent background, before the solid black containers */}
      <NewReviewsSection />

      {/* ARIA Storytelling Sequence Container (Solid Black) */}
      <div
        ref={ariaStoryRef}
        className="relative z-10 w-full bg-[#050505] text-[#ededed] overflow-hidden rounded-t-[50px] shadow-[0_-20px_60px_rgba(0,0,0,0.8)]"
      >
        {/* ARIA Intelligence Section - Feature 1 */}
        <section
          id="aria-section-1"
          ref={ariaSection1Ref}
          className="relative w-full min-h-screen flex items-center justify-center py-24 md:py-32 px-8 md:px-16 lg:px-24 overflow-hidden"
        >
          {/* Mobile: full-screen dark overlay (hidden on desktop) */}
          <div
            ref={mobileOverlay1Ref}
            className="md:hidden absolute inset-0 z-20 bg-black opacity-0 pointer-events-none"
          />

          {/* Mobile: centered text overlay (hidden on desktop) */}
          <div className="md:hidden absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8">
            <div
              ref={mobileText1Ref}
              className="flex flex-col items-center text-center space-y-5 opacity-0"
            >
              <h2 className="text-[26px] font-semibold tracking-tight text-white leading-[1.2]">
                ARIA - Artificial Relational Intelligence Agent
              </h2>
              <p className="text-white/70 text-[15px] font-light leading-relaxed">
                Using AI, ARIA evaluates tone, consistency, and intent across
                messages to understand whether a conversation reflects genuine
                long-term interest or casual behavior.
              </p>
              {/* Arrow - appears at end of section 1 scroll to signal section 2 */}
              <div
                ref={mobileArrowRef}
                className="mt-4 w-10 h-10 relative opacity-0"
              >
                <Image
                  src="/aria-dating-app-scroll-arrow-mobile.png"
                  alt="Scroll down for Aria black dating app features"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            {/* Desktop: Left Column Text + Arrow */}
            <div className="hidden md:flex flex-col order-2 md:order-1 h-full justify-center">
              <div
                ref={ariaText1Ref}
                className="relative flex flex-col space-y-8"
              >
                <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
                  ARIA - Artificial Relational Intelligence Agent
                </h2>
                <p className="text-[#a1a1aa] text-lg font-light leading-relaxed max-w-[550px]">
                  Using AI, ARIA evaluates tone, consistency, and intent across
                  messages to understand whether a conversation reflects genuine
                  long-term interest or casual behavior. This analysis happens
                  continuously and adapts as the conversation evolves.
                </p>
              </div>
              <div ref={ariaArrowRef} className="mt-10 ml-4 w-32 h-32 relative">
                <Image
                  src="/aria-dating-app-scroll-arrow.png"
                  alt="Scroll down to view more features of the Aria black dating app"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            </div>

            {/* Phone image */}
            <div
              ref={ariaPhone1Ref}
              className="relative z-10 order-1 md:order-2 flex justify-center md:justify-end w-full"
            >
              <div className="relative w-full max-w-[320px] md:max-w-[340px] lg:max-w-[380px] h-auto aspect-[9/19]">
                <Image
                  src="/aria-black-dating-app-intent-analysis.png"
                  alt="Aria black dating app AI analyzing conversation intent for serious relationships"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={100}
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ARIA Intelligence Section - Feature 2 */}
        <section
          ref={ariaSection2Ref}
          className="relative w-full min-h-screen flex items-center justify-center py-24 md:py-32 px-8 md:px-16 lg:px-24 overflow-hidden"
        >
          {/* Mobile: full-screen dark overlay */}
          <div
            ref={mobileOverlay2Ref}
            className="md:hidden absolute inset-0 z-20 bg-black opacity-0 pointer-events-none"
          />

          {/* Mobile: centered text overlay */}
          <div className="md:hidden absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8">
            <div
              ref={mobileText2Ref}
              className="flex flex-col items-center text-center space-y-5 opacity-0"
            >
              <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-white leading-[1.25]">
                See how each match aligns with long-term intent based on real
                conversation behavior
              </h2>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            {/* Phone image - left */}
            <div
              ref={ariaPhone2Ref}
              className="relative z-10 order-1 flex justify-center md:justify-start w-full"
            >
              <div className="relative w-full max-w-[320px] md:max-w-[340px] lg:max-w-[380px] h-auto aspect-[9/19]">
                <Image
                  src="/aria-black-dating-app-match-screen.png"
                  alt="Black couple matches using Aria dating app for serious relationships"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={100}
                  unoptimized={true}
                />
              </div>
            </div>

            {/* Desktop: Right Column Text */}
            <div className="hidden md:flex flex-col order-2">
              <div ref={ariaText2Ref} className="flex flex-col">
                <h2 className="text-4xl lg:text-[40px] font-semibold tracking-[-0.02em] text-white leading-[1.25]">
                  See how each match aligns with
                  <br />
                  long-term intent based on
                  <br />
                  real conversation behavior
                </h2>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Download Action Section */}
      <section id="download" className="relative z-10 w-full min-h-[50vh] flex flex-col items-center justify-center bg-[#050505] text-[#ededed] py-32 px-8 border-t border-white/5 pb-48">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-5xl sm:text-6xl md:text-[80px] font-bold tracking-[-0.04em] text-white mb-16">
            Get the app!
          </h2>

          <div ref={storeButtonsRef} className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full mt-8 px-2 max-w-[360px] sm:max-w-none">
            {/* Apple App Store Image Button */}
            <a
              href="https://apps.apple.com/us/app/aria-black-singles-dating-app/id6670338377"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-[150px] h-[50px] sm:w-[200px] sm:h-[67px] md:w-[240px] md:h-[80px] hover:scale-105 transition-transform duration-300 overflow-hidden rounded-2xl shadow-lg border border-white/10 hover:border-white/20"
            >
              <Image
                src="/download-aria-black-dating-app-apple-store.png"
                alt="Download Aria black dating app on Apple App Store"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 240px"
              />
            </a>

            {/* Android Google Play Image Button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.aria.dating&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnTj-kSXGV95VCwrPCApnWObsRJa6LAtpC4iczpFop-WjwToqriOR_uAOF21E_aem_mQY7bij4wMSyajAzrZpfEQ"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-[150px] h-[50px] sm:w-[200px] sm:h-[67px] md:w-[240px] md:h-[80px] hover:scale-105 transition-transform duration-300 overflow-hidden rounded-2xl shadow-lg border border-white/10 hover:border-white/20 hover:brightness-110"
            >
              <Image
                src="/download-aria-black-dating-app-google-play.png"
                alt="Download Aria black dating app on Google Play Store"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 240px"
              />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
