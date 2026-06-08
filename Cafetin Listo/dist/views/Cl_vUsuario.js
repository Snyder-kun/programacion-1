export default class Cl_vUsuario {
    selFiltroLab;
    inIdReporte;
    btnReportar;
    contenedor;
    toastEl;
    _toastTimer = null;
    constructor() {
        this.selFiltroLab = document.getElementById("filtroLab");
        this.inIdReporte = document.getElementById("inIdReporte");
        this.btnReportar = document.getElementById("btnReportar");
        this.contenedor = document.getElementById("gridEquipos");
        this.toastEl = document.getElementById("toast");
    }
    get filtros() {
        return { laboratorio: this.selFiltroLab.value };
    }
    get idReporte() {
        return this.inIdReporte.value.trim();
    }
    onFiltrar(callback) {
        this.selFiltroLab.onchange = callback;
    }
    onReportar(callback) {
        this.btnReportar.onclick = callback;
    }
    mostrarEquipos(equipos) {
        if (!equipos.length) {
            this.contenedor.innerHTML =
                '<p class="empty">No hay equipos disponibles para este laboratorio.</p>';
            return;
        }
        const claseEstado = {
            activo: "est-activo",
            reportado: "est-reportado",
            mantenimiento: "est-mantenimiento",
        };
        this.contenedor.innerHTML = equipos
            .map((e) => {
            const cls = claseEstado[e.estado] ?? "";
            return `<div class="equipo-card ${e.estado === "activo" ? "card-activo" : "card-inactivo"}">
          <div class="card-header">
            <span class="card-id">${e.id}</span>
            <span class="estado-badge ${cls}">${e.estado}</span>
          </div>
          <div class="card-body">
            <div class="card-row"><span class="card-lbl">Marca</span><span>${e.marca}</span></div>
            <div class="card-row"><span class="card-lbl">CPU</span><span>${e.procesador}</span></div>
            <div class="card-row"><span class="card-lbl">RAM</span><span>${e.memoria} GB</span></div>
            <div class="card-row"><span class="card-lbl">Ubicación</span><span>${e.laboratorio} · ${e.meson} · ${e.puesto}</span></div>
          </div>
        </div>`;
        })
            .join("");
    }
    mostrarMensaje(msg, tipo = "") {
        this.toastEl.textContent = msg;
        this.toastEl.className = "show" + (tipo ? " " + tipo : "");
        if (this._toastTimer !== null)
            clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            this.toastEl.className = "";
        }, 3000);
    }
}
//# sourceMappingURL=Cl_vUsuario.js.map