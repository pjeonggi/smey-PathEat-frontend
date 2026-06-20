import { useRef, useEffect, useCallback, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  PHNOM_PENH_CENTER,
  LIGHT_VECTOR_STYLE,
  DARK_VECTOR_STYLE,
} from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";

function styleUrl(dark) {
  return dark ? DARK_VECTOR_STYLE : LIGHT_VECTOR_STYLE;
}

function makeVendorElement(rank, score, selected) {
  const el = document.createElement("div");
  const bg = selected ? "#3B82F6" : scoreColor(score);
  el.style.width = "32px";
  el.style.height = "32px";
  el.style.background = bg;
  el.style.border = "2px solid rgba(255,255,255,0.9)";
  el.style.borderRadius = "50% 50% 50% 0";
  el.style.transform = "rotate(-45deg)";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.cursor = "pointer";
  el.style.boxShadow = selected
    ? "0 0 0 4px rgba(59,130,246,0.35),0 3px 12px rgba(0,0,0,0.6)"
    : "0 3px 12px rgba(0,0,0,0.5)";
  const span = document.createElement("span");
  span.style.transform = "rotate(45deg)";
  span.style.color = "white";
  span.style.fontSize = "12px";
  span.style.fontWeight = "800";
  span.style.fontFamily = "system-ui";
  span.style.lineHeight = "1";
  span.textContent = String(rank);
  el.appendChild(span);
  return el;
}

function makeEndpointElement(bg, label) {
  const el = document.createElement("div");
  el.style.width = "28px";
  el.style.height = "28px";
  el.style.background = bg;
  el.style.border = "3px solid white";
  el.style.borderRadius = "50%";
  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.color = "white";
  el.style.fontSize = "11px";
  el.style.fontWeight = "800";
  el.style.fontFamily = "system-ui";
  el.textContent = label;
  return el;
}

export function useMaplibreMap({
  darkMode,
  routePoints,
  routeReady,
  editRouteMode,
  scoredVendors,
  selectedVendorId,
  onSelectVendor,
  onWaypointAdded,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const vendorMarkersRef = useRef([]);
  const endpointMarkersRef = useRef([]);
  const ghostMarkerRef = useRef(null);
  const editModeRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);

  useEffect(() => {
    editModeRef.current = editRouteMode;
  }, [editRouteMode]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: styleUrl(darkMode),
      center: [PHNOM_PENH_CENTER[1], PHNOM_PENH_CENTER[0]],
      zoom: 14,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;
    map.on("load", () => {
      setMapReady(true);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update style on darkMode toggle
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.setStyle(styleUrl(darkMode));
    map.once("styledata", () => {
      setStyleVersion((v) => v + 1);
    });
  }, [darkMode]);

  // Helper to convert points [lat,lng] -> [lng,lat]
  const toLngLat = (pt) => [pt[1], pt[0]];

  // Route polyline
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    // remove existing source/layer if present
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route")) map.removeSource("route");

    if (!routePoints || routePoints.length < 2) return;

    const coords = routePoints.map((p) => toLngLat(p));
    map.addSource("route", {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } },
    });
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#3B82F6", "line-width": 4, "line-opacity": 0.85 },
    });

    // Endpoint markers
    endpointMarkersRef.current.forEach((m) => m.remove());
    endpointMarkersRef.current = [];
    const Ael = makeEndpointElement("#10b981", "A");
    const Bel = makeEndpointElement("#ef4444", "B");
    const A = new maplibregl.Marker(Ael, { draggable: true }).setLngLat(coords[0]).addTo(map);
    const B = new maplibregl.Marker(Bel, { draggable: true }).setLngLat(coords[coords.length - 1]).addTo(map);
    endpointMarkersRef.current = [A, B];

    // Ghost marker for hover when editing
    if (ghostMarkerRef.current) {
      ghostMarkerRef.current.remove();
      ghostMarkerRef.current = null;
    }
    const ghostEl = document.createElement("div");
    ghostEl.style.width = "14px";
    ghostEl.style.height = "14px";
    ghostEl.style.borderRadius = "50%";
    ghostEl.style.background = "#3B82F6";
    ghostEl.style.opacity = "0.7";
    ghostEl.style.border = "2px solid #3B82F6";
    const ghostMarker = new maplibregl.Marker(ghostEl).setLngLat(coords[0]);
    ghostMarkerRef.current = ghostMarker;

    map.on("mousemove", "route-line", (e) => {
      if (!editModeRef.current) return;
      const lnglat = e.lngLat;
      ghostMarker.setLngLat(lnglat);
      if (!ghostMarker._map) ghostMarker.addTo(map);
    });
    map.on("mouseleave", "route-line", () => {
      ghostMarker.remove();
    });
    map.on("click", "route-line", (e) => {
      if (editModeRef.current) onWaypointAdded(e.lngLat.lat, e.lngLat.lng);
    });

    // Fit bounds
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(coords[0], coords[0]),
    );
    map.fitBounds(bounds, { padding: 40 });
  }, [mapReady, routePoints, styleVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Vendor markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    // remove old markers
    vendorMarkersRef.current.forEach((m) => m.remove());
    vendorMarkersRef.current = [];
    if (!routeReady || editRouteMode) return;

    scoredVendors.forEach((v, i) => {
      const el = makeVendorElement(i + 1, v.final_score, selectedVendorId === v.id);
      const marker = new maplibregl.Marker(el).setLngLat([v.lng, v.lat]).addTo(map);
      el.addEventListener("click", () => onSelectVendor(v));
      vendorMarkersRef.current.push(marker);
    });
  }, [mapReady, scoredVendors, selectedVendorId, routeReady, editRouteMode, styleVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWaypointAdded = useCallback(
    (lat, lng) => {
      onWaypointAdded(lat, lng);
    },
    [onWaypointAdded],
  );

  return { mapDivRef, mapReady };
}
