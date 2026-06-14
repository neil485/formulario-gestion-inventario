import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface VarianteForm {
  tempId: string
  id?: string
  nombre: string
  atributos: Record<string, string>
  precioVenta?: number
  stock: number
  stockMinimo: number
}

export function ProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productos, variantes, categorias, agregarProducto, editarProducto, agregarVariante, editarVariante, eliminarVariante } = useStore()
  const esEdicion = !!id

  const producto = esEdicion ? productos.find((p) => p.id === id) : null

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precioCompra, setPrecioCompra] = useState(0)
  const [precioVenta, setPrecioVenta] = useState(0)
  const [codigoBarras, setCodigoBarras] = useState('')
  const [stockMinimo, setStockMinimo] = useState(3)
  const [tieneVariantes, setTieneVariantes] = useState(false)
  const [stock, setStock] = useState(0)
  const [variantesForm, setVariantesForm] = useState<VarianteForm[]>([])

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre)
      setDescripcion(producto.descripcion || '')
      setCategoriaId(producto.categoriaId)
      setPrecioCompra(producto.precioCompra)
      setPrecioVenta(producto.precioVenta)
      setCodigoBarras(producto.codigoBarras || '')
      setStockMinimo(producto.stockMinimo)
      setTieneVariantes(producto.tieneVariantes)
      setStock(producto.stock)
      const vars = variantes.filter((v) => v.productoId === producto.id)
      setVariantesForm(vars.map((v) => ({ ...v, tempId: v.id })))
    }
  }, [producto, variantes])

  const agregarVarianteForm = () => {
    setVariantesForm((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), nombre: '', atributos: {}, stock: 0, stockMinimo: 2 },
    ])
  }

  const actualizarVarianteForm = (tempId: string, campo: string, valor: string | number) => {
    setVariantesForm((prev) =>
      prev.map((v) => (v.tempId === tempId ? { ...v, [campo]: valor } : v))
    )
  }

  const quitarVarianteForm = (tempId: string, varId?: string) => {
    if (varId) eliminarVariante(varId)
    setVariantesForm((prev) => prev.filter((v) => v.tempId !== tempId))
  }

  const guardar = () => {
    if (!nombre || !categoriaId) {
      toast.error('Nombre y categoria son requeridos')
      return
    }

    if (esEdicion && producto) {
      editarProducto(producto.id, {
        nombre,
        descripcion: descripcion || undefined,
        categoriaId,
        precioCompra,
        precioVenta,
        codigoBarras: codigoBarras || undefined,
        stockMinimo,
        tieneVariantes,
        stock: tieneVariantes ? 0 : stock,
      })
      // Actualizar variantes existentes y agregar nuevas
      for (const vf of variantesForm) {
        if (vf.id) {
          editarVariante(vf.id, { nombre: vf.nombre, stock: vf.stock, stockMinimo: vf.stockMinimo })
        } else {
          agregarVariante({ productoId: producto.id, nombre: vf.nombre, atributos: vf.atributos, stock: vf.stock, stockMinimo: vf.stockMinimo })
        }
      }
      toast.success('Producto actualizado')
    } else {
      const nuevasVariantes = tieneVariantes
        ? variantesForm.map((v) => ({ nombre: v.nombre, atributos: v.atributos, stock: v.stock, stockMinimo: v.stockMinimo }))
        : undefined
      agregarProducto(
        {
          nombre,
          descripcion: descripcion || undefined,
          categoriaId,
          precioCompra,
          precioVenta,
          codigoBarras: codigoBarras || undefined,
          stockMinimo,
          tieneVariantes,
          stock: tieneVariantes ? 0 : stock,
          activo: true,
        },
        nuevasVariantes
      )
      toast.success('Producto creado')
    }
    navigate('/productos')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{esEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={categoriaId} onValueChange={(v) => { if (v) setCategoriaId(v) }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id} label={c.nombre}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripcion</Label>
            <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Precio Compra</Label>
              <Input type="number" value={precioCompra} onChange={(e) => setPrecioCompra(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Precio Venta</Label>
              <Input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Codigo Barras</Label>
              <Input value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stock Minimo</Label>
              <Input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} />
            </div>
            {!tieneVariantes && (
              <div className="space-y-2">
                <Label>Stock Actual</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={tieneVariantes} onCheckedChange={setTieneVariantes} />
            <Label>Tiene variantes (tallas, colores, etc.)</Label>
          </div>
        </CardContent>
      </Card>

      {tieneVariantes && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Variantes</CardTitle>
            <Button variant="outline" size="sm" onClick={agregarVarianteForm}>
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {variantesForm.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Sin variantes. Agrega al menos una.</p>
            )}
            {variantesForm.map((vf) => (
              <div key={vf.tempId} className="flex items-end gap-3 p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Nombre (ej: Talla M)</Label>
                  <Input
                    value={vf.nombre}
                    onChange={(e) => actualizarVarianteForm(vf.tempId, 'nombre', e.target.value)}
                    placeholder="Talla M - Rojo"
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    value={vf.stock}
                    onChange={(e) => actualizarVarianteForm(vf.tempId, 'stock', Number(e.target.value))}
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Min</Label>
                  <Input
                    type="number"
                    value={vf.stockMinimo}
                    onChange={(e) => actualizarVarianteForm(vf.tempId, 'stockMinimo', Number(e.target.value))}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => quitarVarianteForm(vf.tempId, vf.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={guardar}>Guardar</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
      </div>
    </div>
  )
}
