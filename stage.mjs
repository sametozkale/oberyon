import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";

const h = React.createElement;

const works = [
    { src: "ai-cursor.png", name: "Mues AI", detail: "Interface engineering", href: "https://mues.ai/" },
    { src: "Heybooster p.png", name: "Heybooster", detail: "Product engineering", href: "https://heybooster.ai/" },
    { src: "kanban-roadmape.png", name: "Roadmape", detail: "Design systems", href: "https://roadmape.com/" },
    { src: "livro1.png", name: "Livro", detail: "Interface engineering", href: "https://www.livro.app/" },
    { src: "home-producter.png", name: "Producter", detail: "Design engineering", href: "https://producter.co/" },
    { src: "lucy.png", name: "Lucy AI", detail: "Product interface", href: "https://meetlucy.ai/" },
    { src: "Design.png", name: "Jues", detail: "Interface engineering", href: "https://meetlucy.ai/" },
    { src: "fussionary.png", name: "Fussionary", detail: "Web engineering", href: "https://fussionary.com/" }
];

const EASE = [0.7, 0, 0.2, 1];

function narrow() {
    return window.matchMedia("(max-width: 980px)").matches;
}

function stackPose(slot) {
    const step = narrow() ? 70 : 136;
    return {
        x: 0,
        y: slot * step,
        z: 0,
        rotateX: 64,
        rotateY: 0,
        rotateZ: -16,
        opacity: 1,
        zIndex: 16 - slot
    };
}

function featurePose() {
    return {
        x: narrow() ? 0 : 6,
        y: narrow() ? -24 : -162,
        z: 48,
        rotateX: narrow() ? 18 : 8,
        rotateY: 0,
        rotateZ: narrow() ? -8 : -4,
        opacity: 1,
        zIndex: 40
    };
}

function enterPose() {
    const step = narrow() ? 70 : 136;
    return {
        x: 0,
        y: step * 3 + 48,
        z: -20,
        rotateX: 64,
        rotateY: 0,
        rotateZ: -16,
        opacity: 0,
        zIndex: 1
    };
}

function exitPose() {
    const pose = featurePose();
    pose.opacity = 0;
    pose.zIndex = 30;
    return pose;
}

function hiddenPose() {
    return enterPose();
}

function Lights() {
    return h(
        "div",
        { className: "chrome", "aria-hidden": "true" },
        h("span", { className: "traffic" }),
        h("span", { className: "traffic" }),
        h("span", { className: "traffic" })
    );
}

function Card(props) {
    const visual = props.visual;
    return h(
        motion.a,
        {
            className: visual.live ? "card is-live" : "card",
            href: props.work.href,
            target: "_blank",
            rel: "noopener noreferrer",
            tabIndex: visual.live ? 0 : -1,
            "aria-hidden": visual.live ? "false" : "true",
            initial: false,
            animate: visual.pose,
            transition: props.snap
                ? { duration: 0 }
                : {
                    x: { duration: 1.12, ease: EASE },
                    y: { duration: 1.12, ease: EASE },
                    z: { duration: 1.12, ease: EASE },
                    rotateX: { duration: 1.2, ease: EASE },
                    rotateZ: { duration: 1.2, ease: EASE },
                    opacity: { duration: 0.55, ease: "easeOut" },
                    zIndex: { duration: 0 }
                },
            style: {
                pointerEvents: visual.live ? "auto" : "none"
            }
        },
        h(Lights),
        h(
            "div",
            { className: "viewport" },
            h("img", {
                src: encodeURI(props.work.src),
                alt: props.work.name + " product design",
                draggable: false
            })
        )
    );
}

function showCaption(work) {
    const caption = document.getElementById("caption");
    const title = document.getElementById("captionTitle");
    const detail = document.getElementById("captionDetail");
    if (!caption || !title || !detail || !work) return;
    title.textContent = work.name;
    detail.textContent = work.detail;
    caption.href = work.href;
    caption.setAttribute("aria-label", work.name + ", " + work.detail);
    caption.classList.add("is-on");
}

function hideCaption() {
    const caption = document.getElementById("caption");
    if (caption) caption.classList.remove("is-on");
}

function Stack() {
    const [visuals, setVisuals] = useState(function () {
        return works.map(function (_, index) {
            if (index < 4) return { pose: stackPose(index), live: false };
            return { pose: hiddenPose(), live: false };
        });
    });
    const [snap, setSnap] = useState(true);

    useEffect(function () {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let stack = [0, 1, 2, 3];
        let nextIn = 4;
        let featured = null;
        let timer = 0;
        let alive = true;

        function paint(next, instant) {
            if (!alive) return;
            setSnap(instant);
            setVisuals(next);
        }

        function blank() {
            return works.map(function () {
                return { pose: hiddenPose(), live: false };
            });
        }

        function applyStack(base, instant) {
            const next = base || blank();
            stack.forEach(function (index, slot) {
                next[index] = { pose: stackPose(slot), live: false };
            });
            if (featured != null) {
                next[featured] = { pose: featurePose(), live: true };
            }
            paint(next, instant);
        }

        function step() {
            const rising = stack.shift();
            const entering = nextIn % works.length;
            nextIn += 1;
            const previous = featured;

            const parked = blank();
            stack.forEach(function (index, slot) {
                parked[index] = { pose: stackPose(slot), live: false };
            });
            parked[rising] = { pose: stackPose(0), live: false };
            parked[entering] = { pose: enterPose(), live: false };
            if (previous != null) parked[previous] = { pose: featurePose(), live: true };
            flushSync(function () { paint(parked, true); });

            window.requestAnimationFrame(function () {
                if (!alive) return;
                featured = rising;
                stack.push(entering);
                const next = blank();
                if (previous != null && previous !== rising) {
                    next[previous] = { pose: exitPose(), live: false };
                }
                next[rising] = { pose: featurePose(), live: true };
                stack.forEach(function (index, slot) {
                    next[index] = { pose: stackPose(slot), live: false };
                });
                paint(next, false);
                window.setTimeout(function () {
                    if (alive && featured === rising) showCaption(works[rising]);
                }, reduced ? 0 : 780);
            });
        }

        function loop() {
            if (!alive) return;
            hideCaption();
            step();
            timer = window.setTimeout(loop, 3900);
        }

        function begin() {
            if (reduced) {
                featured = 0;
                stack = [1, 2, 3, 4];
                applyStack(null, true);
                showCaption(works[0]);
                return;
            }
            applyStack(null, true);
            timer = window.setTimeout(loop, 500);
        }

        function ready() {
            if (window.__introDone || !document.getElementById("intro")) begin();
            else document.addEventListener("intro:done", begin, { once: true });
        }

        ready();

        function onHide() {
            if (document.hidden) {
                window.clearTimeout(timer);
                alive = false;
            }
        }
        document.addEventListener("visibilitychange", onHide);

        return function () {
            alive = false;
            window.clearTimeout(timer);
            document.removeEventListener("visibilitychange", onHide);
        };
    }, []);

    return works.map(function (work, index) {
        return h(Card, {
            key: work.name,
            work: work,
            visual: visuals[index],
            snap: snap
        });
    });
}

const mount = document.getElementById("rig");
if (mount) createRoot(mount).render(h(Stack));
