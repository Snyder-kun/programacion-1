export default class Cl_controlador {
    mBanco;
    vBanco;
    vTransaccion;
    vEditTransaccion;
    vDetailsTransaccion; //new
    constructor(modelo, vBanco, vTransaccion, vEditTransaccion, vDetailsTransaccion //new
    ) {
        this.mBanco = modelo;
        this.vBanco = vBanco;
        this.vTransaccion = vTransaccion;
        this.vEditTransaccion = vEditTransaccion;
        this.vDetailsTransaccion = vDetailsTransaccion; //new
    }
    procesarTransaccion(data) {
        this.mBanco.procesarTransaccion(data);
        this.mostrarVista("transacciones");
    }
    deleteTrans(referencia) {
        if (confirm(`¿Está seguro de eliminar la transaccion ${referencia}?`)) {
            this.mBanco.deleteTransaccion(referencia);
            this.vBanco.refreshTable();
        }
    }
    vDetails(referencia) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vDetailsTransaccion) {
            this.vDetailsTransaccion.cargarDatos(trans); //new
            this.mostrarVista("details"); //new
        }
    } //new
    vEdit(referencia) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vEditTransaccion) {
            this.vEditTransaccion.cargarDatos(trans.toJSON());
            this.mostrarVista("editTransaccion");
        }
    }
    mostrarVista(vista) {
        this.vBanco.ocultar();
        this.vTransaccion.ocultar();
        this.vEditTransaccion.ocultar();
        this.vDetailsTransaccion.ocultar(); //new
        if (vista === "transacciones") {
            this.vBanco.mostrar();
            this.vBanco.refreshTable(); // Refrescar para ver nuevos totales
        }
        else if (vista === "registro") {
            this.vTransaccion.mostrar();
        }
        else if (vista === "editTransaccion") {
            this.vEditTransaccion.mostrar();
        }
        else if (vista === "details") { //new
            this.vDetailsTransaccion.mostrar(); //new
        }
    }
    get dtTransacciones() {
        return this.mBanco.dtTransacciones;
    }
    get dtBanco() {
        return this.mBanco;
    }
}
