import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

// Mock resend so it never actually sends emails
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-id" }),
    },
  })),
}));

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Mario Test",
  email: "mario@test.com",
  message: "Hello world",
  consent: true,
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NOTIFICATION_EMAIL", "");
  });

  it("returns 200 with valid data", async () => {
    const res = await POST(createRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(createRequest({ ...validBody, name: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when consent is not true", async () => {
    const res = await POST(createRequest({ ...validBody, consent: false }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid email", async () => {
    const res = await POST(createRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
  });
});
