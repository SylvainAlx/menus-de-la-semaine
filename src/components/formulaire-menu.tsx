import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import "../styles/formulaire-menu.css";
import "../styles/formulaire.css";
import { utilisateur } from "../store";
import { MenusDeLaSemaine, MenusDuJour } from "../classes/menus";
import { Plat } from "../classes/plat";

export default function FormulaireMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const $utilisateur = useStore(utilisateur);
  const plats = $utilisateur.plats;

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedSeasons, setSelectedSeasons] = useState([
    "printemps",
    "ete",
    "automne",
    "hiver",
  ]);

  const toggleSeason = (season: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season],
    );
  };

  // Local state for the 7 days
  const [days, setDays] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      midi: "",
      soir: "",
    })),
  );

  const handleChange = (dayId: number, field: string, value: string) => {
    setDays(days.map((d) => (d.id === dayId ? { ...d, [field]: value } : d)));
  };

  const getDayDate = (index: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const generateRandomMenu = () => {
    const midiPlats = plats.filter(
      (p) =>
        p.repas.midi &&
        p.saisons.some((s: string) => selectedSeasons.includes(s)),
    );
    const soirPlats = plats.filter(
      (p) =>
        p.repas.soir &&
        p.saisons.some((s: string) => selectedSeasons.includes(s)),
    );

    if (midiPlats.length === 0 || soirPlats.length === 0) {
      alert(
        "Pas assez de plats correspondants aux saisons sélectionnées pour générer le menu.",
      );
      return;
    }

    const newDays = days.map((day) => {
      const randomMidi =
        midiPlats[Math.floor(Math.random() * midiPlats.length)];
      const randomSoir =
        soirPlats[Math.floor(Math.random() * soirPlats.length)];
      return {
        ...day,
        midi: randomMidi.nom,
        soir: randomSoir.nom,
      };
    });

    setDays(newDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all slots are filled
    const missingItems = days.some((d) => !d.midi || !d.soir);
    if (missingItems) {
      alert("Veuillez sélectionner un plat pour tous les repas de la semaine.");
      return;
    }

    // Find the plat objects based on selected names
    const menuDuJourList = days.map((day, index) => {
      const midiPlat = plats.find((p) => p.nom === day.midi);
      const soirPlat = plats.find((p) => p.nom === day.soir);

      const date = new Date(startDate);
      date.setDate(date.getDate() + index);

      return new MenusDuJour(
        date.toLocaleDateString("fr-FR"),
        midiPlat as any,
        soirPlat as any,
      );
    });

    const nouveauMenuSemaine = new MenusDeLaSemaine(menuDuJourList as any);
    console.log(nouveauMenuSemaine);
    utilisateur.get().ajouterMenu(nouveauMenuSemaine);

    // Reset state & close
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`form-toggle-btn menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Créer un menu de la semaine"
        title="Créer un menu de la semaine"
      >
        {isOpen ? "×" : "📅"}
      </button>

      <div className={`form-side-panel ${isOpen ? "open" : ""}`}>
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Nouveau Menu</h3>

          <div className="form-group">
            <label htmlFor="startDate">Date de début</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <h4>Filtrer par saison</h4>
            <div className="checkbox-options">
              {[
                { id: "printemps", label: "Printemps" },
                { id: "ete", label: "Été" },
                { id: "automne", label: "Automne" },
                { id: "hiver", label: "Hiver" },
              ].map((s) => (
                <label key={s.id}>
                  <input
                    type="checkbox"
                    checked={selectedSeasons.includes(s.id)}
                    onChange={() => toggleSeason(s.id)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={generateRandomMenu}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            🎲 Générer aléatoirement
          </button>

          <div style={{ marginTop: "1rem" }}>
            {days.map((day) => (
              <div key={day.id} className="form-section">
                <div className="day-header">
                  <h4>Jour {day.id + 1}</h4>
                  <span className="day-date">{getDayDate(day.id)}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Midi</label>
                    <select
                      value={day.midi}
                      onChange={(e) =>
                        handleChange(day.id, "midi", e.target.value)
                      }
                      required
                    >
                      <option value="">Choisir...</option>
                      {plats
                        .filter(
                          (p) =>
                            p.repas.midi &&
                            p.saisons.some((s: string) =>
                              selectedSeasons.includes(s),
                            ),
                        )
                        .map((p) => (
                          <option key={`${day.id}-midi-${p.nom}`} value={p.nom}>
                            {p.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Soir</label>
                    <select
                      value={day.soir}
                      onChange={(e) =>
                        handleChange(day.id, "soir", e.target.value)
                      }
                      required
                    >
                      <option value="">Choisir...</option>
                      {plats
                        .filter(
                          (p) =>
                            p.repas.soir &&
                            p.saisons.some((s: string) =>
                              selectedSeasons.includes(s),
                            ),
                        )
                        .map((p) => (
                          <option key={`${day.id}-soir-${p.nom}`} value={p.nom}>
                            {p.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginBottom: "2rem", marginTop: "2rem" }}
          >
            Enregistrer le menu de la semaine
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="form-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
