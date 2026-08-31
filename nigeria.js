/* =========================================================
   GGA NIGERIA PUBLICATIONS PAGE
   CMS / API-ready publication rendering.
========================================================= */

/*
  CONNECT YOUR CMS HERE
  -----------------------------------------------------------
  Expected default response shape:

  {
    "publications": [
      {
        "id": "nigeria-001",
        "title": "Publication title",
        "excerpt": "Short summary...",
        "publishedAt": "2026-08-31T09:00:00Z",
        "category": "Research",
        "author": "Author name",
        "url": "/publications/publication-slug.html",
        "pdfUrl": "/media/report.pdf"
      }
    ]
  }

  You can also return the array directly:
  [ { publication }, { publication } ]

  If your CMS uses different field names, edit normalisePublication()
  rather than changing the page rendering code.
*/

const PUBLICATION_API = {
  enabled: true,

  // Replace this with your real backend / CMS endpoint.
  endpoint: "/api/publications?country=nigeria",

  // Useful if your API needs custom headers.
  // Never expose a private server-side secret in browser JavaScript.
  headers: {
    "Accept": "application/json"
    // "Authorization": "Bearer PUBLIC_OR_SHORT_LIVED_TOKEN"
  },

  // If the API is unavailable while developing locally,
  // demo data is rendered so you can see the complete layout.
  useDemoDataOnError: true
};

const DEMO_PUBLICATIONS = [
  {
    id: "nga-demo-001",
    title: "Strengthening accountable governance in Nigeria",
    excerpt: "A practical examination of institutional resilience, public accountability and the policy choices that can improve governance outcomes for citizens.",
    publishedAt: "2026-08-28T09:00:00Z",
    category: "Governance",
    author: "GGA Research Team",
    url: "#",
    pdfUrl: ""
  },
  {
    id: "nga-demo-002",
    title: "Local government, service delivery and citizen trust",
    excerpt: "What stronger local institutions can mean for responsive public services, participation and trust in democratic governance.",
    publishedAt: "2026-07-17T09:00:00Z",
    category: "Policy Brief",
    author: "Good Governance Africa",
    url: "#",
    pdfUrl: ""
  },
  {
    id: "nga-demo-003",
    title: "Nigeria's evolving governance landscape",
    excerpt: "A review of key governance trends and the institutional pressures shaping Nigeria's political and development environment.",
    publishedAt: "2026-06-04T09:00:00Z",
    category: "Research",
    author: "GGA Research Team",
    url: "#",
    pdfUrl: ""
  },
  {
    id: "nga-demo-004",
    title: "Building public institutions that people can trust",
    excerpt: "Recommendations for improving accountability, transparency and implementation capacity across public institutions.",
    publishedAt: "2026-04-22T09:00:00Z",
    category: "Analysis",
    author: "Good Governance Africa",
    url: "#",
    pdfUrl: ""
  },
  {
    id: "nga-demo-005",
    title: "From evidence to action: policy priorities for Nigeria",
    excerpt: "Turning research into practical policy decisions that support resilient institutions and inclusive development.",
    publishedAt: "2026-02-10T09:00:00Z",
    category: "Policy Brief",
    author: "GGA Research Team",
    url: "#",
    pdfUrl: ""
  },
  {
    id: "nga-demo-006",
    title: "Citizen participation and democratic resilience",
    excerpt: "Exploring how participation, information access and stronger civic institutions can reinforce democratic resilience.",
    publishedAt: "2025-11-18T09:00:00Z",
    category: "Democracy",
    author: "Good Governance Africa",
    url: "#",
    pdfUrl: ""
  }
];

const state = {
  publications: [],
  filtered: [],
  visibleCount: 4,
  pageSize: 4,
  query: "",
  category: "all",
  usingDemoData: false
};

const els = {
  latest: document.querySelector("#latestPublication"),
  list: document.querySelector("#publicationList"),
  status: document.querySelector("#publicationStatus"),
  search: document.querySelector("#publicationSearch"),
  category: document.querySelector("#publicationCategory"),
  loadMore: document.querySelector("#loadMoreBtn")
};

/* =========================================================
   BASIC SITE INTERACTIONS
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const searchTrigger = document.querySelector(".search-trigger");
const searchPanel = document.querySelector(".search-panel");
const searchClose = document.querySelector(".search-close");
const searchForm = document.querySelector("#searchForm");
const siteSearch = document.querySelector("#siteSearch");

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

function openSearch() {
  searchPanel?.classList.add("is-open");
  searchPanel?.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");
  setTimeout(() => siteSearch?.focus(), 100);
}

function closeSearch() {
  searchPanel?.classList.remove("is-open");
  searchPanel?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}

searchTrigger?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSearch();
    mainNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

searchForm?.addEventListener("submit", event => {
  event.preventDefault();

  const value = siteSearch?.value.trim() || "";
  const message = document.querySelector("#searchMessage");

  if (message) {
    message.textContent = value
      ? `Search submitted for “${value}”. Connect this to your site search endpoint.`
      : "Enter a search term.";
  }
});

document
  .querySelector("#newsletterForm")
  ?.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.querySelector("#email")?.value.trim();
    const message = document.querySelector("#formMessage");

    if (!email || !message) return;

    message.textContent =
      `Thanks — ${email} has been captured for the demo. Connect this form to your newsletter provider.`;

    event.currentTarget.reset();
  });

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1
  }
);

document
  .querySelectorAll(".reveal")
  .forEach(el => observer.observe(el));

/* =========================================================
   CMS DATA
========================================================= */

async function fetchPublications() {
  if (!PUBLICATION_API.enabled) {
    state.usingDemoData = true;
    return DEMO_PUBLICATIONS;
  }

  try {
    const response = await fetch(PUBLICATION_API.endpoint, {
      method: "GET",
      headers: PUBLICATION_API.headers,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Publication API returned HTTP ${response.status}`
      );
    }

    const payload = await response.json();

    const rawItems =
      Array.isArray(payload)
        ? payload
        : Array.isArray(payload.publications)
          ? payload.publications
          : Array.isArray(payload.data)
            ? payload.data
            : [];

    if (!rawItems.length) {
      throw new Error(
        "The publication API returned no publications."
      );
    }

    state.usingDemoData = false;

    return rawItems;

  } catch (error) {
    console.warn(
      "Nigeria publications API:",
      error
    );

    if (!PUBLICATION_API.useDemoDataOnError) {
      throw error;
    }

    state.usingDemoData = true;

    return DEMO_PUBLICATIONS;
  }
}

/*
  This is the ONLY function you normally need to change
  when connecting a CMS with different field names.
*/
function normalisePublication(item, index) {
  return {
    id:
      item.id ??
      item._id ??
      item.slug ??
      `publication-${index + 1}`,

    title:
      item.title ??
      item.name ??
      item.headline ??
      "Untitled publication",

    excerpt:
      item.excerpt ??
      item.summary ??
      item.description ??
      item.introduction ??
      "",

    publishedAt:
      item.publishedAt ??
      item.published_at ??
      item.publishDate ??
      item.date ??
      new Date(0).toISOString(),

    category:
      item.category?.name ??
      item.category ??
      item.topic ??
      item.type ??
      "Publication",

    author:
      item.author?.name ??
      item.author ??
      item.byline ??
      "Good Governance Africa",

    url:
      item.url ??
      item.link ??
      item.permalink ??
      (
        item.slug
          ? `/publications/${item.slug}.html`
          : "#"
      ),

    pdfUrl:
      item.pdfUrl ??
      item.pdf_url ??
      item.downloadUrl ??
      item.file?.url ??
      ""
  };
}

function sortNewestFirst(publications) {
  return [...publications].sort(
    (a, b) => {
      const aTime =
        new Date(a.publishedAt).getTime() || 0;

      const bTime =
        new Date(b.publishedAt).getTime() || 0;

      return bTime - aTime;
    }
  );
}

/* =========================================================
   RENDERING
========================================================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value = "#") {
  const url =
    String(value || "#").trim();

  if (
    url.startsWith("/") ||
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("#")
  ) {
    return url;
  }

  try {
    const parsed =
      new URL(
        url,
        window.location.href
      );

    return [
      "http:",
      "https:"
    ].includes(parsed.protocol)
      ? parsed.href
      : "#";

  } catch {
    return "#";
  }
}

function formatDate(dateValue) {
  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}

function renderLatest(publication) {
  if (!els.latest) return;

  if (!publication) {
    els.latest.innerHTML = `
      <div class="latest-publication__content">

        <p class="eyebrow eyebrow--green">
          NIGERIA
        </p>

        <h1>
          No publication has been added yet.
        </h1>

        <p class="latest-publication__excerpt">
          As soon as your CMS returns a Nigeria publication
          it will appear here automatically.
        </p>

      </div>
    `;

    return;
  }

  const articleUrl =
    safeUrl(publication.url);

  const pdfUrl =
    publication.pdfUrl
      ? safeUrl(publication.pdfUrl)
      : "";

  els.latest.innerHTML = `

    <div class="latest-publication__top">

      <span class="latest-badge">
        Latest publication
      </span>

      <span class="latest-number">
        NGA /
        ${formatDate(publication.publishedAt).slice(-4)}
      </span>

    </div>

    <div class="latest-publication__content">

      <div class="publication-meta">

        <span>
          ${escapeHTML(publication.category)}
        </span>

        <span>
          ${escapeHTML(
            formatDate(
              publication.publishedAt
            )
          )}
        </span>

        <span>
          ${escapeHTML(publication.author)}
        </span>

      </div>

      <h1>
        ${escapeHTML(publication.title)}
      </h1>

      <p class="latest-publication__excerpt">
        ${escapeHTML(publication.excerpt)}
      </p>

      <div class="latest-actions">

        <a
          class="btn btn--primary"
          href="${articleUrl}"
        >
          Read publication
          <span>→</span>
        </a>

        ${
          pdfUrl
            ? `
              <a
                class="btn btn--outline"
                href="${pdfUrl}"
                target="_blank"
                rel="noopener"
              >
                Download PDF
                <span>↓</span>
              </a>
            `
            : ""
        }

      </div>

    </div>
  `;
}

function renderCategories() {
  if (!els.category) return;

  const categories = [
    ...new Set(
      state.publications
        .map(item => item.category)
        .filter(Boolean)
    )
  ].sort(
    (a, b) =>
      a.localeCompare(b)
  );

  els.category.innerHTML = `
    <option value="all">
      All topics
    </option>

    ${
      categories
        .map(
          category => `
            <option
              value="${escapeHTML(category)}"
            >
              ${escapeHTML(category)}
            </option>
          `
        )
        .join("")
    }
  `;
}

function filterPublications() {
  const query =
    state.query.toLowerCase();

  state.filtered =
    state.publications.filter(
      item => {

        const matchesCategory =
          state.category === "all" ||
          item.category === state.category;

        const searchable = [
          item.title,
          item.excerpt,
          item.category,
          item.author
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          !query ||
          searchable.includes(query);

        return (
          matchesCategory &&
          matchesQuery
        );
      }
    );

  state.visibleCount =
    state.pageSize;

  renderArchive();
}

function renderArchive() {
  if (!els.list) return;

  /*
    The newest item is already displayed in the hero.
    We keep it in the archive too so the complete publication
    history remains visible and searchable.
  */

  const visible =
    state.filtered.slice(
      0,
      state.visibleCount
    );

  if (!visible.length) {

    els.list.innerHTML = `
      <div class="empty-state">
        No Nigeria publications match
        your current search or filter.
      </div>
    `;

    if (els.loadMore) {
      els.loadMore.hidden = true;
    }

    updateStatus();

    return;
  }

  els.list.innerHTML =
    visible
      .map(
        (publication, index) => `

          <article class="publication-row">

            <div class="publication-index">
              ${
                String(index + 1)
                  .padStart(2, "0")
              }
            </div>

            <div>

              <div class="publication-row__meta">

                <span>
                  ${escapeHTML(publication.category)}
                </span>

                <span>
                  ${
                    escapeHTML(
                      formatDate(
                        publication.publishedAt
                      )
                    )
                  }
                </span>

              </div>

              <h3>

                <a
                  href="${safeUrl(publication.url)}"
                >
                  ${escapeHTML(publication.title)}
                </a>

              </h3>

              <p>
                ${escapeHTML(publication.excerpt)}
              </p>

            </div>

            <div class="publication-author">

              <strong>
                Author
              </strong>

              ${escapeHTML(publication.author)}

            </div>

            <a
              class="publication-arrow"
              href="${safeUrl(publication.url)}"
              aria-label="Read ${escapeHTML(publication.title)}"
            >
              →
            </a>

          </article>
        `
      )
      .join("");

  if (els.loadMore) {
    els.loadMore.hidden =
      state.visibleCount >=
      state.filtered.length;
  }

  updateStatus();
}

function updateStatus() {
  if (!els.status) return;

  const count =
    state.filtered.length;

  const source =
    state.usingDemoData
      ? " Demo content is showing until your CMS endpoint is connected."
      : "";

  els.status.textContent =
    `${count} publication${
      count === 1 ? "" : "s"
    } found.${source}`;
}

/* =========================================================
   FILTER EVENTS
========================================================= */

els.search?.addEventListener(
  "input",
  event => {

    state.query =
      event.currentTarget.value.trim();

    filterPublications();
  }
);

els.category?.addEventListener(
  "change",
  event => {

    state.category =
      event.currentTarget.value;

    filterPublications();
  }
);

els.loadMore?.addEventListener(
  "click",
  () => {

    state.visibleCount +=
      state.pageSize;

    renderArchive();
  }
);

/* =========================================================
   INITIALISE
========================================================= */

async function initPublications() {
  try {

    const rawPublications =
      await fetchPublications();

    state.publications =
      sortNewestFirst(
        rawPublications.map(
          normalisePublication
        )
      );

    state.filtered = [
      ...state.publications
    ];

    renderLatest(
      state.publications[0]
    );

    renderCategories();

    renderArchive();

  } catch (error) {

    console.error(error);

    renderLatest(null);

    if (els.list) {
      els.list.innerHTML = `
        <div class="empty-state">
          Publications could not be loaded.
          Please check the API endpoint
          in nigeria.js.
        </div>
      `;
    }

    if (els.status) {
      els.status.textContent =
        "Unable to connect to the publications API.";
    }
  }
}

initPublications();