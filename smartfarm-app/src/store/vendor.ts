"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

interface VendorState {
  products: VendorProduct[];
  addProduct: (product: Omit<VendorProduct, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Omit<VendorProduct, "id" | "createdAt">>) => void;
  removeProduct: (id: string) => void;
  toggleActive: (id: string) => void;
}

const seedProducts: VendorProduct[] = [
  {
    id: "vp-1",
    name: "Premium Goat Meat",
    category: "Meat",
    price: 7500,
    stock: 35,
    unit: "kg",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vp-2",
    name: "Whole Catfish",
    category: "Fish",
    price: 5200,
    stock: 18,
    unit: "piece",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vp-3",
    name: "Farm Eggs",
    category: "Dairy & Eggs",
    price: 3600,
    stock: 64,
    unit: "crate",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const useVendorStore = create<VendorState>()(
  persist(
    (set) => ({
      products: seedProducts,
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              id: `vp-${Math.random().toString(36).slice(2, 10)}`,
              createdAt: new Date().toISOString(),
              ...product,
            },
            ...state.products,
          ],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((item) => (item.id === id ? { ...item, ...product } : item)),
        })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
        })),
    }),
    { name: "jj-halal-vendor-products" }
  )
);
