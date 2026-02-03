import React, { useState } from "react";
import type { Plat } from "../classes/plat";

interface PlatCardProps {
  plat: Plat;
  onDelete: (plat: Plat) => void;
  onEdit: (plat: Plat) => void;
}

const PlatCard: React.FC<PlatCardProps> = ({ plat, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="plat-card">
      <div className="plat-header">
        <h3 className="plat-nom">{plat.nom}</h3>
        <div className="plat-header-right">
          {plat.vegetarien && <span className="plat-badge">Veggie</span>}
          <button
            className="btn-editer"
            onClick={() => onEdit(plat)}
            title="Éditer le plat"
          >
            ✏️
          </button>
          <button
            className="btn-supprimer"
            onClick={() => onDelete(plat)}
            title="Supprimer le plat"
          >
            🗑️
          </button>
          <button
            className={`btn-toggle ${isExpanded ? "active" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title="Voir les détails"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="plat-details">
          <div className="plat-info">
            <span>⏱️ {plat.duree_preparation} min</span>
          </div>
          <div className="plat-info">
            <span>
              🍴 {plat.repas.midi ? "Midi" : ""}{" "}
              {plat.repas.midi && plat.repas.soir ? "&" : ""}{" "}
              {plat.repas.soir ? "Soir" : ""}
            </span>
          </div>
          <div className="plat-info">
            <span> 🌾 {plat.saisons.join(", ")}</span>
          </div>
          <ul className="ingredients-list">
            {plat.ingredients.map((ing, idx) => (
              <li key={idx}>
                <span>{ing.nom}</span>
                <span>
                  {ing.quantite}{" "}
                  {ing.quantite > 1 ? ing.unite + "(s)" : ing.unite}
                </span>
              </li>
            ))}
          </ul>
          {plat.recette && (
            <div className="plat-recette">
              <h4>Recette :</h4>
              <p>{plat.recette}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatCard;
