# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

"Tu Inventario" — Sistema de gestión de inventario para un cliente que maneja 200-1000 productos con variantes, ventas, compras, proveedores y reportes. Actualmente es una demo frontend con datos mock; el backend será Supabase.

## Comandos

- `npm run dev` — Servidor de desarrollo (Vite)
- `npm run build` — Build de producción (tsc + vite build)
- `npm run lint` — ESLint
- `npm run preview` — Preview del build

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 (plugin de Vite, no postcss)
- shadcn/ui (estilo base-nova, iconos lucide-react)
- Zustand para estado global (con persistencia en localStorage)
- react-router-dom v7
- sonner para toasts
- jspdf + xlsx para exportación de reportes

## Arquitectura

```
src/
├── types/index.ts        — Tipos centrales (Producto, Variante, Venta, Compra, Proveedor)
├── store/useStore.ts     — Store Zustand con todo el estado y acciones
├── store/mockData.ts     — Datos de prueba
├── router/index.tsx      — Rutas (createBrowserRouter)
├── pages/               — Páginas por funcionalidad
├── components/
│   ├── ui/              — Componentes shadcn/ui
│   ├── layout/          — AppLayout, Sidebar, RolSwitch
│   └── shared/          — Componentes reutilizables (StockBadge, SearchInput, TicketView)
├── lib/
│   ├── utils.ts         — Utilidades (cn, generateId, etc.)
│   ├── constants.ts     — Constantes
│   └── reportes.ts      — Lógica de generación de reportes
```

## Convenciones

- Path alias: `@/` apunta a `src/`
- Componentes UI via shadcn: `npx shadcn@latest add <componente>`
- Sistema de roles: admin y vendedor (controlado por `rolActual` en el store)
- Idioma: español en UI, variables y nombres de archivos
- Estado centralizado en un solo store Zustand (`useStore`)
