// Types pour les séries/sets (basés sur la structure backend)
export interface Serie {
  id: string
  name: string
  logo?: string | null
  symbol?: string | null
  cardCount?: {
    total: number
    official: number
  }
}

export interface Set {
  id: string
  apiSetId: string
  name: string
  logo?: string | null
  symbol?: string | null
  releaseDate?: string | null
  serie?: Serie
}

// Types pour les cartes
export interface Card {
  id: string
  name: string
  imageUrl?: string
  rarity?: string
  set?: Set
}

// Types pour l'API
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Types pour les erreurs
export interface ApiError {
  message: string
  status?: number
}
