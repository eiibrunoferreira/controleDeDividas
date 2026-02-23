import { useContext } from "react";
import { DebtContext } from "./DebtContext";

export function useDebts() {
  const context = useContext(DebtContext);
  if (!context) {
    throw new Error("useDebts precisa estar dentro de DebtProvider");
  }
  return context;
}