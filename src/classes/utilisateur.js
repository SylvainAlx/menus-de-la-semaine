import { Plat } from "./plat.js";
import { Ingredient } from "./ingredient.js";
import { MenusDeLaSemaine } from "./menus.js";

export class Utilisateur {
  constructor() {
    this.plats = [];
    this.menus = [];
    this.filtres = {
      saison: "toutes",
      vegetarien: false,
      moment: "tous",
      dureeMax: Infinity,
    };
    if (typeof window !== "undefined") {
      this.chargerDepuisLocalStorage();
    }
  }
  reset() {
    this.plats = [];
    this.menus = [];
    this.filtres = {
      saison: "toutes",
      vegetarien: false,
      moment: "tous",
      dureeMax: Infinity,
    };
    this.sauvegarderDansLocalStorage();
    this.cacherBoutonSauvegarder();
  }

  sauvegarderDansLocalStorage() {
    if (typeof window === "undefined") return;
    localStorage.setItem("menus_repas_data", JSON.stringify(this));
  }

  chargerDepuisLocalStorage() {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("menus_repas_data");
    if (data) {
      try {
        this.parserEtChargerData(data);
        console.log("Données chargées depuis le localStorage");
        this.cacherBoutonSauvegarder();
      } catch (error) {
        console.error(
          "Erreur lors du chargement depuis le localStorage:",
          error,
        );
      }
    }
  }

  parserEtChargerData(jsonSession) {
    const session = JSON.parse(jsonSession);
    this.plats = (session.plats || []).map(
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
          plat.recette,
        ),
    );
    this.menus = (session.menus || []).map(
      (menusDeLaSemaine) => new MenusDeLaSemaine(menusDeLaSemaine.menus),
    );
  }

  getPlatsFiltres() {
    let platsAAfficher = [...this.plats];

    // Tri par défaut : alphabétique
    platsAAfficher.sort((a, b) => a.nom.localeCompare(b.nom));

    // Application des filtres
    if (this.filtres.vegetarien) {
      platsAAfficher = platsAAfficher.filter((p) => p.vegetarien);
    }

    if (this.filtres.saison !== "toutes") {
      platsAAfficher = platsAAfficher.filter((p) =>
        p.saisons.includes(this.filtres.saison),
      );
    }

    if (this.filtres.moment === "midi") {
      platsAAfficher = platsAAfficher.filter((p) => p.repas.midi);
    } else if (this.filtres.moment === "soir") {
      platsAAfficher = platsAAfficher.filter((p) => p.repas.soir);
    }

    if (this.filtres.dureeMax !== Infinity && this.filtres.dureeMax !== null) {
      platsAAfficher = platsAAfficher.filter(
        (p) => p.duree_preparation <= this.filtres.dureeMax,
      );
    }

    return platsAAfficher;
  }

  afficherBoutonSauvegarder() {
    const btn = document.getElementById("btn-sauvegarder");
    btn?.classList.remove("hidden");
  }

  cacherBoutonSauvegarder() {
    const btn = document.getElementById("btn-sauvegarder");
    btn?.classList.add("hidden");
  }

  appliquerFiltres(nouveauxFiltres) {
    this.filtres = { ...this.filtres, ...nouveauxFiltres };
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  calculerIngredientsMenu(menu) {
    const ingredientsTotaux = {};

    if (!menu.menus) return ingredientsTotaux;

    menu.menus.forEach((jour) => {
      [jour.midi, jour.soir].forEach((plat) => {
        if (plat && plat.ingredients && Array.isArray(plat.ingredients)) {
          plat.ingredients.forEach((ing) => {
            if (!ing.nom) return;
            const unit = (ing.unite || "").toLowerCase();
            const key = `${ing.nom.toLowerCase()}_${unit}`;
            if (!ingredientsTotaux[key]) {
              ingredientsTotaux[key] = {
                nom: ing.nom,
                quantite: 0,
                unite: ing.unite || "",
              };
            }
            const qte = parseFloat(ing.quantite) || 0;
            ingredientsTotaux[key].quantite += qte;
          });
        }
      });
    });

    return ingredientsTotaux;
  }

  telechargerMenuTexte(menu) {
    let text = `MENU DE LA SEMAINE DU ${menu.date}\n`;
    text += "=".repeat(text.length - 1) + "\n\n";

    text += "--- LES MENUS ---\n\n";
    menu.menus.forEach((jour) => {
      text += `${jour.date.toUpperCase()}\n`;
      text += `  Midi : ${jour.midi ? jour.midi.nom : "Pas de plat"}\n`;
      text += `  Soir : ${jour.soir ? jour.soir.nom : "Pas de plat"}\n\n`;
    });

    text += "\n--- LISTE DE COURSES ---\n\n";
    const shoppingList = this.calculerIngredientsMenu(menu);
    const ingredients = Object.values(shoppingList).sort((a, b) =>
      a.nom.localeCompare(b.nom),
    );

    if (ingredients.length > 0) {
      ingredients.forEach((ing) => {
        text += `- ${ing.nom} : ${ing.quantite} ${ing.quantite > 1 ? ing.unite + "(s)" : ing.unite}\n`;
      });
    } else {
      text += "Aucun ingrédient nécessaire.\n";
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `menu_semaine_${menu.date.replace(/[\/\s]/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  ajouterMenu(menu) {
    this.menus.push(menu);
    this.sauvegarderDansLocalStorage();
    this.afficherBoutonSauvegarder();
  }

  supprimerMenu(date) {
    this.menus = this.menus.filter((menu) => menu.date !== date);
    this.sauvegarderDansLocalStorage();
    this.afficherBoutonSauvegarder();
  }

  modifierMenu(ancienMenu, nouveauMenu) {
    const index = this.menus.findIndex((m) => m === ancienMenu);
    if (index !== -1) {
      this.menus[index] = nouveauMenu;
      this.sauvegarderDansLocalStorage();
      this.afficherBoutonSauvegarder();
    }
  }

  ajouterPlat(plat) {
    this.plats.push(plat);
    this.sauvegarderDansLocalStorage();
    this.afficherBoutonSauvegarder();
  }

  supprimerPlat(plat) {
    this.plats = this.plats.filter((p) => p.nom !== plat.nom);
    this.sauvegarderDansLocalStorage();
    this.afficherBoutonSauvegarder();
  }

  modifierPlat(ancienPlat, nouveauPlat) {
    const index = this.plats.findIndex((p) => p === ancienPlat);
    if (index !== -1) {
      this.plats[index] = nouveauPlat;
      this.sauvegarderDansLocalStorage();
      this.afficherBoutonSauvegarder();
    }
  }

  getOccurrencePlat(platNom) {
    let count = 0;
    this.menus.forEach((semaine) => {
      semaine.menus.forEach((jour) => {
        if (jour.midi && jour.midi.nom === platNom) count++;
        if (jour.soir && jour.soir.nom === platNom) count++;
      });
    });
    return count;
  }

  async chargerDataDepuisJson() {
    if (typeof window === "undefined") return;
    return new Promise((resolve, reject) => {
      try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.addEventListener("change", (event) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
              try {
                const jsonSession = event.target?.result;
                this.parserEtChargerData(jsonSession);
                this.sauvegarderDansLocalStorage();
                localStorage.setItem("menus_repas_filename", file.name);
                resolve();
              } catch (e) {
                console.error(
                  "Erreur lors de l'application des données chargées :",
                  e,
                );
                reject(e);
              }
            });
            reader.onerror = () =>
              reject(new Error("Erreur de lecture du fichier"));
            reader.readAsText(file);
          } else {
            resolve();
          }
        });
        input.click();
      } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
        reject(error);
      }
    });
  }

  async telechargerDataEnJson() {
    let result = false;
    try {
      if (!confirm("Voulez-vous sauvegarder les données ?")) return;
      const data = JSON.stringify(this);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `menus_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      result = true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données JSON :", error);
    }
    return result;
  }
}
