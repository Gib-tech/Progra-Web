/* ==========================================================
   READING STORM
   INDEX.JS
========================================================== */


/* ==========================================================
   DOM
========================================================== */

const btnAdd =
    document.querySelector("#btn-add");

const addMenu =
    document.querySelector("#add-menu");

const btnSubirGrapa =
    document.querySelector("#btn-subir-grapa");

const btnCrearGrapa =
    document.querySelector("#btn-crear-grapa");

const btnCrearColeccion =
    document.querySelector("#btn-crear-coleccion");


const uploadOverlay =
    document.querySelector("#upload-overlay");

const btnCerrarUpload =
    document.querySelector("#btn-cerrar-upload");

const btnCancelarUpload =
    document.querySelector("#btn-cancelar-upload");

const btnGuardarGrapa =
    document.querySelector("#btn-guardar-grapa");


const inputArchivo =
    document.querySelector("#input-archivo");

const fileName =
    document.querySelector("#file-name");

const inputNombre =
    document.querySelector("#input-nombre");

const selectColeccion =
    document.querySelector("#select-coleccion");

const inputNumero =
    document.querySelector("#input-numero");


const newCollectionBox =
    document.querySelector("#new-collection-box");

const inputColeccionNombre =
    document.querySelector("#input-coleccion-nombre");

const inputPortadaColeccion =
    document.querySelector("#input-portada-coleccion");


const collectionsGrid =
    document.querySelector("#collections-grid");

const recentComicsGrid =
    document.querySelector("#recent-comics-grid");


const inputBusqueda =
    document.querySelector("#input-busqueda");

const selectOrdenar =
    document.querySelector("#select-ordenar");


const continueContainer =
    document.querySelector("#continue-container");

const btnVerTodasGrapas =
    document.querySelector("#btn-ver-todas-grapas");


/* SWEET ALERT */

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

const sweetCancelButton =
    document.querySelector("#sweet-cancel-button");


/* ==========================================================
   ESTADO
========================================================== */

let colecciones = [];

let grapas = [];

let coleccionFiltrada = null;

let modoSoloColeccion = false;

let accionConfirmada = null;


/* ==========================================================
   LOCAL STORAGE
========================================================== */

function cargarColecciones() {

    let datos = [];


    try {

        datos =
            JSON.parse(
                localStorage.getItem("colecciones")
            ) || [];

    }

    catch (error) {

        datos = [];

    }


    if (!Array.isArray(datos)) {

        datos = [];

    }


    const existeSinColeccion =
        datos.some(
            coleccion =>
                coleccion.id ===
                "sin-coleccion"
        );


    if (!existeSinColeccion) {

        datos.push({

            id:
                "sin-coleccion",

            nombre:
                "Sin colección",

            cantidad:
                0,

            portada:
                null,

            especial:
                true

        });

    }


    localStorage.setItem(
        "colecciones",
        JSON.stringify(datos)
    );


    return datos;

}


function cargarGrapas() {

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


/* ==========================================================
   GUARDAR
========================================================== */

function guardarColecciones() {

    localStorage.setItem(
        "colecciones",
        JSON.stringify(colecciones)
    );

}


function guardarGrapas() {

    localStorage.setItem(
        "grapas",
        JSON.stringify(grapas)
    );

}


/* ==========================================================
   COMPATIBILIDAD DE COLECCIONES
========================================================== */

function obtenerColeccionIdGrapa(
    grapa
) {

    if (grapa.coleccionId) {

        return grapa.coleccionId;

    }


    if (grapa.coleccion) {

        const porId =
            colecciones.find(
                coleccion =>
                    coleccion.id ===
                    grapa.coleccion
            );


        if (porId) {

            return porId.id;

        }


        const porNombre =
            colecciones.find(
                coleccion =>
                    coleccion.nombre ===
                    grapa.coleccion
            );


        if (porNombre) {

            return porNombre.id;

        }

    }


    if (grapa.coleccionNombre) {

        const encontrada =
            colecciones.find(
                coleccion =>
                    coleccion.nombre ===
                    grapa.coleccionNombre
            );


        if (encontrada) {

            return encontrada.id;

        }

    }


    return "sin-coleccion";

}


function obtenerNombreColeccionGrapa(
    grapa
) {

    if (
        grapa.coleccionNombre
    ) {

        return grapa.coleccionNombre;

    }


    const id =
        obtenerColeccionIdGrapa(
            grapa
        );


    const coleccion =
        colecciones.find(
            item =>
                item.id === id
        );


    return coleccion
        ? coleccion.nombre
        : "Sin colección";

}


/* ==========================================================
   NORMALIZAR DATOS
========================================================== */

function normalizarGrapas() {

    let huboCambios =
        false;


    grapas.forEach(
        grapa => {

            if (!grapa.estado) {

                grapa.estado =
                    "Sin leer";

                huboCambios =
                    true;

            }


            if (
                grapa.ultimaPagina ===
                undefined
            ) {

                grapa.ultimaPagina =
                    0;

                huboCambios =
                    true;

            }


            if (!grapa.coleccionId) {

                grapa.coleccionId =
                    obtenerColeccionIdGrapa(
                        grapa
                    );

                huboCambios =
                    true;

            }


            if (!grapa.coleccionNombre) {

                grapa.coleccionNombre =
                    obtenerNombreColeccionGrapa(
                        grapa
                    );

                huboCambios =
                    true;

            }

        }
    );


    if (huboCambios) {

        guardarGrapas();

    }

}


/* ==========================================================
   CONTADORES
========================================================== */

function actualizarContadores() {

    colecciones.forEach(
        coleccion => {

            coleccion.cantidad =
                grapas.filter(
                    grapa =>
                        obtenerColeccionIdGrapa(
                            grapa
                        ) ===
                        coleccion.id
                ).length;

        }
    );


    guardarColecciones();

}


/* ==========================================================
   SINCRONIZAR
========================================================== */

function sincronizarDatos() {

    colecciones =
        cargarColecciones();


    grapas =
        cargarGrapas();


    normalizarGrapas();

    actualizarContadores();

    actualizarSelectColecciones();

    aplicarFiltros();

    actualizarContinuarLeyendo();

}


/* ==========================================================
   INICIALES
========================================================== */

function obtenerIniciales(nombre) {

    const palabras =
        String(nombre || "")
            .replace(
                /[^a-zA-ZÀ-ÿ0-9 ]/g,
                ""
            )
            .split(" ")
            .filter(Boolean);


    if (
        palabras.length === 0
    ) {

        return "RS";

    }


    if (
        palabras.length === 1
    ) {

        return palabras[0]
            .substring(0, 3)
            .toUpperCase();

    }


    return (
        palabras[0][0] +
        palabras[1][0]
    ).toUpperCase();

}


/* ==========================================================
   PORTADA DE GRAPA
========================================================== */

function obtenerPortadaGrapa(
    grapa
) {

    if (grapa.portada) {

        return grapa.portada;

    }


    if (grapa.portadaData) {

        return grapa.portadaData;

    }


    if (
        Array.isArray(grapa.paginas) &&
        grapa.paginas.length > 0
    ) {

        const primera =
            grapa.paginas[0];


        if (
            typeof primera ===
            "string"
        ) {

            return primera;

        }


        if (
            primera &&
            primera.imagen
        ) {

            return primera.imagen;

        }

    }


    return null;

}


/* ==========================================================
   MOSTRAR COLECCIONES
========================================================== */

function mostrarColecciones(
    lista = colecciones
) {

    collectionsGrid.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        collectionsGrid.innerHTML = `

            <p class="empty-message">
                No se encontraron colecciones.
            </p>

        `;


        return;

    }


    lista.forEach(
        coleccion => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "collection-card";


            if (
                coleccion.especial
            ) {

                card.classList.add(
                    "special"
                );

            }


            if (
                coleccionFiltrada ===
                coleccion.id
            ) {

                card.classList.add(
                    "selected"
                );

            }


            let portadaHTML;


            if (
                coleccion.portada
            ) {

                portadaHTML = `

                    <img
                        src="${coleccion.portada}"
                        alt="Portada de ${escaparHTML(
                            coleccion.nombre
                        )}"
                    >

                `;

            }

            else {

                portadaHTML = `

                    <div class="collection-placeholder">

                        ${obtenerIniciales(
                            coleccion.nombre
                        )}

                    </div>

                `;

            }


            /*
                Sin colección no puede
                eliminarse.
            */

            const menuHTML =
                coleccion.id ===
                "sin-coleccion"

                    ? ""

                    : `

                        <div class="collection-menu-container">

                            <button
                                type="button"
                                class="collection-menu-button"
                                aria-label="Opciones"
                            >
                                ⋮
                            </button>


                            <div class="collection-actions-menu">

                                <button
                                    type="button"
                                    class="comic-action delete"
                                    data-action="eliminar-coleccion"
                                >

                                    <span class="comic-action-icon">
                                        ×
                                    </span>

                                    Eliminar colección

                                </button>

                            </div>

                        </div>

                    `;


            card.innerHTML = `

                <div class="collection-cover">

                    ${portadaHTML}

                </div>


                <div class="collection-info">

                    <h3>
                        ${escaparHTML(
                            coleccion.nombre
                        )}
                    </h3>

                    <p>

                        ${coleccion.cantidad}

                        ${
                            coleccion.cantidad === 1
                                ? "grapa"
                                : "grapas"
                        }

                    </p>

                </div>


                ${menuHTML}

            `;


            /*
                FILTRAR POR COLECCIÓN
            */

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".collection-menu-container"
                        )
                    ) {

                        return;

                    }


                    coleccionFiltrada =
                        coleccion.id;


                    aplicarFiltros();


                    document
                        .querySelector(
                            ".recent-section"
                        )
                        ?.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                }
            );


            /*
                MENÚ
            */

            const menuButton =
                card.querySelector(
                    ".collection-menu-button"
                );


            const menu =
                card.querySelector(
                    ".collection-actions-menu"
                );


            if (
                menuButton &&
                menu
            ) {

                menuButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        cerrarMenus();


                        menu.classList.add(
                            "show"
                        );

                    }
                );


                const eliminar =
                    menu.querySelector(
                        '[data-action="eliminar-coleccion"]'
                    );


                eliminar.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        confirmarEliminarColeccion(
                            coleccion
                        );

                    }
                );

            }


            collectionsGrid.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   MOSTRAR GRAPAS
========================================================== */

function mostrarGrapas(
    lista = grapas
) {

    recentComicsGrid.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        recentComicsGrid.innerHTML = `

            <p class="empty-message">
                No hay grapas para mostrar.
            </p>

        `;


        return;

    }


    lista.forEach(
        grapa => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "comic-card";


            const estado =
                grapa.estado ||
                "Sin leer";


            let statusClass =
                "";


            if (
                estado ===
                "En progreso"
            ) {

                statusClass =
                    "progress";

            }


            if (
                estado ===
                "Leída"
            ) {

                statusClass =
                    "completed";

            }


            const portada =
                obtenerPortadaGrapa(
                    grapa
                );


            const portadaHTML =
                portada

                    ? `

                        <img
                            src="${portada}"
                            alt="Portada de ${escaparHTML(
                                grapa.nombre
                            )}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                display:block;
                            "
                        >

                    `

                    : obtenerIniciales(
                        grapa.nombre
                    );


            const coleccion =
                obtenerNombreColeccionGrapa(
                    grapa
                );


            const numero =
                grapa.numero

                    ? ` · #${grapa.numero}`

                    : "";


            card.innerHTML = `

                <div
                    class="comic-cover"
                    data-action="leer"
                >

                    ${portadaHTML}

                </div>


                <div class="comic-info">

                    <div
                        class="comic-main-info"
                        data-action="leer"
                    >

                        <h3>
                            ${escaparHTML(
                                grapa.nombre
                            )}
                        </h3>

                        <p>

                            ${escaparHTML(
                                coleccion
                            )}

                            ${numero}

                        </p>

                        <span
                            class="reading-status ${statusClass}"
                        >
                            ${estado}
                        </span>

                    </div>


                    <div class="comic-menu-container">

                        <button
                            type="button"
                            class="comic-menu-button"
                            aria-label="Opciones de la grapa"
                        >
                            ⋮
                        </button>


                        <div class="comic-actions-menu">

                            <button
                                type="button"
                                class="comic-action"
                                data-menu-action="leer"
                            >

                                <span class="comic-action-icon">
                                    ▶
                                </span>

                                Leer

                            </button>


                            <button
                                type="button"
                                class="comic-action"
                                data-menu-action="editar"
                            >

                                <span class="comic-action-icon">
                                    ✎
                                </span>

                                Editar

                            </button>


                            <button
                                type="button"
                                class="comic-action"
                                data-menu-action="descargar"
                            >

                                <span class="comic-action-icon">
                                    ↓
                                </span>

                                Descargar

                            </button>


                            <button
                                type="button"
                                class="comic-action delete"
                                data-menu-action="eliminar"
                            >

                                <span class="comic-action-icon">
                                    ×
                                </span>

                                Eliminar

                            </button>

                        </div>

                    </div>

                </div>

            `;


            /*
                CLIC NORMAL
            */

            card
                .querySelectorAll(
                    '[data-action="leer"]'
                )
                .forEach(
                    elemento => {

                        elemento.addEventListener(
                            "click",
                            () => {

                                abrirGrapa(
                                    grapa.id
                                );

                            }
                        );

                    }
                );


            /*
                MENÚ
            */

            const menuButton =
                card.querySelector(
                    ".comic-menu-button"
                );


            const menu =
                card.querySelector(
                    ".comic-actions-menu"
                );


            menuButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const estabaAbierto =
                        menu.classList.contains(
                            "show"
                        );


                    cerrarMenus();


                    if (!estabaAbierto) {

                        menu.classList.add(
                            "show"
                        );


                        menuButton.classList.add(
                            "active"
                        );

                    }

                }
            );


            /*
                LEER
            */

            menu
                .querySelector(
                    '[data-menu-action="leer"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        abrirGrapa(
                            grapa.id
                        );

                    }
                );


            /*
                EDITAR
            */

            menu
                .querySelector(
                    '[data-menu-action="editar"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        window.location.href =
                            `editargrapa.html?id=${
                                encodeURIComponent(
                                    grapa.id
                                )
                            }`;

                    }
                );


            /*
                DESCARGAR
            */

            menu
                .querySelector(
                    '[data-menu-action="descargar"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        cerrarMenus();


                        mostrarSweetAlert(
                            "Descarga próximamente",
                            "El botón ya está disponible, pero la generación y descarga real del CBR/CBZ se implementará después.",
                            "warning"
                        );

                    }
                );


            /*
                ELIMINAR
            */

            menu
                .querySelector(
                    '[data-menu-action="eliminar"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        confirmarEliminarGrapa(
                            grapa
                        );

                    }
                );


            recentComicsGrid.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   CERRAR MENÚS
========================================================== */

function cerrarMenus() {

    document
        .querySelectorAll(
            ".comic-actions-menu.show, .collection-actions-menu.show"
        )
        .forEach(
            menu => {

                menu.classList.remove(
                    "show"
                );

            }
        );


    document
        .querySelectorAll(
            ".comic-menu-button.active"
        )
        .forEach(
            boton => {

                boton.classList.remove(
                    "active"
                );

            }
        );

}


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".comic-menu-container"
            ) &&
            !event.target.closest(
                ".collection-menu-container"
            )
        ) {

            cerrarMenus();

        }

    }
);


/* ==========================================================
   ABRIR GRAPA
========================================================== */

function abrirGrapa(id) {

    window.location.href =
        `leergrapa.html?id=${
            encodeURIComponent(id)
        }`;

}


/* ==========================================================
   ELIMINAR GRAPA
========================================================== */

function confirmarEliminarGrapa(
    grapa
) {

    cerrarMenus();


    mostrarConfirmacion(
        "¿Eliminar esta grapa?",
        `"${grapa.nombre}" se eliminará de tu biblioteca. Esta acción no se puede deshacer.`,
        () => {

            eliminarGrapa(
                grapa.id
            );

        }
    );

}


function eliminarGrapa(id) {

    grapas =
        grapas.filter(
            grapa =>
                String(grapa.id) !==
                String(id)
        );


    guardarGrapas();


    /*
        Si era continuar leyendo,
        eliminamos la referencia.
    */

    const ultima =
        localStorage.getItem(
            "ultimaGrapaLeida"
        );


    if (
        String(ultima) ===
        String(id)
    ) {

        localStorage.removeItem(
            "ultimaGrapaLeida"
        );

    }


    actualizarContadores();

    aplicarFiltros();

    actualizarContinuarLeyendo();


    mostrarSweetAlert(
        "Grapa eliminada",
        "La grapa fue eliminada correctamente.",
        "success"
    );

}


/* ==========================================================
   ELIMINAR COLECCIÓN
========================================================== */

function confirmarEliminarColeccion(
    coleccion
) {

    cerrarMenus();


    /*
        NO eliminaremos las grapas.

        Las moveremos a Sin colección.
    */

    mostrarConfirmacion(
        "¿Eliminar colección?",
        `La colección "${coleccion.nombre}" será eliminada. Sus grapas se moverán a "Sin colección".`,
        () => {

            eliminarColeccion(
                coleccion.id
            );

        }
    );

}


function eliminarColeccion(id) {

    const coleccion =
        colecciones.find(
            item =>
                item.id === id
        );


    if (!coleccion) {

        return;

    }


    /*
        MOVER GRAPAS
    */

    grapas.forEach(
        grapa => {

            if (
                obtenerColeccionIdGrapa(
                    grapa
                ) === id
            ) {

                grapa.coleccionId =
                    "sin-coleccion";


                grapa.coleccionNombre =
                    "Sin colección";


                grapa.coleccion =
                    "Sin colección";


                grapa.numero =
                    null;

            }

        }
    );


    /*
        ELIMINAR COLECCIÓN
    */

    colecciones =
        colecciones.filter(
            item =>
                item.id !== id
        );


    if (
        coleccionFiltrada === id
    ) {

        coleccionFiltrada =
            null;

    }


    guardarGrapas();

    guardarColecciones();

    actualizarContadores();

    actualizarSelectColecciones();

    aplicarFiltros();

    actualizarContinuarLeyendo();


    mostrarSweetAlert(
        "Colección eliminada",
        `Las grapas de "${coleccion.nombre}" ahora están en "Sin colección".`,
        "success"
    );

}


/* ==========================================================
   FILTROS
========================================================== */

function aplicarFiltros() {

    const texto =
        inputBusqueda
            .value
            .trim()
            .toLowerCase();


    /*
        COLECCIONES
    */

    let coleccionesVisibles =
        [...colecciones];


    if (texto) {

        coleccionesVisibles =
            coleccionesVisibles.filter(
                coleccion =>
                    coleccion.nombre
                        .toLowerCase()
                        .includes(texto)
            );

    }


    /*
        GRAPAS
    */

    let grapasVisibles =
        [...grapas];


    if (
        coleccionFiltrada
    ) {

        grapasVisibles =
            grapasVisibles.filter(
                grapa =>
                    obtenerColeccionIdGrapa(
                        grapa
                    ) ===
                    coleccionFiltrada
            );

    }


    if (texto) {

        grapasVisibles =
            grapasVisibles.filter(
                grapa => {

                    const nombre =
                        String(
                            grapa.nombre || ""
                        )
                            .toLowerCase();


                    const coleccion =
                        obtenerNombreColeccionGrapa(
                            grapa
                        )
                            .toLowerCase();


                    const numero =
                        String(
                            grapa.numero || ""
                        );


                    return (
                        nombre.includes(
                            texto
                        ) ||
                        coleccion.includes(
                            texto
                        ) ||
                        numero.includes(
                            texto
                        )
                    );

                }
            );

    }


    grapasVisibles =
        ordenarGrapas(
            grapasVisibles
        );


    mostrarColecciones(
        coleccionesVisibles
    );


    mostrarGrapas(
        grapasVisibles
    );

}


/* ==========================================================
   ORDENAMIENTO
========================================================== */

function ordenarGrapas(lista) {

    const resultado =
        [...lista];


    switch (
        selectOrdenar.value
    ) {

        case "nombre":

            resultado.sort(
                (a, b) =>
                    String(a.nombre)
                        .localeCompare(
                            String(b.nombre),
                            "es",
                            {
                                sensitivity:
                                    "base"
                            }
                        )
            );

            break;


        case "numero":

            resultado.sort(
                (a, b) => {

                    const numeroA =
                        Number(
                            a.numero
                        );


                    const numeroB =
                        Number(
                            b.numero
                        );


                    if (
                        !Number.isFinite(
                            numeroA
                        )
                    ) {

                        return 1;

                    }


                    if (
                        !Number.isFinite(
                            numeroB
                        )
                    ) {

                        return -1;

                    }


                    return (
                        numeroA -
                        numeroB
                    );

                }
            );

            break;


        case "lectura":

            const prioridad = {

                "En progreso": 1,
                "Sin leer": 2,
                "Leída": 3

            };


            resultado.sort(
                (a, b) =>
                    (
                        prioridad[
                            a.estado ||
                            "Sin leer"
                        ] || 4
                    )
                    -
                    (
                        prioridad[
                            b.estado ||
                            "Sin leer"
                        ] || 4
                    )
            );

            break;


        case "recientes":
        default:

            resultado.sort(
                (a, b) =>
                    obtenerFechaGrapa(b) -
                    obtenerFechaGrapa(a)
            );

            break;

    }


    return resultado;

}


function obtenerFechaGrapa(
    grapa
) {

    if (
        Number.isFinite(
            Number(grapa.fecha)
        )
    ) {

        return Number(
            grapa.fecha
        );

    }


    const posibles = [

        grapa.fechaCreacion,
        grapa.fechaActualizacion

    ];


    for (
        const valor
        of posibles
    ) {

        if (!valor) {

            continue;

        }


        const fecha =
            new Date(valor)
                .getTime();


        if (
            !Number.isNaN(fecha)
        ) {

            return fecha;

        }

    }


    return 0;

}


/* ==========================================================
   EVENTOS FILTROS
========================================================== */

inputBusqueda.addEventListener(
    "input",
    aplicarFiltros
);


selectOrdenar.addEventListener(
    "change",
    aplicarFiltros
);


if (btnVerTodasGrapas) {

    btnVerTodasGrapas.addEventListener(
        "click",
        () => {

            coleccionFiltrada =
                null;


            inputBusqueda.value =
                "";


            aplicarFiltros();

        }
    );

}


/* ==========================================================
   CONTINUAR LEYENDO
========================================================== */

function actualizarContinuarLeyendo() {

    const id =
        localStorage.getItem(
            "ultimaGrapaLeida"
        );


    if (!id) {

        mostrarContinuarVacio();

        return;

    }


    const grapa =
        grapas.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!grapa) {

        localStorage.removeItem(
            "ultimaGrapaLeida"
        );


        mostrarContinuarVacio();

        return;

    }


    const totalPaginas =
        Array.isArray(
            grapa.paginas
        )

            ? grapa.paginas.length

            : Number(
                grapa.cantidadPaginas || 0
            );


    const indice =
        Math.max(
            0,
            Number(
                grapa.ultimaPagina || 0
            )
        );


    /*
        ultimaPagina funciona como índice,
        por eso para mostrarla al usuario
        sumamos uno.
    */

    const paginaActual =
        totalPaginas > 0

            ? Math.min(
                indice + 1,
                totalPaginas
            )

            : 0;


    let porcentaje =
        0;


    if (
        totalPaginas > 0
    ) {

        porcentaje =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        paginaActual /
                        totalPaginas
                    ) * 100
                )
            );

    }


    const portada =
        obtenerPortadaGrapa(
            grapa
        );


    const portadaHTML =
        portada

            ? `

                <img
                    src="${portada}"
                    alt="Portada de ${escaparHTML(
                        grapa.nombre
                    )}"
                >

            `

            : `

                <div class="cover-placeholder">

                    <span>
                        ${obtenerIniciales(
                            grapa.nombre
                        )}
                    </span>

                </div>

            `;


    const coleccion =
        obtenerNombreColeccionGrapa(
            grapa
        );


    const numero =
        grapa.numero

            ? ` #${grapa.numero}`

            : "";


    continueContainer.innerHTML = `

        <article class="continue-card">

            <div class="continue-cover">

                ${portadaHTML}

            </div>


            <div class="continue-information">

                <p class="comic-collection">

                    ${escaparHTML(
                        coleccion
                    )}

                </p>


                <h3>

                    ${escaparHTML(
                        grapa.nombre
                    )}

                    ${numero}

                </h3>


                <p class="continue-page">

                    ${
                        totalPaginas > 0

                            ? `Página ${paginaActual} de ${totalPaginas}`

                            : "Lectura guardada"
                    }

                    · ${grapa.estado || "Sin leer"}

                </p>


                <div class="reading-progress">

                    <div
                        class="reading-progress-bar"
                        style="width:${porcentaje}%"
                    >
                    </div>

                </div>


                <div class="continue-actions">

                    <button
                        type="button"
                        class="primary-button"
                        id="btn-continuar"
                    >
                        ${
                            grapa.estado ===
                            "Leída"

                                ? "Leer de nuevo"

                                : "Continuar leyendo"
                        }
                    </button>


                    <button
                        type="button"
                        class="secondary-button"
                        id="btn-quitar-continuar"
                    >
                        Quitar
                    </button>

                </div>

            </div>

        </article>

    `;


    document
        .querySelector(
            "#btn-continuar"
        )
        .addEventListener(
            "click",
            () => {

                abrirGrapa(
                    grapa.id
                );

            }
        );


    document
        .querySelector(
            "#btn-quitar-continuar"
        )
        .addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "ultimaGrapaLeida"
                );


                mostrarContinuarVacio();

            }
        );

}


function mostrarContinuarVacio() {

    continueContainer.innerHTML = `

        <div class="continue-empty">

            <span>
                ◫
            </span>


            <div>

                <strong>
                    Todavía no has comenzado ninguna lectura
                </strong>

                <p>
                    Abre una grapa y tu progreso aparecerá aquí.
                </p>

            </div>

        </div>

    `;

}


/* ==========================================================
   BOTÓN +
========================================================== */

btnAdd.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        addMenu.classList.toggle(
            "show"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".add-container"
            )
        ) {

            addMenu.classList.remove(
                "show"
            );

        }

    }
);


/* ==========================================================
   CREAR GRAPA
========================================================== */

btnCrearGrapa.addEventListener(
    "click",
    () => {

        window.location.href =
            "creargrapa.html";

    }
);


/* ==========================================================
   SUBIR GRAPA
========================================================== */

btnSubirGrapa.addEventListener(
    "click",
    () => {

        modoSoloColeccion =
            false;


        btnGuardarGrapa.textContent =
            "Guardar grapa";


        addMenu.classList.remove(
            "show"
        );


        uploadOverlay.classList.add(
            "show"
        );

    }
);


/* ==========================================================
   CREAR COLECCIÓN DESDE +
========================================================== */

btnCrearColeccion.addEventListener(
    "click",
    () => {

        modoSoloColeccion =
            true;


        addMenu.classList.remove(
            "show"
        );


        uploadOverlay.classList.add(
            "show"
        );


        selectColeccion.value =
            "nueva-coleccion";


        actualizarFormularioColeccion();


        btnGuardarGrapa.textContent =
            "Crear colección";

    }
);


/* ==========================================================
   CERRAR MODAL
========================================================== */

function cerrarPanelSubida() {

    uploadOverlay.classList.remove(
        "show"
    );


    limpiarFormulario();

}


btnCerrarUpload.addEventListener(
    "click",
    cerrarPanelSubida
);


btnCancelarUpload.addEventListener(
    "click",
    cerrarPanelSubida
);


uploadOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            uploadOverlay
        ) {

            cerrarPanelSubida();

        }

    }
);


/* ==========================================================
   ARCHIVO CBR / CBZ
========================================================== */

inputArchivo.addEventListener(
    "change",
    () => {

        const archivo =
            inputArchivo.files[0];


        if (!archivo) {

            fileName.textContent =
                "Selecciona un archivo CBR o CBZ";


            return;

        }


        const extension =
            archivo.name
                .split(".")
                .pop()
                .toLowerCase();


        if (
            extension !== "cbr" &&
            extension !== "cbz"
        ) {

            inputArchivo.value =
                "";


            fileName.textContent =
                "Selecciona un archivo CBR o CBZ";


            mostrarSweetAlert(
                "Archivo no válido",
                "Solo se permiten archivos CBR y CBZ.",
                "error"
            );


            return;

        }


        fileName.textContent =
            archivo.name;


        if (
            !inputNombre.value.trim()
        ) {

            inputNombre.value =
                archivo.name.replace(
                    /\.(cbr|cbz)$/i,
                    ""
                );

        }

    }
);


/* ==========================================================
   PORTADA
========================================================== */

inputPortadaColeccion.addEventListener(
    "change",
    () => {

        const archivo =
            inputPortadaColeccion
                .files[0];


        if (!archivo) {

            return;

        }


        if (
            !esImagenValida(
                archivo
            )
        ) {

            inputPortadaColeccion.value =
                "";


            mostrarSweetAlert(
                "Imagen no válida",
                "La portada debe ser JPG, JPEG o PNG.",
                "error"
            );

        }

    }
);


function esImagenValida(
    archivo
) {

    const extension =
        archivo.name
            .split(".")
            .pop()
            .toLowerCase();


    return [

        "jpg",
        "jpeg",
        "png"

    ].includes(
        extension
    );

}


/* ==========================================================
   SELECT COLECCIÓN
========================================================== */

selectColeccion.addEventListener(
    "change",
    actualizarFormularioColeccion
);


function actualizarFormularioColeccion() {

    const valor =
        selectColeccion.value;


    if (
        valor ===
        "sin-coleccion"
    ) {

        inputNumero.disabled =
            true;


        inputNumero.value =
            "";


        newCollectionBox.classList.remove(
            "show"
        );


        return;

    }


    inputNumero.disabled =
        false;


    if (
        valor ===
        "nueva-coleccion"
    ) {

        newCollectionBox.classList.add(
            "show"
        );

    }

    else {

        newCollectionBox.classList.remove(
            "show"
        );

    }

}


/* ==========================================================
   ACTUALIZAR SELECT
========================================================== */

function actualizarSelectColecciones() {

    selectColeccion.innerHTML = `

        <option value="sin-coleccion">
            Sin colección
        </option>

    `;


    colecciones.forEach(
        coleccion => {

            if (
                coleccion.id ===
                "sin-coleccion"
            ) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                coleccion.id;


            option.textContent =
                coleccion.nombre;


            selectColeccion.appendChild(
                option
            );

        }
    );


    const nueva =
        document.createElement(
            "option"
        );


    nueva.value =
        "nueva-coleccion";


    nueva.textContent =
        "+ Nueva colección";


    selectColeccion.appendChild(
        nueva
    );

}


/* ==========================================================
   CREAR COLECCIÓN
========================================================== */

async function crearColeccion(
    nombre,
    archivoPortada = null
) {

    const limpio =
        nombre.trim();


    if (!limpio) {

        mostrarSweetAlert(
            "Falta el nombre",
            "Escribe un nombre para la colección.",
            "error"
        );


        return null;

    }


    const repetida =
        colecciones.some(
            coleccion =>
                coleccion.nombre
                    .toLowerCase() ===
                limpio.toLowerCase()
        );


    if (repetida) {

        mostrarSweetAlert(
            "Colección existente",
            "Ya existe una colección con ese nombre.",
            "error"
        );


        return null;

    }


    let portada =
        null;


    if (archivoPortada) {

        if (
            !esImagenValida(
                archivoPortada
            )
        ) {

            mostrarSweetAlert(
                "Imagen no válida",
                "La portada debe ser JPG, JPEG o PNG.",
                "error"
            );


            return null;

        }


        portada =
            await convertirArchivoADataURL(
                archivoPortada
            );

    }


    const nueva = {

        id:
            "coleccion_" +
            Date.now() +
            "_" +
            Math.floor(
                Math.random() * 10000
            ),

        nombre:
            limpio,

        cantidad:
            0,

        portada:
            portada,

        fechaCreacion:
            new Date().toISOString()

    };


    /*
        La insertamos antes de
        Sin colección.
    */

    const indice =
        colecciones.findIndex(
            coleccion =>
                coleccion.id ===
                "sin-coleccion"
        );


    if (
        indice === -1
    ) {

        colecciones.push(
            nueva
        );

    }

    else {

        colecciones.splice(
            indice,
            0,
            nueva
        );

    }


    guardarColecciones();

    actualizarSelectColecciones();


    return nueva;

}


/* ==========================================================
   GUARDAR DESDE MODAL
========================================================== */

btnGuardarGrapa.addEventListener(
    "click",
    async () => {

        /*
            SOLO CREAR COLECCIÓN
        */

        if (
            modoSoloColeccion
        ) {

            const nombre =
                inputColeccionNombre
                    .value
                    .trim();


            const portada =
                inputPortadaColeccion
                    .files[0] || null;


            const nueva =
                await crearColeccion(
                    nombre,
                    portada
                );


            if (!nueva) {

                return;

            }


            cerrarPanelSubida();

            sincronizarDatos();


            mostrarSweetAlert(
                "¡Bien hecho!",
                `La colección "${nueva.nombre}" fue creada correctamente.`,
                "success"
            );


            return;

        }


        /*
            SUBIR CBR / CBZ
        */

        await guardarGrapaSubida();

    }
);


/* ==========================================================
   GUARDAR CBR / CBZ
========================================================== */

async function guardarGrapaSubida() {

    const archivo =
        inputArchivo.files[0];


    if (!archivo) {

        mostrarSweetAlert(
            "Falta el archivo",
            "Selecciona un archivo CBR o CBZ.",
            "error"
        );


        return;

    }


    const extension =
        archivo.name
            .split(".")
            .pop()
            .toLowerCase();


    if (
        extension !== "cbr" &&
        extension !== "cbz"
    ) {

        mostrarSweetAlert(
            "Archivo no válido",
            "Solo se permiten archivos CBR y CBZ.",
            "error"
        );


        return;

    }


    const nombre =
        inputNombre.value
            .trim();


    if (!nombre) {

        mostrarSweetAlert(
            "Falta el nombre",
            "Escribe un nombre para la grapa.",
            "error"
        );


        return;

    }


    let coleccionId =
        "sin-coleccion";


    let coleccionNombre =
        "Sin colección";


    /*
        NUEVA COLECCIÓN
    */

    if (
        selectColeccion.value ===
        "nueva-coleccion"
    ) {

        const nueva =
            await crearColeccion(
                inputColeccionNombre
                    .value,
                inputPortadaColeccion
                    .files[0] || null
            );


        if (!nueva) {

            return;

        }


        coleccionId =
            nueva.id;


        coleccionNombre =
            nueva.nombre;

    }


    /*
        EXISTENTE
    */

    else if (
        selectColeccion.value !==
        "sin-coleccion"
    ) {

        const encontrada =
            colecciones.find(
                coleccion =>
                    coleccion.id ===
                    selectColeccion.value
            );


        if (encontrada) {

            coleccionId =
                encontrada.id;


            coleccionNombre =
                encontrada.nombre;

        }

    }


    let numero =
        null;


    if (
        coleccionId !==
        "sin-coleccion"
    ) {

        numero =
            Number(
                inputNumero.value
            );


        if (
            !Number.isInteger(numero) ||
            numero < 1
        ) {

            mostrarSweetAlert(
                "Número no válido",
                "Introduce un número de grapa válido.",
                "error"
            );


            return;

        }

    }


    const nuevaGrapa = {

        id:
            "grapa_" +
            Date.now() +
            "_" +
            Math.floor(
                Math.random() * 10000
            ),

        nombre:
            nombre,

        coleccionId:
            coleccionId,

        coleccionNombre:
            coleccionNombre,

        coleccion:
            coleccionNombre,

        numero:
            numero,

        estado:
            "Sin leer",

        ultimaPagina:
            0,

        fechaUltimaLectura:
            null,

        fechaCreacion:
            new Date().toISOString(),

        fecha:
            Date.now(),

        tipoArchivo:
            extension.toUpperCase(),

        nombreArchivo:
            archivo.name,

        paginas:
            []

    };


    grapas.unshift(
        nuevaGrapa
    );


    guardarGrapas();

    actualizarContadores();


    cerrarPanelSubida();

    sincronizarDatos();


    mostrarSweetAlert(
        "¡Bien hecho!",
        "La grapa se agregó correctamente a tu biblioteca.",
        "success"
    );

}


/* ==========================================================
   DATA URL
========================================================== */

function convertirArchivoADataURL(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );


            reader.onerror =
                reject;


            reader.readAsDataURL(
                archivo
            );

        }
    );

}


/* ==========================================================
   LIMPIAR FORMULARIO
========================================================== */

function limpiarFormulario() {

    inputArchivo.value =
        "";

    inputNombre.value =
        "";

    inputNumero.value =
        "";

    inputNumero.disabled =
        true;

    inputColeccionNombre.value =
        "";

    inputPortadaColeccion.value =
        "";

    selectColeccion.value =
        "sin-coleccion";

    fileName.textContent =
        "Selecciona un archivo CBR o CBZ";

    newCollectionBox.classList.remove(
        "show"
    );

    modoSoloColeccion =
        false;

    btnGuardarGrapa.textContent =
        "Guardar grapa";

}


/* ==========================================================
   SWEET ALERT NORMAL
========================================================== */

function mostrarSweetAlert(
    titulo,
    mensaje,
    tipo = "success"
) {

    accionConfirmada =
        null;


    sweetAlert.classList.remove(
        "error",
        "warning",
        "confirm"
    );


    if (
        tipo ===
        "error"
    ) {

        sweetAlert.classList.add(
            "error"
        );


        sweetIcon.textContent =
            "×";

    }

    else if (
        tipo ===
        "warning"
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


    sweetButton.textContent =
        "Continuar";


    sweetOverlay.classList.add(
        "show"
    );

}


/* ==========================================================
   CONFIRMACIÓN
========================================================== */

function mostrarConfirmacion(
    titulo,
    mensaje,
    callback
) {

    accionConfirmada =
        callback;


    sweetAlert.classList.remove(
        "error",
        "warning"
    );


    sweetAlert.classList.add(
        "confirm",
        "error"
    );


    sweetIcon.textContent =
        "×";


    sweetTitle.textContent =
        titulo;


    sweetMessage.textContent =
        mensaje;


    sweetButton.textContent =
        "Eliminar";


    sweetOverlay.classList.add(
        "show"
    );

}


/* ==========================================================
   BOTONES SWEET
========================================================== */

sweetButton.addEventListener(
    "click",
    () => {

        const callback =
            accionConfirmada;


        accionConfirmada =
            null;


        sweetOverlay.classList.remove(
            "show"
        );


        sweetAlert.classList.remove(
            "confirm"
        );


        if (callback) {

            callback();

        }

    }
);


sweetCancelButton.addEventListener(
    "click",
    () => {

        accionConfirmada =
            null;


        sweetOverlay.classList.remove(
            "show"
        );


        sweetAlert.classList.remove(
            "confirm"
        );

    }
);


sweetOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            sweetOverlay
        ) {

            accionConfirmada =
                null;


            sweetOverlay.classList.remove(
                "show"
            );


            sweetAlert.classList.remove(
                "confirm"
            );

        }

    }
);


/* ==========================================================
   SEGURIDAD DE TEXTO
========================================================== */

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================================
   VOLVER DE OTRAS PÁGINAS
========================================================== */

window.addEventListener(
    "pageshow",
    sincronizarDatos
);


/* ==========================================================
   INICIALIZAR
========================================================== */

sincronizarDatos();