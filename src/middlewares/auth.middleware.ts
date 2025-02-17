import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = String(process.env.JWT_SECRET);

export function authenticate(req: Request, res: Response, next: NextFunction): void {

    try {
        const token = String(req.header("Authorization")?.split(" ")[1]);  // Obtenemos el token del encabezado
console.log(token)

        if (!token) {
            res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);  // Verificamos el token
        (req as any).user = decoded;  // Guardamos la información decodificada en el objeto `req`
        next();  // Continuamos al siguiente middleware o ruta
    } catch (error) {
        // Si el token no es válido, devolvemos un mensaje más claro
        res.status(403).json({ message: "Token inválido o expirado." });
    }
}
