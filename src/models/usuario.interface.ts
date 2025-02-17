import { EstadoUsuario } from "../enums/estado-usuario.enum";
import { Rol } from "../enums/rol.enum";

export interface Usuario {
    id: number
    nombre: string;
    edad?: number;
    correo: string
    password: string
    direccion?: string
    rol: Rol
    estado?: EstadoUsuario
  }