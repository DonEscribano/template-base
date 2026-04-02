"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
}

type Step = "service" | "date" | "time" | "info" | "confirm" | "success";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function ReservasPage() {
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [customerData, setCustomerData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load services
  useEffect(() => {
    // BUILDER: replace with Supabase query
    setServices([
      { id: "demo-1", name: "Fisioterapia General", duration_minutes: 60, price_cents: 4500 },
      { id: "demo-2", name: "Masaje Deportivo", duration_minutes: 45, price_cents: 3500 },
      { id: "demo-3", name: "Rehabilitacion", duration_minutes: 90, price_cents: 6000 },
    ]);
  }, []);

  // Load available slots when date changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return;
    setLoading(true);
    fetch(`/api/availability?date=${selectedDate}&service_id=${selectedService.id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setLoading(false);
      })
      .catch(() => {
        setAvailableSlots([]);
        setLoading(false);
      });
  }, [selectedDate, selectedService]);

  async function handleConfirm() {
    if (!selectedService) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          date: selectedDate,
          start_time: selectedTime,
          customer_name: customerData.name,
          customer_email: customerData.email || undefined,
          customer_phone: customerData.phone,
          notes: customerData.notes || undefined,
        }),
      });

      if (res.ok) {
        setStep("success");
      } else {
        const data = await res.json();
        setError(data.error || "Error al reservar");
      }
    } catch {
      setError("Error de conexion");
    }
    setLoading(false);
  }

  // Get next 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--color-text)] text-center">Reservar cita</h1>

      {/* Progress */}
      <div className="mt-8 flex justify-center gap-2">
        {(["service", "date", "time", "info", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className={`h-2 w-12 rounded-full ${
            (["service", "date", "time", "info", "confirm"] as Step[]).indexOf(step) >= i
              ? "bg-[var(--color-primary)]"
              : "bg-gray-200"
          }`} />
        ))}
      </div>

      <div className="mt-10">
        {step === "service" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">1. Elige servicio</h2>
            {services.map((s) => (
              <button key={s.id} onClick={() => { setSelectedService(s); setStep("date"); }}
                className="w-full rounded-lg border border-gray-200 p-4 text-left transition hover:border-[var(--color-primary)] hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--color-text)]">{s.name}</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">{formatPrice(s.price_cents)}</span>
                </div>
                <span className="text-sm text-[var(--color-text)]/50">{s.duration_minutes} minutos</span>
              </button>
            ))}
          </div>
        )}

        {step === "date" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">2. Elige fecha</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {dates.map((d) => {
                const dateObj = new Date(d);
                const dayName = dateObj.toLocaleDateString("es-ES", { weekday: "short" });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString("es-ES", { month: "short" });
                return (
                  <button key={d} onClick={() => { setSelectedDate(d); setStep("time"); }}
                    className="rounded-lg border border-gray-200 p-3 text-center transition hover:border-[var(--color-primary)]">
                    <div className="text-xs text-[var(--color-text)]/50 capitalize">{dayName}</div>
                    <div className="text-lg font-bold text-[var(--color-text)]">{dayNum}</div>
                    <div className="text-xs text-[var(--color-text)]/50 capitalize">{monthName}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep("service")} className="text-sm text-[var(--color-primary)]">Volver</button>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">3. Elige hora</h2>
            {loading ? (
              <p className="text-sm text-[var(--color-text)]/50">Cargando horarios...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-[var(--color-text)]/50">No hay horarios disponibles para esta fecha.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button key={slot} onClick={() => { setSelectedTime(slot); setStep("info"); }}
                    className="rounded-lg border border-gray-200 py-2 text-center text-sm font-medium transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
                    {slot}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep("date")} className="text-sm text-[var(--color-primary)]">Volver</button>
          </div>
        )}

        {step === "info" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">4. Tus datos</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">Nombre *</label>
              <input type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Telefono *</label>
                <input type="tel" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })} required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Email</label>
                <input type="email" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">Notas</label>
              <textarea value={customerData.notes} onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })} rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep("time")} className="text-sm text-[var(--color-primary)]">Volver</button>
              <button onClick={() => { if (customerData.name && customerData.phone) setStep("confirm"); }}
                disabled={!customerData.name || !customerData.phone}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-semibold text-white disabled:opacity-50">
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && selectedService && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">5. Confirmar reserva</h2>
            <div className="rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Servicio</span><span className="text-sm font-medium">{selectedService.name}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Fecha</span><span className="text-sm font-medium">{new Date(selectedDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Hora</span><span className="text-sm font-medium">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Precio</span><span className="text-sm font-bold text-[var(--color-primary)]">{formatPrice(selectedService.price_cents)}</span></div>
              <hr />
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Nombre</span><span className="text-sm">{customerData.name}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[var(--color-text)]/60">Telefono</span><span className="text-sm">{customerData.phone}</span></div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-4">
              <button onClick={() => setStep("info")} className="text-sm text-[var(--color-primary)]">Volver</button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-semibold text-white disabled:opacity-50">
                {loading ? "Reservando..." : "Confirmar reserva"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Reserva confirmada</h2>
            <p className="mt-2 text-[var(--color-text)]/60">Te enviaremos un recordatorio antes de tu cita.</p>
            <a href="/" className="mt-6 inline-block text-sm text-[var(--color-primary)] underline">Volver al inicio</a>
          </div>
        )}
      </div>
    </div>
  );
}
