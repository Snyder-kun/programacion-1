import I_vAdmin, { DatosProductoForm } from "../interfaces/I_vAdmin.js";
import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_mProducto from "../models/Cl_mProducto.js";

export default class Cl_vAdmin implements I_vAdmin {
  private inNombre: HTMLInputElement;
  private inCategoria: HTMLSelectElement;
  private inPrecio: HTMLInputElement;
  private btnCargar: HTMLButtonElement;
  private btnLimpiar: HTMLButtonElement;
  private tbodyPedidos: HTMLTableSectionElement;
  private listaProductos: HTMLElement;
  private toastEl: HTMLElement;
  private _toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.inNombre = document.getElementById("inNombre") as HTMLInputElement;
    this.inCategoria = document.getElementById("inCategoria") as HTMLSelectElement;
    this.inPrecio = document.getElementById("inPrecio") as HTMLInputElement;
    this.btnCargar = document.getElementById("btnCargar") as HTMLButtonElement;
    this.btnLimpiar = document.getElementById("btnLimpiar") as HTMLButtonElement;
    this.tbodyPedidos = document.getElementById("tbodyPedidos") as HTMLTableSectionElement;
    this.listaProductos = document.getElementById("listaProductos") as HTMLElement;
    this.toastEl = document.getElementById("toast") as HTMLElement;
  }

  get datosProducto(): DatosProductoForm {
    return {
      nombre: this.inNombre.value.trim(),
      categoria: this.inCategoria.value,
      precio: parseFloat(this.inPrecio.value) || 0,
    };
  }

  onCargarProducto(callback: () => void): void {
    this.btnCargar.onclick = callback;
  }

  onLimpiar(callback: () => void): void {
    this.btnLimpiar.onclick = callback;
  }

  onMarcarProcesado(callback: (id: number) => void): void {
    this.tbodyPedidos.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest("[data-procesar]") as HTMLElement | null;
      if (btn) callback(Number(btn.dataset["procesar"]));
    });
  }

  onEliminarPedido(callback: (id: number) => void): void {
    this.tbodyPedidos.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest("[data-eliminar]") as HTMLElement | null;
      if (btn) callback(Number(btn.dataset["eliminar"]));
    });
  }

  mostrarPedidos(pedidos: Cl_mPedido[]): void {
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

  mostrarProductosCargados(productos: Cl_mProducto[]): void {
    if (!productos.length) {
      this.listaProductos.innerHTML = "<p>Aún no hay productos.</p>";
      return;
    }
    this.listaProductos.innerHTML = productos.map(p => `
      <div>#${p.id} - ${p.nombre} (${p.categoria}) - $${p.precio.toFixed(2)}</div>
    `).join("");
  }

  limpiarFormulario(): void {
    this.inNombre.value = "";
    this.inCategoria.value = "";
    this.inPrecio.value = "";
    this.inNombre.focus();
  }

  mostrarMensaje(msg: string, tipo: string = ""): void {
    this.toastEl.textContent = msg;
    this.toastEl.style.background = tipo === "warn" ? "#c0392b" : "#333";
    this.toastEl.style.display = "block";
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this.toastEl.style.display = "none"; }, 3000);
  }
}