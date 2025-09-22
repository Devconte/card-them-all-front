// Mapping des noms de sets vers leurs images correspondantes
export const SET_IMAGES: Record<string, string> = {
  // Sets récents (Écarlate et Violet)
  'Foudre Noire': '/foudrenoire.png',
  'Flamme Blanche': '/foudreblanche.png', // Note: pas d'image spécifique, utilise foudreblanche
  'Rivalités Destinées': '/rivalitedestineee.png',
  'Aventures Ensemble': '/aventuresnesemble.png',
  'Évolutions Prismatiques': '/évolution prismatique.png',
  'Couronne Stellaire': '/couronnestelaire.png',
  'Étincelles Déferlantes': '/etincelledeferlante.png',

  // Sets Épée et Bouclier
  'Tempête Argentée': '/tempeteargentee.png',
  'Origine Perdue': '/origineperdue.png',
  'Astres Radieux': '/astreradieux.png',
  'Stars Étincelantes': '/staretincelantes.png',

  // Autres sets avec images spécifiques
  'Fable Nébuleuse': '/fablenebuleuse.png',
  'Faille Paradoxe': '/failleparadoxe.png',
  'Mascarade Crépusculaire': '/mascarade.png',
  'Forces Temporelles': '/forcetemporelle.png',
  'Destinées de Paldea': '/destinepaldea.png',
  'Écarlate et Violet': '/ecarlateviolet.png',
  'Évolutions à Paldea': '/evolutionpaldea.png',
  'Flammes Obsidiennes': '/flammeobsidienne.png',
  '151': '/151.png',
};

// Fonction pour obtenir l'image d'un set
export function getSetImage(setName: string): string {
  return SET_IMAGES[setName] || '/placeholder.png'; // Fallback vers placeholder si pas d'image
}

// Fonction pour vérifier si un set a une image spécifique
export function hasSetImage(setName: string): boolean {
  return setName in SET_IMAGES;
}
