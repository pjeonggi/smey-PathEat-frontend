// Spatial maths that mirror the PostGIS query logic for instant client-side feedback.

export function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180,
    φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function distToSegmentM(lat, lng, lat1, lng1, lat2, lng2) {
  const dx = lat2 - lat1,
    dy = lng2 - lng1;
  if (dx === 0 && dy === 0) return haversineM(lat, lng, lat1, lng1);
  const t = Math.max(
    0,
    Math.min(1, ((lat - lat1) * dx + (lng - lng1) * dy) / (dx * dx + dy * dy)),
  );
  return haversineM(lat, lng, lat1 + t * dx, lng1 + t * dy);
}

export function distToRouteM(lat, lng, pts) {
  let min = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSegmentM(
      lat,
      lng,
      pts[i][0],
      pts[i][1],
      pts[i + 1][0],
      pts[i + 1][1],
    );
    if (d < min) min = d;
  }
  return min;
}

/**
 * Composite ranking score (0–1).
 * Weights: affordability 35%, proximity 30%, rating 20%, wait −15%
 */
export function calcScore(priceRange, distM, rating, waitMin) {
  return (
    0.35 * (1 - (priceRange - 1) / 3) +
    0.3 * (1 - Math.min(distM, 300) / 300) +
    0.2 * (rating / 5) -
    0.15 * (waitMin / 15)
  );
}

export function scoreColor(score) {
  if (score >= 0.68) return "#10b981";
  if (score >= 0.5) return "#22c55e";
  return "#f97316";
}


