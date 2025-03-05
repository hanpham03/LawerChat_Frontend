import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="destructive">Home</Button>
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
