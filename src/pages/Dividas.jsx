import { useState } from "react";

import DebtCard from "../components/DebtCard";
import EditDebtModal from "../components/EditDebtModal";
import DebtHistoryModal from "../components/DebtHistoryModal";

import { useDebts } from "../context/useDebts";

import NavHeader from "../components/NavHeader";

import backgroundImage from "/images/background.png";


export default function Dividas() {


  const {
    debts,
    updateDebt,
    deleteDebt,
  } = useDebts();


  // =========================================================
  // DÍVIDA SELECIONADA
  // =========================================================

  const [selectedDebt, setSelectedDebt] =
    useState(null);


  // =========================================================
  // MODAL DE HISTÓRICO
  // =========================================================

  const [historyModalVisible, setHistoryModalVisible] =
    useState(false);


  // =========================================================
  // MODAL DE EDIÇÃO
  // =========================================================

  const [editModalVisible, setEditModalVisible] =
    useState(false);


  // =========================================================
  // PÁGINA ATUAL
  // =========================================================
  //
  // "totais"  = Dívidas Totais
  // "abertas" = Dívidas em Aberto
  // "quitadas" = Dívidas Quitadas
  //
  // =========================================================

  const [currentPage, setCurrentPage] =
    useState("totais");


  // =========================================================
  // VERIFICAR SE A DÍVIDA ESTÁ REALMENTE QUITADA
  // =========================================================

  const isDebtReallyPaid = (debt) => {


    // -----------------------------------------------
    // DÍVIDA NÃO RECORRENTE
    // -----------------------------------------------

    if (!debt.recurring) {

      return debt.status === "pagos";

    }


    // -----------------------------------------------
    // RECORRÊNCIA ANUAL
    // -----------------------------------------------

    if (
      debt.recurrenceType === "annual"
    ) {

      return false;

    }


    // -----------------------------------------------
    // RECORRÊNCIA SEM LIMITE
    // -----------------------------------------------

    if (
      debt.recurrenceLimit == null
    ) {

      return false;

    }


    // -----------------------------------------------
    // RECORRÊNCIA LIMITADA
    // -----------------------------------------------

    const currentNumber =
      Number(
        debt.recurrenceNumber || 1
      );


    const limit =
      Number(
        debt.recurrenceLimit
      );


    return (
      debt.status === "pagos" &&
      currentNumber >= limit
    );

  };


  // =========================================================
  // ORGANIZAR POR DATA
  // =========================================================

  const sortByDueDate = (list) => {

    return [...list].sort((a, b) => {

      if (!a.dueDate && !b.dueDate) {
        return 0;
      }


      if (!a.dueDate) {
        return 1;
      }


      if (!b.dueDate) {
        return -1;
      }


      const dateA =
        new Date(
          `${a.dueDate}T00:00:00`
        );


      const dateB =
        new Date(
          `${b.dueDate}T00:00:00`
        );


      return dateA - dateB;

    });

  };


  // =========================================================
  // ORGANIZAR RECORRÊNCIAS
  // =========================================================

  const getLatestRecurringDebts = (list) => {

    const grouped =
      new Map();


    const normalDebts = [];


    list.forEach((debt) => {

      /*
        Dívidas não recorrentes continuam
        sendo tratadas individualmente.
      */

      if (
        debt.recurring !== true ||
        !debt.recurrenceGroupId
      ) {

        normalDebts.push(
          debt
        );

        return;

      }


      const groupId =
        debt.recurrenceGroupId;


      const existing =
        grouped.get(
          groupId
        );


      if (!existing) {

        grouped.set(
          groupId,
          debt
        );

        return;

      }


      const existingNumber =
        Number(
          existing.recurrenceNumber || 1
        );


      const currentNumber =
        Number(
          debt.recurrenceNumber || 1
        );


      if (
        currentNumber >
        existingNumber
      ) {

        grouped.set(
          groupId,
          debt
        );

      }

    });


    return [

      ...normalDebts,

      ...Array.from(
        grouped.values()
      ),

    ];

  };

    // =========================================================
  // DÍVIDAS RECORRENTES ATUALMENTE EM ABERTO
  // =========================================================

  const getCurrentOpenDebts = (list) => {

    const grouped = new Map();

    const normalDebts = [];


    list.forEach((debt) => {

      // -----------------------------------------------
      // DÍVIDAS NORMAIS
      // -----------------------------------------------

      if (
        debt.recurring !== true ||
        !debt.recurrenceGroupId
      ) {

        if (!isDebtReallyPaid(debt)) {

          normalDebts.push(debt);

        }

        return;

      }


      // -----------------------------------------------
      // PARCELA JÁ PAGA
      // -----------------------------------------------

      if (
        debt.status === "pagos"
      ) {

        return;

      }


      const groupId =
        debt.recurrenceGroupId;


      const existing =
        grouped.get(groupId);


      // -----------------------------------------------
      // PRIMEIRA PARCELA ABERTA DO GRUPO
      // -----------------------------------------------

      if (!existing) {

        grouped.set(
          groupId,
          debt
        );

        return;

      }


      // -----------------------------------------------
      // PEGAR A PARCELA MAIS ATUAL
      // -----------------------------------------------

      const existingNumber =
        Number(
          existing.recurrenceNumber || 1
        );


      const currentNumber =
        Number(
          debt.recurrenceNumber || 1
        );


      if (
        currentNumber >
        existingNumber
      ) {

        grouped.set(
          groupId,
          debt
        );

      }

    });


    return [

      ...normalDebts,

      ...Array.from(
        grouped.values()
      ),

    ];

  };


  // =========================================================
  // DÍVIDAS VISÍVEIS
  // =========================================================

  const visibleDebts =
    getLatestRecurringDebts(
      debts
    );


  // =========================================================
  // DÍVIDAS EM ABERTO
  // =========================================================

    const activeDebts =
    sortByDueDate(
      getCurrentOpenDebts(
        debts
      )
    );


  // =========================================================
  // DÍVIDAS QUITADAS
  // =========================================================

  const paidDebts =
    sortByDueDate(
      visibleDebts.filter(
        (debt) =>
          isDebtReallyPaid(debt)
      )
    );


  // =========================================================
  // ABRIR MODAL DE HISTÓRICO
  // =========================================================

  const handleOpenDebt = (debt) => {

    setSelectedDebt(debt);

    setHistoryModalVisible(true);

  };


  // =========================================================
  // FECHAR MODAL DE HISTÓRICO
  // =========================================================

  const handleCloseHistoryModal = () => {

    setHistoryModalVisible(false);

    setSelectedDebt(null);

  };


  // =========================================================
  // ABRIR MODAL DE EDIÇÃO
  // =========================================================

  const handleOpenEditModal = (debt) => {

    setHistoryModalVisible(false);

    setSelectedDebt(debt);

    setEditModalVisible(true);

  };


  // =========================================================
  // FECHAR MODAL DE EDIÇÃO
  // =========================================================

  const handleCloseEditModal = () => {

    setEditModalVisible(false);

    setSelectedDebt(null);

  };


  // =========================================================
  // IMAGEM DA PARTE DE BAIXO
  // =========================================================

  const imageMaskBottomStyle = {

    backgroundImage:
      `url('${backgroundImage}')`,

    backgroundSize:
      "100%",

    backgroundPosition:
      "bottom center",

    backgroundRepeat:
      "no-repeat",

    opacity:
      "0.25",

    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)",

    maskImage:
      "linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)",

  };


  // =========================================================
  // IMAGEM DA PARTE DE CIMA
  // =========================================================

  const imageMaskTopStyle = {

    backgroundImage:
      `url('${backgroundImage}')`,

    backgroundSize:
      "100%",

    backgroundRepeat:
      "no-repeat",

    opacity:
      "0.10",

    transform:
      "scaleY(-1) scaleX(-1)",

    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 90%)",

    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 90%)",

  };


  // =========================================================
  // VOLTAR DA SUBPÁGINA
  // =========================================================

  const handleBackToTotals = () => {

    setCurrentPage("totais");

  };


  // =========================================================
  // TÍTULO DA PÁGINA
  // =========================================================

  const renderPageTitle = () => {

    if (
      currentPage === "abertas"
    ) {

      return (

        <h1 className="text-white text-2xl font-semibold mb-8 px-16 whitespace-nowrap flex items-center gap-3">
          Dívidas em Aberto
        </h1>

      );

    }


    if (
      currentPage === "quitadas"
    ) {

      return (

        <h1 className="text-white text-2xl font-semibold mb-8 px-16 whitespace-nowrap flex items-center gap-3">
          Dívidas Quitadas
        </h1>

      );

    }


    return (

      <h1 className="text-white text-2xl font-semibold mb-8 px-16 whitespace-nowrap">

        Dívidas Totais

      </h1>

    );

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <div className="min-h-screen w-full flex flex-col p-5 relative overflow-x-hidden bg-[#061224]">


      {/* ================================================= */}
      {/* IMAGEM DO TOPO */}
      {/* ================================================= */}

      <div
        className="fixed top-0 left-0 right-0 h-[35vh] z-0 pointer-events-none"
        style={{
          ...imageMaskTopStyle,
          backgroundPosition:
            "top center",
        }}
      />


      {/* ================================================= */}
      {/* IMAGEM DA BASE */}
      {/* ================================================= */}

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={
          imageMaskBottomStyle
        }
      />


      {/* ================================================= */}
      {/* CONTEÚDO */}
      {/* ================================================= */}

      <div className="relative z-10 flex flex-col w-full flex-1">


        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <NavHeader
          onBack={
            currentPage === "totais"
              ? undefined
              : handleBackToTotals
          }
        />


        {/* ================================================= */}
        {/* TÍTULO */}
        {/* ================================================= */}

        {renderPageTitle()}


        {/* ================================================= */}
        {/* PÁGINA: DÍVIDAS TOTAIS */}
        {/* ================================================= */}

        {currentPage === "totais" && (

          <div className="flex flex-col items-center gap-5 px-5 mt-2">


            {/* ================================================= */}
            {/* BOTÃO DÍVIDAS EM ABERTO */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  "abertas"
                )
              }

              className="w-full max-w-md bg-[#10284D] text-white rounded-2xl px-6 py-5 flex items-center justify-center gap-3 border border-white/10 hover:brightness-110 active:scale-[0.98] transition-all"
            >

              <span className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></span>

              <span className="text-lg font-semibold">
                Dívidas em Aberto
              </span>

            </button>


            {/* ================================================= */}
            {/* BOTÃO DÍVIDAS QUITADAS */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  "quitadas"
                )
              }

              className="w-full max-w-md bg-[#10284D] text-white rounded-2xl px-6 py-5 flex items-center justify-center gap-3 border border-white/10 hover:brightness-110 active:scale-[0.98] transition-all"
            >

              <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>

              <span className="text-lg font-semibold">
                Dívidas Quitadas
              </span>

            </button>

          </div>

        )}


        {/* ================================================= */}
        {/* PÁGINA: DÍVIDAS EM ABERTO */}
        {/* ================================================= */}

        {currentPage === "abertas" && (

          <>

            {activeDebts.length === 0 ? (

              <p className="text-gray-400 text-center mt-2 mb-10 text-lg">
                Nenhuma dívida em andamento
              </p>

            ) : (

              <div className="space-y-1 flex flex-col mb-5">

                {activeDebts.map((debt) => (

                  <div
                    key={debt.id}

                    onClick={() =>
                      handleOpenDebt(debt)
                    }

                    className="cursor-pointer"
                  >

                    <DebtCard
                      debt={{
                        ...debt,
                        whiteCircle: true,
                        hideDate: true,
                      }}
                    />

                  </div>

                ))}

              </div>

            )}

          </>

        )}


        {/* ================================================= */}
        {/* PÁGINA: DÍVIDAS QUITADAS */}
        {/* ================================================= */}

        {currentPage === "quitadas" && (

          <>

            {paidDebts.length === 0 ? (

              <p className="text-gray-400 text-center mt-2 mb-10 text-lg">
                Nenhuma dívida quitada
              </p>

            ) : (

              <div className="space-y-1 flex flex-col pb-5">

                {paidDebts.map((debt) => (

                  <div
                    key={debt.id}

                    onClick={() =>
                      handleOpenDebt(debt)
                    }

                    className="cursor-pointer"
                  >

                    <DebtCard
                      debt={{
                        ...debt,
                        whiteCircle: true,
                        hideDate: true,
                        showPaidLabel: true,
                      }}
                    />

                  </div>

                ))}

              </div>

            )}

          </>

        )}

      </div>


      {/* ================================================= */}
      {/* MODAL DE HISTÓRICO */}
      {/* ================================================= */}

      {selectedDebt && (

        <DebtHistoryModal

  visible={
    historyModalVisible
  }

  debt={
    selectedDebt
  }

  debts={
    debts
  }

  onClose={
    handleCloseHistoryModal
  }

  onEdit={
    handleOpenEditModal
  }

/>
      )}


      {/* ================================================= */}
      {/* MODAL DE EDIÇÃO */}
      {/* ================================================= */}

      {selectedDebt && (

        <EditDebtModal

          visible={
            editModalVisible
          }

          debt={
            selectedDebt
          }

          onClose={
            handleCloseEditModal
          }

          updateDebt={
            updateDebt
          }

          deleteDebt={
            deleteDebt
          }

        />

      )}

    </div>

  );

}