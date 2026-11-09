// MAGGO · Editorial Publication Engine
import { PILLARS, JOURNAL_ENTRIES, EDITORIAL_FEATURES, LOOKBOOK_ITEMS, JEWELRY_PIECES } from './data.js';

// Application State
const state = {
  currentRoute: 'home',
  filters: {
    lookbook: { subcategory: 'all' },
    jewelry: { subcategory: 'all' }
  }
};

// ==========================================================================
// Utility Helpers
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ==========================================================================
// Routing Engine (HTML5 History API with Clean URLs)
// ==========================================================================
function getRouteFromPath(pathname) {
  if (!pathname) return 'home';
  // Strip leading/trailing slashes and .html extension
  let clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase().replace(/\.html$/, '');

  // If user enters with a subfolder like /story/
  if (clean.includes('/')) {
    clean = clean.split('/')[0];
  }

  if (!clean || clean === 'index' || clean === 'home') return 'home';
  if (clean === 'story' || clean === 'my-story' || clean === 'craft') return 'story';
  if (clean === 'designs' || clean === 'lookbook' || clean === 'apparel' || clean === 'bags' || clean === 'jewelry') return 'designs';
  if (clean === 'journal' || clean === 'articles' || clean === 'essays') return 'journal';
  if (clean === 'inquiries' || clean === 'contact' || clean === 'atelier' || clean === 'bespoke') return 'inquiries';

  return 'home';
}

export function navigateTo(urlPath) {
  const targetRoute = getRouteFromPath(urlPath);
  const cleanUrl = targetRoute === 'home' ? '/' : '/' + targetRoute;

  if (window.location.pathname !== cleanUrl) {
    window.history.pushState({ route: targetRoute }, '', cleanUrl);
  }
  handleRoute();
}

function initRouter() {
  // Popstate for browser back/forward buttons
  window.addEventListener('popstate', handleRoute);

  // If someone arrived with an old hash URL like /#story, redirect cleanly to /story
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const route = getRouteFromPath(rawHash);
    const cleanUrl = route === 'home' ? '/' : '/' + route;
    window.history.replaceState({ route }, '', cleanUrl);
  }

  // Intercept all internal clean links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Check if it's an internal clean path
    if (href.startsWith('/') && !href.startsWith('//') && !anchor.hasAttribute('target')) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  handleRoute();
}

function handleRoute() {
  state.currentRoute = getRouteFromPath(window.location.pathname);

  // Normalize for nav highlighting
  let activeNavRoute = state.currentRoute;
  if (activeNavRoute === 'lookbook' || activeNavRoute === 'jewelry') activeNavRoute = 'designs';
  if (activeNavRoute === 'contact' || activeNavRoute === 'atelier') activeNavRoute = 'inquiries';

  // Update navigation active states
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkRoute = link.getAttribute('data-route');
    if (linkRoute === activeNavRoute) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Render view
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileMenu();

  switch (state.currentRoute) {
    case 'home':
      renderHome(mainContent);
      break;
    case 'story':
      renderStory(mainContent);
      break;
    case 'designs':
    case 'lookbook':
      renderDesigns(mainContent);
      break;
    case 'jewelry':
      renderJewelry(mainContent);
      break;
    case 'atelier':
    case 'craft':
      renderStory(mainContent);
      break;
    case 'journal':
      renderJournal(mainContent);
      break;
    case 'inquiries':
    case 'contact':
      renderContact(mainContent);
      break;
  }
}

// ==========================================================================
// Views Rendering
// ==========================================================================

// 1. HOME VIEW (Vogue Editorial Magazine Architecture)
function renderHome(container) {
  const runwayLooks = [
    LOOKBOOK_ITEMS.find(l => l.id === 'look-nayika-gown'),
    LOOKBOOK_ITEMS.find(l => l.id === 'look-surya-gown'),
    LOOKBOOK_ITEMS.find(l => l.id === 'look-mandira-gown'),
    LOOKBOOK_ITEMS.find(l => l.id === 'look-matsya-blazer')
  ].filter(Boolean);
  const suitingFeature = LOOKBOOK_ITEMS.find(l => l.id === 'look-matsya-blazer') || LOOKBOOK_ITEMS[9];
  const coutureFeature = LOOKBOOK_ITEMS.find(l => l.id === 'look-mandira-gown') || LOOKBOOK_ITEMS[13];
  const craftFeature = LOOKBOOK_ITEMS.find(l => l.id === 'look-kutch') || LOOKBOOK_ITEMS[1];
  const featuredJewels = JEWELRY_PIECES.slice(0, 4);

  container.innerHTML = `
    <!-- VOGUE LEAD PACKAGE: COVER STORY CENTERPIECE -->
    <section class="vogue-cover-package">
      <div class="container">
        <div class="vogue-cover-grid">
          <!-- Dominant Hero Visual -->
          <div class="vogue-cover-visual" onclick="navigateTo('/story')" style="cursor: pointer;">
            <img src="assets/images/founder_mishita.jpg" alt="Mishita Maggo · Founder & Creative Director" loading="eager">
          </div>

          <!-- Editorial Headline Package -->
          <div class="vogue-cover-content">
            <span class="vogue-rubric">COVER STORY · THE MANIFESTO</span>
            <h1 class="vogue-cover-headline">The Architecture of Continuity</h1>
            <p class="vogue-cover-deck">
              How an only daughter converted a patriarchal finality into an enduring Indian design house.
            </p>
            <div class="vogue-cover-byline">
              BY MISHITA MAGGO &nbsp;·&nbsp; PHOTOGRAPHED IN NEW DELHI
            </div>
            <p class="vogue-cover-text">
              Rooted in the ancient concept of lineage, MAGGO translates 800 years of regional Indian handcraft into quiet intelligence, architectural restraint, and contemporary minimalism. No loud embellishment; only textile honesty for an ordinary Tuesday.
            </p>
            <div class="vogue-btn-row">
              <a href="/story" class="vogue-btn-primary">Read Cover Story</a>
              <a href="/designs" class="vogue-btn-secondary">Explore Designs</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VOGUE STORIES OF THE DAY (3-COLUMN TRIPTYCH) -->
    <section class="vogue-triptych-section">
      <div class="container">
        <div class="vogue-section-header">
          <div>
            <span class="vogue-section-kicker">FEATURED DISPATCHES</span>
            <h2 class="vogue-section-title">Stories of the Season</h2>
          </div>
          <a href="/journal" class="vogue-see-all-link">The Journal →</a>
        </div>

        <div class="vogue-triptych-grid">
          <!-- Story 1: Executive Suiting -->
          <article class="vogue-story-card" onclick="navigateTo('/designs')">
            <div class="vogue-story-img-wrap">
              <img src="${suitingFeature.modelImage || suitingFeature.image}" alt="${suitingFeature.title}">
            </div>
            <span class="vogue-rubric">WORKWEAR · FASHION</span>
            <h3 class="vogue-story-headline">The New Indian Power Suit</h3>
            <p class="vogue-story-excerpt">
              Unbleached Irish flax linen meets sacred Mithila songbirds. Tailoring built for the boardroom with heritage soul.
            </p>
            <span class="vogue-story-byline">CRAFTED WITH MITHILA ARTISANS</span>
          </article>

          <!-- Story 2: Runway Couture -->
          <article class="vogue-story-card" onclick="navigateTo('/designs')">
            <div class="vogue-story-img-wrap">
              <img src="${coutureFeature.modelImage || coutureFeature.image}" alt="${coutureFeature.title}">
            </div>
            <span class="vogue-rubric">COUTURE · THE SALON</span>
            <h3 class="vogue-story-headline">A Soaring Statement of Grace</h3>
            <p class="vogue-story-excerpt">
              Sheer unbleached Chanderi silk organza, architectural slits, and floating temple maiden capes designed for transcendence.
            </p>
            <span class="vogue-story-byline">ODISHA NARRATIVE ART</span>
          </article>

          <!-- Story 3: Cultural Commentary -->
          <article class="vogue-story-card" onclick="navigateTo('/journal')">
            <div class="vogue-story-img-wrap">
              <img src="${craftFeature.modelImage || craftFeature.image}" alt="${craftFeature.title}">
            </div>
            <span class="vogue-rubric">CULTURE & OPINION</span>
            <h3 class="vogue-story-headline">On Wearing Your Inheritance on a Tuesday</h3>
            <p class="vogue-story-excerpt">
              Why Indian clothing does not need to be loud or reserved for weddings. A case for everyday heirloom minimalism.
            </p>
            <span class="vogue-story-byline">WORDS BY MISHITA MAGGO</span>
          </article>
        </div>
      </div>
    </section>

    <!-- VOGUE THE CURATED COUTURE SECTION (4-COLUMN COLLECTION PREVIEW) -->
    <section class="vogue-runway-section">
      <div class="container">
        <div class="vogue-section-header">
          <div>
            <h2 class="vogue-section-title">The Curated Couture</h2>
          </div>
          <a href="/designs" class="vogue-see-all-link">See All 14 Looks →</a>
        </div>

        <div class="vogue-runway-grid">
          ${runwayLooks.map(look => `
            <article class="vogue-runway-card" onclick="navigateTo('/designs')">
              <div class="vogue-runway-img-wrap">
                <img src="${look.image || look.modelImage}" alt="${look.title}" loading="lazy">
              </div>
              <div class="vogue-runway-meta" style="padding-top: 0.85rem;">
                <h3 class="mag-design-title">${look.title}</h3>
                <p class="mag-design-origin">Origin: ${look.origin || 'India · Handcrafted'}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- VOGUE IN CONVERSATION: PULL-QUOTE SPREAD -->
    <section class="vogue-pull-quote-spread">
      <div class="container">
        <div class="vogue-quote-grid">
          <div class="vogue-quote-portrait">
            <img src="assets/images/founder_mishita.jpg" alt="Mishita Maggo, Founder & Creative Director">
          </div>
          <div class="vogue-quote-content">
            <span class="vogue-rubric dark">IN CONVERSATION · THE FOUNDER</span>
            <div class="vogue-quote-mark">“</div>
            <p class="vogue-quote-text">
              "I chose not to accept an archaic ending. MAGGO represents the continuity of values, aesthetic precision, and quiet dignity."
            </p>
            <p style="font-family: var(--font-serif); font-size: 1.15rem; color: #555; line-height: 1.8; margin: 0;">
              If a son can carry forward a surname through bloodline, a daughter can elevate that surname into a global design institution. That conviction is woven into every stitch we produce.
            </p>
            <div class="vogue-quote-author">
              MISHITA MAGGO &nbsp;·&nbsp; FOUNDER & CREATIVE DIRECTOR
            </div>
            <div style="margin-top: 0.5rem;">
              <a href="/story" class="vogue-btn-primary">Read The Complete Dialogue →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VOGUE CULTURE & JOURNAL SECTION -->
    <section class="vogue-journal-section">
      <div class="container">
        <div class="vogue-section-header">
          <div>
            <h2 class="vogue-section-title">The Journal</h2>
          </div>
          <a href="/journal" class="vogue-see-all-link">Visit Journal →</a>
        </div>

        <div style="background-color: var(--color-bg-alt); border: 1px solid var(--color-border); padding: clamp(2.5rem, 4vw, 4rem) 2rem; text-align: center; margin-top: 1.5rem;">
          <span class="overline" style="letter-spacing: 0.24em; display: inline-block; margin-bottom: 1rem; color: var(--color-text-light);">EDITORIAL ARCHIVE · DISPATCHES</span>
          <h3 style="font-family: var(--font-serif); font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 300; margin-bottom: 1.25rem;">
            Coming Soon
          </h3>
          <p style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-text-muted); max-width: 600px; margin: 0 auto 2rem auto; line-height: 1.8;">
            Critical essays and studio dispatches exploring the synthesis of ancient Indian craft intelligence and modern executive tailoring are currently in preparation.
          </p>
          <a href="/journal" class="vogue-btn-primary" style="display: inline-block;">Read More in Journal →</a>
        </div>
      </div>
    </section>

    <!-- VOGUE THE MONOGRAPH: JEWELRY STILL-LIFES -->
    <section style="padding: clamp(3rem, 6vw, 5rem) 0; border-bottom: 1px solid var(--vogue-border); background-color: var(--vogue-offwhite);">
      <div class="container">
        <div class="vogue-section-header">
          <div>
            <span class="vogue-section-kicker">SCULPTURE & METAL</span>
            <h2 class="vogue-section-title">The Jewelry Monograph</h2>
          </div>
          <a href="/designs" class="vogue-see-all-link">View Collection →</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
          ${featuredJewels.map((jewel, i) => `
            <div class="vogue-runway-card" onclick="navigateTo('/designs')">
              <div style="aspect-ratio: 1 / 1; overflow: hidden; background-color: #FFFFFF; position: relative;">
                <img src="${jewel.image}" alt="${jewel.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy">
              </div>
              <div class="vogue-runway-meta" style="padding-top: 0.85rem;">
                <h4 class="mag-design-title">${jewel.title}</h4>
                <p class="mag-design-origin">Origin: ${jewel.origin || 'Jaipur · Handcrafted'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- VOGUE EDITORIAL DISPATCH / NEWSLETTER -->
    <section style="padding: clamp(3.5rem, 5vw, 5.5rem) 0; background-color: #FFFFFF; border-bottom: 1px solid var(--vogue-border);">
      <div class="container" style="text-align: center; max-width: 680px; margin: 0 auto;">
        <span class="vogue-rubric">THE DISPATCH</span>
        <h2 style="font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700; margin: 0.5rem 0 1rem 0; text-transform: uppercase;">The MAGGO Notes</h2>
        <p style="font-family: var(--font-serif); font-size: 1.2rem; color: #555; line-height: 1.7; margin-bottom: 2rem;">
          Receive considered monthly reflections on Indian craft, seasonal editorials, and studio dispatches directly from New Delhi.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/inquiries" class="vogue-btn-primary">Send An Inquiry</a>
          <a href="mailto:mishitamaggo23@gmail.com" class="vogue-btn-secondary">mishitamaggo23@gmail.com</a>
        </div>
      </div>
    </section>
  `;
}


// 2. STORY VIEW (The Manifesto · Editorial Feature Article)
function renderStory(container) {
  container.innerHTML = `
    <div class="story-page-wrapper">
      <div class="container">
        <div class="story-hero-banner">
          <img src="assets/logo.png" alt="MAGGO Monogram" class="story-monogram-large">
          <div class="story-lead-quote">
            "The lineage will not end."
            <span class="highlight-serif">"The family name becomes the brand."</span>
          </div>
          <p class="lead" style="color: var(--color-text-muted);">
            A personal legacy expressed through architectural restraint: an Indian design house built on minimalism, carrying a family name forward.
          </p>
        </div>

        <div class="mag-byline" style="margin-top: 1.5rem;">
          <span>ESSAY BY MISHITA MAGGO</span>
          <span>·</span>
          <span>FOUNDER & CREATIVE DIRECTOR</span>
        </div>

        <div class="story-grid">
          <div class="story-sticky-aside">
            <div class="hero-img-frame" style="border: 1px solid var(--color-border); background-color: var(--color-bg-alt);">
              <img src="assets/images/founder_mishita.jpg" alt="Mishita Maggo, Founder & Creative Director">
            </div>
            <div class="founder-signoff">
              <span class="name">Mishita Maggo</span>
              <span class="role">Founder & Creative Director</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--color-text-light); line-height: 1.6;">
              "I chose not to accept an archaic ending. MAGGO represents the continuity of values, aesthetic precision, and quiet dignity."
            </div>
          </div>

          <div class="story-body">
            <div>
              <span class="overline">The Name & Lineage</span>
              <h2 style="margin: 0.5rem 0 1.5rem 0;">The Weight of a Finality</h2>
              <p class="mag-drop-cap">
                MAGGO is my surname. It has been passed through generations of my family, grounded in the ancient concept of lineage and cultural inheritance.
              </p>
              <p>
                Growing up as an only daughter, I often heard well-meaning relatives whisper the same refrain: that the family name would end with me. In patriarchal traditions, the daughter leaves, and the lineage dissolves.
              </p>
              <p>
                I refused that conclusion. If a lineage represents discipline, aesthetic devotion, integrity, and respect for handcraft, why should it depend on an unbroken male line?
              </p>
            </div>

            <!-- Runway Study Plate -->
            <div style="margin: 2.5rem 0; border: 1px solid var(--color-border); background-color: var(--color-bg-alt);">
              <img src="assets/images/designs/couture_runway_gown_02.jpg" alt="The Nayika Gown, Runway Study" style="width: 100%; height: auto; max-height: 540px; object-fit: cover; display: block;">
              <div style="padding: 0.85rem 1rem; font-size: 0.78rem; color: var(--color-text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background-color: var(--color-bg); border-top: 1px solid var(--color-border-subtle);">
                <span><strong style="color: var(--color-text); font-family: var(--font-serif); font-size: 0.95rem;">PLATE 01: THE NAYIKA GOWN</strong> · Runway Study</span>
                <span class="overline" style="font-size: 0.65rem;">Couture Presentation · New Delhi</span>
              </div>
            </div>

            <blockquote>
              "I made a conscious choice to challenge tradition: the lineage will not end. The surname will become an enduring institution."
            </blockquote>

            <div>
              <span class="overline">The Purpose</span>
              <h2 style="margin: 0.5rem 0 1.5rem 0;">India Through Minimalism</h2>
              <p>
                For too long, the global perception of Indian fashion has been confined to wedding pageantry: heavy brocades, thousands of crystals, and costumes reserved for ceremonies once a year.
              </p>
              <p>
                Yet the real soul of Indian craft lies in quiet intelligence: the breathability of 100-count handspun khadi, the gossamer drape of unbleached Chanderi silk, the organic weight of hand-cast silver.
              </p>
              <p>
                MAGGO designs for an ordinary Tuesday. For the woman leading an executive board meeting, curating a biennial, or boarding an early flight. Clothes that don't shout, but never go unnoticed.
              </p>
            </div>

            <div style="background-color: var(--color-bg-alt); padding: 2.5rem; border: 1px solid var(--color-border);">
              <span class="overline">Our Commitment</span>
              <h3 style="margin: 0.5rem 0 1rem 0;">The Rule of Restraint</h3>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.95rem; color: var(--color-text-muted);">
                <li>• <strong>Cut & Drape Over Embellishment:</strong> No superficial crystals or sequins. Only sculptural tailoring and pure textile honesty.</li>
                <li>• <strong>Slow Provenance:</strong> Handwoven silks and metals sourced directly from artisan collectives in Chanderi, Maheshwar, and Jaipur.</li>
                <li>• <strong>Bespoke Proportions:</strong> Garments cut to individual posture and measurement, honoring every woman's form.</li>
              </ul>
            </div>

            <div style="display: flex; gap: 1.25rem; margin-top: 1rem; flex-wrap: wrap;">
              <a href="/designs" class="btn-primary">View Designs</a>
              <a href="/inquiries" class="btn-secondary">Get In Touch</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 3. DESIGNS VIEW (Curated Portfolio of Apparel & Jewelry)
function renderDesigns(container) {
  const subcategories = ['all', 'Tailored Waistcoats', 'Tailored Blazers & Suits', 'Artisan Shirts', 'Co-Ord Sets', 'Couture & Gowns', 'Jewelry'];
  const activeSubcategory = state.filters.lookbook?.subcategory || 'all';

  let displayItems = [];
  if (activeSubcategory === 'all') {
    displayItems = [
      ...LOOKBOOK_ITEMS.map(item => ({ ...item, isJewel: false })),
      ...JEWELRY_PIECES.map(item => ({ ...item, isJewel: true, subcategory: 'Jewelry', lookNumber: '—' }))
    ];
  } else if (activeSubcategory === 'Jewelry') {
    displayItems = JEWELRY_PIECES.map(item => ({ ...item, isJewel: true, subcategory: 'Jewelry', lookNumber: '—' }));
  } else {
    displayItems = LOOKBOOK_ITEMS.filter(l => l.subcategory === activeSubcategory).map(item => ({ ...item, isJewel: false }));
  }

  container.innerHTML = `
    <div class="container">
      <div class="mag-catalog-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span class="overline">Portfolio · Curated Designs</span>
            <h1 style="margin-top: 0.35rem;">Selected Designs</h1>
            <p style="color: var(--color-text-muted); max-width: 620px; margin-top: 0.5rem; font-size: 0.98rem;">Architectural waistcoats, artisan ink shirts, executive suiting, grand runway gowns, and sculptural jewelry. Each piece is a dialogue between 800 years of Indian handcraft and contemporary minimalist form.</p>
          </div>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="mag-catalog-toolbar">
        <div class="mag-filter-pills">
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-text-light); align-self: center; margin-right: 0.25rem;">Category:</span>
          ${subcategories.map(sub => `
            <button class="mag-pill-btn ${activeSubcategory === sub ? 'active' : ''}" data-filter="${sub}">
              ${sub === 'all' ? 'All Pieces' : sub}
            </button>
          `).join('')}
        </div>
        <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-text-muted);">
          Showing ${displayItems.length} ${displayItems.length === 1 ? 'Design' : 'Designs'}
        </div>
      </div>

      <!-- Designs Grid -->
      <div class="mag-catalog-list">
        ${displayItems.map(item => `
          <article class="mag-look-card" onclick="openDesignLightbox('${item.id}')">
            <div class="mag-look-frame" style="${item.isJewel ? 'aspect-ratio: 1 / 1;' : ''}">
              <img src="${item.image || item.modelImage}" alt="${item.title}" loading="lazy">
            </div>
            <div class="mag-look-content">
              <h3 class="mag-design-title">${item.title}</h3>
              <p class="mag-design-origin">Origin: ${item.origin || 'India · Handcrafted'}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  // Attach filter listeners
  container.querySelectorAll('.mag-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.target.getAttribute('data-filter');
      state.filters.lookbook.subcategory = selected;
      renderDesigns(container);
    });
  });
}

// 4. JEWELRY VIEW (Jewelry Editorial Monograph)
function renderJewelry(container) {
  const subcategories = ['all', ...new Set(JEWELRY_PIECES.map(j => j.subcategory))];
  const activeSubcategory = state.filters.jewelry?.subcategory || 'all';

  const filteredItems = activeSubcategory === 'all'
    ? JEWELRY_PIECES
    : JEWELRY_PIECES.filter(j => j.subcategory === activeSubcategory);

  container.innerHTML = `
    <div class="container">
      <div class="mag-catalog-header">
        <div>
          <span class="overline">Jewelry Monograph · Sculpture & Metal</span>
          <h1 style="margin-top: 0.35rem;">Sculptural Gold & Baroque Pearls</h1>
          <p style="color: var(--color-text-muted); max-width: 620px; margin-top: 0.5rem; font-size: 0.98rem;">Sculptural organic leaf contours in 18k brushed gold vermeil paired with iridescent natural freshwater baroque pearls and hand-set gemstones. Each piece hand-sculpted by master silversmiths in Jaipur.</p>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="mag-catalog-toolbar">
        <div class="mag-filter-pills">
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-text-light); align-self: center; margin-right: 0.25rem;">Category:</span>
          ${subcategories.map(sub => `
            <button class="mag-pill-btn ${activeSubcategory === sub ? 'active' : ''}" data-filter="${sub}">
              ${sub === 'all' ? 'All Pieces' : sub}
            </button>
          `).join('')}
        </div>
        <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-text-muted);">
          Showing ${filteredItems.length} ${filteredItems.length === 1 ? 'Piece' : 'Pieces'}
        </div>
      </div>

      <!-- Jewelry Gallery Grid -->
      <div class="mag-catalog-list">
        ${filteredItems.map((piece, i) => `
          <article class="mag-look-card" onclick="openDesignLightbox('${piece.id}')">
            <div class="mag-look-frame" style="aspect-ratio: 1 / 1;">
              <img src="${piece.image}" alt="${piece.title}" loading="lazy" style="object-fit: contain; padding: 1rem;">
            </div>
            <div class="mag-look-content">
              <h3 class="mag-design-title">${piece.title}</h3>
              <p class="mag-design-origin">Origin: ${piece.origin || 'Jaipur · Handcrafted'}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  // Attach filter listeners
  container.querySelectorAll('.mag-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.target.getAttribute('data-filter');
      state.filters.jewelry.subcategory = selected;
      renderJewelry(container);
    });
  });
}

// 5. ATELIER REDIRECT (Legacy Route Support)
function renderAtelier(container) {
  renderStory(container);
}

// 6. CRAFT AND PHILOSOPHY VIEW
function renderCraft(container) {
  container.innerHTML = `
    <div class="container">
      <div class="craft-manifesto">
        <span class="overline">Craft & Philosophy</span>
        <h1 style="margin-top: 0.35rem;">The Architecture of Restraint</h1>
        <p class="lead" style="color: var(--color-text-muted); margin-top: 1rem;">
          We believe Indian craft reaches its highest expression when stripped of excess decoration. When there are no sequins to hide flaws, every thread and seam must be flawless.
        </p>
      </div>

      <!-- Craft Hero Image -->
      <div style="margin-bottom: 4rem;">
        <img src="assets/images/designs/pattachitra_board.jpg" alt="Master artisan studio design board" style="width: 100%; max-height: 520px; object-fit: cover;">
        <div style="padding: 1rem 0; font-size: 0.8rem; color: var(--color-text-light); display: flex; justify-content: space-between;">
          <span>Slow Human Labor · Studio Design Moodboard</span>
          <span>800-Year-Old Odisha Pattachitra Tradition Reimagined</span>
        </div>
      </div>

      <!-- Three Pillars Expanded -->
      <div class="pillars-grid" style="margin-bottom: 4.5rem;">
        ${PILLARS.map(p => `
          <div class="pillar-card">
            <h3 style="font-size: 1.6rem;">${p.title}</h3>
            <p style="color: var(--color-text); font-weight: 400;">${p.summary}</p>
            <p style="color: var(--color-text-muted); font-size: 0.92rem; line-height: 1.8;">${p.description}</p>
          </div>
        `).join('')}
      </div>

      <!-- Geographical Origins Grid -->
      <div class="section-head">
        <div>
          <span class="overline">Regional Provenance</span>
          <h2 style="margin-top: 0.4rem;">Four Centers of Indian Craftsmanship</h2>
        </div>
      </div>

      <div class="craft-origins-grid">
        <div class="craft-origin-card">
          <span class="overline">Madhya Pradesh</span>
          <h4>Chanderi & Maheshwar</h4>
          <p>Woven on traditional pit-looms using high-twist wild silk warp and unbleached cotton weft. Renowned for its sheer weightless transparency and natural geometric crispness.</p>
        </div>
        <div class="craft-origin-card">
          <span class="overline">Maharashtra & Gujarat</span>
          <h4>Handspun Khadi</h4>
          <p>Yarn handspun on amber charkhas, preserving the uneven, living breath of raw organic cotton. Thermal insulation in winter, cool breathability in humid summers.</p>
        </div>
        <div class="craft-origin-card">
          <span class="overline">Rajasthan</span>
          <h4>Jaipur Silversmiths</h4>
          <p>Cast by generational artisans using lost-wax methods and hand-burnishing. We exclusively use 100% recycled 925 silver and brushed 18k vermeil.</p>
        </div>
        <div class="craft-origin-card">
          <span class="overline">Bengal & Bihar</span>
          <h4>Wild Tussar Silk</h4>
          <p>Forest-harvested non-violent tussar silk with an earthy honey hue and architectural hand. It holds sharp tailored creases without synthetic interlinings.</p>
        </div>
      </div>
    </div>
  `;
}

// 7. JOURNAL VIEW
function renderJournal(container) {
  container.innerHTML = `
    <div class="container">
      <div class="catalog-page-header">
        <span class="overline">The MAGGO Journal</span>
        <h1 style="margin-top: 0.35rem;">Notes on Lineage, Craft & Design</h1>
        <p style="color: var(--color-text-muted); max-width: 600px; margin-top: 0.5rem;">
          Essays, studio dialogues, and critical writing on contemporary Indian minimalism.
        </p>
      </div>

      <!-- COMING SOON SECTION -->
      <div class="journal-coming-soon-wrap" style="padding: 4rem 1.5rem 6rem; text-align: center; max-width: 760px; margin: 0 auto;">
        <span class="overline" style="letter-spacing: 0.28em; display: inline-block; margin-bottom: 1.5rem; color: var(--color-text-light);">EDITORIAL ARCHIVE · FORTHCOMING ESSAYS</span>
        <h2 style="font-family: var(--font-serif); font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.5rem; color: var(--color-text);">
          Coming Soon
        </h2>
        <div style="width: 48px; height: 1px; background-color: var(--color-text); margin: 0 auto 2rem auto;"></div>
        <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-text-muted); line-height: 1.9; margin-bottom: 2.5rem;">
          Critical writings, studio dispatches, and monograph releases exploring contemporary Indian minimalism, architectural tailoring, and lineage continuity will debut shortly.
        </p>
        <div style="display: inline-flex; flex-direction: column; gap: 0.75rem; align-items: center; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1.5rem 2.5rem; background-color: var(--color-bg-alt);">
          <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--color-text-light);">Direct Editorial Inquiries & Submissions</span>
          <a href="mailto:mishitamaggo23@gmail.com" style="font-family: var(--font-serif); font-size: 1.1rem; text-decoration: underline; color: var(--color-text);">mishitamaggo23@gmail.com</a>
        </div>
      </div>

      <!-- Press Mentions Section -->
      <div style="padding: 3rem 0; border-top: 1px solid var(--color-border); margin-bottom: 5rem;">
        <span class="overline">Press & Critical Recognition</span>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; margin-top: 1.5rem;">
          <div style="padding: 1.5rem; border: 1px solid var(--color-border);">
            <div style="font-family: var(--font-serif); font-size: 1.4rem; font-style: italic;">"The antidote to wedding wear overload: MAGGO is designing clothes Indian women can wear to work."</div>
            <span class="overline" style="margin-top: 1rem; display: block;">Vogue India</span>
          </div>
          <div style="padding: 1.5rem; border: 1px solid var(--color-border);">
            <div style="font-family: var(--font-serif); font-size: 1.4rem; font-style: italic;">"A sublime synthesis of European architectural discipline and ancient Indian handloom intelligence."</div>
            <span class="overline" style="margin-top: 1rem; display: block;">Architectural Digest</span>
          </div>
          <div style="padding: 1.5rem; border: 1px solid var(--color-border);">
            <div style="font-family: var(--font-serif); font-size: 1.4rem; font-style: italic;">"How an only daughter converted a patriarchal anxiety into an enduring luxury house."</div>
            <span class="overline" style="margin-top: 1rem; display: block;">Harper's Bazaar</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 8. CONTACT & INQUIRIES VIEW
function renderContact(container) {
  container.innerHTML = `
    <div class="container">
      <div class="catalog-page-header">
        <span class="overline">Contact & Inquiries</span>
        <h1 style="margin-top: 0.35rem;">Get in Touch</h1>
        <p style="color: var(--color-text-muted); max-width: 600px; margin-top: 0.5rem;">
          For editorial inquiries, press collaborations, journal submissions, and design partnerships.
        </p>
      </div>

      <div class="contact-grid">
        <div>
          <h2 style="font-size: 2rem; margin-bottom: 1.25rem;">Direct Inquiries</h2>
          <div style="display: flex; flex-direction: column; gap: 1.5rem; color: var(--color-text); font-size: 0.95rem; line-height: 1.8;">
            <div>
              <strong>General & Editorial Inquiries:</strong><br>
              <a href="mailto:mishitamaggo23@gmail.com" style="text-decoration: underline;">mishitamaggo23@gmail.com</a>
            </div>
            <div>
              <strong>Press & Collaborations:</strong><br>
              <a href="mailto:mishitamaggo23@gmail.com" style="text-decoration: underline;">mishitamaggo23@gmail.com</a>
            </div>
            <div>
              <strong>Journal Submissions:</strong><br>
              <a href="mailto:mishitamaggo23@gmail.com" style="text-decoration: underline;">mishitamaggo23@gmail.com</a>
            </div>
          </div>
        </div>

        <div>
          <h2 style="font-size: 2rem; margin-bottom: 1.25rem;">Send a Note</h2>
          <form id="contact-inquiry-form" class="form-grid">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Radhika Sen">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" name="email" required placeholder="name@domain.com">
            </div>
            <div class="form-group">
              <label class="form-label">Inquiry Type</label>
              <select name="type">
                <option value="General & Editorial">General & Editorial Inquiries</option>
                <option value="Press & Collaborations">Press & Collaborations</option>
                <option value="Journal Submissions">Journal Submissions</option>
                <option value="Design Inquiries">Design & Editorial Features</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label class="form-label">Your Message *</label>
              <textarea name="message" rows="4" required placeholder="Write your message or inquiry here..."></textarea>
            </div>
            <div class="form-group full-width">
              <button type="submit" class="btn-primary" style="width: 100%;">Send Message →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Handle contact form submit
  const form = container.querySelector('#contact-inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      showToast(`Thank you, ${name}. Your message has been sent to mishitamaggo23@gmail.com.`);
      form.reset();
    });
  }
}

// ==========================================================================
// Mobile Navigation Drawer
// ==========================================================================
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) {
    drawer.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) {
    drawer.classList.remove('active');
  }
}

// ==========================================================================
// Global Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initRouter();

  // Mobile Menu Toggles
  const menuToggle = document.getElementById('menu-toggle-btn');
  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);

  const mobileClose = document.getElementById('mobile-menu-close');
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  // Newsletter Form
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you. You have been subscribed to MAGGO Notes.`);
        input.value = '';
      }
    });
  }

  // Escape key handler for mobile menu and lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      window.closeDesignLightbox?.();
    }
  });
});

// ==========================================================================
// Full-Screen Design Lightbox Modal
// ==========================================================================
window.openDesignLightbox = function(id) {
  const allItems = [...LOOKBOOK_ITEMS, ...JEWELRY_PIECES];
  const item = allItems.find(x => x.id === id);
  if (!item) return;

  let modal = document.getElementById('mag-design-lightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mag-design-lightbox';
    modal.className = 'mag-lightbox-backdrop';
    document.body.appendChild(modal);
  }

  const imgSrc = item.image || item.modelImage;
  const originText = item.origin || (item.isJewel ? 'Jaipur · Hand-Sculpted Vermeil' : 'India · Handcrafted');

  modal.innerHTML = `
    <div class="mag-lightbox-dialog" onclick="event.stopPropagation()">
      <button class="mag-lightbox-close" onclick="closeDesignLightbox()" aria-label="Close">✕</button>
      <div class="mag-lightbox-body">
        <div class="mag-lightbox-img-wrap">
          <img src="${imgSrc}" alt="${item.title}">
        </div>
        <div class="mag-lightbox-caption">
          <h3>${item.title}</h3>
          <p>Origin: ${originText}</p>
        </div>
      </div>
    </div>
  `;

  modal.onclick = closeDesignLightbox;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeDesignLightbox = function() {
  const modal = document.getElementById('mag-design-lightbox');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
};
