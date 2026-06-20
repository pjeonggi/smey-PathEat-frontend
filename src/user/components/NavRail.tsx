// Left icon rail — matches the design spec: white-card active state on deep-green rail.

import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Clock,
  BookMarked,
  MapPin,
  User,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";

function RouteIcon({ size = 20, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      style={style}
    >
      <path d="M4 15V8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5V15.5C13 16.8807 14.1193 18 15.5 18C16.8807 18 18 16.8807 18 15.5V8.82929C16.8348 8.41746 16 7.30622 16 6C16 4.34315 17.3431 3 19 3C20.6569 3 22 4.34315 22 6C22 7.30622 21.1652 8.41746 20 8.82929V15.5C20 17.9853 17.9853 20 15.5 20C13.0147 20 11 17.9853 11 15.5V8.5C11 7.11929 9.88071 6 8.5 6C7.11929 6 6 7.11929 6 8.5V15H9L5 20L1 15H4ZM19 7C19.5523 7 20 6.55228 20 6C20 5.44772 19.5523 5 19 5C18.4477 5 18 5.44772 18 6C18 6.55228 18.4477 7 19 7Z" />
    </svg>
  );
}

// Order matches the design: Go → Saved → Routes → History
const TABS = [
  { id: "route", Icon: RouteIcon, label: "Go" },
  { id: "favorite", Icon: Heart, label: "Saved" },
  { id: "savedRoutes", Icon: BookMarked, label: "Routes" },
  { id: "trips", Icon: Clock, label: "History" },
];

export function NavRail({
  activeTab,
  onTabChange,
  showSettings,
  onSettingsToggle,
  onProfileOpen,
  onHomeReset,
}) {
  const { darkMode, setDarkMode, tm } = useTheme();
  const { user, logout } = useAuth();

  // Rail is always deep green regardless of theme
  const railBg = "#004b1e";
  const inactive = "rgba(255,255,255,0.75)";

  return (
    <nav
      className="flex flex-col items-center pt-4 pb-4 gap-1 shrink-0 h-full relative"
      style={{ width: 68, background: railBg }}
    >
      {/* Logo */}
      <button
        onClick={onHomeReset}
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shrink-0 transition-all hover:brightness-110 active:scale-95"
        style={{ background: "#22c55e" }}
      >
        <MapPin size={18} className="text-white" />
      </button>

      {TABS.map(({ id, Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center justify-center gap-1 w-[56px] py-2.5 rounded-xl transition-all"
            style={
              active
                ? { background: "rgba(34,197,94,0.18)", color: "#22c55e" }
                : { background: "transparent", color: inactive }
            }
          >
            <Icon size={20} style={{ color: active ? "#22c55e" : inactive }} />
            <span
              className="text-[9px] font-semibold tracking-wide"
              style={{ color: active ? "#22c55e" : inactive }}
            >
              {label}
            </span>
          </button>
        );
      })}

      <div className="flex-1" />

      {/* User / settings */}
      <button
        onClick={onSettingsToggle}
        className="flex flex-col items-center justify-center gap-1 w-[56px] py-2.5 rounded-xl transition-all"
        style={
          showSettings
            ? { background: "rgba(34,197,94,0.18)", color: "#22c55e" }
            : { background: "transparent", color: inactive }
        }
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: showSettings ? "#22c55e" : "rgba(255,255,255,0.15)",
          }}
        >
          <User size={14} style={{ color: "#ffffff" }} />
        </div>
        <span
          className="text-[9px] font-semibold tracking-wide"
          style={{ color: showSettings ? "#004b1e" : inactive }}
        >
          You
        </span>
      </button>

      {showSettings && (
        <div className="fixed inset-0 z-[599]" onClick={onSettingsToggle} />
      )}

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-16 left-[76px] z-[600] rounded-2xl overflow-hidden"
            style={{
              width: 220,
              background: darkMode ? "#111828" : "#fffdf7",
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
              border: `1px solid ${tm.border}`,
            }}
          >
            <div
              className="px-4 py-3.5 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${tm.border}` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#22c55e" }}
              >
                <User size={16} className="text-white" />
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: tm.text1 }}
                >
                  {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                </div>
                <div className="text-[10px]" style={{ color: tm.text4 }}>
                  Phnom Penh
                </div>
              </div>
            </div>

            <div className="py-1.5">
              <button
                onClick={() => {
                  onSettingsToggle();
                  onProfileOpen();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-black/5"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: tm.surface2 }}
                >
                  <User size={13} style={{ color: tm.text3 }} />
                </div>
                <div className="flex-1 text-left">
                  <div
                    className="text-xs font-medium"
                    style={{ color: tm.text1 }}
                  >
                    View Profile
                  </div>
                  <div className="text-[10px]" style={{ color: tm.text4 }}>
                    Edit your info
                  </div>
                </div>
                <ChevronRight size={12} style={{ color: tm.text5 }} />
              </button>

              <div className="flex items-center gap-3 px-4 py-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: tm.surface2 }}
                >
                  {darkMode ? (
                    <Moon size={13} style={{ color: tm.text3 }} />
                  ) : (
                    <Sun size={13} style={{ color: tm.text3 }} />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className="text-xs font-medium"
                    style={{ color: tm.text1 }}
                  >
                    Theme
                  </div>
                  <div className="text-[10px]" style={{ color: tm.text4 }}>
                    {darkMode ? "Dark" : "Light"}
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode((d) => !d)}
                  className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                  style={{ background: darkMode ? "#22c55e" : tm.surface3 }}
                >
                  <div
                    className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                    style={{ left: darkMode ? "22px" : "2px" }}
                  />
                </button>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${tm.border}` }}>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={13} className="text-red-400" />
                <span className="text-xs font-medium text-red-400">
                  Sign out
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
