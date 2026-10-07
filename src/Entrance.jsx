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

function placeRule(rule) {
  const headline = document.querySelector(".hero h1");
  const button = document.querySelector(".hero .btn");
  if (!rule || !headline) return;
  const head = headline.getBoundingClientRect();
  if (!head.width || !head.height) return;
  const next = button ? button.getBoundingClientRect() : null;
  const space = next && next.top > head.bottom ? next.top - head.bottom : 48;
  const drop = Math.round(Math.min(Math.max(space * 0.42, 18), 34));
  const width = Math.min(head.width * 0.42, 420);
  rule.style.top = `${Math.round(head.bottom + drop)}px`;
  rule.style.width = `${Math.round(width)}px`;
  rule.style.left = `${Math.round(head.left + (head.width - width) / 2)}px`;
}

export default function Entrance({ onDone }) {
  const logoRef = useRef(null);
  const ruleRef = useRef(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const logo = logoRef.current;
    const rule = ruleRef.current;
    root.classList.add("is-intro");
    window.scrollTo(0, 0);
    placeRule(rule);
    try {
      sessionStorage.setItem("aria-intro", "1");
    } catch {
      /* session storage can be unavailable */
    }

    let cancelled = false;
    let moveTimer = 0;
    let doneTimer = 0;
    let ruleTimer = 0;

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
      placeRule(rule);
      moveTimer = window.setTimeout(travel, MOVE_AT);
      ruleTimer = window.setTimeout(() => placeRule(rule), 1080);
      doneTimer = window.setTimeout(finish, DONE_AT);
    };

    const onResize = () => placeRule(rule);
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => {
      if (!cancelled) placeRule(rule);
    });

    if (logo && !logo.complete) {
      logo.addEventListener("load", arm, { once: true });
      logo.addEventListener("error", arm, { once: true });
    } else {
      arm();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(moveTimer);
      window.clearTimeout(ruleTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("resize", onResize);
      root.classList.remove("is-intro", "is-intro-landed");
    };
  }, [onDone]);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-veil" />
      <span ref={ruleRef} className="intro-rule" />
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
