function getVentas() {
  return JSON.parse(localStorage.getItem("ventas")) || [];
}

function addVenta(venta) {
  const ventas = getVentas();
  ventas.push(venta);
  localStorage.setItem("ventas", JSON.stringify(ventas));
}

/* ======================
   GASTOS
====================== */

function getGastos() {
  return JSON.parse(localStorage.getItem("gastos")) || [];
}

function addGasto(gasto) {
  const gastos = getGastos();
  gastos.push(gasto);
  localStorage.setItem("gastos", JSON.stringify(gastos));
}
