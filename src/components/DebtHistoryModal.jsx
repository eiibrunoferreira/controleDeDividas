// src/components/DebtHistoryModal.jsx

import { useEffect, useState } from "react";

export default function DebtHistoryModal({
  visible,
  debt,
  debts,
  onClose,
}) {
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    setHistoryOpen(false);
  }, [debt]);

  if (!visible || !debt) {
    return null;
  }

  // Formata o valor para o padrão brasileiro
  const formatAmount = (value) => {
    if (value == null) {
      return "0,00";
    }

    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formata a data para DD/MM/AAAA
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Sem data";
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return dateString;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Pega o dia da dívida
  const getDueDay = () => {
    if (!debt.dueDate) {
      return null;
    }

    const parts = debt.dueDate.split("-");

    if (parts.length !== 3) {
      return null;
    }

    return Number(parts[2]);
  };

  // Descobre o dia da semana
  const getDayOfWeek = () => {
    if (!debt.dueDate) {
      return null;
    }

    const date = new Date(
      `${debt.dueDate}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const days = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];

    return days[date.getDay()];
  };

  // =========================================================
  // TEXTO DO VENCIMENTO
  // =========================================================
  //
  // Dívida única:
  // Vencimento
  // Dia 25
  //
  // Semanal:
  // Vencimento
  // Toda quarta-feira
  //
  // Mensal:
  // Vencimento
  // Todo dia 30
  //
  // Anual:
  // Vencimento
  // Dia 15
  // =========================================================

  const getDueText = () => {
    // Dívida única
    if (!debt.recurring) {
      const day = getDueDay();

      if (day) {
        return `Dia ${day}`;
      }

      return "Sem data";
    }

    // Dívida semanal
    if (debt.recurrenceType === "weekly") {
      const dayOfWeek = getDayOfWeek();

      if (dayOfWeek) {
        return `Toda ${dayOfWeek}`;
      }

      return "Semanal";
    }

    // Dívida mensal
    if (debt.recurrenceType === "monthly") {
      const day = getDueDay();

      if (day) {
        return `Todo dia ${day}`;
      }

      return "Mensal";
    }

    // Dívida anual
    if (debt.recurrenceType === "annual") {
      const day = getDueDay();

      if (day) {
        return `Dia ${day}`;
      }

      return "Anual";
    }

    // Dívidas antigas que não possuem
    // recurrenceType definido são tratadas
    // como mensais.
    const day = getDueDay();

    if (day) {
      return `Todo dia ${day}`;
    }

    return "Mensal";
  };

  // Verifica se a dívida possui quantidade limitada de parcelas
  const hasRecurrenceLimit =
    debt.recurring === true &&
    debt.recurrenceLimit != null;

  const recurrenceLimit = hasRecurrenceLimit
    ? Number(debt.recurrenceLimit)
    : null;

  // Texto da recorrência
  const getRecurrenceText = () => {
    if (!debt.recurring) {
      return "Não recorrente";
    }

    let recurrenceName = "";

    // Recorrência semanal
    if (debt.recurrenceType === "weekly") {
      recurrenceName = "Semanal";
    }

    // Recorrência anual
    else if (debt.recurrenceType === "annual") {
      recurrenceName = "Anual";
    }

    // Recorrência mensal
    else {
      recurrenceName = "Mensal";
    }

    // Se tiver quantidade limitada de parcelas,
    // mostra também qual parcela está atualmente.
    if (
      hasRecurrenceLimit &&
      recurrenceLimit > 0
    ) {
      const currentNumber = Number(
        debt.recurrenceNumber || 1
      );

      return `${recurrenceName} — Parcela ${currentNumber}/${recurrenceLimit}`;
    }

    return recurrenceName;
  };

  // Busca todas as ocorrências da mesma família de recorrência
  const getExistingHistory = () => {
    if (debt.recurring !== true) {
      return [debt];
    }

    if (!debt.recurrenceGroupId) {
      return [debt];
    }

    const history = (debts || []).filter(
      (item) =>
        item.recurring === true &&
        item.recurrenceGroupId ===
          debt.recurrenceGroupId
    );

    return [...history].sort((a, b) => {
      const numberA = Number(
        a.recurrenceNumber || 1
      );

      const numberB = Number(
        b.recurrenceNumber || 1
      );

      return numberA - numberB;
    });
  };

  const existingHistory =
    getExistingHistory();

  // Procura uma parcela específica
  const findExistingInstallment = (
    installmentNumber
  ) => {
    return existingHistory.find(
      (item) =>
        Number(
          item.recurrenceNumber || 1
        ) === installmentNumber
    );
  };

  // Calcula uma data mensal futura
  const getMonthlyDate = (
    baseDate,
    installmentNumber
  ) => {
    if (!baseDate) {
      return null;
    }

    const parts = baseDate.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
      return null;
    }

    const targetMonth =
      month -
      1 +
      (installmentNumber - 1);

    const targetYear =
      year +
      Math.floor(targetMonth / 12);

    const normalizedMonth =
      (targetMonth % 12) + 1;

    const daysInMonth =
      new Date(
        targetYear,
        normalizedMonth,
        0
      ).getDate();

    const finalDay = Math.min(
      day,
      daysInMonth
    );

    return (
      `${targetYear}-` +
      `${String(normalizedMonth).padStart(2, "0")}-` +
      `${String(finalDay).padStart(2, "0")}`
    );
  };

  // Calcula uma data semanal futura
  const getWeeklyDate = (
    baseDate,
    installmentNumber
  ) => {
    if (!baseDate) {
      return null;
    }

    const date = new Date(
      `${baseDate}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    date.setDate(
      date.getDate() +
        (installmentNumber - 1) * 7
    );

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Monta a lista completa das parcelas
  const getInstallments = () => {
    if (
      !hasRecurrenceLimit ||
      !recurrenceLimit ||
      recurrenceLimit < 1
    ) {
      return [];
    }

    const installments = [];

    // Encontra a primeira parcela para usar
    // como referência para calcular as próximas datas.
    const firstExisting =
      existingHistory.find(
        (item) =>
          Number(
            item.recurrenceNumber || 1
          ) === 1
      );

    const baseDate =
      firstExisting?.dueDate ||
      debt.dueDate;

    // Número da parcela que está sendo exibida.
    //
    // Exemplo:
    // dívida 3/5 -> currentNumber = 3
    const currentNumber = Number(
      debt.recurrenceNumber || 1
    );

    // Verifica se a parcela atual está paga.
    const currentDebtIsPaid =
      debt.status === "pagos";

    // Verifica se esta dívida representa
    // a última parcela da sequência.
    const isLastInstallment =
      currentNumber >=
      recurrenceLimit;

    for (
      let number = 1;
      number <= recurrenceLimit;
      number++
    ) {
      const existing =
        findExistingInstallment(
          number
        );

      let installmentStatus =
        "a-vencer";

      let installmentDate = null;

      let installmentAmount =
        debt.amount;

      // Se a parcela já existe no armazenamento,
      // usamos os dados reais dela.
      if (existing) {
        installmentDate =
          existing.dueDate;

        installmentAmount =
          existing.amount;

        installmentStatus =
          existing.status;
      } else {
        // Se ainda não existe, calculamos
        // apenas a data visualmente.

        if (
          debt.recurrenceType ===
          "weekly"
        ) {
          installmentDate =
            getWeeklyDate(
              baseDate,
              number
            );
        } else {
          installmentDate =
            getMonthlyDate(
              baseDate,
              number
            );
        }
      }

      // =========================================================
      // REGRA DO HISTÓRICO
      // =========================================================
      //
      // Exemplo 3/5:
      //
      // 1 -> PAGO
      // 2 -> PAGO
      // 3 -> EM ABERTO
      // 4 -> EM ABERTO
      // 5 -> EM ABERTO
      //
      // Se a parcela atual estiver paga:
      //
      // 3/5:
      //
      // 1 -> PAGO
      // 2 -> PAGO
      // 3 -> PAGO
      // 4 -> EM ABERTO
      // 5 -> EM ABERTO
      //
      // Se for 5/5 e estiver paga:
      //
      // Todas -> PAGO
      // =========================================================

      // Todas as parcelas anteriores à atual
      // são consideradas pagas.
      if (number < currentNumber) {
        installmentStatus = "pagos";
      }

      // A parcela atual só fica paga se
      // o próprio registro estiver pago.
      if (
        number === currentNumber &&
        currentDebtIsPaid
      ) {
        installmentStatus = "pagos";
      }

      // Se for a última parcela e ela estiver paga,
      // toda a sequência fica paga.
      if (
        isLastInstallment &&
        currentDebtIsPaid
      ) {
        installmentStatus = "pagos";
      }

      installments.push({
        number,
        dueDate: installmentDate,
        amount: installmentAmount,
        status: installmentStatus,
        exists: Boolean(existing),
        id:
          existing?.id ||
          `future-${debt.id}-${number}`,
      });
    }

    return installments;
  };

  const installments =
    getInstallments();

  const hasInstallmentHistory =
    hasRecurrenceLimit &&
    recurrenceLimit > 0;

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
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Descrição */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-2">
            Descrição
          </p>

          {debt.description ? (
            <div className="w-full min-h-[70px] max-h-[160px] overflow-y-auto rounded-xl bg-white/10 border border-white/10 p-3">
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

        {/* Valor */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">
            Valor
          </p>

          <p className="text-white font-bold text-xl">
            R$ {formatAmount(debt.amount)}
          </p>
        </div>

        {/* Recorrência */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">
            Recorrência
          </p>

          <p className="text-white font-medium">
            {getRecurrenceText()}
          </p>
        </div>

        {/* Vencimento */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">
            Vencimento
          </p>

          <p className="text-white font-medium">
            {getDueText()}
          </p>
        </div>

        {/* PARCELAS */}
        {hasInstallmentHistory && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() =>
                setHistoryOpen(
                  (current) =>
                    !current
                )
              }
              className="w-full flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-white font-semibold hover:bg-white/20 transition"
            >
              <span>
                Parcelas
              </span>

              <span className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-normal">
                  {debt.recurrenceNumber || 1}/
                  {recurrenceLimit}
                </span>

                <span
                  className={`text-xl transition-transform duration-200 ${
                    historyOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ⌄
                </span>
              </span>
            </button>

            {/* Lista das parcelas */}
            {historyOpen && (
              <div className="mt-3 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {installments.map(
                  (installment) => {
                    const isPaid =
                      installment.status ===
                      "pagos";

                    return (
                      <div
                        key={
                          installment.id
                        }
                        className="rounded-xl bg-white/5 border border-white/10 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm">
                              Parcela{" "}
                              {installment.number}/
                              {recurrenceLimit}
                            </p>

                            <p className="text-gray-400 text-xs mt-1">
                              {formatDate(
                                installment.dueDate
                              )}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p
                              className={`text-sm font-bold ${
                                isPaid
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {isPaid
                                ? "PAGO"
                                : "EM ABERTO"}
                            </p>

                            <p className="text-white text-sm font-semibold mt-1">
                              R${" "}
                              {formatAmount(
                                installment.amount
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}

        {/* Fechar */}
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