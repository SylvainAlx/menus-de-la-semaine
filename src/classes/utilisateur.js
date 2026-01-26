import { Plat } from "./plat.js";
import { Ingredient } from "./ingredient.js";
import { MenusDeLaSemaine } from "./menus.js";
import { Stock } from "./stock.js";

export class Utilisateur {
  constructor() {
    this.stock = new Stock();
    this.plats = [];
    this.historique_menus = [];
  }

  AfficherStock() {
    const stock = document.getElementById("ingredients_en_stock");
    if (!stock) return;
    stock.innerHTML = this.stock.ingredients
      .map((ingredient) => ingredient.nom)
      .join(", ");
    if (!this.stock || this.stock.ingredients.length === 0) {
      stock.innerHTML = "<p>Aucun ingredient en stock.</p>";
      return;
    }
  }

  AfficherPlats() {
    const platsContainer = document.getElementById("liste_plats");
    if (!platsContainer) return;
    platsContainer.innerHTML = "";
    if (!this.plats || this.plats.length === 0) {
      platsContainer.innerHTML = "<p>Aucun plat enregistré.</p>";
      return;
    }
    this.plats.map((plat) => platsContainer.appendChild(plat.createTile()));
  }

  AfficherHistoriqueMenus() {
    const historique_menus = document.getElementById("historique_menus");
    if (!historique_menus) return;
    historique_menus.innerHTML = this.historique_menus
      .map((historique_menu) => historique_menu.nom)
      .join(", ");
    if (!this.historique_menus || this.historique_menus.length === 0) {
      historique_menus.innerHTML = "<p>Aucun menu enregistré.</p>";
      return;
    }
  }

  AjouterPlat(plat) {
    this.plats.push(plat);
    console.log(this.plats);
    this.AfficherPlats();
  }

  async chargerDataDepuisJson() {
    if (typeof window === "undefined") return;
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            const jsonSession = event.target.result;
            const session = JSON.parse(jsonSession);
            this.stock = new Stock(session.stock.ingredients);
            this.plats = session.plats.map(
              (plat) =>
                new Plat(
                  plat.nom,
                  plat.ingredients.map(
                    (ingredient) =>
                      new Ingredient(
                        ingredient.nom,
                        ingredient.quantite,
                        ingredient.unite,
                      ),
                  ),
                  plat.repas,
                  plat.saisons,
                  plat.duree_preparation,
                  plat.vegetarien,
                ),
            );
            this.historique_menus = session.historique_menus.map(
              (menusDeLaSemaine) =>
                new MenusDeLaSemaine(menusDeLaSemaine.menus),
            );
            this.AfficherStock();
            this.AfficherPlats();
            this.AfficherHistoriqueMenus();
          });
          reader.readAsText(file);
        }
      });
      input.click();
    } catch (error) {
      console.error("Erreur lors du chargement des données JSON :", error);
    }
  }

  async telechargerDataEnJson() {
    try {
      const data = JSON.stringify(this);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données JSON :", error);
    }
  }
}
