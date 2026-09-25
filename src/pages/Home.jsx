import { useState } from "react";

import Header from "../components/Header";
import TotalToPay from "../components/TotalToPay";
import AddDividaButton from "../components/AddDividaButton";
import ButtonsCards from "../components/ButtonsCards";
import AddDebtModal from "../components/AddDebtModal";
import EditDebtModal from "../components/EditDebtModal";
import DebtDetailsModal from "../components/DebtDetailsModal";
import MonthWeekSelector from "../components/MonthWeekSelector";
import WeeklyDebtList from "../components/WeeklyDebtList";

import { useDebts } from "../context/useDebts";

import backgroundImage from "/images/background.png";

export default function Home() {

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [detailsModalVisible, setDetailsModalVisible] =
    useState(false);

  const [selectedDebt, setSelectedDebt] =
    useState(null);

  const {
    startNewMonth,
    updateDebt,
    deleteDebt,
  } = useDebts();

  const [selectedPeriod, setSelectedPeriod] =
    useState(null);


  // =========================================================
  // SEMANA ABERTA
  // =========================================================
  //
  // null = nenhuma semana aberta
  //
  // Exemplo:
  // 1 = Semana 1 aberta
  // 2 = Semana 2 aberta
  //
  // =========================================================

  const [openWeek, setOpenWeek] =
    useState(null);


  // =========================================================
  // CONTROLE DO TOTAL DAS DÍVIDAS ANUAIS
  // =========================================================

  const [
    includeAnnualInTotal,
    setIncludeAnnualInTotal
  ] = useState(false);


  // =========================================================
  // ALTERAR MÊS / SEMANA
  // =========================================================

  const handlePeriodChange = (period) => {

    console.log(
      "Período selecionado:",
      period
    );

    setSelectedPeriod(period);

  };


  // =========================================================
  // ABRIR / FECHAR SEMANA
  // =========================================================

  const handleWeekToggle = (week) => {

    if (week === null) {

      setOpenWeek(null);

      return;

    }


    setOpenWeek((currentWeek) => {

      // Se clicar novamente na mesma semana,
      // fecha a semana.

      if (
        currentWeek === week
      ) {

        return null;

      }


      // Se clicar em outra semana,
      // fecha a anterior e abre a nova.

      return week;

    });

  };


  // =========================================================
  // ABRIR MODAL DE DETALHES
  // =========================================================

  const handleOpenDebt = (debt) => {

    setSelectedDebt(debt);

    setDetailsModalVisible(true);

  };


  // =========================================================
  // ATUALIZAR DÍVIDA PELO MODAL DE DETALHES
  // =========================================================

  const handleUpdateDebtFromDetails = (
    id,
    changes
  ) => {

    updateDebt(
      id,
      changes
    );


    setSelectedDebt((currentDebt) => {

      if (
        !currentDebt ||
        currentDebt.id !== id
      ) {

        return currentDebt;

      }


      return {
        ...currentDebt,
        ...changes,
      };

    });

  };


  // =========================================================
  // FECHAR MODAL DE DETALHES
  // =========================================================

  const handleCloseDetailsModal = () => {

    setDetailsModalVisible(false);

    setSelectedDebt(null);

  };


  // =========================================================
  // ABRIR MODAL DE EDIÇÃO
  // =========================================================

  const handleOpenEditModal = (debt) => {

    setDetailsModalVisible(false);

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
  // INICIAR NOVO MÊS
  // =========================================================

  const handleNewMonth = () => {

    const confirmar = window.confirm(
      "Deseja mesmo iniciar um novo mês? Isso moverá todas as dívidas pagas de volta para a lista de dívidas."
    );


    if (confirmar) {

      startNewMonth();

      alert(
        "Novo mês iniciado com sucesso! 🚀"
      );

    }

  };


  // =========================================================
  // FUNDO INFERIOR
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
  // FUNDO SUPERIOR
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
      "linear-gradient(to bottom, transparent 0%, black 30%, black 30%, transparent 90%)",

    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 90%)",

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <>

      <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden bg-[#061224]">


        {/* ================================================= */}
        {/* FUNDO SUPERIOR */}
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
        {/* FUNDO INFERIOR */}
        {/* ================================================= */}

        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={
            imageMaskBottomStyle
          }
        />


        <div className="relative z-10 flex flex-col w-full flex-1">


          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <Header />


          {/* ================================================= */}
          {/* TOTAL A PAGAR */}
          {/* ================================================= */}

          <TotalToPay
            selectedPeriod={
              selectedPeriod
            }

            includeAnnualInTotal={
              includeAnnualInTotal
            }
          />


          {/* ================================================= */}
          {/* ADICIONAR DÍVIDA */}
          {/* ================================================= */}

          <AddDividaButton
            onClick={() =>
              setModalVisible(true)
            }
          />


          {/* ================================================= */}
          {/* SELETOR DE MÊS E SEMANA */}
          {/* ================================================= */}

          <div className="mt-6">

            <MonthWeekSelector

              onChange={
                handlePeriodChange
              }

              onWeekToggle={
                handleWeekToggle
              }

            />

          </div>


          {/* ================================================= */}
          {/* LISTA DA SEMANA ABERTA */}
          {/* ================================================= */}

          {selectedPeriod &&
            openWeek ===
              selectedPeriod.week && (

            <div className="mt-6">

              <WeeklyDebtList

                month={
                  selectedPeriod.month
                }

                year={
                  selectedPeriod.year
                }

                week={
                  selectedPeriod.week
                }

                onOpenDebt={
                  handleOpenDebt
                }

                includeAnnualInTotal={
                  includeAnnualInTotal
                }

                setIncludeAnnualInTotal={
                  setIncludeAnnualInTotal
                }

              />

            </div>

          )}


          {/* ================================================= */}
          {/* BOTÕES ANTIGOS */}
          {/* ================================================= */}

          <div className="mt-5 mx-5">

            <ButtonsCards />

          </div>


          {/* ================================================= */}
          {/* NOVO MÊS */}
          {/* ================================================= */}

          {/* <div className="mt-6 mx-5 flex justify-center">

            <button
              onClick={
                handleNewMonth
              }
              className="w-full bg-white/20 text-white font-medium py-3 px-6 rounded-xl border transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
            >

              Iniciar Novo Mês

            </button>

          </div> /*}


          {/* ================================================= */}
          {/* RODAPÉ */}
          {/* ================================================= */}

          <div className="flex-1 flex items-end justify-center pb-4 mt-8">

            <p className="text-white text-sm">

              © Direitos reservados Bruno Ferreira

            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* MODAL DE ADICIONAR DÍVIDA */}
      {/* ================================================= */}

      <AddDebtModal

        visible={
          modalVisible
        }

        onClose={() =>
          setModalVisible(false)
        }

      />


      {/* ================================================= */}
      {/* MODAL DE DETALHES DA DÍVIDA */}
      {/* ================================================= */}

      {selectedDebt && (

        <DebtDetailsModal

          visible={
            detailsModalVisible
          }

          debt={
            selectedDebt
          }

          onClose={
            handleCloseDetailsModal
          }

          updateDebt={
            handleUpdateDebtFromDetails
          }

          onEdit={
            handleOpenEditModal
          }

        />

      )}


      {/* ================================================= */}
      {/* MODAL DE EDITAR DÍVIDA */}
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

    </>

  );

}