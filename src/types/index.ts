export interface Categoria {
  id: string
  nombre: string
}

export interface Producto {
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

export interface Variante {
  id: string
  productoId: string
  nombre: string
  atributos: Record<string, string>
  precioVenta?: number
  stock: number
  stockMinimo: number
}

export interface Venta {
  id: string
  numeroTicket: string
  clienteNombre?: string
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
  subtotal: number
  descuento: number
  total: number
  creadoPor: 'admin' | 'vendedor'
  fecha: string
}

export interface VentaItem {
  id: string
  ventaId: string
  productoId: string
  varianteId?: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Compra {
  id: string
  proveedorId: string
  total: number
  fecha: string
  nota?: string
}

export interface CompraItem {
  id: string
  compraId: string
  productoId: string
  varianteId?: string
  cantidad: number
  costoUnitario: number
  subtotal: number
}

export interface Proveedor {
  id: string
  nombre: string
  telefono?: string
  email?: string
  nota?: string
}

export type Rol = 'admin' | 'vendedor'
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia'

export type { FuenteCatalogo, ConfigCatalogo, ProductoCatalogo } from './catalogo'
export { CONFIG_INICIAL } from './catalogo'
