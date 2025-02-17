import { EstadoPago } from "../enums/estado-pago.enum"

export interface Pagos {
    id: number
    orden_id : number
    metodo_pago: number
    monto: number
    estado: EstadoPago
    create_at : Date
    update_at: Date
}