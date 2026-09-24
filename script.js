/* =========================================================
   EMAILJS — envío real del certificado
   1) Crea una cuenta gratuita en https://www.emailjs.com
   2) Agrega un servicio de correo (Gmail, Outlook, etc.) -> copia el Service ID
   3) Crea una plantilla con las variables {{to_name}} {{to_email}} {{score}} {{date}}
      y un adjunto dinámico llamado "certificado" (tipo PNG) -> copia el Template ID
   4) En "Account > API Keys" copia tu Public Key
   5) Reemplaza los tres valores de abajo
========================================================= */
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";

if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/* =========================================================
   BANCO DE PREGUNTAS
========================================================= */
const QUESTION_BANK = {
  intro: {
    label: "Solución numérica",
    questions: [
      {
        q: "¿Por qué se utilizan métodos numéricos para resolver ecuaciones no lineales?",
        options: [
          "Porque siempre dan la solución exacta",
          "Porque muchas ecuaciones no tienen solución algebraica cerrada",
          "Porque son más rápidos que cualquier método analítico",
          "Porque no requieren computadora"
        ],
        correct: 1,
        explain: "Cuando no existe una fórmula cerrada para despejar x, construimos una sucesión de aproximaciones que converge a la raíz."
      },
      {
        q: '¿Qué es un "criterio de parada" en un método iterativo?',
        options: [
          "El número máximo de iteraciones o la tolerancia de error que detiene el proceso",
          "El primer valor que se prueba",
          "La derivada de la función",
          "El nombre del método"
        ],
        correct: 0,
        explain: "Todo método iterativo necesita saber cuándo detenerse: por tolerancia de error o por un límite de iteraciones."
      },
      {
        q: "El error absoluto entre dos iteraciones sucesivas se calcula como:",
        options: ["|x₍ₙ₊₁₎ − xₙ|", "x₍ₙ₊₁₎ + xₙ", "x₍ₙ₊₁₎ · xₙ", "xₙ / x₍ₙ₊₁₎"],
        correct: 0,
        explain: "El error se mide como la distancia entre dos aproximaciones consecutivas."
      },
      {
        q: "Un método numérico converge cuando:",
        options: [
          "Diverge indefinidamente",
          "Las iteraciones se acercan cada vez más a la solución real dentro de una tolerancia",
          "Se ejecuta una sola vez",
          "El error aumenta con cada iteración"
        ],
        correct: 1,
        explain: "Converger significa que la sucesión de aproximaciones se estabiliza cerca del valor real."
      },
      {
        q: "¿Cuál de estos NO es un método para encontrar raíces de ecuaciones no lineales?",
        options: ["Bisección", "Punto fijo", "Muller", "Eliminación de Gauss"],
        correct: 3,
        explain: "La eliminación de Gauss resuelve sistemas de ecuaciones lineales, no busca raíces de f(x) = 0."
      }
    ]
  },
  biseccion: {
    label: "Bisección",
    questions: [
      {
        q: "El método de bisección requiere que la función:",
        options: [
          "Sea lineal",
          "Cambie de signo en el intervalo [a,b], es decir f(a)·f(b) < 0",
          "Sea siempre positiva",
          "Tenga derivada nula"
        ],
        correct: 1,
        explain: "El cambio de signo garantiza, por el teorema del valor intermedio, que hay al menos una raíz en el intervalo."
      },
      {
        q: "En cada iteración, el nuevo punto se calcula como:",
        options: ["c = (a + b) / 2", "c = a − b", "c = a · b", "c = a / b"],
        correct: 0,
        explain: "Se toma el punto medio del intervalo actual."
      },
      {
        q: "Si f(a)·f(c) < 0, el nuevo intervalo de búsqueda es:",
        options: ["[c, b]", "[a, c]", "[a, b] sin cambios", "No existe intervalo"],
        correct: 1,
        explain: "Si hay cambio de signo entre a y c, la raíz está en [a, c], así que b pasa a valer c."
      },
      {
        q: "Una ventaja del método de bisección es que:",
        options: [
          "Siempre converge si se cumple el cambio de signo, aunque de forma lenta",
          "Converge más rápido que cualquier otro método",
          "No necesita intervalo inicial",
          "Funciona con funciones discontinuas sin restricciones"
        ],
        correct: 0,
        explain: "Es un método robusto y garantizado, pero su convergencia es lineal (más lenta que Muller o Newton-Raphson)."
      },
      {
        q: "El método de bisección pertenece a la categoría de métodos:",
        options: ["Abiertos", "Cerrados o de intervalo (acotados)", "Directos", "Matriciales"],
        correct: 1,
        explain: "Trabaja siempre dentro de un intervalo que va reduciéndose, por eso se clasifica como método cerrado."
      }
    ]
  },
  muller: {
    label: "Muller",
    questions: [
      {
        q: "El método de Muller utiliza:",
        options: [
          "Una recta tangente",
          "Tres puntos para ajustar una parábola (interpolación cuadrática)",
          "Dos puntos con cambio de signo",
          "La matriz jacobiana"
        ],
        correct: 1,
        explain: "A diferencia de la secante (que usa una recta), Muller ajusta una parábola con tres puntos."
      },
      {
        q: "Una ventaja importante del método de Muller frente a otros métodos es que puede encontrar:",
        options: [
          "Solo raíces reales positivas",
          "Raíces complejas incluso partiendo de valores iniciales reales",
          "Únicamente el máximo de la función",
          "La integral de la función"
        ],
        correct: 1,
        explain: "Gracias a la fórmula cuadrática, Muller puede converger a raíces complejas aunque el punto de partida sea real."
      },
      {
        q: "El método de Muller generaliza la idea de:",
        options: [
          "La bisección",
          "El método de la secante, usando una parábola en vez de una recta",
          "El método de Newton-Raphson para sistemas",
          "La regla de Simpson"
        ],
        correct: 1,
        explain: "La secante interpola dos puntos con una recta; Muller interpola tres puntos con una parábola."
      },
      {
        q: "En el método de Muller, para elegir la siguiente aproximación se toma la raíz de la parábola que:",
        options: [
          "Esté más cerca del último punto usado",
          "Sea siempre la mayor en valor absoluto",
          "Sea negativa",
          "Tenga parte imaginaria distinta de cero"
        ],
        correct: 0,
        explain: "De las dos raíces posibles de la parábola, se elige la más cercana al último iterado para asegurar mejor convergencia."
      },
      {
        q: "El método de Muller requiere como datos iniciales:",
        options: [
          "Un solo punto",
          "Tres puntos (o aproximaciones) iniciales",
          "El intervalo con cambio de signo",
          "La segunda derivada exacta"
        ],
        correct: 1,
        explain: "A diferencia de la bisección (que pide un intervalo), Muller parte de tres aproximaciones iniciales."
      }
    ]
  },
  puntofijo: {
    label: "Punto fijo",
    questions: [
      {
        q: "El método de iteración de punto fijo transforma la ecuación f(x) = 0 en:",
        options: ["x = g(x)", "f'(x) = 0", "f(x) = g(x) + h(x)", "x² = f(x)"],
        correct: 0,
        explain: "Se despeja x de forma que quede como función de sí misma: x = g(x)."
      },
      {
        q: "La fórmula iterativa del método de punto fijo es:",
        options: [
          "x₍ₙ₊₁₎ = g(xₙ)",
          "x₍ₙ₊₁₎ = xₙ − f(xₙ)/f'(xₙ)",
          "x₍ₙ₊₁₎ = (a+b)/2",
          "x₍ₙ₊₁₎ = f(xₙ) · xₙ"
        ],
        correct: 0,
        explain: "Cada nueva aproximación se obtiene evaluando g en la aproximación anterior."
      },
      {
        q: "Una condición suficiente para que la iteración de punto fijo converja cerca de la raíz es que:",
        options: [
          "|g'(x)| > 1 en la vecindad de la raíz",
          "|g'(x)| < 1 en la vecindad de la raíz",
          "g(x) sea discontinua",
          "f(x) sea creciente"
        ],
        correct: 1,
        explain: "Si la pendiente de g cerca de la raíz es menor que 1 en valor absoluto, la iteración converge localmente."
      },
      {
        q: "Si el método de punto fijo diverge, una estrategia común es:",
        options: [
          "Elegir otra forma de despejar x = g(x)",
          "Aumentar el número de iteraciones indefinidamente",
          "Cambiar la función original f(x)",
          "Usar números complejos"
        ],
        correct: 0,
        explain: "Una misma ecuación puede despejarse de varias formas; algunas convergen y otras no, así que se prueba con otra g(x)."
      },
      {
        q: "El punto fijo de una función g es un valor x* tal que:",
        options: ["g(x*) = 0", "g(x*) = x*", "g'(x*) = 0", "g(x*) = infinito"],
        correct: 1,
        explain: 'Por definición, un "punto fijo" es aquel que la función deja sin cambios: g(x*) = x*.'
      }
    ]
  }
};

/* =========================================================
   BANCO DE PREGUNTAS — TEMAS DE LAS UNIDADES 1 Y 3
   (los temas del bloque 2 sobre raices siguen definidos arriba)
========================================================= */
Object.assign(QUESTION_BANK, {

  /* ---------- Unidad 1 ---------- */
  metodo: {
    label: "¿Qué es un método numérico?",
    questions: [
      {
        q: "¿Cuál es la diferencia esencial entre un método analítico y uno numérico?",
        options: [
          "El analítico da una solución exacta; el numérico da una aproximación con error acotado",
          "El numérico siempre es más preciso",
          "El analítico solo funciona con computadora",
          "No hay ninguna diferencia real"
        ],
        correct: 0,
        explain: "El método numérico renuncia a la exactitud a cambio de poder resolver problemas que no tienen fórmula cerrada."
      },
      {
        q: "¿Por qué la ecuación cos(x) = x necesita un método numérico?",
        options: [
          "Porque no tiene solución",
          "Porque no existe manipulación algebraica que despeje x",
          "Porque tiene infinitas soluciones",
          "Porque cos(x) no es continua"
        ],
        correct: 1,
        explain: "Mezcla una función trascendente con un polinomio: no hay despeje posible, aunque la raíz existe y vale ≈ 0.739085."
      },
      {
        q: "En el ciclo de trabajo de un método numérico, ¿qué significa 'discretizar'?",
        options: [
          "Redondear el resultado final",
          "Reemplazar operaciones continuas (derivadas, integrales, límites) por operaciones finitas",
          "Dibujar la función",
          "Elegir el lenguaje de programación"
        ],
        correct: 1,
        explain: "La computadora solo hace un número finito de operaciones aritméticas: hay que traducir lo continuo a lo finito."
      },
      {
        q: "¿Qué dos criterios de parada se usan típicamente en un método iterativo?",
        options: [
          "El primer y el último valor",
          "La tolerancia del error y el máximo de iteraciones",
          "El signo de la función y su derivada",
          "El tiempo de ejecución y la memoria usada"
        ],
        correct: 1,
        explain: "La tolerancia decide cuándo el resultado es suficientemente bueno; el máximo de iteraciones evita bucles infinitos si el método diverge."
      },
      {
        q: "Un método reduce el error a la mitad en cada paso. Partiendo de un error de 1, ¿cuántas iteraciones necesita para bajar de 10⁻³?",
        options: ["3", "10", "100", "1000"],
        correct: 1,
        explain: "El error tras n pasos es 1/2ⁿ. Como 2⁹ = 512 y 2¹⁰ = 1024 > 1000, se necesitan 10 iteraciones."
      }
    ]
  },

  representacion: {
    label: "Representación de números",
    questions: [
      {
        q: "¿Por qué el número 0.1 no se puede almacenar de forma exacta en un computador?",
        options: [
          "Porque es demasiado pequeño",
          "Porque en base 2 es una fracción periódica infinita",
          "Porque los computadores no manejan decimales",
          "Porque le falta signo"
        ],
        correct: 1,
        explain: "0.1 en binario es 0.0001100110011… periódico. Solo las fracciones con denominador potencia de 2 son exactas."
      },
      {
        q: "En el estándar IEEE 754 de doble precisión, ¿cuántos bits tiene la mantisa?",
        options: ["23", "52", "64", "11"],
        correct: 1,
        explain: "Doble precisión: 1 bit de signo, 11 de exponente y 52 de mantisa, que sumados dan los 64 bits."
      },
      {
        q: "¿Cuál es el resultado de convertir 45 a binario?",
        options: ["101101", "110101", "101011", "111001"],
        correct: 0,
        explain: "Dividiendo repetidamente entre 2 los residuos son 1,0,1,1,0,1 leídos de abajo hacia arriba: 101101."
      },
      {
        q: "¿Cómo se representan los enteros negativos en la mayoría de los procesadores?",
        options: [
          "Con un bit de signo separado",
          "En complemento a dos",
          "En base 10 con signo",
          "No se pueden representar"
        ],
        correct: 1,
        explain: "En complemento a dos se invierten los bits del valor absoluto y se suma 1; así la resta se implementa como suma."
      },
      {
        q: "0.625 en binario es:",
        options: ["0.101", "0.110", "0.011", "0.111"],
        correct: 0,
        explain: "0.625 = 1/2 + 1/8, y como 8 es potencia de 2 la representación es finita: 0.101."
      }
    ]
  },

  flotante: {
    label: "Aritmética de punto flotante",
    questions: [
      {
        q: "¿Por qué en casi todos los lenguajes 0.1 + 0.2 == 0.3 devuelve falso?",
        options: [
          "Por un error del lenguaje",
          "Porque ninguno de los tres valores es exacto en binario y los errores de representación no coinciden",
          "Porque la suma está mal implementada",
          "Porque 0.3 no es un número válido"
        ],
        correct: 1,
        explain: "0.1 + 0.2 almacena 0.30000000000000004, distinto del flotante más cercano a 0.3. La comparación correcta usa una tolerancia."
      },
      {
        q: "¿Qué es el épsilon de máquina?",
        options: [
          "El número más pequeño representable",
          "El número positivo más pequeño tal que 1 + ε ≠ 1 en la máquina",
          "El error máximo permitido por el usuario",
          "La precisión del reloj del procesador"
        ],
        correct: 1,
        explain: "Marca el límite de resolución relativa: en doble precisión vale ≈ 2.22 × 10⁻¹⁶."
      },
      {
        q: "¿Qué es la cancelación catastrófica?",
        options: [
          "Cuando el programa se detiene por un error",
          "La pérdida de cifras significativas al restar dos números casi iguales",
          "Un desbordamiento del exponente",
          "Un error al convertir de decimal a binario"
        ],
        correct: 1,
        explain: "Las cifras coincidentes se anulan y solo quedan las cifras contaminadas por el redondeo: el error relativo se dispara."
      },
      {
        q: "¿Cómo se evita la cancelación al calcular √(x²+1) − x para x grande?",
        options: [
          "Usando más decimales",
          "Multiplicando y dividiendo por el conjugado: 1 / (√(x²+1) + x)",
          "Redondeando antes de restar",
          "No se puede evitar"
        ],
        correct: 1,
        explain: "Al racionalizar se sustituye una resta peligrosa por una suma estable, sin cambiar el valor matemático."
      },
      {
        q: "En aritmética de punto flotante, ¿se cumple siempre (a + b) + c = a + (b + c)?",
        options: [
          "Sí, siempre",
          "No: la suma en punto flotante no es asociativa",
          "Solo si los tres son positivos",
          "Solo con números enteros"
        ],
        correct: 1,
        explain: "Con a = 10¹⁶, b = −10¹⁶ y c = 1, un orden da 1.0 y el otro da 0.0."
      }
    ]
  },

  errores: {
    label: "Errores de redondeo",
    questions: [
      {
        q: "El error relativo se define como:",
        options: [
          "|valor verdadero − aproximado|",
          "|valor verdadero − aproximado| / |valor verdadero|",
          "valor verdadero × aproximado",
          "La suma de ambos valores"
        ],
        correct: 1,
        explain: "El error absoluto dividido entre la magnitud del valor verdadero; es el que indica realmente si el resultado sirve."
      },
      {
        q: "Se mide el lado de un cuadrado con 0.4 % de error relativo. ¿Cuál es el error relativo del área?",
        options: ["0.2 %", "0.4 %", "0.8 %", "1.6 %"],
        correct: 2,
        explain: "Como A = L², la propagación da E_A/A ≈ 2·(E_L/L): al elevar al cuadrado el error relativo se duplica."
      },
      {
        q: "¿Qué error aparece al truncar una serie infinita en un número finito de términos?",
        options: [
          "Error de redondeo",
          "Error de truncamiento",
          "Error inherente",
          "Error de sintaxis"
        ],
        correct: 1,
        explain: "El truncamiento es el error de cortar un proceso matemático infinito; el redondeo viene de la aritmética finita de la máquina."
      },
      {
        q: "Según el criterio de Scarborough, ¿qué tolerancia garantiza 3 cifras significativas correctas?",
        options: ["5 %", "0.5 %", "0.05 %", "0.005 %"],
        correct: 2,
        explain: "εₐ < 0.5 × 10^(2−n) %; con n = 3 resulta 0.05 %."
      },
      {
        q: "Un problema mal condicionado significa que:",
        options: [
          "El algoritmo elegido es malo",
          "Un pequeño error en los datos produce un gran error en el resultado",
          "La función no es continua",
          "Hay un error de programación"
        ],
        correct: 1,
        explain: "El condicionamiento es propiedad del problema, no del algoritmo: cambiar de método no lo arregla."
      }
    ]
  },

  algoritmos: {
    label: "Algoritmos y convergencia",
    questions: [
      {
        q: "Un algoritmo es numéricamente inestable cuando:",
        options: [
          "Tarda mucho en ejecutarse",
          "El error crece de forma exponencial con el número de operaciones",
          "Usa demasiada memoria",
          "No tiene criterio de parada"
        ],
        correct: 1,
        explain: "Un crecimiento lineal del error es tolerable; uno exponencial destruye el resultado en pocas iteraciones."
      },
      {
        q: "Si un método tiene orden de convergencia 2, en cada iteración:",
        options: [
          "Gana una cifra correcta",
          "Duplica aproximadamente el número de cifras correctas",
          "Reduce el error a la mitad",
          "El error se mantiene constante"
        ],
        correct: 1,
        explain: "Convergencia cuadrática: e(n+1) ≈ λ·e(n)², así que el exponente del error se duplica en cada paso."
      },
      {
        q: "Si el error de un método es O(h²) y se reduce h a la mitad, el error:",
        options: [
          "Se reduce a la mitad",
          "Se reduce 4 veces",
          "Se reduce 8 veces",
          "No cambia"
        ],
        correct: 1,
        explain: "Con O(h²), dividir h entre 2 divide el error entre 2² = 4."
      },
      {
        q: "¿Cuál es la diferencia entre condicionamiento y estabilidad?",
        options: [
          "Son sinónimos",
          "El condicionamiento es del problema; la estabilidad, del algoritmo",
          "El condicionamiento es del algoritmo; la estabilidad, del problema",
          "Solo se diferencian en álgebra lineal"
        ],
        correct: 1,
        explain: "Un problema mal condicionado amplifica los errores de los datos aunque el algoritmo sea perfecto."
      },
      {
        q: "Un método lineal con λ = 0.5 parte de un error de 0.1. ¿Cuántas iteraciones necesita para bajar de 10⁻⁶?",
        options: ["7", "12", "17", "25"],
        correct: 2,
        explain: "0.1 × 0.5ⁿ < 10⁻⁶ implica n > 5·log₂(10) ≈ 16.6, es decir 17 iteraciones."
      }
    ]
  },

  python: {
    label: "Python para métodos numéricos",
    questions: [
      {
        q: "En Python, ¿cómo se escribe x elevado a la 2?",
        options: ["x^2", "x**2", "x²", "pow2(x)"],
        correct: 1,
        explain: "El operador ^ en Python es XOR de bits; la potencia se escribe con doble asterisco."
      },
      {
        q: "¿Cuál es la forma correcta de comparar dos números flotantes?",
        options: [
          "if a == b:",
          "if abs(a - b) < tol:",
          "if a is b:",
          "if str(a) == str(b):"
        ],
        correct: 1,
        explain: "El redondeo hace que la igualdad exacta casi nunca se cumpla; siempre se compara contra una tolerancia."
      },
      {
        q: "¿Qué biblioteca de Python se usa para arreglos y operaciones vectorizadas?",
        options: ["pandas", "NumPy", "Django", "Flask"],
        correct: 1,
        explain: "NumPy es la base del ecosistema científico: sobre ella se construyen SciPy, pandas y scikit-learn."
      },
      {
        q: "¿Qué función de SciPy encuentra la raíz de una función en un intervalo con cambio de signo?",
        options: [
          "scipy.optimize.brentq",
          "scipy.plot.root",
          "numpy.solve",
          "math.root"
        ],
        correct: 0,
        explain: "brentq combina bisección con interpolación: convergencia rápida y garantía de no salirse del intervalo."
      },
      {
        q: "¿Por qué todo bucle iterativo debe llevar un máximo de iteraciones?",
        options: [
          "Para que el código sea más corto",
          "Porque si el método diverge, sin ese tope el programa queda en un bucle infinito",
          "Porque Python lo exige",
          "Para ahorrar memoria"
        ],
        correct: 1,
        explain: "La tolerancia decide cuándo parar por éxito; el máximo de iteraciones decide cuándo parar por fracaso."
      }
    ]
  },

  /* ---------- Unidad 2 (temas nuevos) ---------- */
  tasas: {
    label: "Tasas de convergencia",
    questions: [
      {
        q: "¿Cuál es el orden de convergencia del método de bisección?",
        options: ["1 (lineal)", "1.618", "1.84", "2 (cuadrático)"],
        correct: 0,
        explain: "La bisección es lineal con λ = ½: reduce el error a la mitad en cada paso, ni más ni menos."
      },
      {
        q: "¿Qué método tiene orden de convergencia 1.618, el número áureo?",
        options: ["Bisección", "Secante", "Newton", "Punto fijo"],
        correct: 1,
        explain: "El orden de la secante es la razón áurea (1+√5)/2 ≈ 1.618: superlineal, pero sin llegar a cuadrático."
      },
      {
        q: "En la iteración de punto fijo, ¿de qué depende la constante asintótica λ?",
        options: [
          "Del valor inicial x₀",
          "De |g'(x*)| evaluado en el punto fijo",
          "Del número de iteraciones",
          "De la tolerancia elegida"
        ],
        correct: 1,
        explain: "λ = |g'(x*)|. Si es cercano a 1 la convergencia es lentísima; si vale 0, el método se vuelve cuadrático."
      },
      {
        q: "¿Por qué se combinan bisección y Newton en el método de Brent?",
        options: [
          "Para usar menos memoria",
          "Para tener la garantía de convergencia de la bisección y la velocidad de Newton",
          "Porque Newton no funciona solo",
          "Para poder trabajar con números complejos"
        ],
        correct: 1,
        explain: "Los métodos cerrados son lentos y seguros; los abiertos, rápidos y arriesgados. El híbrido aprovecha lo mejor de ambos."
      },
      {
        q: "¿Cuántas iteraciones de bisección hacen falta en [1, 2] para un error menor que 10⁻⁶?",
        options: ["6", "10", "20", "100"],
        correct: 2,
        explain: "n > log₂((b−a)/ε) = log₂(10⁶) ≈ 19.93, es decir 20 iteraciones."
      }
    ]
  },

  newton: {
    label: "Método de Newton",
    questions: [
      {
        q: "La fórmula del método de Newton-Raphson es:",
        options: [
          "x(n+1) = x(n) − f(x(n)) / f'(x(n))",
          "x(n+1) = x(n) + f(x(n)) · f'(x(n))",
          "x(n+1) = (a + b) / 2",
          "x(n+1) = g(x(n))"
        ],
        correct: 0,
        explain: "Sale de igualar a cero la recta tangente: 0 = f(xₙ) + f'(xₙ)(x − xₙ)."
      },
      {
        q: "¿Cuál es la interpretación geométrica del método de Newton?",
        options: [
          "Divide el intervalo por la mitad",
          "Sigue la recta tangente hasta donde corta el eje x",
          "Ajusta una parábola por tres puntos",
          "Traza una recta secante entre dos puntos"
        ],
        correct: 1,
        explain: "Cada iteración reemplaza la curva por su tangente y toma el corte de esa tangente con el eje x."
      },
      {
        q: "¿Qué ocurre si f'(xₙ) = 0 durante la iteración?",
        options: [
          "El método converge más rápido",
          "Hay división entre cero: el método falla y hay que cambiar el punto inicial",
          "Se llegó a la raíz",
          "No pasa nada, se continúa"
        ],
        correct: 1,
        explain: "Una tangente horizontal nunca corta el eje x. Por eso toda implementación debe verificar la derivada antes de dividir."
      },
      {
        q: "¿Qué pasa con el orden de convergencia de Newton en una raíz múltiple?",
        options: [
          "Sube a orden 3",
          "Se mantiene en 2",
          "Baja a orden 1 (lineal)",
          "El método diverge siempre"
        ],
        correct: 2,
        explain: "Con multiplicidad m se pierde el orden 2; la fórmula modificada x − m·f/f' lo recupera."
      },
      {
        q: "Aplicando Newton a f(x) = x² − 2 se obtiene la fórmula x(n+1) = (xₙ + 2/xₙ)/2. ¿Cómo se conoce?",
        options: [
          "Método de la secante",
          "Método babilónico de la raíz cuadrada",
          "Regla falsa",
          "Método de Muller"
        ],
        correct: 1,
        explain: "Es el algoritmo babilónico, usado milenios antes de Newton para aproximar raíces cuadradas."
      }
    ]
  },

  /* ---------- Unidad 3 ---------- */
  euler: {
    label: "Método de Euler",
    questions: [
      {
        q: "La fórmula del método de Euler para y' = f(t, y) es:",
        options: [
          "y(n+1) = y(n) + h · f(t(n), y(n))",
          "y(n+1) = y(n) · h · f(t(n), y(n))",
          "y(n+1) = f(t(n), y(n)) / h",
          "y(n+1) = y(n) − h"
        ],
        correct: 0,
        explain: "Se avanza un paso h siguiendo la pendiente evaluada al inicio del intervalo."
      },
      {
        q: "¿Cuál es el error global del método de Euler?",
        options: ["O(h)", "O(h²)", "O(h⁴)", "O(1)"],
        correct: 0,
        explain: "El error local es O(h²), pero como hay (b−a)/h pasos, el error acumulado queda en O(h): es de primer orden."
      },
      {
        q: "Si al reducir h a la mitad el error también se reduce a la mitad, el método es de:",
        options: ["Orden 1", "Orden 2", "Orden 3", "Orden 4"],
        correct: 0,
        explain: "Esa proporcionalidad directa entre h y el error es la firma experimental de un método de primer orden."
      },
      {
        q: "Para y' = t + y con y(0) = 1 y h = 0.1, ¿cuánto vale y₁?",
        options: ["1.0", "1.1", "1.2", "0.9"],
        correct: 1,
        explain: "y₁ = 1 + 0.1·(0 + 1) = 1.1."
      },
      {
        q: "Geométricamente, el método de Euler aproxima la solución mediante:",
        options: [
          "Una parábola",
          "Una poligonal de segmentos tangentes",
          "Una circunferencia",
          "Una serie de Fourier"
        ],
        correct: 1,
        explain: "Cada paso es un segmento recto con la pendiente de la tangente; el conjunto forma una poligonal que se aleja de la curva real."
      }
    ]
  },

  taylor: {
    label: "Método de Taylor",
    questions: [
      {
        q: "El método de Taylor de orden n tiene un error global de:",
        options: ["O(h)", "O(hⁿ)", "O(h^(n+1))", "O(n)"],
        correct: 1,
        explain: "El error local es O(h^(n+1)) y el global, tras acumular todos los pasos, queda en O(hⁿ)."
      },
      {
        q: "¿Cuál es la principal desventaja del método de Taylor de orden alto?",
        options: [
          "Es inestable",
          "Exige calcular a mano las derivadas totales sucesivas de f",
          "Solo funciona con funciones lineales",
          "Necesita mucha memoria"
        ],
        correct: 1,
        explain: "Esa incomodidad es justamente lo que motivó los métodos de Runge-Kutta, que logran el mismo orden sin derivar."
      },
      {
        q: "Al calcular f' para el método de Taylor, la derivada correcta es:",
        options: [
          "∂f/∂t solamente",
          "∂f/∂t + (∂f/∂y)·f, aplicando la regla de la cadena",
          "∂f/∂y solamente",
          "f multiplicada por t"
        ],
        correct: 1,
        explain: "Como y depende de t, hay que usar la derivada total. Olvidar el segundo sumando es el error más común del tema."
      },
      {
        q: "El método de Euler equivale al método de Taylor de orden:",
        options: ["0", "1", "2", "4"],
        correct: 1,
        explain: "Euler conserva solo el término lineal h·f de la serie de Taylor."
      },
      {
        q: "Para y' = y, el método de Taylor de orden 3 da:",
        options: [
          "y(n+1) = y(n)(1 + h)",
          "y(n+1) = y(n)(1 + h + h²/2 + h³/6)",
          "y(n+1) = y(n)·h³",
          "y(n+1) = y(n) + 3h"
        ],
        correct: 1,
        explain: "Todas las derivadas de y' = y coinciden con y, así que el factor es la serie de e^h truncada en el término cúbico."
      }
    ]
  },

  rungekutta: {
    label: "Método de Runge-Kutta",
    questions: [
      {
        q: "¿Cuántas evaluaciones de f necesita el Runge-Kutta clásico de cuarto orden por paso?",
        options: ["1", "2", "4", "6"],
        correct: 2,
        explain: "Las cuatro etapas k₁, k₂, k₃ y k₄, evaluadas al inicio, dos veces en el punto medio y al final del intervalo."
      },
      {
        q: "¿Cuál es la gran ventaja de Runge-Kutta frente al método de Taylor del mismo orden?",
        options: [
          "Es más exacto",
          "No requiere calcular ninguna derivada de f",
          "Usa menos memoria",
          "Funciona con funciones discontinuas"
        ],
        correct: 1,
        explain: "Sustituye las derivadas por evaluaciones adicionales de f dentro del intervalo, así que el código queda genérico."
      },
      {
        q: "En la combinación final de RK4, ¿qué pesos llevan las cuatro pendientes?",
        options: [
          "1, 1, 1, 1 divididos entre 4",
          "1, 2, 2, 1 divididos entre 6",
          "1, 3, 3, 1 divididos entre 8",
          "2, 1, 1, 2 divididos entre 6"
        ],
        correct: 1,
        explain: "Las pendientes del punto medio pesan el doble; la suma de los pesos es 1, así que es un promedio ponderado."
      },
      {
        q: "Si con h = 0.2 el error de RK4 es 2 × 10⁻⁶, ¿cuánto será aproximadamente con h = 0.1?",
        options: ["10⁻⁶", "1.25 × 10⁻⁷", "4 × 10⁻⁶", "10⁻³"],
        correct: 1,
        explain: "Al ser O(h⁴), dividir h entre 2 divide el error entre 2⁴ = 16."
      },
      {
        q: "¿Qué método de la familia Runge-Kutta usa SciPy por defecto en solve_ivp?",
        options: ["Euler", "RK45 (Dormand-Prince)", "RK2", "Adams-Moulton"],
        correct: 1,
        explain: "RK45 es un par encajado que estima el error en cada paso y ajusta h automáticamente."
      }
    ]
  },

  multipaso: {
    label: "Métodos multipaso",
    questions: [
      {
        q: "¿Qué distingue a un método multipaso de uno de un paso?",
        options: [
          "Que da pasos más grandes",
          "Que usa varios valores anteriores (yₙ, yₙ₋₁, yₙ₋₂…) y sus pendientes ya calculadas",
          "Que no necesita condición inicial",
          "Que solo funciona con ecuaciones lineales"
        ],
        correct: 1,
        explain: "Reutiliza el historial en lugar de descartarlo, lo que ahorra evaluaciones de f."
      },
      {
        q: "En el esquema predictor-corrector, ¿qué papel cumple Adams-Bashforth?",
        options: [
          "Es el corrector implícito",
          "Es el predictor explícito",
          "Calcula los valores de arranque",
          "Estima el tamaño de paso"
        ],
        correct: 1,
        explain: "Adams-Bashforth es explícito y predice y(n+1); Adams-Moulton, implícito, lo corrige."
      },
      {
        q: "¿Por qué Adams-Moulton se llama método implícito?",
        options: [
          "Porque su fórmula es secreta",
          "Porque el valor buscado y(n+1) aparece dentro de f en el lado derecho de la fórmula",
          "Porque no usa la condición inicial",
          "Porque requiere derivadas"
        ],
        correct: 1,
        explain: "El término 9·f(t(n+1), y(n+1)) contiene la incógnita, así que despejarla exigiría resolver una ecuación en cada paso."
      },
      {
        q: "¿Con qué método se suelen calcular los valores de arranque de un multipaso de orden 4?",
        options: [
          "Con el método de Euler",
          "Con Runge-Kutta de cuarto orden",
          "Con bisección",
          "No hacen falta valores de arranque"
        ],
        correct: 1,
        explain: "Arrancar con Euler contaminaría todo el cálculo con un error O(h); RK4 es autoiniciable y del mismo orden."
      },
      {
        q: "¿Cuál es la principal desventaja de los métodos multipaso?",
        options: [
          "Son muy lentos",
          "No son autoiniciables y cambiar el paso h obliga a reiniciar el arranque",
          "Solo alcanzan orden 1",
          "No permiten estimar el error"
        ],
        correct: 1,
        explain: "El historial guardado corresponde a un h concreto: modificarlo exige recalcular los valores de arranque."
      }
    ]
  }

});

/* Unidades del curso: agrupan los temas para los juegos por unidad. */
const UNIDADES = {
  u1: {
    label: "Fundamentos y Teoría de Errores",
    topics: ["metodo", "representacion", "flotante", "errores", "algoritmos", "python"]
  },
  u2: {
    label: "Métodos Iterativos y Raíces de Funciones",
    topics: ["intro", "tasas", "biseccion", "puntofijo", "newton", "muller"]
  },
  u3: {
    label: "Ecuaciones Diferenciales Ordinarias",
    topics: ["euler", "taylor", "rungekutta", "multipaso"]
  }
};

/* Orden completo de los 16 temas del curso (los tres unidades seguidas). */
const TOPIC_ORDER = [
  "metodo", "representacion", "flotante", "errores", "algoritmos", "python",
  "intro", "tasas", "biseccion", "puntofijo", "newton", "muller",
  "euler", "taylor", "rungekutta", "multipaso"
];

/* =========================================================
   NAV: menú móvil + scroll suave a tabs desde el footer
========================================================= */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

document.querySelectorAll("[data-tab-link]").forEach(link => {
  link.addEventListener("click", () => {
    const topic = link.getAttribute("data-tab-link");
    setTimeout(() => activateTab(topic), 300);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   MENÚ DESPLEGABLE "TEMAS"
========================================================= */
(function initTemasDropdown() {
  const dropdown = document.getElementById("temasDropdown");
  const toggle = document.getElementById("temasDropdownToggle");
  if (!dropdown || !toggle) return;

  toggle.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.addEventListener("click", e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();


/* =========================================================
   TABS DE TEMAS
========================================================= */
function activateTab(topic) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    const active = btn.dataset.tab === topic;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    const active = panel.id === "panel-" + topic;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
}
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

/* =========================================================
   MODAL DE JUEGO POR TEMA
========================================================= */
const quizModal = document.getElementById("quizModal");
const quizModalTag = document.getElementById("quizModalTag");
const quizModalTitle = document.getElementById("quizModalTitle");
const quizBody = document.getElementById("quizBody");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizResult = document.getElementById("quizResult");
const quizScoreText = document.getElementById("quizScoreText");
const quizMsgText = document.getElementById("quizMsgText");
const quizRetry = document.getElementById("quizRetry");

let currentTopic = null;
let currentIndex = 0;
let currentScore = 0;
let currentQuestionList = [];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMixedPool(n, topics) {
  const pool = [];
  (topics || TOPIC_ORDER).forEach(topic => {
    QUESTION_BANK[topic].questions.forEach(q => pool.push({ ...q, topic }));
  });
  return shuffleArray(pool).slice(0, n);
}

function openQuiz(topic) {
  currentTopic = topic;
  currentIndex = 0;
  currentScore = 0;

  // Dificultad elegida por el usuario: define tiempo por pregunta y vidas
  quizNivel = NIVELES[Progreso.dificultad()] || NIVELES.normal;
  quizVidas = quizNivel.vidas;
  quizRacha = 0;
  quizMejorRacha = 0;
  quizPuntos = 0;
  segEstado = [];

  if (topic === "integrado") {
    currentQuestionList = buildMixedPool(20);
    quizModalTag.textContent = "Integrado · 16 temas";
    quizModalTitle.textContent = "Quiz de repaso general";
  } else if (topic === "repaso") {
    // Repaso inteligente: solo las preguntas que se han fallado antes
    const pendientes = Progreso.falladas();
    const pool = [];
    TOPIC_ORDER.forEach(t => {
      QUESTION_BANK[t].questions.forEach(q => {
        if (pendientes[Progreso.idDe(q)]) pool.push({ ...q, topic: t });
      });
    });
    currentQuestionList = shuffleArray(pool).slice(0, 15);
    quizModalTag.textContent = "Repaso inteligente";
    quizModalTitle.textContent = "Las preguntas que has fallado";
  } else if (UNIDADES[topic]) {
    currentQuestionList = buildMixedPool(10, UNIDADES[topic].topics);
    quizModalTag.textContent = UNIDADES[topic].label;
    quizModalTitle.textContent = "Juego de preguntas de la unidad";
  } else {
    currentQuestionList = shuffleArray(QUESTION_BANK[topic].questions)
      .map(q => ({ ...q, topic }));
    quizModalTag.textContent = "Tema · " + QUESTION_BANK[topic].label;
    quizModalTitle.textContent = "Juego de preguntas";
  }

  if (!currentQuestionList.length) {
    quizModalTitle.textContent = "No hay preguntas pendientes";
    currentQuestionList = [];
  }

  quizModal.classList.add("open");
  quizModal.setAttribute("aria-hidden", "false");
  quizResult.hidden = true;
  quizBody.hidden = false;
  quizHud.hidden = false;
  renderQuizQuestion();
}
function closeQuiz() {
  pararCronometro();
  clearTimeout(avanceAuto);
  quizModal.classList.remove("open");
  quizModal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeQuiz));

document.getElementById("gameCards").addEventListener("click", e => {
  const card = e.target.closest(".game-card");
  if (card) openQuiz(card.dataset.topic);
});

// Práctica tema por tema: cada chip abre el juego de ese tema concreto
const topicQuizChips = document.getElementById("topicQuizChips");
if (topicQuizChips) {
  topicQuizChips.addEventListener("click", e => {
    const chip = e.target.closest(".topic-chip");
    if (chip) openQuiz(chip.dataset.topic);
  });
}

const integratedQuizBtn = document.getElementById("integratedQuizBtn");
if (integratedQuizBtn) {
  integratedQuizBtn.addEventListener("click", () => openQuiz("integrado"));
}

/* =========================================================
   Cuenta regresiva compartida antes de pasar a la siguiente pregunta
========================================================= */
function startAdvanceCountdown(containerEl, seconds, onAdvance) {
  const box = document.createElement("div");
  box.className = "quiz-countdown";
  box.innerHTML = `<span>Siguiente pregunta en <strong id="qcSeconds">${seconds}</strong>s…</span>
    <button type="button" class="quiz-countdown-skip">Ver siguiente ahora &rarr;</button>`;
  containerEl.appendChild(box);

  let remaining = seconds;
  const secSpan = box.querySelector("#qcSeconds");
  const skipBtn = box.querySelector(".quiz-countdown-skip");

  const timer = setInterval(() => {
    remaining--;
    if (secSpan) secSpan.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      clearInterval(timer);
      onAdvance();
    }
  }, 1000);

  skipBtn.addEventListener("click", () => {
    clearInterval(timer);
    onAdvance();
  });
}

/* =========================================================
   PROGRESO DEL ESTUDIANTE (se guarda solo en este navegador)
   - acertadas: preguntas respondidas bien al menos una vez
   - falladas:  preguntas pendientes de repaso
   - records:   mejor puntaje por juego
   - dificultad: nivel elegido
========================================================= */
const Progreso = (function () {
  const CLAVE = "mn_progreso_v1";
  const vacio = { acertadas: {}, falladas: {}, records: {}, dificultad: "normal" };

  function leer() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (!crudo) return { ...vacio };
      return Object.assign({}, vacio, JSON.parse(crudo));
    } catch (e) { return { ...vacio }; }        // modo privado o almacenamiento bloqueado
  }
  function escribir(d) {
    try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) { /* sin persistencia */ }
  }

  /* Identificador estable de una pregunta a partir de su enunciado */
  function idDe(pregunta) {
    let h = 5381;
    const t = pregunta.q;
    for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return "q" + (h >>> 0).toString(36);
  }

  return {
    idDe,
    registrar(pregunta, acerto) {
      const d = leer();
      const id = idDe(pregunta);
      if (acerto) { d.acertadas[id] = 1; delete d.falladas[id]; }
      else { d.falladas[id] = pregunta.topic || "?"; }
      escribir(d);
    },
    falladas() { return leer().falladas; },
    acertadas() { return leer().acertadas; },
    /* Porcentaje de dominio de una lista de temas */
    dominio(temas) {
      const d = leer();
      let total = 0, bien = 0;
      temas.forEach(t => {
        const banco = QUESTION_BANK[t];
        if (!banco) return;
        banco.questions.forEach(q => { total++; if (d.acertadas[idDe(q)]) bien++; });
      });
      return { total, bien, pct: total ? Math.round((bien / total) * 100) : 0 };
    },
    record(juego) { return leer().records[juego] || 0; },
    guardarRecord(juego, valor, mayorEsMejor = true) {
      const d = leer();
      const previo = d.records[juego];
      const esNuevo = previo === undefined ||
                      (mayorEsMejor ? valor > previo : valor < previo);
      if (esNuevo) { d.records[juego] = valor; escribir(d); }
      return esNuevo;
    },
    dificultad() { return leer().dificultad; },
    fijarDificultad(nivel) { const d = leer(); d.dificultad = nivel; escribir(d); },
    reiniciar() { escribir({ ...vacio, dificultad: leer().dificultad }); }
  };
})();

const NIVELES = {
  facil:   { segundos: 30, vidas: 5, nombre: "Fácil" },
  normal:  { segundos: 20, vidas: 3, nombre: "Normal" },
  dificil: { segundos: 12, vidas: 2, nombre: "Difícil" }
};

const MEDALLAS = [
  { min: 100, icono: "★", nombre: "Platino",  clase: "es-platino" },
  { min: 85,  icono: "●", nombre: "Oro",      clase: "es-oro" },
  { min: 70,  icono: "●", nombre: "Plata",    clase: "es-plata" },
  { min: 50,  icono: "●", nombre: "Bronce",   clase: "es-bronce" },
  { min: 0,   icono: "▲", nombre: "Sigue practicando", clase: "es-ninguna" }
];
function medallaDe(pct) { return MEDALLAS.find(m => pct >= m.min); }

/* =========================================================
   CONFETI (se dibuja en un canvas dentro del propio modal)
========================================================= */
function lanzarConfeti(canvas) {
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const caja = canvas.parentElement.getBoundingClientRect();
  canvas.width = caja.width; canvas.height = caja.height;
  const ctx = canvas.getContext("2d");
  const colores = ["#BB4F27", "#0F6E73", "#7FD0D4", "#2E7D5B", "#9A3F1D"];
  const piezas = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    w: 5 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    vy: 1.6 + Math.random() * 2.6,
    vx: -1 + Math.random() * 2,
    giro: Math.random() * Math.PI,
    vGiro: -0.12 + Math.random() * 0.24,
    color: colores[Math.floor(Math.random() * colores.length)]
  }));
  const inicio = performance.now();
  canvas.classList.add("is-on");
  (function animar(t) {
    const transcurrido = t - inicio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piezas.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.giro += p.vGiro;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.giro);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - transcurrido / 2600);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (transcurrido < 2600) requestAnimationFrame(animar);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.classList.remove("is-on"); }
  })(inicio);
}

/* =========================================================
   MOTOR DEL QUIZ
========================================================= */
const quizHud       = document.getElementById("quizHud");
const quizLivesEl   = document.getElementById("quizLives");
const quizStreakEl  = document.getElementById("quizStreak");
const quizPointsEl  = document.getElementById("quizPoints");
const quizSegments  = document.getElementById("quizSegments");
const quizTimerEl   = document.getElementById("quizTimer");
const quizTimerFill = document.getElementById("quizTimerFill");
const quizTimerNum  = document.getElementById("quizTimerNum");
const quizConfetti  = document.getElementById("quizConfetti");
const quizMedalEl   = document.getElementById("quizMedal");
const quizMedalName = document.getElementById("quizMedalName");
const quizPointsTxt = document.getElementById("quizPointsText");
const quizRecordTxt = document.getElementById("quizRecordText");
const quizReviewBtn = document.getElementById("quizReviewFails");

const PERIMETRO = 2 * Math.PI * 19;   // radio 19 del círculo del cronómetro

let quizVidas = 0, quizRacha = 0, quizMejorRacha = 0, quizPuntos = 0;
let quizNivel = NIVELES.normal;
let cronometro = null, tiempoRestante = 0, respondida = false;
let avanceAuto = null;

function pintarHud() {
  quizLivesEl.innerHTML = "";
  for (let i = 0; i < quizNivel.vidas; i++) {
    const v = document.createElement("span");
    v.className = "vida" + (i < quizVidas ? "" : " esta-perdida");
    v.textContent = "♥";
    quizLivesEl.appendChild(v);
  }
  quizStreakEl.textContent = quizRacha + (quizRacha >= 3 ? " 🔥" : "");
  quizStreakEl.classList.toggle("esta-caliente", quizRacha >= 3);
  quizPointsEl.textContent = quizPuntos;
}

function pintarSegmentos() {
  quizSegments.innerHTML = "";
  currentQuestionList.forEach((_, i) => {
    const seg = document.createElement("span");
    seg.className = "quiz-seg";
    // El estado se pinta en cuanto se responde, sin esperar a avanzar
    if (segEstado[i]) seg.classList.add(segEstado[i]);
    else if (i === currentIndex) seg.classList.add("es-actual");
    quizSegments.appendChild(seg);
  });
}
let segEstado = [];

function pararCronometro() {
  if (cronometro) { clearInterval(cronometro); cronometro = null; }
}

function arrancarCronometro(alAgotarse) {
  pararCronometro();
  tiempoRestante = quizNivel.segundos;
  quizTimerFill.style.strokeDasharray = PERIMETRO;
  const pintar = () => {
    quizTimerNum.textContent = tiempoRestante;
    const frac = tiempoRestante / quizNivel.segundos;
    quizTimerFill.style.strokeDashoffset = PERIMETRO * (1 - frac);
    quizTimerEl.classList.toggle("esta-urgente", tiempoRestante <= 5);
  };
  pintar();
  cronometro = setInterval(() => {
    tiempoRestante--;
    pintar();
    if (tiempoRestante <= 0) { pararCronometro(); alAgotarse(); }
  }, 1000);
}

function renderQuizQuestion() {
  clearTimeout(avanceAuto);
  const lista = currentQuestionList;
  const total = lista.length;

  if (currentIndex >= total || quizVidas <= 0) { finishQuiz(); return; }

  pintarSegmentos();
  pintarHud();
  respondida = false;
  quizTimerEl.hidden = false;

  const item = lista[currentIndex];
  quizBody.innerHTML = `
    <p class="quiz-question"><span class="quiz-qnum">${currentIndex + 1}/${total}</span> ${item.q}</p>
    <ul class="quiz-options"></ul>
    <p class="quiz-feedback"></p>
  `;
  const opciones = quizBody.querySelector(".quiz-options");
  const feedback = quizBody.querySelector(".quiz-feedback");

  function resolver(indiceElegido, seAgotoElTiempo) {
    if (respondida) return;
    respondida = true;
    pararCronometro();
    quizTimerEl.hidden = true;

    const botones = Array.from(opciones.querySelectorAll(".quiz-option"));
    botones.forEach(b => (b.disabled = true));
    const acerto = !seAgotoElTiempo && indiceElegido === item.correct;

    if (acerto) {
      botones[indiceElegido].classList.add("correct", "esta-acertando");
      quizRacha++;
      quizMejorRacha = Math.max(quizMejorRacha, quizRacha);
      currentScore++;
      // 100 base + hasta 50 por rapidez + 25 por cada acierto encadenado (tope x4)
      const bonusTiempo = Math.round(50 * (tiempoRestante / quizNivel.segundos));
      const bonusRacha = Math.min(quizRacha - 1, 4) * 25;
      const ganado = 100 + bonusTiempo + bonusRacha;
      quizPuntos += ganado;
      segEstado[currentIndex] = "es-acierto";
      feedback.className = "quiz-feedback is-correct";
      feedback.innerHTML = `<strong>Correcto</strong> +${ganado} pts` +
        (bonusRacha ? ` <em>(racha ×${quizRacha})</em>` : "") + ` — ${item.explain}`;
    } else {
      quizRacha = 0;
      quizVidas--;
      segEstado[currentIndex] = "es-fallo";
      if (!seAgotoElTiempo) botones[indiceElegido].classList.add("wrong", "esta-fallando");
      botones[item.correct].classList.add("correct");
      quizBody.classList.add("esta-temblando");
      setTimeout(() => quizBody.classList.remove("esta-temblando"), 420);
      feedback.className = "quiz-feedback is-wrong";
      feedback.innerHTML = (seAgotoElTiempo
        ? "<strong>Se acabó el tiempo</strong> — "
        : "<strong>Incorrecto</strong> — ") + item.explain;
    }

    Progreso.registrar({ q: item.q, topic: item.topic || currentTopic }, acerto);
    pintarHud();
    pintarSegmentos();

    if (quizVidas <= 0) {
      feedback.innerHTML += ' <span class="sin-vidas">Te quedaste sin vidas.</span>';
      avanceAuto = setTimeout(finishQuiz, 2600);
      return;
    }
    startAdvanceCountdown(quizBody, 8, () => { currentIndex++; renderQuizQuestion(); });
  }

  item.options.forEach((texto, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.type = "button";
    btn.textContent = texto;
    btn.addEventListener("click", () => resolver(i, false));
    li.appendChild(btn);
    opciones.appendChild(li);
  });

  arrancarCronometro(() => resolver(-1, true));
}

function finishQuiz() {
  clearTimeout(avanceAuto);
  pararCronometro();
  quizTimerEl.hidden = true;

  const respondidas = currentIndex >= currentQuestionList.length
    ? currentQuestionList.length
    : currentIndex + 1;
  const total = currentQuestionList.length;
  const pct = Math.round((currentScore / total) * 100);
  const medalla = medallaDe(pct);

  currentIndex = total;
  pintarSegmentos();
  quizBody.hidden = true;
  quizResult.hidden = false;

  quizMedalEl.className = "quiz-medal " + medalla.clase;
  quizMedalEl.textContent = medalla.icono;
  quizMedalName.textContent = medalla.nombre;

  quizScoreText.textContent = `${currentScore} de ${total} correctas (${pct}%)`;
  quizPointsTxt.innerHTML =
    `<strong>${quizPuntos}</strong> puntos · mejor racha: <strong>${quizMejorRacha}</strong>` +
    ` · dificultad: <strong>${quizNivel.nombre}</strong>`;

  const claveRecord = "quiz-" + currentTopic;
  const recordPrevio = Progreso.record(claveRecord);
  const esRecord = Progreso.guardarRecord(claveRecord, quizPuntos);
  quizRecordTxt.innerHTML = esRecord && recordPrevio > 0
    ? `¡Nuevo récord! Antes tenías ${recordPrevio} puntos.`
    : (esRecord ? "Primer resultado guardado como tu récord."
                : `Tu récord en este juego sigue siendo ${recordPrevio} puntos.`);

  if (quizVidas <= 0 && respondidas < total) {
    quizMsgText.textContent = "Te quedaste sin vidas antes de terminar. Repasa el tema y vuelve a intentarlo: las preguntas se mezclan de nuevo.";
  } else if (pct >= 80) {
    quizMsgText.textContent = "¡Excelente! Ya puedes intentar el reto final para certificarte.";
  } else if (pct >= 50) {
    quizMsgText.textContent = "Vas bien. Repasa los puntos que fallaste y sube la puntuación en el siguiente intento.";
  } else {
    quizMsgText.textContent = "Conviene volver al contenido del tema antes de reintentar.";
  }

  const pendientes = Object.keys(Progreso.falladas()).length;
  quizReviewBtn.hidden = pendientes === 0;
  quizReviewBtn.textContent = `Repasar mis fallos (${pendientes})`;

  if (pct >= 85) lanzarConfeti(quizConfetti);
  if (typeof pintarProgreso === "function") pintarProgreso();
}

quizRetry.addEventListener("click", () => openQuiz(currentTopic));
quizReviewBtn.addEventListener("click", () => openQuiz("repaso"));

/* =========================================================
   CERTIFICACIÓN
========================================================= */
const certLoginForm = document.getElementById("certLoginForm");
const certExam = document.getElementById("certExam");
const certExamBody = document.getElementById("certExamBody");
const certProgressBar = document.getElementById("certProgressBar");
const certPass = document.getElementById("certPass");
const certFail = document.getElementById("certFail");
const certPassScore = document.getElementById("certPassScore");
const certFailScore = document.getElementById("certFailScore");
const weakTopicsList = document.getElementById("weakTopicsList");

let examQuestions = [];
let examIndex = 0;
let examScore = 0;
let examTopicWrong = new Set();
let studentName = "";
let studentEmail = "";

function buildExamPool() {
  const pool = [];
  TOPIC_ORDER.forEach(topic => {
    QUESTION_BANK[topic].questions.forEach(q => pool.push({ ...q, topic }));
  });
  // barajar (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 15);
}

/* --- Validación y vista previa del formulario de certificación --- */
const certStart      = document.getElementById("certStart");
const certNameInput  = document.getElementById("certName");
const certEmailInput = document.getElementById("certEmail");
const certPreviewName = document.getElementById("certPreviewName");
const certSegments   = document.getElementById("certSegments");
const certExamFor    = document.getElementById("certExamFor");

const REGLAS_CERT = {
  certName: {
    el: certNameInput, error: "errCertName",
    valida: v => v.trim().length >= 3 || "Escribe tu nombre completo: así quedará impreso en el certificado."
  },
  certEmail: {
    el: certEmailInput, error: "errCertEmail",
    valida: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Escribe un correo válido para poder enviarte el certificado."
  }
};

function validarCert(id, mostrar) {
  const r = REGLAS_CERT[id];
  const res = r.valida(r.el.value);
  const ok = res === true;
  if (mostrar) {
    r.el.classList.toggle("is-invalid", !ok);
    r.el.classList.toggle("is-valid", ok && r.el.value.trim() !== "");
    r.el.setAttribute("aria-invalid", String(!ok));
    document.getElementById(r.error).textContent = ok ? "" : res;
  }
  return ok;
}

Object.keys(REGLAS_CERT).forEach(id => {
  const el = REGLAS_CERT[id].el;
  el.addEventListener("blur", () => validarCert(id, true));
  el.addEventListener("input", () => {
    if (el.classList.contains("is-invalid")) validarCert(id, true);
  });
});

// El nombre se muestra en vivo tal como saldrá impreso
certNameInput.addEventListener("input", () => {
  const v = certNameInput.value.trim();
  certPreviewName.textContent = v || "Tu nombre aquí";
  certPreviewName.classList.toggle("esta-vacio", !v);
});
certPreviewName.classList.add("esta-vacio");

/* Barra por segmentos del examen */
function pintarSegmentosCert() {
  if (!certSegments) return;
  certSegments.innerHTML = "";
  examQuestions.forEach((_, i) => {
    const seg = document.createElement("span");
    seg.className = "quiz-seg";
    if (certSegEstado[i]) seg.classList.add(certSegEstado[i]);
    else if (i === examIndex) seg.classList.add("es-actual");
    certSegments.appendChild(seg);
  });
}
let certSegEstado = [];

certLoginForm.addEventListener("submit", e => {
  e.preventDefault();

  const validos = Object.keys(REGLAS_CERT).map(id => validarCert(id, true));
  if (validos.some(v => !v)) {
    const primero = certLoginForm.querySelector(".is-invalid");
    if (primero) primero.focus();
    return;
  }

  studentName = certNameInput.value.trim();
  studentEmail = certEmailInput.value.trim();

  examQuestions = buildExamPool();
  examIndex = 0;
  examScore = 0;
  examTopicWrong = new Set();
  certSegEstado = [];

  if (certExamFor) certExamFor.textContent = studentName + " · " + studentEmail;

  certStart.hidden = true;
  certExam.hidden = false;
  certPass.hidden = true;
  certFail.hidden = true;
  renderExamQuestion();
});

function renderExamQuestion() {
  const total = examQuestions.length;
  certProgressBar.style.width = (examIndex / total) * 100 + "%";
  pintarSegmentosCert();

  if (examIndex >= total) {
    finishExam();
    return;
  }
  const item = examQuestions[examIndex];
  certExamBody.innerHTML = `
    <p class="quiz-question">${examIndex + 1} / ${total} — ${item.q}</p>
    <ul class="quiz-options"></ul>
    <p class="quiz-feedback"></p>
  `;
  const optionsList = certExamBody.querySelector(".quiz-options");
  const feedback = certExamBody.querySelector(".quiz-feedback");

  item.options.forEach((opt, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      Array.from(optionsList.querySelectorAll(".quiz-option")).forEach(b => b.disabled = true);
      if (i === item.correct) {
        btn.classList.add("correct", "esta-acertando");
        examScore++;
        certSegEstado[examIndex] = "es-acierto";
        feedback.classList.add("is-correct");
        feedback.textContent = "Correcto — " + item.explain;
      } else {
        btn.classList.add("wrong", "esta-fallando");
        optionsList.children[item.correct].firstChild.classList.add("correct");
        certSegEstado[examIndex] = "es-fallo";
        feedback.classList.add("is-wrong");
        feedback.textContent = "Incorrecto — " + item.explain;
        examTopicWrong.add(item.topic);
      }
      Progreso.registrar({ q: item.q, topic: item.topic }, i === item.correct);
      pintarSegmentosCert();
      startAdvanceCountdown(certExamBody, 30, () => {
        examIndex++;
        renderExamQuestion();
      });
    });
    li.appendChild(btn);
    optionsList.appendChild(li);
  });
}

function finishExam() {
  const total = examQuestions.length;
  const pct = Math.round((examScore / total) * 100);
  certProgressBar.style.width = "100%";
  pintarSegmentosCert();
  certExam.hidden = true;
  if (typeof pintarProgreso === "function") pintarProgreso();

  if (pct >= 80) {
    certPass.hidden = false;
    certPassScore.textContent = `${examScore} / ${total} respuestas correctas (${pct}%)`;
    drawCertificate(studentName, pct);
    document.getElementById("certSendNote").textContent = "";
  } else {
    certFail.hidden = false;
    certFailScore.textContent = `${examScore} / ${total} respuestas correctas (${pct}%) — se requiere 80%`;
    weakTopicsList.innerHTML = "";
    const topicsToReview = examTopicWrong.size ? Array.from(examTopicWrong) : TOPIC_ORDER;
    topicsToReview.forEach(t => {
      const li = document.createElement("li");
      li.textContent = QUESTION_BANK[t].label;
      weakTopicsList.appendChild(li);
    });
  }
}

document.getElementById("certRetry").addEventListener("click", () => {
  certFail.hidden = true;
  certStart.hidden = false;
  certNameInput.focus();
});

/* --- Certificado en canvas --- */
function drawCertificate(name, pct) {
  const canvas = document.getElementById("certificateCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // fondo
  ctx.fillStyle = "#FBF8F3";
  ctx.fillRect(0, 0, W, H);

  // borde
  ctx.strokeStyle = "#0E3B40";
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = "#BB4F27";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // grid decorativo sutil
  ctx.strokeStyle = "rgba(14,59,64,0.05)";
  ctx.lineWidth = 1;
  for (let x = 40; x < W - 40; x += 38) {
    ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, H - 40); ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#0F6E73";
  ctx.font = "700 23px 'IBM Plex Mono', monospace";
  ctx.fillText("MÉTODOS NUMÉRICOS · AULA INTERACTIVA", W / 2, 128);

  ctx.fillStyle = "#0E3B40";
  ctx.font = "700 52px 'Space Grotesk', sans-serif";
  ctx.fillText("Certificado de logro", W / 2, 202);

  ctx.fillStyle = "#5A6866";
  ctx.font = "600 24px 'Inter', sans-serif";
  ctx.fillText("Se certifica que", W / 2, 268);

  ctx.fillStyle = "#0E3B40";
  ctx.font = "700 48px 'Space Grotesk', sans-serif";
  ctx.fillText(name || "Estudiante", W / 2, 332);

  ctx.fillStyle = "#5A6866";
  ctx.font = "600 23px 'Inter', sans-serif";
  ctx.fillText("completó satisfactoriamente el reto final de", W / 2, 384);

  ctx.fillStyle = "#0E3B40";
  ctx.font = "700 27px 'Space Grotesk', sans-serif";
  wrapCenteredText(ctx, "Fundamentos y teoría de errores · Métodos iterativos y raíces de funciones · Ecuaciones diferenciales ordinarias", W / 2, 424, 820, 32);

  ctx.fillStyle = "#BB4F27";
  ctx.font = "700 36px 'IBM Plex Mono', monospace";
  ctx.fillText(`Puntaje obtenido: ${pct}%`, W / 2, 494);

  const date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  ctx.fillStyle = "#5A6866";
  ctx.font = "600 19px 'Inter', sans-serif";
  ctx.fillText(date, W / 2, 616);
  ctx.font = "500 18px 'Inter', sans-serif";
  ctx.fillText("Proyecto académico de Ingeniería de Sistemas", W / 2, 642);
}

function wrapCenteredText(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  words.forEach(word => {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
}

document.getElementById("certDownload").addEventListener("click", () => {
  const canvas = document.getElementById("certificateCanvas");
  const link = document.createElement("a");
  link.download = "certificado-metodos-numericos.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.getElementById("certSend").addEventListener("click",()=>{


    let canvas = document.getElementById("certificateCanvas");

    let imagen = canvas.toDataURL("image/png");


    let datos = new FormData();

    datos.append("accion","enviar_certificado");
    datos.append(
        "nombre",
        document.getElementById("certName").value
    );

    datos.append(
        "correo",
        document.getElementById("certEmail").value
    );

    datos.append(
        "imagen",
        imagen
    );



    fetch("index.php",{
        method:"POST",
        body:datos
    })

    .then(res=>res.text())

    .then(res=>{

        document.getElementById("certSendNote").innerHTML=res;

    });


});

/* =========================================================
   FORMULARIO DE CONTACTO — guarda en el buzón de sugerencias
========================================================= */
/* =========================================================
   FORMULARIO DE CONTACTO
   Validación en línea, contador de caracteres y estado de éxito.
========================================================= */
(function initContactForm() {
  const form      = document.getElementById("contactForm");
  if (!form) return;
  const nombre    = document.getElementById("contactName");
  const correo    = document.getElementById("contactEmail");
  const asunto    = document.getElementById("contactSubject");
  const mensaje   = document.getElementById("contactMsg");
  const contador  = document.getElementById("contadorMsg");
  const nota      = document.getElementById("contactNote");
  const boton     = document.getElementById("contactSubmit");
  const exito     = document.getElementById("contactSuccess");
  const exitoTxt  = document.getElementById("contactSuccessText");
  const otro      = document.getElementById("contactAnother");

  const REGLAS = {
    contactName: {
      el: nombre,
      error: "errName",
      valida: v => v.trim().length >= 3 || "Escribe tu nombre completo (mínimo 3 caracteres)."
    },
    contactEmail: {
      el: correo,
      error: "errEmail",
      valida: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Escribe un correo válido, por ejemplo nombre@dominio.com."
    },
    contactSubject: {
      el: asunto,
      error: "errSubject",
      valida: v => v !== "" || "Elige el asunto que mejor describa tu mensaje."
    },
    contactMsg: {
      el: mensaje,
      error: "errMsg",
      valida: v => v.trim().length >= 10 || "Cuéntanos un poco más: al menos 10 caracteres."
    }
  };

  function validarCampo(id, mostrar) {
    const r = REGLAS[id];
    const resultado = r.valida(r.el.value);
    const cajaError = document.getElementById(r.error);
    const ok = resultado === true;
    if (mostrar) {
      r.el.classList.toggle("is-invalid", !ok);
      r.el.classList.toggle("is-valid", ok && r.el.value.trim() !== "");
      r.el.setAttribute("aria-invalid", String(!ok));
      cajaError.textContent = ok ? "" : resultado;
    }
    return ok;
  }

  Object.keys(REGLAS).forEach(id => {
    const el = REGLAS[id].el;
    // Solo se marca el error al salir del campo, no mientras se escribe
    el.addEventListener("blur", () => validarCampo(id, true));
    el.addEventListener("input", () => {
      if (el.classList.contains("is-invalid")) validarCampo(id, true);
    });
    if (el.tagName === "SELECT") el.addEventListener("change", () => validarCampo(id, true));
  });

  // Contador de caracteres del mensaje
  function actualizarContador() {
    const n = mensaje.value.length;
    const max = mensaje.maxLength;
    contador.textContent = n + " / " + max;
    contador.classList.toggle("is-near", n > max * 0.9);
  }
  mensaje.addEventListener("input", actualizarContador);
  actualizarContador();

  form.addEventListener("submit", e => {
    e.preventDefault();

    const validos = Object.keys(REGLAS).map(id => validarCampo(id, true));
    if (validos.some(v => !v)) {
      nota.textContent = "Revisa los campos marcados antes de enviar.";
      nota.className = "field-note is-error";
      const primerFallo = form.querySelector(".is-invalid");
      if (primerFallo) primerFallo.focus();
      return;
    }

    const datos = new FormData();
    datos.append("accion", "enviar_sugerencia");
    datos.append("nombre", nombre.value.trim());
    datos.append("correo", correo.value.trim());
    datos.append("asunto", asunto.value);
    datos.append("mensaje", mensaje.value.trim());

    boton.disabled = true;
    boton.classList.add("is-loading");
    nota.textContent = "Enviando tu mensaje…";
    nota.className = "field-note";

    fetch("index.php", { method: "POST", body: datos })
      .then(res => res.text())
      .then(txt => {
        if (txt.indexOf("Error") !== -1) {
          nota.textContent = txt;
          nota.className = "field-note is-error";
          return;
        }
        exitoTxt.textContent = "Gracias, " + nombre.value.trim().split(" ")[0] +
          ". Tu mensaje sobre «" + asunto.value + "» quedó registrado en el buzón y lo revisaremos pronto.";
        form.hidden = true;
        exito.hidden = false;
        exito.classList.add("is-in");
        form.reset();
        actualizarContador();
        form.querySelectorAll(".is-valid, .is-invalid")
            .forEach(el => el.classList.remove("is-valid", "is-invalid"));
        form.querySelectorAll(".field-error").forEach(el => (el.textContent = ""));
      })
      .catch(() => {
        nota.textContent = "No se pudo enviar el mensaje. Revisa tu conexión e intenta de nuevo.";
        nota.className = "field-note is-error";
      })
      .finally(() => {
        boton.disabled = false;
        boton.classList.remove("is-loading");
      });
  });

  otro.addEventListener("click", () => {
    exito.hidden = true;
    exito.classList.remove("is-in");
    form.hidden = false;
    nota.textContent = "Tu mensaje queda registrado en el buzón de sugerencias del sitio. No lo compartimos con nadie más.";
    nota.className = "field-note";
    nombre.focus();
  });
})();

/* =========================================================
   NOSOTROS — modal de Público / Objetivo / Resultados
========================================================= */
(function initAboutModal() {
  const grid = document.getElementById("aboutBtnGrid");
  const modal = document.getElementById("aboutModal");
  if (!grid || !modal) return;

  const tag = document.getElementById("aboutModalTag");
  const title = document.getElementById("aboutModalTitle");
  const body = document.getElementById("aboutModalBody");

  const ABOUT_CONTENT = {
    quienes: {
      tag: "Nosotros · Quiénes somos",
      title: "Quiénes somos",
      html: `
        <p>Somos un equipo de estudiantes de <strong>Ingeniería de Sistemas</strong> que diseñó, programó y probó esta aula interactiva como proyecto académico de la asignatura de Métodos Numéricos.</p>
        <p>Construimos este sitio pensando en lo que a nosotros mismos nos habría servido para estudiar: contenido claro, ejercicios prácticos con retroalimentación inmediata y una forma de autoevaluarnos antes del examen final.</p>
        <ul class="check-list">
          <li>Diseño, desarrollo y contenido académico realizados íntegramente por el equipo del proyecto.</li>
          <li>Cada tema fue revisado y verificado numéricamente antes de publicarse.</li>
          <li>El sitio se mantiene y actualiza como parte del trabajo del curso.</li>
        </ul>`
    },
    publico: {
      tag: "Nosotros · Público objetivo",
      title: "¿Para quién es este sitio?",
      html: `
        <p>Este sitio está diseñado para <strong>estudiantes de Ingeniería de Sistemas e Ingeniería Industrial que cursan séptimo semestre</strong> la asignatura de Métodos Numéricos, como apoyo de estudio fuera del salón de clase.</p>
        <ul class="check-list">
          <li>Estudiantes que necesitan repasar teoría de errores, búsqueda de raíces o métodos para ecuaciones diferenciales antes de un examen o parcial.</li>
          <li>Estudiantes que aprenden mejor con ejemplos interactivos, juegos y retroalimentación inmediata que con solo teoría en el tablero.</li>
          <li>Estudiantes que quieren autoevaluarse con ejercicios propuestos y obtener un certificado digital al aprobar el reto final.</li>
          <li>Docentes que quieran usar el sitio como material de apoyo complementario en clase.</li>
        </ul>`
    },
    objetivo: {
      tag: "Nosotros · Objetivo del sitio",
      title: "Objetivo del sitio web",
      html: `
        <p>Brindar a los estudiantes de Ingeniería de Sistemas e Ingeniería Industrial de séptimo semestre una <strong>herramienta digital, interactiva y de libre acceso</strong> para comprender, practicar y evaluar los métodos numéricos de las tres unidades del curso: teoría de errores y aritmética del computador, solución de ecuaciones de una variable e integración numérica de ecuaciones diferenciales ordinarias.</p>
        <ul class="check-list">
          <li>Explicar cada método con un lenguaje claro, fórmulas, diagramas y videos, sin depender únicamente de la clase presencial.</li>
          <li>Ofrecer ejercicios resueltos paso a paso y ejercicios propuestos con retroalimentación para practicar por cuenta propia.</li>
          <li>Reforzar el aprendizaje con juegos de preguntas y un reto final que certifica el dominio del contenido.</li>
          <li>Ser accesible para todo tipo de estudiante, con opciones de tamaño de letra, alto contraste y lectura en voz alta.</li>
        </ul>`
    },
    resultados: {
      tag: "Nosotros · Resultados esperados",
      title: "Resultados que obtiene el estudiante",
      html: `
        <dl class="results-grid">
          <div><dt>01</dt><dd>Comprende cuándo y por qué se usa cada uno de los 16 métodos y temas del curso.</dd></div>
          <div><dt>02</dt><dd>Practica con ejercicios resueltos y propuestos, verificando sus respuestas al instante.</dd></div>
          <div><dt>03</dt><dd>Refuerza lo aprendido jugando quizzes por tema, el quiz integrado y los juegos de arcade.</dd></div>
          <div><dt>04</dt><dd>Obtiene un certificado digital descargable (PNG) al aprobar el reto final con 80% o más.</dd></div>
        </dl>`
    }
  };

  function openAbout(key) {
    const c = ABOUT_CONTENT[key];
    if (!c) return;
    tag.textContent = c.tag;
    title.textContent = c.title;
    body.innerHTML = c.html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeAbout() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  grid.addEventListener("click", e => {
    const btn = e.target.closest(".about-btn");
    if (btn) openAbout(btn.dataset.about);
  });
  modal.querySelectorAll("[data-close-about]").forEach(el => el.addEventListener("click", closeAbout));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAbout();
  });
})();



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
