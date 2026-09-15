/* ==========================================================
   READING STORM
   USUARIO.JS
========================================================== */


/* ==========================================================
   DOM
========================================================== */

const profileInitials =
    document.querySelector("#profile-initials");

const avatarButton =
    document.querySelector("#avatar-button");

const profileName =
    document.querySelector("#profile-name");

const profileEmail =
    document.querySelector("#profile-email");

const profileDate =
    document.querySelector("#profile-date");

const profilePlan =
    document.querySelector("#profile-plan");


const storageText =
    document.querySelector("#storage-text");

const storagePercentage =
    document.querySelector("#storage-percentage");

const storageProgressBar =
    document.querySelector("#storage-progress-bar");

const comicCount =
    document.querySelector("#comic-count");

const collectionCount =
    document.querySelector("#collection-count");

const remainingStorage =
    document.querySelector("#remaining-storage");


const currentPlanName =
    document.querySelector("#current-plan-name");

const currentPlanDescription =
    document.querySelector("#current-plan-description");

const currentPlanStorage =
    document.querySelector("#current-plan-storage");


const btnEditarPerfil =
    document.querySelector("#btn-editar-perfil");

const btnCerrarSesion =
    document.querySelector("#btn-cerrar-sesion");


/* PERFIL */

const profileOverlay =
    document.querySelector("#profile-overlay");

const btnCerrarPerfil =
    document.querySelector("#btn-cerrar-perfil");

const btnCancelarPerfil =
    document.querySelector("#btn-cancelar-perfil");

const btnGuardarPerfil =
    document.querySelector("#btn-guardar-perfil");

const inputProfileName =
    document.querySelector("#input-profile-name");

const inputProfileEmail =
    document.querySelector("#input-profile-email");


/* PAGO */

const paymentEmpty =
    document.querySelector("#payment-empty");

const savedPayment =
    document.querySelector("#saved-payment");

const savedCardNumber =
    document.querySelector("#saved-card-number");

const savedCardName =
    document.querySelector("#saved-card-name");

const btnAgregarPago =
    document.querySelector("#btn-agregar-pago");

const btnEliminarPago =
    document.querySelector("#btn-eliminar-pago");


const paymentOverlay =
    document.querySelector("#payment-overlay");

const btnCerrarPago =
    document.querySelector("#btn-cerrar-pago");

const btnCancelarPago =
    document.querySelector("#btn-cancelar-pago");

const btnGuardarPago =
    document.querySelector("#btn-guardar-pago");


const inputCardName =
    document.querySelector("#input-card-name");

const inputCardNumber =
    document.querySelector("#input-card-number");

const inputCardExpiration =
    document.querySelector("#input-card-expiration");

const inputCardCvv =
    document.querySelector("#input-card-cvv");


/* PLAN */

const planOverlay =
    document.querySelector("#plan-overlay");

const btnCerrarPlan =
    document.querySelector("#btn-cerrar-plan");

const btnConfirmarPlan =
    document.querySelector("#btn-confirmar-plan");

const selectedPlanTitle =
    document.querySelector("#selected-plan-title");

const selectedPlanDescription =
    document.querySelector("#selected-plan-description");

const selectedPlanPrice =
    document.querySelector("#selected-plan-price");


/* SWEET */

const sweetOverlay =
    document.querySelector("#sweet-overlay");

const sweetAlert =
    document.querySelector("#sweet-alert");

const sweetIcon =
    document.querySelector("#sweet-icon");

const sweetTitle =
    document.querySelector("#sweet-title");

const sweetMessage =
    document.querySelector("#sweet-message");

const sweetButton =
    document.querySelector("#sweet-button");


/* ==========================================================
   PLANES
========================================================== */

const planes = {

    Gratuito: {

        nombre:
            "Gratuito",

        almacenamiento:
            500,

        descripcion:
            "Para comenzar tu biblioteca.",

        precio:
            0,

        precioTexto:
            "$0 MXN"

    },


    Lector: {

        nombre:
            "Lector",

        almacenamiento:
            5120,

        descripcion:
            "Más espacio para lectores frecuentes.",

        precio:
            49,

        precioTexto:
            "$49 MXN / mes"

    },


    Coleccionista: {

        nombre:
            "Coleccionista",

        almacenamiento:
            20480,

        descripcion:
            "Una biblioteca amplia para grandes colecciones.",

        precio:
            99,

        precioTexto:
            "$99 MXN / mes"

    }

};


let usuario = null;

let planSeleccionado = null;


/* ==========================================================
   LOCAL STORAGE
========================================================== */

function obtenerUsuario() {

    try {

        return JSON.parse(
            localStorage.getItem("usuario")
        );

    }

    catch (error) {

        return null;

    }

}


function guardarUsuario() {

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

}


function obtenerGrapas() {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem("grapas")
            ) || [];


        return Array.isArray(datos)
            ? datos
            : [];

    }

    catch (error) {

        return [];

    }

}


function obtenerColecciones() {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem("colecciones")
            ) || [];


        return Array.isArray(datos)
            ? datos
            : [];

    }

    catch (error) {

        return [];

    }

}


/* ==========================================================
   INICIALIZAR
========================================================== */

function iniciarPagina() {

    usuario =
        obtenerUsuario();


    /*
        Permite visualizar la página incluso
        si todavía no existe una cuenta.
    */

    if (!usuario) {

        usuario = {

            id:
                "usuario_demo",

            nombre:
                "Usuario",

            correo:
                "correo@ejemplo.com",

            plan:
                "Gratuito",

            almacenamientoTotal:
                500,

            almacenamientoUsado:
                0,

            fechaRegistro:
                new Date().toISOString()

        };

    }


    if (!usuario.plan) {

        usuario.plan =
            "Gratuito";

    }


    actualizarPerfil();

    actualizarAlmacenamiento();

    actualizarPlan();

    actualizarMetodoPago();

}


/* ==========================================================
   PERFIL
========================================================== */

function actualizarPerfil() {

    const iniciales =
        obtenerIniciales(
            usuario.nombre
        );


    profileInitials.textContent =
        iniciales;


    avatarButton.textContent =
        iniciales;


    profileName.textContent =
        usuario.nombre;


    profileEmail.textContent =
        usuario.correo;


    profilePlan.textContent =
        usuario.plan;


    if (
        usuario.fechaRegistro
    ) {

        const fecha =
            new Date(
                usuario.fechaRegistro
            );


        profileDate.textContent =
            fecha.toLocaleDateString(
                "es-MX",
                {
                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

    }

    else {

        profileDate.textContent =
            "—";

    }

}


function obtenerIniciales(nombre) {

    const partes =
        String(nombre || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        partes.length === 0
    ) {

        return "RS";

    }


    if (
        partes.length === 1
    ) {

        return partes[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[1][0]
    ).toUpperCase();

}


/* ==========================================================
   EDITAR PERFIL
========================================================== */

btnEditarPerfil.addEventListener(
    "click",
    () => {

        inputProfileName.value =
            usuario.nombre;


        inputProfileEmail.value =
            usuario.correo;


        profileOverlay.classList.add(
            "show"
        );

    }
);


btnGuardarPerfil.addEventListener(
    "click",
    () => {

        const nombre =
            inputProfileName
                .value
                .trim();


        const correo =
            inputProfileEmail
                .value
                .trim()
                .toLowerCase();


        if (
            nombre.length < 2
        ) {

            mostrarSweet(
                "Nombre no válido",
                "Escribe un nombre válido.",
                "error"
            );


            return;

        }


        if (
            !validarCorreo(correo)
        ) {

            mostrarSweet(
                "Correo no válido",
                "Introduce un correo electrónico válido.",
                "error"
            );


            return;

        }


        usuario.nombre =
            nombre;


        usuario.correo =
            correo;


        guardarUsuario();

        actualizarPerfil();

        cerrarPerfil();


        mostrarSweet(
            "¡Bien hecho!",
            "Tu perfil fue actualizado correctamente."
        );

    }
);


function validarCorreo(correo) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(correo);

}


function cerrarPerfil() {

    profileOverlay.classList.remove(
        "show"
    );

}


btnCerrarPerfil.addEventListener(
    "click",
    cerrarPerfil
);


btnCancelarPerfil.addEventListener(
    "click",
    cerrarPerfil
);


/* ==========================================================
   ALMACENAMIENTO
========================================================== */

function actualizarAlmacenamiento() {

    const grapas =
        obtenerGrapas();


    const colecciones =
        obtenerColecciones();


    /*
        Calculamos el peso aproximado del contenido
        que actualmente vive en localStorage.
    */

    const bytes =
        new Blob([
            JSON.stringify(grapas)
        ]).size;


    const megabytes =
        bytes /
        (1024 * 1024);


    const plan =
        planes[
            usuario.plan
        ] || planes.Gratuito;


    const total =
        plan.almacenamiento;


    const usado =
        Math.max(
            0,
            megabytes
        );


    const porcentaje =
        Math.min(
            100,
            (usado / total) * 100
        );


    usuario.almacenamientoTotal =
        total;


    usuario.almacenamientoUsado =
        usado;


    /*
        Solo persistimos si la cuenta
        realmente existe.
    */

    if (
        localStorage.getItem("usuario")
    ) {

        guardarUsuario();

    }


    storageText.textContent =
        `${formatearEspacio(usado)} de ${formatearEspacio(total)}`;


    storagePercentage.textContent =
        `${porcentaje.toFixed(1)}%`;


    storageProgressBar.style.width =
        `${porcentaje}%`;


    comicCount.textContent =
        grapas.length;


    /*
        No contamos Sin colección como
        una colección personalizada.
    */

    const coleccionesReales =
        colecciones.filter(
            coleccion =>
                coleccion.id !==
                "sin-coleccion"
        );


    collectionCount.textContent =
        coleccionesReales.length;


    remainingStorage.textContent =
        formatearEspacio(
            Math.max(
                0,
                total - usado
            )
        );

}


function formatearEspacio(mb) {

    if (
        mb >= 1024
    ) {

        const gb =
            mb / 1024;


        return `${gb.toFixed(
            gb >= 10 ? 0 : 1
        )} GB`;

    }


    if (
        mb < 1 &&
        mb > 0
    ) {

        return `${(
            mb * 1024
        ).toFixed(1)} KB`;

    }


    return `${mb.toFixed(1)} MB`;

}


/* ==========================================================
   PLAN
========================================================== */

function actualizarPlan() {

    const plan =
        planes[
            usuario.plan
        ] || planes.Gratuito;


    currentPlanName.textContent =
        plan.nombre;


    currentPlanDescription.textContent =
        plan.descripcion;


    currentPlanStorage.textContent =
        formatearEspacio(
            plan.almacenamiento
        );


    document
        .querySelectorAll(
            "[data-plan-button]"
        )
        .forEach(
            boton => {

                const nombre =
                    boton.dataset
                        .planButton;


                boton.classList.remove(
                    "current"
                );


                boton.disabled =
                    false;


                if (
                    nombre ===
                    usuario.plan
                ) {

                    boton.textContent =
                        "Plan actual";


                    boton.classList.add(
                        "current"
                    );


                    boton.disabled =
                        true;

                }

                else {

                    boton.textContent =
                        nombre === "Gratuito"
                            ? "Cambiar a Gratuito"
                            : `Elegir ${nombre}`;

                }

            }
        );

}


/* ==========================================================
   ELEGIR PLAN
========================================================== */

document
    .querySelectorAll(
        "[data-plan-button]"
    )
    .forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const nombre =
                        boton.dataset
                            .planButton;


                    if (
                        nombre ===
                        usuario.plan
                    ) {

                        return;

                    }


                    seleccionarPlan(
                        nombre
                    );

                }
            );

        }
    );


function seleccionarPlan(nombre) {

    const plan =
        planes[nombre];


    if (!plan) {

        return;

    }


    /*
        Regresar al gratuito no necesita
        método de pago.
    */

    if (
        plan.precio === 0
    ) {

        usuario.plan =
            plan.nombre;


        guardarUsuario();

        actualizarPlan();

        actualizarAlmacenamiento();


        mostrarSweet(
            "Plan actualizado",
            "Ahora utilizas el plan Gratuito."
        );


        return;

    }


    /*
        Un plan de pago requiere una
        tarjeta simulada.
    */

    if (!usuario.metodoPago) {

        mostrarSweet(
            "Agrega un método de pago",
            "Necesitas agregar una tarjeta simulada antes de contratar este plan.",
            "error"
        );


        abrirPago();


        return;

    }


    planSeleccionado =
        plan;


    selectedPlanTitle.textContent =
        `Plan ${plan.nombre}`;


    selectedPlanDescription.textContent =
        `${formatearEspacio(
            plan.almacenamiento
        )} de almacenamiento.`;


    selectedPlanPrice.textContent =
        plan.precioTexto;


    planOverlay.classList.add(
        "show"
    );

}


/* ==========================================================
   CONFIRMAR PLAN
========================================================== */

btnConfirmarPlan.addEventListener(
    "click",
    () => {

        if (!planSeleccionado) {

            return;

        }


        usuario.plan =
            planSeleccionado.nombre;


        usuario.ultimoPagoSimulado = {

            cantidad:
                planSeleccionado.precio,

            fecha:
                new Date()
                    .toISOString(),

            concepto:
                `Plan ${planSeleccionado.nombre}`

        };


        guardarUsuario();


        planOverlay.classList.remove(
            "show"
        );


        planSeleccionado =
            null;


        actualizarPlan();

        actualizarAlmacenamiento();

        actualizarPerfil();


        mostrarSweet(
            "¡Plan actualizado!",
            "El pago simulado fue procesado correctamente."
        );

    }
);


btnCerrarPlan.addEventListener(
    "click",
    () => {

        planOverlay.classList.remove(
            "show"
        );


        planSeleccionado =
            null;

    }
);


/* ==========================================================
   MÉTODO DE PAGO
========================================================== */

function actualizarMetodoPago() {

    const metodo =
        usuario.metodoPago;


    if (!metodo) {

        paymentEmpty.classList.remove(
            "hide"
        );


        savedPayment.classList.remove(
            "show"
        );


        return;

    }


    paymentEmpty.classList.add(
        "hide"
    );


    savedPayment.classList.add(
        "show"
    );


    savedCardNumber.textContent =
        `•••• •••• •••• ${metodo.ultimos4}`;


    savedCardName.textContent =
        metodo.titular;

}


/* ==========================================================
   ABRIR PAGO
========================================================== */

function abrirPago() {

    paymentOverlay.classList.add(
        "show"
    );

}


function cerrarPago() {

    paymentOverlay.classList.remove(
        "show"
    );


    inputCardName.value =
        "";

    inputCardNumber.value =
        "";

    inputCardExpiration.value =
        "";

    inputCardCvv.value =
        "";

}


btnAgregarPago.addEventListener(
    "click",
    abrirPago
);


btnCerrarPago.addEventListener(
    "click",
    cerrarPago
);


btnCancelarPago.addEventListener(
    "click",
    cerrarPago
);


/* ==========================================================
   FORMATO TARJETA
========================================================== */

inputCardNumber.addEventListener(
    "input",
    () => {

        let valor =
            inputCardNumber.value
                .replace(/\D/g, "")
                .substring(0, 16);


        valor =
            valor.replace(
                /(.{4})/g,
                "$1 "
            ).trim();


        inputCardNumber.value =
            valor;

    }
);


inputCardExpiration.addEventListener(
    "input",
    () => {

        let valor =
            inputCardExpiration.value
                .replace(/\D/g, "")
                .substring(0, 4);


        if (
            valor.length > 2
        ) {

            valor =
                valor.substring(0, 2)
                +
                "/"
                +
                valor.substring(2);

        }


        inputCardExpiration.value =
            valor;

    }
);


inputCardCvv.addEventListener(
    "input",
    () => {

        inputCardCvv.value =
            inputCardCvv.value
                .replace(/\D/g, "")
                .substring(0, 3);

    }
);


/* ==========================================================
   GUARDAR MÉTODO
========================================================== */

btnGuardarPago.addEventListener(
    "click",
    () => {

        const titular =
            inputCardName
                .value
                .trim();


        const numero =
            inputCardNumber
                .value
                .replace(/\D/g, "");


        const vencimiento =
            inputCardExpiration
                .value
                .trim();


        const cvv =
            inputCardCvv
                .value
                .trim();


        if (
            titular.length < 3
        ) {

            mostrarSweet(
                "Titular no válido",
                "Escribe el nombre del titular de la tarjeta.",
                "error"
            );


            return;

        }


        if (
            numero.length !== 16
        ) {

            mostrarSweet(
                "Tarjeta no válida",
                "Introduce un número de tarjeta de 16 dígitos.",
                "error"
            );


            return;

        }


        if (
            !/^\d{2}\/\d{2}$/
                .test(vencimiento)
        ) {

            mostrarSweet(
                "Fecha no válida",
                "Utiliza el formato MM/AA.",
                "error"
            );


            return;

        }


        if (
            cvv.length !== 3
        ) {

            mostrarSweet(
                "CVV no válido",
                "Introduce los 3 dígitos del CVV.",
                "error"
            );


            return;

        }


        /*
            No guardamos el número completo
            ni el CVV, incluso en la simulación.
        */

        usuario.metodoPago = {

            titular:
                titular,

            ultimos4:
                numero.slice(-4),

            vencimiento:
                vencimiento,

            tipo:
                "Tarjeta simulada"

        };


        guardarUsuario();


        cerrarPago();

        actualizarMetodoPago();


        mostrarSweet(
            "¡Método agregado!",
            "La tarjeta simulada fue guardada correctamente."
        );

    }
);


/* ==========================================================
   ELIMINAR MÉTODO
========================================================== */

btnEliminarPago.addEventListener(
    "click",
    () => {

        delete usuario.metodoPago;


        guardarUsuario();

        actualizarMetodoPago();


        mostrarSweet(
            "Método eliminado",
            "La tarjeta fue eliminada de tu cuenta."
        );

    }
);


/* ==========================================================
   CERRAR SESIÓN
========================================================== */

btnCerrarSesion.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "sesion"
        );


        window.location.href =
            "iniciar.html";

    }
);


/* ==========================================================
   SWEET ALERT
========================================================== */

function mostrarSweet(
    titulo,
    mensaje,
    tipo = "success"
) {

    sweetAlert.classList.remove(
        "error"
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


sweetButton.addEventListener(
    "click",
    () => {

        sweetOverlay.classList.remove(
            "show"
        );

    }
);


/* ==========================================================
   CERRAR MODALES DESDE FONDO
========================================================== */

[
    profileOverlay,
    paymentOverlay,
    planOverlay

].forEach(
    overlay => {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    overlay
                ) {

                    overlay.classList.remove(
                        "show"
                    );

                }

            }
        );

    }
);


/* ==========================================================
   INICIAR
========================================================== */

iniciarPagina();