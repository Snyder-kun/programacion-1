export default class Cl_sMockApi {
  protected static apiUrl: string = "";

  protected static async fetchMockApi({
    method = "GET",
    uri,
    body,
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    uri: string;
    body?: any;
    headers?: Record<string, string>;
  }): Promise<{ ok: boolean; status: number; data?: any; message?: string }> {
    if (this.apiUrl === "") {
      return { ok: false, status: 0, message: "API URL no configurada" };
    }
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
      };
      if (body !== undefined) options.body = JSON.stringify(body);
      const respuesta = await fetch(uri, options);
      const status = respuesta.status;
      let data: any = null;
      try { data = await respuesta.json(); } catch (_) { data = null; }
      if (!respuesta.ok) {
        return {
          ok: false,
          status,
          data,
          message: data?.message ?? respuesta.statusText,
        };
      }
      return { ok: true, status, data };
    } catch (error: any) {
      return { ok: false, status: 0, message: error?.message };
    }
  }

  static async getTabla(): Promise<{ ok: boolean; tabla: any[] }> {
    const uri = this.apiUrl;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    if (respuesta.status === 404) return { ok: true, tabla: [] };
    if (!respuesta.ok) return { ok: false, tabla: [] };
    return { ok: true, tabla: respuesta.data ?? [] };
  }

  static async existeId(id: number): Promise<{ ok: boolean; existe: boolean }> {
    const uri = `${this.apiUrl}/${id}`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    if (respuesta.status === 404) return { ok: true, existe: false };
    if (!respuesta.ok) return { ok: false, existe: false };
    return { ok: true, existe: true };
  }

  static async agregar(registro: any): Promise<{ ok: boolean; mensaje: string; status?: number }> {
    const uri = this.apiUrl;
    const respuesta = await this.fetchMockApi({ method: "POST", uri, body: registro });
    if (!respuesta.ok) return { ok: false, status: respuesta.status, mensaje: "Error al guardar el registro" };
    return { ok: true, status: respuesta.status, mensaje: "Registro guardado con ID: " + (respuesta.data?.id ?? "") };
  }

  static async modificar(id: number, registro: any): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/${id}`;
    const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: registro });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al modificar el registro" };
    return { ok: true, mensaje: "Registro modificado" };
  }

  static async eliminar(id: number): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/${id}`;
    const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al eliminar el registro" };
    return { ok: true, mensaje: "Registro eliminado" };
  }
}