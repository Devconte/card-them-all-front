// Types pour les séries/sets (basés sur la structure backend)
export interface Serie {
  id: string;
  name: string;
  logo?: string | null;
  symbol?: string | null;
  cardCount?: {
    total: number;
    official: number;
  };
}

export interface Set {
  id: string;
  apiSetId: string;
  name: string;
  logo?: string | null;
  symbol?: string | null;
  releaseDate?: string | null;
  cardCount?: {
    total: number;
    official: number;
  };
  serie?: Serie;
}

// Types pour les cartes (complet basé sur l'API backend)
export interface Card {
  id: string;
  apiCardId: string;
  localId: string;
  name: string;
  category?: string;
  illustrator?: string;
  image?: string;
  hp?: number;
  types?: string[];
  evolveFrom?: string;
  stage?: string;
  attacks?: unknown[];
  weaknesses?: unknown[];
  retreat?: number;
  regulationMark?: string;
  legal?: unknown;
  variants?: unknown;
  updated?: string;
  setId?: string;
  rarity?: {
    id: string;
    name: string;
  };
  set?: {
    id: string;
    name: string;
    serie?: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Types pour l'API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  status?: number;
}
