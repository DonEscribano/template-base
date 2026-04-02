import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const role = user.user_metadata?.role;
  if (role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white p-6 lg:block">
        <h2 className="text-lg font-bold text-[var(--color-primary)]">Admin</h2>
        <nav className="mt-6 space-y-1">
          <a href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</a>
          <a href="/admin/reservas" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Reservas</a>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
