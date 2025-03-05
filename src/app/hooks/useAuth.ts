"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.id);
        setToken(storedToken);
      } catch (error) {
        console.error("❌ Lỗi khi giải mã token:", error);
      }
    }
  }, []);

  return { userId, token };
}
