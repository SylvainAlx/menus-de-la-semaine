import { useState, useEffect } from "react";
import { utilisateur } from "../store";
import { Plat } from "../classes/plat";
import { Ingredient } from "../classes/ingredient";

interface FormulairePlatProps {
  plat?: Plat;
  onSave?: () => void;
}

interface IngredientForm {
  id: number;
  nom: string;
  qte: string;
  unite: string;
}

interface SaisonsState {
  printemps: boolean;
  ete: boolean;
  automne: boolean;
  hiver: boolean;
}

export function useFormulairePlat({ plat, onSave }: FormulairePlatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { id: 1, nom: "", qte: "", unite: "" },
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlat, setCurrentPlat] = useState<Plat | null>(null);
  const [nom, setNom] = useState("");
  const [dureePreparation, setDureePreparation] = useState("30");
  const [vegetarien, setVegetarien] = useState(false);
  const [repasMidi, setRepasMidi] = useState(true);
  const [repasSoir, setRepasSoir] = useState(true);
  const [saisons, setSaisons] = useState<SaisonsState>({
    printemps: true,
    ete: true,
    automne: true,
    hiver: true,
  });

  // Utiliser useEffect pour initialiser avec des IDs uniques après le montage
  useEffect(() => {
    setIngredients((prev) =>
      prev.map((ing, index) => ({
        ...ing,
        id: index + 1,
      })),
    );
  }, []);

  // Charger les données du plat si on est en mode édition
  useEffect(() => {
    if (plat) {
      setIsEditMode(true);
      setIsOpen(true);
      setCurrentPlat(plat);
      setNom(plat.nom);
      setDureePreparation(plat.duree_preparation.toString());
      setVegetarien(plat.vegetarien);
      setRepasMidi(plat.repas.midi);
      setRepasSoir(plat.repas.soir);
      setSaisons({
        printemps: plat.saisons.includes("printemps"),
        ete: plat.saisons.includes("ete"),
        automne: plat.saisons.includes("automne"),
        hiver: plat.saisons.includes("hiver"),
      });
      setIngredients(
        plat.ingredients.map((ing, index) => ({
          id: index + 1,
          nom: ing.nom,
          qte: ing.quantite.toString(),
          unite: ing.unite,
        })),
      );
    }
  }, [plat]);

  // Écouter l'événement personnalisé pour l'édition
  useEffect(() => {
    const handleEditerPlat = (event: CustomEvent) => {
      const { plat: platAEditer } = event.detail;
      setIsEditMode(true);
      setIsOpen(true);
      setCurrentPlat(platAEditer);
      setNom(platAEditer.nom);
      setDureePreparation(platAEditer.duree_preparation.toString());
      setVegetarien(platAEditer.vegetarien);
      setRepasMidi(platAEditer.repas.midi);
      setRepasSoir(platAEditer.repas.soir);
      setSaisons({
        printemps: platAEditer.saisons.includes("printemps"),
        ete: platAEditer.saisons.includes("ete"),
        automne: platAEditer.saisons.includes("automne"),
        hiver: platAEditer.saisons.includes("hiver"),
      });
      setIngredients(
        platAEditer.ingredients.map((ing: any, index: number) => ({
          id: index + 1,
          nom: ing.nom,
          qte: ing.quantite.toString(),
          unite: ing.unite,
        })),
      );
    };

    document.addEventListener("editerPlat", handleEditerPlat as EventListener);
    return () => {
      document.removeEventListener(
        "editerPlat",
        handleEditerPlat as EventListener,
      );
    };
  }, []);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: ingredients.length + 1, nom: "", qte: "", unite: "" },
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

  const handleChangeSaison = (saison: keyof SaisonsState) => {
    setSaisons((prev) => ({
      ...prev,
      [saison]: !prev[saison],
    }));
  };

  const resetForm = () => {
    setIngredients([{ id: 1, nom: "", qte: "", unite: "" }]);
    setIsEditMode(false);
    setIsOpen(false);
    setCurrentPlat(null);
    setNom("");
    setDureePreparation("30");
    setVegetarien(false);
    setRepasMidi(true);
    setRepasSoir(true);
    setSaisons({
      printemps: true,
      ete: true,
      automne: true,
      hiver: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const saisonsArray = Object.entries(saisons)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    const nouveauPlat = new Plat(
      nom,
      ingredients.map(
        (ing) => new Ingredient(ing.nom, Number(ing.qte), ing.unite),
      ),
      { midi: repasMidi, soir: repasSoir },
      saisonsArray,
      Number(dureePreparation),
      vegetarien,
    );

    if (isEditMode && currentPlat) {
      // Mode édition : remplacer le plat existant
      const user = utilisateur.get();
      user.modifierPlat(currentPlat, nouveauPlat);
    } else {
      // Mode ajout : ajouter un nouveau plat
      utilisateur.get().ajouterPlat(nouveauPlat);
    }

    // Réinitialiser le formulaire
    resetForm();

    // Appeler le callback si fourni
    if (onSave) {
      onSave();
    }
  };

  return {
    // États
    isOpen,
    isEditMode,
    ingredients,
    nom,
    dureePreparation,
    vegetarien,
    repasMidi,
    repasSoir,
    saisons,
    currentPlat,

    // Setters
    setIsOpen,
    setIsEditMode,
    setIngredients,
    setNom,
    setDureePreparation,
    setVegetarien,
    setRepasMidi,
    setRepasSoir,
    setSaisons,

    // Méthodes
    addIngredient,
    removeIngredient,
    handleChangeIngredient,
    handleChangeSaison,
    resetForm,
    handleSubmit,
  };
}
