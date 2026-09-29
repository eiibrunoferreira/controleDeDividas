// src/components/ButtonsCards.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function ButtonsCards({ onAddDebt }) {

  const navigate = useNavigate();

  const [logoutConfirmVisible, setLogoutConfirmVisible] =
  useState(false);

  function handleLogout() {

  localStorage.removeItem("@auth_token");
  localStorage.removeItem("@user_name");
  localStorage.removeItem("@user_profile_image");
  localStorage.removeItem("@debts");

  navigate("/");

}

function handleLogoutClick() {

  setLogoutConfirmVisible(true);

}

function cancelLogout() {

  setLogoutConfirmVisible(false);

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
    onClick={handleLogoutClick}
    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all"
  >
    <FontAwesomeIcon
      icon={faRightFromBracket}
      className="text-sm"
    />
  </button>

</div>

{/* ================================================= */}
{/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
{/* ================================================= */}

{logoutConfirmVisible && (

  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5">

    <div className="w-full max-w-sm bg-[#0B1D39] border border-white/10 rounded-2xl shadow-2xl p-6">

      {/* ================================================= */}
      {/* ÍCONE */}
      {/* ================================================= */}

      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">

        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-red-400 text-lg"
        />

      </div>


      {/* ================================================= */}
      {/* TÍTULO */}
      {/* ================================================= */}

      <h2 className="text-white text-lg font-semibold text-center">

        Sair da conta?

      </h2>


      {/* ================================================= */}
      {/* DESCRIÇÃO */}
      {/* ================================================= */}

      <p className="text-gray-400 text-sm text-center mt-2">

        Tem certeza que deseja sair da sua conta?

      </p>


      {/* ================================================= */}
      {/* BOTÕES */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 mt-6">

        <button
          type="button"
          onClick={cancelLogout}
          className="h-11 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-500 active:scale-[0.98] transition-all"
        >
          Cancelar
        </button>


        <button
          type="button"
          onClick={handleLogout}
          className="h-11 rounded-xl bg-red-700 text-white font-medium hover:bg-red-600 active:scale-[0.98] transition-all"
        >
          Sair
        </button>

      </div>

    </div>

  </div>

)}

  </div>

);

}