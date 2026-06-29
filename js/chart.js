/* ==========================================================
   charts.js
   Ranking Distribuidores
========================================================== */

let rankingChart = null;

function buildRankingChart(data){

    const resumen = {};

    data.forEach(item=>{

        if(!resumen[item.distribuidor]){

            resumen[item.distribuidor]={

                enviadas:0,
                validadas:0

            };

        }

        resumen[item.distribuidor].enviadas+=item.tareas;
        resumen[item.distribuidor].validadas+=item.validadas;

    });

    const ranking=[];

    Object.keys(resumen).forEach(distribuidor=>{

        const enviadas=resumen[distribuidor].enviadas;

        const porcentaje=

            enviadas===0
            ?0
            :(resumen[distribuidor].validadas/enviadas);

        ranking.push({

            distribuidor,
            porcentaje

        });

    });

    ranking.sort((a,b)=>b.porcentaje-a.porcentaje);

    drawRanking(ranking);

}
function drawRanking(ranking){

    const chartDom=document.getElementById("rankingDistribuidores");

    if(rankingChart){

        rankingChart.dispose();

    }

    rankingChart=echarts.init(chartDom);

    const nombres=ranking.map(x=>x.distribuidor);

    const porcentajes=ranking.map(x=>(x.porcentaje*100).toFixed(1));

    const colores=ranking.map(x=>{

        if(x.porcentaje>=CONFIG.OBJETIVO){

            return "#27AE60";

        }

        if(x.porcentaje>=0.40){

            return "#F2C94C";

        }

        return "#EB5757";

    });

    const option={

        animationDuration:1200,

        grid:{
            left:180,
            right:50,
            top:20,
            bottom:20
        },

        tooltip:{
            trigger:"axis"
        },

        xAxis:{

            type:"value",

            max:100,

            axisLabel:{
                formatter:"{value}%"
            },

            splitLine:{
                lineStyle:{
                    color:"#ECECEC"
                }
            }

        },

        yAxis:{

            type:"category",

            inverse:true,

            data:nombres,

            axisTick:{
                show:false
            }

        },

        series:[{

            type:"bar",

            data:porcentajes.map((v,i)=>({

                value:v,

                itemStyle:{
                    color:colores[i]
                }

            })),

            label:{

                show:true,

                position:"right",

                formatter:"{c}%"

            },

            barWidth:24,

            borderRadius:[8,8,8,8]

        }]

    };

    rankingChart.setOption(option);

    rankingChart.on("click",function(params){

        selectDistribuidor(params.name);

    });

}
