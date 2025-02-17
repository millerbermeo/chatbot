import { IsEnum, IsOptional, IsString } from "class-validator"
import { EstadoMetodoPago } from "../enums/estado-metodo-pago.enum"

export class CreateMetodoPagoDto {

    @IsString()
    nombre: string

    @IsOptional()
    @IsString()
    descripcion: string

    @IsEnum(EstadoMetodoPago)
    estado: EstadoMetodoPago

}

export class UpdateMetodoPagoDto extends CreateMetodoPagoDto {

}