import jsPDF from 'jspdf'
import type { ConfigCatalogo, ProductoCatalogo } from '@/types/catalogo'
import {
  crearContexto,
  renderizarPortada,
  renderizarProductos,
  renderizarTextoLibre,
  renderizarContraportada,
} from './plantillasPdf'

export function generarCatalogoPDF(config: ConfigCatalogo, productos: ProductoCatalogo[]) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const ctx = crearContexto(doc, config)

  renderizarPortada(ctx)
  renderizarProductos(ctx, productos)
  renderizarTextoLibre(ctx)
  renderizarContraportada(ctx)

  const nombreArchivo = `catalogo-${config.nombreNegocio.toLowerCase().replace(/\s+/g, '-')}.pdf`
  doc.save(nombreArchivo)
}
