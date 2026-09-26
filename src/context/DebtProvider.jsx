import {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { DebtContext } from "./DebtContext";

export function DebtProvider({ children }) {

  const [debts, setDebts] = useState([]);

  const loadDebts = useCallback(async () => {

  const token =
    localStorage.getItem("@auth_token");

  if (!token) {

    setDebts([]);

    return;

  }

  try {

    const response =
      await fetch(
        "https://controlededividas.onrender.com/debts",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      console.error(
        data.error ||
        "Erro ao carregar as dívidas."
      );

      return;

    }

    setDebts(data);

  } catch (error) {

    console.error(
      "Erro ao carregar as dívidas:",
      error
    );

  }

}, []);


useEffect(() => {

  loadDebts();

}, []);


  // =========================================================
  // SALVAR NO LOCALSTORAGE
  // =========================================================

  const persist = (updated) => {

    window.localStorage.setItem(
      "@debts",
      JSON.stringify(updated)
    );

    return updated;

  };


  // =========================================================
  // CRIAR ID DA FAMÍLIA DA RECORRÊNCIA
  // =========================================================

  const createRecurrenceGroupId = () => {

    return (
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`
    );

  };


  // =========================================================
  // ADICIONAR DÍVIDA
  // =========================================================

  const addDebt = (newDebt) => {

    setDebts((prev) => {

      const recurrenceGroupId =
        newDebt.recurring === true
          ? newDebt.recurrenceGroupId ||
            createRecurrenceGroupId()
          : null;


      const debt = {

        ...newDebt,

        id:
  newDebt.id ||
  String(
    Date.now()
  ),

        recurrenceGroupId,

        /*
          Para recorrências anuais,
          guardamos o ano do mês selecionado.

          Se não vier informado,
          usamos o ano atual.
        */

        recurrenceYear:
          newDebt.recurring === true &&
          newDebt.recurrenceType === "annual"
            ? newDebt.recurrenceYear ??
              new Date().getFullYear()
            : null,

        /*
          Enquanto uma ocorrência anual
          ainda não foi paga, a semana é nula.
        */

        annualPaidWeek:
          newDebt.recurring === true &&
          newDebt.recurrenceType === "annual"
            ? null
            : null,

        annualPaidMonth:
          newDebt.recurring === true &&
          newDebt.recurrenceType === "annual"
            ? null
            : null,

        annualPaidYear:
          newDebt.recurring === true &&
          newDebt.recurrenceType === "annual"
            ? null
            : null,

      };


      const updated = [

        ...prev,

        debt

      ];


      return persist(
        updated
      );

    });

  };


  // =========================================================
  // CALCULAR PRÓXIMA DATA MENSAL POR DATA
  // =========================================================

  const getNextMonthlyDate = (
    dateString
  ) => {

    if (!dateString) {
      return null;
    }


    const [year, month, day] =
      dateString
        .split("-")
        .map(Number);


    if (
      !year ||
      !month ||
      !day
    ) {
      return null;
    }


    const nextDate =
      new Date(
        year,
        month,
        1
      );


    const daysInNextMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    const nextDay =
      Math.min(
        day,
        daysInNextMonth
      );


    nextDate.setDate(
      nextDay
    );


    const nextYear =
      nextDate.getFullYear();


    const nextMonth =
      String(
        nextDate.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const formattedDay =
      String(
        nextDate.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${nextYear}-${nextMonth}-${formattedDay}`;

  };


  // =========================================================
  // CALCULAR NÚMERO DA OCORRÊNCIA DO DIA DA SEMANA
  // =========================================================

  const getNthWeekdayOfMonth = (
    year,
    month,
    weekday,
    occurrence
  ) => {

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(weekday) ||
      !Number.isInteger(occurrence)
    ) {
      return null;
    }


    if (
      month < 1 ||
      month > 12 ||
      weekday < 0 ||
      weekday > 6 ||
      occurrence < 1 ||
      occurrence > 5
    ) {
      return null;
    }


    const firstDay =
      new Date(
        year,
        month - 1,
        1
      );


    const firstWeekday =
      firstDay.getDay();


    const day =
      1 +
      (
        (weekday - firstWeekday + 7) %
        7
      ) +
      (
        (occurrence - 1) * 7
      );


    const daysInMonth =
      new Date(
        year,
        month,
        0
      ).getDate();


    if (
      day > daysInMonth
    ) {
      return null;
    }


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    const formattedYear =
      date.getFullYear();


    const formattedMonth =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const formattedDay =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${formattedYear}-${formattedMonth}-${formattedDay}`;

  };


  // =========================================================
  // CALCULAR ÚLTIMA OCORRÊNCIA DO DIA DA SEMANA
  // =========================================================

  const getLastWeekdayOfMonth = (
    year,
    month,
    weekday
  ) => {

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(weekday)
    ) {
      return null;
    }


    if (
      month < 1 ||
      month > 12 ||
      weekday < 0 ||
      weekday > 6
    ) {
      return null;
    }


    const lastDay =
      new Date(
        year,
        month,
        0
      );


    const lastWeekday =
      lastDay.getDay();


    const difference =
      (
        lastWeekday -
        weekday +
        7
      ) % 7;


    const day =
      lastDay.getDate() -
      difference;


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    const formattedYear =
      date.getFullYear();


    const formattedMonth =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const formattedDay =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${formattedYear}-${formattedMonth}-${formattedDay}`;

  };


  // =========================================================
  // CALCULAR PRÓXIMA DATA MENSAL POR DIA DA SEMANA
  // =========================================================

  const getNextMonthlyWeekdayDate = (
  dateString
) => {

  if (!dateString) {
    return null;
  }


  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);


  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }


  const nextDate =
    new Date(
      year,
      month - 1,
      day
    );


  // Mensal por dia da semana =
  // uma cobrança a cada 4 semanas.

  nextDate.setDate(
    nextDate.getDate() + 28
  );


  const nextYear =
    nextDate.getFullYear();


  const nextMonth =
    String(
      nextDate.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const nextDay =
    String(
      nextDate.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${nextYear}-${nextMonth}-${nextDay}`;

};

  // =========================================================
// CALCULAR PRÓXIMA DATA SEMANAL PELO DIA DA SEMANA
// =========================================================

const getNextWeeklyDateFromWeekday = (
  weekday
) => {

  const selectedWeekday =
    Number(
      weekday
    );

  if (
    !Number.isInteger(
      selectedWeekday
    ) ||
    selectedWeekday < 0 ||
    selectedWeekday > 6
  ) {
    return null;
  }

  const today =
    new Date();

  const currentWeekday =
    today.getDay();

  let daysUntil =
    (
      selectedWeekday -
      currentWeekday +
      7
    ) % 7;

  if (
    daysUntil === 0
  ) {
    daysUntil = 7;
  }

  const nextDate =
    new Date(
      today
    );

  nextDate.setHours(
    12,
    0,
    0,
    0
  );

  nextDate.setDate(
    today.getDate() +
    daysUntil
  );

  const year =
    nextDate.getFullYear();

  const month =
    String(
      nextDate.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      nextDate.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

};

  // =========================================================
  // CALCULAR PRÓXIMA DATA SEMANAL
  // =========================================================

  const getNextWeeklyDate = (
    dateString
  ) => {

    if (!dateString) {
      return null;
    }


    const [year, month, day] =
      dateString
        .split("-")
        .map(Number);


    if (
      !year ||
      !month ||
      !day
    ) {
      return null;
    }


    const nextDate =
      new Date(
        year,
        month - 1,
        day
      );


    nextDate.setDate(
      nextDate.getDate() + 7
    );


    const nextYear =
      nextDate.getFullYear();


    const nextMonth =
      String(
        nextDate.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const formattedDay =
      String(
        nextDate.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${nextYear}-${nextMonth}-${formattedDay}`;

  };

  const getNextBiweeklyDate = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  if (!year || !month || !day) return null;

  const nextDate = new Date(
    year,
    month - 1,
    day
  );

  nextDate.setDate(
    nextDate.getDate() + 14
  );

  const nextYear =
    nextDate.getFullYear();

  const nextMonth =
    String(
      nextDate.getMonth() + 1
    ).padStart(2, "0");

  const nextDay =
    String(
      nextDate.getDate()
    ).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
};


  // =========================================================
  // CALCULAR PRÓXIMO MÊS DA RECORRÊNCIA ANUAL
  // =========================================================

  const getNextAnnualMonth = (
    currentMonth,
    recurrenceMonths
  ) => {

    if (
      !Array.isArray(
        recurrenceMonths
      ) ||
      recurrenceMonths.length === 0
    ) {
      return null;
    }


    const selectedMonths =
      recurrenceMonths

        .map(Number)

        .filter(
          (monthNumber) =>
            Number.isInteger(
              monthNumber
            ) &&
            monthNumber >= 1 &&
            monthNumber <= 12
        )

        .sort(
          (a, b) =>
            a - b
        );


    if (
      selectedMonths.length === 0
    ) {
      return null;
    }


    const current =
      Number(
        currentMonth
      );


    if (
      !current ||
      current < 1 ||
      current > 12
    ) {
      return null;
    }


    let nextMonth =
      selectedMonths.find(
        (month) =>
          month > current
      );


    let yearOffset = 0;


    if (!nextMonth) {

      nextMonth =
        selectedMonths[0];

      yearOffset = 1;

    }


    return {
      month: nextMonth,
      yearOffset,
    };

  };


  // =========================================================
  // ATUALIZAR DÍVIDA
  // =========================================================

    // =========================================================
  // ATUALIZAR DÍVIDA
  // =========================================================

    // =========================================================
  // ATUALIZAR DÍVIDA
  // =========================================================

  const updateDebt = async (
    id,
    updatedData
  ) => {

    const token =
  localStorage.getItem("@auth_token") ||
  sessionStorage.getItem("@auth_token");

    if (!token) {

      console.error(
        "Usuário não autenticado."
      );

      return;

    }


    // =====================================================
    // LOCALIZAR DÍVIDA ORIGINAL
    // =====================================================

    const originalDebt =
      debts.find(
        (debt) =>
          debt.id === id
      );


    if (!originalDebt) {

      console.error(
        "Dívida não encontrada."
      );

      return;

    }


    // =====================================================
    // ATUALIZAR DADOS NO FRONTEND
    // =====================================================

    let updated =
      debts.map(
        (debt) => {

          if (
            debt.id !== id
          ) {
            return debt;
          }


          return {

            ...debt,

            ...updatedData,

          };

        }
      );


    let updatedDebt =
      updated.find(
        (debt) =>
          debt.id === id
      );


    // =====================================================
    // VERIFICAR SE MUDOU PARA PAGO
    // =====================================================

    const changedToPaid =
      originalDebt.status !== "pagos" &&
      updatedDebt.status === "pagos";


    // =====================================================
    // VERIFICAR SE VOLTOU DE PAGO
    // =====================================================

    const changedFromPaid =
      originalDebt.status === "pagos" &&
      updatedDebt.status !== "pagos";


    // =====================================================
    // REGISTRAR SEMANA DA DÍVIDA ANUAL
    // =====================================================

    if (
      changedToPaid &&
      updatedDebt.recurring === true &&
      updatedDebt.recurrenceType === "annual"
    ) {

      updated =
        updated.map(
          (debt) => {

            if (
              debt.id !== id
            ) {
              return debt;
            }


            return {

              ...debt,

              annualPaidWeek:
                updatedData.annualPaidWeek ??
                null,

              annualPaidMonth:
                updatedData.annualPaidMonth ??
                debt.recurrenceMonth ??
                null,

              annualPaidYear:
                updatedData.annualPaidYear ??
                debt.recurrenceYear ??
                new Date().getFullYear(),

            };

          }
        );


      updatedDebt =
        updated.find(
          (debt) =>
            debt.id === id
        );

    }


    // =====================================================
    // GUARDAR DÍVIDAS FUTURAS QUE DEVEM SER REMOVIDAS
    // =====================================================

    let debtsToDeleteFromBackend = [];


    // =====================================================
    // SE VOLTOU DE PAGO
    // =====================================================

    if (
      changedFromPaid &&
      updatedDebt.recurring === true &&
      updatedDebt.recurrenceGroupId &&
      updatedDebt.recurrenceNumber != null
    ) {

      const currentNumber =
        Number(
          updatedDebt.recurrenceNumber
        );


      const groupId =
        updatedDebt.recurrenceGroupId;


      debtsToDeleteFromBackend =
        debts.filter(
          (debt) => {

            if (
              debt.id === id
            ) {
              return false;
            }


            if (
              debt.recurrenceGroupId !==
              groupId
            ) {
              return false;
            }


            const debtNumber =
              Number(
                debt.recurrenceNumber || 0
              );


            return (
              debtNumber >
              currentNumber
            );

          }
        );


      updated =
        updated.filter(
          (debt) => {

            if (
              debt.id === id
            ) {
              return true;
            }


            if (
              debt.recurrenceGroupId !==
              groupId
            ) {
              return true;
            }


            const debtNumber =
              Number(
                debt.recurrenceNumber || 0
              );


            if (
              debtNumber >
              currentNumber
            ) {
              return false;
            }


            return true;

          }
        );

    }


    // =====================================================
    // VERIFICAR SE DEVE CRIAR PRÓXIMA RECORRÊNCIA
    // =====================================================

    const shouldCreateNext =
  changedToPaid &&
  updatedDebt.recurring === true &&
  (
    updatedDebt.recurrenceType === "annual"
      ? updatedDebt.recurrenceMonth != null
      : updatedDebt.recurrenceType === "weekly"
        ? (
            Boolean(updatedDebt.dueDate) ||
            updatedDebt.recurrenceWeekday != null
          )
        : Boolean(updatedDebt.dueDate)
  );


    let nextDebt = null;


    if (
      shouldCreateNext
    ) {

      // ===================================================
      // TIPO DA RECORRÊNCIA
      // ===================================================

      const recurrenceType =
  updatedDebt.recurrenceType === "weekly"
    ? "weekly"
    : updatedDebt.recurrenceType === "biweekly"
      ? "biweekly"
      : updatedDebt.recurrenceType === "annual"
        ? "annual"
        : "monthly";


      // ===================================================
      // PARCELA ATUAL
      // ===================================================

      const currentNumber =
        Number(
          updatedDebt.recurrenceNumber || 1
        );


      // ===================================================
      // LIMITE
      // ===================================================

      const recurrenceLimit =
        recurrenceType === "annual"

          ? null

          : updatedDebt.recurrenceLimit != null

            ? Number(
                updatedDebt.recurrenceLimit
              )

            : null;


      // ===================================================
      // PRÓXIMA PARCELA
      // ===================================================

      const nextNumber =
        currentNumber + 1;


      const reachedLimit =
        recurrenceType !== "annual" &&
        recurrenceLimit !== null &&
        nextNumber > recurrenceLimit;


      if (
        !reachedLimit
      ) {

        // ===============================================
        // VARIÁVEIS
        // ===============================================

        let nextDueDate =
          null;


        let nextRecurrenceMonth =
          updatedDebt.recurrenceMonth ??
          null;


        let nextRecurrenceYear =
          updatedDebt.recurrenceYear ??
          new Date().getFullYear();


        // ===============================================
        // SEMANAL
        // ===============================================

        if (
  recurrenceType === "weekly"
) {

  if (
    updatedDebt.dueDate
  ) {

    nextDueDate =
      getNextWeeklyDate(
        updatedDebt.dueDate
      );

  } else {

    nextDueDate =
      getNextWeeklyDateFromWeekday(
        updatedDebt.recurrenceWeekday
      );

  }

}

// ===============================================
// QUINZENAL
// ===============================================

else if (
  recurrenceType === "biweekly"
) {

  nextDueDate =
    getNextBiweeklyDate(
      updatedDebt.dueDate
    );

}


        // ===============================================
        // ANUAL
        // ===============================================

        else if (
          recurrenceType === "annual"
        ) {

          const nextAnnual =
            getNextAnnualMonth(
              updatedDebt.recurrenceMonth,
              updatedDebt.recurrenceMonths
            );


          if (
            nextAnnual
          ) {

            nextRecurrenceMonth =
              nextAnnual.month;


            nextRecurrenceYear =
              Number(
                updatedDebt.recurrenceYear ??
                new Date().getFullYear()
              ) +
              nextAnnual.yearOffset;

          }

        }


        // ===============================================
        // MENSAL
        // ===============================================

        else {

          if (
            updatedDebt.monthlyDueMode ===
            "weekday"
          ) {

            nextDueDate =
              getNextMonthlyWeekdayDate(
                updatedDebt.dueDate,
                updatedDebt.monthlyWeekday,
                updatedDebt.monthlyWeekOccurrence
              );

          } else {

            nextDueDate =
              getNextMonthlyDate(
                updatedDebt.dueDate
              );

          }

        }


        // ===============================================
        // VALIDAR PRÓXIMA OCORRÊNCIA
        // ===============================================

        const canCreateNext =
          recurrenceType === "annual"
            ? nextRecurrenceMonth != null &&
              nextRecurrenceYear != null
            : Boolean(nextDueDate);


        if (
          canCreateNext
        ) {

          // =============================================
          // EVITAR DUPLICAÇÃO
          // =============================================

          const alreadyExists =
            recurrenceType === "annual"

              ? updated.some(
                  (debt) =>

                    debt.id !== id &&

                    debt.recurring === true &&

                    debt.name ===
                      updatedDebt.name &&

                    debt.recurrenceGroupId ===
                      updatedDebt.recurrenceGroupId &&

                    Number(
                      debt.recurrenceMonth
                    ) ===
                      Number(
                        nextRecurrenceMonth
                      ) &&

                    Number(
                      debt.recurrenceYear
                    ) ===
                      Number(
                        nextRecurrenceYear
                      )
                )

              : updated.some(
                  (debt) =>

                    debt.id !== id &&

                    debt.recurring === true &&

                    debt.name ===
                      updatedDebt.name &&

                    debt.dueDate ===
                      nextDueDate
                );


          if (
            !alreadyExists
          ) {

            // ===========================================
            // IDENTIFICADOR DA FAMÍLIA
            // ===========================================

            const recurrenceGroupId =
              updatedDebt.recurrenceGroupId ||
              createRecurrenceGroupId();


            // ===========================================
            // GARANTIR GRUPO NA DÍVIDA ATUAL
            // ===========================================

            updated =
              updated.map(
                (debt) => {

                  if (
                    debt.id !== id
                  ) {
                    return debt;
                  }


                  return {

                    ...debt,

                    recurrenceGroupId,

                  };

                }
              );


            updatedDebt =
              updated.find(
                (debt) =>
                  debt.id === id
              );


            // ===========================================
            // CRIAR PRÓXIMA DÍVIDA LOCAL
            // ===========================================

            nextDebt = {

              ...updatedDebt,


              // -----------------------------------------
              // ID TEMPORÁRIO
              // -----------------------------------------

              id:
                `${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,


              // -----------------------------------------
              // DATA
              // -----------------------------------------

              dueDate:
                recurrenceType === "annual"
                  ? null
                  : nextDueDate,


              // -----------------------------------------
              // STATUS
              // -----------------------------------------

              status:
                "a-vencer",


              // -----------------------------------------
              // RECORRÊNCIA
              // -----------------------------------------

              recurring:
                true,


              recurrenceType:
                recurrenceType,


              recurrenceLimit:
                recurrenceLimit,


              recurrenceNumber:
                nextNumber,


              recurrenceGroupId:
                recurrenceGroupId,


              // -----------------------------------------
              // MÊS E ANO ANUAL
              // -----------------------------------------

              recurrenceMonth:
                recurrenceType === "annual"
                  ? nextRecurrenceMonth
                  : null,


              recurrenceYear:
                recurrenceType === "annual"
                  ? nextRecurrenceYear
                  : null,


              recurrenceMonths:
                recurrenceType === "annual"
                  ? updatedDebt.recurrenceMonths
                  : updatedDebt.recurrenceMonths ?? null,


              // -----------------------------------------
              // NOVA OCORRÊNCIA NÃO PAGA
              // -----------------------------------------

              annualPaidWeek:
                recurrenceType === "annual"
                  ? null
                  : null,


              annualPaidMonth:
                recurrenceType === "annual"
                  ? null
                  : null,


              annualPaidYear:
                recurrenceType === "annual"
                  ? null
                  : null,

            };

          }

        }

      }

    }


    // =====================================================
    // ATUALIZAR DÍVIDA ATUAL NO BACKEND
    // =====================================================

    try {

      const currentBackendDebt =
        updated.find(
          (debt) =>
            debt.id === id
        );


      const updateResponse =
        await fetch(
          `https://controlededividas.onrender.com/debts/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                currentBackendDebt
              ),

          }
        );


      const updateData =
        await updateResponse.json();


      if (!updateResponse.ok) {

        console.error(
          updateData.error ||
          "Erro ao atualizar a dívida."
        );

        return;

      }


      // ===================================================
      // REMOVER OCORRÊNCIAS FUTURAS DO BACKEND
      // ===================================================

      for (
        const debtToDelete
        of debtsToDeleteFromBackend
      ) {

        const deleteResponse =
          await fetch(
            `https://controlededividas.onrender.com/debts/${debtToDelete.id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

            }
          );


        if (
          !deleteResponse.ok
        ) {

          const deleteData =
            await deleteResponse.json();


          console.error(
            deleteData.error ||
            "Erro ao excluir recorrência futura."
          );

        }

      }


      // ===================================================
      // CRIAR PRÓXIMA RECORRÊNCIA NO BACKEND
      // ===================================================

      let savedNextDebt = null;


      if (
        nextDebt
      ) {

        const nextResponse =
          await fetch(
            "https://controlededividas.onrender.com/debts",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  nextDebt
                ),

            }
          );


        const nextData =
          await nextResponse.json();


        if (!nextResponse.ok) {

          console.error(
            nextData.error ||
            "Erro ao criar a próxima recorrência."
          );

          return;

        }


        savedNextDebt =
          nextData;

      }


      // ===================================================
      // ATUALIZAR ESTADO FINAL
      // ===================================================

      updated =
        updated.map(
          (debt) => {

            if (
              debt.id === id
            ) {

              return updateData;

            }


            return debt;

          }
        );


      // ===================================================
      // ADICIONAR PRÓXIMA RECORRÊNCIA SALVA
      // ===================================================

      if (
        savedNextDebt
      ) {

        updated = [

          ...updated,

          savedNextDebt

        ];

      }


      // ===================================================
      // SALVAR ESTADO FINAL
      // ===================================================

      persist(
        updated
      );

      setDebts(
        updated
      );


    } catch (error) {

      console.error(
        "Erro ao atualizar a dívida:",
        error
      );

    }

  };

  // =========================================================
  // APAGAR DÍVIDA
  // =========================================================

    // =========================================================
  // APAGAR DÍVIDA
  // =========================================================

  const deleteDebt = async (
    id
  ) => {

    const token =
      localStorage.getItem("@auth_token");

    if (!token) {

      console.error(
        "Usuário não autenticado."
      );

      return;

    }


    try {

      const response =
        await fetch(
          `https://controlededividas.onrender.com/debts/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          data.error ||
          "Erro ao excluir a dívida."
        );

        return;

      }


      // =====================================================
      // REMOVER DO FRONTEND
      // =====================================================

      setDebts((prev) => {

        const debtToDelete =
          prev.find(
            (debt) =>
              debt.id === id
          );


        if (!debtToDelete) {

          return prev;

        }


        // ===================================================
        // DÍVIDA RECORRENTE
        // ===================================================

        if (
          debtToDelete.recurring === true &&
          debtToDelete.recurrenceGroupId &&
          debtToDelete.recurrenceNumber != null
        ) {

          const currentNumber =
            Number(
              debtToDelete.recurrenceNumber
            );


          const groupId =
            debtToDelete.recurrenceGroupId;


          const updated =
            prev.filter(
              (debt) => {

                if (
                  debt.recurrenceGroupId !==
                  groupId
                ) {

                  return true;

                }


                const debtNumber =
                  Number(
                    debt.recurrenceNumber || 0
                  );


                return (
                  debtNumber <
                  currentNumber
                );

              }
            );


          return persist(
            updated
          );

        }


        // ===================================================
        // DÍVIDA NORMAL
        // ===================================================

        const updated =
          prev.filter(
            (debt) =>
              debt.id !== id
          );


        return persist(
          updated
        );

      });


    } catch (error) {

      console.error(
        "Erro ao excluir a dívida:",
        error
      );

    }

  };


  // =========================================================
  // INICIAR NOVO MÊS
  // =========================================================

  const startNewMonth = () => {

    setDebts((prev) => {

      const updated =
        prev.map(
          (debt) => {

            if (
              debt.status === "pagos"
            ) {

              return {

                ...debt,

                status:
                  "dividas",

              };

            }


            return debt;

          }
        );


      return persist(
        updated
      );

    });

  };


  // =========================================================
  // TOTAL A VENCER
  // =========================================================

  const totalAVencer =
    useMemo(() => {

      return debts

        .filter(
          (debt) =>
            debt.status ===
            "a-vencer"
        )

        .reduce(
          (
            acc,
            debt
          ) =>

            acc +
            Number(
              debt.amount || 0
            ),

          0
        );

    }, [debts]);


  // =========================================================
  // CONTEXT
  // =========================================================

  return (

    <DebtContext.Provider
  value={{

    debts,

    addDebt,

    updateDebt,

    deleteDebt,

    totalAVencer,

    startNewMonth,

    loadDebts,

  }}
>

      {children}

    </DebtContext.Provider>

  );

}