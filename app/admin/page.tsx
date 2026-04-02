import { createServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createServerClient();
  const today = new Date().toISOString().split("T")[0];

  const [reservationsToday, totalCustomers, pendingReservations] = await Promise.all([
    supabase.from("reservations").select("id", { count: "exact" }).eq("date", today).then((r) => r.count ?? 0),
    supabase.from("customers").select("id", { count: "exact" }).then((r) => r.count ?? 0),
    supabase.from("reservations").select("id", { count: "exact" }).eq("status", "pending").then((r) => r.count ?? 0),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Citas hoy" value={reservationsToday} />
        <StatCard label="Pendientes" value={pendingReservations} />
        <StatCard label="Clientes totales" value={totalCustomers} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
