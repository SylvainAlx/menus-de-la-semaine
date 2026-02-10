import { useFormulaireMenu } from "../hooks/useFormulaireMenu";

export default function FormulaireMenu() {
  const {
    isOpen,
    setIsOpen,
    isEditMode,
    startDate,
    setStartDate,
    selectedSeasons,
    days,
    plats,
    handleChange,
    getDayDate,
    generateRandomMenu,
    handleSubmit,
    toggleSeason,
    resetForm,
  } = useFormulaireMenu();

  return (
    <>
      {!isEditMode && (
        <button
          className={`side-panel-toggle form-toggle-btn menu-toggle ${isOpen ? "open" : ""}`}
          onClick={() => (isOpen ? resetForm() : setIsOpen(true))}
          aria-label="Créer un menu de la semaine"
          title="Créer un menu de la semaine"
        >
          {isOpen ? "×" : "📅"}
        </button>
      )}

      <div
        className={`side-panel form-side-panel custom-scrollbar ${isOpen ? "open" : ""}`}
      >
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{isEditMode ? "Modifier le Menu" : "Nouveau Menu"}</h3>

          <div className="form-group">
            <label htmlFor="startDate">Date de début</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {!isEditMode && (
            <div className="form-section">
              <h4>Filtrer par saison</h4>
              <div className="checkbox-options">
                {[
                  { id: "printemps", label: "Printemps" },
                  { id: "ete", label: "Été" },
                  { id: "automne", label: "Automne" },
                  { id: "hiver", label: "Hiver" },
                ].map((s) => (
                  <label key={s.id}>
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(s.id)}
                      onChange={() => toggleSeason(s.id)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {!isEditMode && (
            <button
              type="button"
              className="btn-secondary"
              onClick={generateRandomMenu}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              🎲 Générer aléatoirement
            </button>
          )}

          <div style={{ marginTop: "1rem" }}>
            {days.map((day) => (
              <div key={day.id} className="form-section">
                <div className="day-header">
                  <h4>Jour {day.id + 1}</h4>
                  <span className="day-date">{getDayDate(day.id)}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Midi</label>
                    <select
                      value={day.midi}
                      onChange={(e) =>
                        handleChange(day.id, "midi", e.target.value)
                      }
                    >
                      <option value="">Choisir...</option>
                      {plats
                        .filter(
                          (p) =>
                            p.repas.midi &&
                            (selectedSeasons.length === 0 ||
                              p.saisons.some((s: string) =>
                                selectedSeasons.includes(s),
                              )),
                        )
                        .map((p) => (
                          <option key={`${day.id}-midi-${p.nom}`} value={p.nom}>
                            {p.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Soir</label>
                    <select
                      value={day.soir}
                      onChange={(e) =>
                        handleChange(day.id, "soir", e.target.value)
                      }
                    >
                      <option value="">Choisir...</option>
                      {plats
                        .filter(
                          (p) =>
                            p.repas.soir &&
                            (selectedSeasons.length === 0 ||
                              p.saisons.some((s: string) =>
                                selectedSeasons.includes(s),
                              )),
                        )
                        .map((p) => (
                          <option key={`${day.id}-soir-${p.nom}`} value={p.nom}>
                            {p.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions" style={{ marginTop: "2rem" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              {isEditMode
                ? "Enregistrer les modifications"
                : "Enregistrer le menu de la semaine"}
            </button>
            {isEditMode && (
              <button
                type="button"
                className="btn-secondary"
                style={{ width: "100%", marginBottom: "2rem" }}
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {isOpen && (
        <div className="side-panel-overlay form-overlay" onClick={resetForm} />
      )}
    </>
  );
}
