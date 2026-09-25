export default function DebtCard({
  debt,
  onPress,
}) {

  function getCircleColor() {

    if (debt.whiteCircle) {
      return "bg-white";
    }

    switch (debt.status) {

      case "pagos":
        return "bg-green-500";

      case "a-vencer":
        return "bg-red-700";

      case "dividas":
      default:
        return "bg-white";
    }
  }


  function getAmountColor() {

    switch (debt.status) {

      case "pagos":
        return "text-white";

      case "a-vencer":
        return "text-white";

      default:
        return "text-white";
    }
  }


  function getDueDay() {

    if (debt.dueDate) {

      const date =
        new Date(
          `${debt.dueDate}T00:00:00`
        );

      return date.getDate();
    }


    if (debt.dueDay) {
      return debt.dueDay;
    }


    return "-";
  }


  function getRecurrenceLabel() {

    if (
      debt.recurring !== true
    ) {
      return null;
    }


    const currentNumber =
      Number(
        debt.recurrenceNumber || 1
      );


    if (
      debt.recurrenceLimit != null
    ) {

      const limit =
        Number(
          debt.recurrenceLimit
        );


      if (
        limit > 0
      ) {

        return `${currentNumber}/${limit}`;
      }
    }


    return null;
  }


  const formatAmount = (value) => {

    if (value == null) {
      return "0,00";
    }


    const integerPart =
      Math.floor(value);


    const decimalPart =
      Math.round(
        (value - integerPart) * 100
      )
        .toString()
        .padStart(2, "0");


    const formattedInteger =
      integerPart
        .toString()
        .replace(
          /\B(?=(\d{3})+(?!\d))/g,
          "."
        );


    return `${formattedInteger},${decimalPart}`;
  };


  const circleColor =
    getCircleColor();


  const amountColor =
    getAmountColor();


  const textColor =
    circleColor === "bg-white"
      ? "text-black"
      : "text-white";


  const recurrenceLabel =
    getRecurrenceLabel();


  // =========================================================
  // MOSTRAR "PAGO"
  // =========================================================
  //
  // Somente dívidas anuais que foram realmente pagas
  // recebem essa indicação.
  //
  // As outras dívidas continuam exatamente como antes.
  //
  // =========================================================

  const showPaidLabel =
    debt.recurring === true &&
    debt.recurrenceType === "annual" &&
    debt.status === "pagos" &&
    debt.annualPaidWeek != null;


  return (

    <div
      onClick={() =>
        onPress && onPress(debt)
      }
      className="cursor-pointer bg-gradient-to-r from-[#0B1D39] to-[#10284D] p-4 rounded-lg mx-2 mb-3 flex justify-between items-center hover:brightness-90 transition-all"
    >

      <div className="flex items-center min-w-0">

        {!debt.hideDate && (

          <div
            className={`${circleColor} w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0`}
          >

            <span
              className={`${textColor} font-bold text-base`}
            >
              {getDueDay()}
            </span>

          </div>

        )}


        <div className="flex items-center gap-2 min-w-0">

          <p className="text-white font-semibold text-base break-words">
            {debt.name}
          </p>


          {recurrenceLabel && (

            <span
              className="text-gray-300 text-sm font-semibold whitespace-nowrap"
            >
              {recurrenceLabel}
            </span>

          )}


          {/* ================================================= */}
          {/* PAGO */}
          {/* ================================================= */}

          {showPaidLabel && (

            <span
              className="text-green-400 text-sm font-bold whitespace-nowrap"
            >
              PAGO
            </span>

          )}

        </div>

      </div>


      <span
        className={`${amountColor} font-bold text-base whitespace-nowrap ml-2`}
      >
        R$ {formatAmount(debt.amount)}
      </span>

    </div>

  );
}