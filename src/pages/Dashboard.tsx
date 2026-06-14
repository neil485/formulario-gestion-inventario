import { useStore } from '@/store/useStore'
import { formatMoney } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockBadge } from '@/components/shared/StockBadge'
import { AlertTriangle, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const { ventas, ventaItems, productos, variantes, rolActual, getProductosStockBajo } = useStore()

  const hoy = new Date().toDateString()
  const ventasHoy = ventas.filter((v) => new Date(v.fecha).toDateString() === hoy)
  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0)

  const stockBajo = getProductosStockBajo()

  // Top 5 productos mas vendidos (ultimo mes)
  const hace30Dias = new Date()
  hace30Dias.setDate(hace30Dias.getDate() - 30)
  const ventasRecientes = ventas.filter((v) => new Date(v.fecha) >= hace30Dias)
  const idsVentasRecientes = new Set(ventasRecientes.map((v) => v.id))
  const itemsRecientes = ventaItems.filter((vi) => idsVentasRecientes.has(vi.ventaId))

  const conteoProductos: Record<string, number> = {}
  for (const item of itemsRecientes) {
    conteoProductos[item.productoId] = (conteoProductos[item.productoId] || 0) + item.cantidad
  }
  const topProductos = Object.entries(conteoProductos)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, cantidad]) => ({
      producto: productos.find((p) => p.id === id),
      cantidad,
    }))
    .filter((t) => t.producto)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalHoy)}</div>
            <p className="text-xs text-muted-foreground">{ventasHoy.length} ventas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.filter((p) => p.activo).length}</div>
            <p className="text-xs text-muted-foreground">{variantes.length} variantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stockBajo.length}</div>
            <p className="text-xs text-muted-foreground">productos por resurtir</p>
          </CardContent>
        </Card>
      </div>

      {/* Productos a resurtir - PROTAGONISTA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Productos a Resurtir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockBajo.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Todo el inventario esta bien abastecido</p>
          ) : (
            <div className="space-y-3">
              {stockBajo.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.producto.nombre}</p>
                    {item.variante && (
                      <p className="text-sm text-muted-foreground">{item.variante.nombre}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Min: {item.stockMinimo}</span>
                    <StockBadge stock={item.stockActual} stockMinimo={item.stockMinimo} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top productos */}
      {rolActual === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 5 Productos (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProductos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Sin ventas en los ultimos 30 dias</p>
            ) : (
              <div className="space-y-3">
                {topProductos.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <span className="font-medium">{item.producto!.nombre}</span>
                    </div>
                    <span className="text-sm font-medium">{item.cantidad} uds</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
