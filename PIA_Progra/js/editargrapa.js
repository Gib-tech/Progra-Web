/* ==========================================================
   READING STORM
   EDITAR GRAPA
========================================================== */


/* ==========================================================
   DOM
========================================================== */

const inputImagenes =
    document.querySelector("#input-imagenes");

const btnAgregarImagenes =
    document.querySelector("#btn-agregar-imagenes");

const dropZone =
    document.querySelector("#drop-zone");

const paginasGrid =
    document.querySelector("#paginas-grid");

const contadorPaginas =
    document.querySelector("#contador-paginas");


const nombreGrapa =
    document.querySelector("#nombre-grapa");

const selectColeccion =
    document.querySelector("#select-coleccion");

const newCollectionBox =
    document.querySelector("#new-collection-box");

const nombreColeccion =
    document.querySelector("#nombre-coleccion");

const inputPortada =
    document.querySelector("#input-portada");

const numeroGrapa =
    document.querySelector("#numero-grapa");


const estadoLectura =
    document.querySelector("#estado-lectura");

const progresoLectura =
    document.querySelector("#progreso-lectura");


const btnGuardar =
    document.querySelector("#btn-guardar");

const btnCancelar =
    document.querySelector("#btn-cancelar");

const btnRegresar =
    document.querySelector("#btn-regresar");


/* ALERTA */

const alertOverlay =
    document.querySelector("#alert-overlay");

const alertIcon =
    document.querySelector("#alert-icon");

const alertTitle =
    document.querySelector("#alert-title");

const alertMessage =
    document.querySelector("#alert-message");

const alertButton =
    document.querySelector("#alert-button");


/* ==========================================================
   DATOS
========================================================== */

let grapas = [];

let colecciones = [];

let grapaActual = null;

let indiceGrapaActual = -1;


/*
    En el creador las páginas se guardan finalmente
    como strings DataURL.

    Dentro del editor las convertimos temporalmente
    a objetos para poder manipularlas cómodamente.
*/

let paginas = [];

let portadaIndex = 0;


/* ==========================================================
   ID DE LA URL
========================================================== */

function obtenerIdURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get("id");

}


/* ==========================================================
   CARGAR LOCAL STORAGE
========================================================== */

function cargarDatos() {

    try {

        grapas =
            JSON.parse(
                localStorage.getItem("grapas")
            ) || [];


        colecciones =
            JSON.parse(
                localStorage.getItem("colecciones")
            ) || [];

    }

    catch (error) {

        grapas = [];

        colecciones = [];


        mostrarAlerta(
            "error",
            "Error de biblioteca",
            "No fue posible leer los datos almacenados."
        );

    }

}


/* ==========================================================
   BUSCAR GRAPA
========================================================== */

function buscarGrapa() {

    const id =
        obtenerIdURL();


    if (!id) {

        mostrarAlerta(
            "error",
            "Grapa no encontrada",
            "No se indicó qué grapa deseas editar.",
            volverBiblioteca
        );


        return false;

    }


    indiceGrapaActual =
        grapas.findIndex(
            grapa =>
                String(grapa.id) ===
                String(id)
        );


    if (indiceGrapaActual === -1) {

        mostrarAlerta(
            "error",
            "Grapa no encontrada",
            "La grapa pudo haber sido eliminada.",
            volverBiblioteca
        );


        return false;

    }


    grapaActual =
        grapas[indiceGrapaActual];


    return true;

}


/* ==========================================================
   CARGAR COLECCIONES
========================================================== */

function cargarColecciones() {

    selectColeccion.innerHTML = `

        <option value="sin-coleccion">
            Sin colección
        </option>

        <option value="nueva-coleccion">
            + Nueva colección
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


            selectColeccion.insertBefore(
                option,
                selectColeccion.lastElementChild
            );

        }
    );

}


/* ==========================================================
   CARGAR INFORMACIÓN DE GRAPA
========================================================== */

function cargarGrapaEnEditor() {

    nombreGrapa.value =
        grapaActual.nombre || "";


    /* --------------------------
       COLECCIÓN
    -------------------------- */

    let coleccionId =
        grapaActual.coleccionId ||
        "sin-coleccion";


    /*
        Compatibilidad con datos que pudieran
        venir de versiones anteriores.
    */

    if (
        coleccionId ===
        "sin-coleccion" &&
        grapaActual.coleccionNombre &&
        grapaActual.coleccionNombre !==
        "Sin colección"
    ) {

        const encontrada =
            colecciones.find(
                coleccion =>
                    coleccion.nombre ===
                    grapaActual.coleccionNombre
            );


        if (encontrada) {

            coleccionId =
                encontrada.id;

        }

    }


    const existe =
        Array.from(
            selectColeccion.options
        ).some(
            option =>
                option.value ===
                coleccionId
        );


    selectColeccion.value =
        existe
            ? coleccionId
            : "sin-coleccion";


    /* --------------------------
       NÚMERO
    -------------------------- */

    if (
        selectColeccion.value ===
        "sin-coleccion"
    ) {

        numeroGrapa.value = "";

        numeroGrapa.disabled = true;

    }

    else {

        numeroGrapa.disabled = false;

        numeroGrapa.value =
            grapaActual.numero || "";

    }


    /* --------------------------
       PÁGINAS
    -------------------------- */

    paginas =
        Array.isArray(grapaActual.paginas)

            ? grapaActual.paginas.map(
                (imagen, index) => ({
                    id:
                        "existente_" +
                        index +
                        "_" +
                        Date.now(),

                    nombre:
                        `Página ${index + 1}`,

                    imagen:
                        typeof imagen === "string"
                            ? imagen
                            : imagen.imagen
                })
            )

            : [];


    /* --------------------------
       PORTADA
    -------------------------- */

    portadaIndex = 0;


    if (
        grapaActual.portada &&
        paginas.length > 0
    ) {

        const indice =
            paginas.findIndex(
                pagina =>
                    pagina.imagen ===
                    grapaActual.portada
            );


        if (indice !== -1) {

            portadaIndex =
                indice;

        }

    }


    /* --------------------------
       ESTADO
    -------------------------- */

    estadoLectura.textContent =
        grapaActual.estado ||
        "Sin leer";


    const ultima =
        Number(
            grapaActual.ultimaPagina || 0
        );


    progresoLectura.textContent =
        paginas.length > 0
            ? `Última página: ${Math.min(
                ultima + 1,
                paginas.length
            )} de ${paginas.length}`
            : "Sin páginas";


    renderizarPaginas();

}


/* ==========================================================
   CAMBIO DE COLECCIÓN
========================================================== */

selectColeccion.addEventListener(
    "change",
    manejarCambioColeccion
);


function manejarCambioColeccion() {

    const valor =
        selectColeccion.value;


    if (
        valor ===
        "nueva-coleccion"
    ) {

        newCollectionBox.classList.add(
            "visible"
        );


        numeroGrapa.disabled =
            false;


        return;

    }


    newCollectionBox.classList.remove(
        "visible"
    );


    if (
        valor ===
        "sin-coleccion"
    ) {

        numeroGrapa.disabled =
            true;

        numeroGrapa.value =
            "";

        return;

    }


    numeroGrapa.disabled =
        false;

}


/* ==========================================================
   AGREGAR IMÁGENES
========================================================== */

btnAgregarImagenes.addEventListener(
    "click",
    () => {

        inputImagenes.click();

    }
);


dropZone.addEventListener(
    "click",
    () => {

        inputImagenes.click();

    }
);


inputImagenes.addEventListener(
    "change",
    event => {

        procesarArchivos(
            event.target.files
        );


        inputImagenes.value = "";

    }
);


/* ==========================================================
   DRAG AND DROP
========================================================== */

dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();


        dropZone.classList.add(
            "drag-over"
        );

    }
);


dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "drag-over"
        );

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();


        dropZone.classList.remove(
            "drag-over"
        );


        procesarArchivos(
            event.dataTransfer.files
        );

    }
);


/* ==========================================================
   PROCESAR IMÁGENES
========================================================== */

function procesarArchivos(
    archivos
) {

    const validos = [];


    Array.from(archivos).forEach(
        archivo => {

            const nombre =
                archivo.name.toLowerCase();


            const valido =
                nombre.endsWith(".jpg") ||
                nombre.endsWith(".jpeg");


            if (!valido) {

                mostrarAlerta(
                    "error",
                    "Archivo no válido",
                    `El archivo "${archivo.name}" no es JPG o JPEG.`
                );


                return;

            }


            validos.push(
                archivo
            );

        }
    );


    if (
        validos.length === 0
    ) {

        return;

    }


    let procesados = 0;


    validos.forEach(
        archivo => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    paginas.push({

                        id:
                            Date.now() +
                            Math.random(),

                        nombre:
                            archivo.name,

                        imagen:
                            event.target.result

                    });


                    procesados++;


                    if (
                        procesados ===
                        validos.length
                    ) {

                        renderizarPaginas();

                    }

                };


            reader.readAsDataURL(
                archivo
            );

        }
    );

}


/* ==========================================================
   RENDERIZAR PÁGINAS
========================================================== */

function renderizarPaginas() {

    paginasGrid.innerHTML = "";


    if (
        paginas.length === 0
    ) {

        const mensaje =
            document.createElement(
                "div"
            );


        mensaje.className =
            "sin-paginas";


        mensaje.innerHTML = `

            <div class="sin-paginas-icon">
                ▧
            </div>

            <p>
                La grapa no tiene páginas.
            </p>

        `;


        paginasGrid.appendChild(
            mensaje
        );


        actualizarContador();


        return;

    }


    /*
        Mantener portada válida.
    */

    if (
        portadaIndex >=
        paginas.length
    ) {

        portadaIndex =
            paginas.length - 1;

    }


    paginas.forEach(
        (pagina, index) => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "pagina-card";


            tarjeta.draggable =
                true;


            tarjeta.dataset.index =
                index;


            if (
                index ===
                portadaIndex
            ) {

                tarjeta.classList.add(
                    "portada"
                );

            }


            /* IMAGEN */

            const imagen =
                document.createElement(
                    "img"
                );


            imagen.className =
                "pagina-imagen";


            imagen.src =
                pagina.imagen;


            imagen.alt =
                `Página ${index + 1}`;


            /* NÚMERO */

            const numero =
                document.createElement(
                    "div"
                );


            numero.className =
                "pagina-numero";


            numero.textContent =
                index + 1;


            tarjeta.appendChild(
                imagen
            );


            tarjeta.appendChild(
                numero
            );


            /* PORTADA */

            if (
                index ===
                portadaIndex
            ) {

                const portada =
                    document.createElement(
                        "div"
                    );


                portada.className =
                    "pagina-portada";


                portada.textContent =
                    "Portada";


                tarjeta.appendChild(
                    portada
                );

            }


            /* CONTROLES */

            const controles =
                document.createElement(
                    "div"
                );


            controles.className =
                "pagina-controles";


            /* IZQUIERDA */

            const btnIzquierda =
                document.createElement(
                    "button"
                );


            btnIzquierda.type =
                "button";


            btnIzquierda.textContent =
                "←";


            btnIzquierda.title =
                "Mover a la izquierda";


            btnIzquierda.addEventListener(
                "click",
                () => {

                    moverPagina(
                        index,
                        -1
                    );

                }
            );


            /* PORTADA */

            const btnPortada =
                document.createElement(
                    "button"
                );


            btnPortada.type =
                "button";


            btnPortada.textContent =
                "★";


            btnPortada.title =
                "Usar como portada";


            btnPortada.addEventListener(
                "click",
                () => {

                    portadaIndex =
                        index;


                    renderizarPaginas();

                }
            );


            /* DERECHA */

            const btnDerecha =
                document.createElement(
                    "button"
                );


            btnDerecha.type =
                "button";


            btnDerecha.textContent =
                "→";


            btnDerecha.title =
                "Mover a la derecha";


            btnDerecha.addEventListener(
                "click",
                () => {

                    moverPagina(
                        index,
                        1
                    );

                }
            );


            /* ELIMINAR */

            const btnEliminar =
                document.createElement(
                    "button"
                );


            btnEliminar.type =
                "button";


            btnEliminar.textContent =
                "×";


            btnEliminar.title =
                "Eliminar página";


            btnEliminar.classList.add(
                "eliminar"
            );


            btnEliminar.addEventListener(
                "click",
                () => {

                    eliminarPagina(
                        index
                    );

                }
            );


            controles.appendChild(
                btnIzquierda
            );

            controles.appendChild(
                btnPortada
            );

            controles.appendChild(
                btnDerecha
            );

            controles.appendChild(
                btnEliminar
            );


            tarjeta.appendChild(
                controles
            );


            /* DRAG */

            tarjeta.addEventListener(
                "dragstart",
                () => {

                    tarjeta.classList.add(
                        "dragging"
                    );

                }
            );


            tarjeta.addEventListener(
                "dragend",
                () => {

                    tarjeta.classList.remove(
                        "dragging"
                    );

                }
            );


            tarjeta.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();

                }
            );


            tarjeta.addEventListener(
                "drop",
                event => {

                    event.preventDefault();


                    const arrastrada =
                        document.querySelector(
                            ".pagina-card.dragging"
                        );


                    if (!arrastrada) {

                        return;

                    }


                    const origen =
                        Number(
                            arrastrada.dataset.index
                        );


                    if (
                        Number.isNaN(origen) ||
                        origen === index
                    ) {

                        return;

                    }


                    moverPaginaAIndice(
                        origen,
                        index
                    );

                }
            );


            paginasGrid.appendChild(
                tarjeta
            );

        }
    );


    actualizarContador();

}


/* ==========================================================
   CONTADOR
========================================================== */

function actualizarContador() {

    contadorPaginas.textContent =
        paginas.length === 1
            ? "1 página"
            : `${paginas.length} páginas`;

}


/* ==========================================================
   MOVER PÁGINA
========================================================== */

function moverPagina(
    index,
    direccion
) {

    const nuevoIndice =
        index + direccion;


    if (
        nuevoIndice < 0 ||
        nuevoIndice >= paginas.length
    ) {

        return;

    }


    const temporal =
        paginas[index];


    paginas[index] =
        paginas[nuevoIndice];


    paginas[nuevoIndice] =
        temporal;


    /*
        La portada sigue a su imagen.
    */

    if (
        portadaIndex === index
    ) {

        portadaIndex =
            nuevoIndice;

    }

    else if (
        portadaIndex ===
        nuevoIndice
    ) {

        portadaIndex =
            index;

    }


    renderizarPaginas();

}


/* ==========================================================
   MOVER POR DRAG
========================================================== */

function moverPaginaAIndice(
    origen,
    destino
) {

    const paginaPortada =
        paginas[portadaIndex];


    const pagina =
        paginas.splice(
            origen,
            1
        )[0];


    paginas.splice(
        destino,
        0,
        pagina
    );


    /*
        En vez de calcular manualmente todos
        los desplazamientos, buscamos nuevamente
        la misma imagen de portada.
    */

    portadaIndex =
        paginas.indexOf(
            paginaPortada
        );


    if (
        portadaIndex === -1
    ) {

        portadaIndex = 0;

    }


    renderizarPaginas();

}


/* ==========================================================
   ELIMINAR PÁGINA
========================================================== */

function eliminarPagina(
    index
) {

    const eraPortada =
        index ===
        portadaIndex;


    paginas.splice(
        index,
        1
    );


    if (
        paginas.length === 0
    ) {

        portadaIndex = 0;

    }

    else if (eraPortada) {

        /*
            Si eliminamos la portada,
            la página que ocupa esa posición
            pasa a ser portada.

            Si era la última, usamos la
            nueva última página.
        */

        portadaIndex =
            Math.min(
                index,
                paginas.length - 1
            );

    }

    else if (
        index <
        portadaIndex
    ) {

        portadaIndex--;

    }


    renderizarPaginas();

}


/* ==========================================================
   VALIDAR PORTADA DE NUEVA COLECCIÓN
========================================================== */

inputPortada.addEventListener(
    "change",
    () => {

        if (
            !inputPortada.files.length
        ) {

            return;

        }


        const archivo =
            inputPortada.files[0];


        const nombre =
            archivo.name.toLowerCase();


        if (
            !nombre.endsWith(".jpg") &&
            !nombre.endsWith(".jpeg")
        ) {

            inputPortada.value = "";


            mostrarAlerta(
                "error",
                "Archivo no válido",
                "La portada debe ser JPG o JPEG."
            );

        }

    }
);


/* ==========================================================
   GUARDAR CAMBIOS
========================================================== */

btnGuardar.addEventListener(
    "click",
    guardarCambios
);


async function guardarCambios() {

    /* --------------------------
       PÁGINAS
    -------------------------- */

    if (
        paginas.length === 0
    ) {

        mostrarAlerta(
            "error",
            "Faltan páginas",
            "La grapa debe conservar al menos una página."
        );


        return;

    }


    /* --------------------------
       NOMBRE
    -------------------------- */

    const nombre =
        nombreGrapa.value.trim();


    if (!nombre) {

        mostrarAlerta(
            "error",
            "Falta el nombre",
            "Escribe un nombre para la grapa."
        );


        nombreGrapa.focus();


        return;

    }


    /* --------------------------
       COLECCIÓN
    -------------------------- */

    let coleccionId =
        selectColeccion.value;


    let coleccionNombre =
        "Sin colección";


    /*
        NUEVA COLECCIÓN
    */

    if (
        coleccionId ===
        "nueva-coleccion"
    ) {

        const nuevoNombre =
            nombreColeccion
                .value
                .trim();


        if (!nuevoNombre) {

            mostrarAlerta(
                "error",
                "Falta el nombre",
                "Escribe el nombre de la nueva colección."
            );


            nombreColeccion.focus();


            return;

        }


        if (
            !inputPortada.files.length
        ) {

            mostrarAlerta(
                "error",
                "Falta la portada",
                "Selecciona una portada para la nueva colección."
            );


            return;

        }


        if (
            !numeroGrapa.value ||
            Number(numeroGrapa.value) < 1
        ) {

            mostrarAlerta(
                "error",
                "Falta el número",
                "Indica el número de la grapa dentro de la colección."
            );


            numeroGrapa.focus();


            return;

        }


        const existente =
            colecciones.find(
                coleccion =>
                    coleccion.nombre
                        .toLowerCase() ===
                    nuevoNombre
                        .toLowerCase()
            );


        if (existente) {

            mostrarAlerta(
                "error",
                "Colección existente",
                "Ya existe una colección con ese nombre."
            );


            return;

        }


        const portada =
            await leerArchivoComoDataURL(
                inputPortada.files[0]
            );


        const nuevaColeccion = {

            id:
                "coleccion_" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() *
                    10000
                ),

            nombre:
                nuevoNombre,

            portada:
                portada,

            cantidad:
                0,

            fechaCreacion:
                new Date().toISOString()

        };


        colecciones.push(
            nuevaColeccion
        );


        coleccionId =
            nuevaColeccion.id;


        coleccionNombre =
            nuevaColeccion.nombre;

    }


    /*
        SIN COLECCIÓN
    */

    else if (
        coleccionId ===
        "sin-coleccion"
    ) {

        coleccionNombre =
            "Sin colección";

    }


    /*
        COLECCIÓN EXISTENTE
    */

    else {

        const coleccion =
            colecciones.find(
                item =>
                    item.id ===
                    coleccionId
            );


        if (!coleccion) {

            mostrarAlerta(
                "error",
                "Colección no encontrada",
                "La colección seleccionada ya no existe."
            );


            return;

        }


        coleccionNombre =
            coleccion.nombre;


        if (
            !numeroGrapa.value ||
            Number(numeroGrapa.value) < 1
        ) {

            mostrarAlerta(
                "error",
                "Falta el número",
                "Indica el número de la grapa dentro de la colección."
            );


            numeroGrapa.focus();


            return;

        }

    }


    /* ======================================================
       CONSERVAR PROGRESO
    ====================================================== */

    /*
        Esta parte es importante.

        No reiniciamos:
        - estado
        - fechaUltimaLectura
        - fechaCreacion

        porque estamos EDITANDO, no creando.
    */


    let ultimaPagina =
        Number(
            grapaActual.ultimaPagina || 0
        );


    /*
        Si eliminamos páginas y la página
        guardada ya no existe, la llevamos
        a la nueva última página.
    */

    if (
        ultimaPagina >=
        paginas.length
    ) {

        ultimaPagina =
            paginas.length - 1;

    }


    if (
        ultimaPagina < 0
    ) {

        ultimaPagina = 0;

    }


    /* ======================================================
       OBJETO ACTUALIZADO
    ====================================================== */

    const grapaEditada = {

        ...grapaActual,


        nombre:
            nombre,


        coleccionId:
            coleccionId,


        coleccionNombre:
            coleccionNombre,


        numero:
            coleccionId ===
            "sin-coleccion"

                ? null

                : Number(
                    numeroGrapa.value
                ),


        paginas:
            paginas.map(
                pagina =>
                    pagina.imagen
            ),


        portada:
            paginas[
                portadaIndex
            ]?.imagen || null,


        cantidadPaginas:
            paginas.length,


        ultimaPagina:
            ultimaPagina,


        fechaActualizacion:
            new Date().toISOString()

    };


    /* ======================================================
       GUARDAR
    ====================================================== */

    grapas[
        indiceGrapaActual
    ] = grapaEditada;


    localStorage.setItem(
        "grapas",
        JSON.stringify(grapas)
    );


    /*
        Recalculamos TODAS las cantidades
        de colecciones.

        Esto es mejor que sumar/restar manualmente,
        porque también cubre:

        Spider-Man → Batman
        Spider-Man → Sin colección
        Sin colección → Spider-Man
        etc.
    */

    recalcularColecciones();


    mostrarAlerta(
        "success",
        "¡Cambios guardados!",
        "La grapa fue actualizada correctamente.",
        () => {

            window.location.href =
                "index.html";

        }
    );

}


/* ==========================================================
   LEER ARCHIVO
========================================================== */

function leerArchivoComoDataURL(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    resolve(
                        event.target.result
                    );

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                archivo
            );

        }
    );

}


/* ==========================================================
   RECALCULAR COLECCIONES
========================================================== */

function recalcularColecciones() {

    colecciones.forEach(
        coleccion => {

            coleccion.cantidad =
                grapas.filter(
                    grapa =>
                        grapa.coleccionId ===
                        coleccion.id
                ).length;

        }
    );


    localStorage.setItem(
        "colecciones",
        JSON.stringify(colecciones)
    );

}


/* ==========================================================
   ALERTA
========================================================== */

function mostrarAlerta(
    tipo,
    titulo,
    mensaje,
    callback = null
) {

    alertIcon.className =
        "alert-icon";


    alertIcon.classList.add(
        tipo
    );


    alertIcon.textContent =
        tipo === "success"
            ? "✓"
            : "×";


    alertTitle.textContent =
        titulo;


    alertMessage.textContent =
        mensaje;


    alertOverlay.classList.add(
        "visible"
    );


    /*
        onclick evita que se acumulen
        callbacks entre alertas.
    */

    alertButton.onclick =
        () => {

            cerrarAlerta();


            if (callback) {

                callback();

            }

        };

}


/* ==========================================================
   CERRAR ALERTA
========================================================== */

function cerrarAlerta() {

    alertOverlay.classList.remove(
        "visible"
    );

}


alertOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            alertOverlay
        ) {

            cerrarAlerta();

        }

    }
);


/* ==========================================================
   NAVEGACIÓN
========================================================== */

function volverBiblioteca() {

    window.location.href =
        "index.html";

}


btnRegresar.addEventListener(
    "click",
    volverBiblioteca
);


btnCancelar.addEventListener(
    "click",
    volverBiblioteca
);


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializar() {

    cargarDatos();


    const encontrada =
        buscarGrapa();


    if (!encontrada) {

        return;

    }


    cargarColecciones();


    cargarGrapaEnEditor();


    manejarCambioColeccion();

}


inicializar();