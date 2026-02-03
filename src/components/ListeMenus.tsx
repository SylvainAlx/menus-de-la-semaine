import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { utilisateur } from "../store";
import MenuCard from "./MenuCard";

export default function ListeMenus() {
  const user = useStore(utilisateur);
  const [menus, setMenus] = useState(user.menus);

  useEffect(() => {
    setMenus([...user.menus]);
  }, [user, user.menus]);

  const handleDelete = (date: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le menu "${date}" ?`)) {
      user.supprimerMenu(date);
      utilisateur.set(user.clone());
    }
  };

  const handleEdit = (menu: any) => {
    const event = new CustomEvent("editerMenu", { detail: { menu } });
    document.dispatchEvent(event);
  };

  const handleDownload = (menu: any) => {
    user.telechargerMenuTexte(menu);
  };

  if (menus.length === 0) {
    return (
      <div id="menus">
        <p>Aucun menu enregistré.</p>
      </div>
    );
  }

  return (
    <div id="menus">
      {menus.map((menu: any) => (
        <MenuCard
          key={menu.date}
          menu={menu}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDownload={handleDownload}
          shoppingList={user.calculerIngredientsMenu(menu)}
        />
      ))}
    </div>
  );
}
