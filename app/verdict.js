// Bargain Beacon — verdicts and money.
// One job: turn a deal's numbers into the words and figures the site shows.
// The verdict rank orders the default sort: a new low beats a strong deal,
// a strong deal beats a routine sale.

export const VERDICTS = {
  "new-low": { label: "NEW LOW", rank: 0, note: "Lowest price tracked" },
  strong: { label: "STRONG DEAL", rank: 1, note: "A genuine cut worth buying" },
  routine: { label: "ROUTINE SALE", rank: 2, note: "A fair sale, not a record" },
};

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] ?? VERDICTS.routine;
}

export function discountPct(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savings(deal) {
  return deal.was - deal.price;
}

export function money(n) {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded)
    ? `$${rounded.toLocaleString("en-US")}`
    : `$${rounded.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function priceText(deal) {
  return money(deal.price) + deal.unit;
}

export function wasText(deal) {
  return money(deal.was) + deal.unit;
}

export function checkedText(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC"
  );
}

// Best deal first: verdict rank, then discount %, then dollars saved.
export function compareBest(a, b) {
  const ra = verdictOf(a).rank - verdictOf(b).rank;
  if (ra !== 0) return ra;
  const dp = discountPct(b) - discountPct(a);
  if (dp !== 0) return dp;
  return savings(b) - savings(a);
}
