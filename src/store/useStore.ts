import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Producto, Variante, Categoria, Venta, VentaItem, Compra, CompraItem, Proveedor, Rol, MetodoPago } from '@/types'
import { generateId, generarNumeroTicket } from '@/lib/utils'
import {
  productosMock,
  variantesMock,
  categoriasMock,
  ventasMock,
  ventaItemsMock,
  comprasMock,
  compraItemsMock,
  proveedoresMock,
} from './mockData'

interface AppState {
  productos: Producto[]
  variantes: Variante[]
  categorias: Categoria[]
  ventas: Venta[]
  ventaItems: VentaItem[]
  compras: Compra[]
  compraItems: CompraItem[]
  proveedores: Proveedor[]
  rolActual: Rol

  // Acciones
  setRol: (rol: Rol) => void

  // Productos
  agregarProducto: (producto: Omit<Producto, 'id'>, variantes?: Omit<Variante, 'id' | 'productoId'>[]) => void
  editarProducto: (id: string, datos: Partial<Producto>) => void
  eliminarProducto: (id: string) => void

  // Variantes
  agregarVariante: (variante: Omit<Variante, 'id'>) => void
  editarVariante: (id: string, datos: Partial<Variante>) => void
  eliminarVariante: (id: string) => void

  // Ventas
  registrarVenta: (datos: {
    clienteNombre?: string
    metodoPago: MetodoPago
    descuento: number
    items: { productoId: string; varianteId?: string; cantidad: number; precioUnitario: number }[]
  }) => Venta

  // Compras
  registrarCompra: (datos: {
    proveedorId: string
    nota?: string
    items: { productoId: string; varianteId?: string; cantidad: number; costoUnitario: number }[]
  }) => void

  // Proveedores
  agregarProveedor: (proveedor: Omit<Proveedor, 'id'>) => void
  editarProveedor: (id: string, datos: Partial<Proveedor>) => void
  eliminarProveedor: (id: string) => void

  // Helpers
  getStockProducto: (productoId: string) => number
  getProductosStockBajo: () => { producto: Producto; variante?: Variante; stockActual: number; stockMinimo: number }[]
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      productos: productosMock,
      variantes: variantesMock,
      categorias: categoriasMock,
      ventas: ventasMock,
      ventaItems: ventaItemsMock,
      compras: comprasMock,
      compraItems: compraItemsMock,
      proveedores: proveedoresMock,
      rolActual: 'admin',

      setRol: (rol) => set({ rolActual: rol }),

      agregarProducto: (producto, variantesNuevas) => {
        const id = generateId()
        const nuevoProducto: Producto = { ...producto, id }
        const nuevasVariantes = (variantesNuevas ?? []).map((v) => ({
          ...v,
          id: generateId(),
          productoId: id,
        }))
        set((s) => ({
          productos: [...s.productos, nuevoProducto],
          variantes: [...s.variantes, ...nuevasVariantes],
        }))
      },

      editarProducto: (id, datos) =>
        set((s) => ({
          productos: s.productos.map((p) => (p.id === id ? { ...p, ...datos } : p)),
        })),

      eliminarProducto: (id) =>
        set((s) => ({
          productos: s.productos.filter((p) => p.id !== id),
          variantes: s.variantes.filter((v) => v.productoId !== id),
        })),

      agregarVariante: (variante) => {
        const nueva: Variante = { ...variante, id: generateId() }
        set((s) => ({ variantes: [...s.variantes, nueva] }))
      },

      editarVariante: (id, datos) =>
        set((s) => ({
          variantes: s.variantes.map((v) => (v.id === id ? { ...v, ...datos } : v)),
        })),

      eliminarVariante: (id) =>
        set((s) => ({ variantes: s.variantes.filter((v) => v.id !== id) })),

      registrarVenta: (datos) => {
        const state = get()
        const id = generateId()
        const numero = state.ventas.length + 1
        const subtotal = datos.items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0)
        const venta: Venta = {
          id,
          numeroTicket: generarNumeroTicket(numero),
          clienteNombre: datos.clienteNombre,
          metodoPago: datos.metodoPago,
          subtotal,
          descuento: datos.descuento,
          total: subtotal - datos.descuento,
          creadoPor: state.rolActual,
          fecha: new Date().toISOString(),
        }
        const ventaItems: VentaItem[] = datos.items.map((item) => ({
          id: generateId(),
          ventaId: id,
          productoId: item.productoId,
          varianteId: item.varianteId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.precioUnitario * item.cantidad,
        }))

        // Restar stock
        const nuevasVariantes = [...state.variantes]
        const nuevosProductos = [...state.productos]
        for (const item of datos.items) {
          if (item.varianteId) {
            const idx = nuevasVariantes.findIndex((v) => v.id === item.varianteId)
            if (idx !== -1) nuevasVariantes[idx] = { ...nuevasVariantes[idx], stock: Math.max(0, nuevasVariantes[idx].stock - item.cantidad) }
          } else {
            const idx = nuevosProductos.findIndex((p) => p.id === item.productoId)
            if (idx !== -1) nuevosProductos[idx] = { ...nuevosProductos[idx], stock: Math.max(0, nuevosProductos[idx].stock - item.cantidad) }
          }
        }

        set((s) => ({
          ventas: [...s.ventas, venta],
          ventaItems: [...s.ventaItems, ...ventaItems],
          variantes: nuevasVariantes,
          productos: nuevosProductos,
        }))

        return venta
      },

      registrarCompra: (datos) => {
        const state = get()
        const id = generateId()
        const total = datos.items.reduce((acc, item) => acc + item.costoUnitario * item.cantidad, 0)
        const compra: Compra = {
          id,
          proveedorId: datos.proveedorId,
          total,
          fecha: new Date().toISOString(),
          nota: datos.nota,
        }
        const compraItems: CompraItem[] = datos.items.map((item) => ({
          id: generateId(),
          compraId: id,
          productoId: item.productoId,
          varianteId: item.varianteId,
          cantidad: item.cantidad,
          costoUnitario: item.costoUnitario,
          subtotal: item.costoUnitario * item.cantidad,
        }))

        // Sumar stock
        const nuevasVariantes = [...state.variantes]
        const nuevosProductos = [...state.productos]
        for (const item of datos.items) {
          if (item.varianteId) {
            const idx = nuevasVariantes.findIndex((v) => v.id === item.varianteId)
            if (idx !== -1) nuevasVariantes[idx] = { ...nuevasVariantes[idx], stock: nuevasVariantes[idx].stock + item.cantidad }
          } else {
            const idx = nuevosProductos.findIndex((p) => p.id === item.productoId)
            if (idx !== -1) nuevosProductos[idx] = { ...nuevosProductos[idx], stock: nuevosProductos[idx].stock + item.cantidad }
          }
        }

        set((s) => ({
          compras: [...s.compras, compra],
          compraItems: [...s.compraItems, ...compraItems],
          variantes: nuevasVariantes,
          productos: nuevosProductos,
        }))
      },

      agregarProveedor: (proveedor) =>
        set((s) => ({ proveedores: [...s.proveedores, { ...proveedor, id: generateId() }] })),

      editarProveedor: (id, datos) =>
        set((s) => ({
          proveedores: s.proveedores.map((p) => (p.id === id ? { ...p, ...datos } : p)),
        })),

      eliminarProveedor: (id) =>
        set((s) => ({ proveedores: s.proveedores.filter((p) => p.id !== id) })),

      getStockProducto: (productoId) => {
        const state = get()
        const producto = state.productos.find((p) => p.id === productoId)
        if (!producto) return 0
        if (producto.tieneVariantes) {
          return state.variantes
            .filter((v) => v.productoId === productoId)
            .reduce((acc, v) => acc + v.stock, 0)
        }
        return producto.stock
      },

      getProductosStockBajo: () => {
        const state = get()
        const resultado: { producto: Producto; variante?: Variante; stockActual: number; stockMinimo: number }[] = []

        for (const producto of state.productos) {
          if (!producto.activo) continue
          if (producto.tieneVariantes) {
            const vars = state.variantes.filter((v) => v.productoId === producto.id)
            for (const v of vars) {
              if (v.stock <= v.stockMinimo) {
                resultado.push({ producto, variante: v, stockActual: v.stock, stockMinimo: v.stockMinimo })
              }
            }
          } else {
            if (producto.stock <= producto.stockMinimo) {
              resultado.push({ producto, stockActual: producto.stock, stockMinimo: producto.stockMinimo })
            }
          }
        }

        return resultado.sort((a, b) => a.stockActual - b.stockActual)
      },
    }),
    {
      name: 'tu-inventario-storage',
    }
  )
)
