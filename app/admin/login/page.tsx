import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { createAdminSession, getCurrentAdmin, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) redirect("/admin/login?error=invalid");

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) redirect("/admin/login?error=invalid");

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) redirect("/admin/login?error=invalid");

  await createAdminSession(user.id);
  redirect("/admin/dashboard");
}

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-safari-forest px-4 py-10">
      <section className="w-full max-w-md rounded-md bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Secure admin login</p>
          <h1 className="mt-1 text-3xl font-bold text-safari-ink">KILIFAIR dashboard</h1>
        </div>
        <form action={login} className="grid gap-4">
          <input name="email" type="email" placeholder="admin@kilifair.local" className="rounded-md border px-3 py-3 outline-safari-gold" />
          <input name="password" type="password" placeholder="Password" className="rounded-md border px-3 py-3 outline-safari-gold" />
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-orange px-4 py-3 font-bold text-white">
            <LogIn size={18} />
            Sign in
          </button>
        </form>
        {searchParams.error ? <p className="mt-4 text-sm text-safari-orange">Invalid email or password.</p> : null}
        <p className="mt-5 text-xs text-safari-ink/55">Seed login: admin@kilifair.local / Kilifair2026!</p>
      </section>
    </main>
  );
}
