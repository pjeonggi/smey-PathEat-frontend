import { OSRM_BASE_URL } from "../constants/appConfig";

export async function getRoute(origin, destination) {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?geometries=geojson&overview=full`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error: ${res.statusText}`);
  const data = await res.json();

  if (!data.routes?.length) throw new Error("No route found");

  // OSRM returns [lng, lat] — convert to [lat, lng] for the rest of the app
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}
