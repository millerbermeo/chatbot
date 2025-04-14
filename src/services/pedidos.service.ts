import { pool } from "../database/conexion";
import { PedidosDto, UpdatePedidosDto } from "../dto/pedido.dto";
import { UpdateProductoDto } from "../dto/producto.dto";
import { Pedido } from "../models/pedidos.interface";
import { ItemsPedidosServices } from "./items-pedidos.service";
import { ProductosServices } from "./productos.service";

export class PedidosServices {

    private productosServices: ProductosServices
    private itemsPedidosServices: ItemsPedidosServices

    constructor() {
        this.productosServices = new ProductosServices()
        this.itemsPedidosServices = new ItemsPedidosServices()
    }

    async crearOrdenPedido(dto: PedidosDto): Promise<Pedido> {

        const { usuario_id, estado, total_pedido, direccion_envio, items } = dto;

        if (!items) {
            throw new Error("Items Vacios");
        }

        await Promise.all(
            items.map(async (item) => {
                const { fk_producto } = item

                const producto = await this.productosServices.obtenerProducto(String(fk_producto))

                if (!producto) {
                    throw new Error(
                        `Producto con ID ${fk_producto} no encontrado`,
                    );
                }

                return producto
            })
        )

        // CREAR ORDEN DEL PEDIDO
        const query = `INSERT INTO public.pedidos (cliente_id, estado, total)
        VALUES ($1, $2, $3) RETURNING *;`

        const values = [usuario_id, estado, total_pedido]

        const result = await pool.query(query, values)

        // CREAR ITEMS DE LA ORDEN ASOCIADA AL PRODUCTO
        await Promise.all(
            items.map(async (item) => {
                const { fk_producto, cantidad } = item

                const producto = await this.productosServices.obtenerProducto2(String(fk_producto))

                if (!producto) {
                    throw new Error(
                        `Producto con ID ${fk_producto} no encontrado`,
                    );
                }

                let valuesItems = {
                    pedido_id: result.rows[0].id,
                    producto_id: producto.id,
                    cantidad_pedido: item.cantidad = item.cantidad
                };

                const queryItems = await this.itemsPedidosServices.crearItemsPedidos(valuesItems)


                return queryItems
            })
        )

        return result.rows[0]
    }


    async listarPedidos(): Promise<Pedido[]> {
        const query = `SELECT 
            p.id, 
            p.estado, 
            p.total_pedido, 
            p.direccion_envio,
            u.id AS identificacion, 
            u.nombre AS cliente, 
            i.producto_id AS producto_id, 
            pr.nombre AS producto_nombre 
        FROM pedidos p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN items_pedidos i ON p.id = i.pedido_id
        JOIN productos pr ON i.producto_id = pr.id;
        ;`
        const result = await pool.query(query)

        const groupedOrders = result.rows.reduce<Pedido[]>((acc, item) => {
            let order = acc.find((o) => o.id === item.id);

            // Si no se encuentra un pedido, creamos uno nuevo
            if (!order) {
                order = { id: item.id, estado: item.estado, total_pedido: item.total_pedido, direccion_envio: item.direccion_envio, cliente: item.cliente, productos: [] };
                acc.push(order);
            }

            // Ahora estamos seguros de que `order` no es `undefined`
            order.productos.push(item.producto_nombre);

            return acc;
        }, []);

        return groupedOrders;
    }

    async obtenerPedido(id: string): Promise<Pedido> {
        const query = `SELECT * FROM public.pedidos WHERE id = $1;`
        const result = await pool.query(query, [id])
        return result.rows[0];
    }


    async actualizarPedido(id: string, dto: UpdatePedidosDto): Promise<Pedido> {
        const pedido = await this.obtenerPedido(id);
    
        if (!pedido) {
            throw new Error(`El pedido con ID ${id} no existe`);
        }
    
        // Mantener los valores actuales si no vienen en el DTO
        const usuario_id = dto.usuario_id ?? pedido.cliente;
        const estado = dto.estado ?? pedido.estado;
        const direccion_envio = dto.direccion_envio ?? pedido.direccion_envio;
    
        const query = `UPDATE public.pedidos 
                       SET usuario_id = $1, estado = $2, direccion_envio = $3 
                       WHERE id = $4 RETURNING *;`;
    
        const values = [usuario_id, estado, direccion_envio, id];
    
        const result = await pool.query(query, values);
    
        return result.rows[0];
    }
    
}