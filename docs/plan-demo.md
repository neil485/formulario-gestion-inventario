# Plan: Demo "Tu Inventario" (Solo Frontend)

## Contexto

Un cliente que usa "Treinta" quiere su propio sistema de inventario. Su mayor dolor: **no saber existencias ni que productos resurtir**. Tambien quiere **dar tickets/comprobantes**.

Esta demo es **solo frontend con datos mock** — sin backend real. Si el cliente aprueba, se conecta a Supabase despues. Nombre provisional: "Tu Inventario".

**Stack**: React + TypeScript + Vite + Tailwind CSS

**Giro del negocio**: Calzado, ropa deportiva, balones (basketball, futbol, softball), celulares y accesorios de celulares.

---

## Alcance de la Demo

### INCLUIDO
| Modulo | Funcionalidades |
|--------|----------------|
| **Inventario** | Lista de productos con variantes (talla/color), stock en tiempo real, alerta stock bajo, busqueda por nombre/codigo |
| **Ventas (POS)** | Registrar venta, seleccionar productos/variantes, descuento de stock automatico |
| **Tickets** | Vista de ticket compartible por WhatsApp o imprimible |
| **Compras** | Registrar entrada de mercancia, stock sube automaticamente |
| **Dashboard** | Productos a resurtir (protagonista), ventas del dia, top productos |
| **Roles** | Vista admin vs vendedor (switch en UI, sin auth real) |
| **Reportes** | Descarga de reportes semanal/quincenal/mensual/anual en Excel y PDF |
| **Catalogo** | Generador de catalogos PDF con filtro por categorias |

### EXCLUIDO
- Backend/Supabase (se agrega si aprueba)
- Auth real, CRM, cotizaciones, credito, pagos mixtos
- Escaneo camara, factura electronica

---

## Datos Mock

Usar un store en memoria (Zustand) con datos iniciales:

### Datos de ejemplo precargados
- ~37 productos con 5 categorias (Calzado, Ropa Deportiva, Balones y Deportes, Celulares, Accesorios Celulares)
- Variantes realistas (tallas S/M/L/XL para ropa, 36-42 para calzado)
- 3 proveedores
- 10 ventas historicas
- 3 compras historicas
- Algunos productos con stock bajo/agotado para que el dashboard se vea util

### Estructura del store
```typescript
interface AppState {
  productos: Producto[]
  variantes: Variante[]
  categorias: Categoria[]
  ventas: Venta[]
  ventaItems: VentaItem[]
  compras: Compra[]
  compraItems: CompraItem[]
  proveedores: Proveedor[]
  rolActual: 'admin' | 'vendedor'
}
```

Los datos se persisten en `localStorage` para que no se pierdan al refrescar.

---

## Tipos principales

```typescript
interface Producto {
  id: string
  nombre: string
  descripcion?: string
  categoriaId: string
  precioCompra: number
  precioVenta: number
  codigoBarras?: string
  stockMinimo: number
  tieneVariantes: boolean
  stock: number
  activo: boolean
}

interface Variante {
  id: string
  productoId: string
  nombre: string // "Talla M - Rojo"
  atributos: Record<string, string>
  precioVenta?: number
  stock: number
  stockMinimo: number
}

interface Venta {
  id: string
  numeroTicket: string // "V-00001"
  clienteNombre?: string
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
  subtotal: number
  descuento: number
  total: number
  creadoPor: 'admin' | 'vendedor'
  fecha: string
}

interface VentaItem {
  id: string
  ventaId: string
  productoId: string
  varianteId?: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}
```

---

## Estructura del Proyecto

```
src/
  main.tsx
  App.tsx
  index.css

  lib/
    utils.ts              -- cn(), formatMoney(), generateId(), formatDate()
    constants.ts          -- Roles, metodos de pago
    reportes.ts           -- Generacion de Excel, PDF y catalogos

  types/
    index.ts              -- Todos los tipos

  store/
    useStore.ts           -- Zustand store con datos mock y acciones
    mockData.ts           -- Datos iniciales precargados

  components/
    ui/                   -- shadcn/ui (base-ui)
    layout/
      AppLayout.tsx       -- Sidebar + topbar + contenido
      Sidebar.tsx         -- Navegacion lateral responsive
      RolSwitch.tsx       -- Toggle admin/vendedor en la topbar
    shared/
      TicketView.tsx      -- Ticket compartible/imprimible
      StockBadge.tsx      -- Badge verde/amarillo/rojo
      SearchInput.tsx     -- Input de busqueda

  pages/
    Dashboard.tsx
    Productos.tsx
    ProductoForm.tsx
    ProductoDetalle.tsx
    NuevaVenta.tsx
    VentasHistorial.tsx
    Ticket.tsx
    NuevaCompra.tsx
    ComprasHistorial.tsx
    Proveedores.tsx
    Reportes.tsx
    Catalogo.tsx

  router/
    index.tsx
```

### Dependencias
- `react-router-dom`, `zustand`, `lucide-react`, `shadcn/ui`, `sonner`, `clsx`, `tailwind-merge`
- `xlsx` (generacion Excel), `jspdf` + `jspdf-autotable` (generacion PDF)

---

## Roles (sin auth, solo UI)

Toggle en la topbar para cambiar entre admin y vendedor.

| Funcionalidad | Admin | Vendedor |
|---------------|-------|----------|
| Dashboard completo | Si | Solo resumen basico |
| CRUD productos | Si | Solo lectura |
| Registrar ventas | Si | Si |
| Ver todos los tickets | Si | Solo los suyos |
| Compras/proveedores | Si | No (rutas ocultas) |
| Ver precios compra | Si | No |
| Reportes | Si | No (ruta oculta) |
| Catalogo | Si | No (ruta oculta) |

---

## Fases de Implementacion

### Fase 1: Scaffolding + Layout
- [x] Crear proyecto Vite + React + TS
- [x] Instalar Tailwind, shadcn, zustand, react-router, lucide-react, sonner
- [x] Configurar shadcn/ui con componentes base (base-ui v4)
- [x] `AppLayout.tsx` con sidebar responsive (mobile hamburger)
- [x] Router con todas las rutas
- [x] `RolSwitch.tsx` en topbar

### Fase 2: Store + Datos Mock
- [x] Definir tipos en `types/index.ts`
- [x] Crear store Zustand con acciones (CRUD productos, registrar venta, registrar compra)
- [x] Datos mock realistas en `mockData.ts` (calzado, ropa deportiva, balones, celulares, accesorios)
- [x] Persistencia en localStorage

### Fase 3: Inventario
- [x] `Productos.tsx`: tabla con busqueda, filtro por categoria, StockBadge
- [x] `ProductoForm.tsx`: formulario con seccion de variantes dinamica
- [x] `ProductoDetalle.tsx`: ver stock por variante
- [x] Paginacion basica en la tabla

### Fase 4: Ventas + Tickets
- [x] `NuevaVenta.tsx` (POS): barra de busqueda, carrito lateral, selector variante, cobrar
- [x] Al cobrar — resta stock automaticamente del store
- [x] `Ticket.tsx`: vista tipo ticket comercial con CSS @media print
- [x] Boton "Compartir por WhatsApp" (wa.me con resumen texto)
- [x] Boton "Imprimir/Descargar" (window.print)
- [x] `VentasHistorial.tsx`: tabla con fecha, total, link al ticket

### Fase 5: Compras + Proveedores
- [x] `Proveedores.tsx`: CRUD simple (tabla + dialog)
- [x] `NuevaCompra.tsx`: seleccionar proveedor, agregar items, al guardar suma stock
- [x] `ComprasHistorial.tsx`: lista de compras

### Fase 6: Dashboard + Pulido
- [x] **StockBajoWidget** (PROTAGONISTA): productos/variantes con stock <= minimo, ordenados por urgencia
- [x] **VentasHoyWidget**: total vendido, # ventas
- [x] **TopProductosWidget**: 5 mas vendidos del mes
- [x] Empty states, responsive final
- [ ] Verificar flujo completo (pendiente testing manual)

### Fase 7: Reportes + Catalogo (NUEVA)
- [x] `Reportes.tsx`: seleccion de periodo (semanal/quincenal/mensual/anual)
- [x] Exportar Excel con hojas: resumen, ventas, top productos, por categoria, por metodo pago, inventario
- [x] Exportar PDF con resumen financiero, top 10, desglose, detalle ventas
- [x] `Catalogo.tsx`: generador de catalogo PDF con filtro por categorias
- [x] Catalogo incluye portada, productos agrupados, precios, stock, variantes

### Fase 8: Deploy
- [ ] Deploy en Vercel
- [ ] Probar en movil

---

## Verificacion (flujo completo)

- [ ] Abrir app — ver dashboard con productos que necesitan resurtirse
- [ ] Ir a inventario — buscar producto, ver stock por variante
- [ ] Crear producto nuevo con variantes (tallas S/M/L)
- [ ] Registrar venta — agregar productos, cobrar en efectivo
- [ ] Ver ticket generado — compartir por WhatsApp
- [ ] Verificar que stock bajo en productos vendidos
- [ ] Registrar compra — verificar que stock sube
- [ ] Cambiar a rol vendedor — verificar restricciones
- [ ] Probar en mobile — sidebar responsive, POS funcional
- [ ] Descargar reporte Excel — verificar datos correctos
- [ ] Descargar reporte PDF — verificar formato
- [ ] Generar catalogo PDF — verificar categorias y productos
