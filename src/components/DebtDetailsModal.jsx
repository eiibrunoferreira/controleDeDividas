import { useEffect } from "react";

export default function DebtDetailsModal({
  visible,
  debt,
  onClose,
  updateDebt,
  onEdit,
}) {

  // =========================================================
  // BLOQUEAR ROLAGEM DA PÁGINA ENQUANTO O MODAL ESTÁ ABERTO
  // =========================================================

  useEffect(() => {

    if (!visible) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };

  }, [visible]);


  // =========================================================
  // SE NÃO ESTIVER VISÍVEL OU NÃO TIVER DÍVIDA
  // =========================================================

  if (!visible || !debt) {
    return null;
  }


  // =========================================================
  // FORMATAR DATA
  // =========================================================

  const formatDate = (dateString) => {

    if (!dateString) {
      return "-";
    }

    const [year, month, day] =
      dateString.split("-");

    if (!year || !month || !day) {
      return "-";
    }

    return `${day}/${month}/${year}`;

  };


  // =========================================================
  // FORMATAR VALOR
  // =========================================================

  const formatAmount = (value) => {

    if (value == null) {
      return "0,00";
    }

    return Number(value).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };


  // =========================================================
  // PEGAR DIA DA SEMANA
  // =========================================================

  const getDayOfWeek = (dateString) => {

    if (!dateString) {
      return "-";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    return days[date.getDay()];

  };


  // =========================================================
  // TEXTO DO TIPO DE RECORRÊNCIA
  // =========================================================

  const getRecurrenceType = () => {

    if (!debt.recurring) {
      return "Não recorrente";
    }

    switch (debt.recurrenceType) {

      case "weekly":
        return "Semanal";

      case "annual":
        return "Anual";

      case "monthly":
      default:
        return "Mensal";

    }

  };


  // =========================================================
  // NOMES DOS MESES
  // =========================================================

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];


  // =========================================================
  // MESES DA RECORRÊNCIA ANUAL
  // =========================================================

  const getAnnualMonths = () => {

    if (
      !Array.isArray(debt.recurrenceMonths) ||
      debt.recurrenceMonths.length === 0
    ) {
      return "-";
    }

    return debt.recurrenceMonths
      .map(Number)
      .sort((a, b) => a - b)
      .map(
        (month) =>
          monthNames[month - 1]
      )
      .join(", ");

  };


  // =========================================================
  // MUDAR STATUS
  // =========================================================

  const handleStatusChange = (newStatus) => {

    if (
      typeof updateDebt !== "function"
    ) {
      return;
    }


    // =======================================================
    // DÍVIDA ANUAL
    // =======================================================
    //
    // Quando uma dívida anual é marcada como paga,
    // precisamos registrar exatamente em qual semana,
    // mês e ano ela foi paga.
    //
    // O WeeklyDebtList envia essas informações quando
    // abrimos a dívida:
    //
    // selectedWeek
    // selectedMonth
    // selectedYear
    //
    // Assim, por exemplo:
    //
    // IPVA em Janeiro
    // pago na Semana 3
    //
    // fica registrado:
    //
    // annualPaidWeek  = 3
    // annualPaidMonth = 1
    // annualPaidYear  = 2027
    //
    // =======================================================

    if (
      debt.recurring === true &&
      debt.recurrenceType === "annual"
    ) {

      // -----------------------------------------------------
      // MARCAR COMO PAGO
      // -----------------------------------------------------

      if (newStatus === "pagos") {

        updateDebt(
          debt.id,
          {
            status: "pagos",

            annualPaidWeek:
              debt.selectedWeek != null
                ? Number(debt.selectedWeek)
                : null,

            annualPaidMonth:
              debt.selectedMonth != null
                ? Number(debt.selectedMonth)
                : debt.recurrenceMonth != null
                  ? Number(debt.recurrenceMonth)
                  : null,

            annualPaidYear:
              debt.selectedYear != null
                ? Number(debt.selectedYear)
                : debt.recurrenceYear != null
                  ? Number(debt.recurrenceYear)
                  : null,
          }
        );

        return;
      }


      // -----------------------------------------------------
      // VOLTAR PARA A VENCER
      // -----------------------------------------------------
      //
      // Se o usuário marcou como pago e depois voltou
      // para "A Vencer", apagamos o registro da semana
      // em que havia sido pago.
      //
      // Isso faz a dívida voltar a aparecer normalmente
      // nas semanas do mês.
      // -----------------------------------------------------

      if (newStatus === "a-vencer") {

        updateDebt(
          debt.id,
          {
            status: "a-vencer",

            annualPaidWeek: null,
            annualPaidMonth: null,
            annualPaidYear: null,
          }
        );

        return;
      }

    }


    // =======================================================
    // DÍVIDAS NORMAIS
    // =======================================================
    //
    // Para todas as outras dívidas, mantém exatamente
    // o comportamento que já existia.
    //
    // =======================================================

    updateDebt(
      debt.id,
      {
        status: newStatus,
      }
    );

  };


  // =========================================================
  // ABRIR EDIÇÃO
  // =========================================================

  const handleEdit = () => {

    if (typeof onEdit !== "function") {
      return;
    }

    onEdit(debt);

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0B1D39] p-5 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-xl font-bold text-white break-words pr-3">
            {debt.name || "Dívida"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl leading-none shrink-0"
          >
            ×
          </button>

        </div>


        {/* ================================================= */}
        {/* DESCRIÇÃO */}
        {/* ================================================= */}

        <div className="mb-5">

          <p className="text-xs text-gray-400 mb-2">
            Descrição
          </p>


          {debt.description ? (

            <div className="w-full min-h-[90px] max-h-[180px] overflow-y-auto rounded-xl bg-white/10 border border-white/10 p-3">

              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                {debt.description}
              </p>

            </div>

          ) : (

            <p className="text-gray-400 text-sm italic">
              Não há descrição.
            </p>

          )}

        </div>


        {/* ================================================= */}
        {/* DATA */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>

            <p className="text-xs text-gray-400 mb-1">
              Data
            </p>

            <p className="text-white font-medium">
              {formatDate(debt.dueDate)}
            </p>

          </div>


          <div>

            <p className="text-xs text-gray-400 mb-1">
              Dia da semana
            </p>

            <p className="text-white font-medium">
              {getDayOfWeek(debt.dueDate)}
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* VALOR */}
        {/* ================================================= */}

        <div className="mb-4">

          <p className="text-xs text-gray-400 mb-1">
            Valor
          </p>

          <p className="text-white font-bold text-xl">
            R$ {formatAmount(debt.amount)}
          </p>

        </div>


        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        <div className="mb-5">

          <p className="text-xs text-gray-400 mb-2">
            Status
          </p>

          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() =>
                handleStatusChange("a-vencer")
              }
              className={`py-2 rounded-lg border font-semibold transition ${
                debt.status === "a-vencer"
                  ? "bg-red-800 text-white border-red-800"
                  : "bg-transparent text-gray-300 border-gray-500"
              }`}
            >
              A Vencer
            </button>


            <button
              type="button"
              onClick={() =>
                handleStatusChange("pagos")
              }
              className={`py-2 rounded-lg border font-semibold transition ${
                debt.status === "pagos"
                  ? "bg-green-500 text-black border-green-500"
                  : "bg-transparent text-gray-300 border-gray-500"
              }`}
            >
              Pagos
            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* RECORRÊNCIA */}
        {/* ================================================= */}

        <div className="mb-5">

          <p className="text-xs text-gray-400 mb-1">
            Recorrência
          </p>

          <p className="text-white font-medium">
            {getRecurrenceType()}
          </p>


          {debt.recurring &&
            debt.recurrenceType === "annual" && (
              <p className="text-gray-300 text-sm mt-2">
                Meses: {getAnnualMonths()}
              </p>
            )}


          {debt.recurring &&
            debt.recurrenceType !== "annual" &&
            debt.recurrenceLimit != null && (
              <p className="text-gray-300 text-sm mt-2">
                Quantidade:{" "}
                {debt.recurrenceLimit}
              </p>
            )}


          {debt.recurring &&
            debt.recurrenceNumber != null && (
              <p className="text-gray-300 text-sm mt-1">
                Número atual:{" "}
                {debt.recurrenceNumber}
              </p>
            )}

        </div>


        {/* ================================================= */}
        {/* BOTÃO EDITAR */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={handleEdit}
          className="w-full mb-3 py-3 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
        >

          <span className="text-lg">
            ✏️
          </span>

          Editar Dívida

        </button>


        {/* ================================================= */}
        {/* BOTÃO FECHAR */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
        >
          Fechar
        </button>

      </div>

    </div>

  );

}