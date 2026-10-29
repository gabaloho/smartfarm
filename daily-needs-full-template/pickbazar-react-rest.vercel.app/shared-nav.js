(function () {
  var NAV_CLASS = "jj-halal-shared-nav";
  var BRAND_NAME = "Gue Smart Farms Limited";
  var BRAND_TITLE_PREFIX = "Pickbazar | ";
  var HEADER_BRAND_CLASS = "jj-halal-brand-name";
  var BRAND_BANNER = "/banner.jpeg";
  var BRAND_LOGO = "/assets/gue-smart-farms-logo.svg";
  var STYLE_ID = "jj-halal-brand-style";
  var BRAND_INFO_CLASS = "jj-halal-brand-info";
  var HERO_TITLE = "You Deserve To Eat Fresh";
  var HERO_DESCRIPTION = "We source the best healthy foods for you.";
  var HERO_SEARCH_PLACEHOLDER = "Search (type at least 3 character)";
  var HERO_IMAGE = "/assets/daily-needs-hero.jpg";
  var PROMO_ID = "jj-halal-promo-modal";
  var PROMO_HIDE_KEY = "jj-halal-hide-promo";
  var PROMO_IMAGE = "/assets/promo-popup.png";
  var CATEGORIES_ID = "jj-halal-daily-needs-categories";
  var DAILY_NEEDS_CATEGORIES = [
    { slug: "vegetables-2", name: "Vegetables", count: "6 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/935/Vegetable.jpg" },
    { slug: "snacks-2", name: "Snacks", count: "6 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/936/Snacks.jpg" },
    { slug: "rice-pulse-2", name: "Rice & Pulse", count: "2 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/937/Pulse%26Rice.jpg" },
    { slug: "meat-2", name: "Meat", count: "5 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/938/Meat-demo.jpg" },
    { slug: "fruits-2", name: "Fruits", count: "6 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/939/Fruits.jpg" },
    { slug: "fish-2", name: "Fish", count: "4 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/940/Fish.jpg" },
    { slug: "dairy-eggs-2", name: "Dairy & Eggs", count: "2 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/941/Dairy.jpg" },
    { slug: "bakery-2", name: "Bakery", count: "8 Categories", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/942/bakery.jpg" }
  ];
  var DAILY_NEEDS_SUBCATEGORIES = {
    "vegetables-2": [
      { name: "Allium", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/974/Allium.jpg" },
      { name: "Cruciferous", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/975/Cruciferous.jpg" },
      { name: "Edible", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/976/Edible-plant.jpg" },
      { name: "Leafy Green", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1342/Leafy-green.jpg" },
      { name: "Marrow", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/977/Marrow.jpg" },
      { name: "Root", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/978/Root.jpg" }
    ],
    "snacks-2": [
      { name: "Candy", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/979/Candy.jpg" },
      { name: "Chips & Crisps", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/980/Chips.jpg" },
      { name: "Chocolates", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/981/Chocolates.jpg" },
      { name: "Cookies", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/982/Cookies.jpg" },
      { name: "Crackers", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/983/Crackers.jpg" },
      { name: "Nuts & Seeds", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/984/Nuts.jpg" }
    ],
    "rice-pulse-2": [
      { name: "Pulse", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/985/Pulse.jpg" },
      { name: "Rice", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/986/Rice.jpg" }
    ],
    "meat-2": [
      { name: "Beef", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/987/Beef.jpg" },
      { name: "Chicken", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/988/Chicken.jpg" },
      { name: "Goat", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/989/Goat.jpg" },
      { name: "Lamb", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/990/Lamb.jpg" },
      { name: "Turkey", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/991/Turkey.jpg" }
    ],
    "fruits-2": [
      { name: "Berries", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/992/Berries.jpg" },
      { name: "Citrus", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/993/Citrus.jpg" },
      { name: "Drupes", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/994/Drupes.jpg" },
      { name: "Exotic", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/995/Exotic.jpg" },
      { name: "Melons", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/996/Melons.jpg" },
      { name: "Tropical", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/997/Tropical.jpg" }
    ],
    "fish-2": [
      { name: "Catfish", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/998/Catfish.jpg" },
      { name: "Mackerel", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/999/Mackerel.jpg" },
      { name: "Salmon", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/183/SignatureSalmon_fstp4m.jpg" },
      { name: "Tilapia", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1000/Tilapia.jpg" }
    ],
    "dairy-eggs-2": [
      { name: "Dairy", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1001/Dairy.jpg" },
      { name: "Eggs", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1002/Eggs.jpg" }
    ],
    "bakery-2": [
      { name: "Bread", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1003/Bread.jpg" },
      { name: "Cakes", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1004/Cakes.jpg" },
      { name: "Croissants", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1005/Croissants.jpg" },
      { name: "Muffins", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1006/Muffins.jpg" },
      { name: "Pastries", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1007/Pastries.jpg" },
      { name: "Pies", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1008/Pies.jpg" },
      { name: "Rolls", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1009/Rolls.jpg" },
      { name: "Sourdough", count: "", image: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1010/Sourdough.jpg" }
    ]
  };

  function getCurrentPath() {
    var p = (window.location.pathname || "").toLowerCase();
    if (!p || p === "/") return "/index.html";
    return p;
  }

  function navLinks() {
    return [
      { href: "/index.html", label: "Home" },
      { href: "/offers.html", label: "Offers" },
      { href: "/shops.html", label: "Shops" },
      { href: "/contact.html", label: "Contact" }
    ];
  }

  function buildNav() {
    var current = getCurrentPath();
    var nav = document.createElement("nav");
    nav.className = "inline-flex items-center space-x-4 rtl:space-x-reverse " + NAV_CLASS;

    navLinks().forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      a.className = "text-sm font-semibold text-heading hover:text-accent";
      if (current === item.href) {
        a.className += " text-accent";
      }
      nav.appendChild(a);
    });

    return nav;
  }

  function buildHeaderBrand() {
    var brand = document.createElement("span");
    brand.className = "hidden text-sm font-bold uppercase tracking-[0.18em] text-heading lg:inline-block " + HEADER_BRAND_CLASS;
    brand.textContent = BRAND_NAME;
    return brand;
  }

  function injectBrandStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = ""
      + "body{position:relative;}"
      + "body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;"
      + "background:linear-gradient(180deg,rgba(2,66,8,.06),rgba(2,66,8,.02)),url('" + BRAND_BANNER + "') center/cover no-repeat;"
      + "opacity:.22;}"
      + "body.jj-halal-home::before{display:none;}"
      + "#site-header,main,footer{position:relative;z-index:1;}"
      + "." + HEADER_BRAND_CLASS + "{color:#7ACB2E;text-shadow:0 1px 0 rgba(0,0,0,.18);}"
      + ".jj-halal-contact-chip{display:none;margin-inline-start:12px;padding:6px 10px;border-radius:999px;"
      + "background:#0E5E11;color:#F5F7EE;font-size:12px;font-weight:700;letter-spacing:.03em;}"
      + "." + BRAND_INFO_CLASS + "{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;padding:8px 14px;"
      + "background:linear-gradient(90deg,#0F5D13,#1A7A1E);color:#F6F7EC;font-size:13px;font-weight:700;letter-spacing:.02em;}"
      + "." + BRAND_INFO_CLASS + " strong{color:#D9FF75;}"
      + ".jj-halal-hero-override{margin-top:96px!important;padding:20px!important;gap:20px!important;}"
      + "@media (min-width:768px){.jj-halal-hero-override{margin-top:0!important;padding-left:80px!important;padding-right:80px!important;gap:32px!important;}}"
      + "@media (min-width:1024px){.jj-halal-hero-override{gap:40px!important;}}"
      + ".jj-halal-hero-override h1{color:#009f7f!important;}"
      + ".jj-halal-hero-override p{color:#4b5563!important;}"
      + ".jj-halal-promo-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;}"
      + ".jj-halal-promo-panel{position:relative;display:grid;grid-template-columns:1fr;max-width:56rem;width:100%;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 24px 60px rgba(0,0,0,.25);}"
      + "@media (min-width:768px){.jj-halal-promo-panel{grid-template-columns:1fr 1fr;}}"
      + ".jj-halal-promo-content{padding:28px 26px 24px;}"
      + "@media (min-width:768px){.jj-halal-promo-content{padding:48px;}}"
      + ".jj-halal-promo-content{position:relative;z-index:2;}"
      + ".jj-halal-promo-title{margin:0 0 16px;color:#111827;font-size:42px;line-height:1.1;font-weight:700;}"
      + ".jj-halal-promo-text{margin:0 0 30px;color:#4b5563;font-size:20px;line-height:1.55;}"
      + ".jj-halal-promo-form{position:relative;border:1px solid #e5e7eb;background:#f8fafc;border-radius:6px;padding-right:42px;}"
      + ".jj-halal-promo-input{width:100%;height:56px;border:0;background:transparent;padding:0 16px;color:#111827;font-size:16px;outline:none;}"
      + ".jj-halal-promo-send{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#6b7280;font-size:22px;cursor:pointer;}"
      + ".jj-halal-promo-check{display:flex;align-items:center;gap:10px;margin-top:18px;color:#4b5563;font-size:14px;}"
      + ".jj-halal-promo-image-wrap{position:relative;background:#f8fafc;min-height:260px;}"
      + "@media (min-width:768px){.jj-halal-promo-image-wrap{min-height:450px;}}"
      + ".jj-halal-promo-image{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;}"
      + ".jj-halal-promo-image-wrap{z-index:1;}"
      + ".jj-halal-promo-close{position:absolute;right:14px;top:14px;border:0;background:#f3f4f6;color:#111827;width:34px;height:34px;border-radius:9999px;font-size:22px;line-height:1;cursor:pointer;z-index:4;}"
      + ".jj-halal-categories-wrap{background:#fff;}"
      + ".jj-halal-categories-title{margin:0;padding:10px 8px 0;font-size:24px;line-height:32px;font-weight:600;color:#1f2937;}"
      + ".jj-halal-categories-back{margin-top:12px;margin-left:8px;display:inline-flex;align-items:center;gap:8px;border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:6px 10px;color:#374151;font-weight:600;cursor:pointer;}"
      + ".jj-halal-categories-back:hover{border-color:#009f7f;color:#009f7f;}"
      + ".jj-halal-categories-inner{padding:0 20px 64px;}"
      + "@media (min-width:768px){.jj-halal-categories-inner{padding:0 32px 80px;}}"
      + "@media (min-width:1024px){.jj-halal-categories-inner{padding:0 48px 48px;}}"
      + ".jj-halal-categories-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:24px;}"
      + "@media (min-width:640px){.jj-halal-categories-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}"
      + "@media (min-width:1024px){.jj-halal-categories-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}"
      + "@media (min-width:1536px){.jj-halal-categories-grid{grid-template-columns:repeat(4,minmax(0,1fr));}}"
      + ".jj-halal-category-card{position:relative;height:20rem;width:100%;overflow:hidden;border-radius:10px;background:#fff;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,.08);cursor:pointer;}"
      + ".jj-halal-category-card h3{margin:0 0 4px;color:#1f2937;font-size:30px;line-height:1.1;font-weight:600;}"
      + ".jj-halal-category-count{display:block;color:#4b5563;font-size:16px;}"
      + ".jj-halal-category-link{position:absolute;left:32px;bottom:32px;color:#009f7f;font-size:16px;font-weight:600;text-decoration:underline;}"
      + ".jj-halal-category-image{position:absolute;right:0;bottom:0;width:66%;height:66%;object-fit:contain;pointer-events:none;}"
      + "@media (min-width:1280px){.jj-halal-contact-chip{display:inline-flex;align-items:center;}}";
    document.head.appendChild(style);
  }

  function updateDocumentBrand() {
    if (document.title) {
      document.title = document.title.indexOf(BRAND_TITLE_PREFIX) === 0
        ? BRAND_NAME + " | " + document.title.slice(BRAND_TITLE_PREFIX.length)
        : document.title.replace(/Pickbazar/g, BRAND_NAME);
    }

    Array.prototype.forEach.call(
      document.querySelectorAll('meta[name="twitter:site"], meta[property="og:site_name"]'),
      function (meta) {
        meta.setAttribute("content", BRAND_NAME);
      }
    );
  }

  function updateHeaderBrand() {
    var logoLink = document.querySelector("header a.inline-flex.py-3, header a.inline-flex[href='/'], header a.inline-flex[href='/' ]");
    if (!logoLink) return;

    var logoImage = logoLink.querySelector("img");
    if (logoImage) {
      logoImage.alt = BRAND_NAME;
      logoImage.removeAttribute("srcset");
      logoImage.removeAttribute("sizes");
      logoImage.src = BRAND_LOGO;
    }

    var brand = logoLink.parentElement && logoLink.parentElement.querySelector("." + HEADER_BRAND_CLASS);
    if (!brand) {
      brand = buildHeaderBrand();
      logoLink.insertAdjacentElement("afterend", brand);
    }

    brand.textContent = BRAND_NAME;

  }

  function updateFooterBrand() {
    Array.prototype.forEach.call(document.querySelectorAll("footer a, main a, span a"), function (link) {
      if ((link.textContent || "").trim() === "Pickbazar") {
        link.textContent = BRAND_NAME;
      }

    });
  }

  function updateTextNodes() {
    Array.prototype.forEach.call(document.querySelectorAll("img[alt='Pickbazar']"), function (img) {
      img.alt = BRAND_NAME;
    });
  }

  function updateHeroSection() {
    var heroTitle = document.querySelector("main h1");
    if (!heroTitle) return;

    var heroWrapper = heroTitle.parentElement;
    if (heroWrapper && heroWrapper.classList) {
      heroWrapper.classList.add("jj-halal-hero-override");
    }

    heroTitle.textContent = HERO_TITLE;

    var heroDescription = heroWrapper && heroWrapper.querySelector("p");
    if (heroDescription) {
      heroDescription.textContent = HERO_DESCRIPTION;
    }

    var searchInput = document.querySelector("main input#search, main input[name='search']");
    if (searchInput) {
      searchInput.setAttribute("placeholder", HERO_SEARCH_PLACEHOLDER);
    }

    var heroImage = document.querySelector("main img[alt='Groceries Delivered in 90 Minute'], main img[alt='You Deserve To Eat Fresh']");
    if (heroImage) {
      heroImage.alt = HERO_TITLE;
      heroImage.removeAttribute("srcset");
      heroImage.removeAttribute("sizes");
      heroImage.src = HERO_IMAGE;
    }
  }

  function shouldShowPromo() {
    var path = getCurrentPath();
    if (!(path === "/index.html" || path === "/daily-needs.html")) return false;
    try {
      return localStorage.getItem(PROMO_HIDE_KEY) !== "1";
    } catch (e) {
      return true;
    }
  }

  function closePromo(modal) {
    if (!modal) return;
    var check = modal.querySelector("#jj-halal-promo-no-show");
    if (check && check.checked) {
      try {
        localStorage.setItem(PROMO_HIDE_KEY, "1");
      } catch (e) {
      }
    }
    modal.remove();
  }

  function injectPromoModal() {
    if (!shouldShowPromo()) return;
    if (document.getElementById(PROMO_ID)) return;

    var modal = document.createElement("div");
    modal.id = PROMO_ID;
    modal.className = "jj-halal-promo-backdrop";
    modal.innerHTML = ""
      + "<div class='jj-halal-promo-panel' role='dialog' aria-modal='true' aria-label='Get 25 percent Discount'>"
      + "<button type='button' class='jj-halal-promo-close' aria-label='Close'>&times;</button>"
      + "<div class='jj-halal-promo-content'>"
      + "<h2 class='jj-halal-promo-title'>Get 25% Discount</h2>"
      + "<p class='jj-halal-promo-text'>Subscribe to the mailing list to receive updates on new arrivals, special offers and our promotions.</p>"
      + "<form novalidate='novalidate' class='jj-halal-promo-form'>"
      + "<input type='email' class='jj-halal-promo-input' placeholder='Write your email here' />"
      + "<button type='submit' class='jj-halal-promo-send' aria-label='Send'>&#10148;</button>"
      + "</form>"
      + "<label class='jj-halal-promo-check' for='jj-halal-promo-no-show'>"
      + "<input id='jj-halal-promo-no-show' type='checkbox' />"
      + "<span>Don't show this popup again</span>"
      + "</label>"
      + "</div>"
      + "<div class='jj-halal-promo-image-wrap'>"
      + "<img class='jj-halal-promo-image' alt='Get 25% Discount' src='" + PROMO_IMAGE + "' />"
      + "</div>"
      + "</div>";

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closePromo(modal);
      }
    });

    var closeBtn = modal.querySelector(".jj-halal-promo-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closePromo(modal);
      });
    }

    var form = modal.querySelector("form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        closePromo(modal);
      });
    }

    document.body.appendChild(modal);
  }

  function shouldUseDailyNeedsCategories() {
    var path = getCurrentPath();
    return path === "/index.html" || path === "/daily-needs.html";
  }

  function findListingRoot(heroTitle) {
    var firstArticle = document.querySelector("article");
    if (!firstArticle) return null;

    var node = firstArticle.parentElement;
    var fallback = null;

    while (node && node !== document.body) {
      var articleCount = node.querySelectorAll ? node.querySelectorAll("article").length : 0;
      var containsHero = !!(heroTitle && node.contains(heroTitle));

      if (!containsHero && articleCount >= 8 && !fallback) {
        fallback = node;
      }

      if (!containsHero && articleCount >= 8) {
        var buttons = node.querySelectorAll("button");
        var hasFilter = Array.prototype.some.call(buttons, function (btn) {
          return ((btn.textContent || "").trim() === "Filter");
        });
        if (hasFilter) return node;
      }

      node = node.parentElement;
    }

    return fallback;
  }

  function restoreHeroVisibility() {
    Array.prototype.forEach.call(document.querySelectorAll("main div.min-h-screen[style*='display: none']"), function (node) {
      if (node.querySelector("h1")) {
        node.style.display = "";
      }
    });
  }

  function updateCategoryParam(categorySlug) {
    var u = new URL(window.location.href);
    if (categorySlug) {
      u.searchParams.set("category", categorySlug);
    } else {
      u.searchParams.delete("category");
    }
    window.history.pushState({}, "", u.pathname + u.search + u.hash);
  }

  function buildCategoriesSection() {
    var selectedCategory = null;
    try {
      selectedCategory = new URLSearchParams(window.location.search).get("category");
    } catch (e) {
      selectedCategory = null;
    }

    var list = selectedCategory && DAILY_NEEDS_SUBCATEGORIES[selectedCategory]
      ? DAILY_NEEDS_SUBCATEGORIES[selectedCategory]
      : DAILY_NEEDS_CATEGORIES;

    var titleText = "All Categories";
    if (selectedCategory) {
      var selectedCategoryObj = DAILY_NEEDS_CATEGORIES.find(function (c) { return c.slug === selectedCategory; });
      if (selectedCategoryObj) {
        titleText = selectedCategoryObj.name;
      }
    }

    var section = document.createElement("div");
    section.id = CATEGORIES_ID;
    section.className = "jj-halal-categories-wrap";

    var titleBlock = document.createElement("div");
    titleBlock.className = "px-3 pt-3 md:px-6 md:pt-6 lg:px-10 lg:pt-10 2xl:px-14 2xl:pt-14";

    var title = document.createElement("h3");
    title.className = "jj-halal-categories-title";
    title.textContent = titleText;
    titleBlock.appendChild(title);

    if (selectedCategory) {
      var back = document.createElement("button");
      back.type = "button";
      back.className = "jj-halal-categories-back";
      back.textContent = "\u2190 Back to categories";
      back.addEventListener("click", function () {
        updateCategoryParam("");
        section.replaceWith(buildCategoriesSection());
      });
      titleBlock.appendChild(back);
    }

    var body = document.createElement("div");
    body.className = "jj-halal-categories-inner";

    var grid = document.createElement("div");
    grid.className = "jj-halal-categories-grid";

    list.forEach(function (cat) {
      var card = document.createElement("div");
      card.className = "jj-halal-category-card";
      card.setAttribute("role", "button");

      var h3 = document.createElement("h3");
      h3.textContent = cat.name;

      var count = document.createElement("span");
      count.className = "jj-halal-category-count";
      count.textContent = cat.count;

      var view = document.createElement("span");
      view.className = "jj-halal-category-link";
      view.textContent = "View More";

      var img = document.createElement("img");
      img.className = "jj-halal-category-image";
      img.alt = cat.name;
      img.src = cat.image;

      card.appendChild(h3);
      card.appendChild(count);
      card.appendChild(view);
      card.appendChild(img);

      if (!selectedCategory && cat.slug) {
        var navigateToCategory = function () {
          updateCategoryParam(cat.slug);
          section.replaceWith(buildCategoriesSection());
        };

        card.addEventListener("click", navigateToCategory);
        view.addEventListener("click", function (event) {
          event.stopPropagation();
          navigateToCategory();
        });
      }

      grid.appendChild(card);
    });

    body.appendChild(grid);
    section.appendChild(titleBlock);
    section.appendChild(body);
    return section;
  }

  function injectDailyNeedsCategories() {
    if (!shouldUseDailyNeedsCategories()) return;

    var heroTitle = document.querySelector("main h1");
    if (!heroTitle) return;

    var existing = document.getElementById(CATEGORIES_ID);
    if (existing) return;

    var categories = buildCategoriesSection();
    var listingRoot = findListingRoot(heroTitle);
    if (listingRoot && listingRoot.parentElement) {
      listingRoot.parentElement.insertBefore(categories, listingRoot);
      listingRoot.style.display = "none";
      return;
    }

    var heroBlock = heroTitle.closest("div.min-h-screen") || heroTitle.closest("section") || heroTitle.closest("div");
    if (heroBlock && heroBlock.parentElement) {
      heroBlock.insertAdjacentElement("afterend", categories);
      return;
    }

    var main = document.querySelector("main");
    if (main) {
      main.appendChild(categories);
    }
  }

  function pruneNonDailyNeedsSections() {
    if (!shouldUseDailyNeedsCategories()) return;

    Array.prototype.forEach.call(document.querySelectorAll("#offer"), function (offer) {
      var wrap = offer.closest("div.border-t.border-border-200.bg-light") || offer.parentElement;
      if (wrap) {
        wrap.style.display = "none";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("button"), function (btn) {
      if (((btn.textContent || "").trim() === "Filter")) {
        var sticky = btn.closest("div.sticky") || btn.parentElement;
        if (sticky) {
          sticky.style.display = "none";
        }
      }
    });
  }

  var DRAWER_INJECTED_ATTR = "data-jj-drawer-injected";
  var JJ_DRAWER_ID = "jj-halal-custom-drawer";

  function buildDrawerContent() {
    var wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;height:100%;";

    // Brand header with close button
    var header = document.createElement("div");
    header.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid #e5e7eb;background:#fff;flex-shrink:0;";
    var brandWrap = document.createElement("div");
    brandWrap.style.cssText = "display:flex;align-items:center;gap:10px;";
    var logoImg = document.createElement("img");
    logoImg.src = BRAND_LOGO;
    logoImg.alt = BRAND_NAME;
    logoImg.style.cssText = "width:36px;height:36px;object-fit:contain;";
    var brandText = document.createElement("span");
    brandText.style.cssText = "font-size:13px;font-weight:700;color:#0E5E11;letter-spacing:.04em;text-transform:uppercase;line-height:1.2;";
    brandText.textContent = BRAND_NAME;
    brandWrap.appendChild(logoImg);
    brandWrap.appendChild(brandText);
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.style.cssText = "width:28px;height:28px;border-radius:9999px;background:#f3f4f6;border:0;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#374151;flex-shrink:0;";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", closeJJDrawer);
    header.appendChild(brandWrap);
    header.appendChild(closeBtn);
    wrap.appendChild(header);

    // Scrollable body
    var body = document.createElement("div");
    body.style.cssText = "flex:1;overflow-y:auto;";

    // Nav + extra links
    var allDrawerLinks = navLinks().concat([
      { href: "/flash-sales.html", label: "Flash Sale" },
      { href: "/manufacturers.html", label: "Manufacturers/Publishers" },
      { href: "/authors.html", label: "Authors" },
      { href: "/help.html", label: "FAQ" },
      { href: "/terms.html", label: "Terms & Conditions" },
      { href: "/customer-refund-policies.html", label: "Customer Refund Policy" },
      { href: "/vendor-refund-policies.html", label: "Vendor Refund Policy" }
    ]);
    var navSection = document.createElement("nav");
    navSection.style.cssText = "padding:8px 0;border-bottom:1px solid #e5e7eb;";
    var current = getCurrentPath();
    allDrawerLinks.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      a.style.cssText = "display:block;padding:11px 20px;font-size:15px;font-weight:600;color:#374151;text-decoration:none;border-left:3px solid transparent;";
      if (current === item.href) {
        a.style.color = "#009f7f";
        a.style.borderLeftColor = "#009f7f";
        a.style.background = "#f0fdf4";
      }
      a.onmouseenter = function () { a.style.color = "#009f7f"; a.style.borderLeftColor = "#009f7f"; a.style.background = "#f0fdf4"; };
      a.onmouseleave = function () {
        if (current !== item.href) { a.style.color = "#374151"; a.style.borderLeftColor = "transparent"; a.style.background = ""; }
      };
      navSection.appendChild(a);
    });
    body.appendChild(navSection);

    // Categories heading
    var catHeading = document.createElement("div");
    catHeading.style.cssText = "padding:14px 20px 6px;font-size:11px;font-weight:700;color:#6b7280;letter-spacing:.08em;text-transform:uppercase;";
    catHeading.textContent = "Categories";
    body.appendChild(catHeading);

    // Category rows
    DAILY_NEEDS_CATEGORIES.forEach(function (cat) {
      var row = document.createElement("a");
      row.href = "/index.html?category=" + cat.slug;
      row.style.cssText = "display:flex;align-items:center;gap:12px;padding:9px 20px;text-decoration:none;border-left:3px solid transparent;";
      row.onmouseenter = function () { row.style.background = "#f0fdf4"; row.style.borderLeftColor = "#009f7f"; };
      row.onmouseleave = function () { row.style.background = ""; row.style.borderLeftColor = "transparent"; };
      var thumb = document.createElement("img");
      thumb.src = cat.image;
      thumb.alt = cat.name;
      thumb.style.cssText = "width:34px;height:34px;object-fit:contain;border-radius:6px;background:#f3f4f6;flex-shrink:0;";
      var lbl = document.createElement("div");
      var nm = document.createElement("div");
      nm.style.cssText = "font-size:14px;font-weight:600;color:#1f2937;";
      nm.textContent = cat.name;
      var cnt = document.createElement("div");
      cnt.style.cssText = "font-size:12px;color:#6b7280;";
      cnt.textContent = cat.count;
      lbl.appendChild(nm);
      lbl.appendChild(cnt);
      row.appendChild(thumb);
      row.appendChild(lbl);
      body.appendChild(row);
    });

    wrap.appendChild(body);

    return wrap;
  }

  function openJJDrawer() {
    if (document.getElementById(JJ_DRAWER_ID)) return;

    var backdrop = document.createElement("div");
    backdrop.id = JJ_DRAWER_ID;
    backdrop.style.cssText = "position:fixed;inset:0;z-index:9990;";

    var overlay = document.createElement("div");
    overlay.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,.45);";
    overlay.addEventListener("click", closeJJDrawer);

    var panel = document.createElement("div");
    panel.style.cssText = "position:absolute;top:0;left:0;bottom:0;width:100%;max-width:28rem;background:#fff;box-shadow:4px 0 24px rgba(0,0,0,.18);display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);";

    panel.appendChild(buildDrawerContent());
    backdrop.appendChild(overlay);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panel.style.transform = "translateX(0)";
      });
    });
  }

  function closeJJDrawer() {
    var backdrop = document.getElementById(JJ_DRAWER_ID);
    if (!backdrop) return;
    var panel = backdrop.querySelector("div[style*='max-width:28rem']");
    if (panel) {
      panel.style.transform = "translateX(-100%)";
      setTimeout(function () { backdrop.remove(); }, 300);
    } else {
      backdrop.remove();
    }
  }

  function injectDrawerContent(drawer) {
    if (drawer.getAttribute(DRAWER_INJECTED_ATTR)) return;
    drawer.setAttribute(DRAWER_INJECTED_ATTR, "1");
    var scrollContent = drawer.querySelector("[data-overlayscrollbars-contents]") || drawer;
    scrollContent.appendChild(buildDrawerContent());
  }

  function watchForDrawer() {
    var portal = document.getElementById("headlessui-portal-root");
    if (!portal) {
      var bodyObs = new MutationObserver(function () {
        var p = document.getElementById("headlessui-portal-root");
        if (p) { bodyObs.disconnect(); watchForDrawer(); }
      });
      bodyObs.observe(document.body, { childList: true });
      return;
    }
    var portalObs = new MutationObserver(function () {
      var drawer = portal.querySelector("div.drawer.flex.h-full.flex-col.bg-light");
      if (drawer) { injectDrawerContent(drawer); }
    });
    portalObs.observe(portal, { childList: true, subtree: true });
  }

  function hookBurgerButton() {
    var burger = document.querySelector("header button:first-child, button:has(.sr-only)");
    // Find the button whose sr-only text is "Burger Menu" or similar
    var buttons = document.querySelectorAll("header button");
    Array.prototype.forEach.call(buttons, function (btn) {
      var sr = btn.querySelector(".sr-only");
      if (sr && /burger|menu/i.test(sr.textContent || "")) {
        btn.addEventListener("click", function (e) {
          // Only intercept if headlessui portal won't open (missing React chunks)
          setTimeout(function () {
            if (!document.getElementById("headlessui-portal-root")) {
              openJJDrawer();
            }
          }, 120);
        });
      }
    });
  }

  function applyBranding() {
    var p = getCurrentPath();
    if (p === "/index.html" || p === "/daily-needs.html") {
      document.body.classList.add("jj-halal-home");
    } else {
      document.body.classList.remove("jj-halal-home");
    }

    injectBrandStyles();
    restoreHeroVisibility();
    updateDocumentBrand();
    updateHeaderBrand();
    updateFooterBrand();
    updateTextNodes();
    updateHeroSection();
    pruneNonDailyNeedsSections();
    injectDailyNeedsCategories();
    setTimeout(injectPromoModal, 450);
  }

  function findActionContainer() {
    return document.querySelector("header div.flex.items-center.space-x-4, header div.flex.items-center.lg\\:space-x-4");
  }

  function injectNav() {
    var actionContainer = findActionContainer();
    if (!actionContainer) return;

    var headerParent = actionContainer.parentElement;
    if (!headerParent) return;

    // Hide any existing native nav elements that aren't ours
    Array.prototype.forEach.call(
      headerParent.querySelectorAll("nav:not(." + NAV_CLASS + ")"),
      function (el) { el.style.display = "none"; }
    );

    var existing = headerParent.querySelector("." + NAV_CLASS);
    if (existing) return;

    var nav = buildNav();
    headerParent.insertBefore(nav, actionContainer);
  }

  function run() {
    applyBranding();
    injectNav();
    watchForDrawer();
    hookBurgerButton();
    setTimeout(applyBranding, 150);
    setTimeout(injectNav, 150);
    setTimeout(hookBurgerButton, 150);
    setTimeout(applyBranding, 500);
    setTimeout(injectNav, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
