import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatMoney } from '@/lib/utils'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import type { MetodoPago } from '@/types'
import { METODOS_PAGO } from '@/lib/constants'

interface ItemCarrito {
  productoId: string
  varianteId?: string
  nombre: string
  precioUnitario: number
  cantidad: number
  stockDisponible: number
}

export function NuevaVenta() {
  const navigate = useNavigate()
  const { productos, variantes, categorias, getStockProducto, registrarVenta } = useStore()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [clienteNombre, setClienteNombre] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [descuento, setDescuento] = useState(0)

  const productosActivos = useMemo(() => {
    return productos.filter((p) => {
      if (!p.activo) return false
      if (categoriaFiltro !== 'todas' && p.categoriaId !== categoriaFiltro) return false
      if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })
  }, [productos, busqueda, categoriaFiltro])

  const subtotal = carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0)
  const total = subtotal - descuento

  const agregarAlCarrito = (productoId: string, varianteId?: string) => {
    const producto = productos.find((p) => p.id === productoId)
    if (!producto) return

    const variante = varianteId ? variantes.find((v) => v.id === varianteId) : null
    const nombre = variante ? `${producto.nombre} (${variante.nombre})` : producto.nombre
    const precio = variante?.precioVenta ?? producto.precioVenta
    const stockDisponible = variante ? variante.stock : producto.stock

    const existente = carrito.find(
      (item) => item.productoId === productoId && item.varianteId === varianteId
    )

    if (existente) {
      if (existente.cantidad >= stockDisponible) {
        toast.error('No hay mas stock disponible')
        return
      }
      setCarrito((prev) =>
        prev.map((item) =>
          item.productoId === productoId && item.varianteId === varianteId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      )
    } else {
      if (stockDisponible <= 0) {
        toast.error('Producto agotado')
        return
      }
      setCarrito((prev) => [...prev, { productoId, varianteId, nombre, precioUnitario: precio, cantidad: 1, stockDisponible }])
    }
  }

  const cambiarCantidad = (index: number, delta: number) => {
    setCarrito((prev) =>
      prev
        .map((item, i) => {
          if (i !== index) return item
          const nueva = item.cantidad + delta
          if (nueva <= 0) return item
          if (nueva > item.stockDisponible) {
            toast.error('Stock insuficiente')
            return item
          }
          return { ...item, cantidad: nueva }
        })
    )
  }

  const quitarDelCarrito = (index: number) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index))
  }

  const cobrar = () => {
    if (carrito.length === 0) {
      toast.error('Agrega productos al carrito')
      return
    }
    const venta = registrarVenta({
      clienteNombre: clienteNombre || undefined,
      metodoPago,
      descuento,
      items: carrito.map((item) => ({
        productoId: item.productoId,
        varianteId: item.varianteId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
    })
    toast.success(`Venta ${venta.numeroTicket} registrada`)
    navigate(`/ventas/${venta.id}/ticket`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nueva Venta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Productos */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex gap-2">
            <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar producto..." />
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-40 shrink-0"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas" label="Todas">Todas</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} label={cat.nombre}>{cat.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-auto">
            {productosActivos.map((producto) => {
              const varsProducto = variantes.filter((v) => v.productoId === producto.id)
              if (producto.tieneVariantes && varsProducto.length > 0) {
                return (
                  <Card key={producto.id} className="p-3">
                    <p className="font-medium mb-2">{producto.nombre}</p>
                    <div className="flex flex-wrap gap-1">
                      {varsProducto.map((v) => (
                        <Button
                          key={v.id}
                          variant="outline"
                          size="sm"
                          disabled={v.stock <= 0}
                          onClick={() => agregarAlCarrito(producto.id, v.id)}
                          className="text-xs"
                        >
                          {v.nombre} ({v.stock})
                        </Button>
                      ))}
                    </div>
                  </Card>
                )
              }
              const stock = getStockProducto(producto.id)
              return (
                <Button
                  key={producto.id}
                  variant="outline"
                  className="h-auto p-3 justify-between"
                  disabled={stock <= 0}
                  onClick={() => agregarAlCarrito(producto.id)}
                >
                  <span className="font-medium">{producto.nombre}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatMoney(producto.precioVenta)} ({stock})
                  </span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Carrito */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Carrito ({carrito.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carrito.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Carrito vacio</p>
            ) : (
              <div className="space-y-2">
                {carrito.map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 border rounded ${i % 2 === 0 ? 'bg-muted/70' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatMoney(item.precioUnitario)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cambiarCantidad(i, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.cantidad}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cambiarCantidad(i, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      {formatMoney(item.precioUnitario * item.cantidad)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => quitarDelCarrito(i)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 border-t pt-3">
              <div className="space-y-2">
                <Label className="text-xs">Cliente (opcional)</Label>
                <Input value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Nombre" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Metodo de Pago</Label>
                <Select value={metodoPago} onValueChange={(v) => { if (v) setMetodoPago(v as MetodoPago) }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {METODOS_PAGO.map((m) => (
                      <SelectItem key={m.value} value={m.value} label={m.label}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Descuento</Label>
                <Input type="number" value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} />
              </div>
            </div>

            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Descuento</span>
                  <span>-{formatMoney(descuento)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={cobrar} disabled={carrito.length === 0}>
              <CreditCard className="h-4 w-4 mr-2" /> Cobrar {formatMoney(total)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
