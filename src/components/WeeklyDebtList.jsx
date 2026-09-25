import DebtCard from "./DebtCard";

import { useDebts } from "../context/useDebts";

import {
  getWeekOfMonth,
  getYearFromDate,
  getMonthFromDate,
} from "../utils/dateUtils";


export default function WeeklyDebtList({
  month,
  year,
  week,
  onOpenDebt,
  includeAnnualInTotal,
  setIncludeAnnualInTotal,
}) {

  const { debts } = useDebts();


  // =========================================================
  // NOMES DOS MESES
  // =========================================================

  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];


  // =========================================================
  // CALCULAR INTERVALO DA SEMANA
  // =========================================================

  const getWeekDateRange = (
    selectedMonth,
    selectedYear,
    selectedWeek
  ) => {

    const numericMonth =
      Number(selectedMonth);

    const numericYear =
      Number(selectedYear);

    const numericWeek =
      Number(selectedWeek);


    const firstDayOfMonth =
      new Date(
        numericYear,
        numericMonth - 1,
        1
      ).getDay();


    const daysInMonth =
      new Date(
        numericYear,
        numericMonth,
        0
      ).getDate();


    let startDay;


    if (numericWeek === 1) {

      startDay = 1;

    } else {

      startDay =
        8 -
        firstDayOfMonth +
        (numericWeek - 2) * 7;

    }


    const endDay =
      Math.min(
        startDay + 6,
        daysInMonth
      );


    return {
      startDay,
      endDay,
      monthName:
        months[numericMonth - 1],
    };

  };


  const weekDateRange =
    getWeekDateRange(
      month,
      year,
      week
    );


  // =========================================================
  // TODAS AS DÍVIDAS NORMAIS DA SEMANA
  // =========================================================
  //
  // IMPORTANTE:
  // Aqui NÃO filtramos mais somente "a-vencer".
  //
  // Assim uma dívida paga continua aparecendo
  // na semana em que ela foi paga.
  //
  // =========================================================

  const weeklyDebts = debts.filter((debt) => {

    // Dívidas anuais ficam separadas.
    if (
      debt.recurring === true &&
      debt.recurrenceType === "annual"
    ) {

      return false;

    }


    // Dívida sem data não pertence a uma semana.
    if (!debt.dueDate) {

      return false;

    }


    const debtYear =
      getYearFromDate(
        debt.dueDate
      );

    const debtMonth =
      getMonthFromDate(
        debt.dueDate
      );

    const debtWeek =
      getWeekOfMonth(
        debt.dueDate
      );


    return (
      debtYear === Number(year) &&
      debtMonth === Number(month) &&
      debtWeek === Number(week)
    );

  });


  // =========================================================
  // DÍVIDAS A VENCER
  // =========================================================

  const debtsToPay =
    weeklyDebts.filter(
      (debt) =>
        debt.status === "a-vencer"
    );


  // =========================================================
  // DÍVIDAS PAGAS
  // =========================================================

  const paidDebts =
    weeklyDebts.filter(
      (debt) =>
        debt.status === "pagos"
    );


  // =========================================================
  // DÍVIDAS ANUAIS
  // =========================================================

  const annualDebts = debts.filter((debt) => {

    if (
      debt.recurring !== true ||
      debt.recurrenceType !== "annual"
    ) {

      return false;

    }


    let debtMonth = null;

    let debtYear = null;


    // ---------------------------------------------------------
    // MÊS
    // ---------------------------------------------------------

    if (
      debt.recurrenceMonth != null
    ) {

      debtMonth =
        Number(
          debt.recurrenceMonth
        );

    } else if (
      debt.dueDate
    ) {

      debtMonth =
        getMonthFromDate(
          debt.dueDate
        );

    }


    // ---------------------------------------------------------
    // ANO
    // ---------------------------------------------------------

    if (
      debt.recurrenceYear != null
    ) {

      debtYear =
        Number(
          debt.recurrenceYear
        );

    } else if (
      debt.dueDate
    ) {

      debtYear =
        getYearFromDate(
          debt.dueDate
        );

    }


    if (
      debtMonth !== Number(month) ||
      debtYear !== Number(year)
    ) {

      return false;

    }


    // ---------------------------------------------------------
    // SE A DÍVIDA ANUAL JÁ FOI PAGA
    // ---------------------------------------------------------

    if (
      debt.annualPaidWeek != null
    ) {

      return (
        Number(debt.annualPaidWeek) === Number(week) &&
        Number(debt.annualPaidMonth) === Number(month) &&
        Number(debt.annualPaidYear) === Number(year)
      );

    }


    return true;

  });


  // =========================================================
  // ABRIR DETALHES
  // =========================================================

  const openDebt = (debt) => {

    if (!onOpenDebt) return;


    onOpenDebt({
      ...debt,

      selectedWeek:
        Number(week),

      selectedMonth:
        Number(month),

      selectedYear:
        Number(year),
    });

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <div className="mx-5 mt-5">


      {/* ===================================================== */}
      {/* CABEÇALHO DA SEMANA */}
      {/* ===================================================== */}

      <div className="mb-4">

        <h3 className="text-white text-lg font-bold">

          Semana {week}

        </h3>


        <p className="text-gray-400 text-sm mt-1">

          {String(
            weekDateRange.startDay
          ).padStart(2, "0")}

          {" de "}

          {weekDateRange.monthName}

          {" até "}

          {String(
            weekDateRange.endDay
          ).padStart(2, "0")}

          {" de "}

          {weekDateRange.monthName}

          {" de "}

          {year}

        </p>

      </div>


      {/* ===================================================== */}
      {/* DÍVIDAS A VENCER */}
      {/* ===================================================== */}

      {debtsToPay.length > 0 && (

        <div className="space-y-3 mb-6">

          {debtsToPay.map((debt) => (

            <div
              key={debt.id}
              onClick={() =>
                openDebt(debt)
              }
              className="cursor-pointer"
            >

              <DebtCard
                debt={debt}
              />

            </div>

          ))}

        </div>

      )}


      {/* ===================================================== */}
      {/* DÍVIDAS PAGAS */}
      {/* ===================================================== */}

      {paidDebts.length > 0 && (

        <div className="space-y-3 mb-6">

          {paidDebts.map((debt) => (

            <div
              key={debt.id}
              onClick={() =>
                openDebt(debt)
              }
              className="cursor-pointer"
            >

              <DebtCard
                debt={{
                  ...debt,

                  showPaidLabel: true,
                }}
              />

            </div>

          ))}

        </div>

      )}


      {/* ===================================================== */}
      {/* NENHUMA DÍVIDA */}
      {/* ===================================================== */}

      {debtsToPay.length === 0 &&
        paidDebts.length === 0 && (

        <p className="text-zinc-400 text-sm mb-5">

          Nenhuma dívida nesta semana.

        </p>

      )}


      {/* ===================================================== */}
      {/* DÍVIDAS ANUAIS */}
      {/* ===================================================== */}

      {annualDebts.length > 0 && (

        <div className="mt-6">


          {/* ================================================= */}
          {/* CABEÇALHO */}
          {/* ================================================= */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">

            <h3 className="text-white text-lg font-bold">

              Semana não definida

            </h3>


            <label className="flex items-center gap-2 text-gray-300 text-xs cursor-pointer">

              <input
                type="checkbox"
                checked={
                  includeAnnualInTotal
                }
                onChange={(event) =>
                  setIncludeAnnualInTotal(
                    event.target.checked
                  )
                }
                className="accent-green-500 w-4 h-4"
              />

              <span>
                Somar no total a vencer
              </span>

            </label>

          </div>


          {/* ================================================= */}
          {/* LISTA DAS ANUAIS */}
          {/* ================================================= */}

          <div className="space-y-3">

            {annualDebts.map((debt) => (

              <div
                key={debt.id}
                onClick={() =>
                  openDebt(debt)
                }
                className="cursor-pointer"
              >

                <DebtCard
                  debt={{
                    ...debt,
                    hideDate: true,
                  }}
                />

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  );

}