import Cl_mEquipo from "../models/Cl_mEquipo.js";
const STORAGE_KEY = "dcyt_equipos";
export default class Cl_cTecnico {
    modelo;
    vista;
    constructor({ modelo, vista, }) {
        this.modelo = modelo;
        this.vista = vista;
        // Cargar datos guardados en localStorage
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (guardado)
            this.modelo.importar(guardado);
        // Registrar eventos
        this.vista.onRegistrar(() => this.registrar());
        this.vista.onLimpiar(() => this.vista.limpiarFormulario());
        this.vista.onFiltrar(() => this.refrescar());
        this.vista.onAccionTabla((id, accion) => this.accionTabla(id, accion));
        this.refrescar();
    }
    registrar() {
        const d = this.vista.datosEquipo;
        if (!d.id || !d.marca || !d.procesador || !d.memoria || !d.laboratorio || !d.meson || !d.puesto) {
            this.vista.mostrarMensaje("Completa todos los campos obligatorios", "warn");
            return;
        }
        const equipo = new Cl_mEquipo(d);
        const resultado = this.modelo.agregarEquipo(equipo);
        this.vista.mostrarMensaje(resultado.mensaje, resultado.ok ? "" : "warn");
        if (resultado.ok) {
            this.guardar();
            this.vista.limpiarFormulario();
            this.refrescar();
        }
    }
    accionTabla(id, accion) {
        const nuevoEstado = accion === "activar" ? "activo" : "mantenimiento";
        this.modelo.cambiarEstado(id, nuevoEstado);
        this.guardar();
        this.refrescar();
        this.vista.mostrarMensaje(`Equipo ${id} → ${nuevoEstado}`);
    }
    refrescar() {
        const f = this.vista.filtros;
        const equipos = this.modelo.filtrar(f);
        this.vista.mostrarInventario(equipos);
        this.vista.actualizarStats(this.modelo.getStats());
    }
    guardar() {
        localStorage.setItem(STORAGE_KEY, this.modelo.exportar());
    }
}
//# sourceMappingURL=Cl_cTecnico.js.map