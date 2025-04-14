import { pool } from "../database/conexion";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dto/usuario.dto";
import { EstadoUsuario } from "../enums/estado-usuario.enum";
import { Categoria } from "../models/categorias.interface";
import { Producto } from "../models/productos.interface";
import { Usuario } from "../models/usuario.interface";

export class UsuarioServices {

    async crearNuevoUsuario(dto: any): Promise<Usuario> {
        try {
            const { nombre, email, telefono, direccion } = dto;


            const query = `
            INSERT INTO public.clientes (nombre, email, telefono, direccion)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

            const values = [nombre, email, telefono, direccion];
            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al crear un usuario:", error.message);
                throw new Error("No se pudo crear el usuario.");
            }
            throw new Error("Ocurrió un error inesperado.");
        }

    }

        async listarCategorias(): Promise<Categoria[]> {
            const query = 'SELECT * FROM public.categorias';
            const result = await pool.query(query);
            console.log('categorias', result.rows)
            return result.rows;
        }

    async obtenerUsuario(id: string): Promise<Producto | null> {
    
            const query = 'SELECT * FROM public.clientes WHERE id = $1;'

            const result = await pool.query(query, [id])

            return result.rows ? result.rows[0] : null

 
    }


    async listarUsuarios(): Promise<Producto[]> {
        try {
            const query = 'SELECT * FROM public.usuarios;'

            const result = await pool.query(query)

            return result.rows
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al listar usuarios:", error.message);
                throw new Error("No se pudo obtener la lista de usuarios.");
            }
            throw new Error("Ocurrió un error inesperado.");
        }

    }


    async actualizarUsuario(id: string, dto: UpdateUsuarioDto): Promise<Usuario | null> {

        try {
            if (!id) throw new Error("El ID del usuario es obligatorio.");

            const usuario = this.obtenerUsuario(id)

            if (!usuario) {
                throw new Error(`El usuario con id ${id} no fue encontrado!`)
            }

            const { nombre, edad, correo, direccion, rol, estado } = dto;
            const query = `
            UPDATE public.usuarios 
            SET nombre=$1, edad=$2, correo=$3, direccion=$4, rol=$5, estado=$6
            WHERE id = $7 
            RETURNING id, nombre, edad, correo, direccion, rol, estado;
        `;

            const values = [nombre, edad, correo, direccion, rol, estado, id];

            const result = await pool.query(query, values);

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al actualizar usuario:", error.message);
                throw new Error("No se pudo actualizar el usuario.");
            }
            throw new Error("Ocurrió un error inesperado.");

        }
    }


    async eliminarUsuario(id: string): Promise<boolean> {
        try {
            if (!id) throw new Error("El ID del usuario es obligatorio.");

            const usuario = this.obtenerUsuario(id)

            if (!usuario) {
                throw new Error(`El usuario con id ${id} no fue encontrado!`)
            }

            const query = 'DELETE FROM public.usuarios WHERE id = $1 RETURNING id;';

            const result = await pool.query(query, [id]);

            return result.rows.length > 0;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al eliminar usuario:", error.message);
                throw new Error("No se pudo eliminar el usuario.");
            }
            throw new Error("Ocurrió un error inesperado.");
        }
    }

}