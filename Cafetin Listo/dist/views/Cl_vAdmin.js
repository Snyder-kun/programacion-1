export default class Cl_vAdmin {
    inNombre;
    inCategoria;
    inPrecio;
    btnCargar;
    btnLimpiar;
    tbodyPedidos;
    listaProductos;
    toastEl;
    _toastTimer = null;
    constructor() {
        this.inNombre = document.getElementById("inNombre");
        this.inCategoria = document.getElementById("inCategoria");
        this.inPrecio = document.getElementById("inPrecio");
        this.btnCargar = document.getElementById("btnCargar");
        this.btnLimpiar = document.getElementById("btnLimpiar");
        this.tbodyPedidos = document.getElementById("tbodyPedidos");
        this.listaProductos = document.getElementById("listaProductos");
        this.toastEl = document.getElementById("toast");
    }
    get datosProducto() {
        return {
            nombre: this.inNombre.value.trim(),
            categoria: this.inCategoria.value,
            precio: parseFloat(this.inPrecio.value) || 0,
        };
    }
    onCargarProducto(callback) {
        this.btnCargar.onclick = callback;
    }
    onLimpiar(callback) {
        this.btnLimpiar.onclick = callback;
    }
    onMarcarProcesado(callback) {
        this.tbodyPedidos.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement))
                return;
            const btn = target.closest("[data-procesar]");
            if (btn)
                callback(Number(btn.dataset["procesar"]));
        });
    }
    onEliminarPedido(callback) {
        this.tbodyPedidos.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement))
                return;
            const btn = target.closest("[data-eliminar]");
            if (btn)
                callback(Number(btn.dataset["eliminar"]));
        });
    }
    mostrarPedidos(pedidos) {
        if (!pedidos.length) {
            this.tbodyPedidos.innerHTML = '<tr><td colspan="7">Sin pedidos registrados</td></tr>';
            return;
        }
        this.tbodyPedidos.innerHTML = pedidos.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.tipoPago}</td>
        <td>${p.productos.map(pr => `${pr.nombre} ($${pr.precio})`).join(", ")}</td>
        <td>$${p.calcularTotal().toFixed(2)}</td>
        <td>${p.fechaPago ? new Date(p.fechaPago).toLocaleString("es-ES") : "-"}</td>
        <td>
          ${!p.procesado ? `<button data-procesar="${p.id}">✓ Procesar</button>` : "Procesado"}
          <button data-eliminar="${p.id}">✗ Eliminar</button>
         </td>
      </tr>
    `).join("");
    }
    mostrarProductosCargados(productos) {
        if (!productos.length) {
            this.listaProductos.innerHTML = "<p>Aún no hay productos.</p>";
            return;
        }
        this.listaProductos.innerHTML = productos.map(p => `
      <div>#${p.id} - ${p.nombre} (${p.categoria}) - $${p.precio.toFixed(2)}</div>
    `).join("");
    }
    limpiarFormulario() {
        this.inNombre.value = "";
        this.inCategoria.value = "";
        this.inPrecio.value = "";
        this.inNombre.focus();
    }
    mostrarMensaje(msg, tipo = "") {
        this.toastEl.textContent = msg;
        this.toastEl.style.background = tipo === "warn" ? "#c0392b" : "#333";
        this.toastEl.style.display = "block";
        if (this._toastTimer)
            clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => { this.toastEl.style.display = "none"; }, 3000);
    }
}
//# sourceMappingURL=Cl_vAdmin.js.map