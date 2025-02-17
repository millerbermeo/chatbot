import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail({}, { message: "Debe ser un correo válido" })
    correo: string;

    @IsString()
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    password: string;
}
