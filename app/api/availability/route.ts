import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const serviceId = url.searchParams.get("service_id");

  if (!date || !serviceId) {
    return NextResponse.json(
      { error: "date y service_id son obligatorios" },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Formato de fecha invalido (YYYY-MM-DD)" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Use the SQL function for accurate slot calculation
  const { data: slots, error } = await supabase.rpc("get_available_slots", {
    p_date: date,
    p_service_id: serviceId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    date,
    service_id: serviceId,
    slots: (slots || []).map((s: { slot_time: string }) => s.slot_time.slice(0, 5)),
  });
}
