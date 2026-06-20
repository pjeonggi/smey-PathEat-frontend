// Main consumer page — composes sidebar panels with the MapLibre map.
// Map lifecycle delegated to useMaplibreMap; vendor scoring to useVendors.

// MapLibre GL styles
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, Eye, BookmarkPlus, HelpCircle, X, Loader2 } from "lucide-react";

import { useTheme } from "../../shared/hooks/useTheme";
import { PLACES, VENDOR_RANGE_DEFAULT } from "../../shared/constants/appConfig";
import { getRoute } from "../../shared/services/routeService";
import { useVendors } from "../hooks/useVendors";
import { useMaplibreMap } from "../hooks/useMaplibreMap";

import { NavRail } from "../components/NavRail";
import { RouteInputPanel } from "../components/RouteInputPanel";
import { FilterPanel } from "../components/FilterPanel";
import { FavoritesPanel } from "../components/FavoritesPanel";
import { HistoryPanel } from "../components/HistoryPanel";
import { SearchHistoryPanel } from "../components/SearchHistoryPanel";
import { VendorDetail } from "../components/VendorDetail";
import { UserProfileModal } from "../components/UserProfileModal";
import { AuthModal } from "../components/AuthModal";

export default function UserSearchPage() {
  const { darkMode, tm } = useTheme();

  // ── Navigation ────────────────────────────────────────────────────────────
  const [page, setPage] = useState("home");
  const [leftNavTab, setLeftNavTab] = useState("route");
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── Route ─────────────────────────────────────────────────────────────────
  const [originText, setOriginText] = useState("");
  const [destText, setDestText] = useState("");
  const [originPlace, setOriginPlace] = useState(PLACES[0]);
  const [destPlace, setDestPlace] = useState(PLACES[1]);
  const [routePoints, setRoutePoints] = useState([]);
  const [routeReady, setRouteReady] = useState(false);
  const [editRouteMode, setEditRouteMode] = useState(false);
  const [waypointMode, setWaypointMode] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [originFocus, setOriginFocus] = useState(false);
  const [destFocus, setDestFocus] = useState(false);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterMaxPrice, setFilterMaxPrice] = useState(4);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorRange, setVendorRange] = useState(VENDOR_RANGE_DEFAULT);

  // ── User data ─────────────────────────────────────────────────────────────
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const scoredVendors = useVendors({
    routePoints,
    vendorRange,
    filterCuisine,
    filterMaxPrice,
    filterOpenNow,
    vendorSearch,
  });
  const activeFilterCount =
    (filterCuisine !== "All" ? 1 : 0) +
    (filterMaxPrice < 4 ? 1 : 0) +
    (filterOpenNow ? 1 : 0);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handleFindRoute() {
    setLoadingRoute(true);
    try {
      const pts = await getRoute(originPlace, destPlace);
      setRoutePoints(pts);
      setRouteReady(true);
      setSelectedVendor(null);
      setPage("filter");
      // Record every search so the History tab and recent strip stay current
      if (originText.trim() && destText.trim()) {
        const searchedAt = new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const entry = {
          id: Date.now(),
          origin: originText.trim(),
          dest: destText.trim(),
          originPlace,
          destPlace,
          searchedAt,
        };
        setSearchHistory((prev) =>
          [
            entry,
            ...prev.filter(
              (s) => !(s.origin === entry.origin && s.dest === entry.dest),
            ),
          ].slice(0, 50),
        );
      }
    } catch (err) {
      console.error("OSRM routing failed:", err);
    } finally {
      setLoadingRoute(false);
    }
  }

  function handleBack() {
    setPage("home");
    setRouteReady(false);
    setEditRouteMode(false);
    setWaypointMode(false);
    setSelectedVendor(null);
  }

  function handleSaveRoute() {
    const label =
      originText && destText ? `${originText} → ${destText}` : "Custom Route";
    const savedAt = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setSavedRoutes((prev) =>
      [
        {
          id: Date.now(),
          label,
          origin: originText,
          dest: destText,
          points: routePoints,
          savedAt,
        },
        ...prev,
      ].slice(0, 20),
    );
  }

  function handleLoadRoute(r) {
    setOriginText(r.origin);
    setDestText(r.dest);
    setRoutePoints(r.points);
    setRouteReady(true);
    setPage("filter");
    setLeftNavTab("route");
  }

  const handleWaypointAdded = useCallback((lat, lng) => {
    setRoutePoints((prev) => {
      let bestIdx = 1,
        bestDist = Infinity;
      for (let i = 0; i < prev.length - 1; i++) {
        const d = Math.sqrt(
          (lat - (prev[i][0] + prev[i + 1][0]) / 2) ** 2 +
            (lng - (prev[i][1] + prev[i + 1][1]) / 2) ** 2,
        );
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i + 1;
        }
      }
      const n = [...prev];
      n.splice(bestIdx, 0, [lat, lng]);
      return n;
    });
  }, []);

  const { mapDivRef } = useMaplibreMap({
    darkMode,
    routePoints,
    routeReady,
    editRouteMode,
    scoredVendors,
    selectedVendorId: selectedVendor?.id ?? null,
    onSelectVendor: setSelectedVendor,
    onWaypointAdded: handleWaypointAdded,
  });

  const stripVisible = routeReady && !editRouteMode && scoredVendors.length > 0;

  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{ background: tm.appBg }}
    >
      <NavRail
        activeTab={leftNavTab}
        onTabChange={setLeftNavTab}
        showSettings={showSettings}
        onSettingsToggle={() => setShowSettings((v) => !v)}
        onProfileOpen={() => setShowProfile(true)}
        onHomeReset={() => {
          setPage("home");
          setRouteReady(false);
          setEditRouteMode(false);
          setWaypointMode(false);
          setSelectedVendor(null);
        }}
      />

      <aside
        className="flex flex-col h-full overflow-hidden shrink-0"
        style={{
          width: "25vw",
          minWidth: 260,
          borderRight: `1px solid ${tm.border}`,
          background: tm.sidebar,
        }}
      >
        <AnimatePresence mode="wait">
          {leftNavTab === "favorite" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <FavoritesPanel
                favorites={favorites}
                onSelectVendor={setSelectedVendor}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          )}
          {leftNavTab === "trips" && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <SearchHistoryPanel
                history={searchHistory}
                onReplay={(e) => {
                  setOriginText(e.origin);
                  setDestText(e.dest);
                  setOriginPlace(e.originPlace);
                  setDestPlace(e.destPlace);
                  setLeftNavTab("route");
                  setPage("home");
                }}
                onDelete={(id) =>
                  setSearchHistory((prev) => prev.filter((h) => h.id !== id))
                }
                onClearAll={() => setSearchHistory([])}
              />
            </motion.div>
          )}
          {leftNavTab === "savedRoutes" && (
            <motion.div
              key="savedRoutes"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <HistoryPanel
                savedRoutes={savedRoutes}
                onLoadRoute={handleLoadRoute}
                onDeleteRoute={(id) =>
                  setSavedRoutes((prev) => prev.filter((r) => r.id !== id))
                }
                onClearAll={() => setSavedRoutes([])}
              />
            </motion.div>
          )}
          {leftNavTab === "route" && page === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-y-auto"
            >
              <RouteInputPanel
                originText={originText}
                setOriginText={setOriginText}
                destText={destText}
                setDestText={setDestText}
                originPlace={originPlace}
                setOriginPlace={setOriginPlace}
                destPlace={destPlace}
                setDestPlace={setDestPlace}
                originFocus={originFocus}
                setOriginFocus={setOriginFocus}
                destFocus={destFocus}
                setDestFocus={setDestFocus}
                vendorRange={vendorRange}
                setVendorRange={setVendorRange}
                savedRoutes={searchHistory}
                loadingRoute={loadingRoute}
                onLoadRoute={(e) => {
                  setOriginText(e.origin);
                  setDestText(e.dest);
                  setOriginPlace(e.originPlace);
                  setDestPlace(e.destPlace);
                  handleFindRoute();
                }}
                onViewMoreHistory={() => setLeftNavTab("trips")}
                onFindRoute={handleFindRoute}
              />
            </motion.div>
          )}
          {leftNavTab === "route" && page === "filter" && (
            <motion.div
              key="filter"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <FilterPanel
                originText={originText}
                destText={destText}
                vendorCount={scoredVendors.length}
                filterCuisine={filterCuisine}
                setFilterCuisine={setFilterCuisine}
                filterMaxPrice={filterMaxPrice}
                setFilterMaxPrice={setFilterMaxPrice}
                filterOpenNow={filterOpenNow}
                setFilterOpenNow={setFilterOpenNow}
                vendorSearch={vendorSearch}
                setVendorSearch={setVendorSearch}
                onBack={handleBack}
                onResetFilters={() => {
                  setFilterCuisine("All");
                  setFilterMaxPrice(4);
                  setFilterOpenNow(false);
                  setVendorSearch("");
                }}
                activeFilterCount={activeFilterCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div
          ref={mapDivRef}
          className="w-full transition-[height] duration-200"
          style={{ height: stripVisible ? "calc(100% - 116px)" : "100%" }}
        />

        {/* Edit mode banner */}
        {editRouteMode && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2.5 px-3 py-2 rounded-2xl"
            style={{
              background: "rgba(99,102,241,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            <PenLine size={13} className="text-white/70 shrink-0" />
            <span className="text-white text-[11px] font-medium">
              Click route to add waypoints
            </span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={handleSaveRoute}
              title="Save Route"
              className="flex items-center justify-center w-7 h-7 rounded-xl transition-all hover:bg-white/25 active:scale-95"
              style={{ color: "#ffffff" }}
            >
              <BookmarkPlus size={15} />
            </button>
            <button
              onClick={() => {
                setEditRouteMode(false);
                setWaypointMode(false);
              }}
              className="flex items-center justify-center w-7 h-7 rounded-xl transition-all hover:bg-white/20 active:scale-95"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Edit route toggle */}
        {routeReady && (
          <div className="absolute top-4 right-16 z-[400]">
            <button
              onClick={() => {
                const n = !editRouteMode;
                setEditRouteMode(n);
                setWaypointMode(n);
              }}
              className="flex items-center gap-2 px-3 h-9 rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={
                editRouteMode
                  ? {
                      background: "rgba(99,102,241,0.9)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.3)",
                    }
                  : {
                      background: tm.glassCard,
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${tm.border}`,
                    }
              }
            >
              {editRouteMode ? (
                <>
                  <Eye size={14} className="text-white shrink-0" />
                  <span className="text-[11px] font-semibold text-white">
                    Show Vendors
                  </span>
                </>
              ) : (
                <>
                  <PenLine
                    size={14}
                    style={{ color: tm.text2 }}
                    className="shrink-0"
                  />
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: tm.text2 }}
                  >
                    Edit Route
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tutorial toggle */}
        <button
          onClick={() => setShowAuthModal((v) => !v)}
          title="How it works"
          className="absolute top-4 right-4 z-[500] w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{
            background: tm.glassCard,
            backdropFilter: "blur(12px)",
            border: `1px solid ${tm.border}`,
          }}
        >
          <HelpCircle size={16} style={{ color: tm.text3 }} />
        </button>

        <div
          className="absolute bottom-2 right-3 z-[400] text-[9px]"
          style={{ color: tm.text4 }}
        >
          © OpenStreetMap contributors
        </div>

        {/* Horizontal vendor strip */}
        {stripVisible && (
          <div
            className="absolute bottom-0 left-0 right-0 z-[300]"
            style={{
              background: darkMode
                ? "rgba(15,23,42,0.97)"
                : "rgba(255,255,255,0.98)",
              borderTop: `1px solid ${tm.border}`,
            }}
          >
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <div
                className="flex gap-2 px-4 py-3"
                style={{ width: "max-content" }}
              >
                {scoredVendors.map((v, i) => {
                  const isSelected = selectedVendor?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVendor(v)}
                      className="relative shrink-0 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
                      style={{
                        width: 72,
                        height: 92,
                        outline: isSelected ? `2.5px solid #22c55e` : "none",
                        outlineOffset: 1,
                      }}
                    >
                      <img
                        src={v.photo_url}
                        alt={v.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white"
                        style={{
                          background: "#10b981",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: v.open_now
                            ? "#00d492"
                            : "rgba(255,255,255,0.3)",
                        }}
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 pt-6 pb-1 px-1.5"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0))",
                        }}
                      >
                        <p className="text-[6.5px] font-semibold text-white text-center leading-tight line-clamp-2">
                          {v.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vendor detail slide-in */}
        <div
          className="absolute top-0 right-0 bottom-0 z-[1000] transition-transform duration-300"
          style={{
            width: 360,
            transform: selectedVendor ? "translateX(0)" : "translateX(100%)",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.35)",
          }}
        >
          {selectedVendor && (
            <VendorDetail
              vendor={selectedVendor}
              onClose={() => setSelectedVendor(null)}
              isFavorite={favorites.has(selectedVendor.id)}
              onToggleFavorite={() => toggleFavorite(selectedVendor.id)}
            />
          )}
        </div>
      </div>

      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
