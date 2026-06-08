export default class Cl_mCafetin {
    _productos = [];
    _pedidos = [];
    setProductos(productos) {
        this._productos = [...productos];
    }
    getProductos() {
        return [...this._productos];
    }
    getProductosPorCategoria(categoria) {
        const valor = categoria.trim().toLowerCase();
        return this._productos.filter(p => (p.categoria ?? "").toString().toLowerCase() === valor);
    }
    setPedidos(pedidos) {
        this._pedidos = [...pedidos];
    }
    getPedidos() {
        return [...this._pedidos];
    }
    getPedidosNoProcesados() {
        return this._pedidos.filter(p => !p.procesado);
    }
}
//# sourceMappingURL=Cl_mCafetin.js.map