import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatMoney } from '@/lib/utils'
import { SearchInput } from '@/components/shared/SearchInput'
import { StockBadge } from '@/components/shared/StockBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const ITEMS_POR_PAGINA = 10

export function Productos() {
  const { productos, variantes, categorias, rolActual, eliminarProducto, getStockProducto } = useStore()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [pagina, setPagina] = useState(1)
  const esAdmin = rolActual === 'admin'

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => p.activo)
      .filter((p) => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          (p.codigoBarras && p.codigoBarras.includes(busqueda))
        const coincideCategoria = categoriaFiltro === 'todas' || p.categoriaId === categoriaFiltro
        return coincideBusqueda && coincideCategoria
      })
  }, [productos, busqueda, categoriaFiltro])

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA)
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  )

  const handleEliminar = (id: string, nombre: string) => {
    if (confirm(`Eliminar "${nombre}"?`)) {
      eliminarProducto(id)
      toast.success(`"${nombre}" eliminado`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        {esAdmin && (
          <Link to="/productos/nuevo">
            <Button><Plus className="h-4 w-4 mr-2" /> Nuevo Producto</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={busqueda}
            onChange={(v) => { setBusqueda(v); setPagina(1) }}
            placeholder="Buscar por nombre o codigo..."
          />
        </div>
        <Select value={categoriaFiltro} onValueChange={(v) => { if (v) { setCategoriaFiltro(v); setPagina(1) } }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas" label="Todas">Todas</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={c.id} label={c.nombre}>{c.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              {esAdmin && <TableHead className="hidden md:table-cell">P. Compra</TableHead>}
              <TableHead>P. Venta</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productosPagina.length === 0 ? (
              <TableRow>
                <TableCell colSpan={esAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              productosPagina.map((producto) => {
                const categoria = categorias.find((c) => c.id === producto.categoriaId)
                const stockTotal = getStockProducto(producto.id)
                const stockMinimo = producto.tieneVariantes
                  ? variantes
                      .filter((v) => v.productoId === producto.id)
                      .reduce((min, v) => Math.min(min, v.stockMinimo), Infinity)
                  : producto.stockMinimo
                return (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        {producto.tieneVariantes && (
                          <p className="text-xs text-muted-foreground">
                            {variantes.filter((v) => v.productoId === producto.id).length} variantes
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{categoria?.nombre}</TableCell>
                    {esAdmin && (
                      <TableCell className="hidden md:table-cell">{formatMoney(producto.precioCompra)}</TableCell>
                    )}
                    <TableCell>{formatMoney(producto.precioVenta)}</TableCell>
                    <TableCell>
                      <StockBadge stock={stockTotal} stockMinimo={stockMinimo === Infinity ? 0 : stockMinimo} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/productos/${producto.id}`}>
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        {esAdmin && (
                          <>
                            <Link to={`/productos/${producto.id}/editar`}>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => handleEliminar(producto.id, producto.nombre)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {pagina} / {totalPaginas}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
