// Mock data hook — manages reviews for a single vendor.
// Replace STORE with real API calls (GET /api/review/:vendorId, POST /api/review).

import { useState, useEffect } from "react";

// In-memory store resets on page reload; sufficient until backend is wired
const STORE = [
  {
    id: "r-001",
    vendor_id: 1,
    user_id: "u-001",
    user_name: "Sophea M.",
    stars: 5,
    body: "Absolutely love this place. Will come back every morning!",
    created_at: "2025-06-11T07:30:00Z",
  },
  {
    id: "r-002",
    vendor_id: 1,
    user_id: "u-002",
    user_name: "Dara V.",
    stars: 4,
    body: "Very good value. A bit busy at lunch but worth the wait.",
    created_at: "2025-06-10T08:15:00Z",
  },
  {
    id: "r-003",
    vendor_id: 2,
    user_id: "u-001",
    user_name: "Sophea M.",
    stars: 5,
    body: "Fresh ingredients every morning. Go early!",
    created_at: "2025-06-09T06:45:00Z",
  },
  {
    id: "r-004",
    vendor_id: 3,
    user_id: "u-002",
    user_name: "Dara V.",
    stars: 5,
    body: "Best bai sach chrouk in Phnom Penh.",
    created_at: "2025-06-08T06:20:00Z",
  },
];

/**
 * @param {number} vendorId
 * @returns {{ reviews: object[], submit: (payload: object) => Promise<void>, submitting: boolean }}
 */
export function useReviews(vendorId) {
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // TODO: replace with GET /api/review/:vendorId
    setReviews(
      STORE.filter((r) => r.vendor_id === vendorId).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      ),
    );
  }, [vendorId]);

  async function submit(payload) {
    // TODO: replace with POST /api/review
    const duplicate = STORE.find(
      (r) => r.vendor_id === payload.vendor_id && r.user_id === payload.user_id,
    );
    if (duplicate) throw new Error("You have already reviewed this vendor.");
    setSubmitting(true);
    try {
      const review = {
        id: `r-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
      };
      STORE.unshift(review);
      setReviews((prev) => [review, ...prev]);
    } finally {
      setSubmitting(false);
    }
  }

  return { reviews, submit, submitting };
}
