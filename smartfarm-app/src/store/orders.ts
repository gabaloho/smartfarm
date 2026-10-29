"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "pending" | "paid";
export type PaymentMethod = "PAYSTACK" | "STRIPE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";

export interface CustomerOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vendorName: string;
}

export interface CustomerOrderAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface CustomerOrder {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
  items: CustomerOrderItem[];
  address: CustomerOrderAddress;
}

interface OrdersState {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  cancelOrder: (orderNumber: string) => void;
  markPaid: (orderNumber: string) => void;
  updateStatus: (orderNumber: string, status: OrderStatus) => void;
  clearOrders: () => void;
  getOrderByNumber: (orderNumber: string) => CustomerOrder | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((item) => item.orderNumber !== order.orderNumber)],
        }));
      },
      cancelOrder: (orderNumber) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.orderNumber !== orderNumber) return order;
            if (order.status === "DELIVERED") return order;
            return { ...order, status: "CANCELLED" };
          }),
        }));
      },
      markPaid: (orderNumber) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber ? { ...order, paymentStatus: "paid" } : order
          ),
        }));
      },
      updateStatus: (orderNumber, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber ? { ...order, status } : order
          ),
        }));
      },
      clearOrders: () => set({ orders: [] }),
      getOrderByNumber: (orderNumber) => get().orders.find((item) => item.orderNumber === orderNumber),
    }),
    { name: "jj-halal-orders" }
  )
);
