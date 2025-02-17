import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EstadoPedido } from "../enums/estado-pedido.enum";

export class PedidosDto {

    @IsInt()
    usuario_id: number

    @IsArray()
    @IsNotEmpty({ each: true })
    public items?: {
      fk_producto: number;
      cantidad: number;
    }[] | null;

    @IsEnum(EstadoPedido)
    estado: EstadoPedido

    @IsInt()
    total_pedido: number

    @IsString()
    direccion_envio: string
}

export class UpdatePedidosDto {

  @IsOptional()
  @IsInt()
  usuario_id: number

  @IsOptional()
  @IsArray()
  public items?: {
    fk_producto: number;
    cantidad: number;
  }[] | null;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado: EstadoPedido

  @IsOptional()
  @IsInt()
  total_pedido: number

  @IsOptional()
  @IsString()
  direccion_envio: string
}