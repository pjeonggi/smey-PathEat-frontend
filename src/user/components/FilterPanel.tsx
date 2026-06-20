// Filter sidebar — search, cuisine chips, price tier, open-now toggle.
// Vendor cards moved to the horizontal map strip; this panel only handles filters.

import { Filter, Search, ArrowLeft, X } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { CUISINES, PRICE_LABELS } from "../../shared/constants/appConfig";

/**
 * @param {{ originText:string, destText:string, vendorCount:number,
 *           filterCuisine:string, setFilterCuisine:(c:string)=>void,
 *           filterMaxPrice:number, setFilterMaxPrice:(p:number)=>void,
 *           filterOpenNow:boolean, setFilterOpenNow:(v:boolean)=>void,
 *           vendorSearch:string, setVendorSearch:(v:string)=>void,
 *           onBack:()=>void, onResetFilters:()=>void, activeFilterCount:number }} props
 */
export function FilterPanel({
  originText,
  destText,
  vendorCount,
  filterCuisine,
  setFilterCuisine,
  filterMaxPrice,
  setFilterMaxPrice,
  filterOpenNow,
  setFilterOpenNow,
  vendorSearch,
  setVendorSearch,
  onBack,
  onResetFilters,
  activeFilterCount,
}) {
  const { darkMode, tm } = useTheme();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Route summary header */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${tm.border}` }}
      >
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
          style={{ background: tm.surface2 }}
        >
          <ArrowLeft size={13} style={{ color: tm.text3 }} />
        </button>
        <div className="flex-1 min-w-0">
          <div
            className="text-[11px] font-semibold truncate"
            style={{ color: tm.text1 }}
          >
            {originText} → {destText}
          </div>
          <div className="text-[10px]" style={{ color: tm.text4 }}>
            {vendorCount} vendors found · scroll map strip below
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="shrink-0 px-4 py-3 space-y-3 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: tm.text3 }}
          >
            <Filter size={13} /> Filters
            {activeFilterCount > 0 && (
              <span
                className="text-[11px] font-bold px-1.5 py-px rounded-full"
                style={{ background: tm.primary, color: tm.primaryText }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onResetFilters}
            className="text-[11px] hover:opacity-70"
            style={{ color: tm.text4 }}
          >
            Reset
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: tm.text4 }}
          />
          <input
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            placeholder="Search vendors or menu…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] focus:outline-none"
            style={{
              background: tm.inputBg,
              border: `1px solid ${vendorSearch ? tm.inputFocus : tm.inputBorder}`,
              color: tm.text1,
            }}
          />
          {vendorSearch && (
            <button
              onClick={() => setVendorSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: tm.text4 }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Cuisine chips */}
        <div>
          <p
            className="text-[10px] uppercase tracking-wider mb-1.5"
            style={{ color: tm.text4 }}
          >
            Cuisine
          </p>
          <div className="flex flex-wrap gap-1">
            {["All", ...CUISINES].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCuisine(c)}
                className="px-2 py-0.5 rounded-full text-[12px] font-medium transition-colors"
                style={
                  filterCuisine === c
                    ? { background: tm.primary, color: tm.primaryText }
                    : { background: tm.filterChip, color: tm.filterChipText }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p
            className="text-[10px] uppercase tracking-wider mb-1.5"
            style={{ color: tm.text4 }}
          >
            Max Price
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setFilterMaxPrice(p)}
                className="px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors"
                style={
                  filterMaxPrice === p
                    ? { background: tm.primary, color: tm.primaryText }
                    : p < filterMaxPrice
                      ? {
                          background: darkMode
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(34,197,94,0.12)",
                          color: tm.primary,
                        }
                      : { background: tm.filterChip, color: tm.filterChipText }
                }
              >
                {PRICE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Open now */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: tm.text2 }}>
            Open now
          </span>
          <button
            onClick={() => setFilterOpenNow(!filterOpenNow)}
            className="w-10 h-5 rounded-full relative transition-colors shrink-0"
            style={{ background: filterOpenNow ? "#10b981" : tm.surface3 }}
          >
            <div
              className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
              style={{ left: filterOpenNow ? "22px" : "2px" }}
            />
          </button>
        </div>

        {vendorCount === 0 && (
          <p className="text-xs text-center py-4" style={{ color: tm.text4 }}>
            No vendors match these filters.
          </p>
        )}
      </div>
    </div>
  );
}
