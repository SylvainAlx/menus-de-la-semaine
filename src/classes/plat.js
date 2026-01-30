export class Plat {
  constructor(
    nom,
    ingredients = [],
    repas = { midi: false, soir: false },
    saisons = ["ete", "hiver", "printemps", "automne"],
    duree_preparation = 0,
    vegetarien = false,
  ) {
    this.nom = nom;
    this.ingredients = ingredients;
    this.repas = repas;
    this.saisons = saisons;
    this.duree_preparation = duree_preparation;
    this.vegetarien = vegetarien;
  }
}
