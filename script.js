const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const searchTrigger = document.querySelector(".search-trigger");
const searchPanel = document.querySelector(".search-panel");
const searchClose = document.querySelector(".search-close");
const searchForm = document.querySelector("#searchForm");
const siteSearch = document.querySelector("#siteSearch");
const searchMessage = document.querySelector("#searchMessage");

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

function openSearch() {
  searchPanel.classList.add("is-open");
  searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");

  setTimeout(() => siteSearch?.focus(), 100);
}

function closeSearch() {
  searchPanel.classList.remove("is-open");
  searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}

searchTrigger?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeSearch();

    mainNav?.classList.remove("is-open");

    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove("menu-open");
  }
});

searchForm?.addEventListener("submit", e => {
  e.preventDefault();

  const query = siteSearch.value.trim();

  searchMessage.textContent = query
    ? `Search submitted for “${query}”. Connect this form to GGA's CMS/search endpoint.`
    : "Enter a search term.";
});


/* ======================================================
   REVEAL ANIMATIONS
====================================================== */

const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add(
          "is-visible"
        );

        observer.unobserve(
          entry.target
        );
      }

    });

  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach(el => observer.observe(el));


/* ======================================================
   COUNTERS
====================================================== */

const counters =
  document.querySelectorAll(".counter");

const counterObserver =
  new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;

      const target =
        Number(el.dataset.target || 0);

      const duration = 1400;

      const start =
        performance.now();

      const tick = now => {

        const progress =
          Math.min(
            (now - start) / duration,
            1
          );

        const eased =
          1 - Math.pow(
            1 - progress,
            3
          );

        el.textContent =
          Math.floor(
            target * eased
          );

        if (progress < 1) {
          requestAnimationFrame(tick);
        }

      };

      requestAnimationFrame(tick);

      counterObserver.unobserve(el);

    });

  },
  {
    threshold: 0.6
  }
);

counters.forEach(
  counter =>
    counterObserver.observe(counter)
);


/* ======================================================
   REGION BUTTONS
====================================================== */

document
  .querySelectorAll(".region-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".region-btn")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        const status =
          document.querySelector(
            ".region-status"
          );

        if (status) {
          status.textContent =
            `Selected: ${button.dataset.region}`;
        }

      }
    );

  });


/* ======================================================
   NEWSLETTER
====================================================== */

document
  .querySelector("#newsletterForm")
  ?.addEventListener(
    "submit",
    e => {

      e.preventDefault();

      const email =
        document
          .querySelector("#email")
          ?.value.trim();

      const message =
        document.querySelector(
          "#formMessage"
        );

      if (!email || !message) {
        return;
      }

      message.textContent =
        `Thanks — ${email} has been captured for the demo. Connect this form to your newsletter provider.`;

      e.target.reset();

    }
  );


/* ======================================================
   YEAR
====================================================== */

const year =
  document.querySelector("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}


/* ======================================================
   INSIGHTS CATEGORY FILTERS
====================================================== */

document
  .querySelectorAll(".filter-btn")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter-btn")
          .forEach(b =>
            b.classList.remove("active")
          );

        btn.classList.add("active");

        const category =
          btn.dataset.filter;

        document
          .querySelectorAll(
            ".insight-list .insight-card"
          )
          .forEach(card => {

            const show =
              category === "all" ||
              card.dataset.category ===
                category;

            card.style.display =
              show ? "" : "none";

          });

      }
    );

  });


/* ======================================================
   AFRICA MAP
   GGA COUNTRIES + 5 AFRICAN REGIONS
====================================================== */

const tooltip =
  document.getElementById(
    "country-tooltip"
  );

const paths =
  document.querySelectorAll(
    "#africa-map .country"
  );


/* ======================================================
   IMPORTANT

   These country names match the EXACT path order
   inside your Africa SVG.

   DO NOT CHANGE THIS ORDER.
====================================================== */

const svgCountryOrder = [

  "Tanzania",                          // 0
  "Western Sahara",                    // 1
  "Democratic Republic of the Congo", // 2
  "Somalia",                           // 3
  "Kenya",                             // 4
  "Sudan",                             // 5
  "Chad",                              // 6
  "South Africa",                      // 7
  "Lesotho",                           // 8
  "Zimbabwe",                          // 9
  "Botswana",                          // 10
  "Namibia",                           // 11
  "Senegal",                           // 12
  "Mali",                              // 13
  "Mauritania",                        // 14
  "Benin",                             // 15
  "Niger",                             // 16
  "Nigeria",                           // 17
  "Cameroon",                          // 18
  "Togo",                              // 19
  "Ghana",                             // 20
  "Côte d’Ivoire",                     // 21
  "Guinea",                            // 22
  "Guinea-Bissau",                     // 23
  "Liberia",                           // 24
  "Sierra Leone",                      // 25
  "Burkina Faso",                      // 26
  "Central African Republic",          // 27
  "Republic of the Congo",             // 28
  "Gabon",                             // 29
  "Equatorial Guinea",                 // 30
  "Zambia",                            // 31
  "Malawi",                            // 32
  "Mozambique",                        // 33
  "Eswatini",                          // 34
  "Angola",                            // 35
  "Burundi",                           // 36
  "Madagascar",                        // 37
  "The Gambia",                        // 38
  "Tunisia",                           // 39
  "Algeria",                           // 40
  "Eritrea",                           // 41
  "Morocco",                           // 42
  "Egypt",                             // 43
  "Libya",                             // 44
  "Ethiopia",                          // 45
  "Djibouti",                          // 46
  "Somaliland",                        // 47
  "Uganda",                            // 48
  "Rwanda",                            // 49
  "South Sudan"                        // 50

];


/* ======================================================
   FOUR MAIN GGA COUNTRIES

   These remain individual countries.

   They take priority over regional grouping.
====================================================== */

const ggaCountries = {

  "South Africa": {

    name: "South Africa",

    capital: "Pretoria",

    region: "Southern Africa",

    type: "country",

    url: "/countries/south-africa.html"

  },


  "Ethiopia": {

    name: "Ethiopia",

    capital: "Addis Ababa",

    region: "East Africa / Horn of Africa",

    type: "country",

    url: "/countries/ethiopia.html"

  },


  "Ghana": {

    name: "Ghana",

    capital: "Accra",

    region: "West Africa",

    type: "country",

    url: "/countries/ghana.html"

  },


  "Nigeria": {

    name: "Nigeria",

    capital: "Abuja",

    region: "West Africa",

    type: "country",

    url: "nigeria.html"

  }

};


/* ======================================================
   AFRICAN REGIONS
====================================================== */

const regionDefinitions = {


  /* ==================================================
     NORTH AFRICA
  ================================================== */

  "north-africa": {

    name: "North Africa",

    type: "region",

    url: "/regions/north-africa.html",

    countries: [

      "Western Sahara",
      "Morocco",
      "Algeria",
      "Tunisia",
      "Libya",
      "Egypt",
      "Sudan"

    ]

  },


  /* ==================================================
     WEST AFRICA
  ================================================== */

  "west-africa": {

    name: "West Africa",

    type: "region",

    url: "/regions/west-africa.html",

    countries: [

      "Mauritania",
      "Mali",
      "Senegal",
      "The Gambia",
      "Guinea",
      "Guinea-Bissau",
      "Sierra Leone",
      "Liberia",
      "Côte d’Ivoire",
      "Burkina Faso",
      "Niger",
      "Benin",
      "Togo"

      /*
       Ghana and Nigeria are deliberately
       NOT listed here.

       They are handled individually above.
      */

    ]

  },


  /* ==================================================
     CENTRAL AFRICA
  ================================================== */

  "central-africa": {

    name: "Central Africa",

    type: "region",

    url: "/regions/central-africa.html",

    countries: [

      "Chad",
      "Cameroon",
      "Central African Republic",
      "Democratic Republic of the Congo",
      "Republic of the Congo",
      "Gabon",
      "Equatorial Guinea"

    ]

  },


  /* ==================================================
     EAST AFRICA
  ================================================== */

  "east-africa": {

    name: "East Africa",

    type: "region",

    url: "/regions/east-africa.html",

    countries: [

      "Tanzania",
      "Somalia",
      "Kenya",
      "Eritrea",
      "Djibouti",
      "Somaliland",
      "Uganda",
      "Rwanda",
      "Burundi",
      "South Sudan"

      /*
       Ethiopia is deliberately NOT listed.

       Ethiopia is one of the four
       individual GGA countries.
      */

    ]

  },


  /* ==================================================
     SOUTHERN AFRICA
  ================================================== */

  "southern-africa": {

    name: "Southern Africa",

    type: "region",

    url: "/regions/southern-africa.html",

    countries: [

      "Angola",
      "Zambia",
      "Malawi",
      "Mozambique",
      "Zimbabwe",
      "Botswana",
      "Namibia",
      "Lesotho",
      "Eswatini",
      "Madagascar"

      /*
       South Africa is deliberately
       NOT listed here.

       It is handled individually above.
      */

    ]

  }

};


/* ======================================================
   ASSIGN REAL COUNTRY NAMES TO SVG PATHS
====================================================== */

paths.forEach(
  (path, index) => {

    const countryName =
      svgCountryOrder[index];

    if (!countryName) {
      return;
    }

    path.dataset.countryName =
      countryName;

    path.dataset.index =
      index;

  }
);


/* ======================================================
   FIND REGION FOR COUNTRY
====================================================== */

function findRegion(countryName) {

  for (
    const [regionKey, region]
    of Object.entries(
      regionDefinitions
    )
  ) {

    if (
      region.countries.includes(
        countryName
      )
    ) {

      return {

        ...region,

        key: regionKey

      };

    }

  }

  return null;

}


/* ======================================================
   GET MAP TARGET

   IMPORTANT:
   GGA individual countries are checked FIRST.

   Therefore Ghana, Nigeria, Ethiopia and
   South Africa will remain individually selectable.
====================================================== */

function getMapTarget(path) {

  const countryName =
    path.dataset.countryName;

  if (!countryName) {
    return null;
  }


  /* -----------------------------------------------
     FIRST:
     Check four individual GGA countries
  ----------------------------------------------- */

  if (
    ggaCountries[countryName]
  ) {

    return {

      ...ggaCountries[
        countryName
      ],

      key: countryName
        .toLowerCase()
        .replace(/\s+/g, "-")

    };

  }


  /* -----------------------------------------------
     SECOND:
     Check regional grouping
  ----------------------------------------------- */

  const region =
    findRegion(countryName);

  if (region) {
    return region;
  }


  /* -----------------------------------------------
     Otherwise inactive
  ----------------------------------------------- */

  return null;

}


/* ======================================================
   TOOLTIP CONTENT
====================================================== */

function tooltipHTML(target) {


  /* -----------------------------------------------
     Individual GGA country tooltip
  ----------------------------------------------- */

  if (
    target.type === "country"
  ) {

    return `

      <strong>
        ${target.name}
      </strong>

      <span>
        <b>Capital:</b>
        ${target.capital}
      </span>

      <span>
        <b>Region:</b>
        ${target.region}
      </span>

      <span class="hint">
        Click to view the country profile
      </span>

    `;

  }


  /* -----------------------------------------------
     Regional tooltip
  ----------------------------------------------- */

  return `

    <strong>
      ${target.name}
    </strong>

    <span>
      GGA Regional Coverage
    </span>

    <span class="hint">
      Click to view this region
    </span>

  `;

}


/* ======================================================
   REMOVE CURRENT MAP HIGHLIGHTS
====================================================== */

function clearMapHighlights() {

  document
    .querySelectorAll(
      "#africa-map .country.is-active"
    )
    .forEach(path => {

      path.classList.remove(
        "is-active"
      );

    });

}


/* ======================================================
   HIGHLIGHT COUNTRY OR REGION
====================================================== */

function highlightTarget(target) {

  clearMapHighlights();


  /* -----------------------------------------------
     INDIVIDUAL COUNTRY
  ----------------------------------------------- */

  if (
    target.type === "country"
  ) {

    paths.forEach(path => {

      if (
        path.dataset.countryName ===
        target.name
      ) {

        path.classList.add(
          "is-active"
        );

      }

    });

    return;

  }


  /* -----------------------------------------------
     ENTIRE REGION
  ----------------------------------------------- */

  const region =
    regionDefinitions[
      target.key
    ];

  if (!region) {
    return;
  }


  paths.forEach(path => {

    const countryName =
      path.dataset.countryName;

    if (
      region.countries.includes(
        countryName
      )
    ) {

      path.classList.add(
        "is-active"
      );

    }

  });

}


/* ======================================================
   SHOW TOOLTIP
====================================================== */

function showTooltip(path) {

  const target =
    getMapTarget(path);

  if (
    !target ||
    !tooltip
  ) {
    return;
  }


  /* Highlight correct country/region */

  highlightTarget(target);


  /* Update tooltip */

  tooltip.innerHTML =
    tooltipHTML(target);


  /* Display tooltip */

  tooltip.style.display =
    "block";


  tooltip.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* ======================================================
   HIDE TOOLTIP
====================================================== */

function hideTooltip() {

  clearMapHighlights();

  if (!tooltip) {
    return;
  }

  tooltip.style.display =
    "none";

  tooltip.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* ======================================================
   MAP EVENTS
====================================================== */

paths.forEach(path => {

  const target =
    getMapTarget(path);


  /* -----------------------------------------------
     Disable unused countries
  ----------------------------------------------- */

  if (!target) {

    path.classList.add(
      "map-inactive"
    );

    path.removeAttribute(
      "tabindex"
    );

    return;

  }


  /* -----------------------------------------------
     Make map path interactive
  ----------------------------------------------- */

  path.classList.add(
    "map-interactive"
  );


  path.setAttribute(
    "tabindex",
    "0"
  );


  path.setAttribute(
    "role",
    "link"
  );


  path.setAttribute(
    "aria-label",
    target.name
  );


  /* ==================================================
     DESKTOP HOVER
  ================================================== */

  path.addEventListener(
    "mouseenter",
    () => {

      showTooltip(path);

    }
  );


  path.addEventListener(
    "mouseleave",
    () => {

      hideTooltip();

    }
  );


  /* ==================================================
     KEYBOARD FOCUS
  ================================================== */

  path.addEventListener(
    "focus",
    () => {

      showTooltip(path);

    }
  );


  path.addEventListener(
    "blur",
    () => {

      hideTooltip();

    }
  );


  /* ==================================================
     CLICK / MOBILE TAP
  ================================================== */

  path.addEventListener(
    "click",
    event => {

      event.preventDefault();


      const selectedTarget =
        getMapTarget(path);


      if (!selectedTarget) {
        return;
      }


      /* -----------------------------------------------
         MOBILE / TOUCH DEVICE

         First tap:
         Show tooltip and highlight.

         Second tap:
         Follow URL.
      ----------------------------------------------- */

      if (
        window.matchMedia(
          "(hover: none)"
        ).matches
      ) {

        if (
          !path.classList.contains(
            "mobile-selected"
          )
        ) {

          document
            .querySelectorAll(
              "#africa-map .mobile-selected"
            )
            .forEach(p => {

              p.classList.remove(
                "mobile-selected"
              );

            });


          path.classList.add(
            "mobile-selected"
          );


          showTooltip(path);


          return;

        }

      }


      /* -----------------------------------------------
         Navigate to page
      ----------------------------------------------- */

      window.location.href =
        selectedTarget.url;

    }
  );


  /* ==================================================
     KEYBOARD NAVIGATION
  ================================================== */

  path.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();


        const selectedTarget =
          getMapTarget(path);


        if (selectedTarget) {

          window.location.href =
            selectedTarget.url;

        }

      }

    }
  );

});


/* ======================================================
   MOBILE

   TAP OUTSIDE MAP TO CLOSE TOOLTIP
====================================================== */

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        "#africa-map"
      ) &&
      !event.target.closest(
        "#country-tooltip"
      )
    ) {

      document
        .querySelectorAll(
          "#africa-map .mobile-selected"
        )
        .forEach(path => {

          path.classList.remove(
            "mobile-selected"
          );

        });


      hideTooltip();

    }

  }
);

/* =========================================================
   AFRICA MAP — MOBILE TOUCH / FINGER HOVER
   ---------------------------------------------------------
   Allows the user to:
   - Tap a country
   - Hold finger down
   - Drag/rub finger across countries
   - Show country details like desktop mouse hover
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const map = document.querySelector("#africa-map");
  const tooltip = document.querySelector(".country-tooltip");

  if (!map || !tooltip) {
    console.warn("Africa map or country tooltip not found.");
    return;
  }

  const countries = map.querySelectorAll(".country");

  let activeCountry = null;
  let isTouchingMap = false;


  /* =====================================================
     FIND COUNTRY FROM SCREEN POSITION
  ===================================================== */

  function getCountryFromPoint(x, y) {

    const elements = document.elementsFromPoint(x, y);

    for (const element of elements) {

      if (
        element &&
        element.classList &&
        element.classList.contains("country")
      ) {
        return element;
      }

      const country = element?.closest?.("#africa-map .country");

      if (country) {
        return country;
      }
    }

    return null;
  }


  /* =====================================================
     GET COUNTRY INFORMATION

     This tries several common data attributes so it
     should work with your existing SVG structure.
  ===================================================== */

  function getCountryName(country) {

    return (
      country.dataset.name ||
      country.dataset.country ||
      country.getAttribute("aria-label") ||
      country.getAttribute("title") ||
      country.id
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase())
    );
  }


  function getCountryInfo(country) {

    return (
      country.dataset.info ||
      country.dataset.description ||
      country.dataset.details ||
      country.dataset.text ||
      ""
    );
  }


  function getCountryUrl(country) {

    return (
      country.dataset.url ||
      country.dataset.link ||
      country.dataset.href ||
      ""
    );
  }


  /* =====================================================
     SHOW COUNTRY
  ===================================================== */

  function showCountry(country) {

    if (!country) return;

    /* Don't keep firing if finger is still on same country */
    if (activeCountry === country) return;


    /* Remove previous active country */
    countries.forEach(item => {
      item.classList.remove("is-active");
    });


    /* Activate current country */
    country.classList.add("is-active");

    activeCountry = country;


    /* Get country information */
    const name = getCountryName(country);
    const info = getCountryInfo(country);
    const url = getCountryUrl(country);


    /* =================================================
       UPDATE TOOLTIP
    ================================================= */

    let html = `<strong>${name}</strong>`;

    if (info) {
      html += `<span>${info}</span>`;
    }

    if (url) {
      html += `<span class="hint">Tap again to view more →</span>`;
    } else {
      html += `<span class="hint">Move your finger across the map</span>`;
    }

    tooltip.innerHTML = html;


    /* Show tooltip */
    tooltip.classList.add("is-visible");
    tooltip.classList.add("active");
    tooltip.classList.add("show");

    tooltip.setAttribute("aria-hidden", "false");


    /* Optional vibration feedback */
    if (
      "vibrate" in navigator &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      navigator.vibrate(8);
    }
  }


  /* =====================================================
     TOUCH START
  ===================================================== */

  map.addEventListener(
    "touchstart",
    event => {

      if (!event.touches.length) return;

      isTouchingMap = true;

      const touch = event.touches[0];

      const country = getCountryFromPoint(
        touch.clientX,
        touch.clientY
      );

      if (country) {
        showCountry(country);
      }

    },
    {
      passive: true
    }
  );


  /* =====================================================
     TOUCH MOVE

     This is the important part.

     As the finger moves across the SVG, we check which
     country is underneath the finger.
  ===================================================== */

  map.addEventListener(
    "touchmove",
    event => {

      if (!isTouchingMap) return;
      if (!event.touches.length) return;

      const touch = event.touches[0];

      const country = getCountryFromPoint(
        touch.clientX,
        touch.clientY
      );

      if (country) {

        /*
         Prevent page scrolling while actually rubbing
         across countries.
        */

        event.preventDefault();

        showCountry(country);
      }

    },
    {
      passive: false
    }
  );


  /* =====================================================
     TOUCH END
  ===================================================== */

  map.addEventListener(
    "touchend",
    () => {

      isTouchingMap = false;

      /*
       We intentionally DON'T remove is-active here.

       This means the last country touched stays
       highlighted and its information remains visible.
      */

    },
    {
      passive: true
    }
  );


  map.addEventListener(
    "touchcancel",
    () => {

      isTouchingMap = false;

    },
    {
      passive: true
    }
  );


  /* =====================================================
     MOBILE TAP / CLICK

     If the user taps the already selected country again,
     and it has a URL, go to that country's page.
  ===================================================== */

  countries.forEach(country => {

    let lastTap = 0;

    country.addEventListener("click", event => {

      const isTouchDevice =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;

      if (!isTouchDevice) {
        return;
      }

      event.preventDefault();

      const now = Date.now();

      const url = getCountryUrl(country);


      /*
       First tap = show information
       Second tap = open country page
      */

      if (
        activeCountry === country &&
        now - lastTap < 1500 &&
        url
      ) {

        window.location.href = url;

        return;
      }


      showCountry(country);

      lastTap = now;

    });

  });


  /* =====================================================
     POINTER EVENTS SUPPORT

     Helps on newer Android devices, tablets and
     touch-enabled Windows devices.
  ===================================================== */

  map.addEventListener("pointerdown", event => {

    if (event.pointerType !== "touch") return;

    isTouchingMap = true;

    const country = getCountryFromPoint(
      event.clientX,
      event.clientY
    );

    if (country) {
      showCountry(country);
    }

  });


  map.addEventListener("pointermove", event => {

    if (event.pointerType !== "touch") return;
    if (!isTouchingMap) return;

    const country = getCountryFromPoint(
      event.clientX,
      event.clientY
    );

    if (country) {
      showCountry(country);
    }

  });


  map.addEventListener("pointerup", event => {

    if (event.pointerType !== "touch") return;

    isTouchingMap = false;

  });


  map.addEventListener("pointercancel", event => {

    if (event.pointerType !== "touch") return;

    isTouchingMap = false;

  });

});
/* =========================================================
   AFRICA MAP — MOBILE SCROLL LOCK

   WHAT THIS DOES:
   - Finger on Africa map = page stays still
   - Drag across countries = page stays still
   - Country interaction continues working
   - Release finger = normal scrolling resumes
   - Touch outside map = page scrolls normally
========================================================= */

const africaMapScrollLock = document.querySelector("#africa-map");

if (africaMapScrollLock) {

  let mapTouchActive = false;

  /* Check whether the pointer is a finger or pen */
  const isTouchLikePointer = (event) => {
    return (
      event.pointerType === "touch" ||
      event.pointerType === "pen"
    );
  };


  /* =====================================================
     FINGER TOUCHES THE MAP
  ===================================================== */

  africaMapScrollLock.addEventListener(
    "pointerdown",
    (event) => {

      if (!isTouchLikePointer(event)) return;

      mapTouchActive = true;

      /*
         Keep tracking the finger even when it moves
         across country borders or small gaps in the SVG.
      */
      try {
        africaMapScrollLock.setPointerCapture(event.pointerId);
      } catch (error) {
        // Browser does not support pointer capture.
      }

      /*
         Stop the browser from starting a page scroll.
      */
      event.preventDefault();
    },
    { passive: false }
  );


  /* =====================================================
     FINGER MOVES ACROSS THE MAP
  ===================================================== */

  africaMapScrollLock.addEventListener(
    "pointermove",
    (event) => {

      if (!mapTouchActive) return;
      if (!isTouchLikePointer(event)) return;

      /*
         IMPORTANT:
         This prevents the webpage from moving up/down
         while rubbing your finger across the Africa map.
      */
      event.preventDefault();
    },
    { passive: false }
  );


  /* =====================================================
     RELEASE THE MAP
  ===================================================== */

  const releaseMapTouch = (event) => {

    if (!mapTouchActive) return;

    mapTouchActive = false;

    /*
       Release pointer capture.
    */
    if (
      event &&
      typeof event.pointerId !== "undefined"
    ) {

      try {

        if (
          africaMapScrollLock.hasPointerCapture(
            event.pointerId
          )
        ) {

          africaMapScrollLock.releasePointerCapture(
            event.pointerId
          );

        }

      } catch (error) {
        // Ignore unsupported browser behaviour.
      }
    }
  };


  africaMapScrollLock.addEventListener(
    "pointerup",
    releaseMapTouch
  );

  africaMapScrollLock.addEventListener(
    "pointercancel",
    releaseMapTouch
  );

  africaMapScrollLock.addEventListener(
    "lostpointercapture",
    releaseMapTouch
  );


  /* =====================================================
     MOBILE SAFARI / iPHONE FALLBACK
  ===================================================== */

  africaMapScrollLock.addEventListener(
    "touchmove",
    (event) => {

      /*
         As long as a finger is touching the Africa SVG,
         prevent the browser from scrolling the page.
      */
      if (event.touches.length > 0) {
        event.preventDefault();
      }

    },
    { passive: false }
  );

}

