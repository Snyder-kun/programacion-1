import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_mTransaccion , { iTransaccion } from "./Cl_mTransaccion.js";
export default class Cl_vEditTransaccion extends Cl_vGeneral {
    private inFecha: HTMLInputElement;
    private inDescripcion: HTMLInputElement;
    private inMonto: HTMLInputElement;
    private inReferencia: HTMLInputElement;
    private inTipoTransaccion: HTMLInputElement;
    private inCategoria: HTMLInputElement;
    private btCancelar: HTMLButtonElement;
    private btGuardar: HTMLButtonElement;
    private editingReferencia: string | null = null;
    constructor() {
        super({ formName: "editTransaccion" });
        this.inFecha = this.crearHTMLInputElement("inFecha");
        this.inDescripcion = this.crearHTMLInputElement("inDescripcion");
        this.inMonto = this.crearHTMLInputElement("inMonto");
        this.inReferencia = this.crearHTMLInputElement("inReferencia");
        this.inTipoTransaccion = this.crearHTMLInputElement("inTipoTransaccion");
        this.inCategoria = this.crearHTMLInputElement("inCategoria");
        this.btGuardar = this.crearHTMLButtonElement("btGuardar", {
            onclick: () => this.guardar()
        });
        this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
            onclick: () => this.cancelar()
        });
        // Añadir listener para filtrar categorías según el tipo de transacción
        try {
            const tipoEl = document.getElementById(`${this.formName}_inTipoTransaccion`) as HTMLSelectElement | null;
            const catEl = document.getElementById(`${this.formName}_inCategoria`) as HTMLSelectElement | null;
            if (tipoEl && catEl) {
                tipoEl.onchange = () => this._aplicarFiltroCategorias(tipoEl, catEl);
                // inicializar según el valor actual
                this._aplicarFiltroCategorias(tipoEl, catEl);
            }
        } catch (e) {
            console.error(e);
        }
    }
    public cargarDatos(trans: iTransaccion) {
        this.editingReferencia = trans.referencia;
        this.inFecha.value = trans.fecha;
        this.inDescripcion.value = trans.descripcion;
        this.inMonto.value = trans.monto.toString();
        this.inReferencia.value = trans.referencia;
        this.inTipoTransaccion.value = trans.tipoTransaccion.toString();
        this.inCategoria.value = trans.categoria.toString();
        this.inReferencia.disabled = true;
    }
    private guardar() {
        if (!this.inFecha.value || !this.inDescripcion.value || !this.inMonto.value || !this.inReferencia.value || !this.inTipoTransaccion.value || !this.inCategoria.value) {
            alert("Debes llenar todos los campos.");
            return;
        }
        if (+this.inMonto.value <= 0){ 
            alert("El monto debe ser mayor a 0.");
            return;
        }
         if (+this.inTipoTransaccion.value === 1 && +this.inCategoria.value === 1){
            alert("No puedes asignar la categoría 'Ingreso' a una transacción de tipo 'Cargo'.");
            return;
        }
        if (+this.inTipoTransaccion.value === 2 && +this.inCategoria.value !== 1){
            alert("Solo puedes asignar la categoría 'Ingreso' a una transacción de tipo 'Abono'.");
            return;
        }
        const data = {
            fecha: this.inFecha.value,
            descripcion: this.inDescripcion.value.toLowerCase(),
            monto: parseFloat(this.inMonto.value || "0"),
            referencia: this.editingReferencia ?? this.inReferencia.value.trim().toUpperCase(),
            tipoTransaccion: parseInt(this.inTipoTransaccion.value || "0", 10),
            categoria: parseInt(this.inCategoria.value || "0", 10)
        };
        this.controlador?.procesarTransaccion(data);
        this.limpiar();
        this.editingReferencia = null;
        this.inReferencia.disabled = false;
    }
    private cancelar() {
        this.limpiar();
        this.editingReferencia = null;
        this.inReferencia.disabled = false;
        this.controlador?.mostrarVista("transacciones");
    }
    private limpiar() {
        this.inFecha.value = "";
        this.inDescripcion.value = "";
        this.inReferencia.value = "";
        this.inMonto.value = "";
        this.inTipoTransaccion.value = "";
        this.inCategoria.value = "";
    }
    public mostrar() { this.vista!.hidden = false; }
    public ocultar() { this.vista!.hidden = true; }
    private _aplicarFiltroCategorias(tipoEl: HTMLSelectElement, catEl: HTMLSelectElement) {
        const tipo = parseInt(tipoEl.value || "0", 10);
        let options = "";
        if (tipo === 1) {
            const opts = [
                { v: 2, t: "Alimentación" },
                { v: 3, t: "Servicios Basicos" },
                { v: 4, t: "Artículos de Vestimenta" },
                { v: 5, t: "Servicios Publicos" },
                { v: 6, t: "Entretenimiento" },
                { v: 7, t: "Educación" },
                { v: 8, t: "Gasto del Hogar" },
                { v: 9, t: "Otros" },
            ];
            options = opts.map(o => `<option value="${o.v}">${o.t}</option>`).join("");
        } else if (tipo === 2) {
            options = `<option value="1">Ingreso</option>`;
        } else {
            options = `
                <option value=1>Ingreso</option>
                <option value=2>Alimentación</option>
                <option value=3>Servicios Basicos</option>
                <option value=4>Artículos de Vestimenta</option>
                <option value=5>Servicios Publicos</option>
                <option value=6>Entretenimiento</option>
                <option value=7>Educación</option>
                <option value=8>Gasto del Hogar</option>
                <option value=9>Otros</option>`;
        }
        const prev = catEl.value;
        catEl.innerHTML = options;
        if (catEl.querySelector(`option[value="${prev}"]`)) catEl.value = prev;
    }
}