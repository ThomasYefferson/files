import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Almacenamiento simple en archivo JSON (sin dependencias nativas, fácil de desplegar) ---
const DB_FILE = path.join(__dirname, "messages.json");

function leerMensajes() {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function guardarMensajes(mensajes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(mensajes, null, 2));
}

// --- Validación simple ---
function validar({ nombre, email, mensaje }) {
  const errores = [];
  if (!nombre || nombre.trim().length < 2) errores.push("El nombre es requerido (mínimo 2 caracteres).");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push("El email no es válido.");
  if (!mensaje || mensaje.trim().length < 10) errores.push("El mensaje debe tener al menos 10 caracteres.");
  return errores;
}

// --- Rutas ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/contact", (req, res) => {
  const { nombre, email, empresa, mensaje } = req.body;
  const errores = validar({ nombre, email, mensaje });

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, errores });
  }

  const mensajes = leerMensajes();
  const nuevoMensaje = {
    id: mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1,
    nombre: nombre.trim(),
    email: email.trim(),
    empresa: (empresa || "").trim(),
    mensaje: mensaje.trim(),
    creado_en: new Date().toISOString(),
  };
  mensajes.push(nuevoMensaje);
  guardarMensajes(mensajes);

  res.status(201).json({
    ok: true,
    mensaje: "Mensaje recibido. Te responderé pronto.",
    id: nuevoMensaje.id,
  });
});

// Endpoint simple para que tú (el dueño del sitio) puedas ver los mensajes recibidos
app.get("/api/messages", (req, res) => {
  const mensajes = leerMensajes().reverse();
  res.json({ ok: true, total: mensajes.length, mensajes });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  console.log(`   Endpoint de salud:   GET  /api/health`);
  console.log(`   Endpoint de contacto: POST /api/contact`);
  console.log(`   Ver mensajes:        GET  /api/messages`);
});
