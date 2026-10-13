// package/dist/chunks/chunk-Y747DWCS.js
var _ = Math.PI / 180;
var Y = Math.sqrt(1.6);
function O({ scale: t, azimuth: n2 = 45, elevation: e = 30 }) {
  let o = n2 * _, s2 = e * _;
  return { sinA: Math.sin(o), cosA: Math.cos(o), sinE: Math.sin(s2), cosE: Math.cos(s2), k: t * Y };
}
function P([t, n2, e], o) {
  let { origin: s2 } = o, { sinA: a, cosA: r2, sinE: i2, cosE: l2, k: m } = O(o);
  return [s2[0] + (t * a - n2 * r2) * m, s2[1] + ((t * r2 + n2 * a) * i2 - e * l2) * m];
}
function Z(t) {
  let { sinA: n2, cosA: e } = O(t);
  return [e, n2];
}
function J([t, n2, e], o) {
  let { sinA: s2, cosA: a, sinE: r2, cosE: i2 } = O(o);
  return (t * a + n2 * s2) * i2 + e * r2;
}
var I = (t) => {
  let n2 = (Math.round(t * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return n2 === "-0" ? "0" : n2;
};
function y(t, n2 = false) {
  return t.length ? t.map(([e, o], s2) => `${s2 ? "L" : "M"}${I(e)} ${I(o)}`).join("") + (n2 ? "Z" : "") : "";
}
function Q({ x: t, y: n2, w: e, d: o, r: s2 }, a = 8) {
  let r2 = Math.max(0, Math.min(s2, e / 2, o / 2)), i2 = [[t + e - r2, n2 + r2, -90], [t + e - r2, n2 + o - r2, 0], [t + r2, n2 + o - r2, 90], [t + r2, n2 + r2, 180]], l2 = [];
  for (let [m, f, p] of i2) {
    let h = r2 > 0 ? a : 0;
    for (let x = 0; x <= h; x++) {
      let u = (p + (h ? 90 * x / h : 45)) * _;
      l2.push([m + r2 * Math.cos(u), f + r2 * Math.sin(u)]);
    }
  }
  return l2;
}
function K(t) {
  let n2 = 0;
  for (let e = 0; e < t.length; e++) {
    let [o, s2] = t[e], [a, r2] = t[(e + 1) % t.length];
    n2 += o * r2 - a * s2;
  }
  return n2 / 2;
}
var T = (t) => K(t) < 0 ? [...t].reverse() : t;
function X(t) {
  let n2 = [...t].sort((a, r2) => a[0] - r2[0] || a[1] - r2[1]);
  if (n2.length < 3) return n2;
  let e = (a, r2, i2) => (r2[0] - a[0]) * (i2[1] - a[1]) - (r2[1] - a[1]) * (i2[0] - a[0]), o = [];
  for (let a of n2) {
    for (; o.length >= 2 && e(o[o.length - 2], o[o.length - 1], a) <= 0; ) o.pop();
    o.push(a);
  }
  let s2 = [];
  for (let a = n2.length - 1; a >= 0; a--) {
    let r2 = n2[a];
    for (; s2.length >= 2 && e(s2[s2.length - 2], s2[s2.length - 1], r2) <= 0; ) s2.pop();
    s2.push(r2);
  }
  return [...o.slice(0, -1), ...s2.slice(0, -1)];
}
function L(t, n2) {
  let e = t.length, o = [], s2 = t.findIndex((r2, i2) => r2 !== t[(i2 + e - 1) % e]);
  if (s2 < 0) return t[0] === n2 ? [Array.from({ length: e + 1 }, (r2, i2) => i2 % e)] : [];
  let a = null;
  for (let r2 = 0; r2 < e; r2++) {
    let i2 = (s2 + r2) % e;
    t[i2] === n2 ? (a || (a = [i2]), a.push((i2 + 1) % e)) : a && (o.push(a), a = null);
  }
  return a && o.push(a), o;
}
function V(t, n2, e, o, s2 = {}) {
  let a = s2.convex ?? true, r2 = t.length, i2 = K(t) > 0, [l2, m] = Z(o), { sinA: f, cosA: p } = O(o), h = t.map(([c2, d], v) => {
    let [$, M] = t[(v + 1) % r2], F = $ - c2, A2 = M - d, w = Math.hypot(F, A2) || 1;
    return i2 ? [A2 / w, -F / w] : [-A2 / w, F / w];
  }), x = h.map(([c2, d]) => c2 * l2 + d * m > 1e-9), u = t.map(([c2, d]) => P([c2, d, n2 + e], o)), b = t.map(([c2, d]) => P([c2, d, n2], o)), g = [], j = [];
  for (let c2 of L(x, false)) g.push(y(c2.map((d) => u[d])));
  for (let c2 of L(x, true)) j.push(y(c2.map((d) => u[d]))), e > 0 && g.push(y(c2.map((d) => b[d])));
  if (e > 0) for (let c2 = 0; c2 < r2; c2++) x[(c2 + r2 - 1) % r2] !== x[c2] && g.push(y([u[c2], b[c2]]));
  let k;
  if (a) k = y(X([...u, ...b]), true);
  else {
    let c2 = [y(T(u), true), y(T(b), true)];
    for (let d = 0; d < r2; d++) {
      if (!x[d]) continue;
      let v = (d + 1) % r2;
      c2.push(y(T([u[d], u[v], b[v], b[d]]), true));
    }
    k = c2.join("");
  }
  let S = Array.from({ length: 4 }, () => []);
  if (e > 0) {
    let [c2, d] = [-f, p];
    for (let v = 0; v < r2; v++) {
      if (!x[v]) continue;
      let [$, M] = h[v], F = ($ * c2 + M * d + 1) / 2, A2 = Math.min(3, Math.max(0, Math.floor(F * 4))), w = (v + 1) % r2;
      S[A2].push(y(T([u[v], u[w], b[w], b[v]]), true));
    }
  }
  let E2;
  if (s2.bevel && s2.bevel > 0) {
    let c2 = s2.bevel, v = t.map(([$, M], F) => {
      let [A2, w] = h[(F + r2 - 1) % r2], [W, q] = h[F], z = A2 + W, C = w + q, D = Math.hypot(z, C) || 1;
      return [$ - z / D * c2, M - C / D * c2];
    }).map(([$, M]) => P([$, M, n2 + e], o));
    E2 = L(x, true).map(($) => y([u[$[0]], ...$.slice(1, -1).map((M) => v[M]), u[$[$.length - 1]]])).join("");
  }
  return { fill: k, outline: g.join(""), crease: j.join(""), top: y(T(u), true), shades: S.map((c2) => c2.join("")), bevel: E2 };
}
var B = (t, n2 = 8) => Q(t, n2);
function tt(t, n2, e, o, s2 = 8, a = 0) {
  return V(B(t, s2), n2, e, o, { convex: true, bevel: a });
}
function G(t, n2, e, o = 40) {
  return Array.from({ length: o }, (s2, a) => {
    let r2 = a / o * Math.PI * 2;
    return [t + e * Math.cos(r2), n2 + e * Math.sin(r2)];
  });
}
function at(t, n2, e, o, s2, a, r2 = 32, i2 = 0) {
  return V(G(t, n2, e, r2), o, s2, a, { convex: true, bevel: i2 });
}
function H(t, n2, e, o = false) {
  return y(t.map(([s2, a]) => P([s2, a, n2], e)), o);
}
var st = (t, n2, e, o = 8) => H(B(t, o), n2, e, true);
var et = (t, n2, e, o) => H([t, n2], e, o);
var lt = (t, n2, e, o, s2, a = 40) => H(G(t, n2, e, a), o, s2, true);
function ct({ x: t, y: n2, w: e, d: o }, s2, a) {
  let r2 = [];
  for (let i2 of [t, t + e]) for (let l2 of [n2, n2 + o]) for (let m of [s2, a]) r2.push([i2, l2, m]);
  return r2;
}
function dt(t, n2, e, o, s2 = 20) {
  let [a, r2, i2] = t, l2 = [];
  for (let m = 0; m < s2; m++) {
    let f = m / s2 * Math.PI * 2, p = n2 * Math.cos(f), h = n2 * Math.sin(f);
    l2.push(P(e === "x" ? [a, r2 + p, i2 + h] : [a + p, r2, i2 + h], o));
  }
  return y(l2, true);
}
function nt(t, [n2, e, o]) {
  let s2 = P([0, 0, 0], t), a = P([n2, e, o], t);
  return [a[0] - s2[0], a[1] - s2[1]];
}
var U = (t) => Math.round(t * 100) / 100;
function ht(t, n2) {
  let [e, o] = nt(t, n2);
  return `translate(${U(e)} ${U(o)})`;
}
function yt(t, n2, e, { pad: o = 24, headroom: s2 = 0, azimuth: a = 45, elevation: r2 = 30 } = {}) {
  let i2 = { origin: [0, 0], scale: 1, azimuth: a, elevation: r2 }, l2 = t.map((g) => P(g, i2)), m = l2.map(([g]) => g), f = l2.map(([, g]) => g), p = Math.min(...m), h = Math.max(...m), x = Math.min(...f), u = Math.max(...f), b = Math.min((n2 - o * 2) / (h - p), (e - o * 2 - s2) / (u - x));
  return { origin: [n2 / 2 - (p + h) / 2 * b, s2 + (e - s2) / 2 - (x + u) / 2 * b], scale: b, azimuth: a, elevation: r2 };
}
var ot = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var N = (t) => Object.entries(t).filter(([, n2]) => n2 !== void 0 && n2 !== false).map(([n2, e]) => ` ${n2}="${ot(String(e))}"`).join("");
function gt(t, { tone: n2 = "hi", crease: e = "faint", halo: o = false, lit: s2 = false, flat: a = false, className: r2, inner: i2 = "" } = {}) {
  let l2 = [];
  return o && l2.push(`<path class="iso-halo" d="${t.fill}"/>`), l2.push(`<path class="iso-fill" d="${t.fill}"/>`), a || (t.shades.forEach((m, f) => {
    m && l2.push(`<path class="iso-shade" data-shade="${f}" d="${m}"/>`);
  }), l2.push(`<path class="iso-top" d="${t.top}"/>`)), e !== "none" && t.crease && l2.push(`<path class="iso-line iso-crease" data-tone="${e}" d="${t.crease}"/>`), e !== "none" && t.bevel && l2.push(`<path class="iso-line iso-bevel" data-tone="${e}" d="${t.bevel}"/>`), i2 && l2.push(i2), l2.push(`<path class="iso-line iso-edge" data-tone="${n2}" d="${t.outline}"/>`), `<g${N({ class: r2 ? `iso-solid ${r2}` : "iso-solid", "data-lit": s2 ? "" : void 0, "data-seamless": t.seamless ? "" : void 0 })}>${l2.join("")}</g>`;
}
function R(t, { tone: n2 = "lo", dotted: e = false, dashed: o = false, flow: s2 = false, className: a, free: r2 } = {}) {
  return t ? `<path${N({ class: a ? `iso-line ${a}` : "iso-line", "data-tone": n2, "data-free": r2 === true ? "" : r2 || void 0, "data-dotted": e ? "" : void 0, "data-dashed": o ? "" : void 0, "data-flow": s2 ? "" : void 0, d: t })}/>` : "";
}
function $t(t, n2 = {}) {
  let e = /* @__PURE__ */ new Map();
  for (let o of t) {
    let [s2, a] = Array.isArray(o) ? o : [o.d, o.alpha];
    if (!s2 || !(a > 0.02)) continue;
    let r2 = Math.min(1, Math.round(a * 20) / 20);
    e.set(r2, (e.get(r2) ?? "") + s2);
  }
  return [...e].map(([o, s2]) => o >= 1 ? R(s2, n2) : `<g opacity="${o.toFixed(2)}">${R(s2, n2)}</g>`).join("");
}

// package/dist/chunks/chunk-QUYXL3AP.js
var l = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function A(t) {
  let f = Object.entries(t.stage.aria ?? {}).map(([d, u]) => ` ${d}="${l(u)}"`).join(""), c2 = `<div class="iso-plate" data-plate="${t.theme}"><div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig"></span><span class="iso-plate-corner" data-corner="title">${l(t.title)}</span><span class="iso-plate-corner" data-corner="hint">${l(t.hint)}</span><span class="iso-plate-corner" data-corner="readout" data-readout="">${l(t.readout)}</span></div><div class="iso-stage" tabindex="0" role="${l(t.stage.role)}" aria-label="${l(t.stage.label)}"${f}>${t.svg}</div><span class="iso-sr" role="status" aria-live="polite" data-status=""></span></div>`;
  return t.theme === "dark" ? `<div class="iso iso-dark" data-theme="dark">${c2}</div>` : `<div class="iso" data-theme="light">${c2}</div>`;
}
function E(t) {
  let f = /* @__PURE__ */ new WeakMap(), c2 = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap();
  function u(e) {
    let n2 = e.defaultView;
    if (!n2 || !("adoptedStyleSheets" in e) || !("replaceSync" in n2.CSSStyleSheet.prototype)) return null;
    let i2 = f.get(e);
    return i2 || (i2 = new n2.CSSStyleSheet(), i2.replaceSync(t.css), f.set(e, i2)), i2;
  }
  function w(e) {
    let n2 = c2.get(e);
    return n2 || (n2 = e.createElement("template"), n2.innerHTML = A(t), c2.set(e, n2)), n2;
  }
  function h(e, n2 = {}) {
    if (typeof document > "u" || !e) return () => {
    };
    d.get(e)?.();
    let i2 = e.ownerDocument, o = e.shadowRoot ?? e.attachShadow({ mode: "open" }), g = u(i2), b = w(i2).content.cloneNode(true);
    if (g) o.adoptedStyleSheets.includes(g) || (o.adoptedStyleSheets = [...o.adoptedStyleSheets, g]), o.replaceChildren(b);
    else {
      let s2 = i2.createElement("style");
      s2.textContent = t.css, o.replaceChildren(s2, b);
    }
    let a = o.querySelector(".iso-plate"), p = a.parentElement, m = n2.theme === "dark" || n2.theme === "light" ? n2.theme : t.theme;
    p.dataset.theme = m, p.classList.toggle("iso-dark", m === "dark"), a.dataset.plate = m;
    for (let [s2, r2] of Object.entries(n2.tokens ?? {})) s2.startsWith("--") && r2 != null && p.style.setProperty(s2, String(r2));
    a.querySelector('[data-corner="fig"]').textContent = n2.fig ?? t.fig;
    let v = /* @__PURE__ */ new Set();
    for (let s2 of a.querySelectorAll("canvas")) {
      let r2 = s2.getContext;
      s2.getContext = function(...$) {
        let y2 = r2.apply(this, $);
        return y2 && v.add(y2), y2;
      };
    }
    let C = typeof ResizeObserver > "u" ? null : new ResizeObserver(() => a.toggleAttribute("data-narrow", a.offsetWidth <= 560));
    C?.observe(a);
    let S = t.mount(a, JSON.parse(t.data)), k = () => {
      if (!S) return;
      let s2 = S;
      S = null, d.delete(e), C?.disconnect(), s2();
      for (let r2 of v) r2.getExtension?.("WEBGL_lose_context")?.loseContext();
      o.replaceChildren();
    };
    return d.set(e, k), k;
  }
  function x() {
    return class extends HTMLElement {
      static observedAttributes = ["fig", "theme"];
      #e = null;
      connectedCallback() {
        if (Object.prototype.hasOwnProperty.call(this, "fig")) {
          let e = this.fig;
          delete this.fig, this.fig = e;
        }
        this.#e || (this.#e = h(this, { fig: this.fig, theme: this.getAttribute("theme") ?? void 0 }));
      }
      disconnectedCallback() {
        queueMicrotask(() => {
          this.isConnected || (this.#e?.(), this.#e = null);
        });
      }
      attributeChangedCallback(e) {
        if (e === "theme") {
          this.#e && (this.#e = h(this, { fig: this.fig, theme: this.getAttribute("theme") ?? void 0 }));
          return;
        }
        let n2 = this.#e ? this.shadowRoot?.querySelector('[data-corner="fig"]') : null;
        n2 && (n2.textContent = this.fig);
      }
      get fig() {
        return this.getAttribute("fig") ?? t.fig;
      }
      set fig(e) {
        e == null ? this.removeAttribute("fig") : this.setAttribute("fig", String(e));
      }
    };
  }
  function O2(e = t.tag) {
    typeof customElements > "u" || customElements.get(e) || customElements.define(e, x());
  }
  return { render: h, define: O2 };
}

// package/dist/chunks/chunk-5FH6PP3I.js
var s = Object.defineProperty;
var i = (a, t) => {
  for (var o in t) s(a, o, { get: t[o], enumerable: true });
};
var n = { paper: { base: "light", tokens: { "--anatomy-card": "#dfdfd8", "--anatomy-paper": "#dfdfd8", "--anatomy-face": "#f3f3ee", "--anatomy-top": "#f6f6f2", "--anatomy-shade-0": "#c6c6be", "--anatomy-shade-1": "#d0d0c9", "--anatomy-shade-2": "#dadad3", "--anatomy-shade-3": "#e4e4de", "--anatomy-lit-top": "#fafaf7", "--anatomy-lit-shade": "#e6e6e0", "--anatomy-hi": "#1f1f1d", "--anatomy-mid": "#7c7c75", "--anatomy-lo": "#a2a29a", "--anatomy-faint": "#c2c2ba", "--anatomy-lit": "#000000", "--anatomy-text": "#3d3d39", "--anatomy-strong": "#1b1b19", "--anatomy-muted": "#66665f" } }, light: { base: "light", tokens: { "--anatomy-card": "#fbfbfa", "--anatomy-paper": "#fbfbfa", "--anatomy-face": "#ffffff", "--anatomy-top": "#ffffff", "--anatomy-shade-0": "#dcdcd9", "--anatomy-shade-1": "#e5e5e2", "--anatomy-shade-2": "#ededea", "--anatomy-shade-3": "#f4f4f1", "--anatomy-lit-top": "#ffffff", "--anatomy-lit-shade": "#eeeeeb", "--anatomy-hi": "#26262a", "--anatomy-mid": "#8a8a8f", "--anatomy-lo": "#b4b4b8", "--anatomy-faint": "#d4d4d6", "--anatomy-lit": "#000000", "--anatomy-text": "#57575a", "--anatomy-strong": "#18181a", "--anatomy-muted": "#8c8c90" } }, dark: { base: "dark", tokens: { "--anatomy-card": "#131313", "--anatomy-paper": "#131313", "--anatomy-face": "#1b1b1b", "--anatomy-top": "#1c1c1c", "--anatomy-shade-0": "#0f0f0f", "--anatomy-shade-1": "#121212", "--anatomy-shade-2": "#151515", "--anatomy-shade-3": "#181818", "--anatomy-lit-top": "#262626", "--anatomy-lit-shade": "#1d1d1d", "--anatomy-hi": "#d4d4d4", "--anatomy-mid": "#6a6a6a", "--anatomy-lo": "#3e3e3e", "--anatomy-faint": "#2a2a2a", "--anatomy-lit": "#ffffff", "--anatomy-text": "#a3a3a3", "--anatomy-strong": "#e6e6e6", "--anatomy-muted": "#6e6e6e" } }, blueprint: { base: "dark", tokens: { "--anatomy-card": "#1f3f73", "--anatomy-paper": "#1f3f73", "--anatomy-face": "#26497f", "--anatomy-top": "#294d85", "--anatomy-shade-0": "#1a3563", "--anatomy-shade-1": "#1d3a6b", "--anatomy-shade-2": "#204073", "--anatomy-shade-3": "#23457b", "--anatomy-lit-top": "#335a96", "--anatomy-lit-shade": "#2a4f89", "--anatomy-hi": "#e8f0ff", "--anatomy-mid": "#8fa8d1", "--anatomy-lo": "#5a77a6", "--anatomy-faint": "#3b5a8a", "--anatomy-lit": "#ffffff", "--anatomy-text": "#b8c8e6", "--anatomy-strong": "#ffffff", "--anatomy-muted": "#7f96bf" } }, sepia: { base: "light", tokens: { "--anatomy-card": "#efe4cf", "--anatomy-paper": "#efe4cf", "--anatomy-face": "#faf3e6", "--anatomy-top": "#fdf8ee", "--anatomy-shade-0": "#d9c7a6", "--anatomy-shade-1": "#e2d2b4", "--anatomy-shade-2": "#e9dcc2", "--anatomy-shade-3": "#f0e6d1", "--anatomy-lit-top": "#fffaf0", "--anatomy-lit-shade": "#f3ead8", "--anatomy-hi": "#3b2a17", "--anatomy-mid": "#8c7356", "--anatomy-lo": "#b9a17f", "--anatomy-faint": "#d8c6a6", "--anatomy-lit": "#7a2e0e", "--anatomy-text": "#6b5940", "--anatomy-strong": "#2b1d0e", "--anatomy-muted": "#9a8668" } } };
var c = "dark";
function r(a, t) {
  let o = t && typeof t == "object" ? t : {};
  if (a && typeof a == "object") {
    let f = a.base === "light" ? "light" : "dark", m = a.tokens && typeof a.tokens == "object" ? a.tokens : a, y2 = Object.fromEntries(Object.entries(m).filter(([d]) => d.startsWith("--")));
    return { base: f, tokens: { ...n[f].tokens, ...y2, ...o } };
  }
  let e = n[a] ?? n[c];
  return { base: e.base, tokens: { ...e.tokens, ...o } };
}

export {
  O,
  P,
  Z,
  J,
  y,
  Q,
  V,
  B,
  tt,
  G,
  at,
  H,
  st,
  et,
  lt,
  ct,
  dt,
  nt,
  ht,
  yt,
  gt,
  $t,
  E,
  i,
  r
};
