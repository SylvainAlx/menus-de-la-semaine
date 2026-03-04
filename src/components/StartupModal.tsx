import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";
import { ClipboardList, CookingPot, FolderOpenDot, Save } from "lucide-react";

export default function StartupModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
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
      <div className={`modal-content ${showTutorial ? "tutorial" : ""}`}>
        {!showTutorial ? (
          <>
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

              <button
                className="btn-choice"
                onClick={() => handleChoice("blank")}
              >
                <span className="icon">📄</span>
                Démarrer sur un document vierge
              </button>

              <button
                className="btn-tutorial-trigger"
                onClick={() => setShowTutorial(true)}
              >
                <span className="icon">💡</span>
                Comment ça marche ?
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Comment ça marche ?</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <div className="step-icon">🥘</div>
                <div className="step-text">
                  <h3>1. Créez vos plats</h3>
                  <p>
                    Remplissez le formulaire de création de plat depuis l'onglet{" "}
                    <CookingPot /> pour constituer votre bibliothèque de
                    recettes.
                  </p>
                </div>
              </div>

              <div className="tutorial-step">
                <div className="step-icon">📅</div>
                <div className="step-text">
                  <h3>2. Composez votre menu</h3>
                  <p>
                    Une fois que vous avez assez de plats, rendez-vous dans
                    l'onglet <ClipboardList /> pour choisir vos repas de la
                    semaine.
                  </p>
                </div>
              </div>

              <div className="tutorial-step">
                <div className="step-icon">💾</div>
                <div className="step-text">
                  <h3>3. Exportez vos données</h3>
                  <p>
                    Utilisez le bouton de sauvegarde <Save /> pour télécharger
                    vos données. Vous pourrez les charger <FolderOpenDot /> sur
                    un autre appareil pour continuer là où vous vous êtes arrêté
                    !
                  </p>
                </div>
              </div>
            </div>

            <button
              className="btn-choice primary"
              onClick={() => setShowTutorial(false)}
            >
              J'ai compris !
            </button>
          </>
        )}
      </div>
    </div>
  );
}
