/* ==========================================================
   READING STORM
   REGISTRAR.JS
========================================================== */


const formRegistrar =
    document.querySelector(
        "#form-registrar"
    );


const inputNombre =
    document.querySelector(
        "#input-nombre"
    );

const inputCorreo =
    document.querySelector(
        "#input-correo"
    );

const inputContrasena =
    document.querySelector(
        "#input-contrasena"
    );

const inputConfirmar =
    document.querySelector(
        "#input-confirmar"
    );

const inputTerminos =
    document.querySelector(
        "#input-terminos"
    );


const errorNombre =
    document.querySelector(
        "#error-nombre"
    );

const errorCorreo =
    document.querySelector(
        "#error-correo"
    );

const errorContrasena =
    document.querySelector(
        "#error-contrasena"
    );

const errorConfirmar =
    document.querySelector(
        "#error-confirmar"
    );


const btnMostrarContrasena =
    document.querySelector(
        "#btn-mostrar-contrasena"
    );

const btnMostrarConfirmar =
    document.querySelector(
        "#btn-mostrar-confirmar"
    );


const sweetOverlay =
    document.querySelector(
        "#sweet-overlay"
    );

const sweetAlert =
    document.querySelector(
        "#sweet-alert"
    );

const sweetButton =
    document.querySelector(
        "#sweet-button"
    );


/* ==========================================================
   MOSTRAR CONTRASEÑA
========================================================== */

btnMostrarContrasena.addEventListener(
    "click",
    () => {

        cambiarVisibilidad(
            inputContrasena,
            btnMostrarContrasena
        );

    }
);


btnMostrarConfirmar.addEventListener(
    "click",
    () => {

        cambiarVisibilidad(
            inputConfirmar,
            btnMostrarConfirmar
        );

    }
);


function cambiarVisibilidad(
    input,
    boton
) {

    const oculto =
        input.type ===
        "password";


    input.type =
        oculto
            ? "text"
            : "password";


    boton.textContent =
        oculto
            ? "◎"
            : "◉";

}


/* ==========================================================
   REGISTRAR
========================================================== */

formRegistrar.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        limpiarErrores();


        const nombre =
            inputNombre
                .value
                .trim();


        const correo =
            inputCorreo
                .value
                .trim()
                .toLowerCase();


        const contrasena =
            inputContrasena
                .value;


        const confirmar =
            inputConfirmar
                .value;


        let formularioValido =
            true;


        /* NOMBRE */

        if (
            nombre.length < 2
        ) {

            mostrarError(
                inputNombre,
                errorNombre,
                "Escribe un nombre válido."
            );


            formularioValido =
                false;

        }


        /* CORREO */

        if (
            !validarCorreo(
                correo
            )
        ) {

            mostrarError(
                inputCorreo,
                errorCorreo,
                "Introduce un correo electrónico válido."
            );


            formularioValido =
                false;

        }


        /* CONTRASEÑA */

        if (
            contrasena.length < 6
        ) {

            mostrarError(
                inputContrasena,
                errorContrasena,
                "La contraseña debe tener al menos 6 caracteres."
            );


            formularioValido =
                false;

        }


        /* CONFIRMAR */

        if (
            contrasena !==
            confirmar
        ) {

            mostrarError(
                inputConfirmar,
                errorConfirmar,
                "Las contraseñas no coinciden."
            );


            formularioValido =
                false;

        }


        /* TÉRMINOS */

        if (
            !inputTerminos.checked
        ) {

            mostrarSweetAlert(
                "Acepta los términos",
                "Debes aceptar los términos y condiciones para crear tu cuenta.",
                "warning"
            );


            return;

        }


        if (
            !formularioValido
        ) {

            return;

        }


        /* ==================================================
           COMPROBAR CUENTA EXISTENTE
        ================================================== */

        const usuarioGuardado =
            obtenerUsuario();


        if (
            usuarioGuardado &&
            usuarioGuardado.correo ===
            correo
        ) {

            mostrarSweetAlert(
                "Cuenta existente",
                "Ya existe una cuenta registrada con este correo.",
                "error"
            );


            return;

        }


        /* ==================================================
           USUARIO
        ================================================== */

        const usuario = {

            id:
                "usuario_" +
                Date.now(),

            nombre:
                nombre,

            correo:
                correo,

            contrasena:
                contrasena,

            fechaRegistro:
                new Date()
                    .toISOString(),

            plan:
                "Gratuito",

            almacenamientoTotal:
                500,

            almacenamientoUsado:
                0

        };


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        /*
            Iniciamos sesión automáticamente.
        */

        localStorage.setItem(
            "sesion",
            JSON.stringify({

                usuarioId:
                    usuario.id,

                activa:
                    true,

                fechaInicio:
                    new Date()
                        .toISOString()

            })
        );


        mostrarSweetAlert(
            "¡Cuenta creada!",
            "Tu cuenta de Reading Storm está lista.",
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
   CORREO
========================================================== */

function validarCorreo(
    correo
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            correo
        );

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

    [
        inputNombre,
        inputCorreo,
        inputContrasena,
        inputConfirmar

    ].forEach(
        input => {

            input.classList.remove(
                "input-error"
            );

        }
    );


    [
        errorNombre,
        errorCorreo,
        errorContrasena,
        errorConfirmar

    ].forEach(
        error => {

            error.textContent =
                "";

        }
    );

}


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


    const icono =
        sweetAlert.querySelector(
            ".sweet-icon"
        );


    if (
        tipo === "error"
    ) {

        sweetAlert.classList.add(
            "error"
        );


        icono.textContent =
            "×";

    }

    else if (
        tipo === "warning"
    ) {

        sweetAlert.classList.add(
            "warning"
        );


        icono.textContent =
            "!";

    }

    else {

        icono.textContent =
            "✓";

    }


    sweetAlert
        .querySelector("h3")
        .textContent =
            titulo;


    sweetAlert
        .querySelector("p")
        .textContent =
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

        const sesion =
            localStorage.getItem(
                "sesion"
            );


        if (sesion) {

            window.location.href =
                "index.html";

        }

        else {

            sweetOverlay.classList.remove(
                "show"
            );

        }

    }
);