import { EstadoPedido } from "../enums/estado-pedido.enum"

export interface Pedido {
    id: number;
    estado: string;
    total_pedido: number;
    cliente: string;
    direccion_envio: string;
    productos: string[];
}
