import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockBadge } from '@/components/shared/StockBadge'
import { ArrowLeft, Pencil } from 'lucide-react'

export function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productos, variantes, categorias, rolActual, getStockProducto } = useStore()
  const esAdmin = rolActual === 'admin'

  const producto = productos.find((p) => p.id === id)
  if (!producto) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Button variant="link" onClick={() => navigate('/productos')}>Volver</Button>
      </div>
    )
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId)
  const variasProducto = variantes.filter((v) => v.productoId === producto.id)
  const stockTotal = getStockProducto(producto.id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{producto.nombre}</h1>
        </div>
        {esAdmin && (
          <Link to={`/productos/${producto.id}/editar`}>
            <Button variant="outline"><Pencil className="h-4 w-4 mr-2" /> Editar</Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Informacion</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Categoria</p>
              <p className="font-medium">{categoria?.nombre}</p>
            </div>
            {esAdmin && (
              <div>
                <p className="text-muted-foreground">Precio Compra</p>
                <p className="font-medium">{formatMoney(producto.precioCompra)}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Precio Venta</p>
              <p className="font-medium">{formatMoney(producto.precioVenta)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stock Total</p>
              <p className="font-medium">{stockTotal} unidades</p>
            </div>
            {producto.codigoBarras && (
              <div>
                <p className="text-muted-foreground">Codigo</p>
                <p className="font-medium">{producto.codigoBarras}</p>
              </div>
            )}
          </div>
          {producto.descripcion && (
            <div className="text-sm">
              <p className="text-muted-foreground">Descripcion</p>
              <p>{producto.descripcion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {producto.tieneVariantes && variasProducto.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Stock por Variante</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {variasProducto.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{v.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Min: {v.stockMinimo}</span>
                    <StockBadge stock={v.stock} stockMinimo={v.stockMinimo} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
