// Script ligero compartido por las páginas de detalle (/temas/*.html)
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const dropdown = document.getElementById("temasDropdown");
  const dropToggle = document.getElementById("temasDropdownToggle");
  if (dropdown && dropToggle) {
    dropToggle.addEventListener("click", e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      dropToggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", e => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        dropToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});



/* =========================================================
   CABECERA DE DOS NIVELES
   El header completo es sticky con un desplazamiento negativo
   igual a la altura de la mancheta, de modo que al bajar solo
   queda pegada la fila de navegación. Se marca .esta-fija para
   mostrar entonces la marca reducida.
========================================================= */
(function initCabecera() {
  const header = document.querySelector(".site-header");
  const navbar = document.querySelector(".navbar");
  const util   = document.querySelector(".masthead-utility");
  const mast   = document.querySelector(".masthead");
  if (!header || !navbar || !mast) return;

  function medir() {
    const alto = (util ? util.offsetHeight : 0) + mast.offsetHeight;
    document.documentElement.style.setProperty("--masthead-h", alto + "px");
  }
  medir();
  window.addEventListener("resize", medir);
  window.addEventListener("load", medir);

  // La mancheta sale de pantalla justo cuando la barra queda fija.
  // Se usan las dos vías a la vez: el observador es más eficiente, y el
  // listener de scroll cubre los casos en que aquel no se dispara.
  function marcar() {
    navbar.classList.toggle("esta-fija", mast.getBoundingClientRect().bottom <= 1);
  }
  marcar();
  window.addEventListener("scroll", marcar, { passive: true });
  window.addEventListener("resize", marcar);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(marcar, { threshold: 0 }).observe(mast);
  }
})();

/* =========================================================
   SUMARIO LATERAL DE LAS PÁGINAS DE TEMA
   Se construye a partir de los <h2> del contenido y resalta
   el apartado que se está leyendo.
========================================================= */
(function initSumario() {
  const toc = document.getElementById("detailToc");
  const main = document.querySelector(".detail-main");
  if (!toc || !main) return;

  const titulos = Array.from(main.querySelectorAll("h2"));
  if (!titulos.length) { toc.closest(".detail-aside").hidden = true; return; }

  const enlaces = titulos.map((h, i) => {
    if (!h.id) {
      h.id = "sec-" + (h.textContent || "")
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")   // quitar tildes
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "sec-" + i;
    }
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    toc.appendChild(a);
    return a;
  });

  // Resaltar el apartado visible
  let activo = null;
  function marcar(id) {
    if (activo === id) return;
    activo = id;
    enlaces.forEach(a => a.classList.toggle("esta-activo", a.hash === "#" + id));
  }

  // Se resalta el último título ya superado por el borde superior de lectura
  function alScroll() {
    // Posición del título respecto al documento, independiente de si algún
    // ancestro está posicionado (offsetTop no sería fiable en ese caso).
    const y = window.scrollY + 120;
    let actual = titulos[0];
    for (const h of titulos) {
      const top = h.getBoundingClientRect().top + window.scrollY;
      if (top <= y) actual = h; else break;
    }
    if (actual) marcar(actual.id);
  }
  alScroll();
  window.addEventListener("scroll", alScroll, { passive: true });
  window.addEventListener("resize", alScroll);
  window.addEventListener("load", alScroll);
})();
