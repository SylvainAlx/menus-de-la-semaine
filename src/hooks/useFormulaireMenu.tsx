import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { utilisateur } from "../store";
import { MenusDeLaSemaine, MenusDuJour } from "../classes/menus";

export function useFormulaireMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenusDeLaSemaine | null>(null);
  const $utilisateur = useStore(utilisateur);
  const plats = $utilisateur.plats;

  const [startDate, setStartDate] = useState("");

  // Utiliser useEffect pour éviter l'hydration mismatch
  useEffect(() => {
    const today = new Date();
    setStartDate(today.toISOString().split("T")[0]);
  }, []);

  const [selectedSeasons, setSelectedSeasons] = useState([
    "printemps",
    "ete",
    "automne",
    "hiver",
  ]);

  const toggleSeason = (season: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season],
    );
  };

  // Local state for the 7 days
  const [days, setDays] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      midi: "",
      soir: "",
    })),
  );

  // Écouter l'événement personnalisé pour l'édition
  useEffect(() => {
    const handleEditerMenu = (event: CustomEvent) => {
      const { menu } = event.detail as { menu: MenusDeLaSemaine };
      setIsEditMode(true);
      setIsOpen(true);
      setCurrentMenu(menu);

      // Convertir la date DD/MM/YYYY en YYYY-MM-DD pour l'input date
      if (menu.menus && menu.menus.length > 0) {
        const dateParts = menu.menus[0].date.split("/");
        if (dateParts.length === 3) {
          const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          setStartDate(formattedDate);
        }

        // Remplir les jours
        const newDays = menu.menus.map((day, index) => ({
          id: index,
          midi: day.midi ? day.midi.nom : "",
          soir: day.soir ? day.soir.nom : "",
        }));
        setDays(newDays);
      }
    };

    document.addEventListener("editerMenu", handleEditerMenu as EventListener);
    return () => {
      document.removeEventListener(
        "editerMenu",
        handleEditerMenu as EventListener,
      );
    };
  }, []);

  const handleChange = (dayId: number, field: string, value: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, [field]: value } : d)),
    );
  };

  const getDayDate = (index: number) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const generateRandomMenu = () => {
    const midiPlats = plats.filter(
      (p) =>
        p.repas.midi &&
        p.saisons.some((s: string) => selectedSeasons.includes(s)),
    );
    const soirPlats = plats.filter(
      (p) =>
        p.repas.soir &&
        p.saisons.some((s: string) => selectedSeasons.includes(s)),
    );

    if (midiPlats.length === 0 || soirPlats.length === 0) {
      alert(
        "Pas assez de plats correspondants aux saisons sélectionnées pour générer le menu.",
      );
      return;
    }

    const newDays = days.map((day) => {
      const randomMidi =
        midiPlats[Math.floor(Math.random() * midiPlats.length)];
      const randomSoir =
        soirPlats[Math.floor(Math.random() * soirPlats.length)];
      return {
        ...day,
        midi: randomMidi.nom,
        soir: randomSoir.nom,
      };
    });

    setDays(newDays);
  };

  const resetForm = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentMenu(null);
    const today = new Date();
    setStartDate(today.toISOString().split("T")[0]);
    setDays(
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        midi: "",
        soir: "",
      })),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all slots are filled
    const missingItems = days.some((d) => !d.midi || !d.soir);
    if (missingItems) {
      alert("Veuillez sélectionner un plat pour tous les repas de la semaine.");
      return;
    }

    // Find the plat objects based on selected names
    const menuDuJourList = days.map((day, index) => {
      const midiPlat = plats.find((p) => p.nom === day.midi);
      const soirPlat = plats.find((p) => p.nom === day.soir);

      const date = new Date(startDate);
      date.setDate(date.getDate() + index);

      return new MenusDuJour(
        date.toLocaleDateString("fr-FR"),
        midiPlat as any,
        soirPlat as any,
      );
    });

    const nouveauMenuSemaine = new MenusDeLaSemaine(menuDuJourList as any);

    const user = utilisateur.get();
    if (isEditMode && currentMenu) {
      user.modifierMenu(currentMenu, nouveauMenuSemaine);
    } else {
      user.ajouterMenu(nouveauMenuSemaine);
    }

    // Reset state & close
    resetForm();
  };

  return {
    isOpen,
    setIsOpen,
    isEditMode,
    startDate,
    setStartDate,
    selectedSeasons,
    setSelectedSeasons,
    days,
    plats,
    setDays,
    handleChange,
    getDayDate,
    generateRandomMenu,
    handleSubmit,
    toggleSeason,
    resetForm,
  };
}
