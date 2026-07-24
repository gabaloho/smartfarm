import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          };
        };
        vendor: {
          select: {
            shopName: true,
          };
        };
      };
    };
    address: true;
  };
}>;

export type ApiOrder = {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    vendorName: string;
  }>;
  address: {
    label: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  } | null;
};

export function toApiOrder(order: OrderWithRelations): ApiOrder {
  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    notes: order.notes ?? undefined,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPrice: item.price,
      vendorName: item.vendor.shopName,
    })),
    address: order.address
      ? {
          label: order.address.label,
          street: order.address.street,
          city: order.address.city,
          state: order.address.state,
          country: order.address.country,
          postalCode: order.address.postalCode ?? undefined,
        }
      : null,
  };
}
