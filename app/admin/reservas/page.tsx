import { createServerClient } from "@/lib/supabase/server";

export default async function AdminReservasPage() {
  const supabase = await createServerClient();

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*, services(name), customers(name, phone)")
    .order("date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(50);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Hora</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Servicio</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(reservations ?? []).map((r: any) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{new Date(r.date).toLocaleDateString("es-ES")}</td>
                <td className="px-4 py-3">{r.start_time?.slice(0, 5)}</td>
                <td className="px-4 py-3">
                  <div>{r.customers?.name}</div>
                  <div className="text-xs text-gray-400">{r.customers?.phone}</div>
                </td>
                <td className="px-4 py-3">{r.services?.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!reservations || reservations.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Sin reservas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
