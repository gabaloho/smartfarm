(function () {
  var PLACEHOLDER = "/icons/apple-icon-180.png";

  var categories = [
    { id: 1, name: "Vegetables", slug: "vegetables", details: "6 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 2, name: "Snacks", slug: "snacks", details: "6 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 3, name: "Rice & Pulse", slug: "rice-pulse", details: "2 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 4, name: "Meat", slug: "meat", details: "5 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 5, name: "Fruits", slug: "fruits", details: "6 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 6, name: "Fish", slug: "fish", details: "4 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 7, name: "Dairy & Eggs", slug: "dairy-eggs", details: "2 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } },
    { id: 8, name: "Bakery", slug: "bakery", details: "8 Categories", icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER } }
  ];

  var typeInfo = {
    id: 1,
    name: "Daily Needs",
    slug: "daily-needs",
    settings: { isHome: true },
    icon: { thumbnail: PLACEHOLDER, original: PLACEHOLDER },
    promotional_sliders: [
      {
        id: 1,
        title: "You Deserve To Eat Fresh",
        description: "We source the best healthy foods for you.",
        image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }
      }
    ],
    banners: [
      {
        id: 1,
        title: "You Deserve To Eat Fresh",
        description: "We source the best healthy foods for you.",
        image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }
      }
    ]
  };

  var products = [
    { id: 101, name: "Fresh Apple", slug: "fresh-apple", categorySlug: "fruits", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 4, max_price: 5, sale_price: 4, price: 5, unit: "kg", quantity: 20 },
    { id: 102, name: "Organic Banana", slug: "organic-banana", categorySlug: "fruits", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 3, max_price: 4, sale_price: 3, price: 4, unit: "dozen", quantity: 15 },
    { id: 103, name: "Carrot Pack", slug: "carrot-pack", categorySlug: "vegetables", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 2, max_price: 3, sale_price: 2, price: 3, unit: "kg", quantity: 30 },
    { id: 104, name: "Tomato", slug: "tomato", categorySlug: "vegetables", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 2, max_price: 3, sale_price: 2, price: 3, unit: "kg", quantity: 28 },
    { id: 105, name: "Chicken Breast", slug: "chicken-breast", categorySlug: "meat", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 9, max_price: 11, sale_price: 9, price: 11, unit: "kg", quantity: 12 },
    { id: 106, name: "Beef Slices", slug: "beef-slices", categorySlug: "meat", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 12, max_price: 14, sale_price: 12, price: 14, unit: "kg", quantity: 9 },
    { id: 107, name: "Milk", slug: "milk", categorySlug: "dairy-eggs", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 2, max_price: 3, sale_price: 2, price: 3, unit: "ltr", quantity: 40 },
    { id: 108, name: "Eggs", slug: "eggs", categorySlug: "dairy-eggs", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 3, max_price: 4, sale_price: 3, price: 4, unit: "dozen", quantity: 25 },
    { id: 109, name: "Tuna", slug: "tuna", categorySlug: "fish", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 7, max_price: 9, sale_price: 7, price: 9, unit: "kg", quantity: 10 },
    { id: 110, name: "Salmon", slug: "salmon", categorySlug: "fish", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 11, max_price: 13, sale_price: 11, price: 13, unit: "kg", quantity: 8 },
    { id: 111, name: "Whole Wheat Bread", slug: "whole-wheat-bread", categorySlug: "bakery", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 2, max_price: 3, sale_price: 2, price: 3, unit: "pc", quantity: 22 },
    { id: 112, name: "Chocolate Cookies", slug: "chocolate-cookies", categorySlug: "snacks", image: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }, min_price: 3, max_price: 4, sale_price: 3, price: 4, unit: "pack", quantity: 19 }
  ].map(function (item) {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.name + " (offline demo data)",
      image: item.image,
      gallery: [item.image],
      type: { id: 1, name: "Daily Needs", slug: "daily-needs" },
      categories: [{ id: item.id + 5000, name: item.categorySlug, slug: item.categorySlug }],
      unit: item.unit,
      quantity: item.quantity,
      min_price: item.min_price,
      max_price: item.max_price,
      sale_price: item.sale_price,
      price: item.price,
      status: "publish"
    };
  });

  function jsonHeaders() {
    return {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    };
  }

  function parseUrl(input) {
    try {
      return new URL(input, window.location.origin);
    } catch (e) {
      return null;
    }
  }

  function parseSearchValue(searchText) {
    if (!searchText) {
      return "";
    }
    var params = new URLSearchParams(searchText);
    return (params.get("search") || "").toLowerCase();
  }

  function filteredProducts(searchText) {
    var searchValue = parseSearchValue(searchText);
    var match = /categories\.slug:([^;]+)/.exec(searchValue);
    if (!match) {
      return products;
    }
    var wanted = match[1];
    return products.filter(function (p) {
      return p.categories.some(function (c) {
        return c.slug.toLowerCase() === wanted;
      });
    });
  }

  function routeResponse(urlObj, method) {
    if (!urlObj) {
      return null;
    }

    var host = urlObj.host.toLowerCase();
    var path = urlObj.pathname;
    var isMockHost = host === "mock.redq.io";
    var isLocal = host === window.location.host.toLowerCase() || host === "";

    if (isLocal && path === "/api/auth/session") {
      return { status: 200, body: { user: null, expires: "2999-12-31T23:59:59.999Z" } };
    }

    if (isLocal && path === "/api/auth/_log") {
      return { status: 200, body: { ok: true } };
    }

    if (isLocal && /^\/_next\/data\/.*\/en\.json$/.test(path)) {
      return {
        status: 200,
        body: {
          pageProps: {
            dehydratedState: { mutations: [], queries: [] },
            locale: "en"
          },
          __N_SSG: true
        }
      };
    }

    if (!(isMockHost || (isLocal && path.indexOf("/api/") === 0))) {
      return null;
    }

    if (path === "/api/settings") {
      return {
        status: 200,
        body: {
          options: {
            siteTitle: "Pickbazar Offline",
            currency: "USD",
            logo: { thumbnail: PLACEHOLDER, original: PLACEHOLDER }
          }
        }
      };
    }

    if (path === "/api/types") {
      return { status: 200, body: [typeInfo] };
    }

    if (path === "/api/types/daily-needs") {
      return { status: 200, body: typeInfo };
    }

    if (path === "/api/categories") {
      return { status: 200, body: categories };
    }

    if (path === "/api/products") {
      var rows = filteredProducts(urlObj.search);
      return {
        status: 200,
        body: {
          data: rows,
          paginatorInfo: {
            currentPage: 1,
            lastPage: 1,
            perPage: rows.length,
            total: rows.length,
            hasMorePages: false
          }
        }
      };
    }

    if (method === "POST" && path.indexOf("/api/") === 0) {
      return { status: 200, body: { ok: true } };
    }

    return null;
  }

  function buildFetchResponse(payload) {
    return new Response(JSON.stringify(payload.body), {
      status: payload.status,
      headers: jsonHeaders()
    });
  }

  var originalFetch = window.fetch ? window.fetch.bind(window) : null;
  if (originalFetch) {
    window.fetch = function (input, init) {
      var method = (init && init.method) || "GET";
      var url = typeof input === "string" ? input : (input && input.url) || "";
      var payload = routeResponse(parseUrl(url), method.toUpperCase());
      if (payload) {
        return Promise.resolve(buildFetchResponse(payload));
      }
      return originalFetch(input, init);
    };
  }

  var originalOpen = XMLHttpRequest.prototype.open;
  var originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__offlineShimMethod = (method || "GET").toUpperCase();
    this.__offlineShimUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    var xhr = this;
    var payload = routeResponse(parseUrl(xhr.__offlineShimUrl || ""), xhr.__offlineShimMethod || "GET");
    if (!payload) {
      return originalSend.apply(xhr, arguments);
    }

    var bodyText = JSON.stringify(payload.body);
    Object.defineProperty(xhr, "readyState", { value: 4, configurable: true });
    Object.defineProperty(xhr, "status", { value: payload.status, configurable: true });
    Object.defineProperty(xhr, "statusText", { value: "OK", configurable: true });
    Object.defineProperty(xhr, "responseText", { value: bodyText, configurable: true });
    Object.defineProperty(xhr, "response", { value: bodyText, configurable: true });

    setTimeout(function () {
      if (typeof xhr.onreadystatechange === "function") {
        xhr.onreadystatechange();
      }
      xhr.dispatchEvent(new Event("readystatechange"));
      if (typeof xhr.onload === "function") {
        xhr.onload();
      }
      xhr.dispatchEvent(new Event("load"));
      xhr.dispatchEvent(new Event("loadend"));
    }, 0);

    return undefined;
  };
})();
