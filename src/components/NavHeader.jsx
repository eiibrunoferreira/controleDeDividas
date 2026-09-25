import { useNavigate } from "react-router-dom";

export default function NavHeader({
  onBack,
}) {

  const navigate =
    useNavigate();


  // =========================================================
  // VOLTAR
  // =========================================================

  const handleBack = () => {

    // Se a página informou uma ação personalizada,
    // usamos ela.

    if (onBack) {

      onBack();

      return;

    }


    // Caso contrário, mantém o comportamento antigo.

    navigate(-1);

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <div
      onClick={
        handleBack
      }

      className="absolute ml-2 cursor-pointer -mt-1.5 w-11 h-11 flex items-center justify-center bg-[#10284D] rounded-full hover:brightness-90 transition-all"
    >

      <button
        type="button"
        className="text-white text-xl font-bold transition"
      >

        ⤶

      </button>

    </div>

  );

}