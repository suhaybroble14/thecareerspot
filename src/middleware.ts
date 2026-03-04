import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your_")) {
    // Supabase not configured — let requests through without auth checks
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected: /dashboard requires login
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Protected: /profile requires login
    if (request.nextUrl.pathname === "/profile") {
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", "/profile");
        return NextResponse.redirect(loginUrl);
      }
    }

    // Protected: /admin requires login + admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Protected: /welcome requires login
    if (request.nextUrl.pathname === "/welcome") {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Redirect logged-in users away from login page
    if (request.nextUrl.pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("[Middleware] Auth check failed:", error);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile", "/welcome", "/login"],
};
