# Intelitickets UI

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

- Node.js 22.
- Corepack, incluido con Node.js, para activar pnpm 9.15.9 según `package.json`.
- Backend Intelitickets iniciado y accesible. Por defecto, el proxy de Vite reenvía `/api` a `http://localhost:8080`.

Consulta [el README del backend](https://github.com/agualdron/intelitickets) para iniciar la API y su base de datos.

## Variables de entorno

Crea un archivo `.env` en la raíz de este proyecto a partir de `.env.example`:

```bash
cp .env.example .env
```

| Variable | Uso | Valor local sugerido |
|---|---|---|
| `VITE_API_BASE_URL` | Dirección base de la API que usa Axios. Déjala vacía en Docker para que el navegador use el proxy Nginx `/api/`; en GitHub Pages debe ser el URL público del backend. | Vacío en Docker; URL pública del backend en Pages |
| `VITE_BASE_PATH` | Prefijo con el que se sirve la aplicación. | `/` en Docker y `/intelitickets-ui/` en GitHub Pages |

Para desarrollo local, se puede dejar `VITE_API_BASE_URL` vacío: el cliente usa rutas relativas y el proxy de Vite reenvía `/api` a `http://localhost:8080`. Define el origin completo del backend si corre en otro host o puerto. Las variables con prefijo `VITE_` quedan incluidas en el código del navegador; no guardes secretos en ellas.

## Instalación y ejecución local

Clona el repositorio que contiene este proyecto y entra en su carpeta (sustituye `<URL_DEL_REPOSITORIO>` por la URL proporcionada para el repositorio):

```bash
git clone <URL_DEL_REPOSITORIO>
cd <directorio-del-repositorio>/projects/inteliTickets/inteliticketsui
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`. Asegúrate de que el backend esté corriendo antes de usar las funciones que consultan la API.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo de Vite. |
| `pnpm build` | Comprueba los proyectos TypeScript y genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación de `dist/` para revisarla. Ejecuta primero `pnpm build`. |
| `pnpm test` | Ejecuta las pruebas con Node.js para los archivos `tests/*.test.mjs`. |

## Ejecución con Docker Compose

El Compose integrado conserva Postgres, ejecuta el backend desde la imagen pública `agualdron/intelitickets:0.0.1` y construye el frontend de este directorio. Desde `projects/inteliTickets/inteliticketsui`, inicia los servicios con:

```bash
CORS_ALLOWED_ORIGIN=http://localhost:8081 docker compose -f ../intelitickets/docker-compose.yml up --build -d
```

Abre `http://localhost:8081`. Nginx sirve la SPA y reenvía `/api/` al servicio Compose `backend` en el puerto `8080`. El frontend usa `VITE_API_BASE_URL` vacío y `VITE_BASE_PATH=/` en esta configuración. El backend recibe `CORS_ALLOWED_ORIGIN=http://localhost:8081` por defecto.

El fragmento de integración correspondiente en `../intelitickets/docker-compose.yml` es:

```yaml
services:
  backend:
    image: agualdron/intelitickets:0.0.1
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ../inteliticketsui
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ""
        VITE_BASE_PATH: /
    ports:
      - "8081:80"
```

El Compose completo mantiene además Postgres y la configuración runtime del backend; el fragmento muestra los nombres de servicio y la imagen que conectan frontend, proxy Nginx y API.

Para detener la topología:

```bash
CORS_ALLOWED_ORIGIN=http://localhost:8081 docker compose -f ../intelitickets/docker-compose.yml down
```

## Despliegue en GitHub Pages

El workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) compila la UI bajo `/intelitickets-ui/` y publica el contenido de `dist/` cuando hay un push a `main` o se ejecuta manualmente. En la configuración del repositorio, habilita GitHub Pages con **GitHub Actions** como fuente y define la variable `VITE_API_BASE_URL` con el URL público del backend. Esta variable forma parte del bundle publicado y no debe contener credenciales.

El workflow instala dependencias desde `pnpm-lock.yaml`, genera `dist/404.html` para rutas profundas de la SPA y despliega el artefacto en `https://<usuario>.github.io/intelitickets-ui/`.

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
