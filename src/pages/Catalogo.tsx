import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store/useStore'
import { formatMoney, generateId } from '@/lib/utils'
import { Plus, X, FileDown, Eye, ArrowLeft, ArrowRight, Image, Check, Type } from 'lucide-react'
import { generarCatalogoPDF } from '@/lib/catalogoPdf'
import type { ConfigCatalogo, ProductoCatalogo } from '@/types/catalogo'
import { CONFIG_INICIAL } from '@/types/catalogo'

type Paso = 'config' | 'productos' | 'preview'
const PASOS: Paso[] = ['config', 'productos', 'preview']
const PASO_LABELS: Record<Paso, string> = {
  config: 'Configuracion',
  productos: 'Productos',
  preview: 'Preview',
}

function leerImagen(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

export function Catalogo() {
  const { productos, categorias } = useStore()
  const [paso, setPaso] = useState<Paso>('config')
  const [config, setConfig] = useState<ConfigCatalogo>({ ...CONFIG_INICIAL })
  const [seleccionados, setSeleccionados] = useState<ProductoCatalogo[]>([])
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>(null)
  const [productosCheck, setProductosCheck] = useState<Set<string>>(new Set())
  const inputImagenProducto = useRef<HTMLInputElement>(null)
  const [productoParaImagen, setProductoParaImagen] = useState<string | null>(null)

  // Estado para producto manual
  const [manualNombre, setManualNombre] = useState('')
  const [manualPrecio, setManualPrecio] = useState('')
  const [manualDescripcion, setManualDescripcion] = useState('')
  const [manualCategoria, setManualCategoria] = useState('')
  const [manualImagen, setManualImagen] = useState<string | null>(null)

  const productosActivos = productos.filter(p => p.activo)
  const tieneInventario = productosActivos.length > 0
  const pasoIndex = PASOS.indexOf(paso)

  const toggleProductoCheck = (productoId: string) => {
    setProductosCheck(prev => {
      const next = new Set(prev)
      if (next.has(productoId)) next.delete(productoId)
      else next.add(productoId)
      return next
    })
  }

  const agregarSeleccionados = () => {
    const nuevos: ProductoCatalogo[] = []
    productosCheck.forEach(productoId => {
      if (seleccionados.find(s => s.id === productoId)) return
      const producto = productos.find(p => p.id === productoId)
      if (!producto) return
      const categoria = categorias.find(c => c.id === producto.categoriaId)
      nuevos.push({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precioVenta,
        categoria: categoria?.nombre || '',
        imagen: null,
        esManual: false,
      })
    })
    setSeleccionados([...seleccionados, ...nuevos])
    setProductosCheck(new Set())
    setCategoriaAbierta(null)
  }

  const agregarProductoManual = () => {
    if (!manualNombre || !manualPrecio) return
    const nuevo: ProductoCatalogo = {
      id: generateId(),
      nombre: manualNombre,
      descripcion: manualDescripcion,
      precio: parseFloat(manualPrecio) || 0,
      categoria: manualCategoria || 'General',
      imagen: manualImagen,
      esManual: true,
    }
    setSeleccionados([...seleccionados, nuevo])
    setManualNombre('')
    setManualPrecio('')
    setManualDescripcion('')
    setManualCategoria('')
    setManualImagen(null)
  }

  const quitarProducto = (id: string) => {
    setSeleccionados(seleccionados.filter(s => s.id !== id))
  }

  const handleImagenPortada = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const data = await leerImagen(file)
    setConfig({ ...config, imagenPortada: data })
  }

  const handleImagenFondo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const data = await leerImagen(file)
    setConfig({ ...config, imagenFondo: data })
  }

  const handleImagenLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const data = await leerImagen(file)
    setConfig({ ...config, imagenLogo: data })
  }

  const handleImagenProducto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !productoParaImagen) return
    const data = await leerImagen(file)
    setSeleccionados(seleccionados.map(s =>
      s.id === productoParaImagen ? { ...s, imagen: data } : s
    ))
    setProductoParaImagen(null)
  }

  const handleImagenManual = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const data = await leerImagen(file)
    setManualImagen(data)
  }

  const abrirSelectorImagen = (productoId: string) => {
    setProductoParaImagen(productoId)
    inputImagenProducto.current?.click()
  }

  const exportarPDF = () => {
    generarCatalogoPDF(config, seleccionados)
  }

  const irSiguiente = () => {
    const next = PASOS[pasoIndex + 1]
    if (next) setPaso(next)
  }

  const irAtras = () => {
    const prev = PASOS[pasoIndex - 1]
    if (prev) setPaso(prev)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <input ref={inputImagenProducto} type="file" accept="image/*" className="hidden" onChange={handleImagenProducto} />

      {/* Header con progreso */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crear Catalogo PDF</h1>
          <p className="text-muted-foreground text-sm">
            Genera un catalogo profesional para compartir con tus clientes
          </p>
        </div>
        <div className="flex gap-1 items-center">
          {PASOS.map((p, i) => (
            <div key={p} className="flex items-center gap-1">
              <button
                onClick={() => setPaso(p)}
                className={`text-xs px-2 py-1 rounded ${paso === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {i + 1}. {PASO_LABELS[p]}
              </button>
              {i < PASOS.length - 1 && <div className="w-3 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* ====== PASO 1: CONFIGURACION ====== */}
      {paso === 'config' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreNegocio">Nombre del negocio</Label>
                  <Input
                    id="nombreNegocio"
                    placeholder="Ej: Deportes Express"
                    value={config.nombreNegocio}
                    onChange={e => setConfig({ ...config, nombreNegocio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Telefono / WhatsApp</Label>
                  <Input
                    id="telefono"
                    placeholder="Ej: 8888-1234"
                    value={config.telefono}
                    onChange={e => setConfig({ ...config, telefono: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan o frase de portada</Label>
                <Input
                  id="slogan"
                  placeholder="Ej: Los mejores precios de la ciudad"
                  value={config.slogan}
                  onChange={e => setConfig({ ...config, slogan: e.target.value })}
                />
              </div>

              <Separator />

              {/* Colores y fuente */}
              <div className="flex flex-wrap gap-6 items-end">
                <div className="space-y-2">
                  <Label>Color primario</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colorPrimario}
                      onChange={e => setConfig({ ...config, colorPrimario: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-2 [&::-webkit-color-swatch]:border-border"
                    />
                    <span className="text-xs text-muted-foreground">{config.colorPrimario}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color secundario</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colorSecundario}
                      onChange={e => setConfig({ ...config, colorSecundario: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-2 [&::-webkit-color-swatch]:border-border"
                    />
                    <span className="text-xs text-muted-foreground">{config.colorSecundario}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fuente</Label>
                  <div className="flex gap-2">
                    {(['helvetica', 'times', 'courier'] as const).map(f => (
                      <Button
                        key={f}
                        variant={config.fuente === f ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfig({ ...config, fuente: f })}
                        style={{ fontFamily: f === 'helvetica' ? 'sans-serif' : f === 'times' ? 'serif' : 'monospace' }}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo del negocio</Label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImagenLogo} />
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors text-sm">
                      <Image className="h-4 w-4" />
                      {config.imagenLogo ? 'Cambiar logo' : 'Subir logo'}
                    </div>
                  </label>
                  {config.imagenLogo && (
                    <div className="relative">
                      <img src={config.imagenLogo} alt="Logo" className="h-14 w-14 object-contain rounded border" />
                      <button
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        onClick={() => setConfig({ ...config, imagenLogo: null })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagen de portada */}
              <div className="space-y-2">
                <Label>Imagen de portada</Label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImagenPortada} />
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors text-sm">
                      <Image className="h-4 w-4" />
                      {config.imagenPortada ? 'Cambiar imagen' : 'Subir imagen'}
                    </div>
                  </label>
                  {config.imagenPortada && (
                    <div className="relative">
                      <img src={config.imagenPortada} alt="Portada" className="h-14 w-20 object-cover rounded" />
                      <button
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        onClick={() => setConfig({ ...config, imagenPortada: null })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagen de fondo */}
              <div className="space-y-2">
                <Label>Imagen de fondo (paginas de productos)</Label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImagenFondo} />
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors text-sm">
                      <Image className="h-4 w-4" />
                      {config.imagenFondo ? 'Cambiar fondo' : 'Subir fondo'}
                    </div>
                  </label>
                  {config.imagenFondo && (
                    <div className="relative">
                      <img src={config.imagenFondo} alt="Fondo" className="h-14 w-20 object-cover rounded" />
                      <button
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        onClick={() => setConfig({ ...config, imagenFondo: null })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Texto libre */}
              <div className="space-y-2">
                <Label htmlFor="textoLibre">
                  <Type className="h-4 w-4 inline mr-1" />
                  Texto adicional (aparece despues de los productos)
                </Label>
                <Textarea
                  id="textoLibre"
                  placeholder="Ej: Precios sujetos a cambio sin previo aviso. Envios a todo el pais..."
                  value={config.textoLibre}
                  onChange={e => setConfig({ ...config, textoLibre: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={irSiguiente} disabled={!config.nombreNegocio}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ====== PASO 2: PRODUCTOS ====== */}
      {paso === 'productos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {seleccionados.length} producto{seleccionados.length !== 1 && 's'} seleccionado{seleccionados.length !== 1 && 's'}
            </p>
          </div>

          {/* Grid de productos seleccionados */}
          {seleccionados.length > 0 && (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {seleccionados.map(prod => (
                <Card key={prod.id} className="relative group">
                  <button
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => quitarProducto(prod.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <CardContent className="p-3 text-center space-y-1">
                    <div
                      className="w-full h-16 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden"
                      onClick={() => abrirSelectorImagen(prod.id)}
                    >
                      {prod.imagen ? (
                        <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Image className="h-4 w-4" />
                          <span className="text-[10px] mt-0.5">+ Imagen</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium leading-tight truncate">{prod.nombre}</p>
                    <p className="text-xs text-primary font-semibold">{formatMoney(prod.precio)}</p>
                    {prod.esManual && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0">Manual</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Tabs: Inventario / Manual */}
          <Tabs defaultValue={tieneInventario ? 'inventario' : 'manual'}>
            <TabsList className="w-full">
              <TabsTrigger value="inventario" className="flex-1" disabled={!tieneInventario}>
                Desde inventario {!tieneInventario && '(vacio)'}
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">
                Agregar manual
              </TabsTrigger>
            </TabsList>

            {/* Tab inventario */}
            <TabsContent value="inventario" className="space-y-3">
              <Card
                className="border-dashed cursor-pointer hover:border-primary transition-colors"
                onClick={() => setCategoriaAbierta(categoriaAbierta ? null : 'menu')}
              >
                <CardContent className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Seleccionar productos del inventario</span>
                </CardContent>
              </Card>

              {categoriaAbierta && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {categoriaAbierta === 'menu' ? (
                      <>
                        <p className="text-sm font-medium">Selecciona una categoria:</p>
                        <div className="flex flex-wrap gap-2">
                          {categorias.map(cat => {
                            const cantProductos = productosActivos.filter(p => p.categoriaId === cat.id).length
                            return (
                              <Button
                                key={cat.id}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCategoriaAbierta(cat.id)
                                  setProductosCheck(new Set())
                                }}
                              >
                                {cat.nombre}
                                <Badge variant="secondary" className="ml-2">{cantProductos}</Badge>
                              </Button>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setCategoriaAbierta('menu')}>
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <p className="text-sm font-medium">
                              {categorias.find(c => c.id === categoriaAbierta)?.nombre}
                            </p>
                          </div>
                          {productosCheck.size > 0 && (
                            <Button size="sm" onClick={agregarSeleccionados}>
                              Agregar {productosCheck.size} producto{productosCheck.size !== 1 && 's'}
                            </Button>
                          )}
                        </div>

                        <button
                          className="text-xs text-primary hover:underline"
                          onClick={() => {
                            const productosCat = productosActivos
                              .filter(p => p.categoriaId === categoriaAbierta && !seleccionados.some(s => s.id === p.id))
                            setProductosCheck(new Set(productosCat.map(p => p.id)))
                          }}
                        >
                          Seleccionar todos
                        </button>

                        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                          {productosActivos
                            .filter(p => p.categoriaId === categoriaAbierta)
                            .map(prod => {
                              const yaSeleccionado = seleccionados.some(s => s.id === prod.id)
                              const checked = productosCheck.has(prod.id)
                              return (
                                <button
                                  key={prod.id}
                                  className={`flex items-center gap-2 p-2 rounded border text-left text-sm transition-colors ${
                                    yaSeleccionado
                                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                      : checked
                                        ? 'bg-primary/10 border-primary'
                                        : 'hover:bg-accent cursor-pointer'
                                  }`}
                                  disabled={yaSeleccionado}
                                  onClick={() => !yaSeleccionado && toggleProductoCheck(prod.id)}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    checked ? 'bg-primary border-primary' : yaSeleccionado ? 'bg-muted-foreground/20' : 'border-border'
                                  }`}>
                                    {(checked || yaSeleccionado) && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className="truncate flex-1">{prod.nombre}</span>
                                  <span className="text-xs font-medium ml-2 shrink-0">
                                    {yaSeleccionado ? 'Ya agregado' : formatMoney(prod.precioVenta)}
                                  </span>
                                </button>
                              )
                            })}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab manual */}
            <TabsContent value="manual">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del producto *</Label>
                      <Input
                        placeholder="Ej: Hamburguesa especial"
                        value={manualNombre}
                        onChange={e => setManualNombre(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={manualPrecio}
                        onChange={e => setManualPrecio(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Input
                        placeholder="Ej: Bebidas, Entradas..."
                        value={manualCategoria}
                        onChange={e => setManualCategoria(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripcion</Label>
                      <Input
                        placeholder="Breve descripcion..."
                        value={manualDescripcion}
                        onChange={e => setManualDescripcion(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImagenManual} />
                      <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors text-sm">
                        <Image className="h-4 w-4" />
                        {manualImagen ? 'Cambiar imagen' : 'Agregar imagen'}
                      </div>
                    </label>
                    {manualImagen && (
                      <div className="relative">
                        <img src={manualImagen} alt="Preview" className="h-12 w-12 object-cover rounded" />
                        <button
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                          onClick={() => setManualImagen(null)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Button onClick={agregarProductoManual} disabled={!manualNombre || !manualPrecio} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Agregar al catalogo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" onClick={irAtras}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Atras
            </Button>
            <Button onClick={irSiguiente} disabled={seleccionados.length === 0}>
              Vista previa <Eye className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ====== PASO 3: PREVIEW ====== */}
      {paso === 'preview' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{seleccionados.length} productos en el catalogo</p>

          {/* Preview de portada */}
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div
                className="p-8 text-center text-white space-y-2 relative"
                style={{ backgroundColor: config.colorPrimario }}
              >
                {config.imagenPortada && (
                  <img
                    src={config.imagenPortada}
                    alt="Portada"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="relative z-10 space-y-2">
                  {config.imagenLogo && (
                    <img src={config.imagenLogo} alt="Logo" className="h-16 w-16 mx-auto object-contain" />
                  )}
                  <h2 className="text-2xl font-bold">{config.nombreNegocio}</h2>
                  {config.slogan && <p className="text-sm opacity-90">{config.slogan}</p>}
                  {config.telefono && <p className="text-xs opacity-75">WhatsApp: {config.telefono}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview de productos agrupados por categoria */}
          {Object.entries(
            seleccionados.reduce<Record<string, ProductoCatalogo[]>>((acc, prod) => {
              const cat = prod.categoria || 'General'
              if (!acc[cat]) acc[cat] = []
              acc[cat].push(prod)
              return acc
            }, {})
          ).map(([categoria, prods]) => (
            <div key={categoria} className="space-y-2">
              <h3
                className="text-sm font-semibold px-2 py-1 rounded"
                style={{ color: config.colorPrimario }}
              >
                {categoria}
              </h3>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {prods.map(prod => (
                  <div key={prod.id} className="border rounded p-2 text-center space-y-1 relative"
                    style={config.imagenFondo ? { backgroundImage: `url(${config.imagenFondo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  >
                    {config.imagenFondo && <div className="absolute inset-0 bg-white/80 rounded" />}
                    <div className="relative z-10">
                      <div className="w-full h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {prod.imagen ? (
                          <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-muted-foreground text-[10px]">Sin imagen</span>
                        )}
                      </div>
                      <p className="text-xs font-medium leading-tight truncate">{prod.nombre}</p>
                      <p className="text-xs font-bold" style={{ color: config.colorPrimario }}>
                        {formatMoney(prod.precio)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Texto libre */}
          {config.textoLibre && (
            <>
              <Separator />
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{config.textoLibre}</p>
                </CardContent>
              </Card>
            </>
          )}

          <Separator />

          {/* Preview contraportada */}
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              {config.imagenLogo && (
                <img src={config.imagenLogo} alt="Logo" className="h-12 w-12 mx-auto object-contain" />
              )}
              <div className="w-20 h-20 mx-auto bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                QR Code
              </div>
              <p className="text-sm font-medium">{config.nombreNegocio}</p>
              {config.telefono && (
                <p className="text-xs text-muted-foreground">WhatsApp: {config.telefono}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={irAtras}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Editar productos
            </Button>
            <Button onClick={exportarPDF}>
              <FileDown className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
