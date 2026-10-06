import { useCallback, useEffect, useRef, useState } from "react";
import { copy, external } from "./content.js";
import { AppIcon, Lockup } from "./components/Mark.jsx";
import { LegalPage } from "./LegalPage.jsx";
import { BlogIndex, BlogPost } from "./Blog.jsx";
import { postBySlug } from "./blog/posts.js";
import Entrance, { shouldPlayIntro } from "./Entrance.jsx";

function pageFromHash(hash = window.location.hash) {
  const value = decodeURIComponent(hash || "");
  if (value === "#privacy" || value === "#terms") return { type: "legal", id: value.slice(1) };
  if (value === "#blog") return { type: "blog" };
  if (value.startsWith("#post/")) return { type: "post", slug: value.slice(6) };
  return { type: "home", hash: value || "#top" };
}

function deviceStore() {
  const ua = navigator.userAgent || "";
  const iPad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/Android/i.test(ua)) return external.play;
  if (/iPhone|iPad|iPod/i.test(ua) || iPad) return external.appStore;
  return null;
}

function InstallLink({ className, children, onOpen, onFallback }) {
  const store = deviceStore();
  if (!store) {
    return (
      <a
        className={className}
        href="#download"
        onClick={(event) => {
          event.preventDefault();
          onFallback();
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <a className={className} href={store} target="_blank" rel="noreferrer" onClick={onOpen}>
      {children}
    </a>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [intro, setIntro] = useState(shouldPlayIntro);
  const finishIntro = useCallback(() => setIntro(false), []);
  const [faq, setFaq] = useState(null);
  const [tour, setTour] = useState(0);
  const initialPage = pageFromHash();
  const [page, setPage] = useState(initialPage);
  const scrollRef = useRef(initialPage.type === "home" ? initialPage.hash : null);
  const tourRef = useRef(null);
  const t = copy;

  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (page.type === "legal") {
      document.title = page.id === "privacy" ? "Privacy Policy — Aria" : "Terms of Use — Aria";
      if (meta) meta.setAttribute("content", t.metaDescription);
      return;
    }
    if (page.type === "blog") {
      document.title = "Blog — Aria";
      if (meta) meta.setAttribute("content", "Dating with purpose, in practice. Essays from Aria.");
      return;
    }
    if (page.type === "post") {
      const post = postBySlug(page.slug);
      const title = post?.title
        ?.replace(/&#x27;|&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      document.title = title ? `${title} — Aria` : "Blog — Aria";
      const excerpt = post?.excerpt
        ?.replace(/&#x27;|&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      if (meta) meta.setAttribute("content", excerpt || t.metaDescription);
      return;
    }
    document.title = t.metaTitle;
    if (meta) meta.setAttribute("content", t.metaDescription);
  }, [t, page]);

  useEffect(() => {
    document.body.style.overflow = open || intro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, intro]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = pageFromHash();
      scrollRef.current = next.type === "home" ? next.hash : null;
      setPage(next);
      if (next.type !== "home") window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    const list = tourRef.current;
    const item = list?.children[tour];
    if (!list || !item) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const horizontal = getComputedStyle(list).flexDirection.startsWith("row");
    if (horizontal) {
      list.scrollLeft += itemRect.left - listRect.left - (listRect.width - itemRect.width) / 2;
    } else {
      list.scrollTop += itemRect.top - listRect.top;
    }
  }, [tour]);

  useEffect(() => {
    if (page.type !== "home") {
      window.scrollTo(0, 0);
      return;
    }
    const hash = scrollRef.current;
    if (!hash) return;
    scrollRef.current = null;
    if (hash === "#top" || hash === "#") window.scrollTo(0, 0);
    else document.querySelector(hash)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [page]);

  const close = () => setOpen(false);
  const goTo = (hash) => {
    setOpen(false);
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    const next = pageFromHash(hash);
    scrollRef.current = next.type === "home" ? next.hash : null;
    setPage(next);
    if (next.type !== "home") window.scrollTo(0, 0);
  };

  const stepTour = (direction) => {
    setTour((index) => (index + direction + t.screens.length) % t.screens.length);
  };

  return (
    <>
      {intro && <Entrance onDone={finishIntro} />}
      <a className="skip" href="#content">
        {t.skip}
      </a>
      <header className="nav">
        <Lockup onClick={(event) => { event.preventDefault(); goTo("#top"); }} />
        <nav className="nav-links" aria-label="Aria">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                goTo(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-end">
          <InstallLink className="btn btn-dark nav-cta" onOpen={close} onFallback={() => goTo("#download")}>
            {t.getApp}
          </InstallLink>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t.close : t.menu}
          </button>
        </div>
      </header>

      {open && (
        <div className="overlay">
          <nav>
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            <InstallLink onOpen={close} onFallback={() => goTo("#download")}>
              {t.getApp}
            </InstallLink>
            <a
              className="overlay-legal"
              href="#privacy"
              onClick={(event) => {
                event.preventDefault();
                goTo("#privacy");
              }}
            >
              {t.footer.privacy}
            </a>
            <a
              className="overlay-legal"
              href="#terms"
              onClick={(event) => {
                event.preventDefault();
                goTo("#terms");
              }}
            >
              {t.footer.terms}
            </a>
          </nav>
        </div>
      )}

      <main id="content">
        {page.type === "legal" ? (
          <LegalPage id={page.id} onBack={() => goTo("#top")} />
        ) : page.type === "blog" ? (
          <BlogIndex onOpen={(slug) => goTo(`#post/${slug}`)} onHome={() => goTo("#top")} />
        ) : page.type === "post" ? (
          <BlogPost
            slug={page.slug}
            onBlog={() => goTo("#blog")}
            onOpen={(slug) => goTo(`#post/${slug}`)}
          />
        ) : (
          <>
            <section className="hero" id="top">
              <div className="wrap hero-inner">
                <h1>
                  <span>{t.hero.l1}</span>
                  <span>{t.hero.l2}</span>
                </h1>
                <InstallLink className="btn btn-dark" onFallback={() => goTo("#download")}>
                  {t.getApp}
                </InstallLink>
              </div>
            </section>

            <section className="manifesto" aria-label="Aria">
              <div className="wrap">
                <p>{t.manifesto}</p>
              </div>
            </section>

            <section className="standards" id="standards">
              <div className="wrap standards-layout">
                <Seal />
                <h2>{t.standards}</h2>
                <div className="portraits">
                  {t.singles.map((photo, index) => (
                    <span key={photo.src} className={`portrait p${index + 1}`}>
                      <img src={photo.src} alt={photo.alt} width="160" height="160" />
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="app-tour" id="why">
              <div className="wrap">
                <h2>{t.app.title}</h2>
                <div className="gallery app-gallery has-nav">
                  <div className="gallery-arrows">
                    <button type="button" aria-label={t.app.prev} onClick={() => stepTour(-1)}>
                      <Chevron direction="up" />
                    </button>
                    <button type="button" aria-label={t.app.next} onClick={() => stepTour(1)}>
                      <Chevron direction="down" />
                    </button>
                  </div>
                  <div className="gallery-list" role="tablist" aria-label={t.app.title} ref={tourRef}>
                    {t.screens.map((screen, index) => {
                      const selected = index === tour;
                      if (selected) {
                        return (
                          <div key={screen.id} className="feature" role="tab" aria-selected="true">
                            <button type="button" className="feature-name" onClick={() => setTour(index)}>
                              <span className="pill-mark" aria-hidden="true" />
                              {screen.title}
                            </button>
                            <p className="feature-body">{screen.body}</p>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={screen.id}
                          type="button"
                          role="tab"
                          aria-selected="false"
                          className="pill"
                          onClick={() => setTour(index)}
                        >
                          <span className="pill-mark" aria-hidden="true">
                            <Plus />
                          </span>
                          {screen.title}
                        </button>
                      );
                    })}
                  </div>
                  <div className="screen-stage">
                    <div className="screen-track" style={{ "--i": tour }}>
                      {t.screens.map((screen, index) => (
                        <img
                          key={screen.id}
                          className={
                            index === tour
                              ? "is-on"
                              : index === tour - 1
                                ? "is-prev"
                                : index === tour + 1
                                  ? "is-next"
                                  : "is-far"
                          }
                          src={screen.src}
                          alt={index === tour ? screen.alt : ""}
                          width="471"
                          height="1024"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="gallery-detail">
                    <p>{t.screens[tour].body}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="cta" id="download">
              <div className="wrap">
                <AppIcon />
                <h2>{t.cta.title}</h2>
                <div className="stores">
                  <a href={external.appStore} target="_blank" rel="noreferrer">
                    <Apple />
                    <span>
                      <small>{t.cta.on}</small>
                      {t.cta.appStore}
                    </span>
                  </a>
                  <a href={external.play} target="_blank" rel="noreferrer">
                    <Play />
                    <span>
                      <small>{t.cta.on}</small>
                      {t.cta.play}
                    </span>
                  </a>
                </div>
              </div>
            </section>

            <section className="faq" id="faq">
              <div className="wrap faq-wrap">
                <h2>{t.faq.title}</h2>
                <div className="faq-list">
                  {t.faq.items.map(([question, answer], index) => {
                    const isOpen = faq === index;
                    return (
                      <div className={isOpen ? "item open" : "item"} key={question}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setFaq(isOpen ? null : index)}
                        >
                          <span>{question}</span>
                          <i aria-hidden="true" />
                        </button>
                        <div className="answer">
                          <p>{answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="support" id="support">
              <div className="wrap">
                <p className="eyebrow">{t.support.eyebrow}</p>
                <h2>{t.support.title}</h2>
                <a className="mail" href={external.email}>
                  {t.support.email}
                </a>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Lockup onClick={(event) => { event.preventDefault(); goTo("#top"); }} />
            <p>{t.footer.blurb}</p>
          </div>
          <div>
            <h2>{t.footer.nav}</h2>
            <ul>
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.footer.social}</h2>
            <ul>
              {t.footer.socials.map(([label, key]) => (
                <li key={key}>
                  <a href={external[key]} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.footer.support}</h2>
            <ul>
              <li>
                <a href={external.email}>support@aria.dating</a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(event) => {
                    event.preventDefault();
                    goTo("#blog");
                  }}
                >
                  {t.footer.blog}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(event) => {
                    event.preventDefault();
                    goTo("#privacy");
                  }}
                >
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(event) => {
                    event.preventDefault();
                    goTo("#terms");
                  }}
                >
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="wrap legal">
          <small>{t.footer.rights}</small>
          <small>{t.footer.intention}</small>
        </div>
        <div className="wrap footer-mark" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}brand/wordmark.png`} alt="" width="1024" height="299" />
        </div>
      </footer>
    </>
  );
}

function Chevron({ direction }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d={direction === "up" ? "M3 9.2 7 4.8 11 9.2" : "M3 4.8 7 9.2 11 4.8"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Seal() {
  return (
    <svg className="seal" viewBox="0 0 72 72" aria-hidden="true">
      <path
        fill="#FF0000"
        d="M36 4 42 10.2 50.2 8.4 52.8 16.4 60.4 20.2 57.2 27.8 62.8 34.2 56.8 40.2 59.2 48.4 51.4 51.6 50.6 60 42.6 58.2 36 64 29.4 58.2 21.4 60 20.6 51.6 12.8 48.4 15.2 40.2 9.2 34.2 14.8 27.8 11.6 20.2 19.2 16.4 21.8 8.4 30 10.2Z"
      />
      <path
        d="M26 36.5 33 43.5 47 28.5"
        fill="none"
        stroke="#fff"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1.2v9.6M1.2 6h9.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Apple() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.7 9.6c0-1.8 1.5-2.7 1.6-2.8-.9-1.3-2.2-1.4-2.7-1.5-1.1-.1-2.2.7-2.8.7s-1.5-.7-2.4-.6c-1.3 0-2.4.7-3.1 1.8-1.3 2.3-.3 5.6.9 7.5.6.9 1.4 1.9 2.4 1.9.9 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.6-.9 2.2-1.8c.7-1 1-2 1-2.1-.1 0-1.9-.7-2.1-2.9ZM11.4 4.4c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.4 2.2-1.1Z"
      />
    </svg>
  );
}

function Play() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M1 1.8c0-.8.9-1.3 1.6-.9l12 7.2c.7.4.7 1.4 0 1.8l-12 7.2c-.7.4-1.6-.1-1.6-.9V1.8Z"
      />
    </svg>
  );
}
