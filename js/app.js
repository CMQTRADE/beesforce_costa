/* ==========================================================
   app.js
   Inicio de la aplicación
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard iniciado");

    initExcelLoader();

    initFilters();

});

/**
 * Se ejecuta luego de cargar el Excel
 */
function loadDashboard() {

    const data = getExcelData();

    if (!data.length) return;

    // Cargar filtros
    loadFilters(data);

    // KPIs
    updateKPIs(data);

    // Ranking
    if (typeof buildRankingChart === "function") {

        buildRankingChart(data);

    }

    // Supervisores
    buildSupervisorPanel(data);

    // Promotores
    updatePromotores(data);

    // Tabla
    updateTaskTable(data);

}
