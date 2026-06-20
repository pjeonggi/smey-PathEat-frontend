// Pure formatting helpers — no side effects, safe to import anywhere.

export function formatUSD(amount) {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function formatKHR(usd) {
  return `${Math.round(usd * 4000).toLocaleString()} ៛`;
}

export function formatDate(iso, includeYear = false) {
  const opts = {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  };
  return new Date(iso).toLocaleDateString("en-US", opts);
}

export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
