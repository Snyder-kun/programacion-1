import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vDetailsTransaccion extends Cl_vGeneral {
    lblFecha;
    lblTipo;
    lblMonto;
    lblDescripcion;
    lblReferencia;
    lblCategoria;
    btCerrar;
    constructor() {
        super({ formName: "detailsTransaccion" });
        this.lblFecha = this.crearHTMLElement("lblFecha");
        this.lblTipo = this.crearHTMLElement("lblTipo");
        this.lblMonto = this.crearHTMLElement("lblMonto");
        this.lblDescripcion = this.crearHTMLElement("lblDescripcion");
        this.lblReferencia = this.crearHTMLElement("lblReferencia");
        this.lblCategoria = this.crearHTMLElement("lblCategoria");
        this.btCerrar = this.crearHTMLButtonElement("btCerrar", {
            onclick: () => this.cerrar()
        });
    }
    cargarDatos(trans) {
        if (!trans)
            return;
        this.lblFecha.textContent = trans.fecha;
        this.lblTipo.textContent = trans.tipoTransaccion === 1 ? "Cargo" : "Abono";
        this.lblMonto.textContent = trans.tipoTransaccion === 1 ? `${(trans.monto * -1).toFixed(2)} Bs.` : `${trans.monto.toFixed(2)} Bs.`;
        this.lblDescripcion.textContent = trans.descripcion;
        this.lblReferencia.textContent = trans.referencia;
        this.lblCategoria.textContent = trans.categoriaTexto();
    }
    cerrar() {
        this.controlador?.mostrarVista("transacciones");
    }
    mostrar() { this.vista.hidden = false; }
    ocultar() { this.vista.hidden = true; }
}
