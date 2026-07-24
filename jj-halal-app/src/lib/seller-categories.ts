export const SELLER_CATEGORIES = [
  "Fresh Produce: Vegetables (tomatoes, peppers, ugu/pumpkin leaves), root crops (cassava, yams, potatoes), and fruits (plantains, citrus).",
  "Livestock & Poultry: Meat (broilers, beef, goat), eggs, and day-old chicks.",
  "Cash Crops: Grains (maize, rice, soybeans), and oil crops (palm oil, sesame).",
  "Value-Added Goods: Processed items like dried herbs, honey, jams, or packaged flours.",
  "Supermarkets",
  "eatry",
  "small chops",
] as const;

export type SellerCategory = (typeof SELLER_CATEGORIES)[number];