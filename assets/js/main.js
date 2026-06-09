/* =================================================================
   Sean Jenkins — Portfolio JS
   Lightbox, scroll-reveal, masonry. No terminal, no bob.
   ================================================================= */

(function () {
  "use strict";

  // ---------- scroll reveal (subtle, IntersectionObserver) ----------
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    // No observer: show everything
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---------- nav scroll state ----------
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- masonry (simple row-span calc) ----------
  var grid = document.querySelector(".grid");
  if (grid && grid.classList.contains("is-masonry")) {
    var cards = grid.querySelectorAll(".card");
    var rowH = parseInt(getComputedStyle(grid).gridAutoRows) || 2;
    cards.forEach(function (card) {
      var body = card.querySelector(".card__body");
      var media = card.querySelector(".card__media");
      if (!body || !media) return;
      var h = media.offsetHeight + body.offsetHeight + 18;
      var span = Math.ceil(h / rowH);
      card.style.gridRowEnd = "span " + span;
    });
  }

  // ---------- lightbox ----------
  var overlay = document.getElementById("lightbox");
  var lbImg = overlay ? overlay.querySelector(".lightbox-img") : null;
  var lbTitle = overlay ? overlay.querySelector(".lightbox-title") : null;
  var lbDesc = overlay ? overlay.querySelector(".lightbox-desc") : null;
  var lbLink = overlay ? overlay.querySelector(".lightbox-link") : null;
  var lbClose = overlay ? overlay.querySelector(".lightbox-close") : null;

  function openLightbox(card) {
    var title = card.getAttribute("data-title") || "";
    var desc = card.getAttribute("data-desc") || "";
    var img = card.getAttribute("data-img") || "";
    var link = card.getAttribute("data-link") || "";

    if (!img || !overlay) return;

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

    // Gallery support
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

  // Click cards to open lightbox (event delegation)
  var gridEl = document.querySelector(".grid");
  if (gridEl && overlay) {
    gridEl.addEventListener("click", function (e) {
      var card = e.target.closest("[data-lightbox]");
      if (card) {
        e.preventDefault();
        openLightbox(card);
      }
    });

    // Make cards focusable and keyboard-accessible
    gridEl.querySelectorAll("[data-lightbox]").forEach(function (card) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "View " + (card.getAttribute("data-title") || "project"));
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });
  }

  if (lbClose) {
    lbClose.addEventListener("click", closeLightbox);
  }

  // Close on backdrop click
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
  }

  // ESC to close, arrow keys for nav
  document.addEventListener("keydown", function (e) {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") { closeLightbox(); return; }

    var allCards = gridEl ? Array.from(gridEl.querySelectorAll("[data-lightbox]")) : [];
    var currentSrc = lbImg ? lbImg.src : "";
    var currentIdx = -1;
    allCards.forEach(function (c, i) {
      if (c.getAttribute("data-img") === currentSrc) currentIdx = i;
    });

    if (e.key === "ArrowRight" && currentIdx < allCards.length - 1) {
      openLightbox(allCards[currentIdx + 1]);
    }
    if (e.key === "ArrowLeft" && currentIdx > 0) {
      openLightbox(allCards[currentIdx - 1]);
    }
  });

})();