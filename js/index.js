/* =========================
   FUNCIONES AUXILIARES
========================= */

// Formatear número a pesos colombianos
function formatoPesos(valor) {
  return valor.toLocaleString("es-CO");
}

/* =========================
   FUNCIONES DE ACTUALIZACIÓN
========================= */

function actualizarDashboard() {
  // Obtener datos desde data.js
  const ventas = getVentas() || []; // [{fecha, precio, metodo}, ...]
  const gastos = getGastos() || []; // [{fecha, monto, descripcion}, ...]

  // Filtrar solo los datos de hoy (opcional, o se puede mostrar todo)
  const ventasHoy = ventas; // mostramos todo por ahora
  const gastosHoy = gastos;

  // Calcular totales
  const totalVentas = ventasHoy.reduce((acc, v) => acc + (v.precio || 0), 0);
  const totalGastos = gastosHoy.reduce((acc, g) => acc + (g.monto || 0), 0);
  const ganancia = totalVentas - totalGastos;

  // Mostrar totales
  const totalVentasEl = document.getElementById("totalVentas");
  const totalGastosEl = document.getElementById("totalGastos");
  const gananciaEl = document.getElementById("ganancia");

  if (totalVentasEl) totalVentasEl.innerText = `$${formatoPesos(totalVentas)}`;
  if (totalGastosEl) totalGastosEl.innerText = `$${formatoPesos(totalGastos)}`;
  if (gananciaEl) {
    gananciaEl.innerText = `$${formatoPesos(ganancia)}`;
    gananciaEl.style.color = ganancia >= 0 ? "green" : "red";
  }

  // Resumen por método de pago
  const totalEfectivo = ventasHoy
    .filter(v => v.metodo === "efectivo")
    .reduce((acc, v) => acc + (v.precio || 0), 0);

  const totalTransferencia = ventasHoy
    .filter(v => v.metodo === "transferencia")
    .reduce((acc, v) => acc + (v.precio || 0), 0);

  const resumenPagoEl = document.getElementById("resumenPago");
  if (resumenPagoEl) {
    resumenPagoEl.innerHTML = `
      <strong>Resumen de pagos</strong>
      <span>💵 Efectivo: $${formatoPesos(totalEfectivo)}</span>
      <span>📱 Transferencia: $${formatoPesos(totalTransferencia)}</span>
    `;
  }

  // Guardar variables globales para el botón de guardar
  window._ventasHoy = ventasHoy;
  window._totalVentas = totalVentas;
  window._totalGastos = totalGastos;
  window._ganancia = ganancia;
  window._totalEfectivo = totalEfectivo;
  window._totalTransferencia = totalTransferencia;
}

/* =========================
   GUARDAR REPORTE DEL DÍA
========================= */

const btnGuardarReporte = document.getElementById("guardarReporte");
if (btnGuardarReporte) {
  btnGuardarReporte.addEventListener("click", () => {
    // Pedir fecha al usuario
    let fechaReporte = prompt(
      "Ingrese la fecha del reporte en formato YYYY-MM-DD:",
      ""
    );

    if (!fechaReporte) {
      alert("Reporte cancelado. No ingresó la fecha.");
      return;
    }

    // Validar formato básico YYYY-MM-DD
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fechaReporte)) {
      alert("Formato incorrecto. Debe ser YYYY-MM-DD");
      return;
    }

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];

    // Evitar duplicar el mismo día
    const yaExiste = reportes.some(r => r.fecha === fechaReporte);
    if (yaExiste) {
      alert("Este día ya fue guardado.");
      return;
    }

    const reporte = {
      fecha: fechaReporte,
      ventas: window._totalVentas,
      gastos: window._totalGastos,
      ganancia: window._ganancia,
      efectivo: window._totalEfectivo,
      transferencia: window._totalTransferencia
    };

    reportes.push(reporte);
    localStorage.setItem("reportes", JSON.stringify(reportes));

    alert("Reporte guardado correctamente ✅");
  });
}

/* =========================
   INICIAR DASHBOARD
========================= */

// Actualizar al cargar
actualizarDashboard();