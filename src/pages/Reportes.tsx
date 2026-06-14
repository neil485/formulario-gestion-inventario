import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { exportarExcel, exportarPDF } from '@/lib/reportes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react'

type Periodo = 'semanal' | 'quincenal' | 'mensual' | 'anual'

const PERIODOS: { value: Periodo; label: string; dias: number }[] = [
  { value: 'semanal', label: 'Semanal (7 dias)', dias: 7 },
  { value: 'quincenal', label: 'Quincenal (15 dias)', dias: 15 },
  { value: 'mensual', label: 'Mensual (30 dias)', dias: 30 },
  { value: 'anual', label: 'Anual (365 dias)', dias: 365 },
]

export function Reportes() {
  const store = useStore()
  const [periodo, setPeriodo] = useState<Periodo>('mensual')

  const periodoInfo = PERIODOS.find((p) => p.value === periodo)!
  const fechaFin = new Date()
  const fechaInicio = new Date()
  fechaInicio.setDate(fechaInicio.getDate() - periodoInfo.dias)

  const formatFecha = (d: Date) =>
    d.toLocaleDateString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const datosReporte = {
    productos: store.productos,
    variantes: store.variantes,
    categorias: store.categorias,
    ventas: store.ventas,
    ventaItems: store.ventaItems,
    compras: store.compras,
    compraItems: store.compraItems,
    proveedores: store.proveedores,
    fechaInicio,
    fechaFin,
    periodo: periodoInfo.label,
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Reportes</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seleccionar Periodo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PERIODOS.map((p) => (
              <Button
                key={p.value}
                variant={periodo === p.value ? 'default' : 'outline'}
                onClick={() => setPeriodo(p.value)}
                className="w-full"
              >
                {p.label.split(' ')[0]}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {formatFecha(fechaInicio)} - {formatFecha(fechaFin)}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => exportarExcel(datosReporte)}>
          <CardContent className="flex flex-col items-center gap-3 py-8">
            <FileSpreadsheet className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <p className="font-bold text-lg">Descargar Excel</p>
              <p className="text-sm text-muted-foreground">Reporte {periodoInfo.label.split(' ')[0].toLowerCase()} completo</p>
              <p className="text-xs text-muted-foreground mt-1">Incluye: resumen, ventas, top productos, inventario</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => exportarPDF(datosReporte)}>
          <CardContent className="flex flex-col items-center gap-3 py-8">
            <FileText className="h-12 w-12 text-red-600" />
            <div className="text-center">
              <p className="font-bold text-lg">Descargar PDF</p>
              <p className="text-sm text-muted-foreground">Reporte {periodoInfo.label.split(' ')[0].toLowerCase()} completo</p>
              <p className="text-xs text-muted-foreground mt-1">Incluye: resumen, graficas, detalle de ventas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Que incluyen los reportes?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Resumen financiero (ventas, compras, ganancia)</li>
            <li>Top 10 productos mas vendidos</li>
            <li>Ventas desglosadas por categoria</li>
            <li>Ventas por metodo de pago</li>
            <li>Detalle de cada venta del periodo</li>
            <li>Estado actual del inventario (Excel)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
