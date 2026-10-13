(function () {
    var stage = document.querySelector(".moat-stage");
    if (!stage) return;

    var line = stage.querySelector(".moat-line");
    var mark = stage.querySelector(".moat-mark");
    var moat = stage.closest(".moat");
    var petals = Array.prototype.slice.call(stage.querySelectorAll(".moat-petal"));
    var coarse = window.matchMedia("(pointer: coarse)").matches;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var narrow = window.matchMedia("(max-width: 800px)");
    var token = 0;

    petals.forEach(function (petal) {
        petal.setAttribute("aria-pressed", "false");
        petal.setAttribute("aria-label", petal.getAttribute("data-line").replace(/\n/g, " "));
    });

    function place(petal) {
        if (narrow.matches) {
            line.style.top = "";
            line.style.left = "";
            line.style.right = "";
            line.style.width = "";
            line.style.maxWidth = "";
            line.style.transform = "";
            return;
        }
        var box = petal.getBoundingClientRect();
        var markBox = mark.getBoundingClientRect();
        var host = stage.getBoundingClientRect();
        var cx = (box.left + box.right) / 2;
        var cy = (box.top + box.bottom) / 2;
        var leftSide = cx < (markBox.left + markBox.right) / 2;
        var gap = 36;
        var gutter = leftSide ? markBox.left - host.left : host.right - markBox.right;
        var top = cy - host.top;
        line.style.width = "max-content";
        line.style.maxWidth = Math.max(160, gutter - gap - 8) + "px";
        line.style.transform = "translateY(-50%)";
        var half = line.offsetHeight / 2;
        top = Math.max(half + 4, Math.min(host.height - half - 4, top));
        line.style.top = top + "px";
        if (leftSide) {
            line.style.left = "auto";
            line.style.right = (host.right - markBox.left + gap) + "px";
            line.style.textAlign = "right";
        } else {
            line.style.right = "auto";
            line.style.left = (markBox.right - host.left + gap) + "px";
            line.style.textAlign = "left";
        }
    }

    function paint(next, petal) {
        var id = ++token;
        line.classList.remove("is-on");
        if (!petal) {
            window.setTimeout(function () {
                if (id !== token) return;
                line.textContent = "";
            }, reduced ? 0 : 160);
            return;
        }
        var reveal = function () {
            if (id !== token) return;
            line.textContent = next;
            place(petal);
            line.classList.add("is-on");
        };
        if (reduced) reveal();
        else window.setTimeout(reveal, 120);
    }

    function set(petal) {
        var core = !!(petal && petal.classList.contains("moat-core"));
        moat.classList.toggle("is-hot", !!petal && !core);
        moat.classList.toggle("is-core", core);
        stage.classList.toggle("is-hot", !!petal);
        petals.forEach(function (item) {
            var on = item === petal;
            item.classList.toggle("is-on", on);
            item.setAttribute("aria-pressed", on ? "true" : "false");
        });
        paint(petal && !core ? petal.getAttribute("data-line") : "", petal && !core ? petal : null);
    }

    petals.forEach(function (petal) {
        petal.addEventListener("pointerenter", function (event) {
            if (event.pointerType === "touch") return;
            set(petal);
        });
        petal.addEventListener("focus", function () { set(petal); });
        petal.addEventListener("click", function () { set(petal); });
        petal.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            set(petal);
        });
    });

    stage.addEventListener("pointerleave", function () {
        if (coarse) return;
        if (stage.contains(document.activeElement)) return;
        set(null);
    });

    stage.addEventListener("focusout", function (event) {
        if (stage.contains(event.relatedTarget)) return;
        if (coarse) return;
        set(null);
    });
})();
