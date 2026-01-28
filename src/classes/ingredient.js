export class Ingredient {
  constructor(nom, quantite = 0, unite = "") {
    this.nom = nom;
    this.quantite = quantite;
    this.unite = unite;
  }
}
