export default class Cl_mPedido {
    _id;
    _nombre;
    _tipoPago;
    _productos;
    _datosPagoMovil;
    _procesado;
    _fechaHora;
    _fechaPago;
    constructor({ id, nombre, tipoPago, productos, datosPagoMovil = null, procesado = false, fechaHora, fechaPago = null, }) {
        this._id = id;
        this._nombre = nombre;
        this._tipoPago = tipoPago;
        this._productos = productos;
        this._datosPagoMovil = datosPagoMovil;
        this._procesado = procesado;
        this._fechaHora = fechaHora ?? new Date().toISOString();
        this._fechaPago = fechaPago;
    }
    get id() { return this._id; }
    set id(v) { this._id = v; }
    get nombre() { return this._nombre; }
    set nombre(v) { this._nombre = v; }
    get tipoPago() { return this._tipoPago; }
    set tipoPago(v) { this._tipoPago = v; }
    get productos() { return [...this._productos]; }
    set productos(v) { this._productos = v; }
    get datosPagoMovil() { return this._datosPagoMovil; }
    set datosPagoMovil(v) { this._datosPagoMovil = v; }
    get procesado() { return this._procesado; }
    set procesado(v) { this._procesado = v; }
    get fechaHora() { return this._fechaHora; }
    get fechaPago() { return this._fechaPago; }
    set fechaPago(v) { this._fechaPago = v; }
    calcularTotal() {
        return this._productos.reduce((acc, p) => acc + p.precio, 0);
    }
    toJSON() {
        return {
            id: this._id,
            nombre: this._nombre,
            tipoPago: this._tipoPago,
            productos: this._productos.map(p => p.toJSON()),
            datosPagoMovil: this._datosPagoMovil,
            procesado: this._procesado,
            fechaHora: this._fechaHora,
            fechaPago: this._fechaPago,
            total: this.calcularTotal(),
        };
    }
}
//# sourceMappingURL=Cl_mPedido.js.map