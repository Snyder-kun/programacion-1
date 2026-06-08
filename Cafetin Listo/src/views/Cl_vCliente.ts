import I_vCliente, { ItemCarrito, DatosPagoMovilForm } from "../interfaces/I_vCliente.js";
import Cl_mProducto from "../models/Cl_mProducto.js";

export default class Cl_vCliente implements I_vCliente {
  private btnsCat: NodeListOf<HTMLButtonElement>;
  private contenedorProductos: HTMLElement;
  private tbodyCarrito: HTMLTableSectionElement;
  private spanTotal: HTMLElement;
  private inNombre: HTMLInputElement;
  private selPago: HTMLSelectElement;
  private btnEnviar: HTMLButtonElement;
  private seccionPagoMovil: HTMLElement;
  private inCedula: HTMLInputElement;
  private inBanco: HTMLInputElement;
  private inReferencia: HTMLInputElement;
  private toastEl: HTMLElement;
  private _toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.btnsCat = document.querySelectorAll("[data-cat]");
    this.contenedorProductos = document.getElementById("contenedorProductos") as HTMLElement;
    this.tbodyCarrito = document.getElementById("tbodyCarrito") as HTMLTableSectionElement;
    this.spanTotal = document.getElementById("spanTotal") as HTMLElement;
    this.inNombre = document.getElementById("inNombre") as HTMLInputElement;
    this.selPago = document.getElementById("selPago") as HTMLSelectElement;
    this.btnEnviar = document.getElementById("btnEnviar") as HTMLButtonElement;
    this.seccionPagoMovil = document.getElementById("seccionPagoMovil") as HTMLElement;
    this.inCedula = document.getElementById("inCedula") as HTMLInputElement;
    this.inBanco = document.getElementById("inBanco") as HTMLInputElement;
    this.inReferencia = document.getElementById("inReferencia") as HTMLInputElement;
    this.toastEl = document.getElementById("toast") as HTMLElement;

    this.selPago.onchange = () => {
      this.seccionPagoMovil.style.display = this.selPago.value === "pago_movil" ? "block" : "none";
    };
  }

  get nombreCliente(): string { return this.inNombre.value.trim(); }
  get tipoPago(): string { return this.selPago.value; }
  get datosPagoMovil(): DatosPagoMovilForm {
    return {
      cedulaPago: this.inCedula.value.trim(),
      bancoPago: this.inBanco.value.trim(),
      referencia: this.inReferencia.value.trim(),
    };
  }

  onVerCategoria(callback: (cat: string) => void): void {
    this.btnsCat.forEach(btn => {
      btn.onclick = () => callback(btn.dataset["cat"] ?? "");
    });
  }

  onAgregarAlCarrito(callback: (id: number) => void): void {
    this.contenedorProductos.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("[data-agregar]") as HTMLElement | null;
      if (btn) callback(Number(btn.dataset["agregar"]));
    });
  }

  onQuitarDelCarrito(callback: (id: number) => void): void {
    this.tbodyCarrito.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("[data-quitar]") as HTMLElement | null;
      if (btn) callback(Number(btn.dataset["quitar"]));
    });
  }

  onEnviarPedido(callback: () => void): void {
    this.btnEnviar.onclick = callback;
  }

  mostrarProductosCategoria(productos: Cl_mProducto[]): void {
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

  actualizarCarrito(items: ItemCarrito[]): void {
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

  mostrarTotal(total: number): void {
    this.spanTotal.textContent = total.toFixed(2);
  }

  mostrarMensaje(msg: string, tipo: string = ""): void {
    this.toastEl.textContent = msg;
    this.toastEl.style.background = tipo === "warn" ? "#c0392b" : "#333";
    this.toastEl.style.display = "block";
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this.toastEl.style.display = "none"; }, 3000);
  }
}
