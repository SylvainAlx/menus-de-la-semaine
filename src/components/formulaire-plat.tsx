import "../styles/formulaire-plat.css";
import "../styles/formulaire.css";
import { Plat } from "../classes/plat";
import { useFormulairePlat } from "../hooks/useFormulairePlat";

interface FormulairePlatProps {
  plat?: Plat;
  onSave?: () => void;
}

export default function FormulairePlat({ plat, onSave }: FormulairePlatProps) {
  const {
    isOpen,
    setIsOpen,
    isEditMode,
    setIsEditMode,
    nom,
    setNom,
    dureePreparation,
    setDureePreparation,
    vegetarien,
    setVegetarien,
    repasMidi,
    setRepasMidi,
    repasSoir,
    setRepasSoir,
    saisons,
    setSaisons,
    ingredients,
    setIngredients,
    resetForm,
    handleSubmit,
    handleChangeIngredient,
    addIngredient,
    removeIngredient,
  } = useFormulairePlat({ plat, onSave });

  return (
    <>
      {!isEditMode && (
        <button
          className={`form-toggle-btn ${isOpen ? "open" : ""}`}
          onClick={() => (isOpen ? resetForm() : setIsOpen(true))}
          aria-label="Ajouter un plat"
        >
          {isOpen ? "×" : "+"}
        </button>
      )}

      <div className={`form-side-panel ${isOpen ? "open" : ""}`}>
        <form
          id={isEditMode ? "modifier_plat_form" : "ajouter_plat_form"}
          className="form-container"
          onSubmit={handleSubmit}
        >
          <h3>{isEditMode ? "Modifier le Plat" : "Nouveau Plat"}</h3>

          <div className="form-group">
            <label htmlFor="nom">Nom du plat</label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Ex: Lasagnes Végétariennes"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duree_preparation">Durée (min)</label>
              <input
                type="number"
                id="duree_preparation"
                name="duree_preparation"
                min="0"
                value={dureePreparation}
                onChange={(e) => setDureePreparation(e.target.value)}
                required
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="switch">
                <input
                  type="checkbox"
                  id="vegetarien"
                  name="vegetarien"
                  checked={vegetarien}
                  onChange={(e) => setVegetarien(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="label-text">Végétarien ?</span>
            </div>
          </div>

          <div className="form-section">
            <h4>Type de repas</h4>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="repas_midi"
                  checked={repasMidi}
                  onChange={(e) => setRepasMidi(e.target.checked)}
                />{" "}
                Midi
              </label>
              <label>
                <input
                  type="checkbox"
                  name="repas_soir"
                  checked={repasSoir}
                  onChange={(e) => setRepasSoir(e.target.checked)}
                />{" "}
                Soir
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4>Saisons</h4>
            <div className="checkbox-options">
              <label>
                <input
                  type="checkbox"
                  name="saison_printemps"
                  checked={saisons.printemps}
                  onChange={(e) =>
                    setSaisons({ ...saisons, printemps: e.target.checked })
                  }
                />
                Printemps
              </label>
              <label>
                <input
                  type="checkbox"
                  name="saison_ete"
                  checked={saisons.ete}
                  onChange={(e) =>
                    setSaisons({ ...saisons, ete: e.target.checked })
                  }
                />{" "}
                Été
              </label>
              <label>
                <input
                  type="checkbox"
                  name="saison_automne"
                  checked={saisons.automne}
                  onChange={(e) =>
                    setSaisons({ ...saisons, automne: e.target.checked })
                  }
                />{" "}
                Automne
              </label>
              <label>
                <input
                  type="checkbox"
                  name="saison_hiver"
                  checked={saisons.hiver}
                  onChange={(e) =>
                    setSaisons({ ...saisons, hiver: e.target.checked })
                  }
                />{" "}
                Hiver
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4>Ingrédients</h4>
            <div id="ingredients_container">
              {ingredients.map((ing) => (
                <div key={ing.id} className="ingredient-row">
                  <input
                    type="text"
                    placeholder="Ingrédient"
                    name={`ingredient_nom_${ing.id}`}
                    className="ing-input ing-input-nom"
                    value={ing.nom}
                    onChange={(e) =>
                      handleChangeIngredient(ing.id, "nom", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qté"
                    name="qte"
                    className="ing-input ing-input-qte"
                    value={ing.qte}
                    onChange={(e) =>
                      handleChangeIngredient(ing.id, "qte", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unité"
                    name="unite"
                    className="ing-input ing-input-unite"
                    value={ing.unite}
                    onChange={(e) =>
                      handleChangeIngredient(ing.id, "unite", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="remove-ing"
                    onClick={() => removeIngredient(ing.id)}
                    title="Supprimer l'ingrédient"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              id="add_ingredient"
              className="btn-secondary"
              onClick={addIngredient}
            >
              + Ajouter un ingrédient
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditMode ? "Modifier le plat" : "Enregistrer le plat"}
            </button>
            {isEditMode && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditMode(false);
                  setIngredients([{ id: 1, nom: "", qte: "", unite: "" }]);
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {isOpen && (
        <div className="form-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
