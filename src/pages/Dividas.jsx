import { useState } from "react";
import DebtCard from "../components/DebtCard";
import EditDebtModal from "../components/EditDebtModal";
import { useDebts } from "../context/useDebts";
import NavHeader from "../components/NavHeader";

export default function Dividas() {
  const { debts, updateDebt, deleteDebt } = useDebts();
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filtra apenas dívidas com status "dividas" e ordena por dueDay
  const debtsList = debts
    .filter((debt) => debt.status === "dividas")
    .sort((a, b) => {
      if (!a.dueDay) return 1;
      if (!b.dueDay) return -1;
      return a.dueDay - b.dueDay;
    });

  const handleOpenDebt = (debt) => {
    setSelectedDebt(debt);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDebt(null);
  };

  return (

    <div className="min-h-screen bg-zinc-900 flex flex-col p-5">
      <NavHeader />
      <h1 className="text-white text-2xl font-semibold mb-5 text-center">Dívidas Totais</h1>

      {debtsList.length === 0 ? (
        <p className="text-gray-400 text-center mt-20 text-lg">
          Nenhuma dívida ainda
        </p>
      ) : (
        <div className="flex flex-col space-y-3">
          {debtsList.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onPress={handleOpenDebt}
            />
          ))}
        </div>
      )}

      {modalVisible && selectedDebt && (
        <EditDebtModal
          visible={modalVisible}
          debt={selectedDebt}
          updateDebt={updateDebt}
          deleteDebt={deleteDebt}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}