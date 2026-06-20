// Saved routes panel — load or delete previously bookmarked routes.

import { Navigation2, Clock, BookMarked, X } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

/**
 * @param {{ savedRoutes: object[], onLoadRoute: (r:object)=>void,
 *           onDeleteRoute: (id:number)=>void, onClearAll: ()=>void }} props
 */
export function HistoryPanel({
  savedRoutes,
  onLoadRoute,
  onDeleteRoute,
  onClearAll,
}) {
  const { tm } = useTheme();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="shrink-0 px-4 pt-5 pb-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${tm.border}` }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BookMarked size={14} style={{ color: tm.primary }} />
            <span className="text-sm font-bold" style={{ color: tm.text1 }}>
              Saved Routes
            </span>
          </div>
          <p className="text-[11px]" style={{ color: tm.text4 }}>
            {savedRoutes.length} route{savedRoutes.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>
        {savedRoutes.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] px-2.5 py-1 rounded-lg transition-colors hover:bg-red-500/10"
            style={{ color: tm.text4 }}
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
        {savedRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 px-4">
            <BookMarked size={30} style={{ color: tm.text5 }} />
            <p className="text-xs text-center" style={{ color: tm.text4 }}>
              No saved routes yet.
              <br />
              Tap the bookmark icon while editing a route.
            </p>
          </div>
        ) : (
          <div className="py-2">
            {savedRoutes.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(99,102,241,0.15)" }}
                >
                  <Navigation2 size={15} style={{ color: "#818cf8" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[12px] font-semibold truncate"
                    style={{ color: tm.text1 }}
                  >
                    {r.label || `${r.origin} → ${r.dest}`}
                  </div>
                  <div
                    className="text-[10px] mt-0.5 truncate"
                    style={{ color: tm.text4 }}
                  >
                    {r.origin} → {r.dest}
                  </div>
                  <div
                    className="text-[10px] mt-0.5 flex items-center gap-1"
                    style={{ color: tm.text5 }}
                  >
                    <Clock size={9} /> {r.savedAt}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => onLoadRoute(r)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ background: tm.surface2 }}
                    title="Load route"
                  >
                    <Navigation2 size={11} style={{ color: tm.primary }} />
                  </button>
                  <button
                    onClick={() => onDeleteRoute(r.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/20"
                    style={{ background: tm.surface2 }}
                  >
                    <X size={11} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
