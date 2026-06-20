// Saved vendors panel — shows hearted vendors and lets the user open their detail.

import { Heart, Star } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { ALL_VENDORS, PRICE_LABELS } from "../../shared/constants/appConfig";

/**
 * @param {{ favorites: Set<number>, onSelectVendor: (v:object)=>void, onToggleFavorite: (id:number)=>void }} props
 */
export function FavoritesPanel({
  favorites,
  onSelectVendor,
  onToggleFavorite,
}) {
  const { tm } = useTheme();
  const saved = ALL_VENDORS.filter((v) => favorites.has(v.id));

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="px-4 pt-5 pb-3 shrink-0"
        style={{ borderBottom: `1px solid ${tm.border}` }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span className="text-sm font-bold" style={{ color: tm.text1 }}>
            Saved Places
          </span>
        </div>
        <p className="text-[11px]" style={{ color: tm.text4 }}>
          {saved.length} vendor{saved.length !== 1 ? "s" : ""} saved
        </p>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 px-4">
            <Heart size={28} style={{ color: tm.text5 }} />
            <p className="text-xs text-center" style={{ color: tm.text4 }}>
              No saved vendors yet.
              <br />
              Tap the heart icon on any vendor.
            </p>
          </div>
        ) : (
          <div className="py-2">
            {saved.map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectVendor(v)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={v.photo_url}
                    alt={v.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: tm.text1 }}
                  >
                    {v.name}
                  </div>
                  <div
                    className="text-[11px] flex items-center gap-1.5 mt-0.5"
                    style={{ color: tm.text4 }}
                  >
                    <span>{v.cuisine}</span>
                    <span>·</span>
                    <span className="text-amber-400">
                      {PRICE_LABELS[v.price_range]}
                    </span>
                    <span>·</span>
                    <Star size={9} className="fill-amber-400 text-amber-400" />
                    <span>{v.rating}</span>
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: v.open_now ? "#10b981" : tm.text5 }}
                  >
                    {v.open_now ? "● Open now" : "● Closed"}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(v.id);
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-red-500/20"
                >
                  <Heart size={14} className="fill-red-400 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
