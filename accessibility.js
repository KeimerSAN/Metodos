/* =========================================================
   ACCESIBILIDAD — botón "Aa Accesibilidad" + panel "Personalizar lectura"
   Se auto-inyecta en cualquier página que incluya este script.
========================================================= */
(function () {
  const MIN_PCT = 80, MAX_PCT = 160, STEP = 10;

  function init() {
    const root = document.documentElement;

    let pct = parseInt(localStorage.getItem("a11y-pct") || "100", 10);
    if (isNaN(pct) || pct < MIN_PCT || pct > MAX_PCT) pct = 100;
    let contraste = localStorage.getItem("a11y-contraste") === "1";
    let reduceMotion = localStorage.getItem("a11y-reduce-motion") === "1";

    function applyFont() {
      root.style.fontSize = pct + "%";
      const label = document.getElementById("a11yPctLabel");
      if (label) label.textContent = pct + "%";
      localStorage.setItem("a11y-pct", String(pct));
    }
    function applyContraste() {
      root.classList.toggle("a11y-contraste", contraste);
      localStorage.setItem("a11y-contraste", contraste ? "1" : "0");
      const cb = document.getElementById("a11yContrasteCheck");
      if (cb) cb.checked = contraste;
    }
    function applyReduceMotion() {
      root.classList.toggle("a11y-reduce-motion", reduceMotion);
      localStorage.setItem("a11y-reduce-motion", reduceMotion ? "1" : "0");
      const cb = document.getElementById("a11yMotionCheck");
      if (cb) cb.checked = reduceMotion;
    }

    /* ---- construir el widget ---- */
    const wrap = document.createElement("div");
    wrap.className = "a11y-widget";
    wrap.innerHTML = `
      <button type="button" class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="Abrir opciones de accesibilidad">
        <span class="a11y-toggle-badge" aria-hidden="true">Aa</span>
        <span class="a11y-toggle-label">Accesibilidad</span>
      </button>
      <div class="a11y-panel" id="a11yPanel" hidden role="dialog" aria-label="Personalizar lectura">
        <div class="a11y-panel-head">
          <p class="a11y-title">Personalizar lectura</p>
          <button type="button" class="a11y-close" id="a11yClose" aria-label="Cerrar panel">&times;</button>
        </div>

        <p class="a11y-group-label">Tamaño del texto</p>
        <div class="a11y-font-row">
          <button type="button" class="a11y-font-btn" id="a11yFontMinus" aria-label="Reducir tamaño de letra">A&minus;</button>
          <span class="a11y-pct" id="a11yPctLabel">100%</span>
          <button type="button" class="a11y-font-btn" id="a11yFontPlus" aria-label="Aumentar tamaño de letra">A+</button>
        </div>

        <label class="a11y-checkbox-row">
          <input type="checkbox" id="a11yContrasteCheck">
          <span>Alto contraste</span>
        </label>
        <label class="a11y-checkbox-row">
          <input type="checkbox" id="a11yMotionCheck">
          <span>Reducir animaciones</span>
        </label>

        <div class="a11y-read-row">
          <button type="button" class="a11y-read-btn" id="a11yReadStart">&#9654; Leer contenido</button>
          <button type="button" class="a11y-read-btn a11y-read-stop" id="a11yReadStop">&#9632; Detener</button>
        </div>

        <button type="button" class="a11y-reset" id="a11yReset">Restablecer opciones</button>

        <p class="a11y-hint">Atajo: Alt + A abre este panel.</p>
      </div>
    `;
    document.body.appendChild(wrap);

    const toggle = document.getElementById("a11yToggle");
    const panel = document.getElementById("a11yPanel");
    const closeBtn = document.getElementById("a11yClose");

    function openPanel() {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }
    function closePanel() {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", () => {
      panel.hasAttribute("hidden") ? openPanel() : closePanel();
    });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("click", e => {
      if (!wrap.contains(e.target)) closePanel();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closePanel();
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        panel.hasAttribute("hidden") ? openPanel() : closePanel();
      }
    });

    document.getElementById("a11yFontPlus").addEventListener("click", () => {
      pct = Math.min(MAX_PCT, pct + STEP);
      applyFont();
    });
    document.getElementById("a11yFontMinus").addEventListener("click", () => {
      pct = Math.max(MIN_PCT, pct - STEP);
      applyFont();
    });
    document.getElementById("a11yContrasteCheck").addEventListener("change", e => {
      contraste = e.target.checked;
      applyContraste();
    });
    document.getElementById("a11yMotionCheck").addEventListener("change", e => {
      reduceMotion = e.target.checked;
      applyReduceMotion();
    });
    document.getElementById("a11yReset").addEventListener("click", () => {
      pct = 100; contraste = false; reduceMotion = false;
      applyFont(); applyContraste(); applyReduceMotion();
      stopReading();
    });

    /* ---- lectura en voz alta (Web Speech API) ---- */
    function getMainReadable() {
      return document.querySelector("main") || document.querySelector(".detail-body")
        || document.querySelector(".section-inner") || document.body;
    }
    function startReading() {
      if (!("speechSynthesis" in window)) {
        alert("Tu navegador no soporta lectura en voz alta.");
        return;
      }
      stopReading();
      const el = getMainReadable();
      const text = el.innerText.replace(/\s+/g, " ").trim().slice(0, 6000);
      if (!text) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-ES";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
    function stopReading() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
    document.getElementById("a11yReadStart").addEventListener("click", startReading);
    document.getElementById("a11yReadStop").addEventListener("click", stopReading);

    applyFont();
    applyContraste();
    applyReduceMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
