import { NextFunction, Request, Response } from "express";
import { ProductosServices } from "../services/productos.service";
import { CreateProductoDto, UpdateProductoDto } from "../dto/producto.dto";

export class ProductosController {
    private productosServices: ProductosServices

    constructor() {
        this.productosServices = new ProductosServices()
    }

    public crearProducto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productoCreado = await this.productosServices.crearProducto(req.body as CreateProductoDto)
            res.status(201).json(productoCreado)
        } catch (error) {
            next(error)
        }
    }

    public listarProductos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productos = await this.productosServices.listarProductos()
            res.status(200).json(productos)
        } catch (error) {
            next(error)
        }
    }

    public obtenerProducto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const producto = await this.productosServices.obtenerProducto(req.params.id)
        } catch (error) {
            next(error)
        }
    }

    public actualizarProducto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productoActualizado = await this.productosServices.actualizarProducto(req.params.id, req.body as UpdateProductoDto)
            res.status(200).json(productoActualizado)
        } catch (error) {
            next(error)
        }
    }

    public eliminarProducto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productosServices.eliminarProducto(req.params.id)
        } catch (error) {
            next(error)
        }
    }
}