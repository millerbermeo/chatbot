import { NextFunction, Request, Response } from "express";
import { register, login, refreshToken } from "../services/auth.service";
import { AuthDto } from "../dto/auth.dto"; // Asegúrate de tener este DTO

export class AuthController {

    // Método para registrar un usuario
    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = req.body as AuthDto;
            // Validación de los datos si es necesario
            // Puedes agregar validaciones aquí si no las estás haciendo en un middleware o en el DTO
            const user = await register(dto.correo, dto.password);
            res.status(201).json(user);
        } catch (error) {
            next(error); // Manejo de errores
        }
    }

    // Método para iniciar sesión
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = req.body as AuthDto;
            const { accessToken, refreshToken: refreshTokenGenerated } = await login(dto.correo, dto.password);
            res.status(200).json({ accessToken, refreshToken: refreshTokenGenerated });
        } catch (error) {
            next(error); // Manejo de errores
        }
    }

    // Método para refrescar los tokens
    public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken: token } = req.body;
            const newTokens = refreshToken(token);
            res.json(newTokens);
        } catch (error) {
            next(error); // Manejo de errores
        }
    }

}
