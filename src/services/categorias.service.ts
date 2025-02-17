import { pool } from "../database/conexion";

class CategoriasService {
    async listarCategorias(): Promise<string> {
        const query = 'SELECT id, nombre FROM public.categorias'; // Ahora seleccionamos id y nombre
        const result = await pool.query(query);
        
        // Formateamos los datos como "id) nombre"
        const categorias = result.rows.map((row: { id: number, nombre: string }) => `${row.id}) ${row.nombre}`).join(', ');

        console.log('Categorías:', categorias);
        return categorias;
    }
}

export default CategoriasService;
