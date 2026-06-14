import { useStore } from '@/store/useStore'
import { formatMoney, formatDate } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function ComprasHistorial() {
  const { compras, proveedores } = useStore()
  const comprasOrdenadas = [...compras].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Historial de Compras</h1>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="hidden sm:table-cell">Nota</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comprasOrdenadas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Sin compras registradas
                </TableCell>
              </TableRow>
            ) : (
              comprasOrdenadas.map((compra) => {
                const proveedor = proveedores.find((p) => p.id === compra.proveedorId)
                return (
                  <TableRow key={compra.id}>
                    <TableCell className="font-medium">{proveedor?.nombre || '-'}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{formatDate(compra.fecha)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{compra.nota || '-'}</TableCell>
                    <TableCell className="font-medium">{formatMoney(compra.total)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
