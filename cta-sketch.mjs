import * as THREE from "https://esm.sh/three@0.170.0";

const btn = document.querySelector(".hero-cta");
const canvas = btn && btn.querySelector(".cta-sketch");
const chars = btn && btn.querySelector(".cta-chars");
const icon = btn && btn.querySelector(".cta-arrow");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const label = "Let's talk";

if (!btn || !canvas || !chars || !icon) {
    // Button markup is required for the sketch.
} else if (reduced) {
    btn.classList.remove("is-sketching");
    canvas.remove();
} else {
    btn.classList.add("is-sketching");

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: false
    });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uBorder: { value: 0 },
        uFill: { value: 0 },
        uSolid: { value: 0 }
    };
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            uniform vec2 uRes;
            uniform float uBorder;
            uniform float uFill;
            uniform float uSolid;

            float sdRoundBox(vec2 p, vec2 b, float r) {
                vec2 q = abs(p) - b + r;
                return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
            }

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float perimeter(vec2 p, float halfL, float r) {
                float x = p.x;
                float y = p.y;
                float topLen = halfL * 2.0;
                float cap = 1.5707963 * r;
                if (y >= 0.0 && abs(x) <= halfL) return cap + (x + halfL);
                if (x > halfL) {
                    float a = atan(y, x - halfL);
                    return cap + topLen + (1.5707963 - a) * r;
                }
                if (abs(x) <= halfL) return cap + topLen + 3.14159265 * r + (halfL - x);
                float a = atan(y, x + halfL);
                if (y >= 0.0) return (3.14159265 - a) * r;
                return cap + topLen + 3.14159265 * r + topLen + (-1.5707963 - a) * r;
            }

            vec2 strokeAt(float u, float seed, float hw, float hh) {
                float turns = 6.0;
                float fu = clamp(u, 0.0, 0.999) * turns;
                float pass = floor(fu);
                float t = fract(fu);
                float going = mod(pass, 2.0) < 0.5 ? t : 1.0 - t;
                float e = going * going * (3.0 - 2.0 * going);
                float y = mix(hh * 0.62, -hh * 0.62, (pass + 0.5) / turns);
                float x = mix(-hw * 0.96, hw * 0.96, e);
                float bow = sin(going * 3.14159) * hh * (mod(pass, 2.0) < 0.5 ? 0.55 : -0.38);
                y += bow + sin(going * 11.0 + pass + seed) * 1.05;
                x += sin(going * 7.5 + seed * 1.3) * 2.2;
                float ang = (hash(vec2(pass + 1.0, seed)) - 0.5) * 0.85;
                float ca = cos(ang);
                float sa = sin(ang);
                return vec2(ca * x - sa * y, sa * x + ca * y);
            }

            float lay(vec2 p, float hw, float hh, float seed, float start, float span) {
                float raw = clamp((uFill - start) / span, 0.0, 1.0);
                if (raw <= 0.001) return 0.0;
                float ink = 0.0;
                const int N = 36;
                for (int i = 0; i < N; i++) {
                    float u0 = float(i) / float(N);
                    float u1 = float(i + 1) / float(N);
                    float on = step(u0, raw);
                    float uEnd = min(raw, u1);
                    vec2 a = strokeAt(u0, seed, hw, hh);
                    vec2 b = strokeAt(uEnd, seed, hw, hh);
                    vec2 ab = b - a;
                    float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
                    float d = length(p - (a + ab * h));
                    float press = 0.55 + 0.85 * sin(clamp(u0, 0.02, 0.98) * 3.14159);
                    float flick = 0.78 + 0.22 * sin(u0 * 29.0 + seed * 5.0);
                    float rad = (3.6 + 2.4 * press) * flick;
                    float grain = 0.86 + 0.14 * hash(vec2(floor(p.x * 0.7 + seed), floor(p.y * 0.9)));
                    float core = 1.0 - smoothstep(rad * 0.05, rad * 0.48, d);
                    float edge = (1.0 - smoothstep(rad * 0.34, rad, d)) * grain;
                    ink = max(ink, max(core, edge) * on);
                }
                vec2 head = strokeAt(raw, seed, hw, hh);
                float drawing = smoothstep(0.0, 0.04, raw) * (1.0 - smoothstep(0.88, 0.99, raw));
                float nib = exp(-pow(length(p - head) / 4.4, 2.0)) * drawing;
                return ink + nib;
            }

            float pencil(vec2 p, float hw, float hh) {
                float first = lay(p, hw, hh, 1.0, 0.0, 0.46);
                float again = lay(p, hw, hh, 2.35, 0.28, 0.46);
                float third = lay(p, hw, hh, 4.1, 0.56, 0.44);
                return first + again + third;
            }

            void main() {
                vec2 p = (vUv - 0.5) * uRes;
                float hw = uRes.x * 0.5;
                float hh = uRes.y * 0.5;
                float r = hh;
                float d = sdRoundBox(p, vec2(hw, hh), r);
                float halfL = max(hw - r, 0.0);
                float total = halfL * 4.0 + 6.2831853 * r;
                float s = perimeter(p, halfL, r) / max(total, 1.0);
                float strokeW = 1.25;
                float line = 1.0 - smoothstep(strokeW * 0.2, strokeW, abs(d + strokeW * 0.55));
                float len = s * total;
                float reach = uBorder * total;
                float cover = 1.0 - smoothstep(reach - 0.2, reach + 0.15, len);
                if (uBorder >= 0.995) cover = 1.0;
                float nib = exp(-pow((len - reach) / 1.2, 2.0)) * line;
                float border = max(line * cover, nib) * step(0.001, uBorder);
                float inside = 1.0 - smoothstep(-0.4, 0.35, d);
                float ink = clamp(pencil(p, hw, hh), 0.0, 1.0);
                float fill = inside * mix(clamp(ink, 0.0, 1.0), 1.0, uSolid);
                float alpha = max(border * 0.92, fill);
                vec3 wire = vec3(0.93, 0.97, 0.95);
                vec3 paper = vec3(1.0);
                vec3 color = mix(wire, paper, clamp(fill / max(alpha, 0.001), 0.0, 1.0));
                gl_FragColor = vec4(color, alpha);
            }
        `
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function resize() {
        const w = Math.max(1, btn.clientWidth);
        const h = Math.max(1, btn.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w, h);
    }

    function clamp01(t) {
        return Math.min(1, Math.max(0, t));
    }

    function easeOut(t) {
        const x = clamp01(t);
        return 1 - Math.pow(1 - x, 1.7);
    }

    function easeInOut(t) {
        const x = clamp01(t);
        return x * x * (3 - 2 * x);
    }

    let played = false;

    function play() {
        if (played) return;
        played = true;
        resize();
        const started = performance.now();
        const lead = 460;
        const borderDur = 1120;
        const fillAt = lead + borderDur + 140;
        const fillDur = 2600;
        const solidAt = fillAt + fillDur + 80;
        const solidDur = 1200;

        function frame(now) {
            const t = now - started;
            uniforms.uBorder.value = t < lead ? 0 : easeOut((t - lead) / borderDur);
            uniforms.uFill.value = t < fillAt ? 0 : clamp01((t - fillAt) / fillDur);
            uniforms.uSolid.value = t < solidAt ? 0 : easeInOut((t - solidAt) / solidDur);
            renderer.render(scene, camera);
            if (t < solidAt + solidDur) requestAnimationFrame(frame);
            else window.setTimeout(typeLabel, 180);
        }

        requestAnimationFrame(frame);
    }

    function typeLabel() {
        btn.classList.add("is-inked", "is-typed", "is-typing");
        let i = 0;
        function step() {
            i += 1;
            chars.textContent = label.slice(0, i);
            if (i < label.length) {
                const pause = label.charAt(i - 1) === " " ? 110 : 58;
                window.setTimeout(step, pause);
            } else {
                btn.classList.remove("is-typing");
                window.setTimeout(placeIcon, 220);
            }
        }
        step();
    }

    function finishSketch() {
        icon.style.animation = "none";
        btn.classList.remove("is-sketching", "is-inked", "is-icon");
        renderer.dispose();
        material.dispose();
        canvas.remove();
    }

    function placeIcon() {
        btn.classList.add("is-icon");
        icon.addEventListener("animationend", function (event) {
            if (event.animationName !== "icon-touch") return;
            finishSketch();
        });
    }

    function boot() {
        const arm = function () {
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        };
        if (document.body.classList.contains("is-in") || window.__introDone) arm();
        else document.addEventListener("intro:done", arm, { once: true });
    }

    if (document.body.classList.contains("is-in") || window.__introDone) boot();
    else document.addEventListener("intro:done", boot, { once: true });
}
