import { useState, useMemo } from "react";
import EditDebtModal from "../components/EditDebtModal";
import DebtCard from "../components/DebtCard";
import { useDebts } from "../context/useDebts";
import NavHeader from "../components/NavHeader";

export default function AVencer() {
  const { debts, updateDebt, deleteDebt } = useDebts(); // 🔥 pegando todas funções do contexto

  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lista sempre atualizada de dívidas a vencer
  const upcomingDebts = useMemo(() => {
    return debts
      .filter((debt) => debt.status === "a-vencer")
      .sort((a, b) => {
        if (!a.dueDay) return 1;
        if (!b.dueDay) return -1;
        return a.dueDay - b.dueDay;
      });
  }, [debts]);

  const selectedDebt = debts.find((d) => d.id === selectedDebtId);

  const handleOpenDebt = (debt) => {
    setSelectedDebtId(debt.id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDebtId(null);
  };

  return (
    <div className="
  min-h-screen
  flex
  flex-col
  p-5
  bg-gradient-to-b
  from-[#020617]
  via-[#071226]
  to-[#00031f]
">
      <NavHeader />
      <h1 className="text-white text-2xl font-semibold mb-8 text-center">A Vencer</h1>

      {upcomingDebts.length === 0 ? (
        <p className="text-gray-400 text-center mt-20 text-lg">
          Nenhuma dívida a vencer...
        </p>
      ) : (
        <div>
          {upcomingDebts.map((debt) => (
            <div key={debt.id} onClick={() => handleOpenDebt(debt)}>
              <DebtCard debt={debt} />
            </div>
          ))}
        </div>
      )}

      {selectedDebt && modalVisible && (
        <EditDebtModal
          visible={modalVisible}
          debt={selectedDebt}
          onClose={handleCloseModal}
          updateDebt={updateDebt}   // 🔥 corrigido
          deleteDebt={deleteDebt}   // 🔥 corrigido
        />
      )}
    </div>
  );
}