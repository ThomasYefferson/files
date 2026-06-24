# Portafolio — Yefferson Bermúdez Palacios

Landing page personal (Analista de Datos / Soporte Técnico) con formulario de
contacto **funcional**: el frontend envía los mensajes a un backend real que
los valida y los guarda.

```
yefferson-portfolio/
├── frontend/
│   ├── index.html              ← Toda la página (HTML+CSS+JS en un archivo)
│   └── CV_YeffersonBermudez.pdf
└── backend/
    ├── server.js                ← API Express
    ├── package.json
    └── messages.json            ← Se crea solo al recibir el primer mensaje
```

## Cómo correrlo en tu computador

### 1. Backend (API)

```bash
cd backend
npm install
npm start
```

Esto levanta el servidor en `http://localhost:3001` con 3 rutas:

| Método | Ruta             | Qué hace                                   |
|--------|------------------|---------------------------------------------|
| GET    | `/api/health`    | Verifica que el servidor está vivo          |
| POST   | `/api/contact`   | Recibe y guarda un mensaje del formulario   |
| GET    | `/api/messages`  | Lista todos los mensajes recibidos (para ti)|

Los mensajes se guardan en `backend/messages.json` — no necesitas instalar
ninguna base de datos.

### 2. Frontend (la página)

En otra terminal:

```bash
cd frontend
python3 -m http.server 8080
```

Abre `http://localhost:8080/index.html` en el navegador.

> El frontend ya está configurado para hablar con `http://localhost:3001`
> (línea `const API_URL` al final de `index.html`). Mientras hagas pruebas
> locales, deja el backend corriendo en otra terminal.

## Cómo ponerlo en internet (gratis)

GitHub Pages **no puede ejecutar el backend** (solo sirve archivos
estáticos), así que necesitas separar dónde vive cada parte:

### Paso 1 — Backend en Render (gratis)

1. Sube la carpeta `backend/` a un repositorio de GitHub (puede ser uno
   nuevo, ej. `portfolio-backend`).
2. Entra a [render.com](https://render.com) → **New Web Service** → conecta
   ese repositorio.
3. Configuración:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Al desplegar, Render te da una URL como
   `https://tu-backend.onrender.com`.

> Nota: en el plan gratuito, Render "duerme" el backend tras 15 minutos sin
> uso y tarda ~30 segundos en despertar con la primera visita. Es normal,
> no es un error.

### Paso 2 — Frontend en GitHub Pages

1. Sube la carpeta `frontend/` a tu repo `ThomasYefferson.github.io` (o a un
   repo normal y activa Pages en Settings → Pages).
2. Antes de subir, edita la última línea de `index.html` y cambia:
   ```js
   const API_URL = window.API_URL || "http://localhost:3001";
   ```
   por la URL real de tu backend en Render:
   ```js
   const API_URL = window.API_URL || "https://tu-backend.onrender.com";
   ```
3. Haz commit y push. En unos minutos tu página estará en
   `https://thomasyefferson.github.io/`.

## Personalizar

- **Colores / tipografía:** todo está en las variables CSS `:root` al inicio
  del `<style>` en `index.html`.
- **Contenido (trayectoria, habilidades):** busca las secciones `<!-- LOG -->`
  y `<!-- SKILLS -->` dentro del HTML — son bloques de texto simples, no hay
  que tocar el JavaScript.
- **Ver los mensajes recibidos:** mientras el backend esté corriendo, visita
  `https://tu-backend.onrender.com/api/messages` en el navegador.
