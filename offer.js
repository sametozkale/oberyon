(function () {
    document.documentElement.classList.add("js");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll("[data-play]");

    function arm(node) {
        node.classList.add("is-on");
    }

    if (reduced || !("IntersectionObserver" in window)) {
        nodes.forEach(arm);
    } else {
        var seen = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                arm(entry.target);
                seen.unobserve(entry.target);
            });
        }, { threshold: 0.05, rootMargin: "0px 0px 80px 0px" });
        nodes.forEach(function (node) { seen.observe(node); });
    }

    document.querySelectorAll("[data-lengths]").forEach(function (root) {
        root.querySelectorAll("[data-span]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                root.dataset.length = btn.dataset.span;
                root.querySelectorAll("[data-span]").forEach(function (other) {
                    other.setAttribute("aria-pressed", other === btn ? "true" : "false");
                });
                var note = root.querySelector("[data-length-note]");
                if (note) note.textContent = btn.dataset.note || "";
            });
        });
    });
})();
