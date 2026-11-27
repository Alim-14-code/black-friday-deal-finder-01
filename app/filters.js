// Bargain Beacon — search, filter and sort.
// Pure functions over the deal list, so the list page and the tests agree.
// State shape: { q, category, store, minDiscount, verdict, sort }.
// sort: "best" (verdict, then discount, then saving), "discount" (biggest %),
// "saving" (most dollars saved), "price-asc", "price-desc".

import { compareBest, discountPct, savings, verdictOf } from "./verdict.js";

export const SORTS = {
  best: "Best deal first",
  discount: "Biggest % off",
  saving: "Most dollars saved",
  "price-asc": "Lowest price",
  "price-desc": "Highest price",
};

export function defaultState() {
  return { q: "", category: "", store: "", minDiscount: 0, verdict: "", sort: "best" };
}

export function stateFromHash(hash) {
  const state = defaultState();
  const query = (hash.split("?")[1] ?? "").replace(/^#?\/?/, "");
  for (const [key, value] of new URLSearchParams(query)) {
    if (key === "q") state.q = value;
    if (key === "category") state.category = value;
    if (key === "store") state.store = value;
    if (key === "verdict") state.verdict = value;
    if (key === "sort" && value in SORTS) state.sort = value;
    if (key === "minDiscount") {
      const n = Number(value);
      if (Number.isFinite(n) && n >= 0 && n <= 90) state.minDiscount = n;
    }
  }
  return state;
}

export function stateToQuery(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category) params.set("category", state.category);
  if (state.store) params.set("store", state.store);
  if (state.minDiscount) params.set("minDiscount", String(state.minDiscount));
  if (state.verdict) params.set("verdict", state.verdict);
  if (state.sort !== "best") params.set("sort", state.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}

export function applyFilters(all, state) {
  const q = state.q.trim().toLowerCase();
  const shown = all.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (state.category && d.category !== state.category) return false;
    if (state.store && d.store !== state.store) return false;
    if (state.verdict && d.verdict !== state.verdict) return false;
    if (state.minDiscount && discountPct(d) < state.minDiscount) return false;
    return true;
  });
  const sorted = [...shown];
  if (state.sort === "best") sorted.sort(compareBest);
  else if (state.sort === "discount") sorted.sort((a, b) => discountPct(b) - discountPct(a));
  else if (state.sort === "saving") sorted.sort((a, b) => savings(b) - savings(a));
  else if (state.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

export function verdictCounts(all) {
  const counts = { "new-low": 0, strong: 0, routine: 0 };
  for (const d of all) counts[d.verdict] = (counts[d.verdict] ?? 0) + 1;
  return counts;
}

export function bestDiscount(all) {
  return Math.max(...all.map((d) => discountPct(d)));
}
