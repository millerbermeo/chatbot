import { query } from "express";
import { ItemsPedidosDto } from "../dto/items-pedidos.dto";
import { ItemsPedidos } from "../models/items-pedidos.interface";
import { pool } from "../database/conexion";

export class ItemsPedidosServices {

    async crearItemsPedidos(dto: ItemsPedidosDto): Promise<ItemsPedidos> {

        const { pedido_id, producto_id, cantidad_pedido } = dto

        const query = `INSERT INTO public.detalle_pedido (pedido_id, producto_id, cantidad)
        VALUES ($1, $2, $3) RETURNING *;`

        const values = [pedido_id, producto_id, cantidad_pedido]

        const result = await pool.query(query, values)

        return result.rows[0]
    }
}