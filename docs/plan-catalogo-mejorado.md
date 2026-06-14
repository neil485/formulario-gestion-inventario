# Plan: Mejora del Catalogo PDF - "Tu Inventario"

## Contexto

El catalogo actual (`src/pages/Catalogo.tsx`) era un wizard funcional de 3 pasos con un solo layout de PDF. Se mejoro con: mejor personalizacion y la posibilidad de crear catalogos sin depender del inventario (modo standalone/manual).

> **Nota:** Se decidio mantener solo la plantilla General (grid 3 cols) ya que este proyecto es gestion de inventario. Las plantillas extra (menu, ropa, lista-precios) se pueden agregar despues para Corinto Digital.

---

## Fase 1: Tipos y fundamentos

- [x] Crear `src/types/catalogo.ts` con tipos nuevos:
  - ~~`TipoPlantilla`~~ (eliminado - solo plantilla general)
  - [x] `ConfigCatalogo`: colorSecundario, fuente, imagenLogo
  - [x] `ProductoCatalogo`: descripcion, esManual (reemplaza ProductoSeleccionado)
  - [x] `CONFIG_INICIAL`: constante con valores por defecto
- [x] Actualizar `src/types/index.ts` con re-export de catalogo

---

## Fase 2: Logica PDF refactorizada

- [x] Crear `src/lib/plantillasPdf.ts` con funciones separadas:
  - [x] `renderizarPortada()` - con soporte logo, imagen portada, fuente configurable
  - [x] `renderizarProductos()` - Grid 3 cols, cards con foto + nombre + precio
  - [x] `renderizarTextoLibre()` - pagina dedicada si hay texto
  - [x] `renderizarContraportada()` - con logo, QR placeholder, WhatsApp
  - [x] `crearContexto()` - helper para crear el contexto de renderizado
  - [x] `hexToRgb()` - utilidad exportada
- [x] Refactorizar `src/lib/catalogoPdf.ts`:
  - [x] Simplificado a 5 lineas que delega todo a plantillasPdf.ts
  - [x] Soporte de fuente configurable (helvetica/times/courier)
  - [x] Soporte color secundario

---

## Fase 3: Wizard mejorado (Catalogo.tsx)

### Paso 1: Configuracion
- [x] Campos: nombre negocio, slogan, telefono
- [x] Color primario + color secundario
- [x] Selector de fuente (helvetica/times/courier)
- [x] Subir logo del negocio
- [x] Subir imagen de portada
- [x] Subir imagen de fondo para paginas
- [x] Texto libre adicional

### Paso 2: Productos (modo dual)
- [x] Tab "Desde inventario": comportamiento con categorias/checkboxes
  - [x] Incluir descripcion del producto del store al agregar
- [x] Tab "Agregar manual": formulario con nombre, precio, descripcion, categoria, imagen
  - [x] Boton "Agregar al catalogo"
  - [x] Productos manuales marcados con `esManual: true` y badge visual
- [x] Lista compartida de productos seleccionados arriba de los tabs
- [x] Si inventario vacio, tab manual por defecto

### Paso 3: Preview y Exportar
- [x] Preview de portada con logo, colores e imagen
- [x] Preview de productos agrupados por categoria
- [x] Preview de contraportada con QR placeholder
- [x] Boton descargar PDF

---

## Fase 4: Verificacion

- [x] TypeScript compila sin errores (nuestros archivos)
- [ ] Probar wizard completo navegando a `/catalogo`
- [ ] Probar modo inventario: seleccionar productos -> preview -> descargar PDF
- [ ] Probar modo standalone: agregar productos manuales sin usar inventario
- [ ] Probar modo mixto: productos del inventario + manuales juntos
- [ ] Verificar PDF descargado: portada, productos en grid, texto libre, contraportada
- [ ] `npm run build` - build de produccion (3 errores pre-existentes no relacionados)

---

## Archivos involucrados

| Archivo | Accion | Estado |
|---------|--------|--------|
| `src/types/catalogo.ts` | Crear | Hecho |
| `src/types/index.ts` | Modificar (re-export) | Hecho |
| `src/lib/plantillasPdf.ts` | Crear | Hecho |
| `src/lib/catalogoPdf.ts` | Refactorizar | Hecho |
| `src/pages/Catalogo.tsx` | Refactorizar (wizard 3 pasos + modo dual) | Hecho |

## Arquitectura PDF

```
generarCatalogoPDF(config, productos)
  |-- renderizarPortada(ctx)            // logo, nombre, slogan, telefono
  |-- renderizarProductos(ctx, prods)   // grid 3 cols agrupado por categoria
  |-- renderizarTextoLibre(ctx)         // pagina con texto adicional
  |-- renderizarContraportada(ctx)      // logo, QR, contacto
```

## Descartado (para Corinto Digital despues)

- Plantilla Menu restaurante (nombre...dots...precio)
- Plantilla Catalogo ropa (fotos grandes + tallas)
- Plantilla Lista de precios (tabla con jspdf-autotable)
- Paso 3 "Personalizar" separado (se integro en paso 1)
- Preview con aspecto A4 y navegacion por paginas
