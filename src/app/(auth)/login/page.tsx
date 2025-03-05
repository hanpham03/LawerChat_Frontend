import AuthLayout from "../AuthLayout";
import LoginForm from "./handle_login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Đăng Nhập vào LawerChat
      </h1>
      <LoginForm />
      <div className="text-center mt-4">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Đăng ký
        </Link>
      </div>
    </AuthLayout>
  );
}
