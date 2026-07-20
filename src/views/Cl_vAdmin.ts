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
  private txtIdBuscar: HTMLInputElement;
  private lblMasVendido: HTMLElement;
  private lblTotalRecaudado: HTMLElement;
  private lblBusquedaResultados: HTMLElement;
  private adminResumen: HTMLElement;
  private statsProductos: HTMLElement;

  constructor() {
    this.inNombre = document.getElementById("inNombre") as HTMLInputElement;
    this.inCategoria = document.getElementById(
      "inCategoria",
    ) as HTMLSelectElement;
    this.inPrecio = document.getElementById("inPrecio") as HTMLInputElement;
    this.btnCargar = document.getElementById("btnCargar") as HTMLButtonElement;
    this.btnLimpiar = document.getElementById(
      "btnLimpiar",
    ) as HTMLButtonElement;
    this.tbodyPedidos = document.getElementById(
      "tbodyPedidos",
    ) as HTMLTableSectionElement;
    this.listaProductos = document.getElementById(
      "listaProductos",
    ) as HTMLElement;
    this.toastEl = document.getElementById("toast") as HTMLElement;
    this.txtIdBuscar = document.getElementById(
      "txtIdBuscar",
    ) as HTMLInputElement;
    this.lblMasVendido = document.getElementById(
      "lblMasVendido",
    ) as HTMLElement;
    this.lblTotalRecaudado = document.getElementById(
      "lblTotalRecaudado",
    ) as HTMLElement;
    this.lblBusquedaResultados = document.getElementById(
      "lblBusquedaResultados",
    ) as HTMLElement;
    this.adminResumen = document.getElementById("adminResumen") as HTMLElement;
    this.statsProductos = document.getElementById(
      "statsProductos",
    ) as HTMLElement;
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

  onEliminarProducto(callback: (id: number) => void): void {
    this.listaProductos.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-eliminar-prod]") as HTMLElement | null;
      if (btn) {
        callback(Number(btn.dataset.eliminarProd));
      }
    });
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

  onBuscarProductoAuditoria(callback: (id: number) => void): void {
    if (this.txtIdBuscar) {
      this.txtIdBuscar.addEventListener("input", () => {
        const id = Number(this.txtIdBuscar.value) || 1;
        callback(id);
      });
    }
  }

  mostrarPedidos(pedidos: Cl_mPedido[]): void {
    if (!pedidos.length) {
      this.tbodyPedidos.innerHTML =
        '<tr><td colspan="7">Sin pedidos registrados</td></tr>';
      return;
    }
    this.tbodyPedidos.innerHTML = pedidos
      .map(
        (p) => `
      <tr>
        <td>#${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.tipoPago}</td>
        <td>${p.productos.map((pr) => `${pr.nombre} ($${pr.precio})`).join(", ")}</td>
        <td>$${p.calcularTotal().toFixed(2)}</td>
        <td>${p.fechaPago ? new Date(p.fechaPago).toLocaleString("es-ES") : "-"}</td>
        <td>
          ${!p.procesado ? `<button data-procesar="${p.id}">✓ Procesar</button>` : "Procesado"}
          <button data-eliminar="${p.id}">✗ Eliminar</button>
         </td>
      </tr>
    `,
      )
      .join("");
  }

  mostrarProductosCargados(productos: Cl_mProducto[]): void {
    if (!productos.length) {
      this.listaProductos.innerHTML = "<p>Aún no hay productos.</p>";
      return;
    }
    this.listaProductos.innerHTML = productos
      .map(
        (p) => `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 5px; border-bottom: 1px solid #eee;">
        <span>#${p.id} - ${p.nombre} (${p.categoria}) - $${p.precio.toFixed(2)}</span>
        <button data-eliminar-prod="${p.id}" style="color: #c0392b; border: 1px solid #c0392b; background: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Eliminar</button>
      </div>
    `,
      )
      .join("");
  }

  limpiarFormulario(): void {
    this.inNombre.value = "";
    this.inCategoria.value = "";
    this.inPrecio.value = "";
    this.inNombre.focus();
  }

  mostrarMensaje(msg: string, tipo: string = ""): void {
    this.toastEl.textContent = msg;
    const colores: Record<string, string> = {
      warn: "#c0392b",
      error: "#c0392b",
      success: "#27ae60",
    };
    this.toastEl.style.background = colores[tipo] ?? "#333";
    this.toastEl.style.display = "block";
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toastEl.style.display = "none";
    }, 3000);
  }

  mostrarAuditoriaProducto(id: number, stats: any): void {
    if (this.lblBusquedaResultados) {
      this.lblBusquedaResultados.innerHTML = `Producto ID <strong>#${id}</strong> -> Unidades vendidas: <strong>${stats.ventas}</strong> | Total acumulado: <strong>$${stats.ingreso.toFixed(2)}</strong>`;
    }
  }

  actualizarResumenPantalla(datos: any): void {
    if (this.lblMasVendido) {
      this.lblMasVendido.innerText = `${datos.masVendido.nombre} (${datos.masVendido.unidades} unds. — Total Recaudado: $${datos.masVendido.ingresoTotal.toFixed(2)})`;
    }
    if (this.lblTotalRecaudado) {
      this.lblTotalRecaudado.innerText = `$${datos.totalRecaudado.toFixed(2)}`;
    }

    this.mostrarAuditoriaProducto(1, datos.busquedaInicial);

    if (this.adminResumen) {
      this.adminResumen.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border: 1px solid #c8e6c9;">
            <p style="margin: 5px 0;">💰 <strong>Ingresos Totales:</strong> $${datos.ingresos.toFixed(2)}</p>
            <p style="margin: 5px 0;">🏆 <strong>Cliente Estrella:</strong> ${datos.clienteEstrella}</p>
            <p style="margin: 5px 0;">🏧 <strong>Fuente Principal:</strong> ${datos.mejorFuente}</p>
          </div>
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border: 1px solid #ffe0b2;">
            <p style="margin: 5px 0;">📉 <strong>Pedido Menor:</strong> $${datos.menorPedido.toFixed(2)}</p>
            <p style="margin: 5px 0;">📈 <strong>Pedido Mayor:</strong> $${datos.mayorPedido.toFixed(2)}</p>
            <!-- Aquí agregamos los dos nuevos cálculos -->
            <p style="margin: 5px 0;">📊 <strong>Promedio por Pedido:</strong> $${datos.promedio.toFixed(2)}</p>
            <p style="margin: 5px 0;">✅ <strong>Pedidos Procesados:</strong> ${datos.porcentaje}</p>
          </div>
        </div>
      `;
    }
    if (this.statsProductos) {
      if (datos.stats.length === 0) {
        this.statsProductos.innerHTML =
          "<p>No hay pedidos procesados para generar estadísticas.</p>";
      } else {
        let html = '<ul style="list-style: none; padding: 0;">';
        datos.stats.forEach((s: any) => {
          html += `
            <li style="margin-bottom: 8px; padding: 10px; background: #fcfcfc; border: 1px solid #eee; border-radius: 6px;">
              🎯 <strong>${s.nombre}</strong>: ${s.cantidad} unidades vendidas (${s.porcentaje} del total de ítems pedidos)
            </li>`;
        });
        html += "</ul>";
        this.statsProductos.innerHTML = html;
      }
    }
  }
}
