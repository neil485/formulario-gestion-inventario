import { useStore } from '@/store/useStore'
import { Switch } from '@/components/ui/switch'
import { Shield, User } from 'lucide-react'

export function RolSwitch() {
  const { rolActual, setRol } = useStore()

  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4" />
      <Switch
        checked={rolActual === 'admin'}
        onCheckedChange={(checked) => setRol(checked ? 'admin' : 'vendedor')}
      />
      <Shield className="h-4 w-4" />
      <span className="text-sm font-medium capitalize hidden sm:inline">{rolActual}</span>
    </div>
  )
}
