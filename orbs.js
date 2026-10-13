import { MODE_FRAMES, paintFrame, resolvePreset } from "https://esm.sh/thinking-orbs@0.3.2/engine";

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var nodes = [];
var raf = 0;
var t0 = performance.now();

function lightCard(canvas) {
    var card = canvas.closest(".pick a");
    return !!(card && card.getAttribute("aria-current") === "page");
}

function draw(item, t) {
    var ctx = item.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);
    ctx.setTransform(item.dpr * item.scale, 0, 0, item.dpr * item.scale, 0, 0);
    try {
        paintFrame(ctx, item.frame(item.logical, t * item.speed, item.opts), !lightCard(item.canvas));
    } catch (err) {
        item.on = false;
        console.error(err);
    }
}

function tick(now) {
    var t = reduced ? 0.42 : (now - t0) / 1000;
    var any = false;
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].on) continue;
        any = true;
        draw(nodes[i], t);
    }
    raf = any && !reduced ? requestAnimationFrame(tick) : 0;
}

function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
}

function mount(canvas) {
    var logical = canvas.dataset.size === "20" ? 20 : 64;
    var display = Number(canvas.dataset.display) || logical;
    var preset = resolvePreset(canvas.dataset.orb || "working", logical);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(display * dpr);
    canvas.height = Math.round(display * dpr);
    canvas.style.width = display + "px";
    canvas.style.height = display + "px";
    var item = {
        canvas: canvas,
        ctx: canvas.getContext("2d"),
        logical: logical,
        display: display,
        dpr: dpr,
        scale: display / logical,
        frame: MODE_FRAMES[preset.mode],
        speed: preset.speed,
        opts: preset.opts,
        on: true
    };
    nodes.push(item);
    draw(item, reduced ? 0.42 : 0.2);
    kick();
    if (!("IntersectionObserver" in window)) return;
    var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            item.on = entry.isIntersecting;
            if (item.on) kick();
        });
    }, { threshold: 0 });
    seen.observe(canvas);
}

document.querySelectorAll("canvas.orb").forEach(mount);
