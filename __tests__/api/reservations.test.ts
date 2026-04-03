import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase before importing the route
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

const mockFrom = vi.fn().mockImplementation((table: string) => {
  const chain: Record<string, any> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.neq = vi.fn().mockReturnValue(chain);
  chain.lt = vi.fn().mockReturnValue(chain);
  chain.gt = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn();

  if (table === "services") {
    chain.single.mockResolvedValue({
      data: { duration_minutes: 60, price_cents: 5000 },
      error: null,
    });
  } else if (table === "reservations") {
    // For conflict check (select after neq/lt/gt)
    chain.gt.mockReturnValue({
      ...chain,
      then: undefined,
    });
    // Default: no conflicts, successful insert
    const resolvedChain = { ...chain };
    resolvedChain.gt = vi.fn().mockResolvedValue({ data: [], error: null });
    resolvedChain.single = vi.fn().mockResolvedValue({
      data: { id: "res-1", date: "2026-04-10", start_time: "10:00", end_time: "11:00", status: "pending" },
      error: null,
    });
    return resolvedChain;
  } else if (table === "customers") {
    chain.single.mockResolvedValue({
      data: { id: "cust-1" },
      error: null,
    });
  }

  return chain;
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Now import the route (after mocks are set up)
const { POST } = await import("@/app/api/reservations/route");

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validReservation = {
  service_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  date: "2026-04-10",
  start_time: "10:00",
  customer_name: "Mario Test",
  customer_phone: "+34612345678",
};

describe("POST /api/reservations", () => {
  it("returns 400 when service_id is missing", async () => {
    const { service_id, ...noService } = validReservation;
    const res = await POST(createRequest(noService));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Datos invalidos");
  });

  it("returns 400 with invalid date format", async () => {
    const res = await POST(createRequest({ ...validReservation, date: "10/04/2026" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Datos invalidos");
  });

  it("returns 400 when customer_phone is missing", async () => {
    const { customer_phone, ...noPhone } = validReservation;
    const res = await POST(createRequest(noPhone));

    expect(res.status).toBe(400);
  });
});
