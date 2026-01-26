import React, { useState } from "react";
import "../styles/formulaire-plat.css";
import "../styles/formulaire.css";
import { utilisateur } from "../store";
import { Plat } from "../classes/plat";
import { Ingredient } from "../classes/ingredient";

export default function FormulairePlat() {
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState([
    { id: Date.now(), nom: "", qte: "", unite: "" },
  ]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now() + Math.random(), nom: "", qte: "", unite: "" },
    ]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const handleChangeIngredient = (id: number, field: string, value: string) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const saisons = ["printemps", "ete", "automne", "hiver"].filter(
      (s) => data[`saison_${s}`] === "on",
    );

    utilisateur.get().AjouterPlat(
      new Plat(
        data.nom as string,
        ingredients.map(
          (ing) => new Ingredient(ing.nom, Number(ing.qte), ing.unite),
        ),
        { midi: data.repas_midi === "on", soir: data.repas_soir === "on" },
        saisons,
        Number(data.duree_preparation),
        data.vegetarien === "on",
      ),
    );
    // Optionally close after submit
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`form-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ajouter un plat"
      >
        {isOpen ? "×" : "+"}
      </button>

      <div className={`form-side-panel ${isOpen ? "open" : ""}`}>
        <form
          id="ajouter_plat_form"
          className="form-container"
          onSubmit={handleSubmit}
        >
          <h3>Nouveau Plat</h3>

          <div className="form-group">
            <label htmlFor="nom">Nom du plat</label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Ex: Lasagnes Végétariennes"
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
                defaultValue="30"
                required
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="switch">
                <input type="checkbox" id="vegetarien" name="vegetarien" />
                <span className="slider round"></span>
              </label>
              <span className="label-text">Végétarien ?</span>
            </div>
          </div>

          <div className="form-section">
            <h4>Type de repas</h4>
            <div className="checkbox-options">
              <label>
                <input type="checkbox" name="repas_midi" defaultChecked /> Midi
              </label>
              <label>
                <input type="checkbox" name="repas_soir" defaultChecked /> Soir
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4>Saisons</h4>
            <div className="checkbox-options">
              <label>
                <input type="checkbox" name="saison_printemps" defaultChecked />
                Printemps
              </label>
              <label>
                <input type="checkbox" name="saison_ete" defaultChecked /> Été
              </label>
              <label>
                <input type="checkbox" name="saison_automne" defaultChecked />{" "}
                Automne
              </label>
              <label>
                <input type="checkbox" name="saison_hiver" defaultChecked />{" "}
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
                    name="nom"
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

          <button type="submit" className="btn-primary">
            Enregistrer le plat
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="form-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
