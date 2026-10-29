import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

type RegisterPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  if (params.type === "vendor") {
    redirect("/auth/register/seller");
  }

  return <RegisterForm mode="buyer" />;
}
