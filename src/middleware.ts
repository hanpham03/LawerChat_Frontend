// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Lấy token từ cookie (cookie 'token' được set khi đăng nhập)
  const token = req.cookies.get("token")?.value;

  // Các đường dẫn không cần đăng nhập
  const publicPaths = ["/login", "/register"];

  // Nếu không có token và request không phải đến public paths, chuyển hướng về /login
  if (!token && !publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Áp dụng middleware cho tất cả các route ngoại trừ các tài nguyên tĩnh (_next, favicon.ico, ...)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
