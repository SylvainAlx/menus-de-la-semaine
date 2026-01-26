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

  createTile() {
    const tile = document.createElement("div");
    tile.classList.add("plat-card");
    tile.innerHTML = `
      <div class="plat-header">
        <h3 class="plat-nom">${this.nom}</h3>
        ${this.vegetarien ? '<span class="plat-badge">Veggie</span>' : ""}
      </div>
      <div class="plat-details">
        <div class="plat-info">
          <span>⏱️ ${this.duree_preparation} min</span>
        </div>
        <div class="plat-info">
          <span>🍴 ${this.repas.midi ? "Midi" : ""} ${this.repas.midi && this.repas.soir ? "&" : ""} ${this.repas.soir ? "Soir" : ""}</span>
        </div>
        <div class="plat-info">
          <span> 🌾 ${this.saisons.join(", ")}</span>
        </div>
        <ul class="ingredients-list">
          ${this.ingredients
            .map(
              (ing) => `
            <li>
              <span>${ing.nom}</span>
              <span>${ing.quantite} ${ing.unite}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    `;
    return tile;
  }
}
