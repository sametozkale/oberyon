(function () {
    const shots = document.querySelector(".shots");
    const footer = document.querySelector(".site-footer");
    if (shots && footer) {
        let frame = 0;

        function placeShots() {
            frame = 0;
            const left = shots.getBoundingClientRect().left;
            const height = shots.offsetHeight;
            const centered = (window.innerHeight - height) / 2;
            const limit = footer.getBoundingClientRect().top - left - height;
            const shift = Math.min(0, limit - centered);
            shots.style.transform = shift < -0.5
                ? "translateY(calc(-50% + " + shift.toFixed(2) + "px))"
                : "";
        }

        function scheduleShots() {
            if (frame) return;
            frame = window.requestAnimationFrame(placeShots);
        }

        window.addEventListener("scroll", scheduleShots, { passive: true });
        window.addEventListener("resize", scheduleShots);
        placeShots();
    }

    const stage = document.querySelector(".shot-stage");
    const lines = Array.from(document.querySelectorAll(".shot-line"));
    const card = document.querySelector(".shot-card");
    const frame = card && card.querySelector(".shot-frame");
    const preview = card && card.querySelector(".shot-rest");
    if (!shots || !stage || !lines.length || !card || !preview) return;

    const works = [
  {
    "name": "Design work 0.1",
    "src": "portfolio/full/D-0.1.webp",
    "card": "portfolio/card/D-0.1.webp"
  },
  {
    "name": "Design work 0.2",
    "src": "portfolio/full/D-0.2.webp",
    "card": "portfolio/card/D-0.2.webp"
  },
  {
    "name": "Design work 0.3",
    "src": "portfolio/full/D-0.3.webp",
    "card": "portfolio/card/D-0.3.webp"
  },
  {
    "name": "Design work 0.4",
    "src": "portfolio/full/D-0.4.webp",
    "card": "portfolio/card/D-0.4.webp"
  },
  {
    "name": "Design work 1",
    "src": "portfolio/full/D-1.webp",
    "card": "portfolio/card/D-1.webp"
  },
  {
    "name": "Design work 2",
    "src": "portfolio/full/D-2.webp",
    "card": "portfolio/card/D-2.webp"
  },
  {
    "name": "Design work 3",
    "src": "portfolio/full/D-3.webp",
    "card": "portfolio/card/D-3.webp"
  },
  {
    "name": "Design work 4",
    "src": "portfolio/full/D-4.webp",
    "card": "portfolio/card/D-4.webp"
  },
  {
    "name": "Design work 5",
    "src": "portfolio/full/D-5.webp",
    "card": "portfolio/card/D-5.webp"
  },
  {
    "name": "Design work 6",
    "src": "portfolio/full/D-6.webp",
    "card": "portfolio/card/D-6.webp"
  },
  {
    "name": "Design work 7",
    "src": "portfolio/full/D-7.webp",
    "card": "portfolio/card/D-7.webp"
  },
  {
    "name": "Design work 8",
    "src": "portfolio/full/D-8.webp",
    "card": "portfolio/card/D-8.webp"
  },
  {
    "name": "Design work 9",
    "src": "portfolio/full/D-9.webp",
    "card": "portfolio/card/D-9.webp"
  },
  {
    "name": "Design work 10",
    "src": "portfolio/full/D-10.webp",
    "card": "portfolio/card/D-10.webp"
  },
  {
    "name": "Design work 11",
    "src": "portfolio/full/D-11.webp",
    "card": "portfolio/card/D-11.webp"
  },
  {
    "name": "Design work 12",
    "src": "portfolio/full/D-12.webp",
    "card": "portfolio/card/D-12.webp"
  },
  {
    "name": "Design work 13",
    "src": "portfolio/full/D-13.webp",
    "card": "portfolio/card/D-13.webp"
  },
  {
    "name": "Design work 14",
    "src": "portfolio/full/D-14.webp",
    "card": "portfolio/card/D-14.webp"
  },
  {
    "name": "Design work 15",
    "src": "portfolio/full/D-15.webp",
    "card": "portfolio/card/D-15.webp"
  },
  {
    "name": "Component work 1",
    "src": "portfolio/full/C-1.webp",
    "card": "portfolio/card/C-1.webp"
  },
  {
    "name": "Component work 2",
    "src": "portfolio/full/C-2.webp",
    "card": "portfolio/card/C-2.webp"
  },
  {
    "name": "Component work 3",
    "src": "portfolio/full/C-3.webp",
    "card": "portfolio/card/C-3.webp"
  },
  {
    "name": "Component work 4",
    "src": "portfolio/full/C-4.webp",
    "card": "portfolio/card/C-4.webp"
  },
  {
    "name": "Component work 5",
    "src": "portfolio/full/C-5.webp",
    "card": "portfolio/card/C-5.webp"
  },
  {
    "name": "Component work 6",
    "src": "portfolio/full/C-6.webp",
    "card": "portfolio/card/C-6.webp"
  },
  {
    "name": "Component work 7",
    "src": "portfolio/full/C-7.webp",
    "card": "portfolio/card/C-7.webp"
  },
  {
    "name": "Component work 8",
    "src": "portfolio/full/C-8.webp",
    "card": "portfolio/card/C-8.webp"
  },
  {
    "name": "Component work 9",
    "src": "portfolio/full/C-9.webp",
    "card": "portfolio/card/C-9.webp"
  },
  {
    "name": "Component work 10",
    "src": "portfolio/full/C-10.webp",
    "card": "portfolio/card/C-10.webp"
  },
  {
    "name": "Component work 11",
    "src": "portfolio/full/C-11.webp",
    "card": "portfolio/card/C-11.webp"
  },
  {
    "name": "Component work 12",
    "src": "portfolio/full/C-12.webp",
    "card": "portfolio/card/C-12.webp"
  },
  {
    "name": "Component work 13",
    "src": "portfolio/full/C-13.webp",
    "card": "portfolio/card/C-13.webp"
  },
  {
    "name": "Component work 14",
    "src": "portfolio/full/C-14.webp",
    "card": "portfolio/card/C-14.webp"
  },
  {
    "name": "Component work 15",
    "src": "portfolio/full/C-15.webp",
    "card": "portfolio/card/C-15.webp"
  },
  {
    "name": "Component work 16",
    "src": "portfolio/full/C-16.webp",
    "card": "portfolio/card/C-16.webp"
  },
  {
    "name": "Component work 17",
    "src": "portfolio/full/C-17.webp",
    "card": "portfolio/card/C-17.webp"
  },
  {
    "name": "Component work 18",
    "src": "portfolio/full/C-18.webp",
    "card": "portfolio/card/C-18.webp"
  },
  {
    "name": "Website work 1",
    "src": "portfolio/full/W-1.webp",
    "card": "portfolio/card/W-1.webp"
  },
  {
    "name": "Website work 2",
    "src": "portfolio/full/W-2.webp",
    "card": "portfolio/card/W-2.webp"
  },
  {
    "name": "Website work 3",
    "src": "portfolio/full/W-3.webp",
    "card": "portfolio/card/W-3.webp"
  },
  {
    "name": "Website work 4",
    "src": "portfolio/full/W-4.webp",
    "card": "portfolio/card/W-4.webp"
  },
  {
    "name": "Website work 5",
    "src": "portfolio/full/W-5.webp",
    "card": "portfolio/card/W-5.webp"
  },
  {
    "name": "Website work 6",
    "src": "portfolio/full/W-6.webp",
    "card": "portfolio/card/W-6.webp"
  },
  {
    "name": "Website work 7",
    "src": "portfolio/full/W-7.webp",
    "card": "portfolio/card/W-7.webp"
  },
  {
    "name": "Website work 8",
    "src": "portfolio/full/W-8.webp",
    "card": "portfolio/card/W-8.webp"
  },
  {
    "name": "Website work 9",
    "src": "portfolio/full/W-9.webp",
    "card": "portfolio/card/W-9.webp"
  },
  {
    "name": "Website work 10",
    "src": "portfolio/full/W-10.webp",
    "card": "portfolio/card/W-10.webp"
  },
  {
    "name": "Website work 11",
    "src": "portfolio/full/W-11.webp",
    "card": "portfolio/card/W-11.webp"
  },
  {
    "name": "Website work 12",
    "src": "portfolio/full/W-12.webp",
    "card": "portfolio/card/W-12.webp"
  },
  {
    "name": "Website work 13",
    "src": "portfolio/full/W-13.webp",
    "card": "portfolio/card/W-13.webp"
  },
  {
    "name": "Website work 14",
    "src": "portfolio/full/W-14.webp",
    "card": "portfolio/card/W-14.webp"
  },
  {
    "name": "Mues AI Logo",
    "src": "portfolio/full/Mues-AI-Logo.webp",
    "card": "portfolio/card/Mues-AI-Logo.webp"
  },
  {
    "name": "Producter Logo",
    "src": "portfolio/full/Producter-Logo.webp",
    "card": "portfolio/card/Producter-Logo.webp"
  },
  {
    "name": "Roadmape Logo",
    "src": "portfolio/full/Roadmape-Logo.webp",
    "card": "portfolio/card/Roadmape-Logo.webp"
  },
  {
    "name": "Fussionary Logo",
    "src": "portfolio/full/Fussionary-Logo.webp",
    "card": "portfolio/card/Fussionary-Logo.webp"
  },
  {
    "name": "Oberyon Logo",
    "src": "portfolio/full/Oberyon-Logo.webp",
    "card": "portfolio/card/Oberyon-Logo.webp"
  }
];
    const rig = stage.querySelector(".hall-rig");
    const back = stage.querySelector(".hall-back");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rest = 8;
    const peak = 32;

    let cam = 80;
    let hallOrigin = 0;
    let windowStart = -1;
    let pointer = null;
    let lastFocus = null;
    let hot = -1;
    let shown = 0;
    let painted = -1;
    let front = null;
    let settling = false;
    let queued = null;
    let settleTimers = [];

    function metric(name, fallback) {
        return parseFloat(getComputedStyle(stage).getPropertyValue(name)) || fallback;
    }

    function shelfOf(card) {
        const side = Number(card.style.getPropertyValue("--side"));
        const index = Number(card.style.getPropertyValue("--i"));
        return {
            x: side * metric("--lane", 470),
            z: -index * metric("--gap", 470),
            turn: side * -metric("--yaw", 58)
        };
    }

    function writePose(card, pose) {
        card.style.setProperty("--hall-x", pose.x + "px");
        card.style.setProperty("--hall-z", pose.z + "px");
        card.style.setProperty("--hall-turn", pose.turn + "deg");
    }

    function clearSettle() {
        settleTimers.forEach(function (id) { window.clearTimeout(id); });
        settleTimers = [];
    }

    function later(fn, ms) {
        const id = window.setTimeout(fn, ms);
        settleTimers.push(id);
    }

    function sameSide(card) {
        const side = card.style.getPropertyValue("--side");
        const index = Number(card.style.getPropertyValue("--i"));
        const prev = [];
        const next = [];
        const ahead = [];
        rig.querySelectorAll(".hall-card").forEach(function (other) {
            if (other === card || other.style.getPropertyValue("--side") !== side) return;
            const i = Number(other.style.getPropertyValue("--i"));
            if (i === index - 1) prev.push(other);
            else if (i === index + 1) next.push(other);
            else if (i < index) ahead.push(other);
        });
        return { prev: prev, next: next, ahead: ahead };
    }

    function finishReturn(card, parted) {
        restoreSlot(card);
        parted.forEach(function (other) {
            writePose(other, shelfOf(other));
        });
        card.classList.remove("is-front", "is-returning");
        stage.classList.remove("is-viewing");
        front = null;
        later(function () {
            parted.forEach(function (other) { other.classList.remove("is-parting"); });
            stage.classList.remove("is-settling");
            settling = false;
            kickFades();
            const next = queued;
            queued = null;
            if (next && next.isConnected) present(next);
        }, reduced ? 0 : 480);
    }

    function shelve() {
        if (!front || settling) return;
        window.clearTimeout(navTimer);
        nav.classList.add("is-out");
        const card = front;
        const shelf = shelfOf(card);
        const side = Number(card.style.getPropertyValue("--side"));
        const openZ = metric("--gap", 470) * 0.22;
        const openX = side * metric("--lane", 470) * 0.36;
        const group = sameSide(card);
        const parted = group.prev.concat(group.next, group.ahead);
        settling = true;
        stage.classList.add("is-settling");
        card.classList.add("is-returning");
        parted.forEach(function (other) { other.classList.add("is-parting"); });
        group.prev.forEach(function (other) {
            const pose = shelfOf(other);
            writePose(other, { x: pose.x + openX, z: pose.z + openZ, turn: pose.turn });
        });
        group.next.forEach(function (other) {
            const pose = shelfOf(other);
            writePose(other, { x: pose.x + openX, z: pose.z - openZ * 1.6, turn: pose.turn });
        });
        group.ahead.forEach(function (other) {
            const pose = shelfOf(other);
            writePose(other, { x: pose.x + openX, z: pose.z, turn: pose.turn });
        });
        if (reduced) {
            writePose(card, shelf);
            finishReturn(card, parted);
            return;
        }
        later(function () {
            writePose(card, {
                x: 0,
                z: shelf.z,
                turn: shelf.turn * 0.45
            });
        }, 220);
        later(function () {
            writePose(card, shelf);
        }, 820);
        later(function () {
            finishReturn(card, parted);
        }, 1400);
    }

    function present(card) {
        if (!card) return;
        if (settling) {
            queued = card === front ? null : card;
            return;
        }
        if (front === card) {
            shelve();
            return;
        }
        if (front) {
            queued = card;
            shelve();
            return;
        }
        front = card;
        clearRaise();
        const img = card.querySelector("img");
        slotSrc = img.dataset.src || "";
        useOriginal(img);
        writePose(card, {
            x: 0,
            z: 240 - cam,
            turn: 0
        });
        card.classList.add("is-front");
        card.style.setProperty("--fade", "1");
        stage.classList.add("is-viewing");
        armNav();
    }

    function gap() {
        return parseFloat(getComputedStyle(stage).getPropertyValue("--gap")) || 292;
    }

    function depthCount() {
        return Math.ceil(works.length / 2);
    }

    function setCam(next) {
        if (front) return;
        const max = Math.max(0, (depthCount() - 1) * gap() - 40);
        cam = Math.min(max, Math.max(-30, next));
        rig.style.setProperty("--cam", cam + "px");
        placeWindow(false);
        kickFades();
    }

    function fadeFor(index) {
        const g = gap();
        const ahead = index * g - cam;
        const near = g * 2.4;
        const far = g * 6.6;
        if (ahead <= near) return 1;
        const t = Math.min(1, (ahead - near) / (far - near));
        const s = t * t * (3 - 2 * t);
        return 1 - s * 0.84;
    }

    let fadeJob = 0;
    let fadeStamp = 0;

    function paintFades(now) {
        fadeJob = 0;
        if (stage.hidden || front || settling) return;
        const prev = fadeStamp || now;
        fadeStamp = now;
        const dt = Math.min(48, Math.max(0, now - prev));
        const glide = stage.classList.contains("is-drag") || reduced ? 1 : 1 - Math.pow(0.002, dt / 520);
        let live = false;
        pool.forEach(function (figure) {
            if (figure.hidden || figure.classList.contains("is-front")) return;
            const index = Number(figure.style.getPropertyValue("--i"));
            const target = fadeFor(index);
            const current = parseFloat(figure.style.getPropertyValue("--fade"));
            const base = Number.isFinite(current) ? current : target;
            const next = Math.abs(target - base) < 0.004 ? target : base + (target - base) * glide;
            if (Math.abs(next - target) > 0.004) live = true;
            figure.style.setProperty("--fade", next.toFixed(4));
        });
        if (live) fadeJob = window.requestAnimationFrame(paintFades);
        else fadeStamp = 0;
    }

    function kickFades() {
        if (stage.hidden || front || settling) return;
        if (!fadeJob) fadeJob = window.requestAnimationFrame(paintFades);
    }

    const SPAN = 8;
    const pool = [];

    function cardFigure(side) {
        const figure = document.createElement("figure");
        figure.className = "hall-card is-live " + (side === "-1" ? "is-left" : "is-right");
        figure.style.setProperty("--side", side);
        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        const select = document.createElement("span");
        select.className = "hall-select";
        select.setAttribute("aria-hidden", "true");
        for (let n = 0; n < 4; n += 1) select.append(document.createElement("i"));
        figure.append(img, select);
        return figure;
    }

    function holdFrame(img) {
        const current = img.currentSrc || img.getAttribute("src");
        if (!current) return;
        img.style.backgroundImage = "url(\"" + current.replace(/"/g, "%22") + "\")";
    }

    function swapWhenReady(img, url) {
        if (!img || !url || img.getAttribute("src") === url) return;
        const token = String((Number(img.dataset.swap) || 0) + 1);
        img.dataset.swap = token;
        holdFrame(img);
        const probe = new Image();
        probe.decoding = "async";
        probe.src = url;
        function apply() {
            if (!img.isConnected || img.dataset.swap !== token) return;
            holdFrame(img);
            if (img.getAttribute("src") !== url) img.src = url;
        }
        if (probe.complete && probe.naturalWidth) apply();
        else probe.decode().then(apply, apply);
    }

    function showWork(img, work, near) {
        img.alt = work.name;
        const url = near ? work.src : (work.card || work.src);
        const same = img.dataset.src === work.src && img.getAttribute("src");
        if (same && (img.dataset.full === "1" || !near)) return;
        img.dataset.src = work.src;
        img.dataset.full = near ? "1" : "0";
        swapWhenReady(img, url);
    }

    function useOriginal(img) {
        const src = img && img.dataset.src;
        if (!src) return;
        img.dataset.full = "1";
        swapWhenReady(img, src);
    }

    let slotSrc = "";

    function restoreSlot(card) {
        if (!slotSrc) return;
        const src = slotSrc;
        slotSrc = "";
        const work = works.find(function (item) { return item.src === src; });
        const img = card.querySelector("img");
        if (!work || !img) return;
        img.alt = work.name;
        img.dataset.src = work.src;
        img.dataset.full = "1";
        swapWhenReady(img, work.src);
    }

    function stepFront(dir) {
        if (!front || settling) return;
        const img = front.querySelector("img");
        let index = works.findIndex(function (item) { return item.src === img.dataset.src; });
        if (index < 0) index = 0;
        const work = works[(index + dir + works.length) % works.length];
        img.alt = work.name;
        img.dataset.src = work.src;
        img.dataset.full = "1";
        stage.setAttribute("aria-label", work.name);
        swapWhenReady(img, work.src);
    }

    const nav = stage.querySelector(".hall-nav");
    const prevBtn = nav.querySelector(".hall-prev");
    const nextBtn = nav.querySelector(".hall-next");
    let navTimer = 0;

    function navReady() {
        return front && !settling && !front.classList.contains("is-returning") && stage.classList.contains("is-viewing");
    }

    function pinNav() {
        if (!navReady()) return false;
        const box = front.getBoundingClientRect();
        const host = stage.getBoundingClientRect();
        if (box.width < 2) return false;
        nav.style.left = (box.left - host.left + box.width / 2) + "px";
        nav.style.top = Math.min(box.bottom - host.top + 16, host.height - 62) + "px";
        nav.style.transform = "translateX(-50%)";
        return true;
    }

    function showNav() {
        if (!pinNav()) return;
        nav.hidden = false;
        if (!nav.classList.contains("is-out")) return;
        window.requestAnimationFrame(function () {
            if (!navReady()) return;
            nav.classList.remove("is-out");
        });
    }

    function armNav() {
        window.clearTimeout(navTimer);
        nav.classList.add("is-out");
        if (reduced) {
            showNav();
            return;
        }
        navTimer = window.setTimeout(showNav, 1200);
    }

    stage.addEventListener("transitionend", function (event) {
        if (event.propertyName !== "--hall-z" || event.target !== front || !navReady()) return;
        window.clearTimeout(navTimer);
        showNav();
    });

    prevBtn.addEventListener("pointerdown", function (event) { event.stopPropagation(); });
    nextBtn.addEventListener("pointerdown", function (event) { event.stopPropagation(); });
    prevBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        if (view === "sphere" && focused >= 0) stepLit(-1);
        else stepFront(-1);
    });
    nextBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        if (view === "sphere" && focused >= 0) stepLit(1);
        else stepFront(1);
    });
    window.addEventListener("resize", function () {
        if (nav.classList.contains("is-out")) return;
        pinNav();
    });

    function ensurePool() {
        while (pool.length < SPAN * 2) {
            const side = pool.length % 2 === 0 ? "-1" : "1";
            const figure = cardFigure(side);
            rig.append(figure);
            pool.push(figure);
        }
    }

    function placeWindow(force) {
        const depth = depthCount();
        const g = gap();
        let start = Math.max(0, Math.floor((cam - 420) / g) - 1);
        if (start + SPAN > depth) start = Math.max(0, depth - SPAN);
        if (!force && start === windowStart) return;
        windowStart = start;
        clearRaise();
        ensurePool();
        const count = works.length;
        const steps = depth;
        const shownFade = new Map();
        pool.forEach(function (figure) {
            if (!figure.hidden) {
                const key = figure.style.getPropertyValue("--i") + ":" + figure.style.getPropertyValue("--side");
                const fade = parseFloat(figure.style.getPropertyValue("--fade"));
                if (Number.isFinite(fade)) shownFade.set(key, fade);
            }
            figure.classList.add("is-instant");
        });
        for (let n = 0; n < SPAN; n += 1) {
            const step = start + n;
            const fade = fadeFor(step);
            const left = works[(hallOrigin + step) % count];
            const rightWork = works[(hallOrigin + steps + step) % count];
            [left, rightWork].forEach(function (work, lane) {
                const figure = pool[n * 2 + lane];
                const duplicate = lane === 1 && rightWork === left;
                const visible = step < depth && !duplicate && fade > 0.04;
                figure.hidden = !visible;
                if (!visible) return;
                const side = lane === 0 ? "-1" : "1";
                figure.classList.toggle("is-left", side === "-1");
                figure.classList.toggle("is-right", side === "1");
                figure.style.setProperty("--side", side);
                figure.style.setProperty("--i", String(step));
                const carried = shownFade.get(String(step) + ":" + side);
                figure.style.setProperty("--fade", (Number.isFinite(carried) ? carried : fade).toFixed(4));
                writePose(figure, shelfOf(figure));
                showWork(figure.querySelector("img"), work, n < 3);
            });
        }
        rig.getBoundingClientRect();
        pool.forEach(function (figure) { figure.classList.remove("is-instant"); });
    }

    let fullWarmed = false;

    function warmFull() {
        if (fullWarmed) return;
        fullWarmed = true;
        let index = 0;
        function step() {
            const end = Math.min(works.length, index + 2);
            for (; index < end; index += 1) {
                const img = new Image();
                img.decoding = "async";
                img.src = works[index].src;
            }
            if (index < works.length) window.setTimeout(step, 70);
        }
        step();
    }

    function open(i) {
        const wasClosed = stage.hidden;
        clearSettle();
        settling = false;
        queued = null;
        front = null;
        stage.classList.remove("is-viewing", "is-settling");
        stage.hidden = false;
        hallOrigin = i;
        windowStart = -1;
        rig.style.transition = "none";
        setCam(140);
        document.body.classList.add("is-shot");
        if (wasClosed) lastFocus = document.activeElement;
        rig.getBoundingClientRect();
        rig.style.transition = reduced ? "none" : "";
        stage.focus();
        warmFull();
        if (view === "sphere" || view === "grid") {
            stage.classList.add("is-sphere");
            setGrid(view === "grid");
            bootSphere();
        }
        placeThumb(wasClosed);
    }

    function close() {
        if (stage.hidden) return;
        clearSettle();
        settling = false;
        queued = null;
        front = null;
        stage.classList.remove("is-viewing", "is-settling");
        windowStart = -1;
        stage.classList.remove("is-aimed");
        clearRaise();
        window.clearTimeout(navTimer);
        nav.classList.add("is-out");
        nav.hidden = true;
        slotSrc = "";
        stage.hidden = true;
        document.body.classList.remove("is-shot");
        pointer = null;
        stage.classList.remove("is-drag");
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    let origin = 0;
    const widths = lines.map(function () { return rest; });
    let widthJob = 0;
    let follow = -1;
    let edgeFrame = 0;
    let edgeStamp = 0;
    let edgeHeld = false;

    function widthFor(distance) {
        return Math.max(rest, peak - distance * 4);
    }

    function nearestLine(clientY) {
        let best = 0;
        let bestDist = Infinity;
        lines.forEach(function (line, index) {
            const box = line.getBoundingClientRect();
            const mid = box.top + box.height / 2;
            const distance = Math.abs(clientY - mid);
            if (distance < bestDist) {
                bestDist = distance;
                best = index;
            }
        });
        return best;
    }

    function imageFor(line) {
        return (origin + line + works.length) % works.length;
    }

    function tickWidths() {
        let live = false;
        const ease = reduced ? 1 : 0.16;
        lines.forEach(function (line, i) {
            const distance = follow < 0 ? null : Math.abs(i - follow);
            const goal = distance === null ? rest : widthFor(distance);
            const next = Math.abs(goal - widths[i]) < 0.12 ? goal : widths[i] + (goal - widths[i]) * ease;
            if (next !== widths[i]) {
                widths[i] = next;
                line.style.width = next.toFixed(2) + "px";
            }
            line.classList.toggle("is-peak", follow === i);
            if (Math.abs(next - goal) > 0.12) live = true;
        });
        widthJob = live ? window.requestAnimationFrame(tickWidths) : 0;
    }

    function followLine(index) {
        follow = index;
        if (!widthJob) widthJob = window.requestAnimationFrame(tickWidths);
    }

    function placeCard(index, jump) {
        const rail = shots.getBoundingClientRect();
        const box = lines[index].getBoundingClientRect();
        const top = (box.top + box.height / 2 - rail.top) + "px";
        if (jump) {
            card.style.transition = "none";
            card.style.top = top;
            card.getBoundingClientRect();
            card.style.transition = "";
            return;
        }
        card.style.top = top;
    }

    function paint() {
        const work = works[shown];
        if (!work) return;
        if (painted !== shown) {
            preview.src = work.card || work.src;
            preview.alt = work.name;
            frame.setAttribute("aria-label", "Open " + work.name);
            painted = shown;
        }
        lines.forEach(function (line, i) {
            line.setAttribute("aria-label", works[imageFor(i)].name);
        });
    }

    function stopEdge() {
        if (edgeFrame) window.cancelAnimationFrame(edgeFrame);
        edgeFrame = 0;
        edgeStamp = 0;
        edgeHeld = false;
    }

    function edgeLoop(now) {
        edgeFrame = 0;
        if (hot !== 0 && hot !== lines.length - 1) return;
        if (!edgeStamp) edgeStamp = now;
        const wait = edgeHeld ? 340 : 260;
        if (now - edgeStamp >= wait) {
            origin = (origin + (hot === 0 ? -1 : 1) + works.length) % works.length;
            shown = imageFor(hot);
            edgeStamp = now;
            edgeHeld = true;
            paint();
        }
        edgeFrame = window.requestAnimationFrame(edgeLoop);
    }

    function startEdge() {
        edgeHeld = false;
        edgeStamp = 0;
        if (!edgeFrame) edgeFrame = window.requestAnimationFrame(edgeLoop);
    }

    function engage(clientY) {
        const index = nearestLine(clientY);
        if (index === hot) return;
        const first = !shots.classList.contains("is-hot");
        hot = index;
        shown = imageFor(index);
        placeCard(index, first);
        shots.classList.add("is-hot");
        followLine(index);
        paint();
        if (index === 0 || index === lines.length - 1) startEdge();
        else stopEdge();
    }

    function release() {
        hot = -1;
        shots.classList.remove("is-hot");
        followLine(-1);
        stopEdge();
    }

    function insidePreview(x, y) {
        if (shots.classList.contains("is-hot")) {
            const box = card.getBoundingClientRect();
            const rail = shots.getBoundingClientRect();
            const left = Math.min(rail.right, box.left) - 8;
            if (x >= left && x <= box.right + 10 && y >= box.top - 10 && y <= box.bottom + 10) return "card";
        }
        const rail = shots.getBoundingClientRect();
        if (x >= rail.left - 16 && x <= rail.right + 10 && y >= rail.top - 24 && y <= rail.bottom + 24) return "rail";
        return "";
    }

    function track(event) {
        if (event.pointerType === "touch") return;
        const where = insidePreview(event.clientX, event.clientY);
        if (where === "card") return;
        if (where === "rail") engage(event.clientY);
        else if (shots.classList.contains("is-hot")) release();
    }

    shots.addEventListener("pointermove", track);
    window.addEventListener("pointermove", function (event) {
        if (!shots.classList.contains("is-hot")) return;
        track(event);
    });

    shots.addEventListener("pointerleave", function (event) {
        if (event.relatedTarget && shots.contains(event.relatedTarget)) return;
        if (insidePreview(event.clientX, event.clientY)) return;
        release();
    });

    lines.forEach(function (line) {
        line.addEventListener("focus", function () {
            const index = Number(line.getAttribute("data-line")) || 0;
            const first = !shots.classList.contains("is-hot");
            hot = index;
            shown = imageFor(index);
            placeCard(index, first);
            shots.classList.add("is-hot");
            followLine(index);
            paint();
        });
        line.addEventListener("click", function () {
            open(Math.round(shown));
        });
    });

    frame.addEventListener("click", function () {
        open(Math.round(shown));
    });

    back.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
    });

    back.addEventListener("click", function () {
        if (view === "sphere" || view === "grid") {
            if (focused >= 0) closeLit();
            else close();
            return;
        }
        if (front) shelve();
        else close();
    });

    let raised = null;

    function clearRaise() {
        rig.querySelectorAll(".is-raised, .is-aside-prev, .is-aside-next").forEach(function (el) {
            el.classList.remove("is-raised", "is-aside-prev", "is-aside-next");
        });
        raised = null;
    }

    function raise(card) {
        if (!card || card.hidden || front || settling || stage.classList.contains("is-drag") || stage.classList.contains("is-viewing")) return;
        if (raised === card) return;
        clearRaise();
        raised = card;
        card.classList.add("is-raised");
        const group = sameSide(card);
        group.prev.forEach(function (other) { other.classList.add("is-aside-prev"); });
        group.next.forEach(function (other) { other.classList.add("is-aside-next"); });
    }

    function stillOn(card, x, y) {
        const box = card.getBoundingClientRect();
        const pad = 36;
        return x >= box.left - pad && x <= box.right + pad && y >= box.top - pad && y <= box.bottom + pad;
    }

    stage.addEventListener("pointermove", function (event) {
        if (view === "sphere" || pointer || front || settling || stage.classList.contains("is-drag")) return;
        const hit = event.target.closest && event.target.closest(".hall-card");
        if (hit && !hit.hidden) {
            stage.classList.add("is-aimed");
            raise(hit);
            return;
        }
        if (raised && stillOn(raised, event.clientX, event.clientY)) return;
        clearRaise();
        stage.classList.remove("is-aimed");
    });

    stage.addEventListener("pointerleave", function () {
        if (view === "sphere") return;
        clearRaise();
        stage.classList.remove("is-aimed");
    });

    stage.addEventListener("pointerdown", function (event) {
        if (view === "sphere") return;
        if (event.button !== 0) return;
        if (event.target.closest(".hall-nav") || event.target.closest(".hall-back") || event.target.closest(".view-switch")) return;
        pointer = { id: event.pointerId, x: event.clientX, cam: cam };
        stage.setPointerCapture(event.pointerId);
        stage.classList.add("is-drag");
    });

    stage.addEventListener("pointermove", function (event) {
        if (view === "sphere" || !pointer || pointer.id !== event.pointerId) return;
        setCam(pointer.cam + (event.clientX - pointer.x) * 1.35);
    });

    function endPointer(event) {
        if (view === "sphere" || !pointer || pointer.id !== event.pointerId) return;
        const moved = Math.abs(event.clientX - pointer.x);
        pointer = null;
        stage.classList.remove("is-drag");
        if (moved >= 6) {
            clearRaise();
            stage.classList.remove("is-aimed");
        }
        if (moved < 6) {
            const hit = document.elementFromPoint(event.clientX, event.clientY);
            const card = hit && hit.closest(".hall-card");
            if (hit && (hit.closest(".hall-back") || hit.closest(".hall-nav"))) return;
            if (card) present(card);
            else if (front) shelve();
            else close();
        }
    }

    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);

    stage.addEventListener("wheel", function (event) {
        if (stage.hidden) return;
        if (view === "grid") {
            if (focused >= 0) return;
            event.preventDefault();
            reelAim = null;
            reelV += event.deltaY * 0.0015;
            kickReel();
            return;
        }
        if (view !== "hall") return;
        event.preventDefault();
        setCam(cam + event.deltaY * 0.85);
    }, { passive: false });

    document.addEventListener("keydown", function (event) {
        if (stage.hidden) return;
        if (view === "grid") {
            if (event.key === "Escape") {
                event.preventDefault();
                if (focused >= 0) closeLit();
                else close();
            } else if (focused >= 0 && (event.key === "ArrowRight" || event.key === "ArrowDown")) {
                event.preventDefault();
                stepLit(1);
            } else if (focused >= 0 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) {
                event.preventDefault();
                stepLit(-1);
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                nudgeReel(1);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                nudgeReel(-1);
            }
            return;
        }
        if (view === "sphere") {
            if (event.key === "Escape") {
                event.preventDefault();
                if (focused >= 0) closeLit();
                else close();
            } else if (focused >= 0 && (event.key === "ArrowRight" || event.key === "ArrowDown")) {
                event.preventDefault();
                stepLit(1);
            } else if (focused >= 0 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) {
                event.preventDefault();
                stepLit(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                turn(8, 0);
                velX = 0;
                velY = 0;
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                turn(-8, 0);
                velX = 0;
                velY = 0;
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                dolly = Math.min(1, dolly + 0.08);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                dolly = Math.max(0, dolly - 0.08);
            }
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            if (front) shelve();
            else close();
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            if (front) stepFront(1);
            else setCam(cam + gap());
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            if (front) stepFront(-1);
            else setCam(cam - gap());
        }
    });

    if (reduced) rig.style.transition = "none";

    const sphere = stage.querySelector(".sphere");
    const sphereStage = sphere.querySelector(".sphere-stage");
    const world = sphere.querySelector(".sphere-world");
    const orb = sphere.querySelector(".sphere-orb");
    const rows = sphere.querySelector(".sphere-rows");
    const lit = sphere.querySelector(".sphere-lit");
    const plate = sphere.querySelector(".sphere-plate");
    const litImg = plate.querySelector("img");
    let litAt = 0;
    const switcher = stage.querySelector(".view-switch");
    let view = "grid";
    let focused = -1;
    let sourceEl = null;
    let camZ = 0;
    let velX = 0;
    let velY = 0;
    let dolly = 0;
    let dragging = false;
    let radius = 280;
    let perspective = 1150;
    let laidW = 0;
    let laidH = 0;
    let raf = 0;
    let built = false;
    let gridBuilt = false;
    let ptr = null;
    const cards = [];
    const units = [];
    const tilt0 = -4 * Math.PI / 180;
    let R = [1, 0, 0, 0, Math.cos(tilt0), -Math.sin(tilt0), 0, Math.sin(tilt0), Math.cos(tilt0)];

    const golden = Math.PI * (3 - Math.sqrt(5));
    works.forEach(function (work, i) {
        const y = 1 - (2 * i + 1) / works.length;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const x = Math.cos(theta) * rad;
        const z = Math.sin(theta) * rad;
        units.push({
            x: x,
            y: y,
            z: z,
            cssX: x,
            cssY: -y,
            cssZ: z,
            lat: Math.asin(Math.max(-1, Math.min(1, y))) * 180 / Math.PI,
            lon: Math.atan2(x, z) * 180 / Math.PI,
            work: work
        });
    });

    let minChord = 2;
    for (let i = 0; i < units.length; i += 1) {
        for (let j = i + 1; j < units.length; j += 1) {
            const a = units[i];
            const b = units[j];
            const chord = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
            if (chord < minChord) minChord = chord;
        }
    }
    const minAngle = 2 * Math.asin(Math.min(1, minChord / 2));

    function cardFraction() {
        const reach = Math.hypot(0.5, 1 / 3);
        const half = minAngle * 0.82 / 2;
        return Math.tan(half) / reach;
    }

    function measureSphere(force) {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        if (!force && Math.abs(width - laidW) < 20 && Math.abs(height - laidH) < 20) return;
        laidW = width;
        laidH = height;
        const size = cardFraction();
        const bleed = 1 + size / 3;
        const padY = width <= 380 ? 36 : width <= 640 ? 44 : 64;
        const padX = width <= 640 ? 18 : 36;
        const fitH = (height * 0.5 - padY) / bleed;
        const fitW = (width * 0.5 - padX) / bleed;
        const floor = width <= 380 ? 96 : width <= 640 ? 112 : 140;
        radius = Math.max(floor, Math.min(440, fitH, fitW));
        perspective = width <= 380 ? 620 : width <= 640 ? 760 : width <= 900 ? 920 : 1150;
        const cw = Math.round(radius * cardFraction());
        sphere.style.setProperty("--persp", perspective + "px");
        sphere.style.setProperty("--cw", cw + "px");
        units.forEach(function (unit, i) {
            const card = cards[i];
            if (!card) return;
            card.style.transform = "rotateY(" + unit.lon.toFixed(3) + "deg) rotateX(" + unit.lat.toFixed(3) + "deg) translateZ(" + radius.toFixed(2) + "px)";
        });
    }

    function buildSphere() {
        if (built) return;
        built = true;
        const frag = document.createDocumentFragment();
        units.forEach(function (unit, i) {
            const card = document.createElement("div");
            card.className = "sphere-card";
            card.dataset.idx = String(i);
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.alt = unit.work.name;
            img.decoding = "async";
            img.addEventListener("load", function () { img.style.setProperty("--seen", "1"); });
            figure.append(img);
            card.append(figure);
            cards.push(card);
            frag.append(card);
        });
        orb.append(frag);
        measureSphere(true);
        let cursor = 0;
        function pump() {
            if (cursor >= cards.length) return;
            const end = Math.min(cards.length, cursor + 4);
            for (; cursor < end; cursor += 1) {
                const img = cards[cursor].querySelector("img");
                img.src = units[cursor].work.card || units[cursor].work.src;
            }
            window.setTimeout(pump, 40);
        }
        pump();
    }

    function cssRot(m) {
        return "matrix3d(" + m[0].toFixed(5) + "," + m[3].toFixed(5) + "," + m[6].toFixed(5) + ",0," + m[1].toFixed(5) + "," + m[4].toFixed(5) + "," + m[7].toFixed(5) + ",0," + m[2].toFixed(5) + "," + m[5].toFixed(5) + "," + m[8].toFixed(5) + ",0,0,0,0,1)";
    }

    function turn(yawDeg, pitchDeg) {
        if (!yawDeg && !pitchDeg) return;
        const yaw = yawDeg * Math.PI / 180;
        const pitch = pitchDeg * Math.PI / 180;
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const cx = Math.cos(pitch);
        const sx = Math.sin(pitch);
        const m00 = cy;
        const m01 = sy * sx;
        const m02 = sy * cx;
        const m11 = cx;
        const m12 = -sx;
        const m20 = -sy;
        const m21 = cy * sx;
        const m22 = cy * cx;
        const a = R;
        const x0 = m00 * a[0] + m01 * a[3] + m02 * a[6];
        const x1 = m00 * a[1] + m01 * a[4] + m02 * a[7];
        const x2 = m00 * a[2] + m01 * a[5] + m02 * a[8];
        const y0 = m11 * a[3] + m12 * a[6];
        const y1 = m11 * a[4] + m12 * a[7];
        const y2 = m11 * a[5] + m12 * a[8];
        let len = Math.hypot(x0, x1, x2) || 1;
        const nx0 = x0 / len;
        const nx1 = x1 / len;
        const nx2 = x2 / len;
        let ny0 = y0 - (y0 * nx0 + y1 * nx1 + y2 * nx2) * nx0;
        let ny1 = y1 - (y0 * nx0 + y1 * nx1 + y2 * nx2) * nx1;
        let ny2 = y2 - (y0 * nx0 + y1 * nx1 + y2 * nx2) * nx2;
        len = Math.hypot(ny0, ny1, ny2) || 1;
        ny0 /= len;
        ny1 /= len;
        ny2 /= len;
        R = [nx0, nx1, nx2, ny0, ny1, ny2, nx1 * ny2 - nx2 * ny1, nx2 * ny0 - nx0 * ny2, nx0 * ny1 - nx1 * ny0];
    }

    function paintSphere() {
        if (!dragging && focused < 0 && (velX || velY)) {
            turn(velX, velY);
            velX *= reduced ? 0 : 0.9;
            velY *= reduced ? 0 : 0.9;
            if (Math.abs(velX) < 0.012) velX = 0;
            if (Math.abs(velY) < 0.012) velY = 0;
        }
        const targetZ = dolly * Math.min(64, radius * 0.12);
        camZ += (targetZ - camZ) * 0.075;
        world.style.transform = "translateZ(" + camZ.toFixed(2) + "px) " + cssRot(R);
        stage.classList.toggle("is-deep", dolly > 0.12);
        const near = perspective * 0.66;
        const shade = 1 - Math.min(1, dolly * 1.6);
        units.forEach(function (unit, i) {
            const zf = R[6] * unit.cssX + R[7] * unit.cssY + R[8] * unit.cssZ;
            const light = Math.pow(Math.max(0, zf), 1.45);
            let fade = 1;
            const absZ = zf * radius + camZ;
            if (absZ > near) fade = Math.max(0, 1 - (absZ - near) / 190);
            let dim = shade * (1 - light) * 0.82;
            if (focused >= 0) {
                dim = Math.min(1, dim + 0.78);
                if (i === focused) fade = 0;
            }
            const card = cards[i];
            const seen = card.querySelector("img").style.getPropertyValue("--seen") === "1";
            const nextFade = (seen ? fade : 0);
            if (card._fade !== nextFade) {
                card._fade = nextFade;
                card.style.setProperty("--fade", nextFade.toFixed(3));
            }
            const nextLit = focused >= 0 ? 0 : light;
            if (card._lit !== nextLit) {
                card._lit = nextLit;
                card.style.setProperty("--lit", nextLit.toFixed(3));
            }
            const nextDim = dim;
            if (card._dim !== nextDim) {
                card._dim = nextDim;
                card.style.setProperty("--d", nextDim.toFixed(3));
            }
            const hit = nextFade < 0.08 ? "none" : "";
            if (card._hit !== hit) {
                card._hit = hit;
                card.style.pointerEvents = hit;
            }
        });
    }

    function sphereLoop() {
        if (stage.hidden || view !== "sphere") {
            raf = 0;
            return;
        }
        paintSphere();
        raf = window.requestAnimationFrame(sphereLoop);
    }

    function bootSphere() {
        buildSphere();
        measureSphere(false);
        sphere.hidden = false;
        window.requestAnimationFrame(function () { sphere.classList.add("is-in"); });
        paintSphere();
        if (!raf) raf = window.requestAnimationFrame(sphereLoop);
    }

    var reel = 0;
    var reelV = 0;
    var reelAim = null;
    var reelFrame = 0;
    var reelStamp = 0;
    var reelDrag = null;
    var reelSkipClick = false;

    function reelEase(t) {
        t = Math.max(0, Math.min(1, t));
        return t * t * (3 - 2 * t);
    }

    function reelMetrics() {
        var host = rows.clientHeight || window.innerHeight;
        var gap = 36;
        var neighbor = 0.68;
        var cardH = Math.round((host / 2 - gap) / ((1 + neighbor) / 2));
        var cardW = Math.round(cardH * 4 / 3);
        var maxW = Math.min(window.innerWidth * 0.9, 1040);
        if (cardW > maxW) {
            cardW = Math.round(maxW);
            cardH = Math.round(cardW * 0.75);
        }
        return {
            cardW: cardW,
            cardH: cardH,
            step: cardH * (1 + neighbor) / 2 + gap,
            neighbor: neighbor
        };
    }

    function paintReel() {
        var figs = rows.children;
        var n = figs.length;
        if (!n) return;
        var box = reelMetrics();
        for (var i = 0; i < n; i++) {
            var d = i - reel;
            d -= n * Math.round(d / n);
            var ad = Math.abs(d);
            var fig = figs[i];
            var scale = 1 - reelEase(Math.min(1, ad / 1.35)) * (1 - box.neighbor);
            var fade = ad < 0.72 ? 1 : 1 - reelEase(Math.min(1, (ad - 0.72) / 0.95));
            if (fade < 0.025) {
                fig.style.visibility = "hidden";
                fig.classList.remove("is-focus");
                continue;
            }
            fig.style.visibility = "";
            fig.style.width = box.cardW + "px";
            fig.style.height = box.cardH + "px";
            fig.style.zIndex = String(20 - Math.round(ad * 8));
            fig.style.opacity = fade.toFixed(3);
            fig.style.filter = "";
            fig.style.transform = "translate(-50%, -50%) translateY(" + (d * box.step).toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
            fig.classList.toggle("is-focus", ad < 0.45);
            if (ad < 1.15) {
                var shot = fig.querySelector("img");
                if (shot && shot.dataset.full !== "1") {
                    shot.dataset.full = "1";
                    shot.dataset.src = units[i].work.src;
                    swapWhenReady(shot, units[i].work.src);
                }
            }
        }
    }

    function reelTick(now) {
        reelFrame = 0;
        if (view !== "grid" || stage.hidden) {
            reelStamp = 0;
            return;
        }
        var dt = reelStamp ? Math.min(34, now - reelStamp) : 16;
        reelStamp = now;
        var live = false;
        if (reelAim !== null) {
            var gap = reelAim - reel;
            if (Math.abs(gap) < 0.0015) {
                reel = reelAim;
                reelAim = null;
                reelV = 0;
            } else {
                reel += gap * (reduced ? 1 : (1 - Math.exp(-dt / 260)));
                live = true;
            }
        } else if (Math.abs(reelV) > 0.00045) {
            reel += reelV * (dt / 16);
            reelV *= reduced ? 0 : Math.exp(-dt / 480);
            live = true;
        } else if (Math.abs(reel - Math.round(reel)) > 0.0015) {
            reelAim = Math.round(reel);
            reelV = 0;
            live = true;
        } else {
            reel = Math.round(reel);
            reelV = 0;
        }
        paintReel();
        if (live) reelFrame = window.requestAnimationFrame(reelTick);
    }

    function kickReel() {
        if (!reelFrame) reelFrame = window.requestAnimationFrame(reelTick);
    }

    function nudgeReel(dir) {
        reelAim = Math.round(reel) + dir;
        reelV = 0;
        kickReel();
    }

    function setGrid(on) {
        stage.classList.toggle("is-grid", on);
        if (on && !gridBuilt) {
            gridBuilt = true;
            const frag = document.createDocumentFragment();
            units.forEach(function (unit, i) {
                const figure = document.createElement("figure");
                figure.dataset.idx = String(i);
                figure.tabIndex = 0;
                const img = document.createElement("img");
                img.alt = unit.work.name;
                img.decoding = "async";
                img.draggable = false;
                img.src = unit.work.card || unit.work.src;
                img.dataset.src = unit.work.src;
                img.dataset.full = "0";
                figure.append(img);
                frag.append(figure);
            });
            rows.append(frag);
        }
        if (on) window.requestAnimationFrame(paintReel);
    }

    rows.addEventListener("pointerdown", function (event) {
        if (view !== "grid" || event.button !== 0 || focused >= 0) return;
        reelDrag = { id: event.pointerId, y: event.clientY, last: event.clientY, moved: false, v: 0 };
        reelAim = null;
        reelV = 0;
        rows.setPointerCapture(event.pointerId);
    });

    rows.addEventListener("pointermove", function (event) {
        if (!reelDrag || event.pointerId !== reelDrag.id) return;
        var dy = event.clientY - reelDrag.last;
        if (Math.abs(event.clientY - reelDrag.y) > 5) reelDrag.moved = true;
        reelDrag.last = event.clientY;
        reelDrag.v = dy;
        reel -= dy / reelMetrics().step;
        paintReel();
    });

    function endReelDrag(event) {
        if (!reelDrag || (event && event.pointerId !== reelDrag.id)) return;
        var moved = reelDrag.moved;
        var flick = reelDrag.v;
        reelDrag = null;
        if (!moved) return;
        reelSkipClick = true;
        window.setTimeout(function () { reelSkipClick = false; }, 80);
        reelV = -flick / reelMetrics().step * 0.85;
        kickReel();
    }

    rows.addEventListener("pointerup", endReelDrag);
    rows.addEventListener("pointercancel", endReelDrag);

    function previewBox() {
        const card = metric("--card", 440);
        const perspective = parseFloat(getComputedStyle(stage).perspective) || 780;
        const scale = perspective / (perspective - 240);
        const width = card * scale;
        const height = width * 0.75;
        const host = stage.getBoundingClientRect();
        return {
            left: (host.width - width) / 2,
            top: host.height * 0.46 - height / 2,
            width: width,
            height: height
        };
    }

    function placePlate() {
        const box = previewBox();
        plate.style.left = box.left + "px";
        plate.style.top = box.top + "px";
        plate.style.width = box.width + "px";
        plate.style.height = box.height + "px";
    }

    function pinLitNav() {
        if (focused < 0) return false;
        const box = plate.getBoundingClientRect();
        const host = stage.getBoundingClientRect();
        if (box.width < 2) return false;
        nav.style.left = (box.left - host.left + box.width / 2) + "px";
        nav.style.top = Math.min(box.bottom - host.top + 16, host.height - 62) + "px";
        nav.style.transform = "translateX(-50%)";
        return true;
    }

    function showLitNav() {
        if (focused < 0 || !pinLitNav()) return;
        nav.hidden = false;
        window.requestAnimationFrame(function () {
            if (focused < 0) return;
            nav.classList.remove("is-out");
        });
    }

    function armLitNav() {
        window.clearTimeout(navTimer);
        nav.classList.add("is-out");
        if (reduced) {
            showLitNav();
            return;
        }
        navTimer = window.setTimeout(showLitNav, 620);
    }

    function hideLitNav() {
        window.clearTimeout(navTimer);
        nav.classList.add("is-out");
        nav.hidden = true;
    }

    function stepLit(dir) {
        if (focused < 0) return;
        const index = (focused + dir + units.length) % units.length;
        const work = units[index].work;
        focused = index;
        const gridFig = rows.querySelector("figure[data-idx='" + index + "']");
        const nextFrom = stage.classList.contains("is-grid") ? gridFig : cards[index];
        if (nextFrom) sourceEl = nextFrom;
        litImg.alt = work.name;
        litImg.dataset.src = work.src;
        stage.setAttribute("aria-label", work.name);
        swapWhenReady(litImg, work.src);
    }

    function openLit(index, from) {
        const work = units[index] && units[index].work;
        if (!work) return;
        focused = index;
        sourceEl = from;
        litAt = performance.now();
        litImg.alt = work.name;
        litImg.dataset.src = work.src;
        stage.setAttribute("aria-label", work.name);
        swapWhenReady(litImg, work.src);
        lit.hidden = false;
        stage.classList.add("is-lit");
        placePlate();
        const fromBox = from.getBoundingClientRect();
        const plateBox = plate.getBoundingClientRect();
        const dx = (fromBox.left + fromBox.width / 2) - (plateBox.left + plateBox.width / 2);
        const dy = (fromBox.top + fromBox.height / 2) - (plateBox.top + plateBox.height / 2);
        const scale = Math.max(0.04, fromBox.width / Math.max(1, plateBox.width));
        plate.style.transition = "none";
        plate.style.transform = "translate(" + dx.toFixed(1) + "px, " + dy.toFixed(1) + "px) scale(" + scale.toFixed(4) + ")";
        plate.style.opacity = "0";
        plate.getBoundingClientRect();
        plate.style.transition = "";
        plate.style.transform = "";
        plate.style.opacity = "";
        armLitNav();
    }

    plate.addEventListener("transitionend", function (event) {
        if (event.propertyName !== "transform" || focused < 0) return;
        window.clearTimeout(navTimer);
        showLitNav();
    });

    function closeLit() {
        const from = sourceEl;
        focused = -1;
        stage.classList.remove("is-lit");
        stage.setAttribute("aria-label", "Selected work");
        hideLitNav();
        if (from && from.isConnected) {
            const fromBox = from.getBoundingClientRect();
            const plateBox = plate.getBoundingClientRect();
            const dx = (fromBox.left + fromBox.width / 2) - (plateBox.left + plateBox.width / 2);
            const dy = (fromBox.top + fromBox.height / 2) - (plateBox.top + plateBox.height / 2);
            const scale = Math.max(0.04, fromBox.width / Math.max(1, plateBox.width));
            plate.style.transform = "translate(" + dx.toFixed(1) + "px, " + dy.toFixed(1) + "px) scale(" + scale.toFixed(4) + ")";
            plate.style.opacity = "0";
        } else {
            plate.style.opacity = "0";
        }
        window.setTimeout(function () {
            lit.hidden = true;
            plate.style.transition = "none";
            plate.style.transform = "";
            plate.style.opacity = "";
            plate.getBoundingClientRect();
            plate.style.transition = "";
            sourceEl = null;
        }, reduced ? 0 : 640);
    }

    function setView(next) {
        if (next === view) return;
        if (view === "sphere" || view === "grid") {
            if (focused >= 0) closeLit();
        }
        view = next;
        const sphereOn = next === "sphere" || next === "grid";
        stage.classList.toggle("is-sphere", sphereOn);
        setGrid(next === "grid");
        switcher.querySelectorAll("button").forEach(function (button) {
            button.setAttribute("aria-pressed", button.getAttribute("data-view") === next ? "true" : "false");
        });
        placeThumb(false);
        if (sphereOn) bootSphere();
        else sphere.hidden = true;
    }

    function placeThumb(instant) {
        const on = switcher.querySelector("button[data-view][aria-pressed='true']");
        const thumb = switcher.querySelector(".view-thumb");
        if (!on || !thumb || !on.offsetWidth) return;
        if (instant || reduced) thumb.style.transition = "none";
        thumb.style.width = on.offsetWidth + "px";
        thumb.style.transform = "translateX(" + on.offsetLeft + "px)";
        if (instant || reduced) {
            thumb.getBoundingClientRect();
            thumb.style.transition = "";
        }
    }

    switcher.addEventListener("pointerdown", function (event) { event.stopPropagation(); });
    switcher.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-view]");
        if (!button) return;
        setView(button.getAttribute("data-view"));
    });

    lit.addEventListener("click", function () {
        if (performance.now() - litAt < 450) return;
        closeLit();
    });

    rows.addEventListener("click", function (event) {
        if (reelSkipClick) {
            reelSkipClick = false;
            return;
        }
        const figure = event.target.closest("figure");
        if (!figure || !figure.classList.contains("is-focus")) return;
        openLit(Number(figure.dataset.idx), figure);
    });
    rows.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        const figure = event.target.closest("figure");
        if (!figure) return;
        event.preventDefault();
        openLit(Number(figure.dataset.idx), figure);
    });

    sphereStage.addEventListener("pointerdown", function (event) {
        if (event.button !== 0 || focused >= 0 || stage.classList.contains("is-grid")) return;
        event.stopPropagation();
        ptr = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            lastX: event.clientX,
            lastY: event.clientY,
            card: event.target.closest(".sphere-card"),
            coarse: event.pointerType === "touch",
            vx: 0,
            vy: 0
        };
        velX = 0;
        velY = 0;
        dragging = true;
        stage.classList.add("is-drag");
        sphereStage.setPointerCapture(event.pointerId);
    });

    sphereStage.addEventListener("pointermove", function (event) {
        if (!ptr || ptr.id !== event.pointerId) return;
        const stepX = event.clientX - ptr.lastX;
        const stepY = event.clientY - ptr.lastY;
        ptr.vx = stepX;
        ptr.vy = stepY;
        ptr.lastX = event.clientX;
        ptr.lastY = event.clientY;
        const sens = 180 / (Math.PI * Math.max(80, radius));
        turn(stepX * sens, -stepY * sens);
    });

    function endSpherePointer(event) {
        if (!ptr || ptr.id !== event.pointerId) return;
        const moved = Math.hypot(event.clientX - ptr.x, event.clientY - ptr.y);
        const slop = ptr.coarse ? 14 : 6;
        const card = ptr.card;
        const sens = 180 / (Math.PI * Math.max(80, radius));
        velX = reduced ? 0 : ptr.vx * sens;
        velY = reduced ? 0 : -ptr.vy * sens;
        dragging = false;
        stage.classList.remove("is-drag");
        ptr = null;
        if (moved < slop && card) openLit(Number(card.dataset.idx), card);
    }

    sphereStage.addEventListener("pointerup", endSpherePointer);
    sphereStage.addEventListener("pointercancel", endSpherePointer);

    sphere.addEventListener("wheel", function (event) {
        if (view !== "sphere" || stage.hidden || focused >= 0) return;
        event.preventDefault();
        event.stopPropagation();
        const delta = Math.max(-80, Math.min(80, event.deltaY));
        dolly = Math.min(1, Math.max(0, dolly + delta / 700));
    }, { passive: false });

    window.addEventListener("resize", function () {
        placeThumb(true);
        if (view === "sphere") measureSphere(false);
        if (focused >= 0) {
            placePlate();
            pinLitNav();
        }
    });
    window.addEventListener("orientationchange", function () {
        window.setTimeout(function () { if (view === "sphere") measureSphere(true); }, 220);
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", function () {
            if (view === "sphere") measureSphere(true);
        });
    }
})();
