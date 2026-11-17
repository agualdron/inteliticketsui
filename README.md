# Intelitickets UI
<img width="1400" height="784" alt="image" src="https://github.com/user-attachments/assets/3cb68c95-fc67-4ca5-a27a-2ced316e52d4" />


Aplicación web para registrar y gestionar tickets de soporte técnico. Permite iniciar sesión o crear una cuenta, consultar y administrar tickets, asignar técnicos y revisar métricas según el rol del usuario. Se conecta con la API REST del backend **Intelitickets**, implementada con Spring Boot. En desarrollo, la API se espera en `http://localhost:8080`.

## Tecnologías

- React 19 y TypeScript
- Vite 6
- Tailwind CSS 4
- Axios para solicitudes HTTP
- TanStack Query para consultas y caché
- React Router para navegación
- React Hook Form y Zod para formularios y validación

## Requisitos previos

- Node.js 20 LTS o posterior (Vite requiere Node.js 18 o posterior).
- npm, incluido con Node.js; los comandos de esta guía usan npm.
- Backend Intelitickets iniciado y accesible. Por defecto, el proxy de Vite reenvía `/api` a `http://localhost:8080`.

Consulta [el README del backend](https://github.com/agualdron/intelitickets) para iniciar la API y su base de datos.

## Variables de entorno

Crea un archivo `.env` en la raíz de este proyecto a partir de `.env.example`:

```bash
cp .env.example .env
```

| Variable | Uso | Valor local sugerido |
|---|---|---|
| `VITE_API_BASE_URL` | Dirección base del backend. Vite usa este valor como destino de su proxy `/api`; el cliente Axios también puede usarlo como base URL. | `http://localhost:8080` |
| `VITE_BASE_PATH` | Prefijo base para servir la aplicación, útil al publicarla bajo una ruta. | `/` |

Para desarrollo local, se puede dejar `VITE_API_BASE_URL` vacío: la configuración de Vite usa `http://localhost:8080` como destino del proxy. Define el origin completo del backend si corre en otro host o puerto. Las variables con prefijo `VITE_` quedan incluidas en el código del navegador; no guardes secretos en ellas.

## Instalación y ejecución local

Clona el repositorio que contiene este proyecto y entra en su carpeta (sustituye `<URL_DEL_REPOSITORIO>` por la URL proporcionada para el repositorio):

```bash
git clone <URL_DEL_REPOSITORIO>
cd <directorio-del-repositorio>/projects/inteliTickets/inteliticketsui
npm install
cp .env.example .env
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`. Asegúrate de que el backend esté corriendo antes de usar las funciones que consultan la API.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Comprueba los proyectos TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de `dist/` para revisarla. Ejecuta primero `npm run build`. |
| `npm test` | Ejecuta las pruebas con Node.js para los archivos `tests/*.test.mjs`. |

## Estructura principal

```text
src/
├── api/                 # Cliente Axios, configuración de consultas y servicios API
├── components/          # Componentes compartidos, de tickets y de presentación
├── context/             # Contextos de autenticación y tema
├── features/auth/       # Operaciones y esquemas de autenticación
├── hooks/               # Hooks de consultas y mutaciones de TanStack Query
├── pages/               # Páginas públicas y de la aplicación
└── types/               # Tipos para respuestas y entidades de la API
```
