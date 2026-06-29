/* ==========================================================
   utils.js
   Funciones auxiliares
========================================================== */

/**
 * Calcula porcentaje
 */
function calcularPorcentaje(validadas, enviadas) {

    if (!enviadas || enviadas === 0) {
        return 0;
    }

    return validadas / enviadas;

}

/**
 * Devuelve porcentaje formateado
 */
function formatPercent(valor) {

    return (valor * 100).toFixed(1) + "%";

}

/**
 * Color según objetivo
 */
function getColor(valor) {

    if (valor >= CONFIG.OBJETIVO) {

        return "#27AE60";

    }

    if (valor >= 0.40) {

        return "#F2C94C";

    }

    return "#EB5757";

}

/**
 * Clase CSS según porcentaje
 */
function getStatusClass(valor) {

    if (valor >= CONFIG.OBJETIVO) {

        return "success";

    }

    if (valor >= 0.40) {

        return "warning";

    }

    return "danger";

}

/**
 * Formato número
 */
function formatNumber(valor) {

    return Number(valor).toLocaleString("es-AR");

}
