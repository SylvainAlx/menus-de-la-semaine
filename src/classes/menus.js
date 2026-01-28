import { Plat } from "./plat.js";

export class MenusDuJour {
  constructor(date, midi = null, soir = null) {
    this.date = date;
    this.midi = midi
      ? new Plat(
          midi.nom,
          midi.ingredients,
          midi.repas,
          midi.saisons,
          midi.duree_preparation,
          midi.vegetarien,
        )
      : null;
    this.soir = soir
      ? new Plat(
          soir.nom,
          soir.ingredients,
          soir.repas,
          soir.saisons,
          soir.duree_preparation,
          soir.vegetarien,
        )
      : null;
  }
}

export class MenusDeLaSemaine {
  constructor(menus = []) {
    this.menus = menus.map(
      (menu) => new MenusDuJour(menu.date, menu.midi, menu.soir),
    );
    this.date = this.menus.length > 0 ? this.menus[0].date : "Date inconnue";
  }
}
