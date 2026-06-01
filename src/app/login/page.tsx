import { FormLogin } from "../../features/auth/components/FormLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 px-4">
      <FormLogin />
    </div>
  );
}