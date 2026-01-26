import { Plat } from "./plat.js";

export class MenusDuJour {
  constructor(date, midi = null, soir = null) {
    this.date = date;
    this.midi = new Plat(
      midi.nom,
      midi.ingredients,
      midi.repas,
      midi.saisons,
      midi.duree_preparation,
      midi.vegetarien,
    );
    this.soir = new Plat(
      soir.nom,
      soir.ingredients,
      soir.repas,
      soir.saisons,
      soir.duree_preparation,
      soir.vegetarien,
    );
  }
}

export class MenusDeLaSemaine {
  constructor(menus = []) {
    this.menus = menus.map(
      (menu) => new MenusDuJour(menu.date, menu.midi, menu.soir),
    );
  }

  ajouterMenu(menu) {
    this.menus.push(menu);
  }

  supprimerMenu(date) {
    this.menus = this.menus.filter((menu) => menu.date !== date);
  }
}
