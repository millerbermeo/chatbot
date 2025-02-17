import { NextFunction, Request, Response } from "express";
import { UsuarioServices } from "../services/usuarios.service";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dto/usuario.dto";

export class UsuarioController {
    private usuarioServices: UsuarioServices


    constructor() {
        this.usuarioServices = new UsuarioServices()
    }


    public crearUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuarioCreado = await this.usuarioServices.crearNuevoUsuario(req.body as CreateUsuarioDto);
            res.status(201).json(usuarioCreado);
        } catch (error) {
            next(error);
        }
    }


    public listarUsuarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuarios = await this.usuarioServices.listarCategorias()
            res.status(200).json(usuarios)
        } catch (error) {
            next(error);
        }
    }


    public obtenerUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuarios = await this.usuarioServices.obtenerUsuario(req.params.id)
            res.status(200).json(usuarios)
        } catch (error) {
            next(error);
        }
    }


    public actualizarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuarioActualizado = await this.usuarioServices.actualizarUsuario(req.params.id, req.body as UpdateUsuarioDto);
            res.status(201).json(usuarioActualizado);
        } catch (error) {
            next(error);
        }
    }


    public eliminarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.usuarioServices.eliminarUsuario(req.params.id);
            res.status(204).send();  // Enviar una respuesta vacía para el código 204
          } catch (error) {
            next(error);
          }
    }

}