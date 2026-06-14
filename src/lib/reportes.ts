import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Producto, Variante, Venta, VentaItem, Compra, CompraItem, Categoria, Proveedor } from '@/types'
import { formatMoney } from './utils'

interface DatosReporte {
  productos: Producto[]
  variantes: Variante[]
  categorias: Categoria[]
  ventas: Venta[]
  ventaItems: VentaItem[]
  compras: Compra[]
  compraItems: CompraItem[]
  proveedores: Proveedor[]
  fechaInicio: Date
  fechaFin: Date
  periodo: string
}

function filtrarPorFecha<T extends { fecha: string }>(items: T[], inicio: Date, fin: Date) {
  return items.filter((item) => {
    const fecha = new Date(item.fecha)
    return fecha >= inicio && fecha <= fin
  })
}

function generarDatosReporte(datos: DatosReporte) {
  const ventasPeriodo = filtrarPorFecha(datos.ventas, datos.fechaInicio, datos.fechaFin)
  const comprasPeriodo = filtrarPorFecha(datos.compras, datos.fechaInicio, datos.fechaFin)

  const idsVentas = new Set(ventasPeriodo.map((v) => v.id))
  const itemsVentas = datos.ventaItems.filter((vi) => idsVentas.has(vi.ventaId))

  const idsCompras = new Set(comprasPeriodo.map((c) => c.id))
  const itemsCompras = datos.compraItems.filter((ci) => idsCompras.has(ci.compraId))

  const totalVentas = ventasPeriodo.reduce((acc, v) => acc + v.total, 0)
  const totalDescuentos = ventasPeriodo.reduce((acc, v) => acc + v.descuento, 0)
  const totalCompras = comprasPeriodo.reduce((acc, v) => acc + v.total, 0)

  // Productos mas vendidos
  const conteo: Record<string, number> = {}
  const ingresos: Record<string, number> = {}
  for (const item of itemsVentas) {
    conteo[item.productoId] = (conteo[item.productoId] || 0) + item.cantidad
    ingresos[item.productoId] = (ingresos[item.productoId] || 0) + item.subtotal
  }
  const topProductos = Object.entries(conteo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, cantidad]) => {
      const producto = datos.productos.find((p) => p.id === id)
      return {
        nombre: producto?.nombre || 'Desconocido',
        cantidad,
        ingresos: ingresos[id] || 0,
      }
    })

  // Ventas por metodo de pago
  const porMetodo: Record<string, { cantidad: number; total: number }> = {}
  for (const v of ventasPeriodo) {
    if (!porMetodo[v.metodoPago]) porMetodo[v.metodoPago] = { cantidad: 0, total: 0 }
    porMetodo[v.metodoPago].cantidad++
    porMetodo[v.metodoPago].total += v.total
  }

  // Ventas por categoria
  const porCategoria: Record<string, { cantidad: number; total: number }> = {}
  for (const item of itemsVentas) {
    const producto = datos.productos.find((p) => p.id === item.productoId)
    const cat = datos.categorias.find((c) => c.id === producto?.categoriaId)
    const nombre = cat?.nombre || 'Sin categoria'
    if (!porCategoria[nombre]) porCategoria[nombre] = { cantidad: 0, total: 0 }
    porCategoria[nombre].cantidad += item.cantidad
    porCategoria[nombre].total += item.subtotal
  }

  return {
    ventasPeriodo,
    comprasPeriodo,
    itemsVentas,
    itemsCompras,
    totalVentas,
    totalDescuentos,
    totalCompras,
    ganancia: totalVentas - totalCompras,
    topProductos,
    porMetodo,
    porCategoria,
  }
}

function formatFecha(date: Date) {
  return date.toLocaleDateString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function exportarExcel(datos: DatosReporte) {
  const reporte = generarDatosReporte(datos)
  const wb = XLSX.utils.book_new()

  // Hoja Resumen
  const resumen = [
    ['REPORTE DE INVENTARIO - Tu Inventario'],
    [`Periodo: ${datos.periodo}`],
    [`Desde: ${formatFecha(datos.fechaInicio)} - Hasta: ${formatFecha(datos.fechaFin)}`],
    [],
    ['RESUMEN FINANCIERO'],
    ['Total Ventas', reporte.totalVentas],
    ['Total Descuentos', reporte.totalDescuentos],
    ['Total Compras', reporte.totalCompras],
    ['Ganancia Neta', reporte.ganancia],
    ['Cantidad de Ventas', reporte.ventasPeriodo.length],
    ['Cantidad de Compras', reporte.comprasPeriodo.length],
  ]
  const wsResumen = XLSX.utils.aoa_to_sheet(resumen)
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

  // Hoja Ventas
  const ventasData = [
    ['Ticket', 'Fecha', 'Cliente', 'Metodo Pago', 'Subtotal', 'Descuento', 'Total'],
    ...reporte.ventasPeriodo.map((v) => [
      v.numeroTicket,
      formatFecha(new Date(v.fecha)),
      v.clienteNombre || '-',
      v.metodoPago,
      v.subtotal,
      v.descuento,
      v.total,
    ]),
  ]
  const wsVentas = XLSX.utils.aoa_to_sheet(ventasData)
  XLSX.utils.book_append_sheet(wb, wsVentas, 'Ventas')

  // Hoja Top Productos
  const topData = [
    ['Producto', 'Cantidad Vendida', 'Ingresos'],
    ...reporte.topProductos.map((t) => [t.nombre, t.cantidad, t.ingresos]),
  ]
  const wsTop = XLSX.utils.aoa_to_sheet(topData)
  XLSX.utils.book_append_sheet(wb, wsTop, 'Top Productos')

  // Hoja por Categoria
  const catData = [
    ['Categoria', 'Unidades Vendidas', 'Total'],
    ...Object.entries(reporte.porCategoria).map(([nombre, d]) => [nombre, d.cantidad, d.total]),
  ]
  const wsCat = XLSX.utils.aoa_to_sheet(catData)
  XLSX.utils.book_append_sheet(wb, wsCat, 'Por Categoria')

  // Hoja por Metodo de Pago
  const metodoData = [
    ['Metodo', 'Cantidad Ventas', 'Total'],
    ...Object.entries(reporte.porMetodo).map(([nombre, d]) => [nombre, d.cantidad, d.total]),
  ]
  const wsMetodo = XLSX.utils.aoa_to_sheet(metodoData)
  XLSX.utils.book_append_sheet(wb, wsMetodo, 'Por Metodo Pago')

  // Hoja Inventario Actual
  const invData = [
    ['Producto', 'Categoria', 'P. Compra', 'P. Venta', 'Stock', 'Stock Minimo', 'Estado'],
    ...datos.productos.filter((p) => p.activo).map((p) => {
      const cat = datos.categorias.find((c) => c.id === p.categoriaId)
      const stockTotal = p.tieneVariantes
        ? datos.variantes.filter((v) => v.productoId === p.id).reduce((acc, v) => acc + v.stock, 0)
        : p.stock
      const minimo = p.tieneVariantes
        ? Math.min(...datos.variantes.filter((v) => v.productoId === p.id).map((v) => v.stockMinimo))
        : p.stockMinimo
      return [
        p.nombre,
        cat?.nombre || '',
        p.precioCompra,
        p.precioVenta,
        stockTotal,
        minimo,
        stockTotal === 0 ? 'AGOTADO' : stockTotal <= minimo ? 'BAJO' : 'OK',
      ]
    }),
  ]
  const wsInv = XLSX.utils.aoa_to_sheet(invData)
  XLSX.utils.book_append_sheet(wb, wsInv, 'Inventario Actual')

  XLSX.writeFile(wb, `reporte_${datos.periodo.toLowerCase().replace(/\s/g, '_')}_${formatFecha(datos.fechaInicio).replace(/\//g, '-')}.xlsx`)
}

export function exportarPDF(datos: DatosReporte) {
  const reporte = generarDatosReporte(datos)
  const doc = new jsPDF()

  // Titulo
  doc.setFontSize(18)
  doc.text('Reporte - Tu Inventario', 14, 20)
  doc.setFontSize(11)
  doc.text(`Periodo: ${datos.periodo}`, 14, 28)
  doc.text(`${formatFecha(datos.fechaInicio)} - ${formatFecha(datos.fechaFin)}`, 14, 34)

  // Resumen financiero
  doc.setFontSize(14)
  doc.text('Resumen Financiero', 14, 46)
  autoTable(doc, {
    startY: 50,
    head: [['Concepto', 'Monto']],
    body: [
      ['Total Ventas', formatMoney(reporte.totalVentas)],
      ['Total Descuentos', formatMoney(reporte.totalDescuentos)],
      ['Total Compras', formatMoney(reporte.totalCompras)],
      ['Ganancia Neta', formatMoney(reporte.ganancia)],
      ['# Ventas', String(reporte.ventasPeriodo.length)],
      ['# Compras', String(reporte.comprasPeriodo.length)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
  })

  // Top productos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFinalY = () => (doc as any).lastAutoTable?.finalY ?? 100
  const y1 = getFinalY()
  doc.setFontSize(14)
  doc.text('Top 10 Productos Vendidos', 14, y1 + 12)
  autoTable(doc, {
    startY: y1 + 16,
    head: [['#', 'Producto', 'Cantidad', 'Ingresos']],
    body: reporte.topProductos.map((t, i) => [
      String(i + 1),
      t.nombre,
      String(t.cantidad),
      formatMoney(t.ingresos),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
  })

  // Ventas por categoria
  const y2 = getFinalY()
  if (y2 > 240) doc.addPage()
  const y2Start = y2 > 240 ? 20 : y2 + 12
  doc.setFontSize(14)
  doc.text('Ventas por Categoria', 14, y2Start)
  autoTable(doc, {
    startY: y2Start + 4,
    head: [['Categoria', 'Unidades', 'Total']],
    body: Object.entries(reporte.porCategoria).map(([nombre, d]) => [
      nombre,
      String(d.cantidad),
      formatMoney(d.total),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
  })

  // Ventas por metodo de pago
  const y3 = getFinalY()
  if (y3 > 240) doc.addPage()
  const y3Start = y3 > 240 ? 20 : y3 + 12
  doc.setFontSize(14)
  doc.text('Ventas por Metodo de Pago', 14, y3Start)
  autoTable(doc, {
    startY: y3Start + 4,
    head: [['Metodo', '# Ventas', 'Total']],
    body: Object.entries(reporte.porMetodo).map(([nombre, d]) => [
      nombre,
      String(d.cantidad),
      formatMoney(d.total),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
  })

  // Detalle de ventas en nueva pagina
  doc.addPage()
  doc.setFontSize(14)
  doc.text('Detalle de Ventas', 14, 20)
  autoTable(doc, {
    startY: 24,
    head: [['Ticket', 'Fecha', 'Cliente', 'Pago', 'Total']],
    body: reporte.ventasPeriodo.map((v) => [
      v.numeroTicket,
      formatFecha(new Date(v.fecha)),
      v.clienteNombre || '-',
      v.metodoPago,
      formatMoney(v.total),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
    styles: { fontSize: 9 },
  })

  doc.save(`reporte_${datos.periodo.toLowerCase().replace(/\s/g, '_')}_${formatFecha(datos.fechaInicio).replace(/\//g, '-')}.pdf`)
}

export function generarCatalogoPDF(
  productos: Producto[],
  variantes: Variante[],
  categorias: Categoria[],
  nombreNegocio: string,
  categoriasFiltro: string[],
) {
  const doc = new jsPDF()

  // Portada
  doc.setFontSize(28)
  doc.text(nombreNegocio, 105, 80, { align: 'center' })
  doc.setFontSize(16)
  doc.text('Catalogo de Productos', 105, 95, { align: 'center' })
  doc.setFontSize(11)
  doc.text(new Date().toLocaleDateString('es-NI', { day: '2-digit', month: 'long', year: 'numeric' }), 105, 108, { align: 'center' })

  const productosActivos = productos.filter((p) => {
    if (!p.activo) return false
    if (categoriasFiltro.length > 0 && !categoriasFiltro.includes(p.categoriaId)) return false
    return true
  })

  // Agrupar por categoria
  const porCategoria: Record<string, Producto[]> = {}
  for (const p of productosActivos) {
    const cat = categorias.find((c) => c.id === p.categoriaId)
    const nombre = cat?.nombre || 'Sin categoria'
    if (!porCategoria[nombre]) porCategoria[nombre] = []
    porCategoria[nombre].push(p)
  }

  for (const [catNombre, prods] of Object.entries(porCategoria)) {
    doc.addPage()
    doc.setFontSize(18)
    doc.text(catNombre, 14, 20)
    doc.setDrawColor(30, 30, 30)
    doc.line(14, 23, 196, 23)

    const rows = prods.map((p) => {
      const vars = variantes.filter((v) => v.productoId === p.id)
      const stockTotal = p.tieneVariantes
        ? vars.reduce((acc, v) => acc + v.stock, 0)
        : p.stock
      const variantesTexto = p.tieneVariantes
        ? vars.map((v) => `${v.nombre} (${v.stock})`).join(', ')
        : '-'
      return [
        p.nombre,
        formatMoney(p.precioVenta),
        String(stockTotal),
        variantesTexto,
      ]
    })

    autoTable(doc, {
      startY: 28,
      head: [['Producto', 'Precio', 'Stock', 'Variantes']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 80 },
      },
    })
  }

  // Pie
  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`${nombreNegocio} - Pagina ${i} de ${totalPaginas}`, 105, 290, { align: 'center' })
  }

  doc.save(`catalogo_${nombreNegocio.toLowerCase().replace(/\s/g, '_')}.pdf`)
}
