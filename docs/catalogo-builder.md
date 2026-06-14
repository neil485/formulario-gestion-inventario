# Constructor de Catálogos Digitales (PDF)

## Resumen

Herramienta independiente para crear catálogos digitales en PDF, listos para compartir por WhatsApp y Facebook. Se construirá como proyecto separado y luego se integrará una demo en este sistema de inventario.

## Concepto principal: Editor visual tipo Canva

El corazón del constructor es un **editor de páginas visual** donde el usuario puede:
- Arrastrar y soltar elementos en cada página (drag & drop)
- Agregar textos con formato libre (tamaño, color, fuente, posición)
- Insertar imágenes y posicionarlas donde quiera
- Agregar formas (rectángulos, círculos, líneas, separadores)
- Cambiar colores de fondo por página
- Ver una vista previa en tiempo real de cada página
- Navegar entre páginas del catálogo

Cada página es un canvas editable, no un template rígido.

## Dos modos de carga de productos

### 1. Integrado con el sistema de inventario
- Botón "+" que abre categorías → multi-selección de productos
- Los productos se cargan con su imagen, nombre y precio desde el store
- Se posicionan como elementos arrastrables en la página

### 2. Standalone (sin inventario)
- Neil crea catálogos para clientes usando el constructor directamente
- Los productos se cargan manualmente (foto, nombre, precio, descripción)
- A futuro: dar acceso a clientes para que lo hagan solos

## Plantillas predefinidas

Plantillas que pre-posicionan elementos en las páginas (el usuario puede moverlos después):

| Plantilla | Uso | Layout |
|-----------|-----|--------|
| Menú restaurante | Comida, cafeterías | Secciones por categoría, sin fotos grandes |
| Catálogo ropa | Tiendas de ropa | Cards con foto grande, talla, precio |
| Lista de precios | Servicios, ferreterías | Tabla con descripción y precio |
| Catálogo general | Cualquier negocio | Cards con foto mediana, nombre, precio |

## Elementos del editor

| Elemento | Propiedades |
|----------|-------------|
| Texto | Contenido, fuente, tamaño, color, posición x/y, rotación |
| Imagen | Archivo, posición, tamaño, ajuste (cover/contain), borde |
| Forma | Tipo (rect/circle/line), color relleno, borde, tamaño, posición |
| Producto | Card con imagen+nombre+precio, estilo configurable, posición |
| Fondo | Color sólido o imagen por página |

## Estructura del catálogo

- **Portada**: Editable libremente (logo, nombre, slogan, imagen de fondo)
- **Páginas interiores**: Canvas libre con elementos posicionados
- **Contraportada**: QR code, contacto, lo que el usuario quiera agregar

## Especificaciones

- Formato: PDF optimizado (liviano para WhatsApp)
- Páginas: 20-50 máximo
- QR Code: enlace a contacto de WhatsApp o redes del negocio
- Color: Selector libre (color picker completo)
- Imágenes: Subida directa, se incrustan en el PDF

## Flujo del constructor

```
1. Elegir plantilla (o empezar en blanco)
2. Configurar datos del negocio (nombre, logo, contacto)
3. Editar páginas visualmente:
   - Agregar/mover/redimensionar elementos
   - Insertar productos (desde inventario o manual)
   - Personalizar colores, fondos, textos
4. Navegar entre páginas, agregar/eliminar páginas
5. Vista previa final del PDF completo
6. Exportar PDF + generar QR
```

## Proyecto separado

- Repo: `~/Proyectos/catalogo-builder/` (por crear)
- Stack: React + TypeScript + Tailwind + jsPDF
- Canvas/editor: librería de drag & drop (probablemente react-dnd o similar)
- Será el producto que se ofrezca a emprendedores como servicio de Corinto Digital

## Integración con este proyecto (demo)

Una vez construido el catalogo-builder, la sección `/catalogo` de este inventario se reemplazará con una versión integrada que:
- Jala productos directamente del store del inventario
- Usa el mismo editor visual
- Genera el PDF final

La demo actual es un placeholder funcional que muestra el concepto básico.

## Modelo de negocio

- Servicio: Neil crea el catálogo para el cliente
- Producto: Acceso al constructor para que el cliente lo haga solo (futuro)
- Recurrente: Actualización mensual del catálogo con nuevos productos
