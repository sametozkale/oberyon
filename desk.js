(function () {
    var root = document.querySelector(".desk");
    if (!root) return;

    var KEYS = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter", "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "ShiftRight", "Alt", "Meta", " ", "NumpadEnter", "AltRight"];
    var PHRASES = ["ship the interface", "one surface", "design and code"];
    var SHIFTED = { "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/" };
    var MAX = 20;
    var CRT_MID = 113.5;
    var DOWN = 2.2;
    var down = [0, 1.0988];

    var svg = root.querySelector(".desk-art");
    var keyEls = KEYS.map(function (_, i) { return svg.querySelector('[data-key="' + i + '"]'); });
    var textEl = svg.querySelector('[data-part="text"]');
    var cursor = svg.querySelector('[data-part="cursor"]');
    var crt = svg.querySelector('[data-part="crt"]');
    var beam = svg.querySelector('[data-part="beam"]');
    var dot = svg.querySelector('[data-part="dot"]');
    var glass = svg.querySelector(".pc-glass");
    var led = svg.querySelector('[data-part="led"]');
    var rockerOn = svg.querySelector('[data-rocker="on"]');
    var rockerOff = svg.querySelector('[data-rocker="off"]');
    var readout = root.querySelector("[data-readout]");
    var status = root.querySelector("[data-status]");
    var computer = svg.querySelector('[data-part="computer"]');
    var still = window.matchMedia("(prefers-reduced-motion: reduce)");

    var keyState = KEYS.map(function () { return { at: 0, held: 0 }; });
    var active = new Set();
    var line = "";
    var lastKey = "";
    var power = 1;
    var powerClock = 9;
    var frame = 0;
    var previous = 0;
    var visible = false;
    var user = false;
    var touring = !still.matches;
    var idleTimer = 0;
    var tour = { phrase: 0, step: "type", index: 0, wait: 1.6 };

    function indexOf(code) { return KEYS.indexOf(code); }

    function press(code, hold) {
        var i = indexOf(code);
        if (i < 0) return;
        keyState[i].held = hold || 0.09;
        active.add(i);
        run();
    }

    function write() {
        textEl.textContent = "> " + line;
        var width = 0;
        try { width = textEl.getComputedTextLength(); } catch (error) { width = line.length * 3.1 + 6; }
        cursor.setAttribute("x", String(width / 2 + 0.55));
        var text = power ? "on · " + line.length + " chars" + (lastKey ? " · key " + lastKey : "") : "off";
        if (readout && readout.textContent !== text) readout.textContent = text;
    }

    function setPower(next) {
        if (next === power) return;
        power = next ? 1 : 0;
        powerClock = still.matches ? 9 : 0;
        rockerOn.style.display = power ? "" : "none";
        rockerOff.style.display = power ? "none" : "";
        led.style.opacity = power ? "" : "0.15";
        computer.setAttribute("aria-pressed", power ? "true" : "false");
        root.classList.toggle("is-on", !!power);
        if (status) status.textContent = power ? "Computer on." : "Computer off.";
        write();
        run();
    }

    function type(char) {
        if (!power) return;
        var lower = char.toLowerCase();
        var code = SHIFTED[char] || lower;
        if (indexOf(code) < 0) return;
        if (SHIFTED[char] || char !== lower) press("Shift", 0.14);
        press(code);
        lastKey = char === " " ? "space" : char;
        if (line.length < MAX) line += char;
        write();
    }

    function erase() {
        if (!power) return;
        press("Backspace");
        lastKey = "backspace";
        line = line.slice(0, -1);
        write();
    }

    function enter() {
        if (!power) return;
        press("Enter");
        lastKey = "return";
        line = "";
        write();
    }

    function ease(t) {
        t = Math.min(1, Math.max(0, t));
        return 1 - Math.pow(1 - t, 3);
    }

    function crtFrame() {
        var t = powerClock;
        var sx = 1;
        var sy = 1;
        var beamAt = 0;
        var dotAt = 0;
        var lit = power;
        if (power) {
            if (t < 0.14) { sx = ease(t / 0.14); sy = 0.012; beamAt = 1; }
            else if (t < 0.36) { sy = 0.012 + 0.988 * ease((t - 0.14) / 0.22); beamAt = 1 - ease((t - 0.14) / 0.22); }
        } else if (t < 0.1) {
            sy = 1 - 0.988 * ease(t / 0.1);
            beamAt = ease(t / 0.1);
            lit = 1;
        } else if (t < 0.26) {
            sy = 0.012;
            sx = 1 - ease((t - 0.1) / 0.16);
            beamAt = 1;
            lit = 1;
        } else {
            sx = 0;
            sy = 0;
            dotAt = Math.max(0, 1 - (t - 0.26) / 0.5);
        }
        crt.setAttribute("transform", "translate(0 " + -CRT_MID + ") scale(" + sx.toFixed(3) + " " + sy.toFixed(3) + ") translate(0 " + CRT_MID + ")");
        beam.setAttribute("transform", "translate(0 " + -CRT_MID + ") scale(" + Math.max(sx, 0.001).toFixed(3) + " 1) translate(0 " + CRT_MID + ")");
        beam.style.opacity = beamAt.toFixed(2);
        dot.style.opacity = dotAt.toFixed(2);
        if (lit) glass.setAttribute("data-on", "");
        else glass.removeAttribute("data-on");
        return t > 0.8;
    }

    function tourStep(dt) {
        tour.wait -= dt;
        if (tour.wait > 0) return;
        var phrase = PHRASES[tour.phrase];
        if (tour.step === "type") {
            if (tour.index < phrase.length) {
                type(phrase[tour.index]);
                tour.index += 1;
                tour.wait = 0.09 + Math.random() * 0.1;
            } else {
                tour.step = "erase";
                tour.wait = 2.2;
            }
        } else if (tour.step === "erase") {
            if (line.length) {
                erase();
                tour.wait = 0.05;
            } else if (tour.phrase === PHRASES.length - 1) {
                tour.step = "off";
                tour.wait = 0.8;
            } else {
                tour.phrase += 1;
                tour.index = 0;
                tour.step = "type";
                tour.wait = 0.7;
            }
        } else if (tour.step === "off") {
            setPower(0);
            tour.step = "on";
            tour.wait = 1.5;
        } else if (tour.step === "on") {
            setPower(1);
            tour = { phrase: 0, step: "type", index: 0, wait: 1.4 };
        }
    }

    function tick(now) {
        var dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
        previous = now;
        var calm = still.matches;
        if (touring) tourStep(dt);
        powerClock += dt;
        var settled = crtFrame();
        active.forEach(function (i) {
            var state = keyState[i];
            state.held = Math.max(0, state.held - dt);
            var want = state.held > 0 ? DOWN : 0;
            state.at = calm ? want : state.at + (want - state.at) * (1 - Math.exp(-dt / (want ? 0.025 : 0.07)));
            if (Math.abs(want - state.at) < 0.01) state.at = want;
            keyEls[i].setAttribute("transform", "translate(" + (down[0] * state.at).toFixed(2) + " " + (down[1] * state.at).toFixed(2) + ")");
            if (state.at > 0.6) keyEls[i].setAttribute("data-down", "");
            else keyEls[i].removeAttribute("data-down");
            if (!state.held && state.at === 0) active.delete(i);
        });
        var busy = touring || active.size || !settled;
        frame = visible && busy ? window.requestAnimationFrame(tick) : 0;
    }

    function run() {
        if (!frame && visible) {
            previous = 0;
            frame = window.requestAnimationFrame(tick);
        }
    }

    function takeOver(switching) {
        var first = !user;
        user = true;
        touring = false;
        tour = { phrase: 0, step: "type", index: 0, wait: 1.4 };
        if (first) line = "";
        if (!switching) setPower(1);
        write();
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(function () {
            user = false;
            if (still.matches || root.matches(":hover") || document.activeElement === root) return;
            touring = true;
            line = "";
            setPower(1);
            write();
            run();
        }, 9000);
    }

    new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run();
    }, { rootMargin: "120px 0px" }).observe(root);

    root.addEventListener("pointerenter", function () {
        if (!user) touring = false;
    });
    root.addEventListener("pointerleave", function () {
        if (!user && !still.matches && document.activeElement !== root) {
            touring = true;
            run();
        }
    });
    root.addEventListener("focus", function () {
        if (!user) touring = false;
    });
    root.addEventListener("blur", function () {
        if (!user && !still.matches && !root.matches(":hover")) {
            touring = true;
            run();
        }
    });

    root.addEventListener("keydown", function (event) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        var key = event.key;
        if (key === "Tab") return;
        takeOver(key === "Escape");
        if (key === "Escape") {
            event.preventDefault();
            setPower(power ? 0 : 1);
            return;
        }
        if (key === "Backspace") { event.preventDefault(); erase(); return; }
        if (key === "Enter") { event.preventDefault(); enter(); return; }
        if (key === "Shift") { press(event.code === "ShiftRight" ? "ShiftRight" : "Shift", 0.14); return; }
        if (key.length === 1) { event.preventDefault(); type(key); }
    });

    svg.addEventListener("click", function (event) {
        var key = event.target.closest("[data-key]");
        if (key) {
            event.stopPropagation();
            takeOver();
            var code = KEYS[Number(key.getAttribute("data-key"))];
            if (code.length === 1) type(code);
            else if (code === "Backspace") erase();
            else if (code === "Enter" || code === "NumpadEnter") enter();
            else press(code);
            root.focus({ preventScroll: true });
            return;
        }
        if (event.target.closest('[data-part="computer"]')) {
            takeOver(true);
            setPower(power ? 0 : 1);
            root.focus({ preventScroll: true });
        }
    });

    computer.setAttribute("role", "button");
    computer.setAttribute("aria-pressed", "true");
    computer.setAttribute("aria-label", "Desk computer, click to switch");
    KEYS.forEach(function (code, i) {
        var name = code === " " ? "space" : code;
        keyEls[i].setAttribute("role", "button");
        keyEls[i].setAttribute("aria-label", name);
    });

    write();
    crtFrame();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(write);
})();

(function () {
    var section = document.querySelector(".pricing");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 720px)").matches) return;

    var raf = 0;

    function update() {
        raf = 0;
        var rect = section.getBoundingClientRect();
        var travel = section.offsetHeight - window.innerHeight;
        var spread = travel <= 0 ? 1 : -rect.top / travel;
        spread = Math.min(1, Math.max(0, spread));
        section.style.setProperty("--spread", spread.toFixed(4));
        section.classList.toggle("is-open", spread > 0.92);
    }

    function onScroll() {
        if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();
