import I_vAdmin from "../interfaces/I_vAdmin.js";
import Cl_mCafetin from "../models/Cl_mCafetin.js";
import Cl_mProducto from "../models/Cl_mProducto.js";
import sProducto from "../services/Cl_sProducto.js";
import sPedido from "../services/Cl_sPedido.js";

export default class Cl_cAdmin {
  private modelo: Cl_mCafetin;
  private vista: I_vAdmin;

  constructor({ modelo, vista }: { modelo: Cl_mCafetin; vista: I_vAdmin }) {
    this.modelo = modelo;
    this.vista = vista;

    this.vista.onCargarProducto(() => this.cargarProducto());
    this.vista.onLimpiar(() => this.vista.limpiarFormulario());
    this.vista.onMarcarProcesado((id) => this.procesarPedido(id));
    this.vista.onEliminarPedido((id) => this.eliminarPedido(id));

    if (typeof this.vista.onEliminarProducto === "function") {
      this.vista.onEliminarProducto((id) => this.eliminarProducto(id));
    }

    if (typeof this.vista.onBuscarProductoAuditoria === "function") {
      this.vista.onBuscarProductoAuditoria((id) => {
        const stats = this.modelo.getStatsProductoPorId(id);
        this.vista.mostrarAuditoriaProducto(id, stats);
      });
    }

    this.cargarDatos();
  }

  private async cargarProducto(): Promise<void> {
    const productosActuales = this.modelo.getProductos();
    const ids = productosActuales.map((p) => p.id || 0);
    const maxProducto = ids.length > 0 ? Math.max(...ids) : 1; // 1 = Porción de pastel
    const nuevoIdProducto = maxProducto + 1;
    const d = this.vista.datosProducto;
    if (!d.nombre || !d.categoria || d.precio <= 0) {
      this.vista.mostrarMensaje("Complete todos los campos", "warn");
      return;
    }
    const producto = new Cl_mProducto({
      id: nuevoIdProducto,
      nombre: d.nombre,
      categoria: d.categoria as any,
      precio: d.precio,
    });

    const res = await sProducto.agregar(producto);
    if (res.ok) {
      this.vista.mostrarMensaje(res.mensaje, "success");
      this.vista.limpiarFormulario();
      await this.cargarDatos();
    } else {
      this.vista.mostrarMensaje(res.mensaje, "error");
    }
  }

  private async procesarPedido(id: number): Promise<void> {
    const res = await sPedido.modificarEstado(id, true);
    if (res.ok) {
      this.vista.mostrarMensaje("Pedido procesado con éxito", "success");
      await this.cargarDatos();
    } else {
      this.vista.mostrarMensaje(res.mensaje, "error");
    }
  }

  private async eliminarPedido(id: number): Promise<void> {
    const res = await sPedido.eliminar(id);
    if (res.ok) {
      this.vista.mostrarMensaje("Pedido eliminado", "success");
      await this.cargarDatos();
    } else {
      this.vista.mostrarMensaje(res.mensaje, "error");
    }
  }

  private async eliminarProducto(id: number): Promise<void> {
    const res = await sProducto.eliminar(id);
    if (res.ok) {
      this.vista.mostrarMensaje("Producto eliminado", "success");
      await this.cargarDatos();
    } else {
      this.vista.mostrarMensaje(res.mensaje, "error");
    }
  }

  private async cargarDatos(): Promise<void> {
    const resProd = await sProducto.getProductos();
    const resPed = await sPedido.getPedidos();

    if (resProd.ok && resProd.tabla) {
      this.modelo.setProductos(resProd.tabla);
      this.vista.mostrarProductosCargados(this.modelo.getProductos());
    }

    if (resPed.ok && resPed.tabla) {
      this.modelo.setPedidos(resPed.tabla);
      this.vista.mostrarPedidos(this.modelo.getPedidos());
    }

    this.actualizarPantalla();
  }

  private actualizarPantalla(): void {
    const datosResumen = {
      ingresos: this.modelo.getIngresosTotales(),
      menorPedido: this.modelo.getPedidoMenor(),
      mayorPedido: this.modelo.getPedidoMayor(),
      clienteEstrella: this.modelo.getClienteEstrella(),
      mejorFuente: this.modelo.getFuenteIngresosPrincipal(),
      masVendido: this.modelo.getProductoMasVendido(),
      totalRecaudado: this.modelo.getMontoTotalRecaudado(),
      busquedaInicial: this.modelo.getStatsProductoPorId(1),
      stats: this.modelo.getEstadisticasProductos(),
      promedio: this.modelo.promedioVentas(),
      porcentaje: this.modelo.porcentajeVentas(),
    };
    this.vista.actualizarResumenPantalla(datosResumen);
  }
}
