import { type NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { updateSession } from "@/lib/supabase/middleware";
import { createRateLimiter } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Rate limiters (created once, reused across invocations while warm)
// ---------------------------------------------------------------------------

const contactLimiter = createRateLimiter(5, "1 m");
const reservationsLimiter = createRateLimiter(10, "1 m");
const whatsappLimiter = createRateLimiter(100, "1 m");

// ---------------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------------

const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://*.sentry.io wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

function applySecurityHeaders(response: NextResponse): void {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
}

// ---------------------------------------------------------------------------
// IP extraction
// ---------------------------------------------------------------------------

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// HMAC signature validation for WhatsApp webhooks
// ---------------------------------------------------------------------------

async function verifyWhatsAppSignature(
  request: NextRequest
): Promise<boolean> {
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature) return false;

  const appSecret = process.env.WHATSAPP_TOKEN;
  if (!appSecret) return false;

  try {
    const body = await request.clone().text();
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(appSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    const digest = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const expected = `sha256=${digest}`;
    return signature === expected;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Rate limit helper
// ---------------------------------------------------------------------------

async function checkRateLimit(
  limiter: ReturnType<typeof createRateLimiter>,
  identifier: string
): Promise<NextResponse | null> {
  try {
    const result = await limiter.limit(identifier);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((result.reset - Date.now()) / 1000)
            ),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
          },
        }
      );
    }
  } catch (error) {
    Sentry.captureException(error);
    // Fail open: allow request if rate limiter errors
  }
  return null;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // --- Rate limiting for specific API routes ---

  if (pathname === "/api/contact") {
    const blocked = await checkRateLimit(contactLimiter, `contact:${ip}`);
    if (blocked) {
      applySecurityHeaders(blocked);
      return blocked;
    }
  }

  if (pathname === "/api/reservations" && request.method === "POST") {
    const blocked = await checkRateLimit(
      reservationsLimiter,
      `reservations:${ip}`
    );
    if (blocked) {
      applySecurityHeaders(blocked);
      return blocked;
    }
  }

  if (pathname.startsWith("/api/webhook/whatsapp")) {
    // HMAC signature validation for POST requests
    if (request.method === "POST") {
      const valid = await verifyWhatsAppSignature(request);
      if (!valid) {
        const forbidden = NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 }
        );
        applySecurityHeaders(forbidden);
        return forbidden;
      }
    }

    const blocked = await checkRateLimit(whatsappLimiter, `whatsapp:${ip}`);
    if (blocked) {
      applySecurityHeaders(blocked);
      return blocked;
    }
  }

  // --- Supabase session refresh ---
  const response = await updateSession(request);

  // --- Apply security headers ---
  applySecurityHeaders(response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Static assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
