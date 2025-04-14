import { Router } from "express";
import { ProductosController } from "../controllers/productos.controller";
import { CreateProductoDto, UpdateProductoDto } from "../dto/producto.dto";
import { validateDto } from "../middlewares/validate-dto";

const productosController = new ProductosController()

const route = Router()

route.get('/', productosController.listarProductos)
route.get('/:id', productosController.obtenerProducto)
route.post('/', validateDto(CreateProductoDto), productosController.crearProducto);
route.patch('/:id', validateDto(UpdateProductoDto), productosController.actualizarProducto);
route.delete('/:id', productosController.eliminarProducto);

export default route