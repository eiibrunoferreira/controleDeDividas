import { useState } from "react";
import DebtCard from "../components/DebtCard";
import EditDebtModal from "../components/EditDebtModal";
import { useDebts } from "../context/useDebts";
import NavHeader from "../components/NavHeader";
import backgroundImage from "/images/background.png";

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

  // 💎 IMAGEM DA PARTE DE BAIXO (Perfeito de acordo com sua calibração)
  const imageMaskBottomStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',
    opacity: '0.25',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
  };

  // 💎 IMAGEM DA PARTE DE CIMA (Invertida e Espelhada com opacidade suave)
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
        className="fixed inset-0 z-0 pointer-events-none"
        style={imageMaskTopStyle}
      />

      {/* 🖼️ IMAGEM DA BASE */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={imageMaskBottomStyle}
      />

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col w-full flex-1">
        <NavHeader />
        {/* Mantive exatamente a classe px-16 que funcionou perfeitamente pra você */}
        <h1 className="text-white text-2xl font-semibold mb-8 px-16">Dívidas Totais</h1>

        {debtsList.length === 0 ? (
          <p className="text-gray-400 text-center mt-20 text-lg">
            Nenhuma dívida ainda
          </p>
        ) : (
          <div className="space-y-1 flex flex-col">
            {debtsList.map((debt) => (
              <div key={debt.id} onClick={() => handleOpenDebt(debt)} className="cursor-pointer">
                <DebtCard debt={debt} />
              </div>
            ))}
          </div>
        )}
      </div>

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