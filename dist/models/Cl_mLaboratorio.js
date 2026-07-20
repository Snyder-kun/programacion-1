import Cl_mEquipo from "./Cl_mEquipo.js";
export default class Cl_mLaboratorio {
    _equipos = [];
    agregarEquipo(equipo) {
        const existe = this._equipos.find((e) => e.id === equipo.id);
        if (existe) {
            return { ok: false, mensaje: `Ya existe un equipo con ID "${equipo.id}"` };
        }
        this._equipos.push(equipo);
        return { ok: true, mensaje: `Equipo "${equipo.id}" registrado correctamente` };
    }
    reportarFalla(id) {
        const eq = this._equipos.find((e) => e.id === id);
        if (!eq || eq.estado !== "activo")
            return false;
        eq.estado = "reportado";
        return true;
    }
    cambiarEstado(id, nuevoEstado) {
        const eq = this._equipos.find((e) => e.id === id);
        if (!eq)
            return false;
        eq.estado = nuevoEstado;
        return true;
    }
    filtrar({ laboratorio = "", estado = "", }) {
        return this._equipos.filter((e) => {
            const matchLab = !laboratorio || e.laboratorio === laboratorio;
            const matchEst = !estado || e.estado === estado;
            return matchLab && matchEst;
        });
    }
    getEquipos() {
        return [...this._equipos];
    }
    getStats() {
        return {
            activo: this._equipos.filter((e) => e.estado === "activo").length,
            reportado: this._equipos.filter((e) => e.estado === "reportado").length,
            mantenimiento: this._equipos.filter((e) => e.estado === "mantenimiento").length,
            total: this._equipos.length,
        };
    }
    exportar() {
        return JSON.stringify(this._equipos.map((e) => e.toJSON()));
    }
    importar(data) {
        try {
            const arr = JSON.parse(data);
            this._equipos = arr.map((d) => new Cl_mEquipo(d));
        }
        catch (_e) {
        }
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map