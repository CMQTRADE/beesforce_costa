/* ==========================================================
   dashboard.js
   Lógica principal del Dashboard
========================================================== */

function loadDashboard() {

    const data = getExcelData();

    if (!data.length) return;

    updateKPIs(data);

    buildSupervisorPanel(data);

    buildPromotorPanel([]);

    buildTaskTable([]);

    if (typeof buildRankingChart === "function") {

        buildRankingChart(data);

    }

}

/*==========================================================
KPIs
==========================================================*/

function updateKPIs(data) {

    const tareasEnviadas = data.reduce(
        (sum, item) => sum + item.tareas,
        0
    );

    const tareasValidadas = data.reduce(
        (sum, item) => sum + item.validadas,
        0
    );

    const porcentaje =

        tareasEnviadas === 0

            ? 0

            : tareasValidadas / tareasEnviadas;

    document.getElementById("tareasEnviadas").innerText =
        tareasEnviadas.toLocaleString();

    document.getElementById("tareasValidadas").innerText =
        tareasValidadas.toLocaleString();

    document.getElementById("validacionGeneral").innerText =
        (porcentaje * 100).toFixed(1) + "%";

    updateObjectiveCard(porcentaje);

    colorKPI("kpiValidacion", porcentaje);

}

/*==========================================================
OBJETIVO
==========================================================*/

function updateObjectiveCard(valor) {

    const diferencia =

        (valor - CONFIG.OBJETIVO) * 100;

    const objetivo = document.getElementById("objetivoDiff");

    if (diferencia >= 0) {

        objetivo.innerHTML =
            "+" + diferencia.toFixed(1) + " pp";

    }

    else {

        objetivo.innerHTML =
            diferencia.toFixed(1) + " pp";

    }

    colorKPI("objetivoCard", valor);

}

/*==========================================================
COLORES KPI
==========================================================*/

function colorKPI(id, valor) {

    const card = document.getElementById(id);

    card.classList.remove(
        "success",
        "warning",
        "danger"
    );

    if (valor >= CONFIG.OBJETIVO) {

        card.classList.add("success");

    }

    else if (valor >= 0.40) {

        card.classList.add("warning");

    }

    else {

        card.classList.add("danger");

    }

}

/*==========================================================
SUPERVISORES
==========================================================*/

function buildSupervisorPanel(data) {

    const container =
        document.getElementById("supervisoresContainer");

    container.innerHTML = "";

    const supervisores = {};

    data.forEach(item => {

        if (!supervisores[item.supervisor]) {

            supervisores[item.supervisor] = {};

        }

        if (!supervisores[item.supervisor][item.distribuidor]) {

            supervisores[item.supervisor][item.distribuidor] = {

                enviadas: 0,

                validadas: 0

            };

        }

        supervisores[item.supervisor][item.distribuidor].enviadas += item.tareas;

        supervisores[item.supervisor][item.distribuidor].validadas += item.validadas;

    });

    Object.keys(supervisores)

        .sort()

        .forEach(supervisor => {

            const card = document.createElement("div");

            card.className = "supervisor-card";

            let html =

                `<div class="supervisor-title">${supervisor}</div>`;

            Object.keys(supervisores[supervisor])

                .sort()

                .forEach(distribuidor => {

                    const info =
                        supervisores[supervisor][distribuidor];

                    const porcentaje =

                        info.enviadas === 0

                            ? 0

                            : info.validadas / info.enviadas;

                    html += `

                        <div class="supervisor-detail">

                            <span>${distribuidor}</span>

                            <strong>

                                ${(porcentaje*100).toFixed(1)}%

                            </strong>

                        </div>

                    `;

                });

            card.innerHTML = html;

            container.appendChild(card);

        });

}

/*==========================================================
PROMOTORES
==========================================================*/

function buildPromotorPanel(data) {

    const container =
        document.getElementById("promotoresContainer");

    container.innerHTML = "";

    if (!data.length) {

        container.innerHTML =
            "<p>Seleccione un distribuidor.</p>";

        return;

    }

}

/*==========================================================
TABLA TAREAS
==========================================================*/

function buildTaskTable(data) {

    const tbody =
        document.getElementById("tablaTareas");

    tbody.innerHTML = "";

    if (!data.length) {

        tbody.innerHTML =

            `<tr>

                <td colspan="4">

                    Seleccione un promotor.

                </td>

            </tr>`;

        return;

    }

}
