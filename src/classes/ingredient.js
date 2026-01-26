export class Ingredient {
  constructor(nom, quantite = 0, unite = "", peremption = null) {
    this.nom = nom;
    this.quantite = quantite;
    this.unite = unite;
    this.peremption = peremption;
  }
}
