// Route input panel — origin/dest autocomplete, range slider, recent saved routes.

import { Search, Navigation2, Clock, ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import {
  PLACES,
  VENDOR_RANGE_MIN,
  VENDOR_RANGE_MAX,
} from "../../shared/constants/appConfig";

/**
 * @param {{ originText:string, setOriginText:(v:string)=>void,
 *           destText:string, setDestText:(v:string)=>void,
 *           originPlace:object, setOriginPlace:(p:object)=>void,
 *           destPlace:object, setDestPlace:(p:object)=>void,
 *           originFocus:boolean, setOriginFocus:(v:boolean)=>void,
 *           destFocus:boolean, setDestFocus:(v:boolean)=>void,
 *           vendorRange:number, setVendorRange:(v:number)=>void,
 *           savedRoutes:object[], loadingRoute?:boolean,
 *           onLoadRoute:(r:object)=>void,
 *           onViewMoreHistory:()=>void, onFindRoute:()=>void }} props
 */
export function RouteInputPanel({
  originText,
  setOriginText,
  destText,
  setDestText,
  originPlace,
  setOriginPlace,
  destPlace,
  setDestPlace,
  originFocus,
  setOriginFocus,
  destFocus,
  setDestFocus,
  vendorRange,
  setVendorRange,
  savedRoutes,
  loadingRoute,
  onLoadRoute,
  onViewMoreHistory,
  onFindRoute,
}) {
  const { tm } = useTheme();
  const filteredOrigin = PLACES.filter((p) =>
    p.name.toLowerCase().includes(originText.toLowerCase()),
  );
  const filteredDest = PLACES.filter((p) =>
    p.name.toLowerCase().includes(destText.toLowerCase()),
  );
  const recentRoutes = savedRoutes.slice(0, 5);

  const inp = {
    background: tm.inputBg,
    border: `1px solid ${tm.inputBorder}`,
    color: tm.text1,
  };
  const drop = {
    background: tm.dropdown,
    border: `1px solid ${tm.dropdownBorder}`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  };

  return (
    <div className="shrink-0 px-4 py-4 space-y-3">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: tm.primary }}
        >
          <Navigation2 size={13} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold" style={{ color: tm.text1 }}>
            PathEat
          </h1>
          <p className="text-[10px]" style={{ color: tm.text4 }}>
            Route-aware food discovery
          </p>
        </div>
      </div>

      {/* Origin */}
      <div className="relative">
        <div className="w-2 h-2 rounded-full absolute left-3 top-1/2 -translate-y-1/2 shrink-0 bg-emerald-400" />
        <input
          value={originText}
          onChange={(e) => setOriginText(e.target.value)}
          onFocus={() => setOriginFocus(true)}
          onBlur={() => setTimeout(() => setOriginFocus(false), 150)}
          placeholder="From — start point"
          className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={inp}
        />
        {originFocus && originText && filteredOrigin.length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl overflow-hidden max-h-44 overflow-y-auto"
            style={drop}
          >
            {filteredOrigin.map((p) => (
              <button
                key={p.name}
                onMouseDown={() => {
                  setOriginPlace(p);
                  setOriginText(p.name);
                  setOriginFocus(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/10 text-left"
              >
                <Search size={10} style={{ color: tm.text4 }} />
                <span className="text-xs truncate" style={{ color: tm.text2 }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Destination */}
      <div className="relative">
        <div className="w-2 h-2 rounded-full absolute left-3 top-1/2 -translate-y-1/2 shrink-0 bg-red-400" />
        <input
          value={destText}
          onChange={(e) => setDestText(e.target.value)}
          onFocus={() => setDestFocus(true)}
          onBlur={() => setTimeout(() => setDestFocus(false), 150)}
          placeholder="To — destination"
          className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={inp}
        />
        {destFocus && destText && filteredDest.length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl overflow-hidden max-h-44 overflow-y-auto"
            style={drop}
          >
            {filteredDest.map((p) => (
              <button
                key={p.name}
                onMouseDown={() => {
                  setDestPlace(p);
                  setDestText(p.name);
                  setDestFocus(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/10 text-left"
              >
                <Search size={10} style={{ color: tm.text4 }} />
                <span className="text-xs truncate" style={{ color: tm.text2 }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        disabled={!originText.trim() || !destText.trim() || loadingRoute}
        onClick={onFindRoute}
        className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: tm.primary, color: tm.primaryText }}
      >
        {loadingRoute ? <Loader2 size={14} className="animate-spin" /> : <Navigation2 size={14} />}
        {loadingRoute ? "Routing..." : "Find Route"}
      </button>

      {/* Range slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: tm.text4 }}
          >
            Vendor Range
          </span>
          <span className="text-[11px] font-bold" style={{ color: tm.primary }}>
            {vendorRange} m
          </span>
        </div>
        <input
          type="range"
          min={VENDOR_RANGE_MIN}
          max={VENDOR_RANGE_MAX}
          step={50}
          value={vendorRange}
          onChange={(e) => setVendorRange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: tm.primary }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px]" style={{ color: tm.text5 }}>
            {VENDOR_RANGE_MIN} m
          </span>
          <span className="text-[9px]" style={{ color: tm.text5 }}>
            {VENDOR_RANGE_MAX} m
          </span>
        </div>
      </div>

      {/* Recent routes from history */}
      {recentRoutes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: tm.text4 }}
            >
              Recent
            </span>
            <button
              onClick={onViewMoreHistory}
              className="flex items-center gap-0.5 text-[10px] font-medium hover:opacity-70"
              style={{ color: tm.primary }}
            >
              View more <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {recentRoutes.map((r) => (
              <button
                key={r.id}
                onClick={() => onLoadRoute(r)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all hover:brightness-105"
                style={{ background: tm.surface1 }}
              >
                <Clock size={11} style={{ color: tm.text4 }} />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[11px] truncate font-medium"
                    style={{ color: tm.text2 }}
                  >
                    {r.origin} → {r.dest}
                  </div>
                  <div className="text-[9px]" style={{ color: tm.text5 }}>
                    {r.savedAt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
