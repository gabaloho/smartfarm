export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  unit: string;
  isHalal: boolean;
  isFeatured?: boolean;
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { slug: "eggs", name: "Eggs", description: "Retail crates, household packs, and promotional egg sales.", emoji: "🥚" },
  { slug: "chicken", name: "Chicken", description: "Whole chicken and chicken parts sold strictly by the kilogram.", emoji: "🐔" },
  { slug: "livestock", name: "Livestock", description: "Whole cows and rams for direct sale or reservation.", emoji: "🐄" },
  { slug: "marketplace", name: "Marketplace", description: "Buy and sell livestock with trusted seller information and clear fees.", emoji: "🛒" },
  { slug: "auctions", name: "Auctions", description: "Timed bidding for livestock and poultry listings.", emoji: "🔨" },
  { slug: "delivery", name: "Delivery", description: "Scheduling, pickup, and delivery coordination for every order.", emoji: "🚚" },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "p1",
    name: "Household Egg Crate",
    slug: "household-egg-crate",
    category: "eggs",
    description: "1 to 4 crates for homes and personal use.",
    price: 3900,
    oldPrice: 4200,
    unit: "crate",
    isHalal: true,
    isFeatured: true,
  },
  {
    id: "p2",
    name: "Retail Egg Crate",
    slug: "retail-egg-crate",
    category: "eggs",
    description: "5 crates and above for retailers and bulk buyers.",
    price: 3600,
    unit: "crate",
    isHalal: true,
  },
  {
    id: "p3",
    name: "Whole Chicken",
    slug: "whole-chicken",
    category: "chicken",
    description: "Processed whole chicken sold strictly per kilogram.",
    price: 6800,
    unit: "kg",
    isHalal: true,
    isFeatured: true,
  },
  {
    id: "p4",
    name: "Chicken Breast",
    slug: "chicken-breast",
    category: "chicken",
    description: "Lean chicken breast for home cooking and bulk meal prep.",
    price: 6500,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p5",
    name: "Drumstick",
    slug: "drumstick",
    category: "chicken",
    description: "Juicy drumstick portions sold by weight.",
    price: 6200,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p6",
    name: "Wings",
    slug: "wings",
    category: "chicken",
    description: "Chicken wings priced and weighed in kilograms.",
    price: 5800,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p7",
    name: "Thighs",
    slug: "thighs",
    category: "chicken",
    description: "Dark meat chicken portions sold by kilogram.",
    price: 6100,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p8",
    name: "Head and Feet",
    slug: "head-and-feet",
    category: "chicken",
    description: "Chicken head and feet bundles sold by weight.",
    price: 4200,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p9",
    name: "Cow Share - Full Slot",
    slug: "cow-share-full-slot",
    category: "livestock",
    description: "Festive cow sharing option for a full slot booking.",
    price: 185000,
    unit: "slot",
    isHalal: true,
    isFeatured: true,
  },
  {
    id: "p10",
    name: "Cow Share - Half Slot",
    slug: "cow-share-half-slot",
    category: "livestock",
    description: "Affordable half-slot booking for community purchases.",
    price: 95000,
    unit: "slot",
    isHalal: true,
  },
  {
    id: "p11",
    name: "Whole Cow",
    slug: "whole-cow",
    category: "livestock",
    description: "Direct purchase cow with profile, weight, and health details.",
    price: 980000,
    unit: "head",
    isHalal: true,
  },
  {
    id: "p12",
    name: "Whole Ram",
    slug: "whole-ram",
    category: "livestock",
    description: "Whole ram listing for direct reserve or purchase.",
    price: 265000,
    unit: "head",
    isHalal: true,
  },
  {
    id: "p13",
    name: "Marketplace Broiler Listing",
    slug: "marketplace-broiler-listing",
    category: "marketplace",
    description: "Broiler listing from an independent seller on the marketplace.",
    price: 7800,
    unit: "kg",
    isHalal: true,
  },
  {
    id: "p14",
    name: "Marketplace Ram Listing",
    slug: "marketplace-ram-listing",
    category: "marketplace",
    description: "Registered seller ram listing with location and contact details.",
    price: 300000,
    unit: "head",
    isHalal: true,
  },
  {
    id: "p15",
    name: "Auction Bull",
    slug: "auction-bull",
    category: "auctions",
    description: "Bull listing in a timed auction.",
    price: 1200000,
    unit: "head",
    isHalal: true,
  },
  {
    id: "p16",
    name: "Delivery and Pickup",
    slug: "delivery-and-pickup",
    category: "delivery",
    description: "Delivery scheduling and pickup coordination service.",
    price: 1500,
    unit: "order",
    isHalal: true,
  },
];

export type CatalogFilters = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  halalOnly?: boolean;
  sort?: "popular" | "price-asc" | "price-desc";
};

export function filterCatalogProducts(filters: CatalogFilters): CatalogProduct[] {
  const query = (filters.query ?? "").trim().toLowerCase();

  let items = CATALOG_PRODUCTS.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (typeof filters.minPrice === "number" && item.price < filters.minPrice) return false;
    if (typeof filters.maxPrice === "number" && item.price > filters.maxPrice) return false;
    if (filters.halalOnly && !item.isHalal) return false;
    if (query && !item.name.toLowerCase().includes(query)) return false;
    return true;
  });

  const sort = filters.sort ?? "popular";
  if (sort === "price-asc") {
    items = [...items].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    items = [...items].sort((a, b) => b.price - a.price);
  } else {
    items = [...items].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  }

  return items;
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
