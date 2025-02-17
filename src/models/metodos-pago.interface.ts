import { EstadoMetodoPago } from "../enums/estado-metodo-pago.enum"

export interface MetodosPago {
    id: number
    nombre: string
    descripcion: string
    estado: EstadoMetodoPago
}