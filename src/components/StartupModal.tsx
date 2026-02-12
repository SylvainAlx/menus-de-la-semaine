import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";

export default function StartupModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const user = useStore(utilisateur);

  useEffect(() => {
    // Toujours afficher au démarrage de l'app
    setIsVisible(true);

    // Vérifier si des données existent dans le stockage local
    const data = localStorage.getItem("menus_repas_data");
    const hasData =
      data && JSON.parse(data).plats && JSON.parse(data).plats.length > 0;

    if (hasData) {
      setHasLocalStorage(true);
    }
  }, []);

  const handleChoice = async (choice: "blank" | "localStorage" | "json") => {
    if (choice === "localStorage") {
      user.chargerDepuisLocalStorage();
      utilisateur.set(user.clone());
    } else if (choice === "json") {
      await user.chargerDataDepuisJson();
      utilisateur.set(user.clone());
    }

    // Si 'blank', on ne fait rien (reste tel quel)

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bienvenue !</h2>
        <p>
          Souhaitez-vous charger vos données existantes ou commencer sur un
          document vierge ?
        </p>

        <div className="modal-actions">
          {hasLocalStorage && (
            <button
              className="btn-choice primary"
              onClick={() => handleChoice("localStorage")}
            >
              <span className="icon">💾</span>
              Reprendre
            </button>
          )}

          <button
            className="btn-choice secondary"
            onClick={() => handleChoice("json")}
          >
            <span className="icon">📂</span>
            Charger depuis une sauvegarde
          </button>

          <button className="btn-choice" onClick={() => handleChoice("blank")}>
            <span className="icon">📄</span>
            Démarrer sur un document vierge
          </button>
        </div>
      </div>
    </div>
  );
}
