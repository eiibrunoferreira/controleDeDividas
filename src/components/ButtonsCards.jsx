// src/components/ButtonsCards.jsx

import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function ButtonsCards({ onAddDebt }) {

  const navigate = useNavigate();

  function handleLogout() {

    localStorage.removeItem("@auth_token");
    localStorage.removeItem("@user_name");
    localStorage.removeItem("@user_profile_image");
    localStorage.removeItem("@debts");

    navigate("/");

  }

  return (

  <div className="flex items-center justify-center">

    {/* ================================================= */}
    {/* BALÃO DA NAVEGAÇÃO */}
    {/* ================================================= */}

   <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#071427] border border-white/10 backdrop-blur-xl shadow-xl">

  {/* ================================================= */}
  {/* BOTÃO DÍVIDAS */}
  {/* ================================================= */}

  <button
    type="button"
    title="Dívidas"
    aria-label="Dívidas"
    onClick={() =>
      navigate("/dividas")
    }
    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B1D39] to-[#10284D] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all"
  >
    <FontAwesomeIcon
      icon={faFileInvoiceDollar}
      className="text-sm"
    />
  </button>


  {/* ================================================= */}
  {/* BOTÃO ADICIONAR DÍVIDA */}
  {/* ================================================= */}

  <button
    type="button"
    title="Adicionar dívida"
    aria-label="Adicionar dívida"
    onClick={onAddDebt}
    className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-md hover:brightness-90 transition-all"
  >
    <FontAwesomeIcon
      icon={faPlus}
      className="text-sm"
    />
  </button>


  {/* ================================================= */}
  {/* BOTÃO SAIR */}
  {/* ================================================= */}

  <button
    type="button"
    title="Sair da conta"
    aria-label="Sair da conta"
    onClick={handleLogout}
    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all"
  >
    <FontAwesomeIcon
      icon={faRightFromBracket}
      className="text-sm"
    />
  </button>

</div>

  </div>

);

}