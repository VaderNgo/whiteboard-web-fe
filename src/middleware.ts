import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AxiosInstance } from "./lib/axios";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("connect.sid")?.value;
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    // Not logged in
    if (!session) return NextResponse.redirect(new URL("/", request.url));

    // Check if session is valid
    try {
      await AxiosInstance.get("/auth/me", {
        headers: {
          Cookie: `connect.sid=${session}`,
        },
      });
      return NextResponse.next();
    } catch {
      // Invalid session, delete cookie and redirect to home page
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("connect.sid");
      return response;
    }
  }

  // Redirect to dashboard if logged in
  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
