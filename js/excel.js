/* ==========================================================
   excel.js
   ----------------------------------------------------------
   Lectura del archivo Excel y normalización de datos
========================================================== */

// Base de datos en memoria
let excelData = [];

/**
 * Inicializa el selector de archivos
 */
function initExcelLoader() {

    const input = document.getElementById("excelFile");

    if (!input) {
        console.error("No se encontró el input excelFile.");
        return;
    }

    input.addEventListener("change", readExcel);

}

/**
 * Lee el archivo Excel seleccionado
 */
function readExcel(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            // Primera hoja
            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            // Convierte a JSON
            const json = XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval: ""
                }
            );

            // Normaliza la información
            excelData = normalizeData(json);

            console.log("Datos cargados:", excelData);

            // Actualiza la fecha
            updateLoadDate(file);

            // Llama al Dashboard
            if (typeof loadDashboard === "function") {
                loadDashboard();
            }

        }

        catch (error) {

            console.error(error);

            alert("Error leyendo el archivo Excel.");

        }

    };

    reader.readAsArrayBuffer(file);

}

/**
 * Convierte la información del Excel
 * en un formato uniforme para toda la aplicación
 */
function normalizeData(data) {

    return data.map(row => {

        //--------------------------------------------------
        // NEGOCIO
        //--------------------------------------------------

        let negocio = row[CONFIG.COLUMNAS.NEGOCIO];

        if (CONFIG.BUSINESS_BEYOND.includes(negocio)) {

            negocio = "Beyond";

        }

        //--------------------------------------------------
        // OBJETO NORMALIZADO
        //--------------------------------------------------

        return {

            promotor:

                row[CONFIG.COLUMNAS.PROMOTOR] ?? "",

            distribuidor:

                row[CONFIG.COLUMNAS.DISTRIBUIDOR] ?? "",

            supervisor:

                row[CONFIG.COLUMNAS.SUPERVISOR] ?? "",

            negocio,

            tarea:

                row[CONFIG.COLUMNAS.TAREA] ?? "",

            tareas:

                Number(
                    row[CONFIG.COLUMNAS.ENVIADAS] ?? 0
                ),

            validadas:

                Number(
                    row[CONFIG.COLUMNAS.VALIDADAS] ?? 0
                )

        };

    });

}

/**
 * Actualiza la fecha y hora
 * del archivo cargado
 */
function updateLoadDate(file) {

    const fecha = new Date();

    const texto =

        "Archivo: " +

        file.name +

        " | " +

        fecha.toLocaleDateString() +

        " " +

        fecha.toLocaleTimeString();

    document.getElementById("fechaCarga").innerHTML = texto;

}

/**
 * Devuelve toda la información
 */
function getExcelData() {

    return excelData;

}

/**
 * Devuelve únicamente
 * los registros filtrados
 */
function getFilteredData(filters = {}) {

    return excelData.filter(item => {

        if (

            filters.negocio &&
            filters.negocio !== "Todos" &&
            item.negocio !== filters.negocio

        ) {

            return false;

        }

        if (

            filters.distribuidor &&
            item.distribuidor !== filters.distribuidor

        ) {

            return false;

        }

        if (

            filters.supervisor &&
            item.supervisor !== filters.supervisor

        ) {

            return false;

        }

        if (

            filters.promotor &&
            item.promotor !== filters.promotor

        ) {

            return false;

        }

        return true;

    });

}
