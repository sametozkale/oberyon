(function () {
    var field = document.querySelector(".plans-field");
    var canvas = field && field.querySelector(".plans-canvas");
    if (!field || !canvas) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ctx = canvas.getContext("2d");
    var running = false;
    var raf = 0;
    var cols = 0;
    var rows = 0;
    var cell = 13;
    var dpr = 1;
    var hoverTarget = 0;
    var hover = 0;
    var lastNow = 0;
    var pointer = { x: 0, y: 0, has: false };
    var markX = 0;
    var markY = 0;
    var mark = new Path2D("M12.6081 12.6072L12.6148 12.6099L12.6104 12.6143L12.6081 12.6072ZM10.9115 18.333L11.173 18.2964C12.191 18.1542 13.1739 17.8247 14.0721 17.3247L14.2359 17.2334L12.6104 12.6143C12.071 13.1527 11.6429 13.792 11.3514 14.4962C11.0599 15.2004 10.9104 15.9552 10.9115 16.7173L10.9115 18.333ZM12.6148 12.6099L17.234 14.2353L17.3253 14.0715C17.8253 13.1734 18.1548 12.1905 18.297 11.1725L18.3337 10.911L16.7182 10.9113C15.9561 10.9103 15.2013 11.0598 14.4971 11.3513C13.7929 11.6428 13.1532 12.0705 12.6148 12.6099ZM1.66699 10.9113L1.70393 11.1725C1.84583 12.1907 2.17519 13.1737 2.67531 14.0718L2.76664 14.2357L7.38181 12.6056C6.84352 12.0675 6.20438 11.6409 5.501 11.3502C4.79763 11.0595 4.04381 10.9103 3.28272 10.9113H1.66699ZM5.76477 17.2338L5.92857 17.325C6.82677 17.8252 7.80979 18.1545 8.82795 18.2964L9.0892 18.3334L9.0892 16.7177C9.09022 15.9567 8.94109 15.2029 8.65043 14.4997C8.35973 13.7963 7.93318 13.1572 7.39524 12.619L5.76477 17.2338ZM7.38181 12.6056L7.39524 12.619L7.40264 12.5988L7.38181 12.6056ZM16.7179 9.08907H18.3337L18.297 8.82751C18.1548 7.80954 17.8253 6.82662 17.3253 5.92851L17.234 5.76472L12.6125 7.38844C13.1511 7.92842 13.791 8.35663 14.4956 8.64841C15.2003 8.94019 15.9553 9.09015 16.7179 9.08907ZM14.0721 2.67531C13.1739 2.1753 12.191 1.84584 11.173 1.70362L10.9115 1.667L10.9117 3.28241C10.9108 4.04506 11.0605 4.80046 11.3523 5.50511C11.6442 6.20982 12.0724 6.84981 12.6125 7.38844L14.2359 2.76666L14.0721 2.67531ZM7.39053 7.38576L7.38617 7.39012L7.3929 7.39214L7.39053 7.38576ZM9.0892 1.66669L8.82795 1.70365C7.80979 1.84552 6.82677 2.17484 5.92857 2.67501L5.76477 2.76629L7.39053 7.38576C7.92984 6.84716 8.35746 6.20744 8.6489 5.50322C8.94035 4.799 9.08987 4.04416 9.08887 3.28205L9.0892 1.66669ZM7.38617 7.39012L2.76664 5.76435L2.67531 5.92821C2.17519 6.82634 1.84583 7.80938 1.70393 8.82753L1.66699 9.08876H3.28272C4.04484 9.08964 4.79964 8.94005 5.50381 8.64856C6.20798 8.35706 6.84767 7.92941 7.38617 7.39012ZM7.3929 7.39214L7.39524 7.39986C7.8438 9.10629 7.84588 10.8994 7.40126 12.6069L7.409 12.6045C9.11546 12.1558 10.9087 12.1537 12.6161 12.5985L12.6141 12.5911C12.1652 10.8847 12.1631 9.09147 12.6081 7.38407L12.6004 7.38575C10.8941 7.83471 9.10026 7.83692 7.3929 7.39214Z");

    function hash(ix, iy) {
        var n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
        return n - Math.floor(n);
    }

    function fade(t) {
        return t * t * (3 - 2 * t);
    }

    function noise(x, y) {
        var x0 = Math.floor(x);
        var y0 = Math.floor(y);
        var fx = fade(x - x0);
        var fy = fade(y - y0);
        var a = hash(x0, y0) + (hash(x0 + 1, y0) - hash(x0, y0)) * fx;
        var b = hash(x0, y0 + 1) + (hash(x0 + 1, y0 + 1) - hash(x0, y0 + 1)) * fx;
        return a + (b - a) * fy;
    }

    function fieldNoise(x, y) {
        return noise(x, y) * 0.56
            + noise(x * 2.05 + 4.2, y * 2.05) * 0.28
            + noise(x * 4.1 + 1.7, y * 4.1) * 0.16;
    }

    function fit() {
        var rect = field.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        cell = Math.max(11, Math.round(12 * dpr));
        cols = Math.ceil(canvas.width / cell) + 1;
        rows = Math.ceil(canvas.height / cell) + 1;
        if (!pointer.has) {
            markX = canvas.width * 0.5;
            markY = canvas.height * 0.42;
        }
    }

    function pointFrom(event) {
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointer.x = (event.clientX - rect.left) * (canvas.width / rect.width);
        pointer.y = (event.clientY - rect.top) * (canvas.height / rect.height);
        pointer.has = true;
    }

    function ease(u) {
        return u * u * (3 - 2 * u);
    }

    function draw(now) {
        var t = (now || 0) * 0.00009;
        var dt = lastNow ? Math.min(0.05, ((now || 0) - lastNow) / 1000) : 0.016;
        lastNow = now || 0;
        if (reduced) hover = hoverTarget;
        else hover += (hoverTarget - hover) * (1 - Math.exp(-dt / 0.62));
        if (Math.abs(hover - hoverTarget) < 0.001) hover = hoverTarget;
        var aimX = pointer.has ? pointer.x : canvas.width * 0.5;
        var aimY = pointer.has ? pointer.y : canvas.height * 0.42;
        if (reduced) {
            markX = aimX;
            markY = aimY;
        } else {
            var follow = 1 - Math.exp(-dt / 0.09);
            markX += (aimX - markX) * follow;
            markY += (aimY - markY) * follow;
        }
        var open = ease(hover);
        var cx = markX;
        var cy = markY;
        var size = Math.min(canvas.width, canvas.height) * 0.5;
        var full = size / 20;
        var sc = full * Math.max(open, 0.0001);
        var originX = cx - 10 * sc;
        var originY = cy - 10 * sc;
        function inMark(px, py, scale, ox, oy) {
            var lx = (px - ox) / scale;
            var ly = (py - oy) / scale;
            if (lx < -0.4 || lx > 20.4 || ly < -0.4 || ly > 20.4) return false;
            return ctx.isPointInPath(mark, lx, ly);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "500 " + Math.round(cell * 0.86) + "px \"IBM Plex Mono\", ui-monospace, monospace";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        var shift = t * 18;
        for (var y = 0; y < rows; y += 1) {
            for (var x = 0; x < cols; x += 1) {
                var nx = x * 0.16 + t * 0.85;
                var ny = y * 0.16 - t * 0.55;
                var n = fieldNoise(nx, ny);
                var flow = fieldNoise(nx * 0.55 + 8.0 - t * 0.35, ny * 0.62 + 3.0 + t * 0.2);
                var ridge = Math.max(0, flow * 1.9 - 0.62);
                ridge = Math.pow(ridge, 1.05);
                var digit = Math.floor(Math.abs(n * 19.7 + x * 0.17 + shift) % 10);
                var alpha = ridge < 0.06 ? 0.045 : Math.min(1, 0.16 + ridge * 1.25);
                ctx.fillStyle = ridge > 0.42
                    ? "rgba(200, 232, 106, " + alpha.toFixed(3) + ")"
                    : "rgba(244, 247, 245, " + (alpha * 0.8).toFixed(3) + ")";
                var shear = (flow - 0.5) * cell * 2.4;
                var drift = (n - 0.5) * cell * 1.6;
                var px = x * cell + cell * 0.5 + shear;
                var py = y * cell + cell * 0.5 + drift;
                if (open > 0.001) {
                    var fullOx = cx - 10 * full;
                    var fullOy = cy - 10 * full;
                    if (inMark(px, py, full, fullOx, fullOy)) {
                        var dx = px - cx;
                        var dy = py - cy;
                        var dist = Math.hypot(dx, dy) || 1;
                        var ux = dx / dist;
                        var uy = dy / dist;
                        var travel = dist;
                        var guard = 0;
                        while (inMark(cx + ux * travel, cy + uy * travel, full, fullOx, fullOy) && guard < 28) {
                            travel += cell * 0.8;
                            guard += 1;
                        }
                        travel += cell * 1.15;
                        px += (cx + ux * travel - px) * open;
                        py += (cy + uy * travel - py) * open;
                    }
                }
                ctx.fillText(String(digit), px, py);
            }
        }
        if (open > 0.001) {
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.translate(originX, originY);
            ctx.scale(sc, sc);
            ctx.fill(mark);
            ctx.restore();
        }
    }

    function frame(now) {
        if (!running) {
            raf = 0;
            return;
        }
        draw(now);
        raf = window.requestAnimationFrame(frame);
    }

    function start() {
        if (running || reduced) return;
        running = true;
        if (!raf) raf = window.requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
    }

    fit();
    draw(reduced ? 860 : 0);

    if (!reduced && "IntersectionObserver" in window) {
        var watcher = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) start();
            else stop();
        }, { threshold: 0.08 });
        watcher.observe(field);
    } else if (!reduced) {
        start();
    }

    field.addEventListener("pointerenter", function (event) {
        pointFrom(event);
        if (hover < 0.02) {
            markX = pointer.x;
            markY = pointer.y;
        }
        hoverTarget = 1;
        if (!running) draw(reduced ? 860 : performance.now());
    });
    field.addEventListener("pointermove", function (event) {
        pointFrom(event);
        if (!running) draw(reduced ? 860 : performance.now());
    });
    field.addEventListener("pointerleave", function () {
        hoverTarget = 0;
        if (!running) draw(reduced ? 860 : performance.now());
    });

    window.addEventListener("resize", function () {
        fit();
        if (!running) draw(reduced ? 860 : performance.now());
    });
})();
