import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_mProducto from "../models/Cl_mProducto.js";

export interface DatosProductoForm {
  nombre: string;
  categoria: string;
  precio: number;
}

export default interface I_vAdmin {
  datosProducto: DatosProductoForm;
  onCargarProducto(callback: () => void): void;
  onLimpiar(callback: () => void): void;
  onMarcarProcesado(callback: (id: number) => void): void;
  onEliminarPedido(callback: (id: number) => void): void;
  mostrarPedidos(pedidos: Cl_mPedido[]): void;
  mostrarProductosCargados(productos: Cl_mProducto[]): void;
  limpiarFormulario(): void;
  mostrarMensaje(msg: string, tipo?: string): void;
}
