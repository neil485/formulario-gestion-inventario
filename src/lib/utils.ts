import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return crypto.randomUUID()
}

export function formatMoney(amount: number) {
  return '$' + new Intl.NumberFormat('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-NI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generarNumeroTicket(numero: number) {
  return `V-${String(numero).padStart(5, '0')}`
}
