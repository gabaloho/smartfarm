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
  price: number;
  oldPrice?: number;
  unit: string;
  isHalal: boolean;
  isFeatured?: boolean;
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { slug: "vegetables", name: "Vegetables", description: "Farm-fresh greens and roots.", emoji: "🥬" },
  { slug: "meat", name: "Meat", description: "Certified halal beef, chicken, and goat.", emoji: "🥩" },
  { slug: "fish", name: "Fish", description: "Fresh and frozen fish options.", emoji: "🐟" },
  { slug: "fruits", name: "Fruits", description: "Seasonal fruits and healthy snacks.", emoji: "🍎" },
  { slug: "dairy-eggs", name: "Dairy & Eggs", description: "Milk, yogurt, and fresh eggs.", emoji: "🥚" },
  { slug: "rice-pulse", name: "Rice & Pulse", description: "Rice, beans, and pantry staples.", emoji: "🌾" },
  { slug: "snacks", name: "Snacks", description: "Bites and treats for every day.", emoji: "🍿" },
  { slug: "bakery", name: "Bakery", description: "Bread and baked essentials.", emoji: "🍞" },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "p1", name: "Fresh Tomatoes", slug: "fresh-tomatoes", category: "vegetables", price: 2800, oldPrice: 3200, unit: "basket", isHalal: true, isFeatured: true },
  { id: "p2", name: "Spinach Leaves", slug: "spinach-leaves", category: "vegetables", price: 900, unit: "bundle", isHalal: true },
  { id: "p3", name: "Premium Goat Meat", slug: "premium-goat-meat", category: "meat", price: 7500, oldPrice: 8200, unit: "kg", isHalal: true, isFeatured: true },
  { id: "p4", name: "Whole Chicken", slug: "whole-chicken", category: "meat", price: 5600, unit: "piece", isHalal: true },
  { id: "p5", name: "Whole Catfish", slug: "whole-catfish", category: "fish", price: 5200, unit: "piece", isHalal: true, isFeatured: true },
  { id: "p6", name: "Mackerel Pack", slug: "mackerel-pack", category: "fish", price: 6800, unit: "pack", isHalal: true },
  { id: "p7", name: "Sweet Apples", slug: "sweet-apples", category: "fruits", price: 4500, oldPrice: 5200, unit: "basket", isHalal: true },
  { id: "p8", name: "Fresh Bananas", slug: "fresh-bananas", category: "fruits", price: 3000, unit: "bunch", isHalal: true },
  { id: "p9", name: "Farm Eggs", slug: "farm-eggs", category: "dairy-eggs", price: 3600, unit: "crate", isHalal: true, isFeatured: true },
  { id: "p10", name: "Full Cream Milk", slug: "full-cream-milk", category: "dairy-eggs", price: 2200, unit: "1L", isHalal: true },
  { id: "p11", name: "Premium Rice", slug: "premium-rice", category: "rice-pulse", price: 7800, unit: "5kg", isHalal: true },
  { id: "p12", name: "Brown Beans", slug: "brown-beans", category: "rice-pulse", price: 4200, unit: "3kg", isHalal: true },
  { id: "p13", name: "Crunchy Groundnuts", slug: "crunchy-groundnuts", category: "snacks", price: 1300, unit: "pack", isHalal: true },
  { id: "p14", name: "Date Bites", slug: "date-bites", category: "snacks", price: 1800, unit: "pack", isHalal: true },
  { id: "p15", name: "Wheat Bread", slug: "wheat-bread", category: "bakery", price: 1200, unit: "loaf", isHalal: true },
  { id: "p16", name: "Meat Pie", slug: "meat-pie", category: "bakery", price: 850, unit: "piece", isHalal: true },
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
