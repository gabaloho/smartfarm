import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Authentication error</h1>
        <p className="mt-2 text-sm text-gray-600">
          We could not complete your sign-in request. Please try again.
        </p>
        <Link
          href="/auth/login"
          className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
