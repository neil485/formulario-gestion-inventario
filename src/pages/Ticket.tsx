import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { TicketView } from '@/components/shared/TicketView'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function Ticket() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ventas } = useStore()

  const venta = ventas.find((v) => v.id === id)

  if (!venta) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ticket no encontrado</p>
        <Button variant="link" onClick={() => navigate('/ventas')}>Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="print:hidden">
        <ArrowLeft className="h-4 w-4 mr-2" /> Volver
      </Button>
      <TicketView venta={venta} />
    </div>
  )
}
