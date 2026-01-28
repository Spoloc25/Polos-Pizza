function formatoPesos(valor) {
  return valor.toLocaleString("es-CO");
}

/* ======================
   ELEMENTOS
====================== */

const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const totalGastosEl = document.getElementById("totalGastos");
const btnBorrarHoy = document.getElementById("borrarGastosHoy");

/* ======================
   UTILIDADES
====================== */

function fechaHoy() {
  return new Date().toISOString().split("T")[0];
}

/* ======================
   RENDER GASTOS
====================== */

function renderGastos() {
  const gastos = getGastos();
  const hoy = fechaHoy();

  const gastosHoy = gastos.filter(g => g.fecha === hoy);

  lista.innerHTML = "";
  let total = 0;

  gastosHoy.forEach((g, index) => {
    total += g.monto;

    const li = document.createElement("li");
    li.innerHTML = `
      ${g.descripcion} - $${formatoPesos(g.monto)}
      <button class="btn-eliminar" data-index="${index}">🗑️</button>
    `;

    lista.appendChild(li);
  });

  totalGastosEl.textContent = `$${formatoPesos(total)}`;

  activarBotonesEliminar();
}

/* ======================
   ELIMINAR UN GASTO
====================== */

function activarBotonesEliminar() {
  const botones = document.querySelectorAll(".btn-eliminar");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Borrar este gasto?")) return;

      const index = Number(btn.dataset.index);
      const hoy = fechaHoy();

      let gastos = getGastos();

      const gastosHoy = gastos.filter(g => g.fecha === hoy);
      gastosHoy.splice(index, 1);

      const otrosGastos = gastos.filter(g => g.fecha !== hoy);
      const nuevosGastos = otrosGastos.concat(gastosHoy);

      localStorage.setItem("gastos", JSON.stringify(nuevosGastos));
      renderGastos();
    });
  });
}

/* ======================
   GUARDAR GASTO
====================== */

form.addEventListener("submit", e => {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value.trim();
  const monto = Number(document.getElementById("monto").value);

  if (!descripcion || monto <= 0) return;

  const gasto = {
    fecha: fechaHoy(),
    descripcion,
    monto
  };

  addGasto(gasto);
  form.reset();
  renderGastos();
});

/* ======================
   BORRAR GASTOS DE HOY
====================== */

btnBorrarHoy.addEventListener("click", () => {
  if (!confirm("¿Borrar todos los gastos de hoy?")) return;

  const hoy = fechaHoy();
  let gastos = getGastos();

  gastos = gastos.filter(g => g.fecha !== hoy);

  localStorage.setItem("gastos", JSON.stringify(gastos));
  renderGastos();
});

/* ======================
   INIT
====================== */

renderGastos();
