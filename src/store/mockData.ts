import type { Categoria, Producto, Variante, Proveedor, Venta, VentaItem, Compra, CompraItem } from '@/types'

export const categoriasMock: Categoria[] = [
  { id: 'cat-1', nombre: 'Calzado' },
  { id: 'cat-2', nombre: 'Ropa Deportiva' },
  { id: 'cat-3', nombre: 'Balones y Deportes' },
  { id: 'cat-4', nombre: 'Celulares' },
  { id: 'cat-5', nombre: 'Accesorios Celulares' },
]

export const proveedoresMock: Proveedor[] = [
  { id: 'prov-1', nombre: 'Distribuidora Deportiva', telefono: '8888-1234', email: 'deportiva@dist.com' },
  { id: 'prov-2', nombre: 'Importadora de Celulares', telefono: '8888-5678', email: 'celulares@import.com' },
  { id: 'prov-3', nombre: 'Mayorista Calzado', telefono: '8888-9012', email: 'calzado@mayorista.com' },
]

export const productosMock: Producto[] = [
  // Calzado
  { id: 'p-1', nombre: 'Tenis Nike', categoriaId: 'cat-1', precioCompra: 350, precioVenta: 650, stockMinimo: 2, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-2', nombre: 'Tenis Adidas', categoriaId: 'cat-1', precioCompra: 320, precioVenta: 600, stockMinimo: 2, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-3', nombre: 'Zapato Escolar', categoriaId: 'cat-1', precioCompra: 180, precioVenta: 340, stockMinimo: 3, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-4', nombre: 'Sandalia Deportiva', categoriaId: 'cat-1', precioCompra: 100, precioVenta: 220, stockMinimo: 3, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-5', nombre: 'Bota Casual', categoriaId: 'cat-1', precioCompra: 280, precioVenta: 520, stockMinimo: 2, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-6', nombre: 'Chancleta Nike', categoriaId: 'cat-1', precioCompra: 80, precioVenta: 180, stockMinimo: 4, tieneVariantes: true, stock: 0, activo: true },

  // Ropa Deportiva
  { id: 'p-7', nombre: 'Camiseta Deportiva Dry-Fit', categoriaId: 'cat-2', precioCompra: 90, precioVenta: 200, stockMinimo: 5, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-8', nombre: 'Short Deportivo', categoriaId: 'cat-2', precioCompra: 80, precioVenta: 180, stockMinimo: 4, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-9', nombre: 'Licra Deportiva', categoriaId: 'cat-2', precioCompra: 100, precioVenta: 220, stockMinimo: 3, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-10', nombre: 'Conjunto Deportivo Completo', categoriaId: 'cat-2', precioCompra: 200, precioVenta: 400, stockMinimo: 2, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-11', nombre: 'Sudadera con Gorro', categoriaId: 'cat-2', precioCompra: 180, precioVenta: 350, stockMinimo: 3, tieneVariantes: true, stock: 0, activo: true },
  { id: 'p-12', nombre: 'Calcetas Deportivas (par)', categoriaId: 'cat-2', precioCompra: 25, precioVenta: 60, stockMinimo: 10, tieneVariantes: false, stock: 30, activo: true },

  // Balones y Deportes
  { id: 'p-13', nombre: 'Balon Basketball', categoriaId: 'cat-3', precioCompra: 150, precioVenta: 320, stockMinimo: 2, tieneVariantes: false, stock: 5, activo: true },
  { id: 'p-14', nombre: 'Balon Futbol', categoriaId: 'cat-3', precioCompra: 120, precioVenta: 280, stockMinimo: 3, tieneVariantes: false, stock: 8, activo: true },
  { id: 'p-15', nombre: 'Balon Softball', categoriaId: 'cat-3', precioCompra: 80, precioVenta: 180, stockMinimo: 3, tieneVariantes: false, stock: 4, activo: true },
  { id: 'p-16', nombre: 'Balon Voleibol', categoriaId: 'cat-3', precioCompra: 100, precioVenta: 240, stockMinimo: 2, tieneVariantes: false, stock: 3, activo: true },
  { id: 'p-17', nombre: 'Guante Softball', categoriaId: 'cat-3', precioCompra: 200, precioVenta: 400, stockMinimo: 2, tieneVariantes: false, stock: 2, activo: true },
  { id: 'p-18', nombre: 'Rodilleras Deportivas (par)', categoriaId: 'cat-3', precioCompra: 60, precioVenta: 140, stockMinimo: 3, tieneVariantes: false, stock: 6, activo: true },
  { id: 'p-19', nombre: 'Bate Softball Aluminio', categoriaId: 'cat-3', precioCompra: 250, precioVenta: 480, stockMinimo: 1, tieneVariantes: false, stock: 2, activo: true },

  // Celulares
  { id: 'p-20', nombre: 'Samsung Galaxy A15', categoriaId: 'cat-4', precioCompra: 2800, precioVenta: 3800, stockMinimo: 2, tieneVariantes: false, stock: 3, activo: true },
  { id: 'p-21', nombre: 'Samsung Galaxy A25', categoriaId: 'cat-4', precioCompra: 4200, precioVenta: 5500, stockMinimo: 1, tieneVariantes: false, stock: 2, activo: true },
  { id: 'p-22', nombre: 'Xiaomi Redmi 13C', categoriaId: 'cat-4', precioCompra: 2200, precioVenta: 3200, stockMinimo: 2, tieneVariantes: false, stock: 4, activo: true },
  { id: 'p-23', nombre: 'Xiaomi Redmi Note 13', categoriaId: 'cat-4', precioCompra: 3500, precioVenta: 4800, stockMinimo: 1, tieneVariantes: false, stock: 1, activo: true },
  { id: 'p-24', nombre: 'Tecno Spark 20C', categoriaId: 'cat-4', precioCompra: 1800, precioVenta: 2600, stockMinimo: 2, tieneVariantes: false, stock: 5, activo: true },

  // Accesorios Celulares
  { id: 'p-25', nombre: 'Cargador Rapido USB-C', categoriaId: 'cat-5', precioCompra: 80, precioVenta: 180, stockMinimo: 5, tieneVariantes: false, stock: 15, activo: true },
  { id: 'p-26', nombre: 'Cargador Micro USB', categoriaId: 'cat-5', precioCompra: 40, precioVenta: 100, stockMinimo: 8, tieneVariantes: false, stock: 20, activo: true },
  { id: 'p-27', nombre: 'Cable USB-C 1m', categoriaId: 'cat-5', precioCompra: 25, precioVenta: 60, stockMinimo: 10, tieneVariantes: false, stock: 25, activo: true },
  { id: 'p-28', nombre: 'Protector Pantalla Samsung A15', categoriaId: 'cat-5', precioCompra: 15, precioVenta: 50, stockMinimo: 5, tieneVariantes: false, stock: 12, activo: true },
  { id: 'p-29', nombre: 'Protector Pantalla Xiaomi Redmi 13C', categoriaId: 'cat-5', precioCompra: 15, precioVenta: 50, stockMinimo: 5, tieneVariantes: false, stock: 10, activo: true },
  { id: 'p-30', nombre: 'Forro Silicona Samsung A15', categoriaId: 'cat-5', precioCompra: 30, precioVenta: 80, stockMinimo: 5, tieneVariantes: false, stock: 8, activo: true },
  { id: 'p-31', nombre: 'Forro Silicona Xiaomi Redmi 13C', categoriaId: 'cat-5', precioCompra: 30, precioVenta: 80, stockMinimo: 5, tieneVariantes: false, stock: 6, activo: true },
  { id: 'p-32', nombre: 'Audifonos Bluetooth', categoriaId: 'cat-5', precioCompra: 100, precioVenta: 250, stockMinimo: 3, tieneVariantes: false, stock: 7, activo: true },
  { id: 'p-33', nombre: 'Power Bank 10000mAh', categoriaId: 'cat-5', precioCompra: 150, precioVenta: 320, stockMinimo: 3, tieneVariantes: false, stock: 4, activo: true },
  { id: 'p-34', nombre: 'Soporte Celular para Carro', categoriaId: 'cat-5', precioCompra: 40, precioVenta: 100, stockMinimo: 3, tieneVariantes: false, stock: 5, activo: true },
  { id: 'p-35', nombre: 'Memoria MicroSD 64GB', categoriaId: 'cat-5', precioCompra: 80, precioVenta: 180, stockMinimo: 3, tieneVariantes: false, stock: 3, activo: true },
  { id: 'p-36', nombre: 'Forro Antigolpe Samsung A25', categoriaId: 'cat-5', precioCompra: 45, precioVenta: 120, stockMinimo: 4, tieneVariantes: false, stock: 1, activo: true },
  { id: 'p-37', nombre: 'Protector Camara Samsung A25', categoriaId: 'cat-5', precioCompra: 10, precioVenta: 35, stockMinimo: 5, tieneVariantes: false, stock: 8, activo: true },
]

const tallas = ['S', 'M', 'L', 'XL']
const tallasCalzado = ['36', '37', '38', '39', '40', '41', '42']

function crearVariantesRopa(productoId: string, stocks: number[]): Variante[] {
  return tallas.map((talla, i) => ({
    id: `${productoId}-v${i + 1}`,
    productoId,
    nombre: `Talla ${talla}`,
    atributos: { talla },
    stock: stocks[i] ?? 0,
    stockMinimo: 2,
  }))
}

function crearVariantesCalzado(productoId: string, stocks: number[]): Variante[] {
  return tallasCalzado.map((talla, i) => ({
    id: `${productoId}-v${i + 1}`,
    productoId,
    nombre: `Talla ${talla}`,
    atributos: { talla },
    stock: stocks[i] ?? 0,
    stockMinimo: 1,
  }))
}

export const variantesMock: Variante[] = [
  // Calzado
  ...crearVariantesCalzado('p-1', [0, 1, 2, 1, 1, 0, 0]),   // Tenis Nike
  ...crearVariantesCalzado('p-2', [1, 2, 3, 2, 1, 1, 0]),   // Tenis Adidas
  ...crearVariantesCalzado('p-3', [2, 3, 4, 3, 2, 1, 0]),   // Zapato Escolar
  ...crearVariantesCalzado('p-4', [2, 3, 4, 3, 2, 1, 1]),   // Sandalia
  ...crearVariantesCalzado('p-5', [1, 0, 1, 2, 1, 0, 0]),   // Bota
  ...crearVariantesCalzado('p-6', [3, 4, 5, 4, 3, 2, 2]),   // Chancleta

  // Ropa Deportiva
  ...crearVariantesRopa('p-7', [3, 5, 2, 1]),    // Camiseta Dry-Fit
  ...crearVariantesRopa('p-8', [2, 4, 3, 1]),    // Short
  ...crearVariantesRopa('p-9', [1, 3, 2, 0]),    // Licra
  ...crearVariantesRopa('p-10', [0, 2, 1, 1]),   // Conjunto
  ...crearVariantesRopa('p-11', [1, 2, 1, 0]),   // Sudadera
]

const hoy = new Date()
function fechaHace(dias: number) {
  const d = new Date(hoy)
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}

export const ventasMock: Venta[] = [
  { id: 'v-1', numeroTicket: 'V-00001', metodoPago: 'efectivo', subtotal: 850, descuento: 0, total: 850, creadoPor: 'admin', fecha: fechaHace(28) },
  { id: 'v-2', numeroTicket: 'V-00002', clienteNombre: 'Maria Lopez', metodoPago: 'tarjeta', subtotal: 4050, descuento: 50, total: 4000, creadoPor: 'admin', fecha: fechaHace(25) },
  { id: 'v-3', numeroTicket: 'V-00003', metodoPago: 'efectivo', subtotal: 460, descuento: 0, total: 460, creadoPor: 'vendedor', fecha: fechaHace(20) },
  { id: 'v-4', numeroTicket: 'V-00004', clienteNombre: 'Carlos Ruiz', metodoPago: 'transferencia', subtotal: 5800, descuento: 300, total: 5500, creadoPor: 'admin', fecha: fechaHace(15) },
  { id: 'v-5', numeroTicket: 'V-00005', metodoPago: 'efectivo', subtotal: 600, descuento: 0, total: 600, creadoPor: 'vendedor', fecha: fechaHace(12) },
  { id: 'v-6', numeroTicket: 'V-00006', metodoPago: 'tarjeta', subtotal: 3200, descuento: 0, total: 3200, creadoPor: 'admin', fecha: fechaHace(8) },
  { id: 'v-7', numeroTicket: 'V-00007', clienteNombre: 'Ana Torres', metodoPago: 'efectivo', subtotal: 380, descuento: 30, total: 350, creadoPor: 'vendedor', fecha: fechaHace(5) },
  { id: 'v-8', numeroTicket: 'V-00008', metodoPago: 'transferencia', subtotal: 1280, descuento: 0, total: 1280, creadoPor: 'admin', fecha: fechaHace(3) },
  { id: 'v-9', numeroTicket: 'V-00009', metodoPago: 'efectivo', subtotal: 250, descuento: 0, total: 250, creadoPor: 'vendedor', fecha: fechaHace(1) },
  { id: 'v-10', numeroTicket: 'V-00010', clienteNombre: 'Pedro Gomez', metodoPago: 'tarjeta', subtotal: 650, descuento: 0, total: 650, creadoPor: 'admin', fecha: fechaHace(0) },
]

export const ventaItemsMock: VentaItem[] = [
  // V-00001: Tenis Nike + Short
  { id: 'vi-1', ventaId: 'v-1', productoId: 'p-1', varianteId: 'p-1-v3', cantidad: 1, precioUnitario: 650, subtotal: 650 },
  { id: 'vi-2', ventaId: 'v-1', productoId: 'p-8', varianteId: 'p-8-v2', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  // V-00002: Samsung A15 + forro + protector
  { id: 'vi-3', ventaId: 'v-2', productoId: 'p-20', cantidad: 1, precioUnitario: 3800, subtotal: 3800 },
  { id: 'vi-4', ventaId: 'v-2', productoId: 'p-30', cantidad: 1, precioUnitario: 80, subtotal: 80 },
  { id: 'vi-5', ventaId: 'v-2', productoId: 'p-28', cantidad: 1, precioUnitario: 50, subtotal: 50 },
  { id: 'vi-6', ventaId: 'v-2', productoId: 'p-25', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  // V-00003: Balones
  { id: 'vi-7', ventaId: 'v-3', productoId: 'p-14', cantidad: 1, precioUnitario: 280, subtotal: 280 },
  { id: 'vi-8', ventaId: 'v-3', productoId: 'p-8', varianteId: 'p-8-v1', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  // V-00004: Xiaomi Redmi Note 13 + accesorios
  { id: 'vi-9', ventaId: 'v-4', productoId: 'p-23', cantidad: 1, precioUnitario: 4800, subtotal: 4800 },
  { id: 'vi-10', ventaId: 'v-4', productoId: 'p-32', cantidad: 1, precioUnitario: 250, subtotal: 250 },
  { id: 'vi-11', ventaId: 'v-4', productoId: 'p-33', cantidad: 1, precioUnitario: 320, subtotal: 320 },
  { id: 'vi-12', ventaId: 'v-4', productoId: 'p-25', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  // V-00005: Tenis Adidas + calcetas
  { id: 'vi-13', ventaId: 'v-5', productoId: 'p-2', varianteId: 'p-2-v4', cantidad: 1, precioUnitario: 600, subtotal: 600 },
  // V-00006: Xiaomi Redmi 13C + accesorios
  { id: 'vi-14', ventaId: 'v-6', productoId: 'p-22', cantidad: 1, precioUnitario: 3200, subtotal: 3200 },
  // V-00007: Audifonos + cable
  { id: 'vi-15', ventaId: 'v-7', productoId: 'p-32', cantidad: 1, precioUnitario: 250, subtotal: 250 },
  { id: 'vi-16', ventaId: 'v-7', productoId: 'p-27', cantidad: 2, precioUnitario: 60, subtotal: 120 },
  // V-00008: Balon basketball + balon softball + rodilleras + guante
  { id: 'vi-17', ventaId: 'v-8', productoId: 'p-13', cantidad: 1, precioUnitario: 320, subtotal: 320 },
  { id: 'vi-18', ventaId: 'v-8', productoId: 'p-15', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  { id: 'vi-19', ventaId: 'v-8', productoId: 'p-18', cantidad: 1, precioUnitario: 140, subtotal: 140 },
  { id: 'vi-20', ventaId: 'v-8', productoId: 'p-17', cantidad: 1, precioUnitario: 400, subtotal: 400 },
  // V-00009: Cargadores
  { id: 'vi-21', ventaId: 'v-9', productoId: 'p-25', cantidad: 1, precioUnitario: 180, subtotal: 180 },
  { id: 'vi-22', ventaId: 'v-9', productoId: 'p-27', cantidad: 1, precioUnitario: 60, subtotal: 60 },
  // V-00010: Tenis Nike
  { id: 'vi-23', ventaId: 'v-10', productoId: 'p-1', varianteId: 'p-1-v4', cantidad: 1, precioUnitario: 650, subtotal: 650 },
]

export const comprasMock: Compra[] = [
  { id: 'c-1', proveedorId: 'prov-3', total: 8400, fecha: fechaHace(30), nota: 'Restock calzado mensual' },
  { id: 'c-2', proveedorId: 'prov-2', total: 15000, fecha: fechaHace(20), nota: 'Celulares y accesorios' },
  { id: 'c-3', proveedorId: 'prov-1', total: 4200, fecha: fechaHace(10), nota: 'Balones y ropa deportiva' },
]

export const compraItemsMock: CompraItem[] = [
  // Compra 1 - Calzado
  { id: 'ci-1', compraId: 'c-1', productoId: 'p-1', varianteId: 'p-1-v3', cantidad: 5, costoUnitario: 350, subtotal: 1750 },
  { id: 'ci-2', compraId: 'c-1', productoId: 'p-2', varianteId: 'p-2-v4', cantidad: 5, costoUnitario: 320, subtotal: 1600 },
  { id: 'ci-3', compraId: 'c-1', productoId: 'p-3', varianteId: 'p-3-v3', cantidad: 10, costoUnitario: 180, subtotal: 1800 },
  { id: 'ci-4', compraId: 'c-1', productoId: 'p-6', varianteId: 'p-6-v4', cantidad: 10, costoUnitario: 80, subtotal: 800 },
  // Compra 2 - Celulares
  { id: 'ci-5', compraId: 'c-2', productoId: 'p-20', cantidad: 3, costoUnitario: 2800, subtotal: 8400 },
  { id: 'ci-6', compraId: 'c-2', productoId: 'p-22', cantidad: 3, costoUnitario: 2200, subtotal: 6600 },
  // Compra 3 - Deportes
  { id: 'ci-7', compraId: 'c-3', productoId: 'p-13', cantidad: 5, costoUnitario: 150, subtotal: 750 },
  { id: 'ci-8', compraId: 'c-3', productoId: 'p-14', cantidad: 8, costoUnitario: 120, subtotal: 960 },
  { id: 'ci-9', compraId: 'c-3', productoId: 'p-7', varianteId: 'p-7-v2', cantidad: 10, costoUnitario: 90, subtotal: 900 },
  { id: 'ci-10', compraId: 'c-3', productoId: 'p-8', varianteId: 'p-8-v2', cantidad: 10, costoUnitario: 80, subtotal: 800 },
]
