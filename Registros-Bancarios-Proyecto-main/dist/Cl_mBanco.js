import Cl_mTransaccion from "./Cl_mTransaccion.js";
export default class Cl_mBanco {
    transacciones = [];
    STORAGE_KEY = "Movimientos_Bancarios_data";
    constructor() {
        this.cargar();
        this.emitirTotales(); //new
    }
    cargar() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            try {
                const json = JSON.parse(data);
                this.transacciones = json.map((registro) => new Cl_mTransaccion(registro));
            }
            catch (error) {
                console.error("Error al cargar data del almacenamiento local:", error);
                this.transacciones = [];
            }
        }
    }
    guardar() {
        const data = this.transacciones.map(registro2 => registro2.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    procesarTransaccion(data) {
        let existe = this.transacciones.find(a => a.referencia === data.referencia);
        if (existe) {
            if (data.referencia !== undefined)
                existe.referencia = data.referencia;
            if (data.fecha !== undefined)
                existe.fecha = data.fecha;
            if (data.descripcion !== undefined)
                existe.descripcion = data.descripcion;
            if (data.monto !== undefined)
                existe.monto = data.monto;
            if (data.tipoTransaccion !== undefined)
                existe.tipoTransaccion = data.tipoTransaccion;
            if (data.categoria !== undefined)
                existe.categoria = data.categoria;
        }
        else {
            this.transacciones.push(new Cl_mTransaccion(data));
        }
        this.guardar();
        this.emitirTotales(); //new
        return true;
    }
    deleteTransaccion(referencia) {
        let index = this.transacciones.findIndex(registro3 => registro3.referencia === referencia);
        if (index !== -1) {
            this.transacciones.splice(index, 1);
            this.guardar();
            this.emitirTotales(); //new
            return true;
        }
        return false;
    }
    getTransaccion(referencia) {
        return this.transacciones.find(registro4 => registro4.referencia === referencia);
    }
    get dtTransacciones() {
        return this.transacciones;
    }
    //Metodos
    calcularTotales(saldoInicial = 5000.00) {
        //Resumen
        let totalCargos = 0;
        let totalAbonos = 0;
        // porcentajes
        let conTransacciones = 0, contCargos = 0, contAbonos = 0;
        for (const t of this.transacciones) {
            conTransacciones++;
            const monto = Number(t.monto) || 0;
            if (Number(t.tipoTransaccion) === 1) {
                totalCargos -= monto;
                contCargos++;
            }
            ;
            if (Number(t.tipoTransaccion) === 2) {
                totalAbonos += monto;
                contAbonos++;
            }
            ;
        }
        return { totalCargos, totalAbonos, saldoFinal: saldoInicial + totalAbonos + totalCargos, porcentajeCargos: contCargos / conTransacciones * 100, porcentajeAbonos: contAbonos / conTransacciones * 100 };
    }
    formatearMonto(n) { return Number(n).toFixed(2); } //new
    eventTarget = new EventTarget(); //new
    onTotalesActualizados(cb) {
        this.eventTarget.addEventListener('totalesActualizados', (ev) => cb(ev.detail));
    }
    emitirTotales() {
        const tot = this.calcularTotales();
        this.eventTarget.dispatchEvent(new CustomEvent('totalesActualizados', { detail: tot })); //IGNORAR
    }
}
