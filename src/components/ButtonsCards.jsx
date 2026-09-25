// src/components/ButtonsCards.jsx

import { useNavigate } from "react-router-dom";

export default function ButtonsCards() {

  const navigate = useNavigate();

  return (

    <div className="rounded-xl p-4">

      {/* ================================================= */}
      {/* TÍTULO */}
      {/* ================================================= */}

      <h2 className="text-white text-center text-xl font-semibold mb-3">
        Botões de Acessos
      </h2>


      {/* ================================================= */}
      {/* BOTÃO DÍVIDAS */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4">

        <button
          className="bg-gradient-to-r from-[#0B1D39] to-[#10284D] rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={() =>
            navigate("/dividas")
          }
        >
          DÍVIDAS
        </button>

      </div>

    </div>

  );

}