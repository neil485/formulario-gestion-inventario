import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatMoney, formatDate } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/shared/SearchInput'
import { Receipt } from 'lucide-react'

export function VentasHistorial() {
  const { ventas, rolActual } = useStore()
  const [busqueda, setBusqueda] = useState('')

  const ventasFiltradas = ventas
    .filter((v) => {
      if (rolActual === 'vendedor' && v.creadoPor !== 'vendedor') return false
      if (busqueda) {
        return v.numeroTicket.toLowerCase().includes(busqueda.toLowerCase()) ||
          (v.clienteNombre && v.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()))
      }
      return true
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Historial de Ventas</h1>

      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por ticket o cliente..." />

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead className="hidden sm:table-cell">Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay ventas registradas
                </TableCell>
              </TableRow>
            ) : (
              ventasFiltradas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-medium">{venta.numeroTicket}</TableCell>
                  <TableCell className="hidden sm:table-cell">{venta.clienteNombre || '-'}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{formatDate(venta.fecha)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{venta.metodoPago}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatMoney(venta.total)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/ventas/${venta.id}/ticket`}>
                      <Button variant="ghost" size="icon"><Receipt className="h-4 w-4" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
