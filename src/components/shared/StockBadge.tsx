import { Badge } from '@/components/ui/badge'

interface StockBadgeProps {
  stock: number
  stockMinimo: number
}

export function StockBadge({ stock, stockMinimo }: StockBadgeProps) {
  if (stock === 0) {
    return <Badge variant="destructive">Agotado</Badge>
  }
  if (stock <= stockMinimo) {
    return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Bajo ({stock})</Badge>
  }
  return <Badge className="bg-green-600 hover:bg-green-700 text-white">{stock}</Badge>
}
