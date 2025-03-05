import AuthLayout from "../AuthLayout";
import RegisterForm from "./handle_register";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Đăng Ký tài khoản LawerChat
      </h1>
      <RegisterForm />
      <div className="text-center mt-4">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}
