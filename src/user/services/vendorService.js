// Mock vendor service — mirrors the contract of POST /api/vendor/search.
// Swap the function bodies for real axios calls when the backend is live.

import { ALL_VENDORS } from "../../shared/constants/appConfig";
import { distToRouteM, calcScore } from "../../shared/utils/geoUtils";

/**
 * Filters ALL_VENDORS to those within radiusMetres of the route polyline,
 * then ranks them using calcScore() which mirrors the PostGIS ORDER BY clause.
 * TODO: replace with axios.post('/api/vendor/search', params)
 */
export async function getVendorsAlongRoute(params) {
  const {
    routePoints,
    radiusMetres,
    cuisine = "All",
    maxPrice = 4,
    openNow = false,
    query = "",
  } = params;

  console.log("[vendorService] getVendorsAlongRoute", {
    radiusMetres,
    cuisine,
    maxPrice,
    openNow,
  });

  const q = query.toLowerCase().trim();

  const scored = ALL_VENDORS.map((v) => {
    const dist = distToRouteM(v.lat, v.lng, routePoints);
    if (dist > radiusMetres) return null;
    return {
      ...v,
      dist_m: Math.round(dist),
      final_score: calcScore(v.price_range, dist, v.rating, v.wait_time_est),
    };
  })
    .filter((v) => v !== null)
    .filter((v) => cuisine === "All" || v.cuisine === cuisine)
    .filter((v) => v.price_range <= maxPrice)
    .filter((v) => !openNow || v.open_now)
    .filter((v) => {
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.menu.some((m) => m.name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => b.final_score - a.final_score);

  return scored;
}

/** Fetches a single vendor by id — used for the detail panel. */
export async function getVendorById(id) {
  // TODO: replace with axios.get(`/api/vendor/${id}`)
  return ALL_VENDORS.find((v) => v.id === id) ?? null;
}
