import { useStore } from '@/store/useStore'
import { formatMoney, formatDate } from '@/lib/utils'
import type { Venta } from '@/types'
import { Button } from '@/components/ui/button'
import { Printer, Share2 } from 'lucide-react'

interface TicketViewProps {
  venta: Venta
}

export function TicketView({ venta }: TicketViewProps) {
  const { ventaItems, productos, variantes } = useStore()
  const items = ventaItems.filter((vi) => vi.ventaId === venta.id)

  const compartirWhatsApp = () => {
    const lineas = items.map((item) => {
      const producto = productos.find((p) => p.id === item.productoId)
      const variante = item.varianteId ? variantes.find((v) => v.id === item.varianteId) : null
      const nombre = variante ? `${producto?.nombre} (${variante.nombre})` : producto?.nombre
      return `${item.cantidad}x ${nombre} - ${formatMoney(item.subtotal)}`
    })
    const texto = [
      `Ticket ${venta.numeroTicket}`,
      `Fecha: ${formatDate(venta.fecha)}`,
      venta.clienteNombre ? `Cliente: ${venta.clienteNombre}` : '',
      '',
      ...lineas,
      '',
      venta.descuento > 0 ? `Descuento: -${formatMoney(venta.descuento)}` : '',
      `TOTAL: ${formatMoney(venta.total)}`,
      `Pago: ${venta.metodoPago}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="border rounded-lg p-6 bg-white text-black print:border-none print:shadow-none">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">Tu Inventario</h2>
          <p className="text-sm text-gray-500">{venta.numeroTicket}</p>
          <p className="text-sm text-gray-500">{formatDate(venta.fecha)}</p>
          {venta.clienteNombre && <p className="text-sm">Cliente: {venta.clienteNombre}</p>}
        </div>

        <div className="border-t border-dashed pt-3 mb-3">
          {items.map((item) => {
            const producto = productos.find((p) => p.id === item.productoId)
            const variante = item.varianteId ? variantes.find((v) => v.id === item.varianteId) : null
            return (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>
                  {item.cantidad}x {producto?.nombre}
                  {variante && <span className="text-gray-500"> ({variante.nombre})</span>}
                </span>
                <span>{formatMoney(item.subtotal)}</span>
              </div>
            )
          })}
        </div>

        <div className="border-t border-dashed pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatMoney(venta.subtotal)}</span>
          </div>
          {venta.descuento > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Descuento</span>
              <span>-{formatMoney(venta.descuento)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>{formatMoney(venta.total)}</span>
          </div>
          <p className="text-center text-sm text-gray-500 capitalize">Pago: {venta.metodoPago}</p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Gracias por su compra</p>
      </div>

      <div className="flex gap-2 mt-4 print:hidden">
        <Button onClick={() => window.print()} className="flex-1" variant="outline">
          <Printer className="h-4 w-4 mr-2" /> Imprimir
        </Button>
        <Button onClick={compartirWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
          <Share2 className="h-4 w-4 mr-2" /> WhatsApp
        </Button>
      </div>
    </div>
  )
}
