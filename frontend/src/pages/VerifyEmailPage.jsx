import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { authApi } from "../api";

export default function VerifyEmailPage() {
  const { uidb64, token } = useParams();
  const [state, setState] = useState({ status: "loading", message: "Verifying your email..." });

  useEffect(() => {
    let active = true;
    authApi.verifyEmail(uidb64, token)
      .then((res) => {
        if (active) setState({ status: "success", message: res.data?.detail || "Email verified successfully." });
      })
      .catch((err) => {
        if (active) {
          setState({
            status: "error",
            message: err.response?.data?.detail || "Verification link is invalid or expired.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [uidb64, token]);

  const isLoading = state.status === "loading";
  const isSuccess = state.status === "success";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Jan Samadhan AI</span>
          <Link to="/" className="hover:underline">Home</Link>
        </div>
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-md rounded border border-slate-200 bg-white/95 p-7 text-center shadow-xl shadow-slate-200/70">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded bg-cyan-50 text-cyan-700">
            {isLoading ? <Loader2 className="animate-spin" size={28} /> : isSuccess ? <CheckCircle2 size={30} /> : <MailWarning size={30} />}
          </div>
          <h1 className="text-xl font-extrabold text-slate-950">
            {isLoading ? "Verifying email" : isSuccess ? "Email verified" : "Verification failed"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">{state.message}</p>
          <Link to="/login" className="btn-primary mt-6 inline-flex items-center justify-center">
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
