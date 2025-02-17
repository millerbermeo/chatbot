import { IsString, IsInt, IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoUsuario } from '../enums/estado-usuario.enum';

export class CreateUsuarioDto {
    @IsString({ message: 'El nombre es obligatorio y debe ser una cadena de texto.' })
    nombre: string;

    @IsOptional()
    @IsInt({ message: 'La edad debe ser un número entero.' })
    edad: number;
    
    @IsOptional()
    @IsEmail({}, { message: 'Si se proporciona, el correo debe ser válido.' })
    correo: string;

    @IsOptional({ message: 'Si se proporciona, la contrasena debe ser válida.' })
    password: string;

    @IsOptional()
    @IsString({ message: 'la direccion debe ser una cadena de texto.' })
    direccion: string;

    @IsOptional()
    @IsInt({ message: 'El rol debe ser un número entero.' })
    rol: number;

    @IsEnum(EstadoUsuario, { message: 'El estado debe ser uno de los valores de EstadoUsuario.' })
    estado: string;
}


export class UpdateUsuarioDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    nombre?: string;

    @IsOptional()
    @IsInt({ message: 'La edad debe ser un número entero.' })
    edad?: number;
    
    @IsOptional()
    @IsEmail({}, { message: 'Si se proporciona, el correo debe ser válido.' })
    correo?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto válida.' })
    password?: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    direccion?: string;

    @IsOptional()
    @IsInt({ message: 'El rol debe ser un número entero.' })
    rol?: number;

    @IsOptional()
    @IsEnum(EstadoUsuario, { message: 'El estado debe ser uno de los valores de EstadoUsuario.' })
    estado?: EstadoUsuario;
}
