import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function ResetPasswordRequired() {
  const { logout } = useAuth();

  useEffect(() => {
    // ensure flag remains until user completes process
    localStorage.setItem("must_change_password", JSON.stringify(true));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E2] max-w-md w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FFF4E6] flex items-center justify-center text-[#FF8A00]">
          <Shield size={20} />
        </div>
        <h1 className="text-xl font-bold text-[#1A1D1F] mb-2">Password Reset Required</h1>
        <p className="text-sm text-[#6E7191] mb-6">
          For security, you must set a new password before accessing the dashboard.
          Please use the password reset link sent to your email, then sign in again.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-black transition-colors font-semibold"
          >
            Go to Login
          </Link>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-white border border-[#E0E0E2] text-[#6E7191] rounded-xl hover:bg-[#F7F7F8] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
