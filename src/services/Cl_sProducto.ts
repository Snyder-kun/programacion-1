import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_sProyecto from "./Cl_sProyecto.js";

export default class Cl_sProducto extends Cl_sProyecto {
  protected static override apiUrl ="https://6a5d1df80ad09982aef6e908.mockapi.io/cafetin_productos";

  static async existe(id: number): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId(id);
  }

  static async agregar(producto: Cl_mProducto): Promise<{ ok: boolean; mensaje: string }> {
    if (!producto.nombre) return { ok: false, mensaje: "Nombre es obligatorio" };
    if (!producto.categoria) return { ok: false, mensaje: "Categoría es obligatoria" };
    if (producto.precio <= 0) return { ok: false, mensaje: "Precio debe ser mayor a 0" };
    return super.agregar(producto.toJSON());
  }

  static async getProductos(): Promise<{ ok: boolean; tabla: Cl_mProducto[] }> {
    const respuesta = await super.getTabla();
    if (!respuesta.ok) return { ok: false, tabla: [] };
    
    let datos = respuesta.tabla || [];
    const soloProductos = datos.filter((d: any) => d.categoria && d.precio !== undefined && !d.tipoPago);
    
    const productos = soloProductos.map((d: any) => {
      if (d && typeof d === 'object') {
        d.precio = typeof d.precio === 'string' ? parseFloat(d.precio) : Number(d.precio) || 0;
      }
      return new Cl_mProducto(d);
    });
    return { ok: true, tabla: productos };
  }

  static async eliminar(id: number): Promise<{ ok: boolean; mensaje: string }> {
    return super.eliminar(id);
  }
}