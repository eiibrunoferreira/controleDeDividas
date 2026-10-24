// src/components/ButtonsCards.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faRightFromBracket,
  faPlus,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

export default function ButtonsCards({ onAddDebt }) {

  const navigate = useNavigate();

  const location = useLocation();

const isHomeActive = location.pathname === "/home";
const isDebtsActive = location.pathname === "/dividas";

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

   <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0e0d0d] border border-transparent backdrop-blur-xl shadow-xl">


{/* ================================================= */}
{/* BOTÃO HOME */}
{/* ================================================= */}

<button
  type="button"
  title="Início"
  aria-label="Início"
  onClick={() => navigate("/home")}
className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all active:scale-95 ${
  isHomeActive
    ? "bg-[#138e92] shadow-md shadow-[#138e92]/30"
    : "bg-transparent hover:bg-white/10"
}`}>
  <FontAwesomeIcon
    icon={faHouse}
    className="text-sm"
  />
</button>


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
className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all active:scale-95 ${
  isDebtsActive
    ? "bg-[#138e92] shadow-md shadow-[#138e92]/30"
    : "bg-transparent hover:bg-white/10"
}`}  >
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
className="w-10 h-10 rounded-full bg-transparent text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"  >
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
className="w-10 h-10 rounded-full bg-transparent text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"  >
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

  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm px-5">

    <div className="w-full max-w-sm bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-6">

      {/* ================================================= */}
      {/* ÍCONE */}
      {/* ================================================= */}

      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">

        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-red-400 text-lg"
        />

      </div>


      {/* ================================================= */}
      {/* TÍTULO */}
      {/* ================================================= */}

<h2 className="text-white text-xl font-semibold text-center">
        Sair da conta?

      </h2>


      {/* ================================================= */}
      {/* DESCRIÇÃO */}
      {/* ================================================= */}

<p className="text-gray-400 text-sm text-center mt-2 leading-relaxed">
        Tem certeza que deseja sair da sua conta?

      </p>


      {/* ================================================= */}
      {/* BOTÕES */}
      {/* ================================================= */}

<div className="grid grid-cols-2 gap-3 mt-7">
        <button
          type="button"
          onClick={cancelLogout}
className="h-11 rounded-xl bg-[#0e0d0d] border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all"        >
          Cancelar
        </button>


        <button
          type="button"
          onClick={handleLogout}
className="h-11 rounded-xl bg-red-700 text-white font-medium hover:bg-red-600 active:scale-[0.98] transition-all"        >
          Sair
        </button>

      </div>

    </div>

  </div>

)}

  </div>

);

}