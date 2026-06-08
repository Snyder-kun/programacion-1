import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_sProyecto from "./Cl_sProyecto.js";
export default class Cl_sProducto extends Cl_sProyecto {
    static async existe(id) {
        return super.existeId(id);
    }
    static async agregar(producto) {
        if (!producto.nombre)
            return { ok: false, mensaje: "Nombre es obligatorio" };
        if (!producto.categoria)
            return { ok: false, mensaje: "Categoría es obligatoria" };
        if (producto.precio <= 0)
            return { ok: false, mensaje: "Precio debe ser mayor a 0" };
        return super.agregar(producto.toJSON());
    }
    static async getProductos() {
        const respuesta = await super.getTabla();
        if (!respuesta.ok)
            return { ok: false, tabla: [] };
        let datos = respuesta.tabla || [];
        // Filtrar solo los registros que sean productos (tienen categoria y NO tienen tipoPago)
        const soloProductos = datos.filter((d) => d.categoria && d.precio !== undefined && !d.tipoPago);
        const productos = soloProductos.map((d) => {
            if (d && typeof d === 'object') {
                d.precio = typeof d.precio === 'string' ? parseFloat(d.precio) : Number(d.precio) || 0;
            }
            return new Cl_mProducto(d);
        });
        return { ok: true, tabla: productos };
    }
    static async eliminar(id) {
        return super.eliminar(id);
    }
}
//# sourceMappingURL=Cl_sProducto.js.map