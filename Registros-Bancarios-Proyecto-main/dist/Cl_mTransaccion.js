export default class Cl_mTransaccion {
    _fecha = "";
    _descripcion = "";
    _monto = 0;
    _referencia = "";
    _tipoTransaccion = 0;
    _categoria = 0;
    constructor({ fecha = "", descripcion = "", monto = 0, referencia = "", tipoTransaccion = 0, categoria = 0 }) {
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.monto = monto;
        this.referencia = referencia;
        this.tipoTransaccion = tipoTransaccion;
        this.categoria = categoria;
    }
    set fecha(f) {
        this._fecha = f;
    }
    get fecha() {
        return this._fecha;
    }
    set descripcion(d) {
        this._descripcion = d;
    }
    get descripcion() {
        return this._descripcion;
    }
    set monto(m) {
        this._monto = +m;
    }
    get monto() {
        return this._monto;
    }
    set referencia(r) {
        this._referencia = r;
    }
    get referencia() {
        return this._referencia;
    }
    set tipoTransaccion(t) {
        this._tipoTransaccion = +t;
    }
    get tipoTransaccion() {
        return this._tipoTransaccion;
    }
    set categoria(c) {
        this._categoria = +c;
    }
    get categoria() {
        return this._categoria;
    }
    montoCargo() {
        if (this.tipoTransaccion === 1)
            return this.monto;
        else
            return 0;
    }
    montoAbono() {
        if (this.tipoTransaccion === 2)
            return this.monto;
        else
            return 0;
    }
    categoriaTexto() {
        switch (this.categoria) {
            case 1:
                return "Ingreso";
                break;
            case 2:
                return "Alimentación";
                break;
            case 3:
                return "Servicios Basicos";
                break;
            case 4:
                return "Artículos de Vestimenta";
                break;
            case 5:
                return "Servicios Publicos";
                break;
            case 6:
                return "Entretenimiento";
                break;
            case 7:
                return "Educación";
                break;
            case 8:
                return "Gasto del Hogar";
                break;
            default:
                return "Otros";
        }
    }
    toJSON() {
        return {
            descripcion: this.descripcion,
            monto: this.monto,
            referencia: this.referencia,
            categoria: this.categoria,
            fecha: this.fecha,
            tipoTransaccion: this.tipoTransaccion
        };
    }
}
