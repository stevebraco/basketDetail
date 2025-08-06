import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type de l'état pour le système
interface System {
  id: number;
  name: string;
  type: string;
  description: string;
  players: string;
  createdAt: string;
  data?: {
    time: number;
    players: { x: number; y: number }[];
    ball: { x: number; y: number };
    comment: string;
  };
}

// L'état initial du slice
const initialState: System | null = null;

// Créer le slice pour le système
const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setSystem: (state, action: PayloadAction<System>) => action.payload, // Mettre à jour l'état avec un nouveau système
    clearSystem: () => null, // Réinitialiser l'état
  },
});

// Exporter les actions générées par createSlice
export const { setSystem, clearSystem } = systemSlice.actions;

// Exporter le reducer
export default systemSlice.reducer;
