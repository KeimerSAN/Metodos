<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


// =============================
// ENVIAR CERTIFICADO
// =============================

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"]) && $_POST["accion"] == "enviar_certificado") {


  $nombre = $_POST["nombre"];
  $correo = $_POST["correo"];
  $imagen = $_POST["imagen"];


  // quitar formato base64
  $imagen = str_replace(
    "data:image/png;base64,",
    "",
    $imagen
  );

  $imagen = str_replace(" ", "+", $imagen);


  // crear archivo temporal (ruta absoluta + nombre único para evitar colisiones
  // entre envíos simultáneos y el warning de unlink por ruta relativa)
  $archivo = __DIR__ . "/tmp_certs/" . uniqid("certificado_") . ".png";

  if (!is_dir(__DIR__ . "/tmp_certs")) {
    mkdir(__DIR__ . "/tmp_certs", 0755, true);
  }

  file_put_contents(
    $archivo,
    base64_decode($imagen)
  );


  $mail = new PHPMailer(true);


  try {


    // SMTP
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;


    $mail->Username = "darkbecerra412@gmail.com";
    $mail->Password = "gmhp oiki qyla dqgy";


    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;


    // Remitente
    $mail->setFrom(
      "darkbecerra412@gmail.com",
      "Metodos Numericos"
    );


    // Destino
    $mail->addAddress(
      $correo,
      $nombre
    );


    // Adjuntar imagen
    $mail->addAttachment(
      $archivo,
      "Certificado_Metodos_Numericos.png"
    );


    $mail->isHTML(true);

    $mail->Subject = "Certificado Metodos Numericos";


    $mail->Body = "
            <h2>Felicitaciones $nombre</h2>
            <p>Has aprobado la evaluación de Métodos Numéricos.</p>
            <p>Adjunto está tu certificado.</p>
        ";


    $mail->send();


    if (file_exists($archivo)) {
      unlink($archivo);
    }


    echo "Certificado enviado correctamente";
    exit;
  } catch (Exception $e) {

    if (file_exists($archivo)) {
      unlink($archivo);
    }

    echo "Error: " . $mail->ErrorInfo;
    exit;
  }
}


// =============================
// GUARDAR SUGERENCIA / MENSAJE DE CONTACTO
// =============================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"]) && $_POST["accion"] == "enviar_sugerencia") {

  $nombreSug  = trim($_POST["nombre"] ?? "");
  $correoSug  = trim($_POST["correo"] ?? "");
  $asuntoSug  = trim($_POST["asunto"] ?? "Sin asunto");
  $mensajeSug = trim($_POST["mensaje"] ?? "");

  if ($nombreSug === "" || $correoSug === "" || $mensajeSug === "") {
    echo "Error: faltan datos del formulario.";
    exit;
  }

  $dataDir = __DIR__ . "/data";
  if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
  }
  $archivoSug = $dataDir . "/sugerencias.json";

  $lista = [];
  if (file_exists($archivoSug)) {
    $contenido = file_get_contents($archivoSug);
    $decodificado = json_decode($contenido, true);
    if (is_array($decodificado)) {
      $lista = $decodificado;
    }
  }

  $lista[] = [
    "id"      => uniqid("sug_"),
    "nombre"  => $nombreSug,
    "correo"  => $correoSug,
    "asunto"  => $asuntoSug,
    "mensaje" => $mensajeSug,
    "fecha"   => date("Y-m-d H:i:s"),
    "leido"   => false,
  ];

  // más recientes primero
  usort($lista, function ($a, $b) {
    return strtotime($b["fecha"]) <=> strtotime($a["fecha"]);
  });

  file_put_contents($archivoSug, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

  echo "¡Gracias! Tu mensaje quedó registrado en el buzón de sugerencias.";
  exit;
}


// =============================
// MARCAR SUGERENCIA COMO LEÍDA / ELIMINAR (usado por buzon.php)
// =============================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"]) && in_array($_POST["accion"], ["marcar_leida", "eliminar_sugerencia"])) {

  $id = $_POST["id"] ?? "";
  $dataDir = __DIR__ . "/data";
  $archivoSug = $dataDir . "/sugerencias.json";

  if ($id !== "" && file_exists($archivoSug)) {
    $contenido = file_get_contents($archivoSug);
    $lista = json_decode($contenido, true);
    if (is_array($lista)) {
      if ($_POST["accion"] === "marcar_leida") {
        foreach ($lista as &$item) {
          if ($item["id"] === $id) { $item["leido"] = true; }
        }
        unset($item);
      } else {
        $lista = array_values(array_filter($lista, function ($item) use ($id) {
          return $item["id"] !== $id;
        }));
      }
      file_put_contents($archivoSug, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
  }

  echo "ok";
  exit;
}


$mail = new PHPMailer(true);

?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Métodos Numéricos | Aula interactiva</title>
  <meta name="description" content="Aula interactiva de métodos numéricos con 16 temas en tres unidades: teoría de errores y punto flotante, solución de ecuaciones de una variable (bisección, punto fijo, Newton, Muller) e integración de ecuaciones diferenciales (Euler, Taylor, Runge-Kutta, multipaso). Aprende, juega y obtén tu certificado.">
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

  <!-- ===================== HERO ===================== -->
  <section class="hero" id="inicio">
    <div class="hero-rules" aria-hidden="true"></div>
    <div class="hero-inner">

      <div class="hero-copy">
        <p class="eyebrow">Aula interactiva &middot; Ingenier&iacute;a de Sistemas</p>
        <h1>M&eacute;todos num&eacute;ricos,<br><span>de la teor&iacute;a al c&oacute;digo.</span></h1>
        <p class="hero-lead">Un curso completo en tres unidades: teor&iacute;a de errores y aritm&eacute;tica del computador, soluci&oacute;n de ecuaciones de una variable e integraci&oacute;n num&eacute;rica de ecuaciones diferenciales. Cada tema con su algoritmo, su ejercicio resuelto y su implementaci&oacute;n en Python.</p>

        <div class="hero-actions">
          <a href="#temas" class="btn btn-primary">Explorar los 16 temas</a>
          <a href="#certificacion" class="btn btn-ghost">Obtener el certificado</a>
        </div>

        <div class="hero-links">
          <a href="proyecto.html">Documentaci&oacute;n del proyecto</a>
          <a href="manual.html">Manual de usuario</a>
          <a href="#bibliografia">Bibliograf&iacute;a</a>
        </div>

        <dl class="hero-stats">
          <div>
            <dt>16</dt>
            <dd>temas desarrollados</dd>
          </div>
          <div>
            <dt>80</dt>
            <dd>preguntas de pr&aacute;ctica</dd>
          </div>
          <div>
            <dt>32</dt>
            <dd>videos explicativos</dd>
          </div>
          <div>
            <dt>5</dt>
            <dd>juegos interactivos</dd>
          </div>
        </dl>
      </div>

      <!-- Mosaico: una tarjeta por unidad, en lugar de una ilustracion -->
      <nav class="hero-mosaic" aria-label="Unidades del curso">
        <a class="unit-tile unit-tile-1" href="#temas" data-tab-link="u1">
          <span class="unit-tile-num">01</span>
          <span class="unit-tile-body">
            <strong>Fundamentos y Teor&iacute;a de Errores</strong>
            <span class="unit-tile-desc">Representaci&oacute;n binaria, punto flotante, propagaci&oacute;n del error y Python.</span>
          </span>
          <span class="unit-tile-foot">
            <span class="unit-tile-count">6 temas</span>
            <span class="unit-tile-go" aria-hidden="true">&rarr;</span>
          </span>
        </a>

        <a class="unit-tile unit-tile-2" href="#temas" data-tab-link="u2">
          <span class="unit-tile-num">02</span>
          <span class="unit-tile-body">
            <strong>M&eacute;todos Iterativos y Ra&iacute;ces de Funciones</strong>
            <span class="unit-tile-desc">Convergencia, bisecci&oacute;n, punto fijo, Newton y Muller.</span>
          </span>
          <span class="unit-tile-foot">
            <span class="unit-tile-count">6 temas</span>
            <span class="unit-tile-go" aria-hidden="true">&rarr;</span>
          </span>
        </a>

        <a class="unit-tile unit-tile-3" href="#temas" data-tab-link="u3">
          <span class="unit-tile-num">03</span>
          <span class="unit-tile-body">
            <strong>Ecuaciones Diferenciales Ordinarias</strong>
            <span class="unit-tile-desc">Euler, Taylor, Runge-Kutta y m&eacute;todos multipaso.</span>
          </span>
          <span class="unit-tile-foot">
            <span class="unit-tile-count">4 temas</span>
            <span class="unit-tile-go" aria-hidden="true">&rarr;</span>
          </span>
        </a>
      </nav>

    </div>
  </section>

  <!-- ===================== ÍNDICE DEL CURSO ===================== -->
  <section class="toc-section" aria-labelledby="toc-titulo">
    <div class="toc-inner">
      <div class="toc-head">
        <p class="eyebrow">Tabla de contenidos</p>
        <h2 id="toc-titulo">Los 16 temas, de principio a fin</h2>
        <p class="section-lead">Cada tema abre su propia p&aacute;gina con teor&iacute;a, algoritmo, ejercicios resueltos paso a paso, dos videos y su implementaci&oacute;n en Python.</p>
      </div>
      <div class="toc-grid">
        <a class="toc-row" href="temas/metodo-numerico.html">
          <span class="toc-num">1.1</span>
          <span class="toc-name">&iquest;Qu&eacute; es un m&eacute;todo num&eacute;rico?</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/representacion.html">
          <span class="toc-num">1.2</span>
          <span class="toc-name">Representaci&oacute;n de n&uacute;meros en el computador</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/punto-flotante.html">
          <span class="toc-num">1.3</span>
          <span class="toc-name">Aritm&eacute;tica de punto flotante</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/errores.html">
          <span class="toc-num">1.4</span>
          <span class="toc-name">Errores de redondeo</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/algoritmos-convergencia.html">
          <span class="toc-num">1.5</span>
          <span class="toc-name">Algoritmos y convergencia</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/python.html">
          <span class="toc-num">1.6</span>
          <span class="toc-name">Introducci&oacute;n a Python</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/solucion-numerica.html">
          <span class="toc-num">2.1</span>
          <span class="toc-name">Soluci&oacute;n num&eacute;rica de ecuaciones</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/convergencia.html">
          <span class="toc-num">2.2</span>
          <span class="toc-name">Tasas de convergencia</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/biseccion.html">
          <span class="toc-num">2.3</span>
          <span class="toc-name">El algoritmo de bisecci&oacute;n</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/puntofijo.html">
          <span class="toc-num">2.4</span>
          <span class="toc-name">Iteraci&oacute;n de punto fijo</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/newton.html">
          <span class="toc-num">2.5</span>
          <span class="toc-name">M&eacute;todo de Newton</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/muller.html">
          <span class="toc-num">2.6</span>
          <span class="toc-name">M&eacute;todo de Muller</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/euler.html">
          <span class="toc-num">3.1</span>
          <span class="toc-name">M&eacute;todo de Euler</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/taylor.html">
          <span class="toc-num">3.2</span>
          <span class="toc-name">M&eacute;todo de Taylor</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/runge-kutta.html">
          <span class="toc-num">3.3</span>
          <span class="toc-name">M&eacute;todo de Runge-Kutta</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
        <a class="toc-row" href="temas/multipaso.html">
          <span class="toc-num">3.4</span>
          <span class="toc-name">M&eacute;todos multipaso</span>
          <span class="toc-line" aria-hidden="true"></span>
          <span class="toc-go" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== TEMAS ===================== -->
  <section class="section" id="temas">
    <div class="section-inner">
      <p class="section-index"><span class="section-index-num">I</span><span class="section-index-label">Contenido</span></p>
      <h2>Los 16 temas del curso, en tres bloques</h2>
      <p class="section-lead">Cada tema tiene su propia p&aacute;gina con teor&iacute;a, algoritmo, ejercicios resueltos paso a paso, c&oacute;digo en Python, errores comunes y bibliograf&iacute;a.</p>

      <div class="tabs" id="tabs">
        <div class="tab-list" role="tablist" aria-label="Selecciona un bloque tem&aacute;tico">
          <button class="tab-btn active" role="tab" aria-selected="true" aria-controls="panel-u1" data-tab="u1">Fundamentos y Teor&iacute;a de Errores</button>
          <button class="tab-btn" role="tab" aria-selected="false" aria-controls="panel-u2" data-tab="u2">M&eacute;todos Iterativos y Ra&iacute;ces de Funciones</button>
          <button class="tab-btn" role="tab" aria-selected="false" aria-controls="panel-u3" data-tab="u3">Ecuaciones Diferenciales Ordinarias</button>
        </div>

        <div class="tab-panel active" id="panel-u1" role="tabpanel" aria-labelledby="tab-u1">
          <p class="unit-intro">Los cimientos: qu&eacute; es aproximar, c&oacute;mo guarda n&uacute;meros el computador y c&oacute;mo se mide el error que cometemos.</p>
          <div class="topic-card-grid">
            <article class="topic-card">
              <span class="topic-card-num">1.1</span>
              <h3>&iquest;Qu&eacute; es un m&eacute;todo num&eacute;rico?</h3>
              <p>Por qu&eacute; la ingenier&iacute;a cambia la respuesta exacta por una aproximaci&oacute;n con error controlado.</p>
              <p class="topic-card-formula">|x<sub>n+1</sub> &minus; x<sub>n</sub>| &lt; &epsilon;</p>
              <a class="topic-card-link" href="temas/metodo-numerico.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">1.2</span>
              <h3>Representaci&oacute;n de n&uacute;meros</h3>
              <p>Binario, complemento a dos y el est&aacute;ndar IEEE 754 de 32 y 64 bits.</p>
              <p class="topic-card-formula">x = (&minus;1)<sup>s</sup> &middot; 1.m &middot; 2<sup>e&minus;sesgo</sup></p>
              <a class="topic-card-link" href="temas/representacion.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">1.3</span>
              <h3>Aritm&eacute;tica de punto flotante</h3>
              <p>&Eacute;psilon de m&aacute;quina, cancelaci&oacute;n catastr&oacute;fica y p&eacute;rdida de asociatividad.</p>
              <p class="topic-card-formula">&epsilon;<sub>m</sub> &asymp; 2.22 &times; 10<sup>&minus;16</sup></p>
              <a class="topic-card-link" href="temas/punto-flotante.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">1.4</span>
              <h3>Errores de redondeo</h3>
              <p>Error absoluto, relativo y porcentual, cifras significativas y propagaci&oacute;n.</p>
              <p class="topic-card-formula">E<sub>r</sub> = E<sub>a</sub> / |valor verdadero|</p>
              <a class="topic-card-link" href="temas/errores.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">1.5</span>
              <h3>Algoritmos y convergencia</h3>
              <p>Estabilidad frente al redondeo, orden de convergencia y notaci&oacute;n O grande.</p>
              <p class="topic-card-formula">e<sub>n+1</sub> &asymp; &lambda; &middot; e<sub>n</sub><sup>&alpha;</sup></p>
              <a class="topic-card-link" href="temas/algoritmos-convergencia.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">1.6</span>
              <h3>Python para m&eacute;todos num&eacute;ricos</h3>
              <p>NumPy, SciPy y Matplotlib, con bisecci&oacute;n implementada l&iacute;nea a l&iacute;nea.</p>
              <p class="topic-card-formula">abs(a &minus; b) &lt; tol</p>
              <a class="topic-card-link" href="temas/python.html">Estudiar este tema &rarr;</a>
            </article>
          </div>
        </div>

        <div class="tab-panel" id="panel-u2" role="tabpanel" aria-labelledby="tab-u2" hidden>
          <p class="unit-intro">Seis formas distintas de resolver f(x) = 0, desde la m&aacute;s lenta y segura hasta la m&aacute;s r&aacute;pida y arriesgada.</p>
          <div class="topic-card-grid">
            <article class="topic-card">
              <span class="topic-card-num">2.1</span>
              <h3>Soluci&oacute;n num&eacute;rica</h3>
              <p>El planteamiento general: sucesiones de aproximaciones y criterios de parada.</p>
              <p class="topic-card-formula">|f(x<sub>n</sub>)| &lt; &epsilon;</p>
              <a class="topic-card-link" href="temas/solucion-numerica.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">2.2</span>
              <h3>Tasas de convergencia</h3>
              <p>Lineal, superlineal y cuadr&aacute;tico: cu&aacute;ntas iteraciones cuesta cada m&eacute;todo.</p>
              <p class="topic-card-formula">&alpha; = 1, 1.618, 1.84 &oacute; 2</p>
              <a class="topic-card-link" href="temas/convergencia.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">2.3</span>
              <h3>M&eacute;todo de bisecci&oacute;n</h3>
              <p>Divide un intervalo con cambio de signo hasta acorralar la ra&iacute;z. Nunca falla, pero es lento.</p>
              <p class="topic-card-formula">c = (a + b) / 2</p>
              <a class="topic-card-link" href="temas/biseccion.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">2.4</span>
              <h3>Iteraci&oacute;n de punto fijo</h3>
              <p>Reescribe f(x) = 0 como x = g(x) y deja que la funci&oacute;n converja sola.</p>
              <p class="topic-card-formula">x<sub>n+1</sub> = g(x<sub>n</sub>)</p>
              <a class="topic-card-link" href="temas/puntofijo.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">2.5</span>
              <h3>M&eacute;todo de Newton</h3>
              <p>Sigue la recta tangente hasta el eje x. Duplica las cifras correctas en cada paso.</p>
              <p class="topic-card-formula">x<sub>n+1</sub> = x<sub>n</sub> &minus; f/f&prime;</p>
              <a class="topic-card-link" href="temas/newton.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">2.6</span>
              <h3>M&eacute;todo de Muller</h3>
              <p>Ajusta una par&aacute;bola por tres puntos y alcanza incluso ra&iacute;ces complejas.</p>
              <p class="topic-card-formula">p(x) = a(x&minus;x&#8322;)&sup2; + b(x&minus;x&#8322;) + c</p>
              <a class="topic-card-link" href="temas/muller.html">Estudiar este tema &rarr;</a>
            </article>
          </div>
        </div>

        <div class="tab-panel" id="panel-u3" role="tabpanel" aria-labelledby="tab-u3" hidden>
          <p class="unit-intro">Integrar y&prime; = f(t, y) paso a paso: el mismo problema resuelto con cuatro m&eacute;todos de precisi&oacute;n creciente.</p>
          <div class="topic-card-grid">
            <article class="topic-card">
              <span class="topic-card-num">3.1</span>
              <h3>M&eacute;todo de Euler</h3>
              <p>Avanzar siguiendo la tangente. El m&aacute;s simple de todos, de primer orden.</p>
              <p class="topic-card-formula">y<sub>n+1</sub> = y<sub>n</sub> + h &middot; f(t<sub>n</sub>, y<sub>n</sub>)</p>
              <a class="topic-card-link" href="temas/euler.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">3.2</span>
              <h3>M&eacute;todo de Taylor</h3>
              <p>Conservar m&aacute;s t&eacute;rminos de la serie para ganar orden, a costa de derivar f.</p>
              <p class="topic-card-formula">+ (h&sup2;/2) f&prime; + (h&sup3;/6) f&Prime; + &hellip;</p>
              <a class="topic-card-link" href="temas/taylor.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">3.3</span>
              <h3>M&eacute;todo de Runge-Kutta</h3>
              <p>Orden 4 sin derivar nada: cuatro pendientes bien colocadas y un promedio ponderado.</p>
              <p class="topic-card-formula">y<sub>n+1</sub> = y<sub>n</sub> + (k&#8321;+2k&#8322;+2k&#8323;+k&#8324;)/6</p>
              <a class="topic-card-link" href="temas/runge-kutta.html">Estudiar este tema &rarr;</a>
            </article>
            <article class="topic-card">
              <span class="topic-card-num">3.4</span>
              <h3>M&eacute;todos multipaso</h3>
              <p>Adams-Bashforth predice y Adams-Moulton corrige, reutilizando el historial.</p>
              <p class="topic-card-formula">y<sub>n+1</sub> = y<sub>n</sub> + (h/24)(55f<sub>n</sub> &minus; 59f<sub>n&minus;1</sub> + &hellip;)</p>
              <a class="topic-card-link" href="temas/multipaso.html">Estudiar este tema &rarr;</a>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== JUEGOS ===================== -->
  <section class="section section-alt" id="juegos">
    <div class="section-inner">
      <p class="section-index"><span class="section-index-num">II</span><span class="section-index-label">Pr&aacute;ctica</span></p>
      <h2>Actividades y juegos por bloque</h2>
      <p class="section-lead">Diez preguntas por bloque tem&aacute;tico, elegidas al azar del banco completo y con retroalimentaci&oacute;n inmediata. Cada intento es distinto.</p>

      <div class="game-cards" id="gameCards">
        <button class="game-card" data-topic="u1">
          <span class="game-card-icon">&epsilon;</span>
          <h3>Bloque 1 &middot; Fundamentos y errores</h3>
          <p>10 preguntas &middot; 6 temas &middot; representaci&oacute;n, punto flotante, errores, convergencia y Python</p>
          <span class="game-card-cta">Jugar &rarr;</span>
        </button>
        <button class="game-card" data-topic="u2">
          <span class="game-card-icon">f(x)=0</span>
          <h3>Bloque 2 &middot; M&eacute;todos iterativos</h3>
          <p>10 preguntas &middot; 6 temas &middot; bisecci&oacute;n, punto fijo, Newton, Muller y convergencia</p>
          <span class="game-card-cta">Jugar &rarr;</span>
        </button>
        <button class="game-card" data-topic="u3">
          <span class="game-card-icon">y&prime;</span>
          <h3>Bloque 3 &middot; Ecuaciones diferenciales</h3>
          <p>10 preguntas &middot; 4 temas &middot; Euler, Taylor, Runge-Kutta y multipaso</p>
          <span class="game-card-cta">Jugar &rarr;</span>
        </button>
      </div>

      <!-- Dificultad -->
      <div class="difficulty-bar">
        <span class="difficulty-label">Dificultad</span>
        <div class="difficulty-options" role="radiogroup" aria-label="Nivel de dificultad">
          <button type="button" class="difficulty-btn" data-dif="facil" role="radio" aria-checked="false">
            F&aacute;cil <em>30 s &middot; 5 vidas</em>
          </button>
          <button type="button" class="difficulty-btn is-active" data-dif="normal" role="radio" aria-checked="true">
            Normal <em>20 s &middot; 3 vidas</em>
          </button>
          <button type="button" class="difficulty-btn" data-dif="dificil" role="radio" aria-checked="false">
            Dif&iacute;cil <em>12 s &middot; 2 vidas</em>
          </button>
        </div>
      </div>

      <div class="topic-quiz-block">
        <p class="eyebrow">Tambi&eacute;n puedes practicar tema por tema</p>
        <div class="topic-quiz-chips" id="topicQuizChips">
          <button class="topic-chip" data-topic="metodo">&iquest;Qu&eacute; es un m&eacute;todo num&eacute;rico?</button>
          <button class="topic-chip" data-topic="representacion">Representaci&oacute;n de n&uacute;meros</button>
          <button class="topic-chip" data-topic="flotante">Punto flotante</button>
          <button class="topic-chip" data-topic="errores">Errores de redondeo</button>
          <button class="topic-chip" data-topic="algoritmos">Algoritmos y convergencia</button>
          <button class="topic-chip" data-topic="python">Python</button>
          <button class="topic-chip" data-topic="intro">Soluci&oacute;n num&eacute;rica</button>
          <button class="topic-chip" data-topic="tasas">Tasas de convergencia</button>
          <button class="topic-chip" data-topic="biseccion">Bisecci&oacute;n</button>
          <button class="topic-chip" data-topic="puntofijo">Punto fijo</button>
          <button class="topic-chip" data-topic="newton">Newton</button>
          <button class="topic-chip" data-topic="muller">Muller</button>
          <button class="topic-chip" data-topic="euler">Euler</button>
          <button class="topic-chip" data-topic="taylor">Taylor</button>
          <button class="topic-chip" data-topic="rungekutta">Runge-Kutta</button>
          <button class="topic-chip" data-topic="multipaso">Multipaso</button>
        </div>
      </div>

      <!-- Juego de emparejar, uno por unidad -->
      <div class="match-block">
        <p class="eyebrow">Juego &middot; Empareja</p>
        <h3>Empareja cada concepto con su f&oacute;rmula</h3>
        <p class="section-lead">Otro tipo de actividad: se muestran seis conceptos y seis f&oacute;rmulas desordenadas. Toca uno de cada lado para emparejarlos, contrarreloj.</p>
        <div class="match-cards">
          <button class="match-card" data-match="u1">
            <span class="match-card-icon">&epsilon;</span>
            <h4>Bloque 1</h4>
            <p>Conceptos de error y punto flotante con su definici&oacute;n</p>
            <span class="match-card-best" data-best="match-u1"></span>
          </button>
          <button class="match-card" data-match="u2">
            <span class="match-card-icon">f(x)=0</span>
            <h4>Bloque 2</h4>
            <p>Cada m&eacute;todo de b&uacute;squeda de ra&iacute;ces con su f&oacute;rmula</p>
            <span class="match-card-best" data-best="match-u2"></span>
          </button>
          <button class="match-card" data-match="u3">
            <span class="match-card-icon">y&prime;</span>
            <h4>Bloque 3</h4>
            <p>Cada m&eacute;todo de EDO con su expresi&oacute;n caracter&iacute;stica</p>
            <span class="match-card-best" data-best="match-u3"></span>
          </button>
        </div>
      </div>

      <!-- Progreso del estudiante -->
      <div class="progress-block" id="progressBlock">
        <div class="progress-head">
          <div>
            <p class="eyebrow">Tu progreso</p>
            <h3>Dominio por bloque tem&aacute;tico</h3>
            <p class="section-lead">Se calcula con las preguntas que has respondido bien al menos una vez. Se guarda en tu navegador; nadie m&aacute;s lo ve.</p>
          </div>
          <button type="button" class="btn btn-ghost progress-reset" id="progressReset">Reiniciar progreso</button>
        </div>
        <div class="progress-grid" id="progressGrid"></div>
        <div class="review-banner" id="reviewBanner" hidden>
          <div>
            <p class="eyebrow">Repaso inteligente</p>
            <h4><span id="reviewCount">0</span> preguntas que has fallado</h4>
            <p>Practica solo con las que se te han resistido. Cuando aciertes una, sale de la lista.</p>
          </div>
          <button class="btn btn-primary" id="reviewBtn">Repasar mis fallos &rarr;</button>
        </div>
      </div>

      <div class="integrated-quiz-banner">
        <div class="integrated-quiz-text">
          <p class="eyebrow">Integrado &middot; 16 temas</p>
          <h3>Quiz de repaso general</h3>
          <p>20 preguntas mezclando las tres unidades del curso. Cada intento elige preguntas distintas de las 80 del banco completo.</p>
        </div>
        <button class="btn btn-primary integrated-quiz-btn" id="integratedQuizBtn">Jugar quiz integrado &rarr;</button>
      </div>

      <div class="challenge-banner">
        <div class="challenge-text">
          <p class="eyebrow">Bonus &middot; Contrarreloj</p>
          <h3>&iquest;Te atreves con el Desaf&iacute;o?</h3>
          <p>60 segundos, preguntas de todo el curso mezcladas, combos por aciertos seguidos y r&eacute;cord personal guardado en tu navegador.</p>
        </div>
        <a href="desafio.html" class="btn btn-primary challenge-btn">Jugar el Desaf&iacute;o &rarr;</a>
      </div>

      <div class="challenge-banner" style="margin-top:1.2rem;">
        <div class="challenge-text">
          <p class="eyebrow">Bonus &middot; Arcade</p>
          <h3>Esquiva y Responde</h3>
          <p>Un mu&ntilde;eco esquiva rocas mientras le llegan preguntas de Verdadero o Falso. Entre m&aacute;s esquives, m&aacute;s preguntas respondes &mdash; y la velocidad sube con el tiempo.</p>
        </div>
        <a href="esquiva.html" class="btn btn-primary challenge-btn">Jugar Esquiva y Responde &rarr;</a>
      </div>
    </div>
  </section>

  <!-- Modal de juego por tema -->
  <div class="modal" id="quizModal" aria-hidden="true">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-box quiz-box" role="dialog" aria-modal="true" aria-labelledby="quizModalTitle">
      <button class="modal-close" data-close aria-label="Cerrar">&times;</button>
      <p class="eyebrow" id="quizModalTag">Tema</p>
      <h3 id="quizModalTitle">Juego de preguntas</h3>

      <!-- Marcador de la partida -->
      <div class="quiz-hud" id="quizHud">
        <div class="quiz-hud-cell">
          <span class="hud-k">Vidas</span>
          <span class="hud-v hud-lives" id="quizLives" aria-live="polite"></span>
        </div>
        <div class="quiz-hud-cell">
          <span class="hud-k">Racha</span>
          <span class="hud-v" id="quizStreak">0</span>
        </div>
        <div class="quiz-hud-cell">
          <span class="hud-k">Puntos</span>
          <span class="hud-v" id="quizPoints">0</span>
        </div>
        <div class="quiz-timer" id="quizTimer" role="timer" aria-label="Tiempo restante de la pregunta">
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle class="quiz-timer-track" cx="22" cy="22" r="19"></circle>
            <circle class="quiz-timer-fill" id="quizTimerFill" cx="22" cy="22" r="19"></circle>
          </svg>
          <span id="quizTimerNum">20</span>
        </div>
      </div>

      <div class="quiz-segments" id="quizSegments" aria-hidden="true"></div>

      <div id="quizBody"></div>

      <div class="quiz-result" id="quizResult" hidden>
        <div class="quiz-medal" id="quizMedal" aria-hidden="true"></div>
        <p class="quiz-medal-name" id="quizMedalName"></p>
        <p class="quiz-score" id="quizScoreText"></p>
        <p class="quiz-points-total" id="quizPointsText"></p>
        <p class="quiz-msg" id="quizMsgText"></p>
        <p class="quiz-record" id="quizRecordText"></p>
        <div class="quiz-result-actions">
          <button class="btn btn-primary" id="quizRetry">Repetir juego</button>
          <button class="btn btn-ghost" id="quizReviewFails" hidden>Repasar mis fallos</button>
        </div>
      </div>

      <canvas class="quiz-confetti" id="quizConfetti" aria-hidden="true"></canvas>
    </div>
  </div>

  <!-- Modal del juego de emparejar -->
  <div class="modal" id="matchModal" aria-hidden="true">
    <div class="modal-backdrop" data-close-match></div>
    <div class="modal-box match-box" role="dialog" aria-modal="true" aria-labelledby="matchTitle">
      <button class="modal-close" data-close-match aria-label="Cerrar">&times;</button>
      <p class="eyebrow" id="matchTag">Empareja</p>
      <h3 id="matchTitle">Empareja cada concepto con su f&oacute;rmula</h3>

      <div class="match-hud">
        <div class="quiz-hud-cell"><span class="hud-k">Parejas</span><span class="hud-v" id="matchDone">0 / 6</span></div>
        <div class="quiz-hud-cell"><span class="hud-k">Errores</span><span class="hud-v" id="matchErrors">0</span></div>
        <div class="quiz-hud-cell"><span class="hud-k">Tiempo</span><span class="hud-v" id="matchTime">0.0 s</span></div>
      </div>

      <div class="match-board">
        <div class="match-col" id="matchLeft" role="group" aria-label="Conceptos"></div>
        <div class="match-col" id="matchRight" role="group" aria-label="F&oacute;rmulas y definiciones"></div>
      </div>

      <p class="match-hint" id="matchHint">Toca un concepto de la izquierda y luego su pareja de la derecha.</p>

      <div class="match-result" id="matchResult" hidden>
        <div class="quiz-medal" id="matchMedal" aria-hidden="true"></div>
        <p class="quiz-medal-name" id="matchMedalName"></p>
        <p class="quiz-score" id="matchScoreText"></p>
        <p class="quiz-record" id="matchRecordText"></p>
        <div class="quiz-result-actions">
          <button class="btn btn-primary" id="matchRetry">Jugar otra vez</button>
        </div>
      </div>

      <canvas class="quiz-confetti" id="matchConfetti" aria-hidden="true"></canvas>
    </div>
  </div>

  <!-- ===================== CERTIFICACIÓN ===================== -->
  <section class="section" id="certificacion">
    <div class="section-inner">
      <p class="section-index"><span class="section-index-num">III</span><span class="section-index-label">Evaluaci&oacute;n</span></p>
      <h2>Obtén tu certificado</h2>
      <p class="section-lead">Ingresa tus datos, responde 15 preguntas mezclando los 16 temas del curso y consigue el 80% o más para descargar tu certificado.</p>

      <div class="cert-panel">

        <!-- Paso 1: datos del aspirante -->
        <div class="cert-start" id="certStart">
          <div class="cert-start-info">
            <span class="cert-seal" aria-hidden="true">&#9733;</span>
            <h3>Antes de empezar</h3>
            <ul class="cert-rules">
              <li><span class="cert-rule-num">15</span> preguntas tomadas al azar de los 16 temas del curso.</li>
              <li><span class="cert-rule-num">80%</span> es el m&iacute;nimo para aprobar: 12 respuestas correctas.</li>
              <li><span class="cert-rule-num">&#8734;</span> intentos disponibles; cada intento cambia las preguntas.</li>
              <li><span class="cert-rule-num">PNG</span> el certificado se descarga o se env&iacute;a a tu correo.</li>
            </ul>
            <p class="cert-privacy">
              <span aria-hidden="true">&#128274;</span>
              Tu nombre y tu correo se usan solo para escribir el certificado y envi&aacute;rtelo. No se guardan en ninguna lista ni se comparten.
            </p>
          </div>

          <form class="cert-login" id="certLoginForm" novalidate>
            <p class="cert-form-title">Datos para tu certificado</p>

            <div class="field">
              <label for="certName">Nombre completo <span class="req" aria-hidden="true">*</span></label>
              <input type="text" id="certName" name="certName" required minlength="3"
                     autocomplete="name" placeholder="Ej. Laura Ram&iacute;rez"
                     aria-describedby="errCertName certPreviewNote">
              <p class="field-error" id="errCertName" role="alert"></p>
            </div>

            <div class="field">
              <label for="certEmail">Correo electr&oacute;nico <span class="req" aria-hidden="true">*</span></label>
              <input type="email" id="certEmail" name="certEmail" required
                     autocomplete="email" placeholder="tucorreo@dominio.com"
                     aria-describedby="errCertEmail">
              <p class="field-error" id="errCertEmail" role="alert"></p>
            </div>

            <!-- Vista previa del nombre tal como saldr&aacute; impreso -->
            <div class="cert-preview" aria-live="polite">
              <span class="cert-preview-label">As&iacute; aparecer&aacute; en tu certificado</span>
              <span class="cert-preview-name" id="certPreviewName">Tu nombre aqu&iacute;</span>
              <span class="cert-preview-note" id="certPreviewNote">Escribe tu nombre como quieres que quede impreso.</span>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="certStartBtn">
              Iniciar la evaluaci&oacute;n &rarr;
            </button>
            <p class="field-note" id="certStartNote">Al comenzar se cargan las 15 preguntas. Puedes salir y volver a intentarlo cuando quieras.</p>
          </form>
        </div>

        <!-- Paso 2: examen -->
        <div class="cert-exam" id="certExam" hidden>
          <div class="cert-exam-head">
            <p class="eyebrow">Evaluaci&oacute;n en curso</p>
            <p class="cert-exam-for" id="certExamFor"></p>
          </div>
          <div class="quiz-segments" id="certSegments" aria-hidden="true"></div>
          <div class="quiz-progress">
            <div class="quiz-progress-bar" id="certProgressBar"></div>
          </div>
          <div id="certExamBody"></div>
        </div>

        <!-- Paso 3a: aprobado -->
        <div class="cert-pass" id="certPass" hidden>
          <span class="badge badge-pass">Aprobado</span>
          <p class="cert-score" id="certPassScore"></p>
          <div class="certificate" id="certificateCanvas-wrap">
            <canvas id="certificateCanvas" width="1000" height="700"></canvas>
          </div>
          <div class="cert-actions">
            <button class="btn btn-primary" id="certDownload">Descargar certificado (PNG)</button>
            <button class="btn btn-ghost" id="certSend">Enviar a mi correo</button>
          </div>
          <p class="field-note" id="certSendNote"></p>
        </div>

        <!-- Paso 3b: reprobado -->
        <div class="cert-fail" id="certFail" hidden>
          <span class="badge badge-fail">Aún no</span>
          <p class="cert-score" id="certFailScore"></p>
          <p>No alcanzaste el 80% requerido. Repasa los temas señalados y vuelve a intentarlo cuando quieras.</p>
          <ul class="weak-topics" id="weakTopicsList"></ul>
          <button class="btn btn-primary" id="certRetry">Repasar e intentar de nuevo</button>
        </div>

      </div>
    </div>
  </section>

  <!-- ===================== NOSOTROS ===================== -->
  <section class="section section-alt" id="nosotros">
    <div class="section-inner nosotros-grid">
      <div>
        <p class="section-index"><span class="section-index-num">IV</span><span class="section-index-label">Acerca de</span></p>
        <h2>Un proyecto de Ingeniería de Sistemas</h2>
        <p>Este sitio nació como un proyecto académico para enseñar métodos numéricos de forma visual e interactiva: contenido claro, ejercicios prácticos y un reto final que certifica lo aprendido.</p>
        <p>Buscamos que cualquier estudiante pueda repasar la teor&iacute;a de errores, los m&eacute;todos de b&uacute;squeda de ra&iacute;ces y la integraci&oacute;n num&eacute;rica de ecuaciones diferenciales sin depender solo de la teor&iacute;a en el tablero.</p>
      </div>
      <dl class="stat-block">
        <div>
          <dt>16</dt>
          <dd>temas cubiertos</dd>
        </div>
        <div>
          <dt>80</dt>
          <dd>preguntas en el banco</dd>
        </div>
        <div>
          <dt>100%</dt>
          <dd>responsivo y accesible</dd>
        </div>
      </dl>
    </div>

    <div class="section-inner">
      <div class="about-cta-grid">
        <p class="eyebrow">Conoce más del proyecto</p>
        <div class="about-btn-grid" id="aboutBtnGrid">
          <button type="button" class="about-btn" data-about="quienes">
            <span class="about-btn-icon">QS</span>
            <h4>Quiénes somos</h4>
            <p>El equipo detrás del diseño y desarrollo de esta aula interactiva.</p>
            <span class="about-btn-cta">Ver detalle &rarr;</span>
          </button>
          <button type="button" class="about-btn" data-about="publico">
            <span class="about-btn-icon">PO</span>
            <h4>Público objetivo</h4>
            <p>Para quién está pensado este sitio y qué problema le resuelve.</p>
            <span class="about-btn-cta">Ver detalle &rarr;</span>
          </button>
          <button type="button" class="about-btn" data-about="objetivo">
            <span class="about-btn-icon">OB</span>
            <h4>Objetivo del sitio</h4>
            <p>La meta con la que construimos cada sección de esta aula interactiva.</p>
            <span class="about-btn-cta">Ver detalle &rarr;</span>
          </button>
          <button type="button" class="about-btn" data-about="resultados">
            <span class="about-btn-icon">RE</span>
            <h4>Resultados esperados</h4>
            <p>Lo que te llevas después de estudiar y practicar en el sitio.</p>
            <span class="about-btn-cta">Ver detalle &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal "Conoce más del proyecto" -->
  <div class="modal" id="aboutModal" aria-hidden="true">
    <div class="modal-backdrop" data-close-about></div>
    <div class="about-modal-box" role="dialog" aria-modal="true" aria-labelledby="aboutModalTitle">
      <button class="about-modal-close" data-close-about aria-label="Cerrar">&times;</button>
      <p class="eyebrow" id="aboutModalTag">Nosotros</p>
      <h3 id="aboutModalTitle">Título</h3>
      <div id="aboutModalBody"></div>
    </div>
  </div>

  <!-- ===================== CONTACTO ===================== -->
  <section class="section" id="contacto">
    <div class="section-inner">
      <p class="section-index"><span class="section-index-num">V</span><span class="section-index-label">Contacto</span></p>
      <h2>&iquest;Dudas, sugerencias o errores en el contenido?</h2>
      <p class="section-lead">Cu&eacute;ntanos qu&eacute; te falt&oacute;, qu&eacute; no se entendi&oacute; o qu&eacute; encontraste mal. Leemos todos los mensajes y corregimos el contenido con lo que nos escriben.</p>

      <div class="contact-layout">

        <!-- Panel de datos de contacto -->
        <aside class="contact-info">
          <h3>Datos de contacto</h3>

          <ul class="contact-info-list">
            <li>
              <span class="contact-info-icon" aria-hidden="true">&#9993;</span>
              <span>
                <strong>Correo</strong>
                <a href="mailto:contacto@metodosnumericos.edu">contacto@metodosnumericos.edu</a>
              </span>
            </li>
            <li>
              <span class="contact-info-icon" aria-hidden="true">&#9742;</span>
              <span>
                <strong>Tel&eacute;fono</strong>
                <a href="tel:+573103583446">310 358 3446</a>
              </span>
            </li>
            <li>
              <span class="contact-info-icon" aria-hidden="true">&#9873;</span>
              <span>
                <strong>Ubicaci&oacute;n</strong>
                Facultad de Ingenier&iacute;a de Sistemas<br>Quibd&oacute;, Choc&oacute; &mdash; Colombia
              </span>
            </li>
            <li>
              <span class="contact-info-icon" aria-hidden="true">&#8987;</span>
              <span>
                <strong>Tiempo de respuesta</strong>
                Revisamos el buz&oacute;n cada semana durante el periodo acad&eacute;mico.
              </span>
            </li>
          </ul>

          <div class="contact-info-links">
            <p class="contact-info-links-title">Quiz&aacute; esto te sirva antes de escribir</p>
            <a href="manual.html">Manual de usuario</a>
            <a href="proyecto.html">Documentaci&oacute;n del proyecto</a>
            <a href="#bibliografia">Bibliograf&iacute;a del curso</a>
          </div>
        </aside>

        <!-- Formulario -->
        <div class="contact-form-card">
          <form class="contact-form" id="contactForm" novalidate>

            <div class="form-row">
              <div class="field">
                <label for="contactName">Nombre completo <span class="req" aria-hidden="true">*</span></label>
                <input type="text" id="contactName" name="nombre" required minlength="3"
                       autocomplete="name" placeholder="Ej. Laura Ram&iacute;rez"
                       aria-describedby="errName">
                <p class="field-error" id="errName" role="alert"></p>
              </div>

              <div class="field">
                <label for="contactEmail">Correo electr&oacute;nico <span class="req" aria-hidden="true">*</span></label>
                <input type="email" id="contactEmail" name="correo" required
                       autocomplete="email" placeholder="tucorreo@dominio.com"
                       aria-describedby="errEmail">
                <p class="field-error" id="errEmail" role="alert"></p>
              </div>
            </div>

            <div class="field">
              <label for="contactSubject">Asunto <span class="req" aria-hidden="true">*</span></label>
              <select id="contactSubject" name="asunto" required aria-describedby="errSubject">
                <option value="">Selecciona un asunto&hellip;</option>
                <option value="Duda sobre un tema">Duda sobre un tema</option>
                <option value="Error en el contenido">Error en el contenido</option>
                <option value="Problema t&eacute;cnico del sitio">Problema t&eacute;cnico del sitio</option>
                <option value="Problema con el certificado">Problema con el certificado</option>
                <option value="Sugerencia de mejora">Sugerencia de mejora</option>
                <option value="Otro">Otro</option>
              </select>
              <p class="field-error" id="errSubject" role="alert"></p>
            </div>

            <div class="field">
              <label for="contactMsg">Mensaje <span class="req" aria-hidden="true">*</span></label>
              <textarea id="contactMsg" name="mensaje" rows="6" required minlength="10" maxlength="1000"
                        placeholder="Escribe aqu&iacute; tu duda, el error que encontraste o tu sugerencia. Entre m&aacute;s concreto, mejor podemos ayudarte."
                        aria-describedby="errMsg contadorMsg"></textarea>
              <div class="field-foot">
                <p class="field-error" id="errMsg" role="alert"></p>
                <span class="char-counter" id="contadorMsg">0 / 1000</span>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="contactSubmit">
                <span class="btn-label">Enviar mensaje</span>
                <span class="btn-spinner" aria-hidden="true"></span>
              </button>
              <p class="field-note" id="contactNote">Tu mensaje queda registrado en el buz&oacute;n de sugerencias del sitio. No lo compartimos con nadie m&aacute;s.</p>
            </div>
          </form>

          <!-- Estado de exito: reemplaza al formulario tras el envio -->
          <div class="contact-success" id="contactSuccess" hidden>
            <div class="contact-success-mark" aria-hidden="true">&#10003;</div>
            <h3>Mensaje enviado</h3>
            <p id="contactSuccessText">Gracias por escribirnos. Tu mensaje qued&oacute; registrado en el buz&oacute;n y lo revisaremos pronto.</p>
            <button type="button" class="btn btn-ghost" id="contactAnother">Enviar otro mensaje</button>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ===================== BIBLIOGRAFÍA ===================== -->
  <section class="section section-alt" id="bibliografia">
    <div class="section-inner">
      <p class="section-index"><span class="section-index-num">VI</span><span class="section-index-label">Fuentes</span></p>
      <h2>Bibliografía y referencias del curso</h2>
      <p class="section-lead">Todas las fuentes académicas usadas o recomendadas en este sitio, organizadas por tipo. Los enlaces abren en una pestaña nueva.</p>

      <div class="biblio-grid">

        <div class="biblio-card">
          <h4>Libros de texto de referencia</h4>
          <ul>
            <li><a href="https://www.google.com/search?tbm=bks&q=Numerical+Analysis+Burden+Faires" target="_blank" rel="noopener">Burden, R. L. &amp; Faires, J. D. — Numerical Analysis</a><span class="biblio-note">Texto clásico de análisis numérico con el marco teórico de convergencia de todos los métodos del curso.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&q=M%C3%A9todos+num%C3%A9ricos+para+ingenieros+Chapra+Canale" target="_blank" rel="noopener">Chapra, S. C. &amp; Canale, R. P. — Métodos numéricos para ingenieros</a><span class="biblio-note">Referencia en español, organiza los métodos en cerrados y abiertos con casos de ingeniería.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&q=M%C3%A9todos+num%C3%A9ricos+aplicados+a+la+ingenier%C3%ADa+Nieves+Dom%C3%ADnguez" target="_blank" rel="noopener">Nieves, A. &amp; Domínguez, F. — Métodos numéricos aplicados a la ingeniería</a><span class="biblio-note">Enfoque práctico en español, con ejercicios comparativos entre métodos.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&q=An+Introduction+to+Numerical+Analysis+Atkinson" target="_blank" rel="noopener">Atkinson, K. E. — An Introduction to Numerical Analysis</a><span class="biblio-note">Incluye la formulación original del método de Muller (sección 2.4).</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Recursos académicos abiertos</h4>
          <ul>
            <li><a href="https://math.libretexts.org/Workbench/Numerical_Methods_with_Applications_(Kaw)/3:_Nonlinear_Equations" target="_blank" rel="noopener">LibreTexts — Numerical Methods with Applications (Autar Kaw)</a><span class="biblio-note">Libro de texto abierto (open textbook) usado por universidades de EE. UU.</span></li>
            <li><a href="http://mathforcollege.com/nm/mws/gen/03nle/mws_gen_nle_txt_bisection.pdf" target="_blank" rel="noopener">University of South Florida — Notas de clase sobre bisección (Autar Kaw)</a><span class="biblio-note">PDF académico con teoría, convergencia y ejemplos.</span></li>
            <li><a href="https://blog.espol.edu.ec/analisisnumerico/punto-fijo-concepto/" target="_blank" rel="noopener">ESPOL — Blog de Análisis Numérico</a><span class="biblio-note">Material universitario (Ecuador) sobre punto fijo con ejemplos en Python.</span></li>
            <li><a href="https://www.analyticslane.com/2023/03/24/el-metodo-de-muller-e-implementacion-en-python/" target="_blank" rel="noopener">Analytics Lane — El método de Muller e implementación en Python</a><span class="biblio-note">Explicación en español con deducción algebraica y código.</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Buscadores académicos</h4>
          <ul>
            <li><a href="https://scholar.google.com/scholar?q=numerical+methods+nonlinear+equations+root+finding" target="_blank" rel="noopener">Google Académico (Google Scholar)</a><span class="biblio-note">Para buscar artículos, tesis y trabajos citables sobre cualquiera de los métodos del curso.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&q=m%C3%A9todos+num%C3%A9ricos" target="_blank" rel="noopener">Google Libros</a><span class="biblio-note">Para encontrar ediciones y vistas previas de los libros de texto recomendados.</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Fundamentos y Teor&iacute;a de Errores</h4>
          <ul>
            <li><a href="https://dl.acm.org/doi/10.1145/103162.103163" target="_blank" rel="noopener">Goldberg, D. (1991) &mdash; What Every Computer Scientist Should Know About Floating-Point Arithmetic</a><span class="biblio-note">Art&iacute;culo cl&aacute;sico de ACM Computing Surveys: la referencia can&oacute;nica sobre punto flotante.</span></li>
            <li><a href="https://docs.python.org/es/3/tutorial/floatingpoint.html" target="_blank" rel="noopener">Python &mdash; Aritm&eacute;tica de punto flotante: problemas y limitaciones</a><span class="biblio-note">Documentaci&oacute;n oficial en espa&ntilde;ol, con ejemplos ejecutables del problema de 0.1 + 0.2.</span></li>
            <li><a href="https://ieeexplore.ieee.org/document/8766229" target="_blank" rel="noopener">IEEE 754-2019 &mdash; Standard for Floating-Point Arithmetic</a><span class="biblio-note">El est&aacute;ndar oficial que define simple y doble precisi&oacute;n.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&amp;q=Accuracy+and+Stability+of+Numerical+Algorithms+Higham" target="_blank" rel="noopener">Higham, N. J. &mdash; Accuracy and Stability of Numerical Algorithms</a><span class="biblio-note">Tratado de referencia sobre estabilidad num&eacute;rica en aritm&eacute;tica finita.</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Ecuaciones Diferenciales Ordinarias</h4>
          <ul>
            <li><a href="https://math.libretexts.org/Workbench/Numerical_Methods_with_Applications_(Kaw)/8%3A_Ordinary_Differential_Equations" target="_blank" rel="noopener">LibreTexts &mdash; Ordinary Differential Equations (Autar Kaw)</a><span class="biblio-note">Cap&iacute;tulo abierto con Euler, Runge-Kutta y m&eacute;todos multipaso resueltos.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&amp;q=Solving+Ordinary+Differential+Equations+I+Hairer+Norsett+Wanner" target="_blank" rel="noopener">Hairer, N&oslash;rsett &amp; Wanner &mdash; Solving Ordinary Differential Equations I</a><span class="biblio-note">Referencia definitiva sobre m&eacute;todos de un paso y multipaso.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&amp;q=Butcher+Numerical+Methods+for+Ordinary+Differential+Equations" target="_blank" rel="noopener">Butcher, J. C. &mdash; Numerical Methods for Ordinary Differential Equations</a><span class="biblio-note">Teor&iacute;a completa de los m&eacute;todos Runge-Kutta y sus tablas de Butcher.</span></li>
            <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html" target="_blank" rel="noopener">SciPy &mdash; <code>solve_ivp</code></a><span class="biblio-note">El resolvedor de EDO de referencia en Python, con RK45, BDF y LSODA.</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Programaci&oacute;n en Python</h4>
          <ul>
            <li><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy &mdash; Gu&iacute;a oficial para principiantes</a><span class="biblio-note">Arreglos, vectorizaci&oacute;n y operaciones b&aacute;sicas, con ejemplos.</span></li>
            <li><a href="https://docs.scipy.org/doc/scipy/tutorial/optimize.html" target="_blank" rel="noopener">SciPy &mdash; Tutorial de optimizaci&oacute;n y b&uacute;squeda de ra&iacute;ces</a><span class="biblio-note">Uso de <code>brentq</code>, <code>newton</code> y <code>fsolve</code>.</span></li>
            <li><a href="https://www.google.com/search?tbm=bks&amp;q=Kiusalaas+Numerical+Methods+in+Engineering+with+Python" target="_blank" rel="noopener">Kiusalaas, J. &mdash; Numerical Methods in Engineering with Python 3</a><span class="biblio-note">Cada m&eacute;todo del curso con su implementaci&oacute;n comentada.</span></li>
            <li><a href="https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/" target="_blank" rel="noopener">MIT OpenCourseWare &mdash; 18.330 Introduction to Numerical Analysis</a><span class="biblio-note">Curso completo con notas de clase descargables.</span></li>
          </ul>
        </div>

        <div class="biblio-card">
          <h4>Videos recomendados</h4>
          <ul>
            <li><a href="https://www.youtube.com/watch?v=X2Osytcx8qA" target="_blank" rel="noopener">Introducción a la solución numérica de ecuaciones no lineales</a><span class="biblio-note">Usado en la página de detalle de "Solución numérica".</span></li>
            <li><a href="https://www.youtube.com/watch?v=YMQ4s6P7bKA" target="_blank" rel="noopener">Método de bisección paso a paso</a><span class="biblio-note">Usado en la página de detalle de "Bisección".</span></li>
            <li><a href="https://www.youtube.com/watch?v=9vR5uWomNrY" target="_blank" rel="noopener">Método de Muller: teoría y práctica</a><span class="biblio-note">Usado en la página de detalle de "Muller".</span></li>
            <li><a href="https://www.youtube.com/watch?v=4T9g9iCXyRw" target="_blank" rel="noopener">Iteración de punto fijo: teoría y práctica</a><span class="biblio-note">Usado en la página de detalle de "Punto fijo".</span></li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- ===================== FOOTER ===================== -->
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand-text">Métodos<em>Numéricos</em></span>
        <p>Aula interactiva de métodos numéricos: fundamentos y teoría de errores, métodos iterativos y ecuaciones diferenciales ordinarias.</p>
        <div class="footer-social" aria-label="Redes sociales">
          <a href="https://github.com/Yasnier06/Metodosnumericos" target="_blank" rel="noopener" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.79.57.1.78-.25.78-.55v-2.15c-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.03-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.25 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.81 1.17 3.05 0 4.37-2.66 5.33-5.19 5.61.41.36.77 1.06.77 2.14v3.17c0 .31.21.66.79.55 4.51-1.51 7.77-5.77 7.77-10.79C23.02 5.24 18.27.5 12 .5Z" />
            </svg>
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.5 7.2s-.23-1.64-.94-2.36c-.9-.95-1.9-.95-2.36-1.01C16.9 3.5 12 3.5 12 3.5h-.01s-4.9 0-8.2.33c-.46.06-1.46.06-2.36 1.01C.72 5.56.5 7.2.5 7.2S.27 9.12.27 11.04v1.8c0 1.92.23 3.84.23 3.84s.23 1.64.94 2.36c.9.95 2.08.92 2.6 1.02 1.9.18 8.06.32 8.06.32s4.9-.01 8.2-.34c.46-.06 1.46-.06 2.36-1.01.71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.8c0-1.92-.23-3.84-.23-3.84ZM9.75 14.98V7.9l6.5 3.55-6.5 3.53Z" />
            </svg>
          </a>
        </div>
      </div>

      <nav class="footer-col" aria-label="Enlaces del sitio">
        <h4>Navegaci&oacute;n</h4>
        <a href="#inicio">Inicio</a>
        <a href="#temas">Temas</a>
        <a href="#juegos">Actividades</a>
        <a href="galeria.html">Galer&iacute;a</a>
        <a href="#certificacion">Certificaci&oacute;n</a>
        <a href="#nosotros">Acerca de</a>
        <a href="proyecto.html">Documentaci&oacute;n del proyecto</a>
        <a href="manual.html">Manual de usuario</a>
        <a href="#bibliografia">Bibliograf&iacute;a</a>
      </nav>

      <div class="footer-col">
        <h4>Bloques tem&aacute;ticos</h4>
        <a href="#temas" data-tab-link="u1">1 &middot; Fundamentos y teor&iacute;a de errores</a>
        <a href="#temas" data-tab-link="u2">2 &middot; M&eacute;todos iterativos y ra&iacute;ces</a>
        <a href="#temas" data-tab-link="u3">3 &middot; Ecuaciones diferenciales ordinarias</a>
        <a href="temas/biseccion.html">Bisecci&oacute;n</a>
        <a href="temas/newton.html">Newton</a>
        <a href="temas/runge-kutta.html">Runge-Kutta</a>
      </div>

      <div class="footer-col">
        <h4>Contacto</h4>
        <a href="mailto:contacto@metodosnumericos.edu">contacto@metodosnumericos.edu</a>
        <span>Facultad de Ingeniería de Sistemas</span>
        <span>Telefono: 3103583446</span>
        <span>Quibdo chocó, Colombia</span>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; <span id="year"></span> MétodosNuméricos. Proyecto académico de Ingeniería de Sistemas.</span>
      <span>Hecho con HTML, PHP, CSS y JavaScript.</span>
      <a href="buzon.php" style="opacity:.7;">Buzón de sugerencias</a>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script src="accessibility.js?v=<?php echo @filemtime(__DIR__ . "/accessibility.js"); ?>"></script>
  <script src="script.js?v=<?php echo @filemtime(__DIR__ . "/script.js"); ?>"></script>
  <script src="juegos.js?v=<?php echo @filemtime(__DIR__ . "/juegos.js"); ?>"></script>
</body>

</html>