export type CategoriaProducto = "pasteles" | "bebidas" | "snacks" | "comidas";

export default class Cl_mProducto {
  private _id?: number;
  private _nombre: string;
  private _categoria: CategoriaProducto;
  private _precio: number;

  constructor({
    id,
    nombre,
    categoria,
    precio,
  }: {
    id?: number;
    nombre: string;
    categoria: CategoriaProducto;
    precio: number | string;
  }) {
    this._id = id;
    this._nombre = nombre;
    this._categoria = categoria;
    // Convertir precio a número si viene como string
    this._precio = typeof precio === "string" ? parseFloat(precio) : precio;
  }

  get id(): number | undefined { return this._id; }
  set id(v: number | undefined) { this._id = v; }
  get nombre(): string { return this._nombre; }
  set nombre(v: string) { this._nombre = v; }
  get categoria(): CategoriaProducto { return this._categoria; }
  set categoria(v: CategoriaProducto) { this._categoria = v; }
  get precio(): number { 
    // Retornar 0 si el precio no está definido para evitar errores
    return this._precio ?? 0;
  }
  set precio(v: number) { this._precio = v; }

  toJSON() {
    return {
      id: this._id,
      nombre: this._nombre,
      categoria: this._categoria,
      precio: this._precio,
    };
  }
}