import Cl_mBanco from "./Cl_mBanco.js";
import Cl_vBanco from "./Cl_vBanco.js";
import Cl_vTransaccion from "./Cl_vTransaccion.js";
import Cl_vEditTransaccion from "./Cl_vEditTransaccion.js";
import Cl_vDetailsTransaccion from "./Cl_vDetailsTransaccion.js"; //new
import { iTransaccion } from "./Cl_mTransaccion.js";

export default class Cl_controlador {
    private mBanco: Cl_mBanco;
    private vBanco: Cl_vBanco;
    private vTransaccion: Cl_vTransaccion;
    private vEditTransaccion: Cl_vEditTransaccion;
    private vDetailsTransaccion: Cl_vDetailsTransaccion; //new

    constructor(
        modelo: Cl_mBanco, 
        vBanco: Cl_vBanco, 
        vTransaccion: Cl_vTransaccion,
        vEditTransaccion: Cl_vEditTransaccion,
        vDetailsTransaccion: Cl_vDetailsTransaccion //new
    ) {
        this.mBanco = modelo;
        this.vBanco = vBanco;
        this.vTransaccion = vTransaccion;
        this.vEditTransaccion = vEditTransaccion;
        this.vDetailsTransaccion = vDetailsTransaccion; //new
    }

    public procesarTransaccion(data: iTransaccion) {
        this.mBanco.procesarTransaccion(data);
        this.mostrarVista("transacciones");
    }

    public deleteTrans(referencia: string) {
        if (confirm(`¿Está seguro de eliminar la transaccion ${referencia}?`)) {
            this.mBanco.deleteTransaccion(referencia);
            this.vBanco.refreshTable();
        }
    }

    public vDetails(referencia: string) { //new
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vDetailsTransaccion) {
            this.vDetailsTransaccion.cargarDatos(trans); //new
            this.mostrarVista("details"); //new
        }
    } //new

    public vEdit(referencia: string) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vEditTransaccion) {
            this.vEditTransaccion.cargarDatos(trans.toJSON());
            this.mostrarVista("editTransaccion");
        }
    }
    
    public mostrarVista(vista: string) {
        this.vBanco.ocultar();
        this.vTransaccion.ocultar();
        this.vEditTransaccion.ocultar();
        this.vDetailsTransaccion.ocultar(); //new

        if (vista === "transacciones") {
            this.vBanco.mostrar();
            this.vBanco.refreshTable(); // Refrescar para ver nuevos totales
        } else if (vista === "registro") {
            this.vTransaccion.mostrar();
        } else if (vista === "editTransaccion") {
            this.vEditTransaccion.mostrar();
        } else if (vista === "details") { //new
            this.vDetailsTransaccion.mostrar(); //new
        }
    }

    public get dtTransacciones() { //Para las tablas de atributos
        return this.mBanco.dtTransacciones;
    }
    public get dtBanco(): Cl_mBanco { // New - Para los metodos
        return this.mBanco;
    }
}