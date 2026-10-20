
/* 1. Mobile navigation */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

function closeMobileMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = 'MENU <span aria-hidden="true">+</span>';
}

menuToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.innerHTML = isOpen
    ? 'CLOSE <span aria-hidden="true">−</span>'
    : 'MENU <span aria-hidden="true">+</span>';
});

navLinks.forEach(function (link) {
  link.addEventListener("click", closeMobileMenu);
});


/* 2. Highlight the navigation item for the visible section */

const sections = document.querySelectorAll("main section[id]");

function setActiveLink(sectionId) {
  navLinks.forEach(function (link) {
    const isActive =
      link.getAttribute("href") === "#" + sectionId;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      const visibleSections = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

      if (visibleSections.length > 0) {
        setActiveLink(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}


/* 3. Filter projects by category */

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach(function (item) {
      const isSelected = item === button;

      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach(function (card) {
      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.classList.toggle("is-filtered-out", !matchesCategory);
    });
  });
});


/* 4. Switch between dark and bright light themes */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  themeToggle.textContent = isLight
    ? "☾ DARK MODE"
    : "☼ LIGHT MODE";

  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );

  themeToggle.setAttribute("aria-pressed", String(isLight));
}

let savedTheme = "dark";

try {
  const storedTheme = localStorage.getItem("portfolio-theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    savedTheme = storedTheme;
  }
} catch (error) {
  savedTheme = "dark";
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", function () {
  const nextTheme = document.body.classList.contains("light-theme")
    ? "dark"
    : "light";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    // Theme switching still works if storage is unavailable.
  }
});


/* 5. Show the back-to-top button after scrolling */

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
  backToTop.hidden = window.scrollY < 400;
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

updateBackToTop();

backToTop.addEventListener("click", function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });
});


/* 6. Display the current time in Sarawak, Malaysia */

const localTime = document.getElementById("localTime");

function updateMalaysiaTime() {
  if (!localTime) {
    return;
  }

  const time = new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuching",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());

  localTime.textContent = "SARAWAK / " + time;
}

updateMalaysiaTime();
setInterval(updateMalaysiaTime, 60000);


/* 7. Expand and collapse project notes */

const detailButtons = document.querySelectorAll(
  ".project-details-toggle"
);

detailButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const detailsId = button.getAttribute("aria-controls");
    const details = document.getElementById(detailsId);

    if (!details) {
      return;
    }

    const shouldExpand =
      button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(shouldExpand));
    details.hidden = !shouldExpand;

    button.innerHTML = shouldExpand
      ? 'CLOSE NOTES <span aria-hidden="true">−</span>'
      : 'PROJECT NOTES <span aria-hidden="true">+</span>';
  });
});


/* 8. Automatically update the footer year */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
