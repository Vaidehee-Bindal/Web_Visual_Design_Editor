import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "http://localhost:4000";

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    const targetUrl =
      `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }

    // Forward the Auth.js session cookie to the Express backend
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers.set("cookie", cookie);
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });

    const responseBody = await response.arrayBuffer();

    const responseHeaders = new Headers();

    const responseContentType = response.headers.get("content-type");
    if (responseContentType) {
      responseHeaders.set("content-type", responseContentType);
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend proxy error:", error);

    return NextResponse.json(
      { error: "Unable to connect to backend" },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;