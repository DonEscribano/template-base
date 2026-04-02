import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { reservationSchema } from "@/lib/utils/validation";
import { z } from "zod";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const supabase = getServiceClient();
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const status = url.searchParams.get("status");

  let query = supabase
    .from("reservations")
    .select("*, services(name, duration_minutes), customers(name, phone, email)")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (date) query = query.eq("date", date);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = reservationSchema.parse(body);

    const supabase = getServiceClient();

    // Get service to calculate end_time and price
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes, price_cents")
      .eq("id", input.service_id)
      .eq("active", true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    // Calculate end_time
    const [h, m] = input.start_time.split(":").map(Number);
    const endMinutes = h * 60 + m + service.duration_minutes;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

    // Check slot availability
    const { data: conflicts } = await supabase
      .from("reservations")
      .select("id")
      .eq("date", input.date)
      .neq("status", "cancelled")
      .lt("start_time", endTime)
      .gt("end_time", input.start_time);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
    }

    // Get or create customer
    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", input.customer_phone)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: input.customer_name,
          email: input.customer_email,
          phone: input.customer_phone,
          whatsapp_opt_in: input.whatsapp_opt_in ?? false,
        })
        .select("id")
        .single();

      if (customerError || !newCustomer) {
        return NextResponse.json({ error: "Error creando cliente" }, { status: 500 });
      }
      customerId = newCustomer.id;
    }

    // Create reservation
    const { data: reservation, error: resError } = await supabase
      .from("reservations")
      .insert({
        customer_id: customerId,
        service_id: input.service_id,
        team_member_id: input.team_member_id || null,
        date: input.date,
        start_time: input.start_time,
        end_time: endTime,
        status: "pending",
        price_cents: service.price_cents,
        notes: input.notes || null,
        source: "web",
      })
      .select("id, date, start_time, end_time, status")
      .single();

    if (resError) {
      return NextResponse.json({ error: resError.message }, { status: 500 });
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos invalidos", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
