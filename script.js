
/* ===== MENÚ PARA CELULARES ===== */
const menuBoton = document.getElementById("menuBoton");
const navegacion = document.getElementById("navegacion");

menuBoton.addEventListener("click", () => {
    const abierto = navegacion.classList.toggle("abierto");
    menuBoton.setAttribute("aria-expanded", abierto);
    menuBoton.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );
    menuBoton.textContent = abierto ? "×" : "☰";
});

document.querySelectorAll(".navegacion a").forEach(enlace => {
    enlace.addEventListener("click", () => {
        navegacion.classList.remove("abierto");
        menuBoton.setAttribute("aria-expanded", "false");
        menuBoton.setAttribute("aria-label", "Abrir menú");
        menuBoton.textContent = "☰";
    });
});

/* ===== FILTRAR PELÍCULAS ===== */
const botonesFiltro = document.querySelectorAll(".filtro");
const tarjetasPelicula = document.querySelectorAll(".pelicula-card");

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach(item => item.classList.remove("activo"));
        boton.classList.add("activo");

        const filtro = boton.dataset.filtro;

        tarjetasPelicula.forEach(tarjeta => {
            const categorias = tarjeta.dataset.categoria.split(" ");
            const mostrar = filtro === "todas" || categorias.includes(filtro);

            tarjeta.classList.toggle("oculta", !mostrar);
        });
    });
});

/* ===== VENTANAS CON INFORMACIÓN DE LAS PELÍCULAS ===== */
const modalPelicula = document.getElementById("modalPelicula");
const modalTitulo = document.getElementById("modalTitulo");
const modalTexto = document.getElementById("modalTexto");
const cerrarModal = document.getElementById("cerrarModal");
const aceptarModal = document.getElementById("aceptarModal");

function abrirModal(modal) {
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const botonCerrar = modal.querySelector("button");
    if (botonCerrar) botonCerrar.focus();
}

function cerrarVentana(modal) {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");

    const otroModalAbierto = document.querySelector(".modal.abierto");
    if (!otroModalAbierto) {
        document.body.style.overflow = "";
    }
}

document.querySelectorAll(".detalle-boton").forEach(boton => {
    boton.addEventListener("click", () => {
        modalTitulo.textContent = boton.dataset.titulo;
        modalTexto.textContent = boton.dataset.texto;
        abrirModal(modalPelicula);
    });
});

cerrarModal.addEventListener("click", () => cerrarVentana(modalPelicula));
aceptarModal.addEventListener("click", () => cerrarVentana(modalPelicula));

/* Cerrar una ventana tocando el fondo */
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", evento => {
        if (evento.target === modal) {
            cerrarVentana(modal);
        }
    });
});

/* Cerrar ventanas con Escape */
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        document.querySelectorAll(".modal.abierto").forEach(modal => {
            cerrarVentana(modal);
        });
    }
});

/* ===== MENSAJE SECRETO ===== */
const botonSorpresa = document.getElementById("botonSorpresa");
const modalSorpresa = document.getElementById("modalSorpresa");
const cerrarSorpresa = document.getElementById("cerrarSorpresa");

botonSorpresa.addEventListener("click", () => {
    abrirModal(modalSorpresa);
});

cerrarSorpresa.addEventListener("click", () => {
    cerrarVentana(modalSorpresa);
});

/* ===== TRIVIA INTERACTIVA ===== */
const preguntas = [
    {
        pregunta: "¿Qué personaje es conocido como el rey de Halloween?",
        respuestas: ["Edward", "Jack Skellington", "Beetlejuice", "Víctor"],
        correcta: 1,
        explicacion: "¡Correcto! Jack Skellington es el protagonista de El extraño mundo de Jack."
    },
    {
        pregunta: "¿Qué tiene Edward en lugar de manos?",
        respuestas: ["Garras de metal", "Ramas", "Tijeras", "Guantes mágicos"],
        correcta: 2,
        explicacion: "¡Exacto! Edward tiene tijeras en lugar de manos."
    },
    {
        pregunta: "¿Qué técnica de animación se utilizó en El cadáver de la novia?",
        respuestas: ["Stop motion", "Dibujos sobre arena", "Animación 2D tradicional", "Acción real"],
        correcta: 0,
        explicacion: "¡Bien! El cadáver de la novia se realizó con animación stop motion."
    },
    {
        pregunta: "¿Qué director dirigió El extraño mundo de Jack?",
        respuestas: ["Henry Selick", "Steven Spielberg", "James Cameron", "George Lucas"],
        correcta: 0,
        explicacion: "¡Correcto! Henry Selick dirigió la película a partir de una historia y personajes creados por Tim Burton."
    },
    {
        pregunta: "¿Cómo se llama el perro de Frankenweenie?",
        respuestas: ["Zero", "Sparky", "Max", "Pongo"],
        correcta: 1,
        explicacion: "¡Así es! El perro de Víctor se llama Sparky."
    },
    {
        pregunta: "¿Qué elemento suele aparecer en el estilo de Burton?",
        respuestas: [
            "Solo paisajes tropicales",
            "Diseños góticos y personajes peculiares",
            "Historias exclusivamente deportivas",
            "Escenarios siempre realistas"
        ],
        correcta: 1,
        explicacion: "¡Muy bien! Su cine suele combinar fantasía, ambientes góticos y personajes fuera de lo común."
    }
];

const numeroPregunta = document.getElementById("numeroPregunta");
const marcador = document.getElementById("marcador");
const preguntaTexto = document.getElementById("pregunta");
const respuestasContenedor = document.getElementById("respuestas");
const mensajeQuiz = document.getElementById("mensajeQuiz");
const barraProgreso = document.getElementById("barraProgreso");
const siguientePregunta = document.getElementById("siguientePregunta");
const reiniciarQuiz = document.getElementById("reiniciarQuiz");

let preguntaActual = 0;
let puntos = 0;
let respondida = false;

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];

    respondida = false;
    numeroPregunta.textContent =
        `PREGUNTA ${preguntaActual + 1} DE ${preguntas.length}`;
    marcador.textContent = `Puntos: ${puntos}`;
    preguntaTexto.textContent = pregunta.pregunta;
    mensajeQuiz.textContent = "";
    respuestasContenedor.replaceChildren();

    barraProgreso.style.width =
        `${(preguntaActual / preguntas.length) * 100}%`;

    siguientePregunta.hidden = true;
    reiniciarQuiz.hidden = true;

    pregunta.respuestas.forEach((respuesta, indice) => {
        const boton = document.createElement("button");
        boton.className = "respuesta";
        boton.textContent = `${String.fromCharCode(65 + indice)}. ${respuesta}`;

        boton.addEventListener("click", () => elegirRespuesta(indice, boton));
        respuestasContenedor.appendChild(boton);
    });
}

function elegirRespuesta(indice, botonElegido) {
    if (respondida) return;

    respondida = true;

    const pregunta = preguntas[preguntaActual];
    const botones = respuestasContenedor.querySelectorAll(".respuesta");

    botones.forEach(boton => {
        boton.disabled = true;
    });

    if (indice === pregunta.correcta) {
        puntos++;
        botonElegido.classList.add("correcta");
        mensajeQuiz.textContent = pregunta.explicacion;
    } else {
        botonElegido.classList.add("incorrecta");
        botones[pregunta.correcta].classList.add("correcta");
        mensajeQuiz.textContent =
            `No era esa. ${pregunta.explicacion}`;
    }

    marcador.textContent = `Puntos: ${puntos}`;
    barraProgreso.style.width =
        `${((preguntaActual + 1) / preguntas.length) * 100}%`;

    if (preguntaActual < preguntas.length - 1) {
        siguientePregunta.hidden = false;
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    preguntaTexto.textContent = "¡Terminaste la trivia!";
    numeroPregunta.textContent = "RESULTADO FINAL";
    respuestasContenedor.replaceChildren();
    barraProgreso.style.width = "100%";

    if (puntos === preguntas.length) {
        mensajeQuiz.textContent =
            `¡Increíble! Lograste ${puntos} de ${preguntas.length}. Sos experto en este universo.`;
    } else if (puntos >= 4) {
        mensajeQuiz.textContent =
            `¡Muy bien! Lograste ${puntos} de ${preguntas.length}. Conocés bastante sobre sus películas.`;
    } else {
        mensajeQuiz.textContent =
            `Lograste ${puntos} de ${preguntas.length}. ¡Podés volver a recorrer la página y jugar otra vez!`;
    }

    siguientePregunta.hidden = true;
    reiniciarQuiz.hidden = false;
}

siguientePregunta.addEventListener("click", () => {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta();
    }
});

reiniciarQuiz.addEventListener("click", () => {
    preguntaActual = 0;
    puntos = 0;
    mostrarPregunta();
});

mostrarPregunta();

/* ===== SONIDO AMBIENTAL OPCIONAL ===== */
/* El sonido se genera en el navegador; no hace falta descargar audio. */
const botonSonido = document.getElementById("botonSonido");

let contextoAudio = null;
let oscilador = null;
let volumen = null;
let sonidoActivo = false;

async function activarSonido() {
    const AudioContextClase = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClase) {
        botonSonido.textContent = "Sonido no disponible";
        return;
    }

    try {
        if (!contextoAudio) {
            contextoAudio = new AudioContextClase();

            oscilador = contextoAudio.createOscillator();
            volumen = contextoAudio.createGain();

            oscilador.type = "sine";
            oscilador.frequency.value = 82;

            const filtro = contextoAudio.createBiquadFilter();
            filtro.type = "lowpass";
            filtro.frequency.value = 180;

            volumen.gain.value = 0;

            oscilador.connect(filtro);
            filtro.connect(volumen);
            volumen.connect(contextoAudio.destination);
            oscilador.start();
        }

        if (contextoAudio.state === "suspended") {
            await contextoAudio.resume();
        }

        volumen.gain.setTargetAtTime(
            sonidoActivo ? 0 : 0.025,
            contextoAudio.currentTime,
            0.2
        );

        sonidoActivo = !sonidoActivo;
        botonSonido.textContent = sonidoActivo
            ? "♫ Desactivar ambiente"
            : "♫ Activar ambiente";
        botonSonido.setAttribute("aria-pressed", sonidoActivo);
    } catch (error) {
        botonSonido.textContent = "Sonido no disponible";
    }
}

botonSonido.addEventListener("click", activarSonido);

/* ===== AÑO Y ANIMACIONES ===== */
document.querySelectorAll(".pelicula-card, .personaje, .curiosidad").forEach(elemento => {
    elemento.setAttribute("tabindex", "0");
});

console.log("El extraño universo de Tim Burton está listo.");
