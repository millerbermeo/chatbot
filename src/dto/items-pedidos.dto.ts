import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { EstadoPedido } from "../enums/estado-pedido.enum";

export class ItemsPedidosDto {

    @IsInt()
    pedido_id: number

    @IsInt()
    @IsNotEmpty()
    public producto_id: number;

    @IsInt()
    cantidad_pedido: number

}