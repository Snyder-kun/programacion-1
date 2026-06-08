import Cl_mUbicacion from "./Cl_mUbicacion.js";
export default class Cl_mEquipo extends Cl_mUbicacion {
    _id = "";
    _marca = "";
    _procesador = "";
    _memoria = 0;
    _estado = "activo";
    constructor({ id, marca, procesador, memoria, estado, laboratorio, meson, puesto, }) {
        super({ laboratorio, meson, puesto });
        this.id = id;
        this.marca = marca;
        this.procesador = procesador;
        this.memoria = memoria;
        this.estado = estado;
    }
    get id() {
        return this._id;
    }
    set id(v) {
        this._id = v.trim();
    }
    get marca() {
        return this._marca;
    }
    set marca(v) {
        this._marca = v.trim();
    }
    get procesador() {
        return this._procesador;
    }
    set procesador(v) {
        this._procesador = v.trim();
    }
    get memoria() {
        return this._memoria;
    }
    set memoria(v) {
        this._memoria = +v;
    }
    get estado() {
        return this._estado;
    }
    set estado(v) {
        this._estado = v;
    }
    toJSON() {
        return {
            id: this._id,
            marca: this._marca,
            procesador: this._procesador,
            memoria: this._memoria,
            estado: this._estado,
            ...this.ubicacionToJSON(),
        };
    }
}
//# sourceMappingURL=Cl_mEquipo.js.map