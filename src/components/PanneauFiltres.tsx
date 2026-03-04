import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";
import { Search, Save, X } from "lucide-react";

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
      recherche: "",
      saison: "toutes",
      vegetarien: false,
      moment: "tous",
      dureeMax: Infinity,
      ingredients: [],
    });
  };

  const handleExport = async () => {
    const success = await user.telechargerDataEnJson();
    if (success) {
      setIsOpen(false);
    }
  };

  const activeFiltersCount = [
    filtres.recherche && filtres.recherche.trim() !== "",
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
        {isOpen ? "×" : <Search />}
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
            <label htmlFor="panneau-recherche">Rechercher</label>
            <div className="search-input-wrapper">
              <input
                id="panneau-recherche"
                type="text"
                placeholder="Ex: Pâtes..."
                value={filtres.recherche}
                onChange={(e) => updateFilters({ recherche: e.target.value })}
                className="search-input"
              />
              {filtres.recherche && (
                <button
                  className="btn-clear-search"
                  onClick={() => updateFilters({ recherche: "" })}
                  aria-label="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
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

          <div className="panel-actions">
            <button
              className="btn-primary apply-btn"
              onClick={() => setIsOpen(false)}
            >
              Voir les résultats
            </button>
            <button
              className="btn-secondary export-btn"
              onClick={handleExport}
              title="Sauvegarder les données pour les utiliser sur un autre appareil"
            >
              <Save size={18} /> Sauvegarder (Export)
            </button>
          </div>
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
