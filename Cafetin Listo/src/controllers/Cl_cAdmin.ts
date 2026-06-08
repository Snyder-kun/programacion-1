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
    this.cargarDatos();
  }

  private async cargarProducto(): Promise<void> {
    const d = this.vista.datosProducto;
    if (!d.nombre || !d.categoria || d.precio <= 0) {
      this.vista.mostrarMensaje("Complete todos los campos", "warn");
      return;
    }
    const producto = new Cl_mProducto({
      nombre: d.nombre,
      categoria: d.categoria as any,
      precio: d.precio,
    });
    const resultado = await sProducto.agregar(producto);
    this.vista.mostrarMensaje(resultado.mensaje, resultado.ok ? "" : "warn");
    if (resultado.ok) {
      this.vista.limpiarFormulario();
      await this.cargarDatos();
    }
  }

  private async procesarPedido(id: number): Promise<void> {
    const resultado = await sPedido.modificarEstado(id, true);
    this.vista.mostrarMensaje(resultado.mensaje, resultado.ok ? "" : "warn");
    if (resultado.ok) await this.cargarDatos();
  }

  private async eliminarPedido(id: number): Promise<void> {
    const resultado = await sPedido.eliminar(id);
    this.vista.mostrarMensaje(resultado.mensaje, resultado.ok ? "" : "warn");
    if (resultado.ok) await this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    const productos = await sProducto.getProductos();
    if (!productos.ok) {
      this.vista.mostrarMensaje("Error al cargar productos", "warn");
      return;
    }
    this.modelo.setProductos(productos.tabla);
    this.vista.mostrarProductosCargados(productos.tabla);

    const pedidos = await sPedido.getPedidos();
    if (!pedidos.ok) {
      this.vista.mostrarMensaje("Error al cargar pedidos", "warn");
      return;
    }
    this.modelo.setPedidos(pedidos.tabla);
    this.vista.mostrarPedidos(pedidos.tabla);
  }
}