export default class Cl_vCliente {
    btnsCat;
    contenedorProductos;
    tbodyCarrito;
    spanTotal;
    inNombre;
    selPago;
    btnEnviar;
    seccionPagoMovil;
    inCedula;
    inBanco;
    inReferencia;
    toastEl;
    _toastTimer = null;
    constructor() {
        this.btnsCat = document.querySelectorAll("[data-cat]");
        this.contenedorProductos = document.getElementById("contenedorProductos");
        this.tbodyCarrito = document.getElementById("tbodyCarrito");
        this.spanTotal = document.getElementById("spanTotal");
        this.inNombre = document.getElementById("inNombre");
        this.selPago = document.getElementById("selPago");
        this.btnEnviar = document.getElementById("btnEnviar");
        this.seccionPagoMovil = document.getElementById("seccionPagoMovil");
        this.inCedula = document.getElementById("inCedula");
        this.inBanco = document.getElementById("inBanco");
        this.inReferencia = document.getElementById("inReferencia");
        this.toastEl = document.getElementById("toast");
        this.selPago.onchange = () => {
            this.seccionPagoMovil.style.display = this.selPago.value === "pago_movil" ? "block" : "none";
        };
    }
    get nombreCliente() { return this.inNombre.value.trim(); }
    get tipoPago() { return this.selPago.value; }
    get datosPagoMovil() {
        return {
            cedulaPago: this.inCedula.value.trim(),
            bancoPago: this.inBanco.value.trim(),
            referencia: this.inReferencia.value.trim(),
        };
    }
    onVerCategoria(callback) {
        this.btnsCat.forEach(btn => {
            btn.onclick = () => callback(btn.dataset["cat"] ?? "");
        });
    }
    onAgregarAlCarrito(callback) {
        this.contenedorProductos.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-agregar]");
            if (btn)
                callback(Number(btn.dataset["agregar"]));
        });
    }
    onQuitarDelCarrito(callback) {
        this.tbodyCarrito.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-quitar]");
            if (btn)
                callback(Number(btn.dataset["quitar"]));
        });
    }
    onEnviarPedido(callback) {
        this.btnEnviar.onclick = callback;
    }
    mostrarProductosCategoria(productos) {
        if (!productos.length) {
            this.contenedorProductos.innerHTML = "<p>No hay productos en esta categoría.</p>";
            return;
        }
        this.contenedorProductos.innerHTML = productos.map(p => `
      <div>
        #${p.id} - ${p.nombre} - $${p.precio.toFixed(2)}
        <button data-agregar="${p.id}">+ Agregar</button>
      </div>
    `).join("");
    }
    actualizarCarrito(items) {
        if (!items.length) {
            this.tbodyCarrito.innerHTML = '<tr><td colspan="4">Carrito vacío</td></tr>';
            return;
        }
        this.tbodyCarrito.innerHTML = items.map(i => `
      <tr>
        <td>${i.nombre}</td>
        <td>$${i.precio.toFixed(2)}</td>
        <td>${i.cantidad}</td>
        <td><button data-quitar="${i.id}">− Quitar</button></td>
      </tr>
    `).join("");
    }
    mostrarTotal(total) {
        this.spanTotal.textContent = total.toFixed(2);
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
//# sourceMappingURL=Cl_vCliente.js.map