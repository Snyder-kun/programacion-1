import Cl_controlador from "./Cl_controlador.js";
import Cl_mBanco from "./Cl_mBanco.js";
import Cl_vBanco from "./Cl_vBanco.js";
import Cl_vTransaccion from "./Cl_vTransaccion.js";
import Cl_vEditTransaccion from "./Cl_vEditTransaccion.js";
import Cl_vDetailsTransaccion from "./Cl_vDetailsTransaccion.js";
import { dtTransacciones } from "./data/dtTransacciones.js";
export default class Cl_index {
    constructor() {
        let modelo = new Cl_mBanco();
        let vista = new Cl_vBanco();
        let vTransaccion = new Cl_vTransaccion();
        let vEditTransaccion = new Cl_vEditTransaccion();
        let vDetailsTransaccion = new Cl_vDetailsTransaccion();
        // Inyectamos todas las vistas
        let controlador = new Cl_controlador(modelo, vista, vTransaccion, vEditTransaccion, vDetailsTransaccion);
        vista.controlador = controlador;
        vTransaccion.controlador = controlador;
        vEditTransaccion.controlador = controlador;
        vDetailsTransaccion.controlador = controlador;
        //dataTransaccionesBK (eliminar /* */ para usar los datos antiguos de prueba)
        /*dtTransaccionesBK.forEach((transaccion) => {
          //modelo.procesarTransaccion(transaccion);
        });*/
        // dataTransacciones
        dtTransacciones.forEach((transaccion) => {
            modelo.procesarTransaccion(transaccion);
        });
        vista.controlador = controlador;
        vTransaccion.controlador = controlador;
        vEditTransaccion.controlador = controlador;
        controlador.mostrarVista("transacciones");
        // alert
        const btnDatosArray = document.getElementById('registroTransaccion_btDatosArray'); //new
        if (btnDatosArray) { //new
            btnDatosArray.addEventListener('click', () => {
                const alerta = modelo.dtTransacciones.map((t, i) => {
                    const tipo = t.tipoTransaccion === 1 ? 'Cargo' : 'Abono'; //new
                    return `Transacción ${i + 1}:\nFecha: ${t.fecha}\nTipo: ${tipo}\nMonto: ${t.monto} Bs.\nReferencia: ${t.referencia}\nCategoría: ${t.categoria}\nDescripción: ${t.descripcion}`; //new
                });
                console.log(alerta.join('\n\n')); //new
            });
        }
    }
}
