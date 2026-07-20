import Cl_mProducto from "./Cl_mProducto.js";
import Cl_mPedido from "./Cl_mPedido.js";

export default class Cl_mCafetin {
  private _productos: Cl_mProducto[] = [];
  private _pedidos: Cl_mPedido[] = [];

  setProductos(productos: Cl_mProducto[]): void {
    this._productos = [...productos];
  }

  getProductos(): Cl_mProducto[] {
    return [...this._productos];
  }

  getProductosPorCategoria(categoria: string): Cl_mProducto[] {
    const valor = categoria.trim().toLowerCase();
    return this._productos.filter(
      (p) => (p.categoria ?? "").toString().toLowerCase() === valor,
    );
  }

  setPedidos(pedidos: Cl_mPedido[]): void {
    this._pedidos = [...pedidos];
  }

  getPedidos(): Cl_mPedido[] {
    return [...this._pedidos];
  }

  getPedidosNoProcesados(): Cl_mPedido[] {
    return this._pedidos.filter((p) => !p.procesado);
  }

  getIngresosTotales(): number {
    return this._pedidos
      .filter((p) => p.procesado)
      .reduce((total, p) => total + p.calcularTotal(), 0);
  }

  getPedidoMenor(): number {
    const procesados = this._pedidos.filter((p) => p.procesado);
    if (procesados.length === 0) return 0;
    return Math.min(...procesados.map((p) => p.calcularTotal()));
  }

  getPedidoMayor(): number {
    const procesados = this._pedidos.filter((p) => p.procesado);
    if (procesados.length === 0) return 0;
    return Math.max(...procesados.map((p) => p.calcularTotal()));
  }

  getClienteEstrella(): string {
    const procesados = this._pedidos.filter((p) => p.procesado);
    if (procesados.length === 0) return "N/A";
    const conteo: { [key: string]: number } = {};
    procesados.forEach((p) => (conteo[p.nombre] = (conteo[p.nombre] || 0) + 1));
    return Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b,
    );
  }

  getFuenteIngresosPrincipal(): string {
    const procesados = this._pedidos.filter((p) => p.procesado);
    if (procesados.length === 0) return "N/A";

    const ingresosPorTipo: { [key: string]: number } = {};
    procesados.forEach((p) => {
      ingresosPorTipo[p.tipoPago] =
        (ingresosPorTipo[p.tipoPago] || 0) + p.calcularTotal();
    });

    const codFuente = Object.keys(ingresosPorTipo).reduce((a, b) =>
      ingresosPorTipo[a] > ingresosPorTipo[b] ? a : b,
    );

    const nombresFuentes: { [key: string]: string } = {
      efectivo_usd: "Divisas",
      efectivo_bs: "Efectivo Bs.",
      pago_movil: "Pago Móvil / Transferencia",
      otro: "Otros",
    };

    return `${nombresFuentes[codFuente] || codFuente} ($${ingresosPorTipo[codFuente].toFixed(2)})`;
  }

  getEstadisticasProductos(): {
    nombre: string;
    porcentaje: string;
    cantidad: number;
  }[] {
    const conteo: Map<string, number> = new Map();
    let totalItems = 0;

    this._pedidos
      .filter((p) => p.procesado)
      .forEach((p) => {
        p.productos.forEach((prod) => {
          conteo.set(prod.nombre, (conteo.get(prod.nombre) || 0) + 1);
          totalItems++;
        });
      });

    const resultado: {
      nombre: string;
      porcentaje: string;
      cantidad: number;
    }[] = [];
    conteo.forEach((cantidad, nombre) => {
      const porcentaje =
        totalItems > 0
          ? ((cantidad / totalItems) * 100).toFixed(1) + "%"
          : "0%";
      resultado.push({ nombre, porcentaje, cantidad });
    });

    return resultado.sort((a, b) => b.cantidad - a.cantidad);
  }

  getStatsProductoPorId(idProducto: number): {
    ventas: number;
    ingreso: number;
  } {
    let ventas = 0;
    let ingreso = 0;

    this._pedidos
      .filter((p) => p.procesado)
      .forEach((pedido) => {
        pedido.productos.forEach((prod) => {
          if (Number(prod.id) === idProducto) {
            ventas++;
            ingreso += prod.precio;
          }
        });
      });

    return { ventas, ingreso };
  }

  getProductoMasVendido(): {
    nombre: string;
    unidades: number;
    ingresoTotal: number;
  } {
    const conteoUnidades: Map<string, { unidades: number; ingreso: number }> =
      new Map();

    this._pedidos
      .filter((p) => p.procesado)
      .forEach((pedido) => {
        pedido.productos.forEach((prod) => {
          const datosActuales = conteoUnidades.get(prod.nombre) || {
            unidades: 0,
            ingreso: 0,
          };
          conteoUnidades.set(prod.nombre, {
            unidades: datosActuales.unidades + 1,
            ingreso: datosActuales.ingreso + prod.precio,
          });
        });
      });

    let productoMasVendido = { nombre: "N/A", unidades: 0, ingresoTotal: 0 };

    conteoUnidades.forEach((valores, nombreProd) => {
      if (valores.unidades > productoMasVendido.unidades) {
        productoMasVendido = {
          nombre: nombreProd,
          unidades: valores.unidades,
          ingresoTotal: valores.ingreso,
        };
      }
    });

    return productoMasVendido;
  }

  getMontoTotalRecaudado(): number {
    const hoy = new Date();
    const inicioDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );
    const finDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1,
    );
    return this._pedidos
      .filter((p) => {
        if (!p.procesado || !p.fechaPago) return false;
        const fecha = new Date(p.fechaPago);
        return fecha >= inicioDia && fecha < finDia;
      })
      .reduce((total, p) => total + p.calcularTotal(), 0);
  }

  promedioVentas(): number {
    let totalVentas = 0;
    let totalPedidos = 0;
    this._pedidos.forEach((p) => {
      totalVentas += p.calcularTotal();
      totalPedidos++;
    });
    return totalPedidos === 0 ? 0 : totalVentas / totalPedidos;
  }

  porcentajeVentas(): string {
    const totalPedidos = this._pedidos.length;
    if (totalPedidos === 0) return "0.00%";

    const procesados = this._pedidos.filter((p) => p.procesado).length;
    const porcentaje = (procesados / totalPedidos) * 100;

    return porcentaje.toFixed(2) + "%";
  }
}
