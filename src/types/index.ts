// Types pour les séries/sets
export interface Serie {
  id: string
  name: string
  releaseDate: string
  block?: string
}

export interface Set {
  id: string
  name: string
  releaseDate: string
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
