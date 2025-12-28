document.addEventListener("DOMContentLoaded", () => {
  // Always make page visible (prevents "blank page" if other code fails later)
  const page = document.querySelector(".page");
  if (page) requestAnimationFrame(() => page.classList.add("page-ready"));

  /* =========================
     HEADER SCROLL + NAV STAGGER
  ========================= */
  const header = document.querySelector("header");
  let navStaggerPlayed = false;

  const onScrollHeader = () => {
    const scrolled = window.scrollY > 40;

    if (header) header.classList.toggle("is-scrolled", scrolled);
    document.body.classList.toggle("is-scrolled", window.scrollY > 80);

    if (header && scrolled && !navStaggerPlayed) {
      header.classList.add("nav-stagger-once");
      navStaggerPlayed = true;
    }
  };

  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* =========================
     MOBILE NAV TOGGLE (LOCK SCROLL) — GLOBAL
  ========================= */
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  // iOS-friendly scroll lock (overflow:hidden alone is not reliable on Safari)
  let scrollY = 0;

  const lockScroll = () => {
    scrollY = window.scrollY || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  };

  const setMenuOpen = (open) => {
    if (!navList) return;
    navList.classList.toggle("open", open);

    // lock/unlock page behind menu
    if (open) lockScroll();
    else unlockScroll();

    // optional: accessibility state
    if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (navToggle && navList) {
    // ensure aria-expanded exists
    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      const open = !navList.classList.contains("open");
      setMenuOpen(open);
    });

    // close menu when clicking a link
    navList.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });

    // close on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  /* =========================
     REVEAL ON SCROLL
  ========================= */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* =========================
     LUXURY GALLERY (CINEMATIC + RAIL ONLY)
  ========================= */
  const heroImg = document.getElementById("luxHeroImg");
  const counter = document.getElementById("luxCounter");
  const prevBtn = document.getElementById("luxPrev");
  const nextBtn = document.getElementById("luxNext");
  const openBtn = document.getElementById("luxOpen");
  const railTrack = document.getElementById("luxRailTrack");

  const lightbox = document.getElementById("luxLightbox");
  const lightboxImg = document.getElementById("luxLightboxImg");
  const lightboxClose = document.getElementById("luxLightboxClose");

  // If gallery is not on this page, skip cleanly
  if (heroImg && railTrack) {
    // Use page-specific gallery images if provided; otherwise use homepage defaults
const images = (Array.isArray(window.LUX_GALLERY_IMAGES) && window.LUX_GALLERY_IMAGES.length)
  ? window.LUX_GALLERY_IMAGES
  : [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/fa/b3/56/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/fa/b3/8a/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/8f/98/42/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/bd/78/30/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/ab/fe/84/img-20180414-085210415.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/dc/9c/89/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/85/2e/ad/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/af/fd/c6/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/a7/d8/9e/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/af/fe/eb/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/01/82/bd/photo0jpg.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/c4/af/6f/colazione-al-trulli-colarossa.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/a6/b4/ed/trulli-colarossa-bed.jpg?w=800&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/af/fe/bd/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/ab/fe/82/img-20180412-191213658.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/70/5f/ce/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/c0/07/07/caption.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/00/ab/46/trulli-colarossa.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/00/ab/20/trulli-colarossa.jpg?w=1000&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/87/4a/59/trulli-colarossa-bed.jpg?w=1000&h=-1&s=1",
      "https://www.trullicolarossa.it/images/slide-complesso/2.jpg",
      "https://www.trullicolarossa.it/images/slide-complesso/3.jpg",
      "https://www.trullicolarossa.it/images/slide-complesso/6.jpg"
    ];


    let index = 0;
    let autoplayTimer = null;

    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = window.setInterval(() => setHero(index + 1, { scrollThumb: false }), 5200);
    };

    const setHero = (i, { scrollThumb = true } = {}) => {
      index = (i + images.length) % images.length;

      heroImg.style.opacity = "0";
      window.setTimeout(() => {
        heroImg.src = images[index];
        heroImg.style.opacity = "1";
      }, 140);

      if (counter) {
        const a = String(index + 1).padStart(2, "0");
        const b = String(images.length).padStart(2, "0");
        counter.textContent = `${a} / ${b}`;
      }

      const thumbs = railTrack.querySelectorAll(".lux-thumb");
      thumbs.forEach((t) => t.classList.remove("is-active"));
      const active = thumbs[index];
      if (active) {
        active.classList.add("is-active");
        if (scrollThumb) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    };

    const openLightbox = (src) => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    };

    // Build thumbnails
    railTrack.innerHTML = "";
    images.forEach((src, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lux-thumb";
      btn.setAttribute("aria-label", `Open photo ${i + 1}`);
      btn.innerHTML = `<img src="${src}" alt="Gallery thumbnail ${i + 1}" loading="lazy">`;
      btn.addEventListener("click", () => {
        stopAutoplay();
        setHero(i);
        startAutoplay();
      });
      railTrack.appendChild(btn);
    });

    prevBtn?.addEventListener("click", () => { stopAutoplay(); setHero(index - 1); startAutoplay(); });
    nextBtn?.addEventListener("click", () => { stopAutoplay(); setHero(index + 1); startAutoplay(); });
    openBtn?.addEventListener("click", () => { stopAutoplay(); openLightbox(images[index]); });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

    setHero(0, { scrollThumb: false });
    startAutoplay();
  }

  /* =========================
     HERO PARALLAX (YOUR EXISTING .hero BACKGROUND)
  ========================= */
  const hero = document.querySelector(".hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (hero && !reduceMotion.matches) {
    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (rect.bottom < 0 || rect.top > vh) return;

      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      hero.style.setProperty("--hero-parallax", `${progress * 26}px`);
      hero.style.setProperty("--hero-content-parallax", `${progress * 10}px`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();
  }

  /* =========================
     PAGE TRANSITIONS (INTERNAL LINKS)
  ========================= */
  if (page) {
    document.querySelectorAll("a[href]").forEach((link) => {
      const url = link.getAttribute("href");

      // ignore external/new tab/anchors
      if (
        !url ||
        url.startsWith("#") ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        url.startsWith("http")
      ) return;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        page.classList.remove("page-ready");
        page.classList.add("page-exit");

        setTimeout(() => {
          window.location.href = url;
        }, 320);
      });
    });
  }
});


