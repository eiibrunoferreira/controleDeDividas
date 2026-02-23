import { useState, useMemo } from "react";
import { DebtContext } from "./DebtContext";

export function DebtProvider({ children }) {
  const [debts, setDebts] = useState(() => {
    try {
      const data = window.localStorage.getItem("@debts");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const persist = (updated) => {
    window.localStorage.setItem("@debts", JSON.stringify(updated));
    return updated;
  };

  const addDebt = (newDebt) => {
    setDebts((prev) =>
      persist([...prev, { id: String(Date.now()), ...newDebt }])
    );
  };

  const updateDebt = (id, updatedData) => {
    setDebts((prev) =>
      persist(
        prev.map((d) =>
          d.id === id ? { ...d, ...updatedData } : d
        )
      )
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) =>
      persist(prev.filter((d) => d.id !== id))
    );
  };

  const totalAVencer = useMemo(() => {
    return debts
      .filter((d) => d.status === "a-vencer")
      .reduce((acc, d) => acc + Number(d.amount || 0), 0);
  }, [debts]);

  return (
    <DebtContext.Provider
      value={{ debts, addDebt, updateDebt, deleteDebt, totalAVencer }}
    >
      {children}
    </DebtContext.Provider>
  );
}