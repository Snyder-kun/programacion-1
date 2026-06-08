import Cl_mProducto from "./Cl_mProducto.js";
import Cl_mPedido from "./Cl_mPedido.js";

export default class Cl_mCafetin {
  private _productos: Cl_mProducto[] = [];
  private _pedidos: Cl_mPedido[] = [];

  setProductos(productos: Cl_mProducto[]): void {
    this._productos = [...productos];
  }

  getProductos(): Cl_mProducto[] {
    return [...this._productos];
  }

  getProductosPorCategoria(categoria: string): Cl_mProducto[] {
    const valor = categoria.trim().toLowerCase();
    return this._productos.filter(p => (p.categoria ?? "").toString().toLowerCase() === valor);
  }

  setPedidos(pedidos: Cl_mPedido[]): void {
    this._pedidos = [...pedidos];
  }

  getPedidos(): Cl_mPedido[] {
    return [...this._pedidos];
  }

  getPedidosNoProcesados(): Cl_mPedido[] {
    return this._pedidos.filter(p => !p.procesado);
  }
}