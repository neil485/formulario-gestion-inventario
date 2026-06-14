export type FuenteCatalogo = 'helvetica' | 'times' | 'courier'

export interface ConfigCatalogo {
  nombreNegocio: string
  slogan: string
  telefono: string
  colorPrimario: string
  colorSecundario: string
  fuente: FuenteCatalogo
  imagenPortada: string | null
  imagenFondo: string | null
  imagenLogo: string | null
  textoLibre: string
}

export interface ProductoCatalogo {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen: string | null
  esManual: boolean
}

export const CONFIG_INICIAL: ConfigCatalogo = {
  nombreNegocio: '',
  slogan: '',
  telefono: '',
  colorPrimario: '#1e40af',
  colorSecundario: '#f59e0b',
  fuente: 'helvetica',
  imagenPortada: null,
  imagenFondo: null,
  imagenLogo: null,
  textoLibre: '',
}
