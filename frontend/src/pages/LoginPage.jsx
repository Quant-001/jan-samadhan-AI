import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { LogIn, MailCheck, Search, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from;
  const verificationMessage = location.state?.verificationMessage;

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (form.username.includes("*")) {
      toast.error("Enter your exact username or email address.");
      return;
    }
    setLoading(true);
    try {
      const userData = await login(form);
      toast.success(`Welcome back, ${userData.first_name || userData.username}!`);
      if (from && userData.role === "CITIZEN") navigate(from, { replace: true });
      else if (userData.role === "ADMIN") navigate("/admin/dashboard");
      else if (userData.role === "OFFICER") navigate("/officer/dashboard");
      else navigate("/citizen/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail) {
        toast.error(detail);
      } else if (!err.response) {
        toast.error("Login server is not reachable. Please try again later.");
      } else if (err.response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Jan Samadhan AI</span>
          <Link to="/" className="hover:underline">Home</Link>
        </div>
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-lg rounded border border-slate-200 bg-white/95 p-7 shadow-xl shadow-slate-200/70">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded bg-cyan-400 text-lg font-black text-slate-950">JS</div>
            <h1 className="text-2xl font-extrabold text-slate-950">
              Sign in
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Access citizen, officer, or admin dashboard
            </p>
          </div>

          {verificationMessage && (
            <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
              <div className="flex items-start gap-2">
                <MailCheck className="mt-0.5 shrink-0" size={17} />
                <span>{verificationMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    className="input pl-9"
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Enter username or email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    className="input pl-9 pr-11"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-base">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                {loading ? "Please wait..." : "Continue"}
              </button>
            </form>

          {
            <>
              <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm font-semibold">
                <Link to="/register" state={{ from }} className="mr-4 text-cyan-700 hover:underline">
                  Click here to sign up
                </Link>
                <Link to="/track" className="inline-flex items-center gap-1 text-slate-900 hover:underline">
                  <Search size={15} /> Track by Ticket ID
                </Link>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}
