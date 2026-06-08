import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_sProyecto from "./Cl_sProyecto.js";
export default class Cl_sPedido extends Cl_sProyecto {
    static localStorageKey = "cafetin_pedidos";
    static obtenerPedidosLocal() {
        try {
            const raw = localStorage.getItem(this.localStorageKey) ?? "[]";
            return JSON.parse(raw);
        }
        catch {
            return [];
        }
    }
    static guardarPedidosLocal(pedidos) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(pedidos));
    }
    static guardarPedidoLocal(pedido) {
        const pedidos = this.obtenerPedidosLocal();
        const maxId = pedidos.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
        const nuevo = { ...pedido, id: maxId + 1, fechaHora: pedido.fechaHora ?? new Date().toISOString() };
        pedidos.push(nuevo);
        this.guardarPedidosLocal(pedidos);
        return { ok: true, mensaje: `Pedido guardado localmente con ID: ${nuevo.id}` };
    }
    static async agregar(pedido) {
        if (!pedido.nombre)
            return { ok: false, mensaje: "Nombre del cliente es obligatorio" };
        if (!pedido.tipoPago)
            return { ok: false, mensaje: "Forma de pago es obligatoria" };
        if (pedido.productos.length === 0)
            return { ok: false, mensaje: "Debe incluir al menos un producto" };
        if (pedido.tipoPago === "pago_movil" && (!pedido.datosPagoMovil?.cedulaPago || !pedido.datosPagoMovil?.bancoPago || !pedido.datosPagoMovil?.referencia)) {
            return { ok: false, mensaje: "Complete los datos de Pago Móvil" };
        }
        const respuesta = await super.agregar(pedido.toJSON());
        if (respuesta.ok)
            return respuesta;
        return this.guardarPedidoLocal(pedido.toJSON());
    }
    static async getPedidos() {
        const respuesta = await super.getTabla();
        let datos = [];
        if (!respuesta.ok) {
            datos = this.obtenerPedidosLocal();
        }
        else {
            // Si MockAPI devuelve el arreglo directo, usamos respuesta. De lo contrario, respuesta.tabla
            datos = Array.isArray(respuesta) ? respuesta : (respuesta.tabla || []);
        }
        // Filtrar solo los registros que sean pedidos (tienen tipoPago y productos)
        const solopedidos = datos.filter((d) => d.tipoPago && Array.isArray(d.productos));
        const pedidos = solopedidos.map((d) => this.mapearPedido(d));
        return { ok: true, tabla: pedidos };
    }
    static mapearPedido(d) {
        // Mapear productos si existen
        const productosMappeados = (d.productos || []).map((p) => {
            return new Cl_mProducto({
                id: p.id,
                nombre: p.nombre,
                categoria: p.categoria,
                precio: typeof p.precio === "string" ? parseFloat(p.precio) : (p.precio || 0),
            });
        });
        // Crear el pedido con los productos mapeados
        return new Cl_mPedido({
            id: d.id,
            nombre: d.nombre,
            tipoPago: d.tipoPago,
            productos: productosMappeados,
            datosPagoMovil: d.datosPagoMovil,
            procesado: d.procesado,
            fechaHora: d.fechaHora,
            fechaPago: d.fechaPago,
        });
    }
    static async modificarEstado(id, procesado) {
        // Obtener el pedido completo antes de modificar
        const pedidosResponse = await this.getPedidos();
        const pedidoExistente = pedidosResponse.tabla.find(p => Number(p.id) === id);
        if (!pedidoExistente)
            return { ok: false, mensaje: "Pedido no encontrado" };
        const pedidoActualizado = pedidoExistente.toJSON();
        pedidoActualizado.procesado = procesado;
        pedidoActualizado.fechaPago = procesado ? new Date().toISOString() : null;
        const existeRemoto = await super.existeId(id);
        if (!existeRemoto.ok || !existeRemoto.existe) {
            const pedidosLocal = this.obtenerPedidosLocal();
            const indexLocal = pedidosLocal.findIndex(p => Number(p.id) === id);
            if (indexLocal === -1) {
                return existeRemoto.ok ? { ok: false, mensaje: "Pedido no encontrado" } : { ok: false, mensaje: "Error de conexión" };
            }
            pedidosLocal[indexLocal] = { ...pedidosLocal[indexLocal], ...pedidoActualizado };
            this.guardarPedidosLocal(pedidosLocal);
            return { ok: true, mensaje: "Pedido procesado localmente" };
        }
        return super.modificar(id, pedidoActualizado);
    }
    static async eliminar(id) {
        const existeRemoto = await super.existeId(id);
        if (existeRemoto.ok && existeRemoto.existe) {
            return super.eliminar(id);
        }
        const pedidosLocal = this.obtenerPedidosLocal();
        const indexLocal = pedidosLocal.findIndex(p => Number(p.id) === id);
        if (indexLocal === -1) {
            return existeRemoto.ok ? { ok: false, mensaje: "Pedido no encontrado" } : { ok: false, mensaje: "Error de conexión" };
        }
        pedidosLocal.splice(indexLocal, 1);
        this.guardarPedidosLocal(pedidosLocal);
        return { ok: true, mensaje: "Pedido eliminado localmente" };
    }
}
//# sourceMappingURL=Cl_sPedido.js.map