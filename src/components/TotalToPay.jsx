import { useDebts } from "../context/useDebts";

import {
  getWeekOfMonth,
  getYearFromDate,
  getMonthFromDate,
} from "../utils/dateUtils";


export default function TotalToPay({
  selectedPeriod,
  includeAnnualInTotal = false,
}) {

  const { debts, totalAVencer } =
    useDebts();


  // =========================================================
  // CALCULAR TOTAL DA SEMANA SELECIONADA
  // =========================================================

  let total =
    totalAVencer;


  if (selectedPeriod) {

    // =======================================================
    // DÍVIDAS NORMAIS DA SEMANA
    // =======================================================

    total = debts

      .filter((debt) => {

        // -----------------------------------------------------
        // SOMENTE DÍVIDAS A VENCER
        // -----------------------------------------------------

        if (
          debt.status !== "a-vencer"
        ) {

          return false;

        }


        // -----------------------------------------------------
        // DÍVIDAS ANUAIS
        // -----------------------------------------------------
        //
        // As dívidas anuais são calculadas separadamente
        // mais abaixo, caso o usuário escolha incluí-las
        // no Total a Vencer.
        //
        // -----------------------------------------------------

        if (
          debt.recurring === true &&
          debt.recurrenceType === "annual"
        ) {

          return false;

        }


        // -----------------------------------------------------
        // DÍVIDAS SEM DATA
        // -----------------------------------------------------

        if (!debt.dueDate) {

          return false;

        }


        // -----------------------------------------------------
        // ANO DA DÍVIDA
        // -----------------------------------------------------

        const debtYear =
          getYearFromDate(
            debt.dueDate
          );


        // -----------------------------------------------------
        // MÊS DA DÍVIDA
        // -----------------------------------------------------

        const debtMonth =
          getMonthFromDate(
            debt.dueDate
          );


        // -----------------------------------------------------
        // SEMANA DA DÍVIDA
        // -----------------------------------------------------

        const debtWeek =
          getWeekOfMonth(
            debt.dueDate
          );


        // -----------------------------------------------------
        // VERIFICAR PERÍODO
        // -----------------------------------------------------

        return (

          debtYear ===
            selectedPeriod.year &&

          debtMonth ===
            selectedPeriod.month &&

          debtWeek ===
            selectedPeriod.week

        );

      })


      // -----------------------------------------------------
      // SOMAR VALORES
      // -----------------------------------------------------

      .reduce(

        (sum, debt) =>

          sum +
          Number(
            debt.amount || 0
          ),

        0

      );


    // =======================================================
    // SOMAR DÍVIDAS ANUAIS
    // =======================================================
    //
    // Só entra aqui quando o usuário ativar:
    //
    // "Somar no total a vencer"
    //
    // =======================================================

    if (
      includeAnnualInTotal
    ) {

      const annualTotal =
        debts

          .filter((debt) => {

            // -------------------------------------------------
            // PRECISA SER RECORRENTE ANUAL
            // -------------------------------------------------

            if (
              debt.recurring !== true ||
              debt.recurrenceType !== "annual"
            ) {

              return false;

            }


            // -------------------------------------------------
            // PRECISA ESTAR A VENCER
            // -------------------------------------------------

            if (
              debt.status !== "a-vencer"
            ) {

              return false;

            }


            // -------------------------------------------------
            // VERIFICAR MÊS E ANO DA RECORRÊNCIA
            // -------------------------------------------------

            let matchesCurrentMonth =
              false;


            if (
              debt.recurrenceMonth != null &&
              debt.recurrenceYear != null
            ) {

              matchesCurrentMonth =
                Number(
                  debt.recurrenceMonth
                ) ===
                  Number(
                    selectedPeriod.month
                  ) &&

                Number(
                  debt.recurrenceYear
                ) ===
                  Number(
                    selectedPeriod.year
                  );

            }


            // -------------------------------------------------
            // COMPATIBILIDADE COM DADOS ANTIGOS
            // -------------------------------------------------

            if (
              !matchesCurrentMonth &&
              debt.dueDate
            ) {

              const debtYear =
                getYearFromDate(
                  debt.dueDate
                );


              const debtMonth =
                getMonthFromDate(
                  debt.dueDate
                );


              matchesCurrentMonth =
                debtYear ===
                  selectedPeriod.year &&

                debtMonth ===
                  selectedPeriod.month;

            }


            if (
              !matchesCurrentMonth
            ) {

              return false;

            }


            // -------------------------------------------------
            // SE JÁ FOI PAGA, NÃO SOMA
            // -------------------------------------------------
            //
            // Normalmente uma dívida paga já terá status
            // "pagos", mas deixamos essa proteção aqui também.
            //
            // -------------------------------------------------

            if (
              debt.annualPaidWeek != null
            ) {

              return false;

            }


            return true;

          })


          .reduce(

            (sum, debt) =>

              sum +
              Number(
                debt.amount || 0
              ),

            0

          );


      // -------------------------------------------------------
      // ADICIONAR O TOTAL ANUAL AO TOTAL DA SEMANA
      // -------------------------------------------------------

      total +=
        annualTotal;

    }

  }


  // =========================================================
  // FORMATAR VALOR
  // =========================================================

  const formattedValue =
    total.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="mx-5 mt-5 p-6 rounded-2xl bg-gradient-to-r from-[#10284D] to-[#0B1D39]">

      <p className="text-sm text-zinc-300 mb-1">
        Total a vencer:
      </p>

      <h2 className="text-3xl font-bold text-white">
        {formattedValue}
      </h2>

    </div>

  );

}