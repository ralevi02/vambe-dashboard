# Vambe Dashboard
Dashboard de reuniones de venta con análisis de leads potenciado por IA, construido con Next.js 15.

**🔗 Live app:** [https://vambe-dashboard-ten.vercel.app](https://vambe-dashboard-ten.vercel.app)  
**📦 Repositorio:** [https://github.com/ralevi02/vambe-dashboard](https://github.com/ralevi02/vambe-dashboard)

---

## Ejecutar localmente

### Requisitos previos

- Una API key de [Groq](https://console.groq.com) (gratuita)
- **Docker** (opción recomendada) o Node.js 18+

---

### Opción A — Docker Compose (recomendada)

```bash
# 1. Clonar el repositorio
git clone https://github.com/ralevi02/vambe-dashboard.git
cd vambe-dashboard

# 2. Crear el archivo de entorno
echo "GROQ_API_KEY=tu_clave_aqui" > .env

# 3. Construir y levantar
docker compose up --build
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.  
Para detener: `docker compose down`

> El `Dockerfile` usa un build multi-stage (deps → builder → runner) y corre como usuario no-root para producción.

---

### Opción B — npm (desarrollo local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/ralevi02/vambe-dashboard.git
cd vambe-dashboard

# 2. Instalar dependencias
npm install

# 3. Configurar variable de entorno
cp .env.example .env.local
# Editar .env.local y completar GROQ_API_KEY con tu clave

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

### Variables de entorno

| Variable | Descripción |
|---|---|
| `GROQ_API_KEY` | API key de Groq para el análisis con LLM |

> Docker Compose lee el archivo `.env`; el servidor de desarrollo de Next.js lee `.env.local`.

---

## Arquitectura

```
app/
├── api/
│   └── analyze-all/route.ts   # Endpoint SSE — streama resultados del análisis al cliente
├── components/
│   ├── ui/                    # Primitivos reutilizables (Card, Badge, Modal, etc.)
│   ├── clients/               # ClientsTable, ClientRow, ClientModal
│   ├── sellers/               # Tabla y modal de vendedores
│   ├── insights/              # Gráficos Recharts (PainPoints, Channel, Sentiment)
│   ├── dashboard/             # StatsRow, layout del dashboard principal
│   └── layout/                # Sidebar, ThemeToggle
├── clients/                   # Página /clients
├── sellers/                   # Página /sellers
├── insights/                  # Página /insights
├── settings/                  # Página /settings
└── globals.css                # Design tokens CSS + temas claro/oscuro
lib/
├── types.ts                   # Tipos TypeScript compartidos
├── aiModel.ts                 # Comunicación con Groq, normalización de salida del LLM
├── insights.ts                # Función pura buildInsights() — agrega datos para gráficos
└── storage.ts                 # Abstracción sobre localStorage
```

### Flujo de análisis IA

1. El usuario importa clientes via CSV o los carga desde `localStorage`.
2. Al hacer click en "Analizar con IA", el cliente llama a `GET /api/analyze-all`.
3. El endpoint divide los clientes en **batches de 10** y los envía al LLM **en paralelo** con `Promise.all` (ver sección debajo).
4. Una vez que todos los batches responden, los resultados se streaman al cliente con **SSE** (Server-Sent Events) — el usuario ve las filas actualizarse progresivamente.
5. Los resultados se persisten en `localStorage` para evitar re-análisis innecesarios.

---

## Decisiones clave

### Paralelización de batches para reducir tiempos de análisis

Sin paralelizar, analizar N clientes en batches secuenciales tomaría:

```
tiempo_total ≈ batches × latencia_LLM
```

Con `Promise.all`, todos los batches se despachan simultáneamente al LLM:

```
tiempo_total ≈ latencia_del_batch_más_lento
```

Por ejemplo, con 50 clientes divididos en 5 batches de 10, el tiempo pasa de ~25 s (5 s por batch × 5 batches) a ~5–7 s (latencia del batch más lento). Se envian en batches y no todos separados para agotar los límites de la API de Groq.


### LLM: Groq + llama-3.3-70b-versatile

Se eligió Groq por su velocidad y tier gratuito generoso.

### Streaming con SSE en lugar de una sola respuesta

Aunque los batches corren en paralelo en el servidor, el cliente sigue recibiendo resultados progresivos via SSE. Esto evita que la UI quede bloqueada mientras espera la respuesta final completa.

### Persistencia en localStorage

No se requiere backend ni base de datos. Los datos del CSV y los resultados del análisis se guardan directamente en el navegador, manteniendo la aplicación sin servidor adicional.

### Design tokens con CSS custom properties

Todo el sistema de color se define como variables CSS (`--accent`, `--ink-1..5`, `--surface`, `--elevated`, `--chart-1..8`). El cambio de tema claro/oscuro es instantáneo sin necesidad de un provider de React — se aplica con `data-theme="dark"` en el `<html>`.

### Arquitectura de componentes

- `ui/` contiene componentes reutilizables como Card, Badge, Modal, FilterSelect.
- Los directorios de dominio (`clients/`, `sellers/`, `insights/`) contienen componentes que sí tienen conocimiento del modelo de datos.
- Las páginas son Server Components por defecto; solo los componentes interactivos usan `"use client"`.
