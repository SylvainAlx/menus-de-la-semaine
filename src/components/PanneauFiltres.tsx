import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";

export default function PanneauFiltres() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore(utilisateur);
  const { filtres } = user;

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("side-panel-open");
    } else {
      document.body.classList.remove("side-panel-open");
    }
    return () => document.body.classList.remove("side-panel-open");
  }, [isOpen]);

  const tousLesIngredients = user.getTousLesIngredients();
  const selectedIngredients: string[] = filtres.ingredients || [];

  const updateFilters = (newFiltres: any) => {
    user.appliquerFiltres(newFiltres);
    utilisateur.set(user.clone());
  };

  const handleIngredientChange = (ing: string, checked: boolean) => {
    let newIngredients = [...selectedIngredients];
    if (checked) {
      newIngredients.push(ing);
    } else {
      newIngredients = newIngredients.filter((i) => i !== ing);
    }
    updateFilters({ ingredients: newIngredients });
  };

  const resetAll = () => {
    updateFilters({
      saison: "toutes",
      vegetarien: false,
      moment: "tous",
      dureeMax: Infinity,
      ingredients: [],
    });
  };

  const activeFiltersCount = [
    filtres.saison !== "toutes",
    filtres.vegetarien,
    filtres.moment !== "tous",
    filtres.dureeMax !== Infinity,
    selectedIngredients.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      <button
        className={`side-panel-toggle filter-toggle-btn ${isOpen ? "open" : ""} ${activeFiltersCount > 0 ? "has-filters" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filtrer les plats"
        title="Filtrer les plats"
      >
        {isOpen ? "×" : "🔍"}
        {!isOpen && activeFiltersCount > 0 && (
          <span className="filter-badge">{activeFiltersCount}</span>
        )}
      </button>

      <div
        className={`side-panel form-side-panel custom-scrollbar ${isOpen ? "open" : ""}`}
      >
        <div className="form-container">
          <div className="panel-header">
            <h3>Filtres</h3>
            <button className="btn-reset-all" onClick={resetAll}>
              Tout réinitialiser
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="panneau-saison">Saison</label>
            <select
              id="panneau-saison"
              value={filtres.saison}
              onChange={(e) => updateFilters({ saison: e.target.value })}
            >
              <option value="toutes">Toutes saisons</option>
              <option value="printemps">Printemps</option>
              <option value="ete">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="panneau-moment">Moment du repas</label>
            <select
              id="panneau-moment"
              value={filtres.moment}
              onChange={(e) => updateFilters({ moment: e.target.value })}
            >
              <option value="tous">Midi & Soir</option>
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Prêt en {filtres.dureeMax === Infinity ? "60+" : filtres.dureeMax}{" "}
              min
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={filtres.dureeMax === Infinity ? 60 : filtres.dureeMax}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateFilters({ dureeMax: val >= 60 ? Infinity : val });
              }}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="switch">
              <input
                type="checkbox"
                checked={filtres.vegetarien}
                onChange={(e) =>
                  updateFilters({ vegetarien: e.target.checked })
                }
              />
              <span className="slider round"></span>
            </label>
            <span className="label-text">Végétarien uniquement</span>
          </div>

          <div className="form-section">
            <div className="panel-header">
              <h4>Ingrédients</h4>
              {selectedIngredients.length > 0 && (
                <button
                  className="btn-reset-ingredients"
                  onClick={() => updateFilters({ ingredients: [] })}
                >
                  Décocher ({selectedIngredients.length})
                </button>
              )}
            </div>
            <div className="ingredients-grid custom-scrollbar">
              {tousLesIngredients.map((ing) => (
                <label key={ing} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ing)}
                    onChange={(e) =>
                      handleIngredientChange(ing, e.target.checked)
                    }
                  />
                  <span className="checkmark"></span>
                  {ing}
                </label>
              ))}
            </div>
          </div>

          <button
            className="btn-primary apply-btn"
            onClick={() => setIsOpen(false)}
          >
            Voir les résultats
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="side-panel-overlay form-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
