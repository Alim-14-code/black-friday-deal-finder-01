// Bargain Beacon — the pages' HTML, built from the deal data.
// Every value is escaped before it goes into the page. Cards show the whole
// deal at a glance: verdict, product, store, sale price, usual price,
// discount, saving, and when the price was checked. The detail page adds the
// evidence, the source, and the same product at other stores.

import { CATEGORIES, STORES, deals } from "./data.js";
import { SORTS } from "./filters.js";
import { checkedText, discountPct, money, priceText, savings, verdictOf, wasText } from "./verdict.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function options(values, current, allLabel) {
  const first = `<option value="">${escape(allLabel)}</option>`;
  return (
    first +
    values.map((v) => `<option value="${escape(v)}"${v === current ? " selected" : ""}>${escape(v)}</option>`).join("")
  );
}

export function controls(state) {
  return `<form id="controls" class="controls" action="#/" method="get">
  <label class="search">Search
    <input type="search" name="q" value="${escape(state.q)}" placeholder="AirPods, TV, LEGO…" autocomplete="off">
  </label>
  <details class="filter-box" open>
    <summary>Filters &amp; sort</summary>
    <div class="filter-grid">
  <label>Category
    <select name="category">${options(CATEGORIES, state.category, "All categories")}</select>
  </label>
  <label>Store
    <select name="store">${options(STORES, state.store, "All stores")}</select>
  </label>
  <label>Discount
    <select name="minDiscount">
      ${[0, 20, 30, 40, 50].map((n) => `<option value="${n}"${state.minDiscount === n ? " selected" : ""}>${n === 0 ? "Any discount" : `${n}% off or more`}</option>`).join("")}
    </select>
  </label>
  <label>Verdict
    <select name="verdict">
      <option value="">Any verdict</option>
      ${Object.entries({ "new-low": "New low", strong: "Strong deal", routine: "Routine sale" })
        .map(([v, label]) => `<option value="${v}"${state.verdict === v ? " selected" : ""}>${label}</option>`)
        .join("")}
    </select>
  </label>
  <label>Sort
    <select name="sort">
      ${Object.entries(SORTS)
        .map(([v, label]) => `<option value="${v}"${state.sort === v ? " selected" : ""}>${label}</option>`)
        .join("")}
    </select>
  </label>
  <button type="submit">Find deals</button>
    </div>
  </details>
</form>`;
}

export function card(d) {
  const v = verdictOf(d);
  const pct = discountPct(d);
  return `<article class="card verdict-${escape(d.verdict)}">
  <p class="badge">${escape(v.label)}</p>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="meta"><span class="store">${escape(d.store)}</span> · <span>${escape(d.category)}</span></p>
  <p class="price"><strong>${escape(priceText(d))}</strong> <s>${escape(wasText(d))}</s> <span class="off">−${pct}%</span></p>
  <p class="save">You save ${escape(money(savings(d)))}</p>
  <p class="checked">Checked ${escape(checkedText(d.checked))}</p>
  <p class="actions"><a class="store-link" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} ↗</a>
  <a class="detail-link" href="#/deal/${encodeURIComponent(d.id)}">Details →</a></p>
</article>`;
}

export function listPage(state, shown) {
  const count =
    shown.length === deals.length
      ? `Showing all ${deals.length} deals`
      : `Showing ${shown.length} of ${deals.length} deals`;
  const cards = shown.length === 0 ? '<p class="empty">No deal matches those filters. Loosen one and try again.</p>' : shown.map(card).join("\n");
  return `<p class="intro">Real Black Friday and Cyber Monday deals, each price read at its store on 27 November 2026. A <strong>NEW LOW</strong> is the lowest price tracked; a <strong>STRONG DEAL</strong> is a genuine cut worth buying; a <strong>ROUTINE SALE</strong> is a fair price, not a record.</p>
${controls(state)}
<p class="count" id="count">${escape(count)}</p>
<div class="grid">${cards}</div>`;
}

export function dealPage(d) {
  const v = verdictOf(d);
  const pct = discountPct(d);
  const also =
    d.alsoAt && d.alsoAt.length
      ? `<section class="also"><h2>Same product elsewhere</h2>
<table><thead><tr><th>Store</th><th>Price</th><th>Compared with this deal</th></tr></thead><tbody>
<tr><td>${escape(d.store)}</td><td><strong>${escape(priceText(d))}</strong></td><td>This deal</td></tr>
${d.alsoAt
  .map(
    (a) =>
      `<tr><td>${escape(a.store)}</td><td>${escape(money(a.price))}</td><td>${a.price > d.price ? `${escape(money(a.price - d.price))} more than here` : a.price < d.price ? `${escape(money(d.price - a.price))} less than here` : "Same price"}</td></tr>`,
  )
  .join("")}
</tbody></table></section>`
      : "";
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail verdict-${escape(d.verdict)}">
  <p class="badge">${escape(v.label)} — ${escape(v.note)}</p>
  <h1>${escape(d.title)}</h1>
  <p class="meta"><span class="store">${escape(d.store)}</span> · <span>${escape(d.category)}</span></p>
  <p class="price big"><strong>${escape(priceText(d))}</strong> <s>${escape(wasText(d))}</s> <span class="off">−${pct}%</span></p>
  <p class="save">You save ${escape(money(savings(d)))}${d.unit ? " a month" : ""} off the usual price.</p>
  <section class="verdict-box"><h2>Is it really a deal?</h2><p>${escape(d.evidence)}</p></section>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${escape(checkedText(d.checked))}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="store-link big-link" href="${escape(d.url)}" target="_blank" rel="noopener">View it at ${escape(d.store)} ↗</a></p>
  ${also}
  <p class="note">Prices move during Black Friday week — check the price at the store before you buy.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
