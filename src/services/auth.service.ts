import { pool } from "../database/conexion";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = String(process.env.JWT_SECRET);
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET);


export async function register(correo: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return pool.query(
        "INSERT INTO usuarios (correo, password) VALUES ($1, $2) RETURNING id, correo",
        [correo, hashedPassword]
    );
}

export async function login(correo: string, password: string) {
    const userResult = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);

    // Verificar si hay un usuario en la base de datos
    if (userResult.rows.length === 0) {
        throw new Error("Credenciales inválidas");
    }

    const user = userResult.rows[0];

    // Comparar la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Credenciales inválidas");
    }

    return generateTokens(user.id, user.correo);
}


export function generateTokens(userId: number, correo: string) {

    const accessToken = jwt.sign({ correo }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

export function refreshToken(refreshToken: string) {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: number };
        return generateTokens(decoded.userId, ""); // Generar nuevos tokens
    } catch {
        throw new Error("Refresh token inválido o expirado");
    }
}
