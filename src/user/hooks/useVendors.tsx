// Mock data hook — returns scored vendors along a route polyline.
// Swap the body of getVendorsAlongRoute import for a real fetch when backend is live.

import { useMemo } from "react";
import { ALL_VENDORS } from "../../shared/constants/appConfig";
import { distToRouteM, calcScore } from "../../shared/utils/geoUtils";

/**
 * @param {{ routePoints: [number,number][], vendorRange: number, filterCuisine: string,
 *           filterMaxPrice: number, filterOpenNow: boolean, vendorSearch: string }} params
 */
export function useVendors({
  routePoints,
  vendorRange,
  filterCuisine,
  filterMaxPrice,
  filterOpenNow,
  vendorSearch,
}) {
  const vendors = useMemo(() => {
    if (routePoints.length < 2) return [];
    const q = vendorSearch.toLowerCase().trim();

    return ALL_VENDORS.map((v) => {
      const dist = distToRouteM(v.lat, v.lng, routePoints);
      if (dist > vendorRange) return null;
      return {
        ...v,
        dist_m: Math.round(dist),
        final_score: calcScore(v.price_range, dist, v.rating, v.wait_time_est),
      };
    })
      .filter((v) => v !== null)
      .filter((v) => filterCuisine === "All" || v.cuisine === filterCuisine)
      .filter((v) => v.price_range <= filterMaxPrice)
      .filter((v) => !filterOpenNow || v.open_now)
      .filter(
        (v) =>
          !q ||
          v.name.toLowerCase().includes(q) ||
          v.menu.some((m) => m.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.final_score - a.final_score);
  }, [
    routePoints,
    vendorRange,
    filterCuisine,
    filterMaxPrice,
    filterOpenNow,
    vendorSearch,
  ]);

  return vendors;
}
