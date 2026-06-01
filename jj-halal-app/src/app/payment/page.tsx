import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/catalog";

type Params = {
  order?: string;
  method?: "PAYSTACK" | "STRIPE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";
  amount?: string;
  status?: "pending" | "paid";
};

function paymentHelpText(method?: string): string {
  switch (method) {
    case "PAYSTACK":
      return "Use your Paystack checkout link sent to your email/phone to complete payment.";
    case "STRIPE":
      return "Use your Stripe secure payment link to complete this order.";
    case "BANK_TRANSFER":
      return "Transfer to the JJ HALAL FARMS account and include your order number as narration.";
    case "CASH_ON_DELIVERY":
      return "Pay with cash when your rider arrives with your order.";
    default:
      return "Follow the payment instructions to complete your order.";
  }
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const amount = Number(params.amount ?? 0);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 flex items-center justify-between gap-3">
          <Image src="/assets/jj-logo.png" alt="JJ HALAL FARMS LTD." width={120} height={40} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
          <Image src="/assets/banner.jpeg" alt="Payment banner" width={170} height={70} className="hidden sm:block h-12 w-24 rounded-md object-cover" />
        </div>
        <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          Order Received
        </p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Payment Details</h1>

        <div className="mt-5 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
          <p><span className="text-gray-600">Order number:</span> <span className="font-semibold">{params.order ?? "-"}</span></p>
          <p><span className="text-gray-600">Payment method:</span> <span className="font-semibold">{params.method ?? "-"}</span></p>
          <p><span className="text-gray-600">Amount:</span> <span className="font-semibold">{formatNaira(Number.isFinite(amount) ? amount : 0)}</span></p>
          <p>
            <span className="text-gray-600">Status:</span>{" "}
            <span className={params.status === "paid" ? "font-semibold text-green-700" : "font-semibold text-amber-700"}>
              {params.status ?? "pending"}
            </span>
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-700">{paymentHelpText(params.method)}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/orders" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
            Track My Orders
          </Link>
          <Link href="/products" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
            Continue Shopping
          </Link>
          <Link href="/" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
