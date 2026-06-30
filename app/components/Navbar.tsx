"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, ScrollTrigger);
}

const navLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Safety", href: "/#aria-section-1" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const loaderBgRef = useRef<HTMLDivElement>(null);
  const navContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileOpen]);

  useGSAP(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Only play the loader animation if the user initially lands on the home page
    if (pathname !== "/" || reduceMotion) {
      if (logoRef.current) logoRef.current.classList.remove("is-loading");
      if (loaderBgRef.current) loaderBgRef.current.style.display = "none";
      if (navContentRef.current)
        gsap.set(navContentRef.current, { opacity: 1 });
      return;
    }

    // Briefly hold the loading screen to show the centered logo
    const loaderDelay = gsap.delayedCall(0.8, () => {
      if (!logoRef.current || !loaderBgRef.current || !navContentRef.current)
        return;

      // 1. Record the initial state (centered, large)
      const state = Flip.getState(logoRef.current);

      // 2. Remove the "is-loading" class so it returns to normal navbar styling
      logoRef.current.classList.remove("is-loading");

      // 3. Animate the transition between the two states
      Flip.from(state, {
        duration: 1.2,
        ease: "power3.inOut",
        scale: true,
        absolute: true, // Prevents layout jumping during transition
      });

      // 4. Fade out the black background
      gsap.to(loaderBgRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          if (loaderBgRef.current) {
            loaderBgRef.current.style.display = "none";
          }
        },
      });

      // 5. Fade in the rest of the navbar content (links, hamburger)
      gsap.to(navContentRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out",
      });
    });

    return () => loaderDelay.kill();
  });

  return (
    <>
      {/* Black Loading Screen - z-[80] so it sits precisely under the navbar (z=90) */}
      <div
        ref={loaderBgRef}
        className="fixed inset-0 z-[80] bg-black pointer-events-none"
      />

      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo - This always renders, initially huge thanks to is-loading */}
          <Link
            href="/"
            className="navbar-logo"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                e.preventDefault();
                window.location.href = "/";
              }
            }}
          >
            <Image
              src="/aria-black-dating-app-logo.png"
              alt="Aria black dating app logo"
              width={100}
              height={36}
              priority
              className="navbar-logo-img is-loading"
              ref={logoRef}
            />
          </Link>

          {/* Links and Hamburger - Hidden initially so they don't show on the black screen */}
          <div
            ref={navContentRef}
            className="flex flex-1 items-center justify-end opacity-0 static"
          >
            {/* Centered Nav Pill — Absolute positioned so it's perfectly centered in the screen regardless of what's on the left/right */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
              <ul className="nav-pill">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="nav-pill-link"
                      onClick={(e) => {
                        if (
                          link.href === "/#aria-section-1" &&
                          pathname === "/"
                        ) {
                          e.preventDefault();
                          const el = document.getElementById("aria-section-1");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hamburger — mobile */}
            <button
              className="navbar-hamburger relative z-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`hamburger-line ${mobileOpen ? "open-top" : ""}`}
              />
              <span
                className={`hamburger-line ${mobileOpen ? "open-mid" : ""}`}
              />
              <span
                className={`hamburger-line ${mobileOpen ? "open-bottom" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu Overlay */}
        <div
          className={`fixed inset-0 z-[85] bg-black/80 backdrop-blur-md flex items-center justify-center transition-all duration-400 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setMobileOpen(false)}
        >
          {/* Menu Box */}
          <div
            className={`bg-[#0a0a0a] border border-white/10 p-12 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center min-w-[300px] transform transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${mobileOpen ? "scale-100" : "scale-90"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col items-center gap-8 w-full m-0 p-0 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-2xl font-semibold tracking-wide transition-colors"
                    onClick={(e) => {
                      if (
                        link.href === "/#aria-section-1" &&
                        pathname === "/"
                      ) {
                        e.preventDefault();
                        setMobileOpen(false);
                        const el = document.getElementById("aria-section-1");
                        if (el) {
                          setTimeout(
                            () =>
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              }),
                            300,
                          );
                        }
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Floating CTA — always visible at bottom center, ONLY on homepage */}
      {pathname === "/" && (
        <a
          href="#download"
          onClick={(e) => {
            e.preventDefault();
            if (typeof window === "undefined") return;

            const ua =
              navigator.userAgent ||
              navigator.vendor ||
              (window as Window & { opera?: string }).opera ||
              "";
            // More robust iOS detection including iPad iOS 13+
            const isIOS =
              /iPad|iPhone|iPod/.test(ua) ||
              (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
            const isAndroid = /android/i.test(ua);

            if (isIOS) {
              window.location.href = "https://apps.apple.com/us/app/aria-black-singles-dating-app/id6670338377";
            } else if (isAndroid) {
              window.location.href = "https://play.google.com/store/apps/details?id=com.aria.dating&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnTj-kSXGV95VCwrPCApnWObsRJa6LAtpC4iczpFop-WjwToqriOR_uAOF21E_aem_mQY7bij4wMSyajAzrZpfEQ";
            } else {
              const el = document.getElementById("download");
              if (el) {
                // Instantly jump browser scroll
                el.scrollIntoView({ behavior: "auto" });
                // Synchronously trick GSAP into applying the jump without scrub lag
                ScrollTrigger.update();
                ScrollTrigger.getAll().forEach((st) => {
                  const scrubTween = st.getTween();
                  if (scrubTween) {
                    scrubTween.progress(1);
                  }
                });
              }
            }
          }}
          className="floating-cta"
        >
          Download now
        </a>
      )}
    </>
  );
}
