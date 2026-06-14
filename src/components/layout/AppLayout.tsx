import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { RolSwitch } from './RolSwitch'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export function AppLayout() {
  const [abierto, setAbierto] = useState(false)
  const [colapsado, setColapsado] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar desktop */}
      <aside className={`hidden md:flex ${colapsado ? 'w-16' : 'w-64'} border-r bg-card flex-col shrink-0 transition-all duration-200`}>
        <Sidebar colapsado={colapsado} onToggleColapso={() => setColapsado(!colapsado)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
          <div className="md:hidden">
            <Sheet open={abierto} onOpenChange={setAbierto}>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
                <Sidebar onNavegar={() => setAbierto(false)} />
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block" />
          <RolSwitch />
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t py-3 px-4 text-center text-xs text-muted-foreground">
          <p>v1.0.0</p>
          <p>Desarrollado por Nelson Romero</p>
        </footer>
      </div>
    </div>
  )
}
