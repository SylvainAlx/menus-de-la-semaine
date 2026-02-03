import React, { useState } from "react";

interface MenuCardProps {
  menu: any; // Type according to your MenusDeLaSemaine
  onDelete: (date: string) => void;
  onEdit: (menu: any) => void;
  onDownload: (menu: any) => void;
  shoppingList: any;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onDelete,
  onEdit,
  onDownload,
  shoppingList,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleExpand = (forceOpen?: boolean) => {
    setIsExpanded(forceOpen !== undefined ? forceOpen : !isExpanded);
  };

  const toggleShoppingList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showShoppingList) {
      setShowShoppingList(true);
      toggleExpand(true);
    } else {
      setShowShoppingList(false);
    }
  };

  return (
    <div className="menu-card">
      <div className="menu-header">
        <h3 className="menu-title">Semaine du {menu.date}</h3>
        <div className="menu-actions">
          <button
            className={`btn-courses ${showShoppingList ? "active" : ""}`}
            onClick={toggleShoppingList}
            title="Liste de courses"
          >
            🛒
          </button>
          <button
            className="btn-download"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(menu);
            }}
            title="Télécharger le menu"
          >
            📥
          </button>
          <button
            className="btn-editer"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(menu);
            }}
            title="Éditer le menu"
          >
            ✏️
          </button>
          <button
            className="btn-supprimer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(menu.date);
            }}
            title="Supprimer le menu"
          >
            🗑️
          </button>
          <button
            className={`btn-toggle ${isExpanded ? "active" : ""}`}
            onClick={() => toggleExpand()}
            title="Voir le menu"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="menu-content">
          {!showShoppingList ? (
            <div className="menu-days">
              {menu.menus.map((jour: any, idx: number) => (
                <div key={idx} className="menu-day">
                  <span className="day-name">{jour.date}</span>
                  <div className="day-meals">
                    <div className="meal">
                      <span className="meal-label">Midi :</span>
                      <span className="meal-name">
                        {jour.midi ? jour.midi.nom : "Pas de plat"}
                      </span>
                    </div>
                    <div className="meal">
                      <span className="meal-label">Soir :</span>
                      <span className="meal-name">
                        {jour.soir ? jour.soir.nom : "Pas de plat"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="shopping-list-container">
              <h4>🛒 Liste de courses</h4>
              <ul className="shopping-list">
                {Object.values(shoppingList).length > 0 ? (
                  Object.values(shoppingList)
                    .sort((a: any, b: any) => a.nom.localeCompare(b.nom))
                    .map((ing: any, idx: number) => (
                      <li key={idx}>
                        <span>{ing.nom}</span>
                        <span className="qte-badge">
                          {ing.quantite}{" "}
                          {ing.quantite > 1 ? ing.unite + "(s)" : ing.unite}
                        </span>
                      </li>
                    ))
                ) : (
                  <li className="empty-list">
                    Aucun ingrédient nécessaire ou menus vides.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCard;
