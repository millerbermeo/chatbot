import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dto/usuario.dto";
import { validateDto } from "../middlewares/validate-dto";

const usuarioController = new UsuarioController()

const route = Router()

route.get('/', usuarioController.listarUsuarios)
route.get('/:id', usuarioController.obtenerUsuario)
route.post('/', validateDto(CreateUsuarioDto), usuarioController.crearUsuario);
route.patch('/:id', validateDto(UpdateUsuarioDto), usuarioController.actualizarUsuario);
route.delete('/:id', usuarioController.eliminarUsuario);

export default route