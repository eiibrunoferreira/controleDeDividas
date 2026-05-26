import { useState, useMemo } from "react";
import EditDebtModal from "../components/EditDebtModal";
import DebtCard from "../components/DebtCard";
import { useDebts } from "../context/useDebts";
import NavHeader from "../components/NavHeader";
import backgroundImage from "/images/background.png";

export default function AVencer() {
  const { debts, updateDebt, deleteDebt } = useDebts();

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

  // 💎 IMAGEM DA PARTE DE BAIXO
  const imageMaskBottomStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',
    opacity: '0.25',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
  };

  // 💎 IMAGEM DA PARTE DE CIMA (Invertida e Espelhada)
  const imageMaskTopStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    opacity: '0.10',
    transform: 'scaleY(-1) scaleX(-1)',
    backgroundPosition: 'bottom center',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-5 relative overflow-x-hidden bg-[#061224]">

      {/* 🖼️ IMAGEM DO TOPO (Invertida) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={imageMaskTopStyle}
      />

      {/* 🖼️ IMAGEM DA BASE */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={imageMaskBottomStyle}
      />

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col w-full flex-1">
        <NavHeader />
        <h1 className="text-white text-2xl font-semibold mb-8 px-16">A Vencer</h1>

        {upcomingDebts.length === 0 ? (
          <p className="text-gray-400 text-center mt-20 text-lg">
            Nenhuma dívida a vencer...
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingDebts.map((debt) => (
              <div key={debt.id} onClick={() => handleOpenDebt(debt)} className="cursor-pointer">
                <DebtCard debt={debt} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDebt && modalVisible && (
        <EditDebtModal
          visible={modalVisible}
          debt={selectedDebt}
          onClose={handleCloseModal}
          updateDebt={updateDebt}
          deleteDebt={deleteDebt}
        />
      )}
    </div>
  );
}