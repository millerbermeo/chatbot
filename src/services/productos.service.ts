import { pool } from "../database/conexion";
import { CreateProductoDto, UpdateProductoDto } from "../dto/producto.dto";
import { Producto } from "../models/productos.interface";

export class ProductosServices {

    async crearProducto(dto: CreateProductoDto): Promise<Producto> {
        const { nombre, descripcion, cantidad, precio,categoria_id, imagen } = dto

        const query = `
              INSERT INTO public.productos (nombre, descripcion, precio, cantidad, categoria_id, imagen)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING *;
          `;

        const values = [nombre, descripcion, precio, cantidad, categoria_id, imagen];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async listarProductos(): Promise<Producto[]> {
        const query = 'SELECT * FROM public.productos';
        const result = await pool.query(query);
        return result.rows;
    }

    
    async obtenerProducto(id: string) {
        const query = `
            SELECT p.nombre, p.descripcion, p.precio, s.cantidad, s.ubicacion 
            FROM public.productos p
            INNER JOIN stock s ON s.producto_id = p.id
            WHERE p.id = $1
        `;
    
        const result = await pool.query(query, [id]);
    
        if (result.rows.length === 0) {
            return "⚠️ Producto no encontrado.";
        }
    
        const { nombre, descripcion, precio, cantidad, ubicacion } = result.rows[0];
    
        return `📦 *Producto Disponible*\n\n🔹 *Nombre:* ${nombre}\n📜 *Descripción:* ${descripcion}\n💰 *Precio Unidad:* $${precio}\n📦 *Stock Disponible:* ${cantidad}\n📍 *Ubicación:* ${ubicacion}`;
    }

    async obtenerProductoNombre(id: string) {
        const query = `
            SELECT p.nombre, p.descripcion, p.precio, s.cantidad, s.ubicacion 
            FROM public.productos p
            INNER JOIN stock s ON s.producto_id = p.id
            WHERE p.id = $1
        `;
    
        const result = await pool.query(query, [id]);
    
        if (result.rows.length === 0) {
            return "⚠️ Producto no encontrado.";
        }
    
        const { nombre, descripcion, precio, cantidad, ubicacion } = result.rows[0];
    
        return `${nombre}`;
    }
    
    async obtenerProducto2(id: string): Promise<Producto | null> {
        const query = 'SELECT * FROM public.productos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    
    async actualizarProducto(id: string, dto: UpdateProductoDto): Promise<Producto> {

        const { nombre, descripcion, precio, cantidad, categoria_id, imagen } = dto

        const producto = await this.obtenerProducto(id)

        if (!producto) {
            throw new Error(`El producto con ID ${id} no existe`);
        }

        if (precio !== undefined && (isNaN(Number(precio)) || precio < 0)) {
            throw new Error("Error: El precio no es un número válido.");
        }
        
        if (cantidad !== undefined && (isNaN(Number(cantidad)) || cantidad < 0)) {
            throw new Error("Error: La cantidad no es un número válido.");
        }
    
        if (categoria_id !== undefined && isNaN(Number(categoria_id))) {
            throw new Error("Error: categoria_id no es un número válido.");
        }

        const query = `UPDATE public.productos SET nombre = $1, descripcion = $2, precio = $3, cantidad = $4, categoria_id = $5, imagen = $6 WHERE id = $7 RETURNING *;`
        const values = [nombre, descripcion, precio, cantidad, categoria_id, imagen, id];
        const result = await pool.query(query, values);

        return result.rows[0];
    }

    async eliminarProducto(id: string): Promise<boolean> {
        const query = 'DELETE FROM public.productos WHERE id = $1 RETURNING *'
        const result = await pool.query(query, [id])
        return result.rows.length > 0
    }

    async filtrarProductos(tipo: string, value: string): Promise<Producto[]> {
        const query = `SELECT * FROM WHERE ${tipo} = ${value}`;
        const result = await pool.query(query)
        return result.rows
    }
}