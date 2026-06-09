/* Sean Jenkins — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── terminal boot animation ─── */
  var terminal = document.getElementById("terminal");
  var heroContent = document.getElementById("hero-content");
  var booted = false;

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
              "</span><span class=\"check\">" +
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
    // Clear all terminal lines
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
      // Clicking the terminal itself skips the boot
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
    // Reduced motion: skip terminal entirely, show hero
    terminal.style.display = "none";
    heroContent.classList.add("visible");
  } else {
    setTimeout(function () { typeLine(0); }, 400);
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
        // stagger cards within the work grid by their order
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
    // re-pack as each image finishes loading (heights shift)
    grid.querySelectorAll("img").forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", schedule);
      img.addEventListener("error", schedule);
    });
    schedule();
  }

  /* ─── video play button hint ─── */
  var videoBtn = document.querySelector(".card__media--video");
  if (videoBtn) {
    videoBtn.addEventListener("click", function () {
      var meta = videoBtn.querySelector(".video__meta i");
      if (meta && !videoBtn.dataset.told) {
        videoBtn.dataset.told = "1";
        var original = meta.textContent;
        meta.textContent = "add BACOMMERCIAL.mp4 to wire up playback";
        setTimeout(function () { meta.textContent = original; }, 2600);
      }
    });
  }
})();