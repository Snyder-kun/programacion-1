import I_vCliente, { ItemCarrito } from "../interfaces/I_vCliente.js";
import Cl_mCafetin from "../models/Cl_mCafetin.js";
import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_mPedido from "../models/Cl_mPedido.js";
import sProducto from "../services/Cl_sProducto.js";
import sPedido from "../services/Cl_sPedido.js";

export default class Cl_cCliente {
  private modelo: Cl_mCafetin;
  private vista: I_vCliente;
  private carrito: ItemCarrito[] = [];
  private productosCargados = false;
  private cargarProductosPromesa: Promise<void> | null = null;

  constructor({ modelo, vista }: { modelo: Cl_mCafetin; vista: I_vCliente }) {
    this.modelo = modelo;
    this.vista = vista;
    this.vista.onVerCategoria((cat) => this.mostrarCategoria(cat));
    this.vista.onAgregarAlCarrito((id) => this.agregarAlCarrito(id));
    this.vista.onQuitarDelCarrito((id) => this.quitarDelCarrito(id));
    this.vista.onEnviarPedido(() => this.enviarPedido());
    this.cargarProductosPromesa = this.cargarProductos();
  }

  private async cargarProductos(): Promise<void> {
    const resultado = await sProducto.getProductos();
    const productosValidos = resultado.ok && resultado.tabla.length > 0 && resultado.tabla.every((p) => {
      return p.id !== undefined && !!p.nombre && !!p.categoria && p.precio !== undefined;
    });

    if (!productosValidos) {
      this.vista.mostrarMensaje(
        "No se pudieron cargar productos del servidor. Se usa catálogo local de ejemplo.",
        "warn"
      );
      this.modelo.setProductos([
        new Cl_mProducto({ id: 1, nombre: "Porción de pastel", categoria: "pasteles", precio: 15.0 }),
        new Cl_mProducto({ id: 2, nombre: "Tarta de queso", categoria: "pasteles", precio: 18.5 }),
        new Cl_mProducto({ id: 3, nombre: "Café espresso", categoria: "bebidas", precio: 4.0 }),
        new Cl_mProducto({ id: 4, nombre: "Jugo natural", categoria: "bebidas", precio: 5.5 }),
        new Cl_mProducto({ id: 5, nombre: "Chips salados", categoria: "snacks", precio: 3.5 }),
        new Cl_mProducto({ id: 6, nombre: "Galletas", categoria: "snacks", precio: 2.75 }),
        new Cl_mProducto({ id: 7, nombre: "Empanada", categoria: "comidas", precio: 7.8 }),
        new Cl_mProducto({ id: 8, nombre: "Sándwich", categoria: "comidas", precio: 9.2 }),
      ]);
      this.productosCargados = true;
      return;
    }

    this.modelo.setProductos(resultado.tabla);
    this.productosCargados = true;
  }

  private async mostrarCategoria(cat: string): Promise<void> {
    if (this.cargarProductosPromesa) {
      await this.cargarProductosPromesa;
    }
    const prods = this.modelo.getProductosPorCategoria(cat);
    if (!prods.length) {
      this.vista.mostrarMensaje(`No hay productos en "${cat}"`, "warn");
    }
    this.vista.mostrarProductosCategoria(prods);
  }

  private agregarAlCarrito(id: number): void {
    const prod = this.modelo.getProductos().find(p => p.id === id);
    if (!prod) return;
    const existente = this.carrito.find(i => i.id === id);
    if (existente) existente.cantidad++;
    else this.carrito.push({ id: prod.id!, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
    this.actualizarVista();
  }

  private quitarDelCarrito(id: number): void {
    const idx = this.carrito.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (this.carrito[idx].cantidad > 1) this.carrito[idx].cantidad--;
    else this.carrito.splice(idx, 1);
    this.actualizarVista();
  }

  private actualizarVista(): void {
    this.vista.actualizarCarrito([...this.carrito]);
    const total = this.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    this.vista.mostrarTotal(total);
  }

  private async enviarPedido(): Promise<void> {
    if (!this.carrito.length) {
      this.vista.mostrarMensaje("Carrito vacío", "warn");
      return;
    }
    const nombre = this.vista.nombreCliente;
    if (!nombre) {
      this.vista.mostrarMensaje("Ingrese su nombre", "warn");
      return;
    }
    const tipoPago = this.vista.tipoPago as any;
    if (!tipoPago) {
      this.vista.mostrarMensaje("Seleccione forma de pago", "warn");
      return;
    }
    let datosPagoMovil = null;
    if (tipoPago === "pago_movil") {
      const pm = this.vista.datosPagoMovil;
      if (!pm.cedulaPago || !pm.bancoPago || !pm.referencia) {
        this.vista.mostrarMensaje("Complete datos de pago móvil", "warn");
        return;
      }
      datosPagoMovil = pm;
    }
    const productosPedido: Cl_mProducto[] = this.carrito.map(i => {
      const prod = this.modelo.getProductos().find(p => p.id === i.id)!;
      return new Cl_mProducto({
        id: i.id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio: prod.precio,
      });
    });
    const pedido = new Cl_mPedido({
      nombre,
      tipoPago,
      productos: productosPedido,
      datosPagoMovil,
      fechaHora: new Date().toISOString(),
    });
    const resultado = await sPedido.agregar(pedido);
    this.vista.mostrarMensaje(resultado.mensaje, resultado.ok ? "" : "warn");
    if (resultado.ok) {
      this.carrito = [];
      this.actualizarVista();
    }
  }
}