export default class Cl_mUbicacion {
    _laboratorio = "";
    _meson = "";
    _puesto = "";
    constructor({ laboratorio, meson, puesto, }) {
        this.laboratorio = laboratorio;
        this.meson = meson;
        this.puesto = puesto;
    }
    get laboratorio() {
        return this._laboratorio;
    }
    set laboratorio(v) {
        this._laboratorio = v.trim();
    }
    get meson() {
        return this._meson;
    }
    set meson(v) {
        this._meson = v.trim();
    }
    get puesto() {
        return this._puesto;
    }
    set puesto(v) {
        this._puesto = v.trim();
    }
    ubicacionToJSON() {
        return {
            laboratorio: this._laboratorio,
            meson: this._meson,
            puesto: this._puesto,
        };
    }
}
//# sourceMappingURL=Cl_mUbicacion.js.map