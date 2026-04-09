import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, Mail, Lock, Phone, User, Eye, EyeOff,
  ArrowRight, CheckCircle2, AlertCircle, ChevronLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loadGoogleIdentityScript } from "../lib/google";

type Mode = "login" | "register";
type RegisterStep = 1 | 2;

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.1 1.53 7.5 2.82l5.47-5.47C33.64 3.81 29.28 1.8 24 1.8 14.72 1.8 6.71 7.12 2.79 14.88l6.38 4.95C10.95 13.61 16.96 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.2 24.5c0-1.57-.14-2.73-.44-3.93H24v7.45h12.67c-.26 2.02-1.67 5.07-4.8 7.11l7.36 5.7c4.41-4.07 6.97-10.05 6.97-16.33z"
      />
      <path
        fill="#FBBC05"
        d="M9.17 28.17a14.9 14.9 0 0 1 0-8.34l-6.38-4.95a24.02 24.02 0 0 0 0 18.24l6.38-4.95z"
      />
      <path
        fill="#34A853"
        d="M24 46.2c5.28 0 9.72-1.74 12.96-4.73l-7.36-5.7c-1.97 1.37-4.61 2.32-5.6 2.32-7.04 0-13.05-4.11-15.02-9.83l-6.38 4.95C6.71 40.88 14.72 46.2 24 46.2z"
      />
    </svg>
  );
}

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<RegisterStep>(1);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { login, register, loginWithGoogle, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleClientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined, []);
  
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Set mode based on URL
  useEffect(() => {
    if (location.pathname === "/register") setMode("register");
    else if (location.pathname === "/login") setMode("login");
  }, [location.pathname]);

  // If already logged in, redirect based on role
  if (isLoggedIn && user) {
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }



  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "", phone: "", email: "", password: "", sscGpa: "", hscGpa: "", subject: "",
  });

  // After successful registration: switch to login, autofill email, clear password, focus password.
  useEffect(() => {
    if (!success || !registeredEmail) return;
    const t = window.setTimeout(() => {
      setMode("login");
      setStep(1);
      setLoginForm({ email: registeredEmail, password: "" });
      setSuccess("");
    }, 900);
    return () => window.clearTimeout(t);
  }, [success, registeredEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.success) {
      navigate(result.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(result.message);
    }
  };

  const handleGoogleCallback = useCallback(async (resp: any) => {
    if (!resp?.credential) return;
    try {
      setError("");
      setLoading(true);
      const result = await loginWithGoogle(resp.credential);
      if (result.success) {
        navigate(result.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setError(result.message);
      }
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    let mounted = true;
    const initGoogle = async () => {
      try {
        if (!googleClientId) return;
        await loadGoogleIdentityScript();
        if (!mounted) return;

        if (googleBtnRef.current) {
          const mod = await import("../lib/google");
          mod.initializeAndRenderGoogleButton({
            clientId: googleClientId,
            element: googleBtnRef.current,
            callback: handleGoogleCallback,
            theme: "outline",
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load Google SDK", err);
      }
    };

    void initGoogle();
    return () => { mounted = false; };
  }, [googleClientId, handleGoogleCallback, mode]);

  // After successful registration: switch to login, autofill email, clear password, focus password.


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!regForm.name || !regForm.phone || !regForm.email) {
        setError("Please fill in all required fields.");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 — final submit
    if (!regForm.password || regForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await register(regForm);
    setLoading(false);

    if (result.success) {
      setRegisteredEmail(regForm.email);
      setSuccess("Account created successfully!");
    } else {
      setError(result.message);
    }
  };

  const switchToLogin = (email?: string) => {
    setMode("login");
    setStep(1);
    setError("");
    setSuccess("");
    if (email) setLoginForm((p) => ({ ...p, email }));
  };

  return (
    <div className="min-h-screen bg-[#1A0A02] flex">
      {/* ── Left Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C1208] to-[#1A0A02]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#D4A857 1px, transparent 1px), linear-gradient(90deg, #D4A857 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-xl flex items-center justify-center">
              <GraduationCap style={{ width: 22, height: 22, color: "#1A0A02" }} />
            </div>
            <div>
              <span className="text-white text-base block" style={{ fontWeight: 700 }}>BD Admission</span>
              <span className="text-[#D4A857]/80 text-xs">Support System</span>
            </div>
          </Link>
        </div>

        <div className="relative">
          <h2 className="text-white mb-5" style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.25 }}>
            Your Path to the{" "}
            <span className="text-[#D4A857]">Right University</span>{" "}
            Starts Here
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8">
            Join 100+ Bangladeshi students who found their dream universities through our platform.
          </p>

          <div className="space-y-4">
            {[
              { icon: "🎓", text: "Browse 155+ university & college profiles" },
              { icon: "📋", text: "Track your application status in real-time" },
              { icon: "৳", text: "Discover scholarships matching your GPA" },
              { icon: "🏠", text: "Budget planning with living cost estimator" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg w-6 text-center">{icon}</span>
                <p className="text-white/65 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            { value: "15K+", label: "Students" },
            { value: "98%", label: "Success Rate" },
            { value: "155+", label: "Universities" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/5 border border-[#D4A857]/15 rounded-xl p-4 text-center">
              <div className="text-[#D4A857]" style={{ fontSize: "1.3rem", fontWeight: 700 }}>{value}</div>
              <div className="text-white/40 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-xl flex items-center justify-center">
                <GraduationCap style={{ width: 18, height: 18, color: "#1A0A02" }} />
              </div>
              <span className="text-white text-base" style={{ fontWeight: 700 }}>Admission Bondu</span>
            </Link>
          </div>

          {/* ── SUCCESS SCREEN ──────────────────────────────── */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 style={{ width: 36, height: 36, color: "#22c55e" }} />
                </div>
                <h2 className="text-white mb-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {success}
                </h2>
                <p className="text-white/50 text-sm mb-8">
                  Redirecting to login…
                </p>
              </motion.div>
            ) : (
              <motion.div key={mode} initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                {/* Tab Switcher */}
                  <div className="bg-white/8 p-1 rounded-2xl mb-7 flex border border-white/10">
                    {(["login", "register"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => { 
                          setMode(m); 
                          setStep(1); 
                          setError("");
                          navigate(m === "login" ? "/login" : "/register");
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                          mode === m ? "bg-[#D4A857] text-[#1A0A02]" : "text-white/50 hover:text-white"
                        }`}
                        style={{ fontWeight: mode === m ? 600 : 400 }}
                      >
                        {m === "login" ? "Login" : "Register"}
                      </button>
                    ))}
                  </div>

                {/* ── LOGIN FORM ─────────────────────────── */}
                {mode === "login" ? (
                  <div>
                    <h2 className="text-white mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Welcome Back</h2>
                    <p className="text-white/40 text-sm mb-6">
                      Login to access your dashboard and track applications.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <AlertCircle style={{ width: 16, height: 16, color: "#f87171", flexShrink: 0 }} />
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-white/60 text-xs mb-1.5 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                          <input
                            type="email"
                            required
                            value={loginForm.email}
                            onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="your@email.com"
                            className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/60 text-xs mb-1.5 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                          <input
                            type={showPass ? "text" : "password"}
                            required
                            value={loginForm.password}
                            onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                            placeholder="••••••••"
                            className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-11 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm transition-colors"
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-white/50 text-xs cursor-pointer">
                          <input type="checkbox" className="accent-[#D4A857] w-3.5 h-3.5" />
                          Remember me
                        </label>
                        <a href="#" className="text-[#D4A857] text-xs hover:opacity-80 transition-opacity">Forgot Password?</a>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-[#D4A857] to-[#A8742C] text-[#1A0A02] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-[#1A0A02]/30 border-t-[#1A0A02] rounded-full animate-spin" />
                        ) : (
                          <>
                            Login to Dashboard
                            <ArrowRight style={{ width: 16, height: 16 }} />
                          </>
                        )}
                      </button>
                    </form>


                    <p className="text-center text-white/40 text-sm mt-6">
                      Don't have an account?{" "}
                      <button onClick={() => { setMode("register"); setError(""); navigate("/register"); }} className="text-[#D4A857] hover:opacity-80 transition-opacity">
                        Register Free
                      </button>
                    </p>
                  </div>
                ) : (
                  /* ── REGISTER FORM ─────────────────────── */
                  <div>
                    {step === 2 && (
                      <button
                        onClick={() => { setStep(1); setError(""); }}
                        className="flex items-center gap-1.5 text-[#D4A857]/70 hover:text-[#D4A857] text-sm mb-4 transition-colors"
                      >
                        <ChevronLeft style={{ width: 16, height: 16 }} />
                        Back
                      </button>
                    )}

                    <h2 className="text-white mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Create Account</h2>
                    <p className="text-white/40 text-sm mb-5">Free registration — takes less than 2 minutes.</p>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-6">
                      {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                              step > s
                                ? "bg-green-500 text-white"
                                : step === s
                                ? "bg-[#D4A857] text-[#1A0A02]"
                                : "bg-white/10 text-white/40"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {step > s ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : s}
                          </div>
                          <span className={`text-xs ${step >= s ? "text-white/60" : "text-white/25"}`}>
                            {s === 1 ? "Basic Info" : "Academic Details"}
                          </span>
                          {s < 2 && (
                            <div className={`flex-1 h-px ${step > 1 ? "bg-[#D4A857]/50" : "bg-white/15"}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <AlertCircle style={{ width: 16, height: 16, color: "#f87171", flexShrink: 0 }} />
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                            <div>
                              <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                                <input
                                  required
                                  value={regForm.name}
                                  onChange={(e) => setRegForm((p) => ({ ...p, name: e.target.value }))}
                                  placeholder="Your full name"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-white/60 text-xs mb-1.5 block">Phone Number *</label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                                <input
                                  required
                                  value={regForm.phone}
                                  onChange={(e) => setRegForm((p) => ({ ...p, phone: e.target.value }))}
                                  placeholder="+880 1700-000000"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-white/60 text-xs mb-1.5 block">Email Address *</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                                <input
                                  type="email"
                                  required
                                  value={regForm.email}
                                  onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
                                  placeholder="your@email.com"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-white/60 text-xs mb-1.5 block">SSC GPA</label>
                                <input
                                  value={regForm.sscGpa}
                                  onChange={(e) => setRegForm((p) => ({ ...p, sscGpa: e.target.value }))}
                                  placeholder="e.g. 5.00"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-white/60 text-xs mb-1.5 block">HSC GPA</label>
                                <input
                                  value={regForm.hscGpa}
                                  onChange={(e) => setRegForm((p) => ({ ...p, hscGpa: e.target.value }))}
                                  placeholder="e.g. 4.83"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-white/60 text-xs mb-1.5 block">Preferred Subject</label>
                              <select
                                value={regForm.subject}
                                onChange={(e) => setRegForm((p) => ({ ...p, subject: e.target.value }))}
                                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4A857]/50 text-sm"
                              >
                                <option value="" className="bg-[#1A0A02]">Select subject</option>
                                {["CSE", "EEE", "BBA", "MBBS", "Civil Engineering", "Architecture", "English", "Pharmacy", "Law", "Economics"].map((s) => (
                                  <option key={s} value={s} className="bg-[#1A0A02]">{s}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-white/60 text-xs mb-1.5 block">Password *</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" style={{ width: 15, height: 15 }} />
                                <input
                                  type={showPass ? "text" : "password"}
                                  required
                                  value={regForm.password}
                                  onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                                  placeholder="Min. 6 characters"
                                  className="w-full bg-white/8 border border-white/15 rounded-xl pl-11 pr-11 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A857]/50 text-sm"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                  {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-[#D4A857] to-[#A8742C] text-[#1A0A02] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-[#1A0A02]/30 border-t-[#1A0A02] rounded-full animate-spin" />
                        ) : (
                          <>
                            {step === 1 ? "Continue" : "Create Account"}
                            <ArrowRight style={{ width: 16, height: 16 }} />
                          </>
                        )}
                      </button>
                    </form>


                    <p className="text-center text-white/40 text-sm mt-5">
                      Already have an account?{" "}
                      <button onClick={() => { setMode("login"); setError(""); navigate("/login"); }} className="text-[#D4A857] hover:opacity-80 transition-opacity">
                        Login
                      </button>
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified Google Login/Signup Section - Always Horizontal & Stable */}
          <div className="mt-6 border-t border-white/5 pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/35 text-[10px] uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="w-full flex justify-center group">
              <div className="w-full max-w-[400px] h-[52px] bg-white rounded-xl overflow-hidden border-2 border-transparent group-hover:border-[#D4A857]/40 transition-all shadow-lg flex items-center justify-center relative">
                {/* 1. The Fixed Visual Button (Always Visible) */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 px-4 pointer-events-none">
                  <GoogleLogo className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-[#1A0A02]">
                    {mode === "login" ? "Login with Google" : "Sign up with Google"}
                  </span>
                </div>

                {/* 2. The Invisible Official Trigger (Layered on top) */}
                {googleClientId ? (
                  <div 
                    ref={googleBtnRef} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    style={{ transform: "scale(2)", transformOrigin: "center" }}
                  ></div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setError("Google Login is being configured. Please use Email for now.")}
                    className="absolute inset-0 z-20 opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <p className="text-center text-white/30 text-[10px] mt-4 uppercase tracking-widest">
              Secure authentication powered by Google Identity
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
