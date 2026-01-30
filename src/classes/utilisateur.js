import { Plat } from "./plat.js";
import { Ingredient } from "./ingredient.js";
import { MenusDeLaSemaine } from "./menus.js";

export class Utilisateur {
  constructor() {
    this.plats = [];
    this.menus = [];
    this.filtres = { saison: "toutes", vegetarien: false };
    if (typeof window !== "undefined") {
      this.chargerDepuisLocalStorage();
    }
  }
  reset() {
    this.plats = [];
    this.menus = [];
    this.filtres = { saison: "toutes", vegetarien: false };
    this.sauvegarderDansLocalStorage();
    this.afficherPlats();
    this.afficherMenus();
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
        ),
    );
    this.menus = (session.menus || []).map(
      (menusDeLaSemaine) => new MenusDeLaSemaine(menusDeLaSemaine.menus),
    );
    this.afficherPlats();
    this.afficherMenus();
  }

  afficherPlats() {
    const platsContainer = document.getElementById("liste_plats");
    if (!platsContainer) return;
    platsContainer.innerHTML = "";

    if (!this.plats || this.plats.length === 0) {
      platsContainer.innerHTML =
        "<p>Aucun plat enregistré. Commencez par en ajouter un !</p>";
      return;
    }

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

    if (platsAAfficher.length === 0) {
      platsContainer.innerHTML =
        "<p>Aucun plat ne correspond à vos filtres.</p>";
      return;
    }

    platsAAfficher.map((plat) =>
      platsContainer.appendChild(this.creerCartePlat(plat)),
    );
  }

  appliquerFiltres(nouveauxFiltres) {
    this.filtres = { ...this.filtres, ...nouveauxFiltres };
    this.afficherPlats();
  }

  creerCartePlat(plat) {
    const tile = document.createElement("div");
    tile.classList.add("plat-card");
    tile.innerHTML = `
      <div class="plat-header">
        <h3 class="plat-nom">${plat.nom}</h3>
        <div class="plat-header-right">
          ${plat.vegetarien ? '<span class="plat-badge">Veggie</span>' : ""}
          <button class="btn-editer" title="Éditer le plat">✏️</button>
          <button class="btn-supprimer" title="Supprimer le plat">🗑️</button>
          <button class="btn-toggle" title="Voir les détails">▼</button>
        </div>
      </div>
      <div class="plat-details hidden">
        <div class="plat-info">
          <span>⏱️ ${plat.duree_preparation} min</span>
        </div>
        <div class="plat-info">
          <span>🍴 ${plat.repas.midi ? "Midi" : ""} ${plat.repas.midi && plat.repas.soir ? "&" : ""} ${plat.repas.soir ? "Soir" : ""}</span>
        </div>
        <div class="plat-info">
          <span> 🌾 ${plat.saisons.join(", ")}</span>
        </div>
        <ul class="ingredients-list">
          ${plat.ingredients
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

    const btnSupprimer = tile.querySelector(".btn-supprimer");
    btnSupprimer.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Voulez-vous vraiment supprimer le plat "${plat.nom}" ?`)) {
        this.supprimerPlat(plat);
      }
    });

    const btnToggle = tile.querySelector(".btn-toggle");
    const details = tile.querySelector(".plat-details");
    btnToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = details.classList.contains("hidden");
      if (isHidden) {
        details.classList.remove("hidden");
        btnToggle.textContent = "▲";
        btnToggle.classList.add("active");
      } else {
        details.classList.add("hidden");
        btnToggle.textContent = "▼";
        btnToggle.classList.remove("active");
      }
    });

    const btnEditer = tile.querySelector(".btn-editer");
    btnEditer.addEventListener("click", (e) => {
      e.stopPropagation();
      // Déclencher l'édition du plat via un événement personnalisé
      const event = new CustomEvent("editerPlat", { detail: { plat } });
      document.dispatchEvent(event);
    });

    return tile;
  }

  creerCarteMenu(menu) {
    const tile = document.createElement("div");
    tile.classList.add("menu-card");

    const shoppingList = this.calculerIngredientsMenu(menu);

    tile.innerHTML = `
      <div class="menu-header">
        <h3 class="menu-title">Semaine du ${menu.date}</h3>
        <div class="menu-actions">
           <button class="btn-courses" title="Liste de courses">🛒</button>
           <button class="btn-download" title="Télécharger le menu">📥</button>
           <button class="btn-editer" title="Éditer le menu">✏️</button>
           <button class="btn-supprimer" title="Supprimer le menu">🗑️</button>
           <button class="btn-toggle" title="Voir le menu">▼</button>
        </div>
      </div>
      <div class="menu-content hidden">
        <div class="menu-days">
          ${menu.menus
            .map(
              (jour) => `
            <div class="menu-day">
              <span class="day-name">${jour.date}</span>
              <div class="day-meals">
                <div class="meal">
                  <span class="meal-label">Midi :</span>
                  <span class="meal-name">${jour.midi ? jour.midi.nom : "Pas de plat"}</span>
                </div>
                <div class="meal">
                  <span class="meal-label">Soir :</span>
                  <span class="meal-name">${jour.soir ? jour.soir.nom : "Pas de plat"}</span>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="shopping-list-container hidden">
          <h4>🛒 Liste de courses</h4>
          <ul class="shopping-list">
            ${
              Object.values(shoppingList).length > 0
                ? Object.values(shoppingList)
                    .map(
                      (ing) => `
              <li>
                <span>${ing.nom}</span>
                <span class="qte-badge">${ing.quantite} ${ing.unite}</span>
              </li>
            `,
                    )
                    .join("")
                : `<li class="empty-list">Aucun ingrédient nécessaire ou menus vides.</li>`
            }
          </ul>
        </div>
      </div>
    `;

    const btnSupprimer = tile.querySelector(".btn-supprimer");
    btnSupprimer.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Voulez-vous vraiment supprimer le menu "${menu.date}" ?`)) {
        this.supprimerMenu(menu.date);
      }
    });

    const btnCourses = tile.querySelector(".btn-courses");
    const btnToggle = tile.querySelector(".btn-toggle");
    const content = tile.querySelector(".menu-content");
    const listContainer = tile.querySelector(".shopping-list-container");
    const daysContainer = tile.querySelector(".menu-days");

    const toggleExpand = (forceOpen = null) => {
      const isHidden = content.classList.contains("hidden");
      const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

      if (shouldOpen) {
        content.classList.remove("hidden");
        btnToggle.textContent = "▲";
        btnToggle.classList.add("active");
      } else {
        content.classList.add("hidden");
        btnToggle.textContent = "▼";
        btnToggle.classList.remove("active");
      }
    };

    btnToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleExpand();
    });

    btnCourses.addEventListener("click", (e) => {
      e.stopPropagation();
      const isListHidden = listContainer.classList.contains("hidden");

      if (isListHidden) {
        listContainer.classList.remove("hidden");
        daysContainer.classList.add("hidden");
        btnCourses.classList.add("active");
        toggleExpand(true); // Always expand when showing courses
      } else {
        listContainer.classList.add("hidden");
        daysContainer.classList.remove("hidden");
        btnCourses.classList.remove("active");
      }
    });

    const btnDownload = tile.querySelector(".btn-download");
    btnDownload.addEventListener("click", (e) => {
      e.stopPropagation();
      this.telechargerMenuTexte(menu);
    });

    const btnEditer = tile.querySelector(".btn-editer");
    btnEditer.addEventListener("click", (e) => {
      e.stopPropagation();
      const event = new CustomEvent("editerMenu", { detail: { menu } });
      document.dispatchEvent(event);
    });

    return tile;
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
    const ingredients = Object.values(shoppingList);

    if (ingredients.length > 0) {
      ingredients.forEach((ing) => {
        text += `- ${ing.nom} : ${ing.quantite} ${ing.unite}\n`;
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

  afficherMenus() {
    const menus = document.getElementById("menus");
    if (!menus) return;
    menus.innerHTML = "";
    if (!this.menus || this.menus.length === 0) {
      menus.innerHTML = "<p>Aucun menu enregistré.</p>";
      return;
    }
    this.menus.map((menu) => menus.appendChild(this.creerCarteMenu(menu)));
  }

  ajouterMenu(menu) {
    this.menus.push(menu);
    this.afficherMenus();
    this.sauvegarderDansLocalStorage();
  }

  supprimerMenu(date) {
    this.menus = this.menus.filter((menu) => menu.date !== date);
    this.afficherMenus();
    this.sauvegarderDansLocalStorage();
  }

  modifierMenu(ancienMenu, nouveauMenu) {
    const index = this.menus.findIndex((m) => m === ancienMenu);
    if (index !== -1) {
      this.menus[index] = nouveauMenu;
      this.afficherMenus();
      this.sauvegarderDansLocalStorage();
    }
  }

  ajouterPlat(plat) {
    this.plats.push(plat);
    this.afficherPlats();
    this.sauvegarderDansLocalStorage();
  }

  supprimerPlat(plat) {
    this.plats = this.plats.filter((p) => p.nom !== plat.nom);
    this.afficherPlats();
    this.sauvegarderDansLocalStorage();
  }

  modifierPlat(ancienPlat, nouveauPlat) {
    const index = this.plats.findIndex((p) => p === ancienPlat);
    if (index !== -1) {
      this.plats[index] = nouveauPlat;
      this.afficherPlats();
      this.sauvegarderDansLocalStorage();
    }
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
            this.parserEtChargerData(jsonSession);
            this.sauvegarderDansLocalStorage();
            localStorage.setItem("menus_repas_filename", file.name);
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
      a.download = `menus_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données JSON :", error);
    }
  }
}
