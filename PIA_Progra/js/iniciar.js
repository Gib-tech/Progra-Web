/* ==========================================================
   READING STORM
   INICIAR.JS
========================================================== */


const formIniciar =
    document.querySelector(
        "#form-iniciar"
    );


const inputCorreo =
    document.querySelector(
        "#input-correo"
    );

const inputContrasena =
    document.querySelector(
        "#input-contrasena"
    );

const inputRecordar =
    document.querySelector(
        "#input-recordar"
    );


const errorCorreo =
    document.querySelector(
        "#error-correo"
    );

const errorContrasena =
    document.querySelector(
        "#error-contrasena"
    );


const btnMostrarContrasena =
    document.querySelector(
        "#btn-mostrar-contrasena"
    );

const btnOlvide =
    document.querySelector(
        "#btn-olvide"
    );


const sweetOverlay =
    document.querySelector(
        "#sweet-overlay"
    );

const sweetAlert =
    document.querySelector(
        "#sweet-alert"
    );

const sweetIcon =
    document.querySelector(
        "#sweet-icon"
    );

const sweetTitle =
    document.querySelector(
        "#sweet-title"
    );

const sweetMessage =
    document.querySelector(
        "#sweet-message"
    );

const sweetButton =
    document.querySelector(
        "#sweet-button"
    );


let inicioCorrecto =
    false;


/* ==========================================================
   MOSTRAR CONTRASEÑA
========================================================== */

btnMostrarContrasena.addEventListener(
    "click",
    () => {

        const oculto =
            inputContrasena.type ===
            "password";


        inputContrasena.type =
            oculto
                ? "text"
                : "password";


        btnMostrarContrasena
            .textContent =
                oculto
                    ? "◎"
                    : "◉";

    }
);


/* ==========================================================
   INICIAR SESIÓN
========================================================== */

formIniciar.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        limpiarErrores();


        const correo =
            inputCorreo
                .value
                .trim()
                .toLowerCase();


        const contrasena =
            inputContrasena
                .value;


        let valido =
            true;


        if (!correo) {

            mostrarError(
                inputCorreo,
                errorCorreo,
                "Introduce tu correo electrónico."
            );


            valido =
                false;

        }


        if (!contrasena) {

            mostrarError(
                inputContrasena,
                errorContrasena,
                "Introduce tu contraseña."
            );


            valido =
                false;

        }


        if (!valido) {

            return;

        }


        const usuario =
            obtenerUsuario();


        if (!usuario) {

            mostrarSweetAlert(
                "Cuenta no encontrada",
                "No existe una cuenta registrada en este dispositivo.",
                "error"
            );


            return;

        }


        if (
            usuario.correo !==
            correo ||
            usuario.contrasena !==
            contrasena
        ) {

            mostrarSweetAlert(
                "Datos incorrectos",
                "El correo o la contraseña no son correctos.",
                "error"
            );


            return;

        }


        /* ==================================================
           SESIÓN
        ================================================== */

        const sesion = {

            usuarioId:
                usuario.id,

            activa:
                true,

            recordar:
                inputRecordar.checked,

            fechaInicio:
                new Date()
                    .toISOString()

        };


        localStorage.setItem(
            "sesion",
            JSON.stringify(sesion)
        );


        inicioCorrecto =
            true;


        mostrarSweetAlert(
            "¡Bienvenido!",
            `Hola, ${usuario.nombre}. Tu biblioteca está lista.`,
            "success"
        );

    }
);


/* ==========================================================
   USUARIO
========================================================== */

function obtenerUsuario() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    }

    catch (error) {

        return null;

    }

}


/* ==========================================================
   ERRORES
========================================================== */

function mostrarError(
    input,
    contenedor,
    mensaje
) {

    input.classList.add(
        "input-error"
    );


    contenedor.textContent =
        mensaje;

}


function limpiarErrores() {

    inputCorreo.classList.remove(
        "input-error"
    );


    inputContrasena.classList.remove(
        "input-error"
    );


    errorCorreo.textContent =
        "";


    errorContrasena.textContent =
        "";

}


/* ==========================================================
   OLVIDÉ CONTRASEÑA
========================================================== */

btnOlvide.addEventListener(
    "click",
    () => {

        mostrarSweetAlert(
            "Recuperación de contraseña",
            "La recuperación por correo se implementaría con el sistema de cuentas real. Para este prototipo permanecerá simulada.",
            "warning"
        );

    }
);


/* ==========================================================
   SWEET ALERT
========================================================== */

function mostrarSweetAlert(
    titulo,
    mensaje,
    tipo = "success"
) {

    sweetAlert.classList.remove(
        "error",
        "warning"
    );


    if (
        tipo === "error"
    ) {

        sweetAlert.classList.add(
            "error"
        );


        sweetIcon.textContent =
            "×";

    }

    else if (
        tipo === "warning"
    ) {

        sweetAlert.classList.add(
            "warning"
        );


        sweetIcon.textContent =
            "!";

    }

    else {

        sweetIcon.textContent =
            "✓";

    }


    sweetTitle.textContent =
        titulo;


    sweetMessage.textContent =
        mensaje;


    sweetOverlay.classList.add(
        "show"
    );

}


/* ==========================================================
   CONTINUAR
========================================================== */

sweetButton.addEventListener(
    "click",
    () => {

        sweetOverlay.classList.remove(
            "show"
        );


        if (
            inicioCorrecto
        ) {

            window.location.href =
                "index.html";

        }

    }
);