"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface AuthSliderProps {
  initialMode: "login" | "register";
}

export default function AuthSlider({ initialMode }: AuthSliderProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Active form mode and continuous sweep direction ("to-left" | "to-right" | null)
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [sweepDir, setSweepDir] = useState<"to-left" | "to-right" | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Shared feedback state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Runs ONE continuous 850ms GPU sweep; swaps the form right at 390ms while covered
  const handleSwitchMode = useCallback(
    (nextMode: "login" | "register") => {
      if (sweepDir !== null || nextMode === mode) return;

      setError("");
      setSuccess("");
      setSweepDir(nextMode === "register" ? "to-left" : "to-right");

      // Midpoint (46% of 850ms ≈ 390ms): card is 100% covered by the dark blade
      setTimeout(() => {
        setMode(nextMode);
        window.history.replaceState(
          null,
          "",
          nextMode === "login" ? "/login" : "/register"
        );
      }, 390);

      // Clear animation class right when the 850ms sweep finishes
      setTimeout(() => {
        setSweepDir(null);
      }, 860);
    },
    [mode, sweepDir]
  );

  // Listen for Navbar Login/Register clicks so the blade sweeps from the Navbar too
  useEffect(() => {
    function onAuthSwitch(e: Event) {
      const customEvent = e as CustomEvent<"login" | "register">;
      handleSwitchMode(customEvent.detail);
    }

    window.addEventListener("auth-switch", onAuthSwitch);
    return () => window.removeEventListener("auth-switch", onAuthSwitch);
  }, [handleSwitchMode]);

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginEmail.trim() || !loginPassword) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginUser({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      await refreshUser();

      if (data?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !regEmail.trim() || !regPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({
        full_name: fullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      setSuccess("Account created! Switching to Sign In...");
      setTimeout(() => handleSwitchMode("login"), 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Pick the GPU transform/keyframe class for the diagonal charcoal blade
  const bladeClass =
    sweepDir === "to-left"
      ? "blade-sweep-left"
      : sweepDir === "to-right"
        ? "blade-sweep-right"
        : mode === "login"
          ? "blade-rest-right"
          : "blade-rest-left";

  return (
    <main className="flex-1 bg-[#0D0A08] flex items-center justify-center px-4 py-10 md:py-14">
      <div className="relative w-full max-w-4xl min-h-[580px] rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#C8A97E]/40 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Mobile compact header */}
        <div className="md:hidden bg-charcoal text-ivory px-6 py-5 border-b border-gold/40">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
            Aura Fragrance World
          </p>
          <h2 className="font-serif text-2xl">
            {mode === "login" ? (
              <>
                Welcome <em className="text-gold">back.</em>
              </>
            ) : (
              <>
                Begin your <em className="text-gold">signature.</em>
              </>
            )}
          </h2>
        </div>

        {/* Two-column form layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
          {/* LEFT PANE: SIGN IN FORM */}
          <section
            aria-hidden={mode !== "login"}
            className={`p-8 md:py-11 md:pl-10 md:pr-14 flex flex-col justify-center transition-all duration-500 ease-out ${
              mode === "login"
                ? "block opacity-100 translate-y-0"
                : "hidden md:flex md:opacity-0 md:translate-y-2 md:pointer-events-none"
            }`}
          >
            <h1 className="font-serif text-3xl font-semibold text-charcoal mb-1">
              Sign in
            </h1>
            <div className="w-10 h-0.5 bg-gold mb-6" />

            {mode === "login" && error && (
              <div
                role="alert"
                className="animate-fade-in mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-bronze/40 py-2 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Enter your password"
                    className="w-full bg-transparent border-b border-bronze/40 py-2 pr-14 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-0 top-2 text-xs font-medium text-bronze hover:text-charcoal transition cursor-pointer"
                  >
                    {showLoginPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-charcoal text-cream border border-gold/40 py-3 rounded-full text-sm uppercase tracking-[0.15em] font-semibold hover:bg-gold hover:text-charcoal active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-sm text-ink">
              New to Aura Fragrance World?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("register")}
                className="font-semibold text-charcoal underline decoration-gold underline-offset-4 hover:text-bronze transition cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </section>

          {/* RIGHT PANE: CREATE ACCOUNT FORM */}
          <section
            aria-hidden={mode !== "register"}
            className={`p-8 md:py-11 md:pl-14 md:pr-10 flex flex-col justify-center transition-all duration-500 ease-out ${
              mode === "register"
                ? "block opacity-100 translate-y-0"
                : "hidden md:flex md:opacity-0 md:translate-y-2 md:pointer-events-none"
            }`}
          >
            <h1 className="font-serif text-3xl font-semibold text-charcoal mb-1">
              Create account
            </h1>
            <div className="w-10 h-0.5 bg-gold mb-6" />

            {mode === "register" && error && (
              <div
                role="alert"
                className="animate-fade-in mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {mode === "register" && success && (
              <div
                role="status"
                className="animate-fade-in mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-sm text-emerald-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Full Name
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Arif Rahman"
                  className="w-full bg-transparent border-b border-bronze/40 py-2 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-bronze/40 py-2 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Use 8 characters or more"
                    className="w-full bg-transparent border-b border-bronze/40 py-2 pr-14 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    aria-label={
                      showRegPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-0 top-2 text-xs font-medium text-bronze hover:text-charcoal transition cursor-pointer"
                  >
                    {showRegPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-confirm"
                  className="block text-xs uppercase tracking-[0.15em] text-bronze font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  type={showRegPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent border-b border-bronze/40 py-2 text-charcoal placeholder:text-ink/40 focus:outline-none focus:border-gold transition disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-charcoal text-cream border border-gold/40 py-3 rounded-full text-sm uppercase tracking-[0.15em] font-semibold hover:bg-gold hover:text-charcoal active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-ink">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("login")}
                className="font-semibold text-charcoal underline decoration-gold underline-offset-4 hover:text-bronze transition cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </section>
        </div>

        {/* GPU-ACCELERATED DIAGONAL CHARCOAL BLADE */}
        <div
          aria-hidden="true"
          className={`hidden md:block absolute -top-[8%] -bottom-[8%] -left-[6%] w-[112%] z-10 bg-charcoal border-x-2 border-gold/65 shadow-[0_0_50px_rgba(28,25,23,0.45)] will-change-transform ${bladeClass}`}
        />

        {/* CENTERED EDITORIAL TEXT — RIGHT HALF (Login Mode) */}
        <div
          aria-hidden="true"
          className={`hidden md:flex pointer-events-none absolute inset-y-0 right-0 w-[45%] z-20 items-center justify-center px-10 transition-opacity duration-300 ${
            mode === "login" && sweepDir === null ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-xs">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold mb-3">
              Aura Fragrance World
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ivory mb-4">
              Welcome <br />
              <em className="text-cream font-normal">back.</em>
            </h2>
            <p className="text-sm text-ivory/75 leading-relaxed">
              Your saved perfumes, profile details, and order history are right
              where you left them.
            </p>
          </div>
        </div>

        {/* CENTERED EDITORIAL TEXT — LEFT HALF (Register Mode) */}
        <div
          aria-hidden="true"
          className={`hidden md:flex pointer-events-none absolute inset-y-0 left-0 w-[45%] z-20 items-center justify-center px-10 transition-opacity duration-300 ${
            mode === "register" && sweepDir === null
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <div className="max-w-xs">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold mb-3">
              Aura Fragrance World
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ivory mb-4">
              Begin your <br />
              <em className="text-cream font-normal">signature.</em>
            </h2>
            <p className="text-sm text-ivory/75 leading-relaxed">
              Create your profile to order timeless oud, amber, and evening
              fragrances with ease.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}