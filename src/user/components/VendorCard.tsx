// Compact vendor card — used in the filter sidebar results list.

import { Star, Timer, MapPin, Heart } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { PRICE_LABELS } from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";

/**
 * @param {{ vendor: object, rank: number, isFavorite: boolean,
 *           onSelect: ()=>void, onToggleFavorite: (e:Event)=>void }} props
 */
export function VendorCard({
  vendor,
  rank,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) {
  const { tm } = useTheme();
  const color = scoreColor(vendor.final_score);

  return (
    <div
      onClick={onSelect}
      className="w-full flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white mt-0.5"
        style={{ background: color }}
      >
        {rank}
      </div>
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
        <img
          src={vendor.photo_url}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div
            className="text-sm font-semibold truncate"
            style={{ color: tm.text1 }}
          >
            {vendor.name}
          </div>
          <button
            onClick={onToggleFavorite}
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-red-500/20"
          >
            <Heart
              size={12}
              className={isFavorite ? "fill-red-400 text-red-400" : ""}
              style={isFavorite ? {} : { color: tm.text4 }}
            />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-[10px]" style={{ color: tm.text4 }}>
            {vendor.cuisine}
          </span>
          <span style={{ color: tm.text5 }}>·</span>
          <span className="text-[10px] text-amber-400">
            {PRICE_LABELS[vendor.price_range]}
          </span>
          <span style={{ color: tm.text5 }}>·</span>
          <Star size={9} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px]" style={{ color: tm.text3 }}>
            {vendor.rating}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div
            className="flex items-center gap-1 text-[10px]"
            style={{ color: tm.text4 }}
          >
            <MapPin size={9} /> {vendor.dist_m} m
          </div>
          <div
            className="flex items-center gap-1 text-[10px]"
            style={{ color: tm.text4 }}
          >
            <Timer size={9} /> ~{vendor.wait_time_est} min
          </div>
          <span
            className="text-[10px]"
            style={{ color: vendor.open_now ? "#10b981" : "#f87171" }}
          >
            {vendor.open_now ? "● Open" : "● Closed"}
          </span>
        </div>
      </div>
    </div>
  );
}
