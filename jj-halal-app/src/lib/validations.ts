import { z } from "zod";
import { AccountType, InstitutionType, UserRole } from "@prisma/client";
import { SELLER_CATEGORIES } from "@/lib/seller-categories";

function normalizeCac(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function isBnFormat(value: string): boolean {
  return /^BN\d{3,}$/.test(normalizeCac(value));
}

function isRcFormat(value: string): boolean {
  return /^RC\d{3,}$/.test(normalizeCac(value));
}

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  totp: z.string().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum([UserRole.CUSTOMER, UserRole.VENDOR]),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    accountType: z.nativeEnum(AccountType),
    institutionName: z.string().optional(),
    institutionType: z.nativeEnum(InstitutionType).optional(),
    businessName: z.string().optional(),
    businessType: z.nativeEnum(InstitutionType).optional(),
    brandName: z.string().optional(),
    sellerCategory: z.enum(SELLER_CATEGORIES).optional().or(z.literal("")),
    cacNumber: z.string().max(40, "CAC number is too long").optional().or(z.literal("")),
    sellerAddress: z.string().max(200, "Address is too long").optional().or(z.literal("")),
    sellerBio: z.string().max(400, "Bio is too long").optional().or(z.literal("")),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (d) => {
      if (d.accountType !== AccountType.INSTITUTIONAL) return true;
      const name = d.businessName ?? d.institutionName;
      return Boolean(name && name.trim().length > 2);
    },
    {
      message: "Business name is required for business accounts",
      path: ["businessName"],
    }
  )
  .refine(
    (d) => {
      if (d.accountType !== AccountType.INSTITUTIONAL) return true;
      return Boolean(d.businessType ?? d.institutionType);
    },
    {
      message: "Business legal type is required for business accounts",
      path: ["businessType"],
    }
  )
  .refine(
    (d) => {
      if (d.accountType !== AccountType.INSTITUTIONAL) return true;
      const type = d.businessType ?? d.institutionType;
      const requiresCac = type === InstitutionType.EATERY || type === InstitutionType.RESTAURANT;
      if (!requiresCac) return true;
      const cac = d.cacNumber?.trim() ?? "";
      return cac.length >= 3;
    },
    {
      message: "CAC number is required for registered business name (CAC BN) and limited liability company (CAC RC)",
      path: ["cacNumber"],
    }
  )
  .refine(
    (d) => {
      if (d.accountType !== AccountType.INSTITUTIONAL) return true;
      const type = d.businessType ?? d.institutionType;
      const cac = d.cacNumber?.trim() ?? "";
      if (!cac) return true;

      if (type === InstitutionType.EATERY) {
        return isBnFormat(cac);
      }

      if (type === InstitutionType.RESTAURANT) {
        return isRcFormat(cac);
      }

      return /^((BN|RC)\d{3,})$/i.test(normalizeCac(cac));
    },
    {
      message: "Invalid CAC format. Use BN1234567 for business name or RC1234567 for limited company.",
      path: ["cacNumber"],
    }
  )
  .refine(
    (d) => d.role !== UserRole.VENDOR || (d.brandName && d.brandName.trim().length >= 2),
    {
      message: "Brand name is required for seller registration",
      path: ["brandName"],
    }
  )
  .refine(
    (d) => d.role !== UserRole.VENDOR || Boolean(d.sellerCategory),
    {
      message: "Seller category is required for seller registration",
      path: ["sellerCategory"],
    }
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("Nigeria"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  addressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.enum(["PAYSTACK", "STRIPE", "BANK_TRANSFER", "CASH_ON_DELIVERY"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  unit: z.string().default("kg"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0),
  minOrder: z.number().int().min(1).default(1),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isHalal: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
