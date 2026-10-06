import { useLayoutEffect, useRef } from "react";

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const MOVE_AT = 820;
const MOVE_MS = 540;
const DONE_AT = 2120;

export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const hash = window.location.hash;
  if (hash === "#privacy" || hash === "#terms" || hash === "#blog" || hash.startsWith("#post/")) return false;
  if (hash && hash !== "#" && hash !== "#top") return false;
  try {
    if (sessionStorage.getItem("aria-intro")) return false;
  } catch {
    return false;
  }
  return true;
}

export default function Entrance({ onDone }) {
  const logoRef = useRef(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const logo = logoRef.current;
    root.classList.add("is-intro");
    window.scrollTo(0, 0);
    try {
      sessionStorage.setItem("aria-intro", "1");
    } catch {
      /* session storage can be unavailable */
    }

    let cancelled = false;
    let moveTimer = 0;
    let doneTimer = 0;

    const finish = () => {
      if (cancelled) return;
      onDone();
    };

    const travel = () => {
      const target = document.querySelector(".nav .wordmark");
      if (!logo || !target) return;
      const from = logo.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.height || !to.height) return;
      const scale = to.height / from.height;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      logo.style.transition = `transform ${MOVE_MS}ms ${EASE}`;
      logo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      const land = (event) => {
        if (event.propertyName !== "transform") return;
        logo.removeEventListener("transitionend", land);
        if (!cancelled) root.classList.add("is-intro-landed");
      };
      logo.addEventListener("transitionend", land);
    };

    const arm = () => {
      if (cancelled) return;
      moveTimer = window.setTimeout(travel, MOVE_AT);
      doneTimer = window.setTimeout(finish, DONE_AT);
    };

    if (logo && !logo.complete) {
      logo.addEventListener("load", arm, { once: true });
      logo.addEventListener("error", arm, { once: true });
    } else {
      arm();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(moveTimer);
      window.clearTimeout(doneTimer);
      root.classList.remove("is-intro", "is-intro-landed");
    };
  }, [onDone]);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-veil" />
      <span className="intro-rule" />
      <img
        ref={logoRef}
        className="intro-logo"
        src={`${import.meta.env.BASE_URL}brand/wordmark.png`}
        alt=""
      />
      <div className="intro-block" />
    </div>
  );
}
