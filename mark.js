(function () {
    var band = document.querySelector(".mark-band");
    var sheet = document.querySelector(".sheet");
    if (!band || !sheet) return;

    var stamps = Array.prototype.slice.call(band.querySelectorAll(".stamp"));
    var brand = document.querySelector(".brand");
    var dock = document.querySelector(".dock");
    var shots = document.querySelector(".shots");
    var stage = document.querySelector(".shot-stage");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    [brand, shots, stage, dock].forEach(function (el) {
        if (el && el.parentNode !== document.body) document.body.appendChild(el);
    });

    band.setAttribute("aria-hidden", "true");
    if (reduced || !stamps.length) return;
    band.classList.add("is-armed");

    var movers = [sheet, brand, shots, dock].filter(Boolean);
    var pull = 0;
    var target = 0;
    var frame = 0;
    var releaseTimer = 0;
    var touchY = 0;
    // A light tug at the edge stays blank. The mark only appears after a firmer pull.
    var SLACK = 46;

    function maxTravel() {
        return Math.max(band.offsetHeight, 1);
    }

    function pose(progress) {
        if (progress <= 0) return { ink: 0, y: -22, squash: 1.05 };
        if (progress >= 1) return { ink: 1, y: 0, squash: 1 };
        var hit = 0.66;
        if (progress < hit) {
            var travel = progress / hit;
            var fall = travel * travel;
            return {
                ink: travel < 0.5 ? 0 : Math.min(1, (travel - 0.5) / 0.32),
                y: -22 * (1 - fall) + 2.4 * fall,
                squash: 1.05 - 0.08 * fall
            };
        }
        var settle = 1 - Math.pow(1 - (progress - hit) / (1 - hit), 3);
        return {
            ink: 1,
            y: 2.4 * (1 - settle),
            squash: 0.97 + 0.03 * settle
        };
    }

    function clearLift() {
        sheet.classList.remove("is-lifted", "is-from-top", "is-from-bottom");
        sheet.style.removeProperty("--lift");
        sheet.style.removeProperty("--shade");
        document.documentElement.classList.remove("is-edge");
        document.documentElement.style.removeProperty("--lift");
    }

    function hide() {
        band.classList.remove("is-out");
        band.setAttribute("aria-hidden", "true");
        band.style.transform = "";
        band.style.top = "";
        band.style.bottom = "";
        movers.forEach(function (el) { el.style.translate = ""; });
        clearLift();
    }

    function show(shown, edge) {
        var height = band.offsetHeight;
        if (!height) return;
        var shift = (edge < 0 ? shown : -shown).toFixed(2) + "px";
        var lift = Math.min(1, shown / Math.max(height * 0.62, 1));
        var inset = (lift * window.innerWidth * 0.032).toFixed(2) + "px";
        movers.forEach(function (el) {
            el.style.translate = (el === shots ? inset : "0px") + " " + shift;
        });
        band.classList.add("is-out");
        band.removeAttribute("aria-hidden");
        if (edge < 0) {
            band.style.bottom = "auto";
            band.style.top = "0px";
            band.style.transform = "translate3d(0," + (shown - height).toFixed(2) + "px,0)";
        } else {
            band.style.top = "auto";
            band.style.bottom = "0px";
            band.style.transform = "translate3d(0," + (height - shown).toFixed(2) + "px,0)";
        }
        var reveal = shown / height;
        for (var i = 0; i < stamps.length; i += 1) {
            var state = pose((reveal - i * 0.09) / 0.24);
            stamps[i].style.setProperty("--ink", state.ink.toFixed(3));
            stamps[i].style.setProperty("--y", state.y.toFixed(2));
            stamps[i].style.setProperty("--squash", state.squash.toFixed(3));
        }
        sheet.classList.add("is-lifted");
        sheet.classList.toggle("is-from-top", edge < 0);
        sheet.classList.toggle("is-from-bottom", edge > 0);
        sheet.style.setProperty("--lift", lift.toFixed(3));
        sheet.style.setProperty("--shade", edge < 0 ? "-28px" : "28px");
        document.documentElement.classList.add("is-edge");
        document.documentElement.style.setProperty("--lift", lift.toFixed(3));
    }

    function apply() {
        var distance = Math.abs(pull);
        if (distance <= SLACK) {
            hide();
            return;
        }
        show(Math.min(distance - SLACK, maxTravel()), pull < 0 ? -1 : 1);
    }

    function kick() {
        if (frame) return;
        frame = window.requestAnimationFrame(step);
    }

    function step() {
        frame = 0;
        pull += (target - pull) * 0.18;
        if (Math.abs(target) < 0.4 && Math.abs(pull) < 0.5) {
            pull = 0;
            target = 0;
            apply();
            return;
        }
        apply();
        kick();
    }

    function hold() {
        window.clearTimeout(releaseTimer);
        releaseTimer = window.setTimeout(function () {
            target = 0;
            kick();
        }, 240);
    }

    function atTop() {
        return window.scrollY <= 0;
    }

    function atBottom() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        return window.scrollY >= max - 1;
    }

    function blocked() {
        return document.getElementById("intro") || (stage && !stage.hidden);
    }

    function nudge(dy) {
        var ceiling = maxTravel() + SLACK;
        var past = Math.abs(target) > SLACK || Math.abs(pull) > SLACK;
        var next = target + dy * (past ? 0.5 : 0.24);
        if (next > 0 && !(atBottom() || target > 0 || pull > 1)) next = 0;
        if (next < 0 && !(atTop() || target < 0 || pull < -1)) next = 0;
        target = Math.max(-ceiling, Math.min(ceiling, next));
        pull += (target - pull) * 0.45;
        apply();
        hold();
    }

    function onWheel(event) {
        if (blocked() || event.ctrlKey) return;
        var dy = event.deltaY;
        if (event.deltaMode === 1) dy *= 16;
        else if (event.deltaMode === 2) dy *= window.innerHeight;
        var engaged = target < -1 || target > 1 || pull < -1 || pull > 1;
        if (engaged || (atTop() && dy < 0) || (atBottom() && dy > 0)) {
            event.preventDefault();
            nudge(dy);
        }
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    window.addEventListener("touchstart", function (event) {
        if (event.touches.length === 1) touchY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", function (event) {
        if (blocked() || event.touches.length !== 1) return;
        var y = event.touches[0].clientY;
        var dy = touchY - y;
        touchY = y;
        var engaged = target < -1 || target > 1 || pull < -1 || pull > 1;
        if (engaged || (atTop() && dy < 0) || (atBottom() && dy > 0)) {
            event.preventDefault();
            nudge(dy);
        }
    }, { passive: false });

    window.addEventListener("touchend", function () {
        target = 0;
        kick();
    });
    window.addEventListener("touchcancel", function () {
        target = 0;
        kick();
    });
})();
