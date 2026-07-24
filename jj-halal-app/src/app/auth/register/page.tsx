import RegisterForm from "./register-form";

type RegisterPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const initialRole = params.type === "vendor" ? "VENDOR" : "CUSTOMER";

  return <RegisterForm initialRole={initialRole} />;
}
