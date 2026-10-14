(function () {
    const stage = document.getElementById("stage");
    const rig = document.getElementById("rig");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function typeHeadline() {
        var headline = document.getElementById("headline");
        if (!headline || headline.dataset.typed) return;
        headline.dataset.typed = "1";
        var words = Array.prototype.slice.call(headline.querySelectorAll(".word"));

        function fill(word) {
            var ghost = word.querySelector(".word-ghost");
            var live = word.querySelector(".word-live");
            if (ghost && live) live.textContent = ghost.textContent;
        }

        if (reduced) {
            words.forEach(fill);
            return;
        }

        headline.classList.add("is-typing");
        var index = 0;

        function typeWord() {
            if (index >= words.length) {
                headline.classList.remove("is-typing");
                words.forEach(function (word) { word.classList.remove("is-current"); });
                return;
            }
            var word = words[index];
            var next = words[index + 1];
            words.forEach(function (item) { item.classList.remove("is-current"); });
            word.classList.add("is-current");
            var ghost = word.querySelector(".word-ghost");
            var live = word.querySelector(".word-live");
            var text = ghost ? ghost.textContent : "";
            var i = 0;

            function step() {
                i += 1;
                if (live) live.textContent = text.slice(0, i);
                if (i < text.length) {
                    window.setTimeout(step, 48);
                    return;
                }
                index += 1;
                var lineBreak = next && word.parentNode !== next.parentNode;
                window.setTimeout(typeWord, lineBreak ? 200 : 110);
            }

            step();
        }

        typeWord();
    }

    function reveal() {
        document.body.classList.add("is-in");
        typeHeadline();
    }

    if (reduced || window.__introDone || !document.getElementById("intro")) {
        reveal();
    } else {
        document.addEventListener("intro:done", reveal, { once: true });
    }

    (function heroTrail() {
        if (reduced) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        var hero = document.querySelector(".hero");
        if (!hero) return;
        var canvas = document.createElement("canvas");
        canvas.className = "hero-trail";
        canvas.setAttribute("aria-hidden", "true");
        hero.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        var cell = 10;
        var life = 500;
        var cells = new Map();
        var raf = 0;
        var shots = document.querySelector(".shots");

        function resize() {
            var rect = hero.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(rect.width));
            canvas.height = Math.max(1, Math.round(rect.height));
        }

        function paint() {
            raf = 0;
            var now = Date.now();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c8e86a";
            cells.forEach(function (item, key) {
                var elapsed = now - item.fadeStart;
                if (elapsed >= life) {
                    cells.delete(key);
                    return;
                }
                ctx.globalAlpha = 1 - elapsed / life;
                ctx.fillRect(item.x * cell, item.y * cell, cell, cell);
            });
            ctx.globalAlpha = 1;
            if (cells.size) raf = requestAnimationFrame(paint);
        }

        function shotQuiet() {
            if (!shots) return null;
            var box = shots.getBoundingClientRect();
            if (box.width < 1 || box.height < 1) return null;
            var card = shots.querySelector(".shot-card");
            var right = box.right;
            var top = box.top;
            var bottom = box.bottom;
            var pad = 64;
            if (card && shots.classList.contains("is-hot")) {
                var cardBox = card.getBoundingClientRect();
                if (cardBox.width > 1) {
                    right = Math.max(right, cardBox.right);
                    top = Math.min(top, cardBox.top);
                    bottom = Math.max(bottom, cardBox.bottom);
                    pad = 20;
                }
            }
            return {
                left: box.left - 16,
                right: right + pad,
                top: top - 28,
                bottom: bottom + 28
            };
        }

        function clearQuiet(zone, rect) {
            var removed = false;
            cells.forEach(function (item, key) {
                var x = rect.left + item.x * cell;
                var y = rect.top + item.y * cell;
                if (x + cell < zone.left || x > zone.right || y + cell < zone.top || y > zone.bottom) return;
                cells.delete(key);
                removed = true;
            });
            return removed;
        }

        function contentZones() {
            var zones = [];
            var nodes = [
                hero.querySelector("h1"),
                hero.querySelector(".hero-cta"),
                document.querySelector(".brand"),
                document.querySelector(".dock")
            ];
            nodes.forEach(function (el) {
                if (!el) return;
                var box = el.getBoundingClientRect();
                if (box.width < 1 || box.height < 1) return;
                zones.push({
                    left: box.left,
                    right: box.right,
                    top: box.top,
                    bottom: box.bottom
                });
            });
            return zones;
        }

        function place(event) {
            var rect = hero.getBoundingClientRect();
            var zone = shotQuiet();
            if (zone && event.clientX >= zone.left && event.clientX <= zone.right && event.clientY >= zone.top && event.clientY <= zone.bottom) {
                if (clearQuiet(zone, rect) && !raf) raf = requestAnimationFrame(paint);
                return;
            }
            var zones = contentZones();
            var over = false;
            var cleared = false;
            zones.forEach(function (item) {
                if (event.clientX >= item.left && event.clientX <= item.right && event.clientY >= item.top && event.clientY <= item.bottom) over = true;
                if (clearQuiet(item, rect)) cleared = true;
            });
            if (over) {
                if (cleared && !raf) raf = requestAnimationFrame(paint);
                return;
            }
            var x = Math.floor((event.clientX - rect.left) / cell);
            var y = Math.floor((event.clientY - rect.top) / cell);
            if (x < 0 || y < 0 || x >= Math.ceil(rect.width / cell) || y >= Math.ceil(rect.height / cell)) return;
            var left = rect.left + x * cell;
            var top = rect.top + y * cell;
            var blocked = zones.some(function (item) {
                return !(left + cell < item.left || left > item.right || top + cell < item.top || top > item.bottom);
            });
            if (blocked) {
                if (cleared && !raf) raf = requestAnimationFrame(paint);
                return;
            }
            cells.set(x + "-" + y, { x: x, y: y, fadeStart: Date.now() });
            if (!raf) raf = requestAnimationFrame(paint);
        }

        window.addEventListener("mousemove", place);
        window.addEventListener("resize", resize);
        resize();
    })();

    const dock = document.querySelector(".dock");
    if (dock) {
        const links = Array.from(dock.querySelectorAll(":scope > a:not(.dock-cta)"));
        const cta = dock.querySelector(".dock-cta");
        const pill = document.createElement("span");
        pill.className = "dock-pill";
        pill.setAttribute("aria-hidden", "true");
        dock.prepend(pill);

        let placed = false;
        let settleTimer = 0;

        function box(link) {
            const dockRect = dock.getBoundingClientRect();
            const rect = link.getBoundingClientRect();
            return {
                x: rect.left - dockRect.left,
                y: rect.top - dockRect.top,
                w: rect.width,
                h: rect.height
            };
        }

        function visual() {
            const dockRect = dock.getBoundingClientRect();
            const rect = pill.getBoundingClientRect();
            return {
                x: rect.left - dockRect.left,
                y: rect.top - dockRect.top,
                w: rect.width,
                h: rect.height
            };
        }

        function apply(next) {
            pill.style.width = next.w + "px";
            pill.style.height = next.h + "px";
            pill.style.transform = "translate(" + next.x + "px, " + next.y + "px)";
        }

        function show(link) {
            const next = box(link);
            window.clearTimeout(settleTimer);
            pill.classList.add("is-on");

            if (!placed || reduced) {
                pill.classList.add("is-instant");
                apply(next);
                pill.getBoundingClientRect();
                pill.classList.remove("is-instant");
                placed = true;
                return;
            }

            const prev = visual();
            const left = Math.min(prev.x, next.x);
            const right = Math.max(prev.x + prev.w, next.x + next.w);
            pill.style.transition = "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), width 0.18s cubic-bezier(0.4, 0, 0.2, 1), height 0.18s ease, opacity 0.2s ease";
            apply({ x: left, y: next.y, w: right - left, h: next.h });

            settleTimer = window.setTimeout(function () {
                pill.style.transition = "";
                apply(next);
            }, 160);
        }

        function hide() {
            window.clearTimeout(settleTimer);
            pill.style.transition = "";
            pill.classList.remove("is-on");
        }

        links.forEach(function (link) {
            link.addEventListener("pointerenter", function () {
                show(link);
            });
            link.addEventListener("focus", function () {
                show(link);
            });
        });

        if (cta) cta.addEventListener("pointerenter", hide);
        dock.addEventListener("pointerleave", hide);
        dock.addEventListener("focusout", function (event) {
            if (!dock.contains(event.relatedTarget)) hide();
        });
    }

    const goo = document.querySelector(".dock-goo");
    if (goo) {
        const mark = goo.querySelector(".dock-mark");
        const fan = goo.querySelector(".dock-fan");
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        let closeTimer = 0;

        function setOpen(next) {
            window.clearTimeout(closeTimer);
            goo.classList.toggle("is-open", next);
            mark.setAttribute("aria-expanded", next ? "true" : "false");
            fan.querySelectorAll("a").forEach(function (link) {
                if (next) link.removeAttribute("tabindex");
                else link.setAttribute("tabindex", "-1");
            });
        }

        function scheduleClose() {
            window.clearTimeout(closeTimer);
            closeTimer = window.setTimeout(function () {
                if (goo.contains(document.activeElement)) return;
                setOpen(false);
            }, 280);
        }

        if (fine) {
            goo.addEventListener("pointerenter", function () { setOpen(true); });
            goo.addEventListener("pointerleave", scheduleClose);
        }

        mark.addEventListener("click", function () {
            if (fine) {
                setOpen(true);
                return;
            }
            setOpen(!goo.classList.contains("is-open"));
        });

        goo.addEventListener("focusout", function (event) {
            if (!goo.contains(event.relatedTarget)) setOpen(false);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") setOpen(false);
        });

        fan.addEventListener("click", function (event) {
            const link = event.target.closest("a");
            if (!link) return;
            const href = link.getAttribute("href") || "";
            if (href === "#work") {
                event.preventDefault();
                setOpen(false);
                const line = document.querySelector(".shot-line");
                if (line) line.click();
                return;
            }
            if (href.charAt(0) !== "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            setOpen(false);
            target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
            if (history.replaceState) history.replaceState(null, "", href);
        });
    }

    (function heroDrops() {
        var hero = document.querySelector(".hero");
        if (!hero) return;
        var field = document.createElement("div");
        field.className = "hero-drops";
        field.setAttribute("aria-hidden", "true");
        hero.prepend(field);
        var sources = ["portfolio/card/D-0.1.webp", "portfolio/card/D-0.2.webp", "portfolio/card/D-0.3.webp", "portfolio/card/D-0.4.webp", "portfolio/card/D-1.webp", "portfolio/card/D-2.webp", "portfolio/card/D-3.webp", "portfolio/card/D-4.webp", "portfolio/card/D-5.webp", "portfolio/card/D-6.webp", "portfolio/card/D-7.webp", "portfolio/card/D-8.webp", "portfolio/card/D-9.webp", "portfolio/card/D-10.webp", "portfolio/card/D-11.webp", "portfolio/card/D-12.webp", "portfolio/card/D-13.webp", "portfolio/card/D-14.webp", "portfolio/card/D-15.webp", "portfolio/card/C-1.webp", "portfolio/card/C-2.webp", "portfolio/card/C-3.webp", "portfolio/card/C-4.webp", "portfolio/card/C-5.webp", "portfolio/card/C-6.webp", "portfolio/card/C-7.webp", "portfolio/card/C-8.webp", "portfolio/card/C-9.webp", "portfolio/card/C-10.webp", "portfolio/card/C-11.webp", "portfolio/card/C-12.webp", "portfolio/card/C-13.webp", "portfolio/card/C-14.webp", "portfolio/card/C-15.webp", "portfolio/card/C-16.webp", "portfolio/card/C-17.webp", "portfolio/card/C-18.webp", "portfolio/card/W-1.webp", "portfolio/card/W-2.webp", "portfolio/card/W-3.webp", "portfolio/card/W-4.webp", "portfolio/card/W-5.webp", "portfolio/card/W-6.webp", "portfolio/card/W-7.webp", "portfolio/card/W-8.webp", "portfolio/card/W-9.webp", "portfolio/card/W-10.webp", "portfolio/card/W-11.webp", "portfolio/card/W-12.webp", "portfolio/card/W-13.webp", "portfolio/card/W-14.webp", "portfolio/card/Mues-AI-Logo.webp", "portfolio/card/Producter-Logo.webp", "portfolio/card/Roadmape-Logo.webp", "portfolio/card/Fussionary-Logo.webp", "portfolio/card/Oberyon-Logo.webp"];
        var ready = sources.map(function (src) {
            var img = new Image();
            img.decoding = "async";
            img.alt = "";
            return { img: img, src: src, job: null, started: false };
        });
        function arm(item) {
            if (item.started) return item.job;
            item.started = true;
            item.img.src = item.src;
            item.job = item.img.decode ? item.img.decode().catch(function () {}) : Promise.resolve();
            return item.job;
        }
        ready.slice(0, 8).forEach(arm);
        var armRest = function () { ready.forEach(arm); };
        if (window.requestIdleCallback) window.requestIdleCallback(armRest, { timeout: 1600 });
        else window.setTimeout(armRest, 500);
        var cursor = 0;

        function dismiss(drop) {
            drop.classList.add("is-out");
            window.setTimeout(function () {
                if (drop.parentNode) drop.parentNode.removeChild(drop);
            }, reduced ? 0 : 380);
        }

        function reveal(drop) {
            field.appendChild(drop);
            if (reduced) drop.classList.add("is-in");
            else requestAnimationFrame(function () { drop.classList.add("is-in"); });
            window.setTimeout(function () { dismiss(drop); }, reduced ? 700 : 1600);
        }

        hero.addEventListener("click", function (event) {
            if (event.target.closest("a, button, input, textarea, select, summary, label")) return;
            if (document.body.classList.contains("is-shot")) return;
            var rect = hero.getBoundingClientRect();
            var cardW = Math.min(280, rect.width * 0.46);
            var cardH = cardW * 0.75;
            var turn = Math.random() * 8 - 4;
            var rad = Math.abs(turn) * Math.PI / 180;
            var boxW = cardW * Math.cos(rad) + cardH * Math.sin(rad);
            var boxH = cardW * Math.sin(rad) + cardH * Math.cos(rad) + cardH * 0.08;
            var pad = 10;
            function place(value, size, limit) {
                var edge = size / 2 + pad;
                var min = edge;
                var max = limit - edge;
                if (max < min) return limit / 2;
                return Math.max(min, Math.min(max, value));
            }
            var x = place(event.clientX - rect.left, boxW, rect.width);
            var y = place(event.clientY - rect.top, boxH, rect.height);
            var item = ready[cursor % ready.length];
            cursor += 1;
            arm(item);
            var drop = document.createElement("div");
            drop.className = "hero-drop";
            drop.style.left = x + "px";
            drop.style.top = y + "px";
            drop.style.setProperty("--turn", turn.toFixed(2) + "deg");
            var img = item.img.cloneNode(false);
            img.alt = "";
            drop.appendChild(img);
            if (item.img.complete && item.img.naturalWidth) reveal(drop);
            else item.job.then(function () { reveal(drop); });
        });
    })();

    if (reduced || !stage || !rig) return;

    stage.addEventListener("pointermove", function (event) {
        if (window.matchMedia("(max-width: 980px)").matches) return;
        const rect = stage.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rig.style.setProperty("--tilt-x", (py * -4).toFixed(2) + "deg");
        rig.style.setProperty("--tilt-y", (px * 6).toFixed(2) + "deg");
    });
})();
