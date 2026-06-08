import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_mTransaccion from "./Cl_mTransaccion.js"; 
export default class Cl_vDetailsTransaccion extends Cl_vGeneral { 
    private lblFecha: HTMLElement; 
    private lblTipo: HTMLElement; 
    private lblMonto: HTMLElement; 
    private lblDescripcion: HTMLElement; 
    private lblReferencia: HTMLElement; 
    private lblCategoria: HTMLElement; 
    private btCerrar: HTMLButtonElement; 

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
    public cargarDatos(trans: Cl_mTransaccion) { 
        if (!trans) return; 
        this.lblFecha.textContent = trans.fecha; 
        this.lblTipo.textContent = trans.tipoTransaccion === 1 ? "Cargo" : "Abono"; 
        this.lblMonto.textContent = trans.tipoTransaccion === 1 ? `${(trans.monto * -1).toFixed(2)} Bs.` : `${trans.monto.toFixed(2)} Bs.`; 
        this.lblDescripcion.textContent = trans.descripcion; 
        this.lblReferencia.textContent = trans.referencia; 
        this.lblCategoria.textContent = trans.categoriaTexto(); 
    } 

    private cerrar() {
        this.controlador?.mostrarVista("transacciones");
        }
    public mostrar() { this.vista!.hidden = false; }
    public ocultar() { this.vista!.hidden = true; }
}