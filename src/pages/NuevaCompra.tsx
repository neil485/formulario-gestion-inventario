import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface ItemCompra {
  productoId: string
  varianteId?: string
  nombre: string
  cantidad: number
  costoUnitario: number
}

export function NuevaCompra() {
  const navigate = useNavigate()
  const { productos, variantes, proveedores, registrarCompra } = useStore()
  const [proveedorId, setProveedorId] = useState('')
  const [nota, setNota] = useState('')
  const [items, setItems] = useState<ItemCompra[]>([])
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [varianteSeleccionada, setVarianteSeleccionada] = useState('')

  const productosActivos = productos.filter((p) => p.activo)
  const productoActual = productosActivos.find((p) => p.id === productoSeleccionado)
  const varsProducto = productoActual?.tieneVariantes
    ? variantes.filter((v) => v.productoId === productoSeleccionado)
    : []

  const total = items.reduce((acc, item) => acc + item.costoUnitario * item.cantidad, 0)

  const agregarItem = () => {
    if (!productoSeleccionado) { toast.error('Selecciona un producto'); return }
    if (productoActual?.tieneVariantes && !varianteSeleccionada) { toast.error('Selecciona una variante'); return }

    const variante = varianteSeleccionada ? variantes.find((v) => v.id === varianteSeleccionada) : null
    const nombre = variante ? `${productoActual!.nombre} (${variante.nombre})` : productoActual!.nombre

    setItems((prev) => [
      ...prev,
      {
        productoId: productoSeleccionado,
        varianteId: varianteSeleccionada || undefined,
        nombre,
        cantidad: 1,
        costoUnitario: productoActual!.precioCompra,
      },
    ])
    setProductoSeleccionado('')
    setVarianteSeleccionada('')
  }

  const actualizarItem = (index: number, campo: 'cantidad' | 'costoUnitario', valor: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)))
  }

  const guardar = () => {
    if (!proveedorId) { toast.error('Selecciona un proveedor'); return }
    if (items.length === 0) { toast.error('Agrega al menos un producto'); return }

    registrarCompra({
      proveedorId,
      nota: nota || undefined,
      items: items.map((item) => ({
        productoId: item.productoId,
        varianteId: item.varianteId,
        cantidad: item.cantidad,
        costoUnitario: item.costoUnitario,
      })),
    })
    toast.success('Compra registrada - stock actualizado')
    navigate('/compras')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Nueva Compra</h1>

      <Card>
        <CardHeader><CardTitle>Datos de la Compra</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Proveedor *</Label>
            <Select value={proveedorId} onValueChange={(v) => { if (v) setProveedorId(v) }}>
              <SelectTrigger><SelectValue placeholder="Seleccionar proveedor" /></SelectTrigger>
              <SelectContent>
                {proveedores.map((p) => (
                  <SelectItem key={p.id} value={p.id} label={p.nombre}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nota</Label>
            <Input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nota opcional" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Productos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={productoSeleccionado} onValueChange={(v) => { if (v) { setProductoSeleccionado(v); setVarianteSeleccionada('') } }}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Producto" /></SelectTrigger>
              <SelectContent>
                {productosActivos.map((p) => (
                  <SelectItem key={p.id} value={p.id} label={p.nombre}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {varsProducto.length > 0 && (
              <Select value={varianteSeleccionada} onValueChange={(v) => { if (v) setVarianteSeleccionada(v) }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Variante" /></SelectTrigger>
                <SelectContent>
                  {varsProducto.map((v) => (
                    <SelectItem key={v.id} value={v.id} label={v.nombre}>{v.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={agregarItem} variant="outline"><Plus className="h-4 w-4" /></Button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin productos agregados</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1 text-sm font-medium truncate">{item.nombre}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <Input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(i, 'cantidad', Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">x</span>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.costoUnitario}
                        onChange={(e) => actualizarItem(i, 'costoUnitario', Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <span className="text-sm w-24 text-right">{formatMoney(item.cantidad * item.costoUnitario)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center border-t pt-3">
            <span className="font-bold text-lg">Total: {formatMoney(total)}</span>
            <Button onClick={guardar} disabled={items.length === 0}>
              <Save className="h-4 w-4 mr-2" /> Guardar Compra
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
