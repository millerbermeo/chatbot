import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const authController = new AuthController(); // Instanciamos el controlador

// Ruta para registrar un nuevo usuario
router.post("/register", authController.register);

// Ruta para iniciar sesión
router.post("/login", authController.login);

// Ruta para refrescar el token
router.post("/refresh", authController.refresh);

export default router;
