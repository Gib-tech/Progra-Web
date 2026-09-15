/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const btnBack =
    document.querySelector("#btn-back");

const comicCollection =
    document.querySelector("#comic-collection");

const comicTitle =
    document.querySelector("#comic-title");

const headerPage =
    document.querySelector("#header-page");


const btnMenu =
    document.querySelector("#btn-menu");

const readerMenu =
    document.querySelector("#reader-menu");

const menuBiblioteca =
    document.querySelector("#menu-biblioteca");

const menuInicio =
    document.querySelector("#menu-inicio");

const menuFinal =
    document.querySelector("#menu-final");


const pageReader =
    document.querySelector("#page-reader");

const verticalReader =
    document.querySelector("#vertical-reader");

const comicPage =
    document.querySelector("#comic-page");

const pageLoading =
    document.querySelector("#page-loading");


const btnPrevious =
    document.querySelector("#btn-previous");

const btnNext =
    document.querySelector("#btn-next");

const controlPrevious =
    document.querySelector("#control-previous");

const controlNext =
    document.querySelector("#control-next");


const progressSlider =
    document.querySelector("#progress-slider");

const progressCurrent =
    document.querySelector("#progress-current");

const progressTotal =
    document.querySelector("#progress-total");


const bottomCurrent =
    document.querySelector("#bottom-current");

const bottomTotal =
    document.querySelector("#bottom-total");


const readingMode =
    document.querySelector("#reading-mode");


const emptyOverlay =
    document.querySelector("#empty-overlay");

const emptyBack =
    document.querySelector("#empty-back");


/* =========================================
   VARIABLES
========================================= */

let grapas = [];

let grapaActual = null;

/*
    Internamente utilizaremos índices:

    0 = página 1
    1 = página 2
    etc.
*/

let paginaActual = 0;

let modoLectura = "page";


/* =========================================
   OBTENER GRAPAS
========================================= */

function cargarGrapas() {

    const datos =
        localStorage.getItem("grapas");


    if (!datos) {

        return [];

    }


    try {

        return JSON.parse(datos);

    }

    catch (error) {

        return [];

    }

}


/* =========================================
   BUSCAR GRAPA
========================================= */

function obtenerGrapaActual() {

    grapas =
        cargarGrapas();


    if (grapas.length === 0) {

        mostrarSinGrapa();

        return false;

    }


    /*
        Obtenemos el ID:

        leergrapa.html?id=grapa_123
    */

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    /*
        Si existe ID, buscamos esa grapa.
    */

    if (id) {

        grapaActual =
            grapas.find(
                grapa =>
                    String(grapa.id) ===
                    String(id)
            );

    }


    /*
        Mientras todavía estamos probando
        el proyecto, si entramos directamente
        a leergrapa.html cargaremos la primera
        grapa disponible.
    */

    if (!grapaActual) {

        grapaActual =
            grapas[0];

    }


    /*
        Comprobamos que tenga páginas.
    */

    if (
        !grapaActual ||
        !Array.isArray(grapaActual.paginas) ||
        grapaActual.paginas.length === 0
    ) {

        mostrarSinGrapa();

        return false;

    }


    return true;

}


/* =========================================
   INICIALIZAR LECTOR
========================================= */

function inicializarLector() {

    const encontrada =
        obtenerGrapaActual();


    if (!encontrada) {

        return;

    }


    /* -----------------------------
       INFORMACIÓN
    ----------------------------- */

    comicTitle.textContent =
        grapaActual.nombre;


    comicCollection.textContent =
        grapaActual.coleccionNombre ||
        grapaActual.coleccion ||
        "Sin colección";


    /* -----------------------------
       ÚLTIMA PÁGINA
    ----------------------------- */

    const paginaGuardada =
        Number(
            grapaActual.ultimaPagina
        );


    if (
        Number.isInteger(paginaGuardada) &&
        paginaGuardada >= 0 &&
        paginaGuardada <
            grapaActual.paginas.length
    ) {

        paginaActual =
            paginaGuardada;

    }

    else {

        paginaActual = 0;

    }


    /* -----------------------------
       PROGRESO
    ----------------------------- */

    progressSlider.min = 1;

    progressSlider.max =
        grapaActual.paginas.length;


    progressTotal.textContent =
        grapaActual.paginas.length;

    bottomTotal.textContent =
        grapaActual.paginas.length;


    /* -----------------------------
       VERTICAL
    ----------------------------- */

    construirModoVertical();


    /* -----------------------------
       MOSTRAR
    ----------------------------- */

    mostrarPagina(
        paginaActual,
        false
    );

}


/* =========================================
   MOSTRAR PÁGINA
========================================= */

function mostrarPagina(
    indice,
    guardar = true
) {

    if (!grapaActual) {
        return;
    }


    const total =
        grapaActual.paginas.length;


    /*
        Evitar salir del rango.
    */

    if (indice < 0) {

        indice = 0;

    }


    if (indice >= total) {

        indice =
            total - 1;

    }


    paginaActual =
        indice;


    /* -----------------------------
       CARGANDO
    ----------------------------- */

    comicPage.classList.remove(
        "loaded"
    );

    pageLoading.classList.remove(
        "hidden"
    );


    /* -----------------------------
       IMAGEN
    ----------------------------- */

    comicPage.src =
        grapaActual.paginas[
            paginaActual
        ];


    comicPage.alt =
        `${grapaActual.nombre} - Página ${paginaActual + 1}`;


    /* -----------------------------
       CONTADORES
    ----------------------------- */

    actualizarInterfaz();


    /* -----------------------------
       GUARDAR PROGRESO
    ----------------------------- */

    if (guardar) {

        guardarProgreso();

    }

}


/* =========================================
   IMAGEN CARGADA
========================================= */

comicPage.addEventListener(
    "load",
    () => {

        pageLoading.classList.add(
            "hidden"
        );

        comicPage.classList.add(
            "loaded"
        );

    }
);


/* =========================================
   ACTUALIZAR INTERFAZ
========================================= */

function actualizarInterfaz() {

    const paginaVisible =
        paginaActual + 1;


    const total =
        grapaActual.paginas.length;


    headerPage.textContent =
        `Página ${paginaVisible} de ${total}`;


    progressCurrent.textContent =
        paginaVisible;


    progressSlider.value =
        paginaVisible;


    bottomCurrent.textContent =
        paginaVisible;


    /* -----------------------------
       BOTONES
    ----------------------------- */

    const primeraPagina =
        paginaActual === 0;


    const ultimaPagina =
        paginaActual === total - 1;


    btnPrevious.disabled =
        primeraPagina;

    controlPrevious.disabled =
        primeraPagina;


    btnNext.disabled =
        ultimaPagina;

    controlNext.disabled =
        ultimaPagina;

}


/* =========================================
   SIGUIENTE
========================================= */

function paginaSiguiente() {

    if (!grapaActual) {
        return;
    }


    if (
        paginaActual <
        grapaActual.paginas.length - 1
    ) {

        mostrarPagina(
            paginaActual + 1
        );

    }

}


/* =========================================
   ANTERIOR
========================================= */

function paginaAnterior() {

    if (!grapaActual) {
        return;
    }


    if (paginaActual > 0) {

        mostrarPagina(
            paginaActual - 1
        );

    }

}


/* =========================================
   EVENTOS DE NAVEGACIÓN
========================================= */

btnNext.addEventListener(
    "click",
    paginaSiguiente
);


controlNext.addEventListener(
    "click",
    paginaSiguiente
);


btnPrevious.addEventListener(
    "click",
    paginaAnterior
);


controlPrevious.addEventListener(
    "click",
    paginaAnterior
);


/* =========================================
   TECLADO
========================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
            No interferimos si el usuario
            está utilizando un select.
        */

        if (
            document.activeElement
                .tagName === "SELECT"
        ) {

            return;

        }


        if (modoLectura !== "page") {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            paginaSiguiente();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            paginaAnterior();

        }

    }
);


/* =========================================
   SLIDER
========================================= */

progressSlider.addEventListener(
    "input",
    () => {

        const pagina =
            Number(
                progressSlider.value
            ) - 1;


        if (modoLectura === "page") {

            mostrarPagina(
                pagina
            );

        }

        else {

            irAPaginaVertical(
                pagina
            );

        }

    }
);


/* =========================================
   CAMBIAR MODO
========================================= */

readingMode.addEventListener(
    "change",
    () => {

        modoLectura =
            readingMode.value;


        if (
            modoLectura === "vertical"
        ) {

            activarModoVertical();

        }

        else {

            activarModoPagina();

        }

    }
);


/* =========================================
   MODO PÁGINA
========================================= */

function activarModoPagina() {

    modoLectura = "page";


    verticalReader.classList.remove(
        "visible"
    );


    pageReader.style.display =
        "grid";


    /*
        Volvemos a la página en la que
        estaba el usuario.
    */

    mostrarPagina(
        paginaActual,
        false
    );


    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* =========================================
   MODO VERTICAL
========================================= */

function activarModoVertical() {

    modoLectura =
        "vertical";


    pageReader.style.display =
        "none";


    verticalReader.classList.add(
        "visible"
    );


    /*
        Esperamos a que el navegador
        muestre el contenido antes
        de desplazarnos.
    */

    requestAnimationFrame(
        () => {

            irAPaginaVertical(
                paginaActual,
                false
            );

        }
    );

}


/* =========================================
   CONSTRUIR MODO VERTICAL
========================================= */

function construirModoVertical() {

    verticalReader.innerHTML = "";


    grapaActual.paginas.forEach(
        (pagina, index) => {

            const imagen =
                document.createElement(
                    "img"
                );


            imagen.src =
                pagina;


            imagen.alt =
                `${grapaActual.nombre} - Página ${index + 1}`;


            imagen.className =
                "vertical-page";


            imagen.dataset.index =
                index;


            verticalReader.appendChild(
                imagen
            );

        }
    );

}


/* =========================================
   IR A PÁGINA VERTICAL
========================================= */

function irAPaginaVertical(
    indice,
    guardar = true
) {

    const pagina =
        verticalReader.querySelector(
            `[data-index="${indice}"]`
        );


    if (!pagina) {
        return;
    }


    paginaActual =
        indice;


    actualizarInterfaz();


    if (guardar) {

        guardarProgreso();

    }


    pagina.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   DETECTAR PÁGINA EN MODO VERTICAL
========================================= */

let scrollTimeout = null;


window.addEventListener(
    "scroll",
    () => {

        if (
            modoLectura !==
            "vertical"
        ) {

            return;

        }


        clearTimeout(
            scrollTimeout
        );


        scrollTimeout =
            setTimeout(
                detectarPaginaVertical,
                80
            );

    }
);


/* =========================================
   PÁGINA VISIBLE
========================================= */

function detectarPaginaVertical() {

    const paginas =
        Array.from(
            document.querySelectorAll(
                ".vertical-page"
            )
        );


    if (paginas.length === 0) {
        return;
    }


    /*
        Buscamos la página cuyo centro
        esté más cerca del centro
        de la pantalla.
    */

    const centroPantalla =
        window.innerHeight / 2;


    let paginaMasCercana = 0;

    let distanciaMenor =
        Infinity;


    paginas.forEach(
        (pagina, index) => {

            const rect =
                pagina.getBoundingClientRect();


            const centroPagina =
                rect.top +
                rect.height / 2;


            const distancia =
                Math.abs(
                    centroPagina -
                    centroPantalla
                );


            if (
                distancia <
                distanciaMenor
            ) {

                distanciaMenor =
                    distancia;

                paginaMasCercana =
                    index;

            }

        }
    );


    if (
        paginaMasCercana !==
        paginaActual
    ) {

        paginaActual =
            paginaMasCercana;


        actualizarInterfaz();

        guardarProgreso();

    }

}


/* =========================================
   GUARDAR PROGRESO
========================================= */

function guardarProgreso() {

    if (!grapaActual) {
        return;
    }


    const total =
        grapaActual.paginas.length;


    /*
        Guardamos índice, no número visible.

        0 = primera página.
    */

    grapaActual.ultimaPagina =
        paginaActual;


    grapaActual.fechaUltimaLectura =
        new Date().toISOString();


    /* -----------------------------
       ESTADO DE LECTURA
    ----------------------------- */

    if (
        paginaActual >=
        total - 1
    ) {

        grapaActual.estado =
            "Leída";

    }

    else if (
        paginaActual > 0
    ) {

        grapaActual.estado =
            "En progreso";

    }

    else {

        /*
            Si acaba de abrirla y sigue
            en la primera página,
            mantenemos "Sin leer"
            únicamente si nunca había
            avanzado.
        */

        if (
            grapaActual.estado !==
            "En progreso" &&
            grapaActual.estado !==
            "Leída"
        ) {

            grapaActual.estado =
                "Sin leer";

        }

    }


    /* -----------------------------
       ACTUALIZAR ARRAY
    ----------------------------- */

    const indice =
        grapas.findIndex(
            grapa =>
                String(grapa.id) ===
                String(grapaActual.id)
        );


    if (indice !== -1) {

        grapas[indice] =
            grapaActual;

    }


    /* -----------------------------
       LOCAL STORAGE
    ----------------------------- */

    localStorage.setItem(
        "grapas",
        JSON.stringify(grapas)
    );


    /*
        También guardamos cuál fue la
        última grapa abierta.

        Esto nos servirá después para
        "Continuar leyendo" del index.
    */

    localStorage.setItem(
        "ultimaGrapaLeida",
        String(grapaActual.id)
    );

}


/* =========================================
   MENÚ
========================================= */

btnMenu.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        readerMenu.classList.toggle(
            "visible"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                "#reader-menu"
            ) &&
            !event.target.closest(
                "#btn-menu"
            )
        ) {

            readerMenu.classList.remove(
                "visible"
            );

        }

    }
);


/* =========================================
   PRIMERA PÁGINA
========================================= */

menuInicio.addEventListener(
    "click",
    () => {

        readerMenu.classList.remove(
            "visible"
        );


        if (
            modoLectura === "vertical"
        ) {

            irAPaginaVertical(0);

        }

        else {

            mostrarPagina(0);

        }

    }
);


/* =========================================
   ÚLTIMA PÁGINA
========================================= */

menuFinal.addEventListener(
    "click",
    () => {

        readerMenu.classList.remove(
            "visible"
        );


        const ultima =
            grapaActual.paginas.length - 1;


        if (
            modoLectura === "vertical"
        ) {

            irAPaginaVertical(
                ultima
            );

        }

        else {

            mostrarPagina(
                ultima
            );

        }

    }
);


/* =========================================
   VOLVER
========================================= */

function volverBiblioteca() {

    window.location.href =
        "index.html";

}


btnBack.addEventListener(
    "click",
    volverBiblioteca
);


menuBiblioteca.addEventListener(
    "click",
    volverBiblioteca
);


emptyBack.addEventListener(
    "click",
    volverBiblioteca
);


/* =========================================
   SIN GRAPA
========================================= */

function mostrarSinGrapa() {

    emptyOverlay.classList.add(
        "visible"
    );

}


/* =========================================
   INICIAR
========================================= */

inicializarLector();