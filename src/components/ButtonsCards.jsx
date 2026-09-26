// src/components/ButtonsCards.jsx

import { useNavigate } from "react-router-dom";

export default function ButtonsCards() {

  const navigate = useNavigate();

  function handleLogout() {

    localStorage.removeItem("@auth_token");
    localStorage.removeItem("@user_name");
    localStorage.removeItem("@user_profile_image");
    localStorage.removeItem("@debts");

    navigate("/");

  }

  return (

    <div className="rounded-xl p-4">

      {/* ================================================= */}
      {/* TÍTULO */}
      {/* ================================================= */}

      <h2 className="text-white text-center text-xl font-semibold mb-3">
        Botões de Acessos
      </h2>


      {/* ================================================= */}
      {/* BOTÕES */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4">

        {/* ================================================= */}
        {/* BOTÃO DÍVIDAS */}
        {/* ================================================= */}

        <button
          className="bg-gradient-to-r from-[#0B1D39] to-[#10284D] rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={() =>
            navigate("/dividas")
          }
        >
          DÍVIDAS
        </button>


        {/* ================================================= */}
        {/* BOTÃO SAIR */}
        {/* ================================================= */}

        <button
          className="bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={handleLogout}
        >
          SAIR DA CONTA
        </button>

      </div>

    </div>

  );

}