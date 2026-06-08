const STORAGE_KEY = "dcyt_equipos";
export default class Cl_cUsuario {
    modelo;
    vista;
    constructor({ modelo, vista, }) {
        this.modelo = modelo;
        this.vista = vista;
        // Cargar datos del técnico desde localStorage
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (guardado)
            this.modelo.importar(guardado);
        // Registrar eventos
        this.vista.onFiltrar(() => this.refrescar());
        this.vista.onReportar(() => this.reportarFalla());
        this.refrescar();
    }
    refrescar() {
        const { laboratorio } = this.vista.filtros;
        // El usuario solo ve equipos activos y reportados (no los que ya están en mantenimiento sin interés de uso)
        const equipos = this.modelo.filtrar({ laboratorio });
        this.vista.mostrarEquipos(equipos);
    }
    reportarFalla() {
        const id = this.vista.idReporte;
        if (!id) {
            this.vista.mostrarMensaje("Ingresa el ID del equipo a reportar", "warn");
            return;
        }
        const ok = this.modelo.reportarFalla(id);
        if (!ok) {
            this.vista.mostrarMensaje(`No se pudo reportar "${id}". Solo se pueden reportar equipos activos.`, "warn");
            return;
        }
        this.guardar();
        this.vista.mostrarMensaje(`Equipo "${id}" reportado. El técnico será notificado.`);
        this.refrescar();
    }
    guardar() {
        localStorage.setItem(STORAGE_KEY, this.modelo.exportar());
    }
}
//# sourceMappingURL=Cl_cUsuario.js.map