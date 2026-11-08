
"use strict";

// ========================================
// 1. NAVEGACIÓN ENTRE PANTALLAS
// ========================================

const pantallas = document.querySelectorAll(".pantalla");
const botonesNavegacion = document.querySelectorAll("[data-view]");

function mostrarPantalla(nombre) {
    pantallas.forEach(function (pantalla) {
        pantalla.hidden = pantalla.id !== "vista-" + nombre;
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

botonesNavegacion.forEach(function (boton) {
    boton.addEventListener("click", function () {
        mostrarPantalla(boton.dataset.view);
    });
});

mostrarPantalla("inicio");


// ========================================
// 2. ELEMENTOS DE LAS CALCULADORAS
// ========================================

const zonaCalculadora = document.getElementById("zona-calculadora");
const zonaInversiones = document.getElementById("zona-inversiones");

const formatoDinero = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2
});

function dinero(valor) {
    return formatoDinero.format(valor);
}

function campo(etiqueta, id, opciones = {}) {
    const minimo = opciones.min ?? "0";
    const paso = opciones.step ?? "0.01";

    return `
        <label for="${id}">${etiqueta}</label>
        <input
            type="number"
            id="${id}"
            name="${id}"
            min="${minimo}"
            step="${paso}"
            required
        >
    `;
}

function mostrarResultado(zona, mensaje) {
    const resultado = zona.querySelector(".resultado");

    resultado.innerHTML = mensaje;
    resultado.hidden = false;
}


// ========================================
// 3. ABRIR LAS HERRAMIENTAS
// ========================================

function abrirHerramienta(tipo) {
    const esInversion = tipo === "inversiones";
    const zona = esInversion ? zonaInversiones : zonaCalculadora;

    // Limpiar la herramienta anterior.
    zonaCalculadora.innerHTML = "";
    zonaCalculadora.hidden = true;
    zonaInversiones.innerHTML = "";

    zona.hidden = false;

    if (tipo === "rentabilidad") {
        zona.innerHTML = `
            <h2>Calculadora de rentabilidad</h2>
            <p>
                Ingresá las ventas y la utilidad obtenida.
                Calcularemos qué porcentaje de las ventas
                representa la utilidad.
            </p>
<div class="explicacion-formula">
    <h3>Fórmula de cálculo</h3>

    <p>
        Margen de utilidad =
        (Utilidad obtenida / Ventas totales) × 100
    </p>

    <p>
        Este indicador permite conocer qué porcentaje
        de las ventas se convierte en utilidad.
    </p>
</div>
            <form id="form-rentabilidad">
                ${campo("Ventas totales (Q)", "ventas")}
                ${campo("Utilidad obtenida (Q)", "utilidad", {
                    min: "-999999999"
                })}

                <button class="boton-principal" type="submit">
                    Calcular rentabilidad
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }

    else if (tipo === "efectivo") {
        zona.innerHTML = `
            <h2>Calculadora de flujo de efectivo</h2>
            <p>
                Registrá el dinero que entra y el dinero que sale
                durante un período.
            </p>
<div class="explicacion-formula">
    <h3>Fórmula de cálculo</h3>

    <p>
        Flujo neto = Entradas de efectivo - Salidas de efectivo
    </p>

    <p>
        Este indicador permite conocer si durante un período
        ingresó más dinero del que salió o si los egresos
        superaron los ingresos.
    </p>
</div>
            <form id="form-efectivo">
                ${campo("Entradas de efectivo (Q)", "entradas")}
                ${campo("Salidas de efectivo (Q)", "salidas")}

                <button class="boton-principal" type="submit">
                    Calcular flujo neto
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }

    else if (tipo === "comprar") {
        zona.innerHTML = `
            <h2>¿Conviene comprar o fabricar?</h2>
            <p>
                Compará el costo total de comprar un producto
                con el costo de fabricarlo internamente.
            </p>
<div class="explicacion-formula">
    <h3>Fórmulas de cálculo</h3>

    <p>
        Costo de comprar = Cantidad de unidades ×
        Precio de compra por unidad
    </p>

    <p>
        Costo de fabricar = (Cantidad de unidades ×
        Costo variable por unidad) + Costos fijos adicionales
    </p>

    <p>
        La alternativa con el menor costo representa
        un ahorro económico, siempre que ambas opciones
        cumplan con los requisitos de calidad y producción.
    </p>
</div>

            <form id="form-comprar">
                ${campo("Cantidad de unidades", "cantidad", {
                    step: "1"
                })}
                ${campo("Precio de compra por unidad (Q)", "precio-compra")}
                ${campo("Costo variable de fabricación por unidad (Q)", "costo-fabricacion")}
                ${campo("Costos fijos adicionales de fabricación (Q)", "costos-fijos")}

                <button class="boton-principal" type="submit">
                    Comparar costos
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }


    else if (tipo === "patrimonial") {
        zona.innerHTML = `
            <h2>Análisis patrimonial</h2>
            <p>
                Calculá el patrimonio neto y el porcentaje
                de pasivos respecto a los activos.
            </p>
<div class="explicacion-formula">
    <h3>Fórmulas de cálculo</h3>

    <p>
        Patrimonio neto = Activos totales - Pasivos totales
    </p>

    <p>
        Pasivos sobre activos = (Pasivos totales / Activos totales) × 100
    </p>

    <p>
        El patrimonio neto representa los recursos propios
        de la empresa después de descontar sus obligaciones.
        El porcentaje de pasivos permite conocer qué proporción
        de los activos está financiada por terceros.
    </p>
</div>
            <form id="form-patrimonial">
                ${campo("Activos totales (Q)", "activos")}
                ${campo("Pasivos totales (Q)", "pasivos")}

                <button class="boton-principal" type="submit">
                    Analizar patrimonio
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }

    else if (tipo === "eficiencia") {
        zona.innerHTML = `
            <h2>Eficiencia operativa</h2>
            <p>
                Calculá cuánto vende la empresa por cada
                quetzal utilizado en sus recursos operativos.
            </p>
<div class="explicacion-formula">
    <h3>Fórmula de cálculo</h3>

    <p>
        Eficiencia operativa = Ventas totales / Recursos operativos utilizados
    </p>

    <p>
        Este indicador permite conocer cuánto dinero en ventas
        genera la empresa por cada quetzal destinado a sus
        recursos operativos. Un resultado mayor indica una
        mayor relación entre ventas y recursos utilizados,
        aunque debe analizarse junto con otros indicadores.
    </p>
</div>
            <form id="form-eficiencia">
                ${campo("Ventas totales (Q)", "ventas-eficiencia")}
                ${campo("Recursos operativos utilizados (Q)", "recursos-operativos")}

                <button class="boton-principal" type="submit">
                    Calcular eficiencia
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }

    else if (tipo === "inversiones") {
        zona.innerHTML = `
            <h2>Evaluación de una inversión</h2>
            <p>
                Ingresá una inversión inicial, tres flujos de
                efectivo anuales y una tasa de descuento.
                Usaremos esos datos para estimar el VAN y la TIR.
            </p>

            <form id="form-inversiones">
                ${campo("Inversión inicial (Q)", "inversion-inicial")}
                ${campo("Flujo de efectivo del año 1 (Q)", "flujo-1")}
                ${campo("Flujo de efectivo del año 2 (Q)", "flujo-2")}
                ${campo("Flujo de efectivo del año 3 (Q)", "flujo-3")}
                ${campo("Tasa de descuento anual (%)", "tasa-descuento")}

                <button class="boton-principal" type="submit">
                    Calcular VAN y TIR
                </button>
            </form>

            <div class="resultado" role="status" hidden></div>
        `;
    }

    conectarFormulario(tipo, zona);

    zona.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// 4. CONECTAR LOS BOTONES DE HERRAMIENTAS
// ========================================

document.querySelectorAll("[data-tool]").forEach(function (boton) {
    boton.addEventListener("click", function () {
        abrirHerramienta(boton.dataset.tool);
    });
});


// ========================================
// 5. CALCULAR LA RENTABILIDAD
// ========================================

function conectarFormulario(tipo, zona) {
    const formulario = zona.querySelector("form");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const valor = function (id) {
            return Number(formulario.elements[id].value);
        };

        if (tipo === "rentabilidad") {
            const ventas = valor("ventas");
            const utilidad = valor("utilidad");

            if (ventas <= 0) {
                alert("Las ventas deben ser mayores que cero.");
                return;
            }

            const porcentaje = (utilidad / ventas) * 100;

            mostrarResultado(zona, `
                <h3>Resultado</h3>
                <p>Margen de utilidad:
                    <strong>${porcentaje.toFixed(2)}%</strong>
                </p>
                <p>
                    Por cada Q100 vendidos, la empresa obtiene
                    Q${porcentaje.toFixed(2)} de utilidad
                    según los datos ingresados.
                </p>
                <p>
                    ${porcentaje >= 0
                        ? "El resultado muestra una utilidad."
                        : "El resultado muestra una pérdida."}
                </p>
            `);
        }

        // ========================================
        // 6. CALCULAR EL FLUJO DE EFECTIVO
        // ========================================

        else if (tipo === "efectivo") {
            const entradas = valor("entradas");
            const salidas = valor("salidas");
            const flujo = entradas - salidas;

            mostrarResultado(zona, `
                <h3>Resultado</h3>
                <p>Entradas: <strong>${dinero(entradas)}</strong></p>
                <p>Salidas: <strong>${dinero(salidas)}</strong></p>
                <p>Flujo neto:
                    <strong>${dinero(flujo)}</strong>
                </p>
                <p>
                    ${flujo > 0
                        ? "Entró más dinero del que salió durante el período."
                        : flujo < 0
                            ? "Salió más dinero del que entró durante el período."
                            : "Las entradas y salidas fueron iguales."}
                </p>
            `);
        }

        // ========================================
        // 7. COMPARAR COMPRAR O FABRICAR
        // ========================================

        else if (tipo === "comprar") {
            const cantidad = valor("cantidad");
            const precio = valor("precio-compra");
            const costoVariable = valor("costo-fabricacion");
            const costosFijos = valor("costos-fijos");

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                alert("La cantidad debe ser un número entero mayor que cero.");
                return;
            }

            const totalComprar = cantidad * precio;
            const totalFabricar =
                cantidad * costoVariable + costosFijos;

            let recomendacion;

            if (totalComprar < totalFabricar) {
                recomendacion = "Comprar tiene el menor costo.";
            } else if (totalFabricar < totalComprar) {
                recomendacion = "Fabricar tiene el menor costo.";
            } else {
                recomendacion = "Ambas alternativas tienen el mismo costo.";
            }

            mostrarResultado(zona, `
                <h3>Comparación de costos</h3>
                <p>Costo de comprar:
                    <strong>${dinero(totalComprar)}</strong>
                </p>
                <p>Costo de fabricar:
                    <strong>${dinero(totalFabricar)}</strong>
                </p>
                <p><strong>${recomendacion}</strong></p>
                <p>
                    Esta comparación considera únicamente los costos
                    ingresados. Antes de decidir, también conviene
                    evaluar la calidad, la capacidad de producción
                    y otros factores relevantes.
                </p>
            `);
        }

        // ========================================
        // 8. CALCULAR EL VAN Y ESTIMAR LA TIR
        // ========================================

        else if (tipo === "inversiones") {
            const inversion = valor("inversion-inicial");
            const flujos = [
                valor("flujo-1"),
                valor("flujo-2"),
                valor("flujo-3")
            ];
            const tasa = valor("tasa-descuento") / 100;

            if (inversion <= 0) {
                alert("La inversión inicial debe ser mayor que cero.");
                return;
            }

            function calcularVAN(tasaAnual) {
                let resultado = -inversion;

                flujos.forEach(function (flujo, indice) {
                    resultado += flujo /
                        Math.pow(1 + tasaAnual, indice + 1);
                });

                return resultado;
            }

            const van = calcularVAN(tasa);

            // Estimación de la TIR mediante búsqueda numérica.
            let inferior = -0.99;
            let superior = 10;
            let tirEncontrada =
                calcularVAN(inferior) * calcularVAN(superior) <= 0;

            if (tirEncontrada) {
                for (let i = 0; i < 200; i++) {
                    const medio = (inferior + superior) / 2;
                    const resultadoMedio = calcularVAN(medio);

                    if (Math.abs(resultadoMedio) < 0.000001) {
                        inferior = medio;
                        superior = medio;
                        break;
                    }

                    if (calcularVAN(inferior) * resultadoMedio <= 0) {
                        superior = medio;
                    } else {
                        inferior = medio;
                    }
                }
            }

            const tir = (inferior + superior) / 2;

            mostrarResultado(zona, `
                <h3>Resultado de la inversión</h3>
                <p>VAN:
                    <strong>${dinero(van)}</strong>
                </p>
                <p>
                    TIR estimada:
                    <strong>
                        ${tirEncontrada
                            ? (tir * 100).toFixed(2) + "%"
                            : "No se encontró una TIR en el intervalo analizado"}
                    </strong>
                </p>
                <p>
                    ${van > 0
                        ? "El VAN es positivo: el proyecto supera la tasa de descuento utilizada, bajo estos supuestos."
                        : van < 0
                            ? "El VAN es negativo: el proyecto no alcanza la rentabilidad requerida con esta tasa."
                            : "El VAN es cero: el proyecto iguala la rentabilidad requerida."}
                </p>
                <p>
                    La TIR es una estimación numérica. Para decidir,
                    también deben considerarse los riesgos y otros
                    factores del proyecto.
                </p>
            `);
        }

        else if (tipo === "patrimonial") {
            const activos = valor("activos");
            const pasivos = valor("pasivos");

            if (activos <= 0 || pasivos < 0) {
                alert("Los activos deben ser mayores que cero y los pasivos no pueden ser negativos.");
                return;
            }

            const patrimonio = activos - pasivos;
            const porcentajePasivos = (pasivos / activos) * 100;

            mostrarResultado(zona, `
                <h3>Resultado del análisis patrimonial</h3>
                <p>Activos totales:
                    <strong>${dinero(activos)}</strong>
                </p>
                <p>Pasivos totales:
                    <strong>${dinero(pasivos)}</strong>
                </p>
                <p>Patrimonio neto:
                    <strong>${dinero(patrimonio)}</strong>
                </p>
                <p>Pasivos sobre activos:
                    <strong>${porcentajePasivos.toFixed(2)}%</strong>
                </p>
                <p>
                    ${patrimonio > 0
                        ? "La empresa tiene patrimonio neto positivo."
                        : patrimonio < 0
                            ? "La empresa tiene patrimonio neto negativo."
                            : "Los activos y pasivos son iguales."}
                </p>
            `);
        }

        else if (tipo === "eficiencia") {
            const ventas = valor("ventas-eficiencia");
            const recursos = valor("recursos-operativos");

            if (ventas <= 0 || recursos <= 0) {
                alert("Las ventas y los recursos operativos deben ser mayores que cero.");
                return;
            }

            const eficiencia = ventas / recursos;

            mostrarResultado(zona, `
                <h3>Resultado de eficiencia operativa</h3>
                <p>Ventas totales:
                    <strong>${dinero(ventas)}</strong>
                </p>
                <p>Recursos operativos utilizados:
                    <strong>${dinero(recursos)}</strong>
                </p>
                <p>Relación ventas/recursos:
                    <strong>${eficiencia.toFixed(2)} veces</strong>
                </p>
                <p>
                    Por cada quetzal utilizado en recursos operativos,
                    la empresa genera Q${eficiencia.toFixed(2)} en ventas.
                </p>
            `);
        }
   });
}
