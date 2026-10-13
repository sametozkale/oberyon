(function () {
    const root = document.getElementById("intro");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plates = Array.prototype.slice.call(root.querySelectorAll(".plate"));
    let index = 0;
    let timer = 0;
    let left = false;

    function finish() {
        window.__introDone = true;
        if (root.parentNode) root.parentNode.removeChild(root);
        document.dispatchEvent(new Event("intro:done"));
    }

    if (reduced) {
        finish();
        return;
    }

    const freeze = new URLSearchParams(window.location.search).get("plate");
    if (freeze !== null) {
        const locked = Math.max(0, Math.min(plates.length - 1, Number(freeze) || 0));
        plates.forEach(function (plate, n) {
            plate.classList.toggle("is-on", n === locked);
        });
        return;
    }

    function show(i) {
        plates.forEach(function (plate, n) {
            plate.classList.toggle("is-on", n === i);
        });
    }

    function leave() {
        if (left) return;
        left = true;
        window.clearTimeout(timer);
        root.classList.add("is-leaving");
        timer = window.setTimeout(finish, 620);
    }

    function advance() {
        if (left) return;
        if (index >= plates.length) {
            leave();
            return;
        }
        show(index);
        const hold = index === 0 ? 200 : 460;
        index += 1;
        timer = window.setTimeout(advance, hold);
    }

    function skip() {
        leave();
    }

    root.addEventListener("click", skip);
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") skip();
    });

    const fonts = document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    Promise.race([
        fonts,
        new Promise(function (resolve) { window.setTimeout(resolve, 700); })
    ]).then(function () {
        if (!left) advance();
    });
})();
