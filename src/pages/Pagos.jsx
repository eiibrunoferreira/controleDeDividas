import { useState, useMemo } from "react";
import EditDebtModal from "../components/EditDebtModal";
import DebtCard from "../components/DebtCard";
import { useDebts } from "../context/useDebts";

export default function Pagos() {
  const { debts, updateDebt, deleteDebt } = useDebts(); // 🔥 pegando todas funções do contexto

  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lista sempre atualizada de dívidas pagas
  const paidDebts = useMemo(() => {
    return debts
      .filter((debt) => debt.status === "pagos")
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
    <div className="min-h-screen bg-zinc-900 flex flex-col p-5">
      <h1 className="text-white text-2xl font-semibold mb-5">Pagos</h1>

      {paidDebts.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          Nenhuma dívida paga ainda
        </p>
      ) : (
        <div className="space-y-3">
          {paidDebts.map((debt) => (
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