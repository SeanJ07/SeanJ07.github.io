# Portfolio Design Review — Phase 3

**Model:** qwen3-vl:235b-instruct  
**Date:** June 2026  
**URL:** https://seanj07.github.io/

---

## Overall Assessment

The portfolio demonstrates strong visual design fundamentals. Dark theme with crimson (#c41e3a) and gold (#d4a574) accents is cohesive and memorable. Spacing is generous throughout. Typography hierarchy is clear. The reorder to lead with technical projects (Beneath Arcantum → Spool) works visually.

**Status:** Job-submittable as-is. The following are polish items, not blockers.

---

## 🔴 Critical (Fix Before Submitting)

### 1. Spool Card Missing Image

**Issue:** The Spool card shows a placeholder text "spool_hero.webp" instead of an actual screenshot. This is the only visual inconsistency in the entire grid.

**Impact:** Breaks the professional polish of the work section. A placeholder signals "unfinished."

**Fix:** 
- Take a screenshot of Spool running (the iPod-inspired UI)
- Export as WebP: `assets/img/projects/spool_hero.webp`
- Recommended dimensions: 800×600 or 1200×900 (16:9 or 4:3 aspect ratio to match other cards)
- If no screenshot available immediately, use a temporary solid-color placeholder with "Spool" text in the brand font rather than the filename placeholder

---

## 🟡 High Priority (Same Session If Possible)

### 2. Hero Lede Width on Large Screens

**Issue:** The new hero lede "CS student at CSUSB. I build games, apps, and tools. Looking for software dev and game dev roles." may feel cramped if the container is narrow. On very wide screens, it might stretch too wide.

**Fix:** 
- Check `max-width` on `.hero__lede` — ensure it doesn't exceed ~60ch (character units) for readability
- Current appears fine, but verify at 1920px+ width

### 3. Stats Block Number Sizing

**Issue:** The stats numbers (3.42, 4th, 5×) are large and bold, which is good. But "5×" uses a multiplication symbol that may render differently across browsers/devices.

**Fix:** 
- Consider using "5×" (times symbol) vs "5x" (letter x) — both work, but be consistent
- Ensure the × is legible at small sizes

### 4. Contact Button Row on Mobile

**Issue:** Not tested in this review, but four buttons in a horizontal row may overflow on mobile.

**Fix:** 
- Verify the button row wraps or stacks at <600px viewport
- If not already implemented, add `flex-wrap: wrap` to the button container

---

## 🟢 Polish (If Time Allows)

### 5. Card Hover States

**Current:** Cards are static — no visual feedback on hover.

**Suggested:** 
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
```
Or a subtle scale: `transform: scale(1.02)`

### 6. OG Image Optimization

**Current:** OG image points to `hourhand_hero.webp` — a social media screenshot.

**Suggested:** Create a dedicated 1200×630 OG card image with:
- Dark background (#100f0d)
- SEAN⟨J⟩ mark centered
- "CS Student & Developer" subtitle
- Your name at bottom

This looks cleaner when shared on LinkedIn/Discord than a social media screenshot.

### 7. Lightbox Gallery for Spool

**Current:** Spool card has no `data-gallery` attribute (no additional screenshots).

**Suggested:** Once you have Spool screenshots, add a gallery showing:
- Main UI
- Playlist view
- Cassette tape visualization (if visible)
- Settings or menu

### 8. Hourhand Studios Link

**Current:** Links to GitHub repo (`data-link="https://github.com/SeanJ07/hourhand-studios"`)

**Consider:** If the studio's Instagram or website is still live, link there instead. The deliverable is the social presence, not the code.

---

## ✅ What Works Well

| Element | Why It Works |
|---------|--------------|
| **Color palette** | Crimson + gold on dark is distinctive and memorable. Not another black-and-white dev portfolio. |
| **⟨J⟩ brand mark** | Consistent across hero, nav, footer. Strong identity. |
| **Card grid** | 3-column layout is balanced. Mix of image types (game screenshots, social media, logos) keeps it visually interesting. |
| **Stats block** | Numbers-first design is scannable. Gold accent on GPA draws attention to the achievement. |
| **Typography** | Clear hierarchy: eyebrow → title → body → tags. No confusion about what's important. |
| **Spacing** | Generous whitespace everywhere. Sections breathe. |
| **Accessibility** | aria-label on hero mark, aria-hidden on decorative brackets. Proper heading levels. |

---

## 📱 Mobile Checklist (Not Tested)

- [ ] Hero text doesn't overflow at 375px width
- [ ] Card grid collapses to 1-2 columns on mobile
- [ ] Contact buttons stack vertically
- [ ] Stats block stacks below About text (not side-by-side)
- [ ] Navigation collapses to hamburger or stays accessible

---

## Final Verdict

| Criteria | Rating |
|----------|--------|
| Visual polish | 8/10 (would be 9/10 with Spool image) |
| Typography | 9/10 |
| Color usage | 9/10 |
| Spacing | 9/10 |
| Accessibility | 8/10 |
| Mobile readiness | ?/10 (not tested) |

**Recommendation:** Fix the Spool image (Critical #1), do a quick mobile check (High #4), then submit. The rest can wait.

---

## Action Items Summary

| Priority | Task | Owner |
|----------|------|-------|
| 🔴 | Add Spool screenshot to `assets/img/projects/spool_hero.webp` | Sean |
| 🟡 | Verify mobile button wrapping | Sean |
| 🟡 | Check hero lede max-width at 1920px+ | Optional |
| 🟢 | Add card hover states | Optional |
| 🟢 | Create dedicated OG image | Optional |
| 🟢 | Add Spool gallery images | Optional |
