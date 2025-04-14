import express, { Response } from "express";
import cors from 'cors';
import  config  from "./configs/env";
// import { pool } from "./database/conexion";
// import { authenticate } from "./middlewares/auth.middleware";

import rutaUsuarios from './routes/usuario.routes';
import authRouter from "./routes/auth.routes";
import webhookRouter from "./routes/web-hook.routes";
import rutaProductos from './routes/productos.routes';



const app = express();
const port = config.server.port;

// Ruta de prueba
app.get('/', (_, res: Response) => {
  res.send('¡Hola Mundo desde Express!');
});

app.use(cors({ origin: "*" })); // Permite cualquier origen
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Rutas públicas (sin autenticación)
// app.use("/auth", authRouter);

// Middleware de autenticación (se aplica a todas las rutas después de esta línea)
// app.use(authenticate);
app.use("/", webhookRouter);

// Rutas protegidas (requieren autenticación)
app.use('/api/usuarios', rutaUsuarios);
app.use('/api/productos', rutaProductos);





// (async () => {
//   try {
//     await pool.query("SELECT 1");
//     console.log("Conexión establecida");
//   } catch (error) {
//     console.error("Error de conexión: ", error);
//   }
// })();

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
