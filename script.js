/* =========================================
   NAZARIO DIVAIO — SHARED PORTFOLIO SCRIPT
   ========================================= */

/* Scroll progress indicator — created on every page using this script. */
const progressTrack = document.createElement("div");
progressTrack.className = "scroll-progress";
progressTrack.setAttribute("role", "progressbar");
progressTrack.setAttribute("aria-label", "Page scroll progress");
progressTrack.setAttribute("aria-valuemin", "0");
progressTrack.setAttribute("aria-valuemax", "100");
progressTrack.setAttribute("aria-valuenow", "0");
progressTrack.innerHTML = '<span class="scroll-progress-bar"></span>';
document.body.appendChild(progressTrack);
const progressBar = progressTrack.querySelector(".scroll-progress-bar");
let progressFramePending = false;
function updateScrollProgress() {
  if (progressFramePending) return;
  progressFramePending = true;
  window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
      : 0;
    progressBar.style.width = `${progress}%`;
    progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));
    progressFramePending = false;
  });
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

/* Mobile navigation — shared by the homepage and category archives. */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const menuLabel = menuToggle && menuToggle.querySelector(".menu-label");
const navLinks = document.querySelectorAll(".nav-link");
let previousBodyOverflow = "";
let mobileMenuBackdrop = null;

function isMobileNavigation() {
  return window.matchMedia("(max-width: 760px)").matches;
}

if (menuToggle && mainNav) {
  mobileMenuBackdrop = document.createElement("div");
  mobileMenuBackdrop.className = "mobile-menu-backdrop";
  mobileMenuBackdrop.hidden = true;
  mobileMenuBackdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(mobileMenuBackdrop);

  function openMobileMenu() {
    if (!isMobileNavigation()) return;
    document.body.classList.remove("desktop-nav-collapsed");
    previousBodyOverflow = document.body.style.overflow;
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    mainNav.classList.add("is-open");
    mobileMenuBackdrop.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    if (menuLabel) menuLabel.textContent = "CLOSE NAV";
    mainNav.inert = false;
    const firstLink = mainNav.querySelector("a[href]");
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu(restoreFocus = false) {
    if (!menuToggle || !mainNav) return;
    const wasOpen = mainNav.classList.contains("is-open");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = previousBodyOverflow;
    if (mobileMenuBackdrop) mobileMenuBackdrop.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", isMobileNavigation() ? "Open navigation menu" : "Hide navigation");
    if (menuLabel) menuLabel.textContent = isMobileNavigation() ? "MENU" : "HIDE NAV";
    if (restoreFocus && wasOpen) menuToggle.focus();
  }

  function setDesktopNavigationCollapsed(collapsed) {
    document.body.classList.toggle("desktop-nav-collapsed", collapsed);
    mainNav.inert = collapsed;
    menuToggle.setAttribute("aria-expanded", String(!collapsed));
    menuToggle.setAttribute("aria-label", collapsed ? "Open navigation" : "Hide navigation");
    if (menuLabel) menuLabel.textContent = collapsed ? "OPEN NAV" : "HIDE NAV";
  }

  menuToggle.setAttribute("aria-label", isMobileNavigation() ? "Open navigation menu" : "Hide navigation");
  if (menuLabel) menuLabel.textContent = isMobileNavigation() ? "MENU" : "HIDE NAV";
  menuToggle.setAttribute("aria-expanded", String(!isMobileNavigation()));
  if (!isMobileNavigation()) mainNav.inert = false;
  menuToggle.addEventListener("click", () => {
    if (isMobileNavigation()) {
      if (mainNav.classList.contains("is-open")) closeMobileMenu(false);
      else openMobileMenu();
      return;
    }
    setDesktopNavigationCollapsed(!document.body.classList.contains("desktop-nav-collapsed"));
  });

  mobileMenuBackdrop.addEventListener("click", () => closeMobileMenu(true));
  navLinks.forEach(link => link.addEventListener("click", () => {
    if (isMobileNavigation()) closeMobileMenu(false);
  }));

  document.addEventListener("keydown", event => {
    if (!mainNav.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu(true);
      return;
    }

    if (event.key === "Tab") {
      const focusableItems = Array.from(mainNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusableItems.length) {
        event.preventDefault();
        menuToggle.focus();
        return;
      }
      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      const focusIsInMenu = mainNav.contains(document.activeElement);
      if (!focusIsInMenu) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === mainNav)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (isMobileNavigation()) {
      document.body.classList.remove("desktop-nav-collapsed");
      mainNav.inert = false;
      menuToggle.setAttribute("aria-expanded", String(mainNav.classList.contains("is-open")));
      menuToggle.setAttribute("aria-label", mainNav.classList.contains("is-open") ? "Close navigation menu" : "Open navigation menu");
      if (menuLabel) menuLabel.textContent = mainNav.classList.contains("is-open") ? "CLOSE NAV" : "MENU";
    } else {
      if (mainNav.classList.contains("is-open")) closeMobileMenu(false);
      mainNav.inert = document.body.classList.contains("desktop-nav-collapsed");
      menuToggle.setAttribute("aria-expanded", String(!mainNav.inert));
      menuToggle.setAttribute("aria-label", mainNav.inert ? "Open navigation" : "Hide navigation");
      if (menuLabel) menuLabel.textContent = mainNav.inert ? "OPEN NAV" : "HIDE NAV";
    }
  });
}

/* Highlight visible homepage section. */
const sections = document.querySelectorAll("main section[id]");
function setActiveLink(sectionId) {
  navLinks.forEach(link => {
    const active = link.getAttribute("href") === "#" + sectionId;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setActiveLink(visible[0].target.id);
  }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] });
  sections.forEach(section => sectionObserver.observe(section));
}

/* Legacy project filters: safely runs only where present. */
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach(card => {
      const matches = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-filtered-out", !matches);
    });
  });
});

/* Copy email shortcut with Clipboard API and a legacy fallback. */
async function copyTextToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      // Try the fallback below when clipboard permission is denied.
    }
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = value;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.left = "-9999px";
  temporaryInput.style.top = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  temporaryInput.setSelectionRange(0, temporaryInput.value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  temporaryInput.remove();
  return copied;
}

document.querySelectorAll(".copy-email").forEach(button => {
  button.addEventListener("click", async () => {
    const email = button.dataset.copyEmail || "nazariodivaio@gmail.com";
    const status = button.parentElement.querySelector(".copy-email-status");
    button.disabled = true;
    const copied = await copyTextToClipboard(email);
    button.disabled = false;
    if (status) {
      status.hidden = false;
      status.textContent = copied
        ? "Email address copied to clipboard."
        : `Copy unavailable. You can copy this address manually: ${email}`;
    }
  });
});

/* Shared dark/light theme. */
const themeToggle = document.getElementById("themeToggle");
function getSavedTheme() {
  try {
    const value = localStorage.getItem("portfolio-theme");
    if (value === "light" || value === "dark") return value;
  } catch (error) {}
  return "dark";
}
function applyTheme(theme) {
  const light = theme === "light";
  document.body.classList.toggle("light-theme", light);
  if (!themeToggle) return;
  themeToggle.textContent = light ? "☾ DARK MODE" : "☼ LIGHT MODE";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.setAttribute("aria-pressed", String(light));
}
applyTheme(getSavedTheme());
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("light-theme") ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch (error) {}
  });
}

/* Back to top. */
const backToTop = document.getElementById("backToTop");
function updateBackToTop() {
  if (backToTop) backToTop.hidden = window.scrollY < 400;
}
if (backToTop) {
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });
}

/* Sarawak local time. */
const localTime = document.getElementById("localTime");
function updateMalaysiaTime() {
  if (!localTime) return;
  const time = new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuching", hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date());
  localTime.textContent = "SARAWAK / " + time;
}
if (localTime) {
  updateMalaysiaTime();
  setInterval(updateMalaysiaTime, 60000);
}

/* Expandable notes for any legacy project cards. */
document.querySelectorAll(".project-details-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const details = document.getElementById(button.getAttribute("aria-controls"));
    if (!details) return;
    const expand = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(expand));
    details.hidden = !expand;
    button.innerHTML = expand
      ? 'CLOSE NOTES <span aria-hidden="true">−</span>'
      : 'PROJECT NOTES <span aria-hidden="true">+</span>';
  });
});

/* Current year. */
const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();
