/* ==========================================================
   filters.js
   Manejo de filtros e interacciones
========================================================== */

let currentFilters = {
    negocio: "",
    supervisor: "",
    distribuidor: "",
    promotor: ""
};

/* ==========================================================
   Inicializa filtros
========================================================== */

function initFilters() {

    document
        .getElementById("negocioFilter")
        .addEventListener("change", onNegocioChange);

    document
        .getElementById("supervisorFilter")
        .addEventListener("change", onSupervisorChange);

    document
        .getElementById("distribuidorFilter")
        .addEventListener("change", onDistribuidorChange);

    document
        .getElementById("promotorFilter")
        .addEventListener("change", onPromotorChange);

}

/* ==========================================================
   Carga opciones de filtros
========================================================== */

function loadFilters(data) {

    fillSelect(
        "negocioFilter",
        [...new Set(data.map(x => x.negocio))].sort(),
        "Todos los Negocios"
    );

    fillSelect(
        "supervisorFilter",
        [...new Set(data.map(x => x.supervisor))].sort(),
        "Todos los Supervisores"
    );

    fillSelect(
        "distribuidorFilter",
        [...new Set(data.map(x => x.distribuidor))].sort(),
        "Todos los Distribuidores"
    );

    fillSelect(
        "promotorFilter",
        [...new Set(data.map(x => x.promotor))].sort(),
        "Todos los Promotores"
    );

}

/* ==========================================================
   Completa un select
========================================================== */

function fillSelect(id, values, firstOption) {

    const select = document.getElementById(id);

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";

    option.textContent = firstOption;

    select.appendChild(option);

    values.forEach(value => {

        const op = document.createElement("option");

        op.value = value;

        op.textContent = value;

        select.appendChild(op);

    });

}

/* ==========================================================
   Eventos
========================================================== */

function onNegocioChange(e) {

    currentFilters.negocio = e.target.value;

    refreshDashboard();

}

function onSupervisorChange(e) {

    currentFilters.supervisor = e.target.value;

    refreshDashboard();

}

function onDistribuidorChange(e) {

    currentFilters.distribuidor = e.target.value;

    refreshDashboard();

}

function onPromotorChange(e) {

    currentFilters.promotor = e.target.value;

    refreshDashboard();

}

/* ==========================================================
   Click desde el gráfico
========================================================== */

function selectDistribuidor(nombre) {

    currentFilters.distribuidor = nombre;

    document.getElementById("distribuidorFilter").value = nombre;

    refreshDashboard();

}

/* ==========================================================
   Actualiza Dashboard
========================================================== */

function refreshDashboard() {

    const data = getFilteredData(currentFilters);

    updateKPIs(data);

    buildSupervisorPanel(data);

    buildRankingChart(data);

    updatePromotores(data);

    updateTaskTable(data);

}

/* ==========================================================
   Promotores
========================================================== */

function updatePromotores(data) {

    const container = document.getElementById("promotoresContainer");

    container.innerHTML = "";

    const resumen = {};

    data.forEach(item => {

        if (!resumen[item.promotor]) {

            resumen[item.promotor] = {
                enviadas: 0,
                validadas: 0
            };

        }

        resumen[item.promotor].enviadas += item.tareas;
        resumen[item.promotor].validadas += item.validadas;

    });

    Object.keys(resumen)
        .sort()
        .forEach(nombre => {

            const info = resumen[nombre];

            const porcentaje =
                info.enviadas === 0
                    ? 0
                    : info.validadas / info.enviadas;

            const div = document.createElement("div");

            div.className = "promotor-card";

            div.innerHTML = `
                <span>${nombre}</span>
                <strong>${(porcentaje * 100).toFixed(1)}%</strong>
            `;

            div.onclick = function () {

                currentFilters.promotor = nombre;

                document.getElementById("promotorFilter").value = nombre;

                refreshDashboard();

            };

            container.appendChild(div);

        });

}

/* ==========================================================
   Tabla Tareas
========================================================== */

function updateTaskTable(data) {

    const tbody = document.getElementById("tablaTareas");

    tbody.innerHTML = "";

    const resumen = {};

    data.forEach(item => {

        if (!resumen[item.tarea]) {

            resumen[item.tarea] = {

                enviadas: 0,
                validadas: 0

            };

        }

        resumen[item.tarea].enviadas += item.tareas;

        resumen[item.tarea].validadas += item.validadas;

    });

    Object.keys(resumen)
        .sort()
        .forEach(tarea => {

            const info = resumen[tarea];

            const porcentaje =
                info.enviadas === 0
                    ? 0
                    : info.validadas / info.enviadas;

            tbody.innerHTML += `
                <tr>
                    <td>${tarea}</td>
                    <td>${info.enviadas}</td>
                    <td>${info.validadas}</td>
                    <td>${(porcentaje * 100).toFixed(1)}%</td>
                </tr>
            `;

        });

}
