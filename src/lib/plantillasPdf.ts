import jsPDF from 'jspdf'
import type { ConfigCatalogo, ProductoCatalogo } from '@/types/catalogo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GState = (doc: jsPDF, opts: Record<string, unknown>) => new (doc as any).GState(opts)

interface RenderContext {
  doc: jsPDF
  config: ConfigCatalogo
  pageWidth: number
  pageHeight: number
  margin: number
  contentWidth: number
  rgb: [number, number, number]
  rgb2: [number, number, number]
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

function formatPrecio(amount: number): string {
  return 'C$' + new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

function agruparPorCategoria(productos: ProductoCatalogo[]): Record<string, ProductoCatalogo[]> {
  return productos.reduce<Record<string, ProductoCatalogo[]>>((acc, prod) => {
    const cat = prod.categoria || 'Sin categoria'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(prod)
    return acc
  }, {})
}

function agregarFondo(ctx: RenderContext) {
  const { doc, config, pageWidth, pageHeight } = ctx
  if (config.imagenFondo) {
    try {
      doc.addImage(config.imagenFondo, 'JPEG', 0, 0, pageWidth, pageHeight)
      doc.setFillColor(255, 255, 255)
      doc.setGState(GState(doc, { opacity: 0.85 }))
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      doc.setGState(GState(doc, { opacity: 1 }))
    } catch { /* continuar sin fondo */ }
  }
}

function nuevaPagina(ctx: RenderContext) {
  ctx.doc.addPage()
  agregarFondo(ctx)
}

function verificarEspacio(ctx: RenderContext, y: number, necesita: number): number {
  if (y + necesita > ctx.pageHeight - ctx.margin) {
    nuevaPagina(ctx)
    return ctx.margin
  }
  return y
}

// Grid 3 columnas con cards
export function renderizarProductos(ctx: RenderContext, productos: ProductoCatalogo[]) {
  const { doc, margin, contentWidth } = ctx
  const [r, g, b] = ctx.rgb
  const grupos = agruparPorCategoria(productos)

  const columnas = 3
  const gap = 6
  const cardWidth = (contentWidth - gap * (columnas - 1)) / columnas
  const imgHeight = 25
  const cardHeight = 45

  for (const [categoria, prods] of Object.entries(grupos)) {
    nuevaPagina(ctx)
    let y = margin

    // Titulo categoria
    doc.setFillColor(r, g, b)
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont(ctx.config.fuente, 'bold')
    doc.text(categoria, margin + 5, y + 7)
    y += 16

    let col = 0
    for (const prod of prods) {
      y = verificarEspacio(ctx, y, cardHeight + 5)
      if (y === margin) {
        doc.setFillColor(r, g, b)
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont(ctx.config.fuente, 'bold')
        doc.text(categoria + ' (cont.)', margin + 5, y + 7)
        y += 16
        col = 0
      }

      const x = margin + col * (cardWidth + gap)

      // Card
      doc.setDrawColor(220, 220, 220)
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD')

      // Imagen
      if (prod.imagen) {
        try {
          doc.addImage(prod.imagen, 'JPEG', x + 2, y + 2, cardWidth - 4, imgHeight)
        } catch {
          doc.setFillColor(240, 240, 240)
          doc.rect(x + 2, y + 2, cardWidth - 4, imgHeight, 'F')
        }
      } else {
        doc.setFillColor(245, 245, 245)
        doc.rect(x + 2, y + 2, cardWidth - 4, imgHeight, 'F')
      }

      // Nombre
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(8)
      doc.setFont(ctx.config.fuente, 'bold')
      const nombreCorto = prod.nombre.length > 25 ? prod.nombre.slice(0, 25) + '...' : prod.nombre
      doc.text(nombreCorto, x + 3, y + imgHeight + 7)

      // Precio
      doc.setTextColor(r, g, b)
      doc.setFontSize(10)
      doc.setFont(ctx.config.fuente, 'bold')
      doc.text(formatPrecio(prod.precio), x + 3, y + imgHeight + 14)

      col++
      if (col >= columnas) {
        col = 0
        y += cardHeight + gap
      }
    }
  }
}

// Portada
export function renderizarPortada(ctx: RenderContext) {
  const { doc, config, pageWidth, pageHeight } = ctx
  const [r, g, b] = ctx.rgb

  doc.setFont(config.fuente, 'normal')
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  if (config.imagenPortada) {
    try {
      doc.addImage(config.imagenPortada, 'JPEG', 0, 0, pageWidth, pageHeight)
      doc.setFillColor(r, g, b)
      doc.setGState(GState(doc, { opacity: 0.6 }))
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      doc.setGState(GState(doc, { opacity: 1 }))
    } catch { /* continuar */ }
  }

  // Logo
  if (config.imagenLogo) {
    try {
      doc.addImage(config.imagenLogo, 'PNG', pageWidth / 2 - 20, pageHeight / 2 - 55, 40, 40)
    } catch { /* continuar */ }
  }

  const baseY = config.imagenLogo ? pageHeight / 2 : pageHeight / 2 - 15

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont(config.fuente, 'bold')
  doc.text(config.nombreNegocio, pageWidth / 2, baseY, { align: 'center' })

  if (config.slogan) {
    doc.setFontSize(14)
    doc.setFont(config.fuente, 'normal')
    doc.text(config.slogan, pageWidth / 2, baseY + 15, { align: 'center' })
  }

  if (config.telefono) {
    doc.setFontSize(11)
    doc.text(`WhatsApp: ${config.telefono}`, pageWidth / 2, baseY + 30, { align: 'center' })
  }
}

// Texto libre
export function renderizarTextoLibre(ctx: RenderContext) {
  if (!ctx.config.textoLibre) return
  const { doc, config, margin, contentWidth } = ctx

  nuevaPagina(ctx)
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(11)
  doc.setFont(config.fuente, 'normal')
  const lineas = doc.splitTextToSize(config.textoLibre, contentWidth)
  doc.text(lineas, margin, margin + 10)
}

// Contraportada
export function renderizarContraportada(ctx: RenderContext) {
  const { doc, config, pageWidth, pageHeight } = ctx
  const [r, g, b] = ctx.rgb

  doc.addPage()
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  if (config.imagenPortada) {
    try {
      doc.addImage(config.imagenPortada, 'JPEG', 0, 0, pageWidth, pageHeight)
      doc.setFillColor(r, g, b)
      doc.setGState(GState(doc, { opacity: 0.7 }))
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      doc.setGState(GState(doc, { opacity: 1 }))
    } catch { /* continuar */ }
  }

  if (config.imagenLogo) {
    try {
      doc.addImage(config.imagenLogo, 'PNG', pageWidth / 2 - 15, pageHeight / 2 - 45, 30, 30)
    } catch { /* continuar */ }
  }

  const baseY = config.imagenLogo ? pageHeight / 2 : pageHeight / 2 - 20

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(config.fuente, 'bold')
  doc.text(config.nombreNegocio, pageWidth / 2, baseY, { align: 'center' })

  if (config.telefono) {
    doc.setFontSize(14)
    doc.setFont(config.fuente, 'normal')
    doc.text(`WhatsApp: ${config.telefono}`, pageWidth / 2, baseY + 15, { align: 'center' })
  }

  doc.setFontSize(10)
  doc.text('Escanea el codigo QR para contactarnos', pageWidth / 2, baseY + 30, { align: 'center' })

  // Placeholder QR
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(pageWidth / 2 - 20, baseY + 38, 40, 40, 3, 3, 'F')
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text('QR CODE', pageWidth / 2, baseY + 60, { align: 'center' })
}

export function crearContexto(doc: jsPDF, config: ConfigCatalogo): RenderContext {
  return {
    doc,
    config,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    margin: 15,
    contentWidth: doc.internal.pageSize.getWidth() - 30,
    rgb: hexToRgb(config.colorPrimario),
    rgb2: hexToRgb(config.colorSecundario),
  }
}
