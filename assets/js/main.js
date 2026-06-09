/* Sean Jenkins — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── terminal boot animation ─── */
  var terminal = document.getElementById("terminal");
  var heroContent = document.getElementById("hero-content");
  var booted = false;

  // If no terminal element (e.g., simplified page), show hero directly
  if (!terminal || !heroContent) {
    if (heroContent) heroContent.classList.add("visible");
    booted = true;
  }

  if (terminal && heroContent) {
    var lines = [
      { prompt: "> ", text: "initializing sean_jenkins.dev...", delay: 50 },
      { prompt: "> ", text: "loading creative_work... ", suffix: "✓", delay: 40, hold: 400 },
      { prompt: "> ", text: "loading game_dev... ", suffix: "✓", delay: 40, hold: 350 },
      { prompt: "> ", text: "loading ai_systems... ", suffix: "✓", delay: 40, hold: 350 },
      { prompt: "> ", text: "loading social_media... ", suffix: "✓", delay: 40, hold: 800 },
    ];

    var terminalLines = [
      document.getElementById("tl-1"),
      document.getElementById("tl-2"),
      document.getElementById("tl-3"),
      document.getElementById("tl-4"),
      document.getElementById("tl-5"),
    ];

    function typeLine(lineIndex) {
      if (lineIndex >= lines.length) {
        setTimeout(transitionToHero, 600);
        return;
      }

      var line = lines[lineIndex];
      var el = terminalLines[lineIndex];
      var text = line.text;
      var delay = line.delay || 50;

      el.innerHTML = '<span class="prompt">' + line.prompt + "</span>";

      var charIndex = 0;
      function typeChar() {
        if (charIndex < text.length) {
          el.innerHTML =
            '<span class="prompt">' +
            line.prompt +
            '</span><span class="typed">' +
            text.substring(0, charIndex + 1) +
            "</span>";
          charIndex++;
          setTimeout(typeChar, delay + Math.random() * 30);
        } else {
          if (line.suffix) {
            setTimeout(function () {
              el.innerHTML =
                '<span class="prompt">' +
                line.prompt +
                '</span><span class="typed">' +
                text +
                '</span><span class="check">' +
                line.suffix +
                "</span>";
            }, 200);
          }
          var holdTime = line.hold || 300;
          setTimeout(function () { typeLine(lineIndex + 1); }, holdTime);
        }
      }

      typeChar();
    }

    function transitionToHero() {
      if (booted) return;
      booted = true;

      terminal.classList.add("is-hidden");

      setTimeout(function () {
        terminal.style.display = "none";
        heroContent.classList.add("visible");
      }, 600);
    }

    // Skip on interaction — click or scroll immediately reveals the hero
    function skipBoot() {
      if (booted) return;
      booted = true;
      terminalLines.forEach(function (el) {
        if (el) el.innerHTML = "";
      });
      terminal.classList.add("is-hidden");
      setTimeout(function () {
        terminal.style.display = "none";
        heroContent.classList.add("visible");
      }, 100);
    }

    document.addEventListener("click", function (e) {
      if (!booted && terminal && terminal.contains(e.target)) {
        skipBoot();
      }
    });

    var scrollSkipTriggered = false;
    window.addEventListener("wheel", function () {
      if (!booted && !scrollSkipTriggered) {
        scrollSkipTriggered = true;
        skipBoot();
      }
    }, { passive: true });

    // Start typing after brief delay
    if (reduce) {
      terminal.style.display = "none";
      heroContent.classList.add("visible");
      booted = true;
    } else {
      setTimeout(function () { typeLine(0); }, 400);
    }
  }

  /* ─── nav: add hairline border once you scroll off the hero ─── */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ─── scroll-reveal with a gentle stagger ─── */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var parent = el.parentElement;
        var delay = 0;
        if (parent && parent.classList.contains("grid")) {
          delay = Array.prototype.indexOf.call(parent.children, el) % 3 * 80;
        }
        el.style.transitionDelay = delay + "ms";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ─── hero load reveal: nudge the first batch in immediately ─── */
  window.addEventListener("load", function () {
    document.querySelectorAll(".hero [data-reveal]").forEach(function (el, i) {
      if (reduce) { el.classList.add("is-in"); return; }
      el.style.transitionDelay = (i * 90) + "ms";
      requestAnimationFrame(function () { el.classList.add("is-in"); });
    });
  });

  /* ─── masonry packing: size each card by its real content height ─── */
  var grid = document.querySelector(".grid");
  if (grid) {
    var ROW = 2, GAP = 18;
    var single = window.matchMedia("(max-width: 560px)");

    function packOne(card) {
      card.style.gridRowEnd = "";
      var h = card.getBoundingClientRect().height;
      var span = Math.ceil((h + GAP) / (ROW + GAP));
      card.style.gridRowEnd = "span " + span;
    }
    function packAll() {
      if (single.matches) {
        grid.classList.remove("is-masonry");
        Array.prototype.forEach.call(grid.children, function (c) { c.style.gridRowEnd = ""; });
        return;
      }
      grid.classList.add("is-masonry");
      Array.prototype.forEach.call(grid.children, packOne);
    }

    var raf;
    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(packAll); }

    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    grid.querySelectorAll("img").forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", schedule);
      img.addEventListener("error", schedule);
    });
    schedule();
  }

  /* ─── lightbox ─── */
  var overlay = document.getElementById("lightbox");
  var lbImg = overlay ? overlay.querySelector(".lightbox-img") : null;
  var lbTitle = overlay ? overlay.querySelector(".lightbox-title") : null;
  var lbDesc = overlay ? overlay.querySelector(".lightbox-desc") : null;
  var lbLink = overlay ? overlay.querySelector(".lightbox-link") : null;
  var lbClose = overlay ? overlay.querySelector(".lightbox-close") : null;

  function openLightbox(card) {
    if (!overlay || !lbImg) return;
    var title = card.getAttribute("data-title") || "";
    var desc = card.getAttribute("data-desc") || "";
    var img = card.getAttribute("data-img") || "";
    var link = card.getAttribute("data-link") || "";

    lbImg.src = img;
    lbImg.alt = title;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;

    if (link) {
      lbLink.href = link;
      lbLink.style.display = "";
      lbLink.textContent = "View project";
    } else {
      lbLink.style.display = "none";
    }

    // Gallery support: if data-gallery exists, show thumbnails
    var gallery = card.getAttribute("data-gallery") || "";
    var galleryEl = overlay.querySelector(".lightbox-gallery");
    if (galleryEl) {
      if (gallery) {
        var imgs = gallery.split(",");
        galleryEl.innerHTML = "";
        imgs.forEach(function (src) {
          var thumb = document.createElement("img");
          thumb.src = src;
          thumb.alt = title + " detail";
          thumb.className = "lightbox-thumb";
          thumb.addEventListener("click", function (e) {
            e.stopPropagation();
            lbImg.src = src;
          });
          galleryEl.appendChild(thumb);
        });
        galleryEl.style.display = "flex";
      } else {
        galleryEl.innerHTML = "";
        galleryEl.style.display = "none";
      }
    }

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Click cards to open lightbox (event delegation on the grid)
  var gridEl = document.querySelector(".grid");
  if (gridEl && overlay) {
    gridEl.addEventListener("click", function (e) {
      var card = e.target.closest("[data-lightbox]");
      if (card) openLightbox(card);
    });
    gridEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var card = e.target.closest("[data-lightbox]");
        if (card) {
          e.preventDefault();
          openLightbox(card);
        }
      }
    });
  }

  // Set a11y attributes on lightbox cards
  document.querySelectorAll("[data-lightbox]").forEach(function (card) {
    card.style.cursor = "pointer";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View " + (card.getAttribute("data-title") || "project"));
  });

  // Close lightbox
  if (lbClose) {
    lbClose.addEventListener("click", closeLightbox);
  }
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();