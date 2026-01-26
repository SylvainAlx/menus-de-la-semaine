export class Stock {
  constructor(ingredients = []) {
    this.ingredients = ingredients;
  }

  ajouterIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  supprimerIngredient(ingredient) {
    this.ingredients = this.ingredients.filter(
      (ingr) => ingr.nom !== ingredient.nom,
    );
  }
}
