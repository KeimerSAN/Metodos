<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Buzón de sugerencias | Métodos Numéricos</title>
<meta name="description" content="Buzón interno con los mensajes, dudas y sugerencias enviados desde el formulario de contacto.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=<?php echo @filemtime(__DIR__ . "/styles.css"); ?>">
</head>
<body>

  <a class="skip-link" href="#contenido">Saltar al contenido principal</a>

  <!-- ===================== CABECERA ===================== -->
  <header class="site-header" id="top">

    <!-- Fila 1: barra de utilidades -->
    <div class="masthead-utility">
      <div class="masthead-utility-inner">
        <span class="masthead-course">Aula interactiva &middot; Ingenier&iacute;a de Sistemas</span>
        <span class="masthead-links">
          <a href="manual.html">Manual</a>
          <a href="proyecto.html">Proyecto</a>
          <a href="index.php#contacto">Contacto</a>
        </span>
      </div>
    </div>

    <!-- Fila 2: mancheta con la marca centrada -->
    <div class="masthead">
      <a href="index.php#inicio" class="masthead-brand" aria-label="Inicio &mdash; M&eacute;todos Num&eacute;ricos">
        <span class="masthead-rule" aria-hidden="true"></span>
        <span class="masthead-name">M&eacute;todos<em>Num&eacute;ricos</em></span>
        <span class="masthead-rule" aria-hidden="true"></span>
      </a>
      <p class="masthead-tagline">Fundamentos y errores &middot; M&eacute;todos iterativos &middot; Ecuaciones diferenciales</p>
    </div>

    <!-- Fila 3: navegación principal (queda fija al hacer scroll) -->
    <div class="navbar">
      <div class="navbar-inner">
        <a href="index.php#inicio" class="navbar-compact" aria-hidden="true" tabindex="-1">M&eacute;todos<em>Num&eacute;ricos</em></a>

        <nav class="main-nav" id="mainNav" aria-label="Navegaci&oacute;n principal">
          <a href="index.php#inicio">Inicio</a>
          <div class="nav-dropdown" id="temasDropdown">
            <button class="nav-dropdown-toggle" id="temasDropdownToggle" aria-expanded="false">
              Temas
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          <div class="nav-dropdown-menu nav-mega">
            <div class="nav-mega-col">
              <span class="nav-mega-title">Bloque 1 <em>Fundamentos y Teor&iacute;a de Errores</em></span>
              <a href="temas/metodo-numerico.html"><span class="tag-num">1.1</span> &iquest;Qu&eacute; es un m&eacute;todo num&eacute;rico?</a>
              <a href="temas/representacion.html"><span class="tag-num">1.2</span> Representaci&oacute;n de n&uacute;meros</a>
              <a href="temas/punto-flotante.html"><span class="tag-num">1.3</span> Aritm&eacute;tica de punto flotante</a>
              <a href="temas/errores.html"><span class="tag-num">1.4</span> Errores de redondeo</a>
              <a href="temas/algoritmos-convergencia.html"><span class="tag-num">1.5</span> Algoritmos y convergencia</a>
              <a href="temas/python.html"><span class="tag-num">1.6</span> Python para m&eacute;todos num&eacute;ricos</a>
            </div>
            <div class="nav-mega-col">
              <span class="nav-mega-title">Bloque 2 <em>M&eacute;todos Iterativos y Ra&iacute;ces de Funciones</em></span>
              <a href="temas/solucion-numerica.html"><span class="tag-num">2.1</span> Soluci&oacute;n num&eacute;rica</a>
              <a href="temas/convergencia.html"><span class="tag-num">2.2</span> Tasas de convergencia</a>
              <a href="temas/biseccion.html"><span class="tag-num">2.3</span> M&eacute;todo de bisecci&oacute;n</a>
              <a href="temas/puntofijo.html"><span class="tag-num">2.4</span> Iteraci&oacute;n de punto fijo</a>
              <a href="temas/newton.html"><span class="tag-num">2.5</span> M&eacute;todo de Newton</a>
              <a href="temas/muller.html"><span class="tag-num">2.6</span> M&eacute;todo de Muller</a>
            </div>
            <div class="nav-mega-col">
              <span class="nav-mega-title">Bloque 3 <em>Ecuaciones Diferenciales Ordinarias</em></span>
              <a href="temas/euler.html"><span class="tag-num">3.1</span> M&eacute;todo de Euler</a>
              <a href="temas/taylor.html"><span class="tag-num">3.2</span> M&eacute;todo de Taylor</a>
              <a href="temas/runge-kutta.html"><span class="tag-num">3.3</span> M&eacute;todo de Runge-Kutta</a>
              <a href="temas/multipaso.html"><span class="tag-num">3.4</span> M&eacute;todos multipaso</a>
            </div>
            <a href="index.php#temas" class="nav-dropdown-all">Ver el mapa completo de los 16 temas &rarr;</a>
          </div>
          </div>
          <a href="index.php#juegos">Actividades</a>
          <a href="galeria.html">Galer&iacute;a</a>
          <a href="index.php#certificacion">Certificaci&oacute;n</a>
          <a href="index.php#nosotros">Acerca de</a>
          <a href="index.php#bibliografia">Bibliograf&iacute;a</a>
        </nav>

        <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mainNav" aria-label="Abrir men&uacute;">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

<section class="detail-hero">
  <div class="detail-hero-inner">
    <p class="breadcrumb"><a href="index.php#inicio">Inicio</a><span>/</span>Buzón de sugerencias</p>
    <h1>Buzón de sugerencias</h1>
    <p class="detail-lead">Aquí llegan automáticamente las dudas, sugerencias y errores que los estudiantes reportan desde el formulario de contacto de la página de inicio.</p>
  </div>
</section>

<main class="detail-body" id="contenido">

  <div id="inboxSummary" class="howto-box" style="background:var(--paper-dim); border-color:rgba(14,59,64,0.14); color:var(--ink);">
    <h4 style="color:var(--teal);">Estado del buzón</h4>
    <p id="inboxSummaryText" style="margin:0; color:var(--ink-soft);">Cargando mensajes…</p>
  </div>

  <div id="inboxList" class="inbox-list"></div>

</main>

<footer class="site-footer">
  <div class="footer-bottom" style="max-width:900px; margin:0 auto; border-top:none; padding-top:2.4rem;">
    <span>&copy; <span id="year"></span> MétodosNuméricos. Proyecto académico de Ingeniería de Sistemas.</span>
    <a href="index.php#contacto">Contacto</a>
  </div>
</footer>

<script src="temas/temas.js?v=<?php echo @filemtime(__DIR__ . "/temas/temas.js"); ?>"></script>
<script src="accessibility.js?v=<?php echo @filemtime(__DIR__ . "/accessibility.js"); ?>"></script>
<script>
  document.getElementById("year").textContent = new Date().getFullYear();

  const listEl = document.getElementById("inboxList");
  const summaryEl = document.getElementById("inboxSummaryText");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render(mensajes) {
    if (!mensajes.length) {
      summaryEl.textContent = "Todavía no ha llegado ningún mensaje.";
      listEl.innerHTML = "";
      return;
    }
    const sinLeer = mensajes.filter(m => !m.leido).length;
    summaryEl.textContent = `${mensajes.length} mensaje(s) en total · ${sinLeer} sin leer.`;

    listEl.innerHTML = mensajes.map(m => `
      <article class="inbox-card ${m.leido ? "is-read" : ""}" data-id="${m.id}">
        <div class="inbox-card-head">
          <div>
            <p class="inbox-name">${escapeHtml(m.nombre)} ${m.leido ? "" : '<span class="inbox-badge">Nuevo</span>'}</p>
            <p class="inbox-meta"><a href="mailto:${escapeHtml(m.correo)}">${escapeHtml(m.correo)}</a> &middot; ${escapeHtml(m.fecha)}</p>
            ${m.asunto ? `<p class="inbox-subject">${escapeHtml(m.asunto)}</p>` : ""}
          </div>
          <div class="inbox-actions">
            ${m.leido ? "" : `<button type="button" class="inbox-btn" data-action="leida" data-id="${m.id}">Marcar leída</button>`}
            <button type="button" class="inbox-btn inbox-btn-danger" data-action="eliminar" data-id="${m.id}">Eliminar</button>
          </div>
        </div>
        <p class="inbox-msg">${escapeHtml(m.mensaje)}</p>
      </article>
    `).join("");
  }

  function cargarMensajes() {
    fetch("data/sugerencias.json?_=" + Date.now())
      .then(res => {
        if (!res.ok) throw new Error("sin mensajes aún");
        return res.json();
      })
      .then(render)
      .catch(() => {
        summaryEl.textContent = "Todavía no ha llegado ningún mensaje.";
        listEl.innerHTML = "";
      });
  }

  listEl.addEventListener("click", e => {
    const btn = e.target.closest(".inbox-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    const accion = btn.dataset.action === "leida" ? "marcar_leida" : "eliminar_sugerencia";

    if (accion === "eliminar_sugerencia" && !confirm("¿Eliminar este mensaje del buzón?")) return;

    const datos = new FormData();
    datos.append("accion", accion);
    datos.append("id", id);

    fetch("index.php", { method: "POST", body: datos })
      .then(() => cargarMensajes());
  });

  cargarMensajes();
</script>
</body>
</html>
