// Bargain Beacon — routing and wiring.
// Two hash routes: #/ is the deal list (filters live in the hash query, so a
// filtered view has its own address), #/deal/<id> is one deal's page.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { applyFilters, stateFromHash, stateToQuery } from "./filters.js";
import { card, dealPage, listPage, missingPage } from "./views.js";

const app = document.getElementById("app");

function countText(shown) {
  return shown.length === deals.length
    ? `Showing all ${deals.length} deals`
    : `Showing ${shown.length} of ${deals.length} deals`;
}

function readForm(form) {
  const data = new FormData(form);
  return {
    q: String(data.get("q") ?? ""),
    category: String(data.get("category") ?? ""),
    store: String(data.get("store") ?? ""),
    minDiscount: Number(data.get("minDiscount") ?? 0) || 0,
    verdict: String(data.get("verdict") ?? ""),
    sort: String(data.get("sort") ?? "best"),
  };
}

function wireList(state) {
  const form = app.querySelector("#controls");
  if (!form) return;

  // On a phone the filters start folded so the deals are visible first;
  // the search box stays out in the open. The user opens them with a tap.
  const box = form.querySelector(".filter-box");
  if (box && window.innerWidth <= 600) box.removeAttribute("open");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    location.hash = `#/${stateToQuery(readForm(form))}`;
  });
  form.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      location.hash = `#/${stateToQuery(readForm(form))}`;
    });
  });
  const search = form.querySelector('input[name="q"]');
  let timer = 0;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const next = { ...state, q: search.value };
      const shown = applyFilters(deals, next);
      const grid = app.querySelector(".grid");
      const count = app.querySelector("#count");
      if (grid) grid.innerHTML = shown.length ? shown.map(card).join("\n") : '<p class="empty">No deal matches those filters. Loosen one and try again.</p>';
      if (count) count.textContent = countText(shown);
      history.replaceState(null, "", `#/${stateToQuery(next)}`);
    }, 250);
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | Bargain Beacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    const state = stateFromHash(location.hash);
    const shown = applyFilters(deals, state);
    document.title = "Bargain Beacon — Black Friday deals, checked today";
    app.innerHTML = listPage(state, shown);
    wireList(state);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
