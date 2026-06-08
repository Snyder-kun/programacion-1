export default class Cl_mProducto {
    _id;
    _nombre;
    _categoria;
    _precio;
    constructor({ id, nombre, categoria, precio, }) {
        this._id = id;
        this._nombre = nombre;
        this._categoria = categoria;
        // Convertir precio a número si viene como string
        this._precio = typeof precio === "string" ? parseFloat(precio) : precio;
    }
    get id() { return this._id; }
    set id(v) { this._id = v; }
    get nombre() { return this._nombre; }
    set nombre(v) { this._nombre = v; }
    get categoria() { return this._categoria; }
    set categoria(v) { this._categoria = v; }
    get precio() {
        // Retornar 0 si el precio no está definido para evitar errores
        return this._precio ?? 0;
    }
    set precio(v) { this._precio = v; }
    toJSON() {
        return {
            id: this._id,
            nombre: this._nombre,
            categoria: this._categoria,
            precio: this._precio,
        };
    }
}
//# sourceMappingURL=Cl_mProducto.js.map