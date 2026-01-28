function formatoPesos(valor) {
  return valor.toLocaleString("es-CO");
}

const form = document.getElementById("formVenta");
const lista = document.getElementById("listaVentas");
const totalVentasEl = document.getElementById("totalVentas");
const btnBorrarHoy = document.getElementById("borrarHoy");

/* ======================
   UTILIDADES
====================== */
function fechaHoy() {
  return new Date().toISOString().split("T")[0];
}

/* ======================
   RENDER VENTAS
====================== */
function renderVentas() {
  const ventas = getVentas();
  const hoy = fechaHoy();
  const ventasHoy = ventas.filter(v => v.fecha === hoy);

  lista.innerHTML = "";
  let total = 0;

  ventasHoy.forEach((v, index) => {
    total += v.precio;

    const li = document.createElement("li");
    li.innerHTML = `
      ${v.tipo} - ${v.cantidad} pizza(s) - $${formatoPesos(v.precio)} (${v.metodo})
      <button class="btn-eliminar" data-index="${index}">🗑️</button>
    `;

    lista.appendChild(li);
  });

  totalVentasEl.textContent = `$${formatoPesos(total)}`;

  activarBotonesEliminar();
}

/* ======================
   ELIMINAR UNA VENTA
====================== */
function activarBotonesEliminar() {
  const botones = document.querySelectorAll(".btn-eliminar");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Borrar esta venta?")) return;

      const index = Number(btn.dataset.index);
      const hoy = fechaHoy();
      let ventas = getVentas();

      const ventasHoy = ventas.filter(v => v.fecha === hoy);
      ventasHoy.splice(index, 1);

      const otrasVentas = ventas.filter(v => v.fecha !== hoy);
      const nuevasVentas = otrasVentas.concat(ventasHoy);

      localStorage.setItem("ventas", JSON.stringify(nuevasVentas));
      renderVentas();
    });
  });
}

/* ======================
   GUARDAR VENTA
====================== */
form.addEventListener("submit", e => {
  e.preventDefault();

  const tipo = document.getElementById("tipoPizza").value.trim();
  const cantidad = Number(document.getElementById("cantidad").value);
  const precio = Number(document.getElementById("precio").value);
  const metodo = document.getElementById("metodo").value;

  if (!tipo || cantidad <= 0 || precio <= 0) return;

  const venta = {
    fecha: fechaHoy(),
    tipo,
    cantidad,
    precio,
    metodo
  };

  addVenta(venta);
  form.reset();
  renderVentas();
});

/* ======================
   BORRAR VENTAS DE HOY
====================== */
btnBorrarHoy.addEventListener("click", () => {
  if (!confirm("¿Borrar todas las ventas de hoy?")) return;

  const hoy = fechaHoy();
  let ventas = getVentas();

  ventas = ventas.filter(v => v.fecha !== hoy);
  localStorage.setItem("ventas", JSON.stringify(ventas));
  renderVentas();
});

/* ======================
   INIT
====================== */
renderVentas();
