/* =========================================================
   JUEGOS ADICIONALES Y PROGRESO
   Se carga después de script.js y reutiliza Progreso, UNIDADES,
   QUESTION_BANK y lanzarConfeti, definidos allí.
========================================================= */
(function () {
  "use strict";

  /* =======================================================
     1. SELECTOR DE DIFICULTAD
  ======================================================= */
  const botonesDif = document.querySelectorAll(".difficulty-btn");
  function marcarDificultad(nivel) {
    botonesDif.forEach(b => {
      const activo = b.dataset.dif === nivel;
      b.classList.toggle("is-active", activo);
      b.setAttribute("aria-checked", String(activo));
    });
  }
  marcarDificultad(Progreso.dificultad());
  botonesDif.forEach(b =>
    b.addEventListener("click", () => {
      Progreso.fijarDificultad(b.dataset.dif);
      marcarDificultad(b.dataset.dif);
    })
  );

  /* =======================================================
     2. PANEL DE PROGRESO POR UNIDAD
  ======================================================= */
  const grid = document.getElementById("progressGrid");
  const banner = document.getElementById("reviewBanner");
  const contadorRepaso = document.getElementById("reviewCount");

  window.pintarProgreso = function pintarProgreso() {
    if (!grid) return;
    grid.innerHTML = "";

    Object.keys(UNIDADES).forEach(clave => {
      const uni = UNIDADES[clave];
      const d = Progreso.dominio(uni.topics);
      const record = Progreso.record("quiz-" + clave);

      const card = document.createElement("article");
      card.className = "progress-card";
      card.innerHTML = `
        <div class="progress-ring" style="--pct:${d.pct}">
          <span>${d.pct}<em>%</em></span>
        </div>
        <div class="progress-card-text">
          <h4>${uni.label}</h4>
          <p>${d.bien} de ${d.total} preguntas dominadas</p>
          <p class="progress-record">${record ? "Récord: " + record + " pts" : "Sin récord todavía"}</p>
        </div>
        <button type="button" class="btn btn-ghost progress-play" data-topic="${clave}">Jugar</button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".progress-play").forEach(b =>
      b.addEventListener("click", () => openQuiz(b.dataset.topic))
    );

    const pendientes = Object.keys(Progreso.falladas()).length;
    if (banner) {
      banner.hidden = pendientes === 0;
      if (contadorRepaso) contadorRepaso.textContent = pendientes;
    }

    // Récords del juego de emparejar
    document.querySelectorAll("[data-best]").forEach(el => {
      const r = Progreso.record(el.dataset.best);
      el.textContent = r ? "Mejor tiempo: " + (r / 1000).toFixed(1) + " s" : "Sin récord";
    });
  };

  const btnRepaso = document.getElementById("reviewBtn");
  if (btnRepaso) btnRepaso.addEventListener("click", () => openQuiz("repaso"));

  const btnReset = document.getElementById("progressReset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Se borrarán tus preguntas dominadas, tus fallos pendientes y tus récords. ¿Continuar?")) {
        Progreso.reiniciar();
        window.pintarProgreso();
      }
    });
  }

  /* =======================================================
     3. JUEGO DE EMPAREJAR
  ======================================================= */
  const PAREJAS = {
    u1: {
      bloque: "Bloque 1",
      titulo: "Fundamentos y Teoría de Errores",
      items: [
        ["Error absoluto", "|valor verdadero − aproximado|"],
        ["Error relativo", "error absoluto / |valor verdadero|"],
        ["Épsilon de máquina", "el menor ε con 1 + ε ≠ 1"],
        ["Cancelación catastrófica", "restar dos números casi iguales"],
        ["Forma normalizada IEEE 754", "(−1)ˢ · 1.m · 2^(e−sesgo)"],
        ["Criterio de Scarborough", "εₐ < 0.5 × 10^(2−n) %"]
      ]
    },
    u2: {
      bloque: "Bloque 2",
      titulo: "Métodos Iterativos y Raíces de Funciones",
      items: [
        ["Bisección", "c = (a + b) / 2"],
        ["Punto fijo", "xₙ₊₁ = g(xₙ)"],
        ["Newton-Raphson", "xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)"],
        ["Secante", "orden de convergencia 1.618"],
        ["Muller", "parábola por tres puntos"],
        ["Condición inicial de bisección", "f(a) · f(b) < 0"]
      ]
    },
    u3: {
      bloque: "Bloque 3",
      titulo: "Ecuaciones Diferenciales Ordinarias",
      items: [
        ["Euler", "yₙ₊₁ = yₙ + h·f(tₙ, yₙ)"],
        ["Taylor de orden 2", "+ (h²/2)·f′ tras el término lineal"],
        ["Runge-Kutta 4", "(k₁ + 2k₂ + 2k₃ + k₄) / 6"],
        ["Adams-Bashforth", "predictor explícito"],
        ["Adams-Moulton", "corrector implícito"],
        ["Error global de Euler", "O(h)"]
      ]
    }
  };

  const modal      = document.getElementById("matchModal");
  const colIzq     = document.getElementById("matchLeft");
  const colDer     = document.getElementById("matchRight");
  const elDone     = document.getElementById("matchDone");
  const elErrores  = document.getElementById("matchErrors");
  const elTiempo   = document.getElementById("matchTime");
  const elPista    = document.getElementById("matchHint");
  const elTitulo   = document.getElementById("matchTitle");
  const elTag      = document.getElementById("matchTag");
  const resultado  = document.getElementById("matchResult");
  const board      = modal ? modal.querySelector(".match-board") : null;
  const hud        = modal ? modal.querySelector(".match-hud") : null;

  let unidadActual = null, seleccion = null, hechas = 0, errores = 0;
  let inicio = 0, relojMatch = null;

  function barajar(a) {
    const c = a.slice();
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  }

  function pararReloj() { if (relojMatch) { clearInterval(relojMatch); relojMatch = null; } }

  function abrirMatch(unidad) {
    unidadActual = unidad;
    const datos = PAREJAS[unidad];
    seleccion = null; hechas = 0; errores = 0;

    elTag.textContent = "Empareja · " + datos.bloque;
    elTitulo.textContent = datos.titulo;
    elDone.textContent = "0 / " + datos.items.length;
    elErrores.textContent = "0";
    elTiempo.textContent = "0.0 s";
    elPista.textContent = "Toca un concepto de la izquierda y luego su pareja de la derecha.";
    resultado.hidden = true;
    if (board) board.hidden = false;
    if (hud) hud.hidden = false;
    elPista.hidden = false;

    colIzq.innerHTML = ""; colDer.innerHTML = "";
    barajar(datos.items).forEach(([concepto], i) => {
      const idx = datos.items.findIndex(p => p[0] === concepto);
      colIzq.appendChild(crearFicha(concepto, idx, "izq"));
    });
    barajar(datos.items).forEach(([, formula]) => {
      const idx = datos.items.findIndex(p => p[1] === formula);
      colDer.appendChild(crearFicha(formula, idx, "der"));
    });

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    inicio = performance.now();
    pararReloj();
    relojMatch = setInterval(() => {
      elTiempo.textContent = ((performance.now() - inicio) / 1000).toFixed(1) + " s";
    }, 100);
  }

  function crearFicha(texto, indice, lado) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "match-tile";
    b.dataset.idx = indice;
    b.dataset.lado = lado;
    b.textContent = texto;
    b.addEventListener("click", () => elegir(b));
    return b;
  }

  function elegir(ficha) {
    if (ficha.classList.contains("es-pareja")) return;

    if (!seleccion) {
      seleccion = ficha;
      ficha.classList.add("es-elegida");
      elPista.textContent = ficha.dataset.lado === "izq"
        ? "Ahora elige su fórmula o definición en la columna derecha."
        : "Ahora elige el concepto que le corresponde en la columna izquierda.";
      return;
    }

    if (seleccion === ficha) {                  // se deselecciona
      ficha.classList.remove("es-elegida");
      seleccion = null;
      return;
    }

    if (seleccion.dataset.lado === ficha.dataset.lado) {   // cambiar de selección
      seleccion.classList.remove("es-elegida");
      seleccion = ficha;
      ficha.classList.add("es-elegida");
      return;
    }

    const a = seleccion, b = ficha;
    if (a.dataset.idx === b.dataset.idx) {
      [a, b].forEach(x => {
        x.classList.remove("es-elegida");
        x.classList.add("es-pareja");
        x.disabled = true;
      });
      hechas++;
      elDone.textContent = hechas + " / " + PAREJAS[unidadActual].items.length;
      elPista.textContent = "¡Correcto! Sigue con la siguiente pareja.";
      if (hechas === PAREJAS[unidadActual].items.length) terminarMatch();
    } else {
      errores++;
      elErrores.textContent = errores;
      [a, b].forEach(x => {
        x.classList.add("es-error");
        setTimeout(() => x.classList.remove("es-error"), 500);
      });
      a.classList.remove("es-elegida");
      elPista.textContent = "Esa pareja no es. Vuelve a intentarlo.";
    }
    seleccion = null;
  }

  function terminarMatch() {
    pararReloj();
    const ms = Math.round(performance.now() - inicio);
    const segundos = ms / 1000;

    // Penalización de 3 s por error, para que la precisión también cuente
    const ajustado = ms + errores * 3000;

    let medalla;
    if (errores === 0 && segundos < 40) medalla = { icono: "★", nombre: "Platino", clase: "es-platino" };
    else if (ajustado < 60000)          medalla = { icono: "●", nombre: "Oro", clase: "es-oro" };
    else if (ajustado < 100000)         medalla = { icono: "●", nombre: "Plata", clase: "es-plata" };
    else                                medalla = { icono: "●", nombre: "Bronce", clase: "es-bronce" };

    const medEl = document.getElementById("matchMedal");
    medEl.className = "quiz-medal " + medalla.clase;
    medEl.textContent = medalla.icono;
    document.getElementById("matchMedalName").textContent = medalla.nombre;
    document.getElementById("matchScoreText").innerHTML =
      `6 parejas en <strong>${segundos.toFixed(1)} s</strong> con <strong>${errores}</strong> error(es)` +
      (errores ? ` · tiempo ajustado ${(ajustado / 1000).toFixed(1)} s` : "");

    const clave = "match-" + unidadActual;
    const previo = Progreso.record(clave);
    const esRecord = Progreso.guardarRecord(clave, ajustado, false);   // menos es mejor
    document.getElementById("matchRecordText").textContent = esRecord
      ? (previo ? "¡Nuevo récord! Antes: " + (previo / 1000).toFixed(1) + " s"
                : "Primer tiempo guardado como tu récord.")
      : "Tu récord sigue siendo " + (previo / 1000).toFixed(1) + " s";

    if (board) board.hidden = true;
    if (hud) hud.hidden = true;
    elPista.hidden = true;
    resultado.hidden = false;

    if (medalla.nombre === "Platino" || medalla.nombre === "Oro") {
      lanzarConfeti(document.getElementById("matchConfetti"));
    }
    window.pintarProgreso();
  }

  function cerrarMatch() {
    pararReloj();
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  if (modal) {
    document.querySelectorAll(".match-card").forEach(c =>
      c.addEventListener("click", () => abrirMatch(c.dataset.match))
    );
    modal.querySelectorAll("[data-close-match]").forEach(el =>
      el.addEventListener("click", cerrarMatch)
    );
    document.getElementById("matchRetry").addEventListener("click", () => abrirMatch(unidadActual));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("open")) cerrarMatch();
    });
  }

  /* Pintar el progreso al cargar la página */
  window.pintarProgreso();
})();
