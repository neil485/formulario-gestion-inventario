# Documentacion Tecnica - Tu Inventario

## Stack Tecnologico

| Tecnologia | Version | Uso |
|-----------|---------|-----|
| React | 19 | UI |
| TypeScript | 5.8 | Tipado |
| Vite | 8 | Bundler |
| Tailwind CSS | 4 | Estilos |
| shadcn/ui | v4 (base-ui) | Componentes UI |
| Zustand | 5 | Estado global + persistencia localStorage |
| React Router | 7 | Navegacion SPA |
| Lucide React | - | Iconos |
| Sonner | - | Notificaciones toast |
| xlsx | - | Generacion archivos Excel |
| jsPDF + jspdf-autotable | - | Generacion archivos PDF |

---

## Arquitectura

### Estado Global (Zustand)
El store centraliza todo el estado en `src/store/useStore.ts`:
- Datos: productos, variantes, categorias, ventas, ventaItems, compras, compraItems, proveedores
- Rol actual (admin/vendedor)
- Acciones CRUD para cada entidad
- Helpers: `getStockProducto()`, `getProductosStockBajo()`
- Persistencia automatica en `localStorage` con key `tu-inventario-storage`

### Datos Mock
Definidos en `src/store/mockData.ts`. Se cargan como estado inicial del store.
Si ya hay datos en localStorage, Zustand usa esos en vez de los mock.
Para resetear: `localStorage.clear()` y recargar.

### Moneda
Formato: Cordobas nicaraguenses (NIO) via `Intl.NumberFormat('es-NI')`

---

## Categorias de Productos

| ID | Categoria | Tipo de Productos |
|----|-----------|-------------------|
| cat-1 | Calzado | Tenis Nike/Adidas, zapatos escolares, sandalias, botas, chancletas |
| cat-2 | Ropa Deportiva | Camisetas dry-fit, shorts, licras, conjuntos, sudaderas, calcetas |
| cat-3 | Balones y Deportes | Basketball, futbol, softball, voleibol, guantes, bates, rodilleras |
| cat-4 | Celulares | Samsung Galaxy A15/A25, Xiaomi Redmi 13C/Note 13, Tecno Spark |
| cat-5 | Accesorios Celulares | Cargadores, cables, protectores, forros, audifonos, power banks, memorias |

### Variantes
- **Calzado**: Tallas 36-42 (7 variantes por producto)
- **Ropa Deportiva**: Tallas S, M, L, XL (4 variantes por producto)
- **Balones, Celulares, Accesorios**: Sin variantes (stock directo en producto)

---

## Paginas y Rutas

| Ruta | Pagina | Acceso | Descripcion |
|------|--------|--------|-------------|
| `/` | Dashboard | Todos | Metricas, stock bajo, top productos |
| `/productos` | Productos | Todos | Tabla inventario con busqueda/filtro/paginacion |
| `/productos/nuevo` | ProductoForm | Admin | Crear producto con variantes |
| `/productos/:id` | ProductoDetalle | Todos | Ver detalle y stock por variante |
| `/productos/:id/editar` | ProductoForm | Admin | Editar producto existente |
| `/ventas/nueva` | NuevaVenta | Todos | POS: carrito, busqueda, cobrar |
| `/ventas` | VentasHistorial | Todos* | Tabla de ventas (*vendedor ve solo las suyas) |
| `/ventas/:id/ticket` | Ticket | Todos | Ticket imprimible/compartible |
| `/compras/nueva` | NuevaCompra | Admin | Registrar compra a proveedor |
| `/compras` | ComprasHistorial | Admin | Historial de compras |
| `/proveedores` | Proveedores | Admin | CRUD proveedores |
| `/reportes` | Reportes | Admin | Descarga reportes Excel/PDF |
| `/catalogo` | Catalogo | Admin | Generador catalogo PDF |

---

## Funcionalidades Implementadas

### 1. Inventario
- Tabla con busqueda por nombre/codigo
- Filtro por categoria (Select)
- Paginacion (10 items por pagina)
- StockBadge: verde (OK), amarillo (bajo), rojo (agotado)
- CRUD completo (admin): crear, editar, eliminar productos
- Soporte variantes dinamicas en formulario
- Vista detalle con stock desglosado por variante

### 2. POS (Punto de Venta)
- Busqueda de productos en tiempo real
- Grid de productos con botones por variante
- Carrito lateral con +/- cantidad
- Validacion de stock disponible
- Campo cliente (opcional), metodo de pago, descuento
- Al cobrar: resta stock automaticamente y genera ticket

### 3. Tickets
- Vista tipo ticket comercial
- Boton "Imprimir" (window.print con CSS @media print)
- Boton "Compartir por WhatsApp" (wa.me con resumen texto)
- Detalle de items, subtotal, descuento, total, metodo de pago

### 4. Compras
- Seleccionar proveedor de lista
- Agregar items con cantidad y costo unitario editables
- Al guardar: suma stock automaticamente
- Historial de compras con proveedor, fecha, nota, total

### 5. Proveedores
- CRUD en tabla + dialog modal
- Campos: nombre, telefono, email, nota

### 6. Dashboard
- **Widget Stock Bajo** (protagonista): lista ordenada por urgencia (stock 0 primero)
- **Widget Ventas Hoy**: total en cordobas + numero de ventas
- **Widget Top 5 Productos**: mas vendidos en ultimos 30 dias
- Top productos solo visible para admin

### 7. Roles
- Switch en topbar (admin/vendedor)
- Admin: acceso completo
- Vendedor: solo ventas, lectura inventario, sus tickets, dashboard basico
- Sidebar filtra rutas segun rol

### 8. Reportes
- Periodos: semanal (7d), quincenal (15d), mensual (30d), anual (365d)
- **Excel** (xlsx): 6 hojas - Resumen, Ventas, Top Productos, Por Categoria, Por Metodo Pago, Inventario Actual
- **PDF** (jsPDF): Resumen financiero, top 10, ventas por categoria, por metodo pago, detalle ventas

### 9. Catalogo PDF (mejorado)
- Wizard 3 pasos: Configuracion → Productos → Preview
- Configuracion: nombre, slogan, telefono, colores (primario/secundario), fuente, logo, portada, fondo, texto libre
- Modo dual para productos:
  - Tab "Desde inventario": seleccion por categoria con checkboxes
  - Tab "Agregar manual": formulario standalone (no depende del inventario)
- Preview visual con portada, productos agrupados por categoria, contraportada
- PDF profesional: portada con logo/imagen, grid 3 cols por categoria, texto libre, contraportada con QR placeholder
- Soporte para logo del negocio en portada y contraportada
- Fuente configurable (helvetica/times/courier)

---

## Notas Tecnicas

### shadcn/ui v4 (base-ui)
Esta version usa `@base-ui/react` en vez de Radix. Diferencias clave:
- No existe `asChild` - se usa prop `render` para composicion
- `Select.onValueChange` puede recibir `null` - siempre validar antes de setState
- Los componentes usan `data-slot` para estilos

### Persistencia
Zustand persiste todo el estado en `localStorage` con key `tu-inventario-storage`.
Si se cambian los datos mock, hay que limpiar localStorage para que surtan efecto:
```javascript
localStorage.clear()
// luego recargar la pagina
```

### Formato Moneda
Se usa `Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' })` para formatear en Cordobas.

---

## Pendiente (Fase 8)
- [ ] Deploy en Vercel
- [ ] Testing en dispositivos moviles
- [ ] Verificacion flujo completo end-to-end
