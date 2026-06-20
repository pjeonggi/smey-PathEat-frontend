// Mock review service — mirrors POST /api/review and GET /api/review/:vendorId.
// In-memory store resets on page reload; replace with Axios when backend is ready.

// Seed reviews so the UI doesn't look empty on first load
const STORE = [
  {
    id: "r-001",
    vendor_id: 1,
    user_id: "u-001",
    user_name: "Sophea M.",
    stars: 5,
    body: "Absolutely love this place. The broth is rich and authentic. Will come back every morning!",
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
    body: "Fresh ingredients every morning. Sold out by 10am — go early!",
    created_at: "2025-06-09T06:45:00Z",
  },
  {
    id: "r-004",
    vendor_id: 3,
    user_id: "u-002",
    user_name: "Dara V.",
    stars: 5,
    body: "Best bai sach chrouk in Phnom Penh. The charcoal smoke aroma gets me every time.",
    created_at: "2025-06-08T06:20:00Z",
  },
];

/** Fetch all reviews for a specific vendor */
export async function getReviewsByVendor(vendorId) {
  // TODO: replace with axios.get(`/api/review/${vendorId}`)
  console.log("[reviewService] getReviewsByVendor", vendorId);
  return STORE.filter((r) => r.vendor_id === vendorId).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** Submit a new review — only accessible to authenticated CONSUMER users */
export async function submitReview(payload) {
  // TODO: replace with axios.post('/api/review', payload)
  console.log("[reviewService] submitReview", payload);

  // Prevent duplicate review from same user on same vendor
  const existing = STORE.find(
    (r) => r.vendor_id === payload.vendor_id && r.user_id === payload.user_id,
  );
  if (existing) throw new Error("You have already reviewed this vendor.");

  const review = {
    id: `r-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  };
  STORE.unshift(review);
  return review;
}
