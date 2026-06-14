import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function Proveedores() {
  const { proveedores, agregarProveedor, editarProveedor, eliminarProveedor } = useStore()
  const [abierto, setAbierto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [nota, setNota] = useState('')

  const limpiarForm = () => {
    setNombre('')
    setTelefono('')
    setEmail('')
    setNota('')
    setEditandoId(null)
  }

  const abrirEdicion = (id: string) => {
    const prov = proveedores.find((p) => p.id === id)
    if (!prov) return
    setEditandoId(id)
    setNombre(prov.nombre)
    setTelefono(prov.telefono || '')
    setEmail(prov.email || '')
    setNota(prov.nota || '')
    setAbierto(true)
  }

  const guardar = () => {
    if (!nombre) { toast.error('Nombre requerido'); return }
    if (editandoId) {
      editarProveedor(editandoId, { nombre, telefono: telefono || undefined, email: email || undefined, nota: nota || undefined })
      toast.success('Proveedor actualizado')
    } else {
      agregarProveedor({ nombre, telefono: telefono || undefined, email: email || undefined, nota: nota || undefined })
      toast.success('Proveedor agregado')
    }
    limpiarForm()
    setAbierto(false)
  }

  const handleEliminar = (id: string, nom: string) => {
    if (confirm(`Eliminar proveedor "${nom}"?`)) {
      eliminarProveedor(id)
      toast.success('Proveedor eliminado')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <Dialog open={abierto} onOpenChange={(open) => { setAbierto(open); if (!open) limpiarForm() }}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editandoId ? 'Editar' : 'Nuevo'} Proveedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefono</Label>
                  <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nota</Label>
                <Input value={nota} onChange={(e) => setNota(e.target.value)} />
              </div>
              <Button onClick={guardar} className="w-full">Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">Telefono</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Sin proveedores registrados
                </TableCell>
              </TableRow>
            ) : (
              proveedores.map((prov) => (
                <TableRow key={prov.id}>
                  <TableCell className="font-medium">{prov.nombre}</TableCell>
                  <TableCell className="hidden sm:table-cell">{prov.telefono || '-'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{prov.email || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicion(prov.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEliminar(prov.id, prov.nombre)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
