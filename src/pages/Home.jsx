import { useState } from "react";
import Header from "../components/Header";
import TotalToPay from "../components/TotalToPay";
import AddDividaButton from "../components/AddDividaButton";
import ButtonsCards from "../components/ButtonsCards";
import AddDebtModal from "../components/AddDebtModal";
import { useDebts } from "../context/useDebts"; // 🎯 Puxando o seu hook

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const { startNewMonth } = useDebts(); // 🎯 Pegando a nova função do contexto

  // Função que roda quando clica no botão "Iniciar Novo Mês"
  const handleNewMonth = () => {
    const confirmar = window.confirm(
      "Deseja mesmo iniciar um novo mês? Isso moverá todas as dívidas pagas de volta para a lista de dívidas."
    );

    if (confirmar) {
      startNewMonth();
      alert("Novo mês iniciado com sucesso! 🚀");
    }
  };

  // 💎 Seus estilos de imagem de fundo que ficaram perfeitos
  const imageMaskBottomStyle = {
    backgroundImage: "url('public/images/background.png')",
    backgroundSize: '100%',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',
    opacity: '0.25',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
  };

  const imageMaskTopStyle = {
    backgroundImage: "url('public/images/background.png')",
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    opacity: '0.10',
    transform: 'scaleY(-1) scaleX(-1)',
    backgroundPosition: 'bottom center',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)',
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden bg-[#061224]">

        {/* IMAGENS DE FUNDO */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={imageMaskTopStyle} />
        <div className="absolute inset-0 z-0 pointer-events-none" style={imageMaskBottomStyle} />

        {/* CONTEÚDO */}
        <div className="relative z-10 flex flex-col w-full flex-1">
          <Header />
          <TotalToPay />

          <AddDividaButton onClick={() => setModalVisible(true)} />

          <div className="mt-5 mx-5">
            <ButtonsCards />
          </div>

          {/* 🎯 SEU NOVO BOTÃO ADICIONADO AQUI: */}
          <div className="mt-6 mx-5 flex justify-center">
            <button
              onClick={handleNewMonth}
              className="w-full bg-white/20 text-white font-medium py-3 px-6 rounded-xl border transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
            >
              Iniciar Novo Mês
            </button>
          </div>

          <div className="flex-1 flex items-end justify-center pb-4 mt-8">
            <p className="text-white text-sm">
              © Direitos reservados Bruno Ferreira
            </p>
          </div>
        </div>
      </div>

      <AddDebtModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}