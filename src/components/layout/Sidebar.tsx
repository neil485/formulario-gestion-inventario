import { NavLink } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Truck,
  ClipboardList,
  Users,
  BarChart3,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const enlaces = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, soloAdmin: false },
  { to: '/productos', label: 'Inventario', icon: Package, soloAdmin: false },
  { to: '/ventas/nueva', label: 'Nueva Venta', icon: ShoppingCart, soloAdmin: false },
  { to: '/ventas', label: 'Historial Ventas', icon: History, soloAdmin: false },
  { to: '/compras/nueva', label: 'Nueva Compra', icon: Truck, soloAdmin: true },
  { to: '/compras', label: 'Historial Compras', icon: ClipboardList, soloAdmin: true },
  { to: '/proveedores', label: 'Proveedores', icon: Users, soloAdmin: true },
  { to: '/reportes', label: 'Reportes', icon: BarChart3, soloAdmin: true },
  { to: '/catalogo', label: 'Catalogo', icon: BookOpen, soloAdmin: true },
]

interface SidebarProps {
  onNavegar?: () => void
  colapsado?: boolean
  onToggleColapso?: () => void
}

export function Sidebar({ onNavegar, colapsado = false, onToggleColapso }: SidebarProps) {
  const { rolActual } = useStore()
  const enlacesFiltrados = enlaces.filter((e) => !e.soloAdmin || rolActual === 'admin')

  return (
    <nav className="flex flex-col gap-1 p-3 h-full">
      <div className={cn('flex items-center mb-2', colapsado ? 'justify-center py-4' : 'justify-between px-3 py-4')}>
        {!colapsado && <h1 className="text-xl font-bold">Tu Inventario</h1>}
        {onToggleColapso && (
          <Button variant="ghost" size="icon" onClick={onToggleColapso} className="h-8 w-8">
            {colapsado ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {enlacesFiltrados.map((enlace) => (
        <NavLink
          key={enlace.to}
          to={enlace.to}
          end={enlace.to === '/'}
          onClick={onNavegar}
          title={colapsado ? enlace.label : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-sm font-medium transition-colors',
              colapsado ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <enlace.icon className="h-4 w-4 shrink-0" />
          {!colapsado && enlace.label}
        </NavLink>
      ))}
    </nav>
  )
}
