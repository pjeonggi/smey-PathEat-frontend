// Full vendor detail panel — hero, stats, menu accordion, score card, reviews.
// Review and menu concerns delegated to sub-components to stay under 200 lines.

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Timer,
  Wallet,
  Clock,
  MapPin,
  Heart,
} from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { PRICE_LABELS } from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";
import { VendorMenuAccordion } from "./VendorMenuAccordion";
import { VendorReviews } from "./VendorReviews";
import { AuthModal } from "./AuthModal";

/**
 * @param {{ vendor: object, onClose: ()=>void, isFavorite: boolean, onToggleFavorite: ()=>void }} props
 */
export function VendorDetail({
  vendor,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const { darkMode, tm } = useTheme();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const c = {
    bg: darkMode ? "#0F172A" : "#F8F9FF",
    text: darkMode ? "rgba(255,255,255,0.88)" : "#0F172A",
    textMid: darkMode ? "rgba(255,255,255,0.6)" : "#3F465C",
    textFaint: darkMode ? "rgba(255,255,255,0.35)" : "#5C647A",
    textDim: darkMode ? "rgba(255,255,255,0.2)" : "#BEC6E0",
    surface: darkMode ? "rgba(255,255,255,0.05)" : "#FFFFFF",
    scoreCard: darkMode ? "rgba(255,255,255,0.04)" : "#F0FDF4",
    scoreCardBorder: darkMode ? "rgba(255,255,255,0.07)" : "#D1D5DB",
    scoreBarBg: darkMode ? "rgba(255,255,255,0.08)" : "#D1D5DB",
    rowBorder: darkMode ? "rgba(255,255,255,0.05)" : "#D1D5DB",
    backBtn: darkMode ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
  };

  return (
    <>
      <div
        className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10"
        style={{ background: c.bg }}
      >
        {/* Hero */}
        <div className="relative h-56 shrink-0">
          <img
            src={vendor.photo_url}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${c.bg} 0%, rgba(0,0,0,0.35) 60%, transparent 100%)`,
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: c.backBtn, backdropFilter: "blur(8px)" }}
          >
            <ArrowLeft size={17} className="text-white" />
          </button>
          <button
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: c.backBtn, backdropFilter: "blur(8px)" }}
          >
            <Heart
              size={17}
              className={
                isFavorite ? "fill-red-400 text-red-400" : "text-white"
              }
            />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {vendor.cuisine}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${vendor.open_now ? "bg-emerald-500/25 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
              >
                {vendor.open_now ? "● Open" : "● Closed"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">
              {vendor.name}
            </h2>
          </div>
        </div>

        <div className="px-4 py-4 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                icon: (
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                ),
                val: vendor.rating.toFixed(1),
                label: "Rating",
              },
              {
                icon: <Timer size={14} className="text-blue-400" />,
                val: `~${vendor.wait_time_est}m`,
                label: "Wait",
              },
              {
                icon: <Wallet size={14} className="text-emerald-400" />,
                val: PRICE_LABELS[vendor.price_range],
                label: "Price",
              },
            ].map(({ icon, val, label }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: c.surface }}
              >
                <div className="flex justify-center mb-1">{icon}</div>
                <div className="font-bold text-base" style={{ color: c.text }}>
                  {val}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: c.textDim }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: c.textMid }}>
            {vendor.description}
          </p>

          <div className="space-y-2">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: c.textFaint }}
            >
              <Clock
                size={12}
                style={{ color: c.textDim }}
                className="shrink-0"
              />{" "}
              {vendor.hours}
            </div>
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: c.textFaint }}
            >
              <MapPin
                size={12}
                style={{ color: c.textDim }}
                className="shrink-0"
              />{" "}
              {vendor.address}
            </div>
          </div>

          <VendorMenuAccordion menu={vendor.menu} colors={c} />

          {vendor.final_score !== undefined && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: c.scoreCard,
                border: `1px solid ${c.scoreCardBorder}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: c.textFaint }}
                >
                  PathEat Value Score
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: scoreColor(vendor.final_score) }}
                >
                  {Math.round((vendor.final_score / 0.85) * 100)}
                  <span style={{ color: c.textDim, fontWeight: 400 }}>
                    /100
                  </span>
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: c.scoreBarBg }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(vendor.final_score / 0.85) * 100}%`,
                    background: scoreColor(vendor.final_score),
                  }}
                />
              </div>
              <div
                className="grid grid-cols-4 gap-1 text-[9px] text-center"
                style={{ color: c.textDim }}
              >
                <span>Afford 35%</span>
                <span>Proximity 30%</span>
                <span>Rating 20%</span>
                <span>Wait −15%</span>
              </div>
            </div>
          )}

          <VendorReviews
            vendor={vendor}
            colors={c}
            onSignInRequest={() => setShowAuth(true)}
          />
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          prompt="Sign in to leave a review."
        />
      )}
    </>
  );
}
