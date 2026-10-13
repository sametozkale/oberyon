var TOKENS = {
    "--anatomy-card": "#123c30",
    "--anatomy-paper": "#123c30",
    "--anatomy-face": "#1b5344",
    "--anatomy-top": "#1c5646",
    "--anatomy-shade-0": "#0a2820",
    "--anatomy-shade-1": "#0e3228",
    "--anatomy-shade-2": "#12382d",
    "--anatomy-shade-3": "#164233",
    "--anatomy-lit-top": "#e7f2ec",
    "--anatomy-lit-shade": "#c9ddd4",
    "--anatomy-hi": "#d7e6de",
    "--anatomy-mid": "#7f9e91",
    "--anatomy-lo": "#4a6b5e",
    "--anatomy-faint": "#2a4a3e",
    "--anatomy-lit": "#e7f2ec",
    "--anatomy-text": "#c5d9d0",
    "--anatomy-strong": "#f4f7f5",
    "--anatomy-muted": "#8aa99b"
};

var FILES = {
    "binary-search": "./binary-search.js",
    "box-model": "./box-model.js",
    "git-merge": "./git-merge.js",
    "watch": "./watch.js"
};

var QUIET = [
    ".iso, .iso-plate { background: transparent !important; }",
    ".iso-plate { box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }",
    ".iso-plate-corners { display: none !important; }"
].join("");

document.querySelectorAll(".anatomy").forEach(function (figure) {
    var file = FILES[figure.getAttribute("data-anatomy")];
    if (!file) return;
    import(file).then(function (mod) {
        var host = document.createElement("div");
        host.className = "anatomy-host";
        figure.appendChild(host);
        mod.render(host, { theme: "dark", tokens: TOKENS, fig: "" });
        var style = document.createElement("style");
        style.textContent = QUIET;
        if (host.shadowRoot) host.shadowRoot.appendChild(style);
    });
});
