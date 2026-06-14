import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Productos } from '@/pages/Productos'
import { ProductoForm } from '@/pages/ProductoForm'
import { ProductoDetalle } from '@/pages/ProductoDetalle'
import { NuevaVenta } from '@/pages/NuevaVenta'
import { VentasHistorial } from '@/pages/VentasHistorial'
import { Ticket } from '@/pages/Ticket'
import { NuevaCompra } from '@/pages/NuevaCompra'
import { ComprasHistorial } from '@/pages/ComprasHistorial'
import { Proveedores } from '@/pages/Proveedores'
import { Reportes } from '@/pages/Reportes'
import { Catalogo } from '@/pages/Catalogo'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'productos', element: <Productos /> },
      { path: 'productos/nuevo', element: <ProductoForm /> },
      { path: 'productos/:id', element: <ProductoDetalle /> },
      { path: 'productos/:id/editar', element: <ProductoForm /> },
      { path: 'ventas/nueva', element: <NuevaVenta /> },
      { path: 'ventas', element: <VentasHistorial /> },
      { path: 'ventas/:id/ticket', element: <Ticket /> },
      { path: 'compras/nueva', element: <NuevaCompra /> },
      { path: 'compras', element: <ComprasHistorial /> },
      { path: 'proveedores', element: <Proveedores /> },
      { path: 'reportes', element: <Reportes /> },
      { path: 'catalogo', element: <Catalogo /> },
    ],
  },
])
