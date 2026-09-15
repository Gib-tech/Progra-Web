/* =========================================
   VARIABLES
========================================= */

const inputImagenes = document.querySelector("#input-imagenes");
const btnAgregarImagenes = document.querySelector("#btn-agregar-imagenes");
const dropZone = document.querySelector("#drop-zone");

const paginasGrid = document.querySelector("#paginas-grid");
const sinPaginas = document.querySelector("#sin-paginas");
const contadorPaginas = document.querySelector("#contador-paginas");

const nombreGrapa = document.querySelector("#nombre-grapa");

const selectColeccion = document.querySelector("#select-coleccion");

const newCollectionBox =
    document.querySelector("#new-collection-box");

const nombreColeccion =
    document.querySelector("#nombre-coleccion");

const inputPortada =
    document.querySelector("#input-portada");

const numeroGrapa =
    document.querySelector("#numero-grapa");

const btnCrear =
    document.querySelector("#btn-crear");

const btnCancelar =
    document.querySelector("#btn-cancelar");

const btnRegresar =
    document.querySelector("#btn-regresar");


/* =========================================
   ALERTA
========================================= */

const alertOverlay =
    document.querySelector("#alert-overlay");

const alertBox =
    document.querySelector("#alert-box");

const alertIcon =
    document.querySelector("#alert-icon");

const alertTitle =
    document.querySelector("#alert-title");

const alertMessage =
    document.querySelector("#alert-message");

const alertButton =
    document.querySelector("#alert-button");


/* =========================================
   DATOS
========================================= */

let paginas = [];

let portadaIndex = 0;


/* =========================================
   COLECCIONES
========================================= */

let colecciones =
    JSON.parse(localStorage.getItem("colecciones")) || [];


/* =========================================
   CARGAR COLECCIONES
========================================= */

function cargarColecciones() {

    /*
       Limpiamos todas las opciones excepto
       "Sin colección" y "Nueva colección".
    */

    selectColeccion.innerHTML = `
        <option value="sin-coleccion">
            Sin colección
        </option>

        <option value="nueva-coleccion">
            + Nueva colección
        </option>
    `;


    /*
       Agregamos las colecciones existentes.
    */

    colecciones.forEach(coleccion => {

        if (coleccion.id === "sin-coleccion") {
            return;
        }

        const option =
            document.createElement("option");

        option.value = coleccion.id;

        option.textContent = coleccion.nombre;

        /*
           Insertamos la colección antes de
           "Nueva colección".
        */

        selectColeccion.insertBefore(
            option,
            selectColeccion.lastElementChild
        );

    });

}


/* =========================================
   SELECCIONAR COLECCIÓN
========================================= */

selectColeccion.addEventListener(
    "change",
    manejarCambioColeccion
);


function manejarCambioColeccion() {

    const valor =
        selectColeccion.value;


    /*
       NUEVA COLECCIÓN
    */

    if (valor === "nueva-coleccion") {

        newCollectionBox.classList.add("visible");

        numeroGrapa.disabled = false;

        return;
    }


    /*
       SIN COLECCIÓN
    */

    if (valor === "sin-coleccion") {

        newCollectionBox.classList.remove("visible");

        numeroGrapa.disabled = true;

        numeroGrapa.value = "";

        return;
    }


    /*
       COLECCIÓN EXISTENTE
    */

    newCollectionBox.classList.remove("visible");

    numeroGrapa.disabled = false;

}


/* =========================================
   ABRIR SELECTOR DE IMÁGENES
========================================= */

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


/* =========================================
   SELECCIÓN DE ARCHIVOS
========================================= */

inputImagenes.addEventListener(
    "change",
    event => {

        procesarArchivos(event.target.files);

        /*
           Permitimos volver a seleccionar
           los mismos archivos.
        */

        inputImagenes.value = "";

    }
);


/* =========================================
   DRAG & DROP
========================================= */

dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add("drag-over");

    }
);


dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove("drag-over");

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove("drag-over");

        procesarArchivos(event.dataTransfer.files);

    }
);


/* =========================================
   PROCESAR ARCHIVOS
========================================= */

function procesarArchivos(archivos) {

    const archivosValidos = [];

    Array.from(archivos).forEach(archivo => {

        const nombre =
            archivo.name.toLowerCase();

        const extensionValida =
            nombre.endsWith(".jpg") ||
            nombre.endsWith(".jpeg");


        if (!extensionValida) {

            mostrarAlerta(
                "error",
                "Archivo no válido",
                `El archivo "${archivo.name}" no es JPG o JPEG.`
            );

            return;
        }


        archivosValidos.push(archivo);

    });


    if (archivosValidos.length === 0) {
        return;
    }


    /*
       Convertimos las imágenes en DataURL
       para poder mostrarlas y guardarlas
       temporalmente en localStorage.
    */

    let procesados = 0;


    archivosValidos.forEach(archivo => {

        const reader =
            new FileReader();


        reader.onload = event => {

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


            if (procesados === archivosValidos.length) {

                renderizarPaginas();

            }

        };


        reader.readAsDataURL(archivo);

    });

}


/* =========================================
   RENDERIZAR PÁGINAS
========================================= */

function renderizarPaginas() {

    paginasGrid.innerHTML = "";


    /*
       Si no hay páginas.
    */

    if (paginas.length === 0) {

        paginasGrid.appendChild(
            crearMensajeSinPaginas()
        );

        actualizarContador();

        return;
    }


    /*
       Aseguramos que el índice de portada
       siga siendo válido.
    */

    if (portadaIndex >= paginas.length) {

        portadaIndex =
            paginas.length - 1;

    }


    paginas.forEach(
        (pagina, index) => {

            const tarjeta =
                document.createElement("article");

            tarjeta.className = "pagina-card";

            tarjeta.draggable = true;

            if (index === portadaIndex) {

                tarjeta.classList.add("portada");

            }


            /* -----------------------------
               IMAGEN
            ----------------------------- */

            const imagen =
                document.createElement("img");

            imagen.className = "pagina-imagen";

            imagen.src = pagina.imagen;

            imagen.alt =
                `Página ${index + 1}`;


            /* -----------------------------
               NÚMERO
            ----------------------------- */

            const numero =
                document.createElement("div");

            numero.className = "pagina-numero";

            numero.textContent =
                index + 1;


            tarjeta.appendChild(imagen);

            tarjeta.appendChild(numero);


            /* -----------------------------
               INDICADOR DE PORTADA
            ----------------------------- */

            if (index === portadaIndex) {

                const portada =
                    document.createElement("div");

                portada.className =
                    "pagina-portada";

                portada.textContent =
                    "Portada";

                tarjeta.appendChild(portada);

            }


            /* -----------------------------
               CONTROLES
            ----------------------------- */

            const controles =
                document.createElement("div");

            controles.className =
                "pagina-controles";


            /*
               Mover izquierda
            */

            const btnIzquierda =
                document.createElement("button");

            btnIzquierda.type = "button";

            btnIzquierda.textContent = "←";

            btnIzquierda.title =
                "Mover a la izquierda";

            btnIzquierda.addEventListener(
                "click",
                () => moverPagina(index, -1)
            );


            /*
               Portada
            */

            const btnPortada =
                document.createElement("button");

            btnPortada.type = "button";

            btnPortada.textContent = "★";

            btnPortada.title =
                "Usar como portada";

            btnPortada.addEventListener(
                "click",
                () => {

                    portadaIndex = index;

                    renderizarPaginas();

                }
            );


            /*
               Mover derecha
            */

            const btnDerecha =
                document.createElement("button");

            btnDerecha.type = "button";

            btnDerecha.textContent = "→";

            btnDerecha.title =
                "Mover a la derecha";

            btnDerecha.addEventListener(
                "click",
                () => moverPagina(index, 1)
            );


            /*
               Eliminar
            */

            const btnEliminar =
                document.createElement("button");

            btnEliminar.type = "button";

            btnEliminar.textContent = "×";

            btnEliminar.title =
                "Eliminar página";

            btnEliminar.classList.add(
                "eliminar"
            );

            btnEliminar.addEventListener(
                "click",
                () => eliminarPagina(index)
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


            /* -----------------------------
               DRAG & DROP
            ----------------------------- */

            tarjeta.addEventListener(
                "dragstart",
                () => {

                    tarjeta.classList.add(
                        "dragging"
                    );

                    tarjeta.dataset.index =
                        index;

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

                    const origen =
                        Number(
                            document.querySelector(
                                ".pagina-card.dragging"
                            )?.dataset.index
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


/* =========================================
   MENSAJE SIN PÁGINAS
========================================= */

function crearMensajeSinPaginas() {

    const contenedor =
        document.createElement("div");

    contenedor.className =
        "sin-paginas";

    contenedor.innerHTML = `
        <div class="sin-paginas-icon">
            ▧
        </div>

        <p>
            Todavía no has agregado páginas.
        </p>
    `;

    return contenedor;

}


/* =========================================
   CONTADOR
========================================= */

function actualizarContador() {

    const cantidad =
        paginas.length;


    if (cantidad === 1) {

        contadorPaginas.textContent =
            "1 página";

    } else {

        contadorPaginas.textContent =
            `${cantidad} páginas`;

    }

}


/* =========================================
   MOVER PÁGINA
========================================= */

function moverPagina(index, direccion) {

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
       Actualizamos también la portada.
    */

    if (portadaIndex === index) {

        portadaIndex =
            nuevoIndice;

    } else if (
        portadaIndex === nuevoIndice
    ) {

        portadaIndex =
            index;

    }


    renderizarPaginas();

}


/* =========================================
   MOVER A ÍNDICE
========================================= */

function moverPaginaAIndice(origen, destino) {

    const pagina =
        paginas.splice(origen, 1)[0];

    paginas.splice(
        destino,
        0,
        pagina
    );


    /*
       Ajustar posición de portada.
    */

    if (portadaIndex === origen) {

        portadaIndex = destino;

    } else if (
        origen < portadaIndex &&
        destino >= portadaIndex
    ) {

        portadaIndex--;

    } else if (
        origen > portadaIndex &&
        destino <= portadaIndex
    ) {

        portadaIndex++;

    }


    renderizarPaginas();

}


/* =========================================
   ELIMINAR PÁGINA
========================================= */

function eliminarPagina(index) {

    paginas.splice(index, 1);


    if (paginas.length === 0) {

        portadaIndex = 0;

    } else if (index === portadaIndex) {

        portadaIndex =
            Math.min(
                portadaIndex,
                paginas.length - 1
            );

    } else if (index < portadaIndex) {

        portadaIndex--;

    }


    renderizarPaginas();

}


/* =========================================
   CREAR GRAPA
========================================= */

btnCrear.addEventListener(
    "click",
    crearGrapa
);


async function crearGrapa() {

    /*
       VALIDAR PÁGINAS
    */

    if (paginas.length === 0) {

        mostrarAlerta(
            "error",
            "Faltan páginas",
            "Agrega al menos una imagen para crear la grapa."
        );

        return;
    }


    /*
       VALIDAR NOMBRE
    */

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


    /*
       VALIDAR COLECCIÓN
    */

    const coleccionSeleccionada =
        selectColeccion.value;


    /*
       NUEVA COLECCIÓN
    */

    if (
        coleccionSeleccionada ===
        "nueva-coleccion"
    ) {

        const nombreNuevaColeccion =
            nombreColeccion.value.trim();


        if (!nombreNuevaColeccion) {

            mostrarAlerta(
                "error",
                "Falta el nombre",
                "Escribe un nombre para la nueva colección."
            );

            nombreColeccion.focus();

            return;
        }


        if (!inputPortada.files.length) {

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


        crearColeccionYGrapa(
            nombreNuevaColeccion
        );

        return;
    }


    /*
       COLECCIÓN EXISTENTE
    */

    if (
        coleccionSeleccionada !==
        "sin-coleccion"
    ) {

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


    /*
       CREAR GRAPA NORMAL
    */

    guardarGrapa(
        coleccionSeleccionada
    );

}


/* =========================================
   CREAR COLECCIÓN Y GRAPA
========================================= */

function crearColeccionYGrapa(
    nombreNuevaColeccion
) {

    const archivoPortada =
        inputPortada.files[0];


    const reader =
        new FileReader();


    reader.onload = event => {

        const nuevaColeccion = {

            id:
                "coleccion_" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() * 10000
                ),

            nombre:
                nombreNuevaColeccion,

            portada:
                event.target.result,

            cantidad:
                0,

            fechaCreacion:
                new Date().toISOString()

        };


        colecciones.push(
            nuevaColeccion
        );


        localStorage.setItem(
            "colecciones",
            JSON.stringify(colecciones)
        );


        /*
           Guardamos primero la colección.
        */

        guardarGrapa(
            nuevaColeccion.id,
            nuevaColeccion.nombre
        );

    };


    reader.readAsDataURL(
        archivoPortada
    );

}


/* =========================================
   GUARDAR GRAPA
========================================= */

function guardarGrapa(
    coleccionId,
    nombreColeccion = null
) {

    const grapas =
        JSON.parse(
            localStorage.getItem("grapas")
        ) || [];


    /*
       Obtener nombre de colección
       cuando se trata de una colección
       existente.
    */

    if (
        !nombreColeccion &&
        coleccionId !== "sin-coleccion"
    ) {

        const coleccion =
            colecciones.find(
                item =>
                    item.id === coleccionId
            );


        if (coleccion) {

            nombreColeccion =
                coleccion.nombre;

        }

    }


    /*
       Crear objeto de la grapa.
    */

    const nuevaGrapa = {

        id:
            "grapa_" +
            Date.now() +
            "_" +
            Math.floor(
                Math.random() * 10000
            ),

        nombre:
            nombreGrapa.value.trim(),

        coleccionId:
            coleccionId,

        coleccionNombre:
            nombreColeccion ||
            "Sin colección",

        numero:
            coleccionId === "sin-coleccion"
                ? null
                : Number(numeroGrapa.value),

        paginas:
            paginas.map(
                pagina => pagina.imagen
            ),

        portada:
            paginas[portadaIndex]?.imagen ||
            null,

        cantidadPaginas:
            paginas.length,

            estado:
            "Sin leer",

            ultimaPagina:
            0,
            fechaUltimaLectura:
            null,

            fechaCreacion:
            new Date().toISOString(),

            fechaActualizacion:
            new Date().toISOString()

    };


    /*
       Guardamos la grapa.
    */

    grapas.push(
        nuevaGrapa
    );


    localStorage.setItem(
        "grapas",
        JSON.stringify(grapas)
    );


    /*
       Actualizar contador de colección.
    */

    if (
        coleccionId !== "sin-coleccion"
    ) {

        actualizarCantidadColeccion(
            coleccionId
        );

    }


    /*
       Mostrar éxito.
    */

    mostrarAlerta(
        "success",
        "¡Grapa creada!",
        "La grapa se ha guardado correctamente en tu biblioteca.",
        () => {

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================
   ACTUALIZAR CANTIDAD DE COLECCIÓN
========================================= */

function actualizarCantidadColeccion(
    coleccionId
) {

    const grapas =
        JSON.parse(
            localStorage.getItem("grapas")
        ) || [];


    const coleccion =
        colecciones.find(
            item =>
                item.id === coleccionId
        );


    if (!coleccion) {
        return;
    }


    coleccion.cantidad =
        grapas.filter(
            grapa =>
                grapa.coleccionId ===
                coleccionId
        ).length;


    localStorage.setItem(
        "colecciones",
        JSON.stringify(colecciones)
    );

}


/* =========================================
   ALERTA PERSONALIZADA
========================================= */

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


    if (tipo === "success") {

        alertIcon.textContent =
            "✓";

    } else {

        alertIcon.textContent =
            "×";

    }


    alertTitle.textContent =
        titulo;

    alertMessage.textContent =
        mensaje;


    alertOverlay.classList.add(
        "visible"
    );


    /*
       Reemplazar callback anterior
       para evitar acumulación.
    */

    alertButton.onclick = () => {

        cerrarAlerta();


        if (callback) {

            callback();

        }

    };

}


/* =========================================
   CERRAR ALERTA
========================================= */

function cerrarAlerta() {

    alertOverlay.classList.remove(
        "visible"
    );

}


/* =========================================
   BOTÓN ALERTA
========================================= */

alertButton.addEventListener(
    "click",
    cerrarAlerta
);


/* =========================================
   CERRAR CON CLICK FUERA
========================================= */

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


/* =========================================
   CANCELAR
========================================= */

btnCancelar.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);


/* =========================================
   REGRESAR
========================================= */

btnRegresar.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);


/* =========================================
   INICIALIZACIÓN
========================================= */

cargarColecciones();

manejarCambioColeccion();

renderizarPaginas();