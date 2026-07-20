import Cl_mProducto from "../models/Cl_mProducto.js";

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface DatosPagoMovilForm {
  cedulaPago: string;
  bancoPago: string;
  referencia: string;
}

export default interface I_vCliente {
  nombreCliente: string;
  tipoPago: string;
  datosPagoMovil: DatosPagoMovilForm;
  onVerCategoria(callback: (cat: string) => void): void;
  onAgregarAlCarrito(callback: (id: number) => void): void;
  onQuitarDelCarrito(callback: (id: number) => void): void;
  onEnviarPedido(callback: () => void): void;
  mostrarProductosCategoria(productos: Cl_mProducto[]): void;
  actualizarCarrito(items: ItemCarrito[]): void;
  mostrarTotal(total: number): void;
  mostrarMensaje(msg: string, tipo?: string): void;
}