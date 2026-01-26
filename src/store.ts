import { atom } from "nanostores";
import { Utilisateur } from "./classes/utilisateur";

export const utilisateur = atom(new Utilisateur());
