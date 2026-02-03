import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";
import PlatCard from "./PlatCard";

export default function ListePlats() {
  const user = useStore(utilisateur);
  const [plats, setPlats] = useState(user.getPlatsFiltres());

  // Puisque 'utilisateur' est un objet dont on mute les propriétés,
  // nanostores ne détecte pas les changements internes.
  // On force la mise à jour en écoutant les changements si possible,
  // ou en utilisant un effet.
  useEffect(() => {
    setPlats(user.getPlatsFiltres());
  }, [user, user.plats, user.filtres]);

  const handleDelete = (plat: any) => {
    if (confirm(`Voulez-vous vraiment supprimer le plat "${plat.nom}" ?`)) {
      user.supprimerPlat(plat);
      utilisateur.set(user.clone()); // Déclencher la réactualisation
    }
  };

  const handleEdit = (plat: any) => {
    const event = new CustomEvent("editerPlat", { detail: { plat } });
    document.dispatchEvent(event);
  };

  if (plats.length === 0) {
    return (
      <div id="liste_plats">
        <p>
          {user.plats.length === 0
            ? "Aucun plat enregistré. Commencez par en ajouter un !"
            : "Aucun plat ne correspond à vos filtres."}
        </p>
      </div>
    );
  }

  return (
    <>
      <h3>{plats.length} plats</h3>
      <div id="liste_plats">
        {plats.map((plat) => (
          <PlatCard
            key={plat.nom}
            plat={plat}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </>
  );
}
