import Cl_mProducto from "../models/Cl_mProducto.js";
import Cl_mPedido from "../models/Cl_mPedido.js";
import sProducto from "../services/Cl_sProducto.js";
import sPedido from "../services/Cl_sPedido.js";
export default class Cl_cCliente {
    modelo;
    vista;
    carrito = [];
    productosCargados = false;
    cargarProductosPromesa = null;
    constructor({ modelo, vista }) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.onVerCategoria((cat) => this.mostrarCategoria(cat));
        this.vista.onAgregarAlCarrito((id) => this.agregarAlCarrito(id));
        this.vista.onQuitarDelCarrito((id) => this.quitarDelCarrito(id));
        this.vista.onEnviarPedido(() => this.enviarPedido());
        this.cargarProductosPromesa = this.cargarProductos();
        this.cargarProductosPromesa.then(() => this.mostrarCategoria("pasteles"));
    }
    async cargarProductos() {
        const precargados = [
            new Cl_mProducto({
                id: 67,
                nombre: "Agua",
                categoria: "bebidas",
                precio: 1.0,
            }),
        ];
        try {
            const resultado = await sProducto.getProductos();
            let productosFinales = [...precargados];
            if (resultado.ok &&
                Array.isArray(resultado.tabla) &&
                resultado.tabla.length > 0) {
                const desdeServidor = resultado.tabla
                    .filter((p) => p && p.nombre && p.categoria)
                    .map((p) => new Cl_mProducto({
                    id: Number(p.id),
                    nombre: p.nombre,
                    categoria: (p.categoria || "comidas")
                        .toLowerCase()
                        .trim(),
                    precio: isNaN(parseFloat(p.precio)) ? 0 : parseFloat(p.precio),
                }));
                if (desdeServidor.length > 0) {
                    const idsServidor = new Set(desdeServidor.map((p) => p.id));
                    const nombresServidor = new Set(desdeServidor.map((p) => p.nombre.toLowerCase()));
                    const precargadosSinDuplicar = precargados.filter((p) => !idsServidor.has(p.id) &&
                        !nombresServidor.has(p.nombre.toLowerCase()));
                    productosFinales = [...precargadosSinDuplicar, ...desdeServidor];
                }
            }
            this.modelo.setProductos(productosFinales);
        }
        catch (error) {
            this.vista.mostrarMensaje("Error al conectar con el servidor. Usando catálogo local.", "warn");
            this.modelo.setProductos(precargados);
        }
        finally {
            this.productosCargados = true;
        }
    }
    async mostrarCategoria(cat) {
        if (this.cargarProductosPromesa) {
            await this.cargarProductosPromesa;
        }
        const categoriaBuscada = (cat || "").toLowerCase().trim();
        const prods = this.modelo.getProductos().filter((p) => {
            const pCat = (p.categoria || "").toLowerCase().trim();
            return pCat.includes(categoriaBuscada) || categoriaBuscada.includes(pCat);
        });
        if (!prods.length) {
            this.vista.mostrarMensaje(`No hay productos en "${cat}"`, "warn");
        }
        this.vista.mostrarProductosCategoria(prods);
    }
    agregarAlCarrito(id) {
        const prod = this.modelo
            .getProductos()
            .find((p) => String(p.id) === String(id));
        if (!prod)
            return;
        const existente = this.carrito.find((i) => String(i.id) === String(id));
        if (existente)
            existente.cantidad++;
        else
            this.carrito.push({
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                cantidad: 1,
            });
        this.actualizarVista();
    }
    quitarDelCarrito(id) {
        const idx = this.carrito.findIndex((i) => String(i.id) === String(id));
        if (idx === -1)
            return;
        if (this.carrito[idx].cantidad > 1)
            this.carrito[idx].cantidad--;
        else
            this.carrito.splice(idx, 1);
        this.actualizarVista();
    }
    actualizarVista() {
        this.vista.actualizarCarrito([...this.carrito]);
        const total = this.carrito.reduce((acc, i) => acc + (Number(i.precio) || 0) * i.cantidad, 0);
        this.vista.mostrarTotal(total);
    }
    async enviarPedido() {
        if (!this.carrito.length) {
            this.vista.mostrarMensaje("Carrito vacío", "warn");
            return;
        }
        const nombre = this.vista.nombreCliente;
        if (!nombre) {
            this.vista.mostrarMensaje("Ingrese su nombre", "warn");
            return;
        }
        const tipoPago = this.vista.tipoPago;
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
        const productosPedido = this.carrito.flatMap((i) => {
            const prod = this.modelo
                .getProductos()
                .find((p) => String(p.id) === String(i.id));
            if (!prod)
                return [];
            return Array.from({ length: i.cantidad }, () => new Cl_mProducto({
                id: prod.id,
                nombre: prod.nombre,
                categoria: prod.categoria,
                precio: prod.precio,
            }));
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
//# sourceMappingURL=Cl_cCliente.js.map