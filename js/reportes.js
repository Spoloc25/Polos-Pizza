function formatoPesos(valor) {
  return valor.toLocaleString("es-CO");
}

// ======== DATOS ========
const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
const listaReportes = document.getElementById("listaReportes");
const toggle = document.querySelector(".card-toggle");
const contenido = document.querySelector(".card-content");

// Elementos de resumen
const gananciaMensualEl = document.getElementById("gananciaMensual");
const totalEfectivoMesEl = document.getElementById("totalEfectivoMes");
const totalTransferenciaMesEl = document.getElementById("totalTransferenciaMes");
const promedioVentasEl = document.getElementById("promedioVentas");
const promedioGastosEl = document.getElementById("promedioGastos");
const promedioGananciaEl = document.getElementById("promedioGanancia");
const gananciaAnualEl = document.getElementById("gananciaAnual");
const topDiaVentasEl = document.getElementById("topDiaVentas");
const topDiaGastosEl = document.getElementById("topDiaGastos");



// ======== COLLAPSIBLE HISTORIAL ========
if (toggle && contenido) {
  toggle.addEventListener("click", () => {
    contenido.classList.toggle("active");
    contenido.style.display = contenido.classList.contains("active") ? "block" : "none";
  });
}

// ======== RENDER HISTORIAL ========
function renderHistorial(data = reportes) {
  if (!listaReportes) return;

  listaReportes.innerHTML = "";
  if (data.length === 0) {
    listaReportes.innerHTML = "<li>No hay reportes guardados aún.</li>";
    return;
  }

  data.slice().reverse().forEach(r => {
    const li = document.createElement("li");
    const claseGanancia = r.ganancia >= 0 ? "positivo" : "negativo";
    li.innerHTML = `
      <div class="reporte-fecha">🗓️ ${r.fecha}</div>
      <div>💰 Ventas: $${formatoPesos(r.ventas)}</div>
      <div>💸 Gastos: $${formatoPesos(r.gastos)}</div>
      <div class="reporte-ganancia ${claseGanancia}">📊 Ganancia: $${formatoPesos(r.ganancia)}</div>
      <div>💵 Efectivo: $${formatoPesos(r.efectivo)}</div>
      <div>📱 Transferencia: $${formatoPesos(r.transferencia)}</div>
    `;
    listaReportes.appendChild(li);
  });
}

// ======== RESUMEN MENSUAL ========
function renderMensual() {
  if (!gananciaMensualEl) return;

  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const reportesMes = reportes.filter(r => {
    const rFecha = new Date(r.fecha);
    return rFecha.getMonth() === mesActual && rFecha.getFullYear() === anioActual;
  });

  const ventasMes = reportesMes.reduce((acc, r) => acc + r.ventas, 0);
  const gastosMes = reportesMes.reduce((acc, r) => acc + r.gastos, 0);
  const gananciaMes = reportesMes.reduce((acc, r) => acc + r.ganancia, 0);

  gananciaMensualEl.innerText = `$${formatoPesos(gananciaMes)}`;
  totalEfectivoMesEl.innerText = `$${formatoPesos(reportesMes.reduce((acc, r) => acc + r.efectivo, 0))}`;
  totalTransferenciaMesEl.innerText = `$${formatoPesos(reportesMes.reduce((acc, r) => acc + r.transferencia, 0))}`;

  // Promedio diario
  const diasUnicos = [...new Set(reportesMes.map(r => r.fecha))];
  const promedioVentas = diasUnicos.length ? Math.round(ventasMes / diasUnicos.length) : 0;
  const promedioGastos = diasUnicos.length ? Math.round(gastosMes / diasUnicos.length) : 0;
  const promedioGanancia = diasUnicos.length ? Math.round(gananciaMes / diasUnicos.length) : 0;

  promedioVentasEl.innerText = formatoPesos(promedioVentas);
  promedioGastosEl.innerText = formatoPesos(promedioGastos);
  promedioGananciaEl.innerText = formatoPesos(promedioGanancia);
}

// ======== GANANCIA ANUAL ========
function renderAnual() {
  if (!gananciaAnualEl) return;

  const anioActual = new Date().getFullYear();
  const reportesAnio = reportes.filter(r => new Date(r.fecha).getFullYear() === anioActual);
  const gananciaAnual = reportesAnio.reduce((acc, r) => acc + r.ganancia, 0);
  gananciaAnualEl.innerText = `$${formatoPesos(gananciaAnual)}`;
}

// ======== DÍAS DESTACADOS ========
function renderTopDias() {
  if (!topDiaVentasEl || !topDiaGastosEl || reportes.length === 0) return;

  const topVentas = reportes.reduce((max, r) => r.ventas > max.ventas ? r : max, reportes[0]);
  const topGastos = reportes.reduce((max, r) => r.gastos > max.gastos ? r : max, reportes[0]);

  topDiaVentasEl.innerText = `${topVentas.fecha} ($${formatoPesos(topVentas.ventas)})`;
  topDiaGastosEl.innerText = `${topGastos.fecha} ($${formatoPesos(topGastos.gastos)})`;
}

// ======== RANKING DE PIZZAS ========
function renderRanking() {
  if (!rankingMensualEl || !rankingAnualEl) return;

  const rankingMensual = {};
  const rankingAnual = {};

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  reportes.forEach(r => {
    if (!r.detallePizzas) return;
    const fecha = new Date(r.fecha);

    r.detallePizzas.forEach(p => {
      // Ranking mensual
      if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
        if (rankingMensual[p.nombre]) rankingMensual[p.nombre] += p.cantidad;
        else rankingMensual[p.nombre] = p.cantidad;
      }
      // Ranking anual
      if (fecha.getFullYear() === anioActual) {
        if (rankingAnual[p.nombre]) rankingAnual[p.nombre] += p.cantidad;
        else rankingAnual[p.nombre] = p.cantidad;
      }
    });
  });

  // Render mensual
  const arrMensual = Object.entries(rankingMensual).sort((a, b) => b[1] - a[1]);
  rankingMensualEl.innerHTML = arrMensual.length
    ? arrMensual.map(([nombre, cant]) => `<li>${nombre}: ${cant} pizza(s)</li>`).join("")
    : "<li>No hay ventas este mes.</li>";

  // Render anual
  const arrAnual = Object.entries(rankingAnual).sort((a, b) => b[1] - a[1]);
  rankingAnualEl.innerHTML = arrAnual.length
    ? arrAnual.map(([nombre, cant]) => `<li>${nombre}: ${cant} pizza(s)</li>`).join("")
    : "<li>No hay ventas este año.</li>";
}

// ======== INIT ========
renderHistorial();
renderMensual();
renderAnual();
renderTopDias();
renderRanking();