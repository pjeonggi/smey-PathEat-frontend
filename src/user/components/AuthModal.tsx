// Login / Sign-up modal — auth gate for protected actions like writing reviews.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { useTheme } from "../../shared/hooks/useTheme";

/**
 * @param {{ onClose: ()=>void, prompt?: string }} props
 */
export function AuthModal({ onClose, prompt }) {
  const { tm } = useTheme();
  const { login, signup } = useAuth();

  const [tab, setTab] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") await login(email, password);
      else {
        if (!firstName.trim()) throw new Error("First name is required.");
        await signup({ firstName, lastName, email, password });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    background: tm.inputBg,
    border: `1px solid ${tm.inputBorder}`,
    color: tm.text1,
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[800] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          initial={{ scale: 0.93, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.93, y: 16 }}
          transition={{ duration: 0.2 }}
          style={{
            background: tm.dropdown,
            border: `1px solid ${tm.border}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold" style={{ color: tm.text1 }}>
                {tab === "login" ? "Welcome back" : "Create account"}
              </h2>
              {prompt && (
                <p className="text-xs mt-0.5" style={{ color: tm.text4 }}>
                  {prompt}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/10"
              style={{ background: tm.surface2 }}
            >
              <X size={13} style={{ color: tm.text3 }} />
            </button>
          </div>
          <div
            className="mx-6 mb-5 flex rounded-xl p-1"
            style={{ background: tm.surface1 }}
          >
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  tab === t
                    ? { background: tm.primary, color: tm.primaryText }
                    : { color: tm.text3 }
                }
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
            {tab === "signup" && (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <User
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: tm.text4 }}
                  />
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none"
                    style={inp}
                  />
                </div>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="flex-1 px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                  style={inp}
                />
              </div>
            )}
            <div className="relative">
              <Mail
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: tm.text4 }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  tab === "login" ? "sophea@patheat.app" : "your@email.com"
                }
                required
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none"
                style={inp}
              />
            </div>
            <div className="relative">
              <Lock
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: tm.text4 }}
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-8 pr-9 py-2.5 rounded-xl text-xs focus:outline-none"
                style={inp}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: tm.text4 }}
              >
                {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {tab === "login" && (
              <p className="text-[10px]" style={{ color: tm.text4 }}>
                Demo:{" "}
                <span className="font-medium" style={{ color: tm.primary }}>
                  sophea@patheat.app
                </span>{" "}
                / any password
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{ background: tm.primary, color: tm.primaryText }}
            >
              {loading
                ? "Please wait…"
                : tab === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
