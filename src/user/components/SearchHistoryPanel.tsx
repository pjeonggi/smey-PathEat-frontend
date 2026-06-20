// Search history panel — every route the user has searched, newest first.
// Clicking an entry re-runs that search immediately.

import { Clock, Trash2, Navigation2 } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

/**
 * @param {{ history: {id:number, origin:string, dest:string, searchedAt:string}[],
 *           onReplay: (entry:object)=>void,
 *           onDelete: (id:number)=>void,
 *           onClearAll: ()=>void }} props
 */
export function SearchHistoryPanel({
  history,
  onReplay,
  onDelete,
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
            <Clock size={14} style={{ color: tm.primary }} />
            <span className="text-sm font-bold" style={{ color: tm.text1 }}>
              Search History
            </span>
          </div>
          <p className="text-[11px]" style={{ color: tm.text4 }}>
            {history.length} search{history.length !== 1 ? "es" : ""} recorded
          </p>
        </div>
        {history.length > 0 && (
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
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 px-4">
            <Clock size={30} style={{ color: tm.text5 }} />
            <p className="text-xs text-center" style={{ color: tm.text4 }}>
              No searches yet.
              <br />
              Enter a route and tap Find Route to start.
            </p>
          </div>
        ) : (
          <div className="py-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5 group"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(34,197,94,0.1)" }}
                >
                  <Navigation2 size={14} style={{ color: tm.primary }} />
                </div>
                <button
                  onClick={() => onReplay(entry)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div
                    className="text-[12px] font-semibold truncate"
                    style={{ color: tm.text1 }}
                  >
                    {entry.origin}
                  </div>
                  <div
                    className="text-[11px] truncate mt-0.5"
                    style={{ color: tm.text3 }}
                  >
                    → {entry.dest}
                  </div>
                  <div
                    className="text-[10px] flex items-center gap-1 mt-1"
                    style={{ color: tm.text5 }}
                  >
                    <Clock size={9} /> {entry.searchedAt}
                  </div>
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 shrink-0 mt-0.5"
                >
                  <Trash2 size={11} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
