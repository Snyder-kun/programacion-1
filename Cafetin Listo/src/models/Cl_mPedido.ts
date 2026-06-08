import Cl_mProducto from "./Cl_mProducto.js";

export type TipoPago = "efectivo_usd" | "efectivo_bs" | "pago_movil" | "otro";

export interface DatosPagoMovil {
  cedulaPago: string;
  bancoPago: string;
  referencia: string;
}

export default class Cl_mPedido {
  private _id?: number;
  private _nombre: string;
  private _tipoPago: TipoPago;
  private _productos: Cl_mProducto[];
  private _datosPagoMovil: DatosPagoMovil | null;
  private _procesado: boolean;
  private _fechaHora: string;
  private _fechaPago: string | null;

  constructor({
    id,
    nombre,
    tipoPago,
    productos,
    datosPagoMovil = null,
    procesado = false,
    fechaHora,
    fechaPago = null,
  }: {
    id?: number;
    nombre: string;
    tipoPago: TipoPago;
    productos: Cl_mProducto[];
    datosPagoMovil?: DatosPagoMovil | null;
    procesado?: boolean;
    fechaHora?: string;
    fechaPago?: string | null;
  }) {
    this._id = id;
    this._nombre = nombre;
    this._tipoPago = tipoPago;
    this._productos = productos;
    this._datosPagoMovil = datosPagoMovil;
    this._procesado = procesado;
    this._fechaHora = fechaHora ?? new Date().toISOString();
    this._fechaPago = fechaPago;
  }

  get id(): number | undefined { return this._id; }
  set id(v: number | undefined) { this._id = v; }
  get nombre(): string { return this._nombre; }
  set nombre(v: string) { this._nombre = v; }
  get tipoPago(): TipoPago { return this._tipoPago; }
  set tipoPago(v: TipoPago) { this._tipoPago = v; }
  get productos(): Cl_mProducto[] { return [...this._productos]; }
  set productos(v: Cl_mProducto[]) { this._productos = v; }
  get datosPagoMovil(): DatosPagoMovil | null { return this._datosPagoMovil; }
  set datosPagoMovil(v) { this._datosPagoMovil = v; }
  get procesado(): boolean { return this._procesado; }
  set procesado(v: boolean) { this._procesado = v; }
  get fechaHora(): string { return this._fechaHora; }
  get fechaPago(): string | null { return this._fechaPago; }
  set fechaPago(v: string | null) { this._fechaPago = v; }

  calcularTotal(): number {
    return this._productos.reduce((acc, p) => acc + p.precio, 0);
  }

  toJSON() {
    return {
      id: this._id,
      nombre: this._nombre,
      tipoPago: this._tipoPago,
      productos: this._productos.map(p => p.toJSON()),
      datosPagoMovil: this._datosPagoMovil,
      procesado: this._procesado,
      fechaHora: this._fechaHora,
      fechaPago: this._fechaPago,
      total: this.calcularTotal(),
    };
  }
}