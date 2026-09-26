import { useEffect, useState } from "react";

export default function EditDebtModal({
  visible,
  onClose,
  debt,
  updateDebt,
  deleteDebt,
}) {
  const [deleteConfirmVisible, setDeleteConfirmVisible] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    dueDate: "",
    amount: "",
    rawAmount: "",
    status: null,
    recurring: false,
    recurrenceType: "monthly",
    monthlyDueMode: "date",
    recurrenceWeekday: "",
    recurrenceMonths: [],
    hasRecurrenceLimit: false,
    recurrenceLimit: "",
    recurrenceNumber: 1,
    error: "",
    monthlyWeekOccurrence: "",
  });

  // =========================
  // DIAS DA SEMANA
  // =========================

  const weekdays = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ];

  // =========================
  // MESES
  // =========================

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  // =========================
  // BLOQUEIA O SCROLL
  // =========================

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // =========================
  // FORMATA VALOR
  // =========================

  function formatAmountFromCents(cents) {
    if (!cents) return "";

    const numberValue = parseInt(cents, 10);

    if (!Number.isFinite(numberValue)) {
      return "";
    }

    const integerPart = Math.floor(numberValue / 100);
    const decimalPart = numberValue % 100;

    const formattedInteger =
      integerPart.toLocaleString("pt-BR");

    return `${formattedInteger},${decimalPart
      .toString()
      .padStart(2, "0")}`;
  }

  // =========================
  // CARREGA A DÍVIDA
  // =========================

  useEffect(() => {
    if (!visible || !debt) return;

    const cents =
      debt.amount != null
        ? Math.round(debt.amount * 100).toString()
        : "";

    const recurring = debt.recurring === true;

    const recurrenceType =
  debt.recurrenceType === "weekly"
    ? "weekly"
    : debt.recurrenceType === "biweekly"
      ? "biweekly"
      : debt.recurrenceType === "annual"
        ? "annual"
        : "monthly";

    const monthlyDueMode =
      debt.monthlyDueMode === "weekday"
        ? "weekday"
        : "date";

    const recurrenceWeekday =
      debt.recurrenceWeekday != null
        ? String(debt.recurrenceWeekday)
        : "";

        const monthlyWeekOccurrence =
  debt.monthlyWeekOccurrence || "";

    const recurrenceMonths =
      recurrenceType === "annual" &&
      Array.isArray(debt.recurrenceMonths)
        ? debt.recurrenceMonths
        : [];

    const hasRecurrenceLimit =
      recurring &&
      recurrenceType !== "annual" &&
      debt.recurrenceLimit != null;

    const recurrenceLimit =
      hasRecurrenceLimit
        ? String(debt.recurrenceLimit)
        : "";

    requestAnimationFrame(() => {
      setForm({
        name: debt.name || "",
        description: debt.description || "",
        dueDate: debt.dueDate || "",
        amount: formatAmountFromCents(cents),
        rawAmount: cents,
        status:
          debt.status === "pagos"
            ? "pagos"
            : "a-vencer",
        recurring,
        recurrenceType,
        monthlyDueMode,
        recurrenceWeekday,
        recurrenceMonths,
        hasRecurrenceLimit,
        recurrenceLimit,
        recurrenceNumber: debt.recurrenceNumber || 1,
        error: "",
        monthlyWeekOccurrence,
      });
    });
  }, [visible, debt]);

  // =========================
  // RESETA O FORMULÁRIO
  // =========================

  function resetForm() {
    setForm({
      name: "",
      description: "",
      dueDate: "",
      amount: "",
      rawAmount: "",
      status: null,
      recurring: false,
      recurrenceType: "monthly",
      monthlyDueMode: "date",
      recurrenceWeekday: "",
      recurrenceMonths: [],
      hasRecurrenceLimit: false,
      recurrenceLimit: "",
      recurrenceNumber: 1,
      error: "",
      monthlyWeekOccurrence: "",
    });
  }

  // =========================
  // FECHAR
  // =========================

  function handleClose() {
    if (deleteConfirmVisible) return;

    resetForm();
    onClose();
  }

  // =========================
  // ALTERAR VALOR
  // =========================

  function handleAmountChange(value) {
    let numbers = value.replace(/\D/g, "");

    if (!numbers) {
      setForm((prev) => ({
        ...prev,
        amount: "",
        rawAmount: "",
        error: "",
      }));

      return;
    }

    numbers = numbers.padStart(3, "0");

    const integerPart = numbers.slice(0, -2);
    const decimalPart = numbers.slice(-2);

    const formattedInteger =
      Number(integerPart).toLocaleString("pt-BR");

    setForm((prev) => ({
      ...prev,
      amount: `${formattedInteger},${decimalPart}`,
      rawAmount: numbers,
      error: "",
    }));
  }

  // =========================
  // ALTERA RECORRÊNCIA
  // =========================

  function handleRecurringChange(value) {
    setForm((prev) => ({
      ...prev,
      recurring: value,
      error: "",
      ...(value
        ? {}
        : {
            recurrenceType: "monthly",
            monthlyDueMode: "date",
            recurrenceWeekday: "",
            recurrenceMonths: [],
            dueDate: "",
            hasRecurrenceLimit: false,
            recurrenceLimit: "",
          }),
    }));
  }

  // =========================
  // ALTERA TIPO DE RECORRÊNCIA
  // =========================

  function handleRecurrenceTypeChange(type) {
    setForm((prev) => ({
      ...prev,
      recurrenceType: type,
      monthlyDueMode:
        type === "monthly" ? "date" : prev.monthlyDueMode,
      recurrenceWeekday: "",
      dueDate:
        type === "weekly" || type === "annual"
          ? ""
          : prev.dueDate,
      recurrenceMonths:
        type === "annual"
          ? prev.recurrenceMonths
          : [],
      hasRecurrenceLimit: false,
      recurrenceLimit: "",
      error: "",
    }));
  }

  // =========================
  // ALTERA MODO MENSAL
  // =========================

  function handleMonthlyModeChange(mode) {
  setForm((prev) => ({
    ...prev,
    monthlyDueMode: mode,
    dueDate:
      mode === "date"
        ? prev.dueDate
        : prev.dueDate,
    recurrenceWeekday:
      mode === "date"
        ? ""
        : prev.recurrenceWeekday,
    error: "",
  }));
}

  // =========================
  // SELECIONA MÊS ANUAL
  // =========================

  function toggleRecurrenceMonth(month) {
    setForm((prev) => {
      if (prev.recurrenceMonths.includes(month)) {
        return {
          ...prev,
          recurrenceMonths:
            prev.recurrenceMonths.filter(
              (item) => item !== month
            ),
          error: "",
        };
      }

      return {
        ...prev,
        recurrenceMonths: [
          ...prev.recurrenceMonths,
          month,
        ].sort((a, b) => a - b),
        error: "",
      };
    });
  }

  // =========================
  // SALVAR ALTERAÇÕES
  // =========================

  function handleUpdate() {
    if (!debt) return;

    setForm((prev) => ({
      ...prev,
      error: "",
    }));

    // =========================
    // NOME
    // =========================

    if (!form.name.trim()) {
      setForm((prev) => ({
        ...prev,
        error: "Digite o nome da dívida.",
      }));

      return;
    }

    // =========================
    // VALOR
    // =========================

    if (!form.rawAmount) {
      setForm((prev) => ({
        ...prev,
        error: "Digite o valor da dívida.",
      }));

      return;
    }

    const numericAmount =
      Number(form.rawAmount) / 100;

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setForm((prev) => ({
        ...prev,
        error: "Digite um valor válido.",
      }));

      return;
    }

    // =========================
    // STATUS
    // =========================

    if (!form.status) {
      setForm((prev) => ({
        ...prev,
        error: "Escolha o status da dívida.",
      }));

      return;
    }

    // =========================
    // NÃO RECORRENTE
    // =========================

    if (!form.recurring) {
      if (!form.dueDate) {
        setForm((prev) => ({
          ...prev,
          error: "Informe a data de vencimento.",
        }));

        return;
      }
    }

    // =========================
    // RECORRENTE
    // =========================

    if (form.recurring) {
      if (!form.recurrenceType) {
        setForm((prev) => ({
          ...prev,
          error: "Escolha o tipo de recorrência.",
        }));

        return;
      }

      // =======================
      // MENSAL
      // =======================

      if (form.recurrenceType === "monthly") {
        if (!form.monthlyDueMode) {
          setForm((prev) => ({
            ...prev,
            error:
              "Escolha como a dívida será repetida.",
          }));

          return;
        }

        if (
          form.monthlyDueMode === "date" &&
          !form.dueDate
        ) {
          setForm((prev) => ({
            ...prev,
            error:
              "Informe o dia de vencimento.",
          }));

          return;
        }

        if (
          form.monthlyDueMode === "weekday" &&
          form.recurrenceWeekday === ""
        ) {
          setForm((prev) => ({
            ...prev,
            error: "Escolha o dia da semana.",
          }));

          return;
        }

        if (
  form.monthlyDueMode === "weekday" &&
  !form.dueDate
) {
  setForm((prev) => ({
    ...prev,
    error:
      "Informe a data do primeiro vencimento.",
  }));

  return;
}

if (
  form.monthlyDueMode === "weekday" &&
  form.dueDate &&
  form.recurrenceWeekday !== ""
) {
  const selectedDate =
    new Date(
      `${form.dueDate}T00:00:00`
    );

  if (
    Number.isNaN(
      selectedDate.getTime()
    )
  ) {
    setForm((prev) => ({
      ...prev,
      error:
        "Informe uma data válida.",
    }));

    return;
  }

  if (
    selectedDate.getDay() !==
    Number(form.recurrenceWeekday)
  ) {
    setForm((prev) => ({
      ...prev,
      error:
        "A data precisa cair no dia da semana selecionado.",
    }));

    return;
  }
}
      }

      // =======================
      // SEMANAL
      // =======================

      if (form.recurrenceType === "weekly") {
        if (form.recurrenceWeekday === "") {
          setForm((prev) => ({
            ...prev,
            error: "Escolha o dia da semana.",
          }));

          return;
        }
      }

      // =======================
// QUINZENAL
// =======================

if (
  form.recurrenceType === "biweekly"
) {
  if (
    form.recurrenceWeekday === ""
  ) {
    setForm((prev) => ({
      ...prev,
      error:
        "Escolha o dia da semana.",
    }));

    return;
  }

  if (!form.dueDate) {
    setForm((prev) => ({
      ...prev,
      error:
        "Informe a data do primeiro vencimento.",
    }));

    return;
  }

  const selectedDate =
    new Date(
      `${form.dueDate}T00:00:00`
    );

  if (
    Number.isNaN(
      selectedDate.getTime()
    )
  ) {
    setForm((prev) => ({
      ...prev,
      error:
        "Informe uma data válida.",
    }));

    return;
  }

  if (
    selectedDate.getDay() !==
    Number(
      form.recurrenceWeekday
    )
  ) {
    setForm((prev) => ({
      ...prev,
      error:
        "A data precisa cair no dia da semana selecionado.",
    }));

    return;
  }
}

      // =======================
      // ANUAL
      // =======================

      if (form.recurrenceType === "annual") {
        if (form.recurrenceMonths.length === 0) {
          setForm((prev) => ({
            ...prev,
            error: "Escolha pelo menos um mês.",
          }));

          return;
        }
      }
    }

    // =========================
    // LIMITE DE PARCELAS
    // =========================

    let finalRecurrenceLimit = null;

    if (
  form.recurring &&
  (
    form.recurrenceType === "monthly" ||
    form.recurrenceType === "weekly" ||
    form.recurrenceType === "biweekly"
  ) &&
  form.hasRecurrenceLimit
) {
      const limit =
        Number(form.recurrenceLimit);

      if (
        !Number.isInteger(limit) ||
        limit <= 0
      ) {
        setForm((prev) => ({
          ...prev,
          error:
            "Informe uma quantidade válida de parcelas.",
        }));

        return;
      }

      finalRecurrenceLimit = limit;
    }

    // =========================
    // DATA FINAL
    // =========================

    const finalDueDate =
  !form.recurring ||
  (
    form.recurring &&
    form.recurrenceType === "monthly" &&
    (
      form.monthlyDueMode === "date" ||
      form.monthlyDueMode === "weekday"
    )
  ) ||
  (
    form.recurring &&
    (
      form.recurrenceType === "biweekly"
    )
  )
    ? form.dueDate || null
    : null;

    // =========================
    // ATUALIZA A DÍVIDA
    // =========================

    updateDebt(debt.id, {
      name: form.name.trim(),

      description:
        form.description.trim(),

      dueDate: finalDueDate,

      amount: numericAmount,

      status: form.status,

      recurring: form.recurring,

      recurrenceType:
        form.recurring
          ? form.recurrenceType
          : null,

      monthlyDueMode:
        form.recurring &&
        form.recurrenceType === "monthly"
          ? form.monthlyDueMode
          : null,

      recurrenceWeekday:
  form.recurring &&
  (
    form.recurrenceType === "weekly" ||
    form.recurrenceType === "biweekly" ||
    (
      form.recurrenceType === "monthly" &&
      form.monthlyDueMode === "weekday"
    )
  )
    ? Number(form.recurrenceWeekday)
    : null,

          monthlyWeekday:
  form.recurring &&
  form.recurrenceType === "monthly" &&
  form.monthlyDueMode === "weekday"
    ? Number(form.recurrenceWeekday)
    : null,

monthlyWeekOccurrence:
  form.recurring &&
  form.recurrenceType === "monthly" &&
  form.monthlyDueMode === "weekday"
    ? form.monthlyWeekOccurrence || null
    : null,

      recurrenceLimit:
        form.recurring &&
        form.recurrenceType !== "annual"
          ? finalRecurrenceLimit
          : null,

      recurrenceNumber:
        form.recurring
          ? form.recurrenceNumber
          : null,

      recurrenceMonths:
        form.recurring &&
        form.recurrenceType === "annual"
          ? form.recurrenceMonths
          : null,

      recurrenceMonth:
        form.recurring &&
        form.recurrenceType === "annual" &&
        form.recurrenceMonths.length > 0
          ? form.recurrenceMonths[0]
          : null,
    });

    resetForm();
    onClose();
  }

  // =========================
  // APAGAR
  // =========================

  function handleDelete() {
    setDeleteConfirmVisible(true);
  }

  function cancelDelete() {
    setDeleteConfirmVisible(false);
  }

  function confirmDelete() {
    if (!debt) return;

    deleteDebt(debt.id);

    setDeleteConfirmVisible(false);

    resetForm();

    onClose();
  }

  // =========================
  // NÃO MOSTRA
  // =========================

  if (!visible) return null;

  // =========================
  // MODAL
  // =========================

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0B1D39] rounded-2xl shadow-2xl border border-[#1E3558]">

          {/* CABEÇALHO */}

          <div className="flex items-center justify-between px-5 py-4 border-b border-[#243B5D]">
            <h2 className="text-white text-xl font-bold">
              Editar dívida
            </h2>

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-300 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* FORMULÁRIO */}

          <div className="p-5 space-y-4">

            {/* NOME */}

            <div>
              <label className="block text-white text-sm font-semibold mb-1">
                Nome da dívida
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                    error: "",
                  }))
                }
                placeholder="Ex: Internet"
                className="w-full bg-[#10284D] text-white placeholder-gray-400 border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
              />
            </div>

            {/* DESCRIÇÃO */}

            <div>
              <label className="block text-white text-sm font-semibold mb-1">
                Descrição
                <span className="text-gray-400 font-normal">
                  {" "} (opcional)
                </span>
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description:
                      e.target.value,
                    error: "",
                  }))
                }
                placeholder="Ex: Internet de casa"
                rows={2}
                className="w-full bg-[#10284D] text-white placeholder-gray-400 border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400 resize-none"
              />
            </div>

            {/* RECORRENTE? */}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Dívida recorrente?
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    handleRecurringChange(false)
                  }
                  className={`py-3 rounded-xl font-semibold transition ${
                    !form.recurring
                      ? "bg-red-700 text-white"
                      : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                  }`}
                >
                  Não
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleRecurringChange(true)
                  }
                  className={`py-3 rounded-xl font-semibold transition ${
                    form.recurring
                      ? "bg-orange-600 text-white"
                      : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                  }`}
                >
                  Sim
                </button>

              </div>
            </div>

            {/* NÃO RECORRENTE */}

            {!form.recurring && (
              <div>
                <label className="block text-white text-sm font-semibold mb-1">
                  Data de vencimento
                </label>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dueDate:
                        e.target.value,
                      error: "",
                    }))
                  }
                  className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                />
              </div>
            )}

            {/* RECORRENTE */}

            {form.recurring && (
              <>
                {/* TIPO */}

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Tipo de recorrência
                  </label>

                  <div className="grid grid-cols-4 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleRecurrenceTypeChange(
                          "monthly"
                        )
                      }
                      className={`py-3 rounded-xl text-sm font-semibold ${
                        form.recurrenceType ===
                        "monthly"
                          ? "bg-orange-600 text-white"
                          : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                      }`}
                    >
                      Mensal
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRecurrenceTypeChange(
                          "weekly"
                        )
                      }
                      className={`py-3 rounded-xl text-sm font-semibold ${
                        form.recurrenceType ===
                        "weekly"
                          ? "bg-orange-600 text-white"
                          : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                      }`}
                    >
                      Semanal
                    </button>

<button
  type="button"
  onClick={() =>
    handleRecurrenceTypeChange(
      "biweekly"
    )
  }
  className={`py-3 rounded-xl text-sm font-semibold ${
    form.recurrenceType ===
    "biweekly"
      ? "bg-orange-600 text-white"
      : "bg-[#10284D] text-gray-300 border border-[#29466D]"
  }`}
>
  Quinzenal
</button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRecurrenceTypeChange(
                          "annual"
                        )
                      }
                      className={`py-3 rounded-xl text-sm font-semibold ${
                        form.recurrenceType ===
                        "annual"
                          ? "bg-orange-600 text-white"
                          : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                      }`}
                    >
                      Anual
                    </button>

                  </div>
                </div>

                {/* MENSAL */}

                {form.recurrenceType ===
                  "monthly" && (
                  <div className="space-y-3">

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Como deve repetir?
                      </label>

                      <div className="grid grid-cols-2 gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleMonthlyModeChange(
                              "date"
                            )
                          }
                          className={`py-3 rounded-xl text-sm font-semibold ${
                            form.monthlyDueMode ===
                            "date"
                              ? "bg-blue-600 text-white"
                              : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                          }`}
                        >
                          Por dia
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleMonthlyModeChange(
                              "weekday"
                            )
                          }
                          className={`py-3 rounded-xl text-sm font-semibold ${
                            form.monthlyDueMode ===
                            "weekday"
                              ? "bg-blue-600 text-white"
                              : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                          }`}
                        >
                          Por dia da semana
                        </button>

                      </div>
                    </div>

                    {/* MENSAL POR DATA */}

                    {form.monthlyDueMode ===
                      "date" && (
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Data do primeiro vencimento
                        </label>

                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              dueDate:
                                e.target.value,
                              error: "",
                            }))
                          }
                          className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                        />

                        <p className="text-gray-400 text-xs mt-1">
                          A dívida será repetida pelo mesmo dia de cada mês.
                        </p>
                      </div>
                    )}

                    {/* MENSAL POR DIA DA SEMANA */}

                    {form.monthlyDueMode ===
                      "weekday" && (
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Dia da semana
                        </label>

                        <select
                          value={
                            form.recurrenceWeekday
                          }
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              recurrenceWeekday:
                                e.target.value,
                              error: "",
                            }))
                          }
                          className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                        >
                          <option value="">
                            Selecione
                          </option>

                          {weekdays.map((day) => (
                            <option
                              key={day.value}
                              value={day.value}
                            >
                              {day.label}
                            </option>
                          ))}
                        </select>

                        <p className="text-gray-400 text-xs mt-1">
                          Exemplo: toda quinta-feira de cada mês.
                        </p>

                        <div className="mt-3">

  <label className="block text-white text-sm font-semibold mb-1">
    Primeiro vencimento
  </label>

  <input
    type="date"
    value={form.dueDate}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        dueDate:
          e.target.value,
        error: "",
      }))
    }
    className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
  />

  <p className="text-gray-400 text-xs mt-1">
    Escolha a primeira data em que essa dívida será paga.
  </p>

</div>
                      </div>
                    )}

                  </div>
                )}

                {/* SEMANAL */}

                {form.recurrenceType ===
                  "weekly" && (
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Dia da semana
                    </label>

                    <select
                      value={
                        form.recurrenceWeekday
                      }
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          recurrenceWeekday:
                            e.target.value,
                          error: "",
                        }))
                      }
                      className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                    >
                      <option value="">
                        Selecione
                      </option>

                      {weekdays.map((day) => (
                        <option
                          key={day.value}
                          value={day.value}
                        >
                          {day.label}
                        </option>
                      ))}
                    </select>

                    <p className="text-gray-400 text-xs mt-1">
                      A dívida será repetida a cada semana nesse dia.
                    </p>
                  </div>
                )}


{/* QUINZENAL */}

{form.recurrenceType ===
  "biweekly" && (
  <div>

    <label className="block text-white text-sm font-semibold mb-1">
      Dia da semana
    </label>

    <select
      value={
        form.recurrenceWeekday
      }
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          recurrenceWeekday:
            e.target.value,
          error: "",
        }))
      }
      className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
    >
      <option value="">
        Selecione
      </option>

      {weekdays.map((day) => (
        <option
          key={day.value}
          value={day.value}
        >
          {day.label}
        </option>
      ))}
    </select>

    <div className="mt-3">

      <label className="block text-white text-sm font-semibold mb-1">
        Primeiro vencimento
      </label>

      <input
        type="date"
        value={form.dueDate}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            dueDate:
              e.target.value,
            error: "",
          }))
        }
        className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
      />

      <p className="text-gray-400 text-xs mt-1">
        Escolha a primeira data em que essa dívida será paga. As próximas serão calculadas automaticamente a cada 14 dias.
      </p>

    </div>

  </div>
)}

                {/* ANUAL */}

                {form.recurrenceType ===
                  "annual" && (
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Em quais meses?
                    </label>

                    <div className="grid grid-cols-3 gap-2">

                      {months.map((month) => {
                        const selected =
                          form.recurrenceMonths.includes(
                            month.value
                          );

                        return (
                          <button
                            key={month.value}
                            type="button"
                            onClick={() =>
                              toggleRecurrenceMonth(
                                month.value
                              )
                            }
                            className={`py-2 px-2 rounded-lg text-sm font-semibold transition ${
                              selected
                                ? "bg-orange-600 text-white"
                                : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                            }`}
                          >
                            {month.label}
                          </button>
                        );
                      })}

                    </div>

                    <p className="text-gray-400 text-xs mt-2">
                      Você poderá organizar a semana do vencimento posteriormente.
                    </p>
                  </div>
                )}

                {/* LIMITE DE PARCELAS */}

                {(form.recurrenceType ===
  "monthly" ||
  form.recurrenceType ===
    "weekly" ||
  form.recurrenceType ===
    "biweekly") && (
                  <div className="bg-[#10284D] border border-[#29466D] rounded-xl p-3">

                    <label className="flex items-center gap-3 cursor-pointer">

                      <input
                        type="checkbox"
                        checked={
                          form.hasRecurrenceLimit
                        }
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            hasRecurrenceLimit:
                              e.target.checked,
                            recurrenceLimit:
                              e.target.checked
                                ? prev.recurrenceLimit
                                : "",
                            error: "",
                          }))
                        }
                        className="w-5 h-5 accent-orange-600"
                      />

                      <span className="text-white text-sm font-semibold">
                        Definir quantidade de parcelas
                      </span>

                    </label>

                    {form.hasRecurrenceLimit && (
                      <input
                        type="number"
                        min="1"
                        value={
                          form.recurrenceLimit
                        }
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            recurrenceLimit:
                              e.target.value,
                            error: "",
                          }))
                        }
                        placeholder="Ex: 12"
                        className="mt-3 w-full bg-[#0B1D39] text-white placeholder-gray-400 border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                      />
                    )}

                  </div>
                )}

              </>
            )}

            {/* VALOR */}

            <div>
              <label className="block text-white text-sm font-semibold mb-1">
                Valor
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-semibold">
                  R$
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={form.amount}
                  onChange={(e) =>
                    handleAmountChange(
                      e.target.value
                    )
                  }
                  placeholder="0,00"
                  className="w-full bg-[#10284D] text-white placeholder-gray-400 border border-[#29466D] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400"
                />

              </div>
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Status
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      status: "a-vencer",
                      error: "",
                    }))
                  }
                  className={`py-3 rounded-xl font-semibold transition ${
                    form.status ===
                    "a-vencer"
                      ? "bg-red-700 text-white"
                      : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                  }`}
                >
                  A Vencer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      status: "pagos",
                      error: "",
                    }))
                  }
                  className={`py-3 rounded-xl font-semibold transition ${
                    form.status === "pagos"
                      ? "bg-green-600 text-white"
                      : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                  }`}
                >
                  Pago
                </button>

              </div>
            </div>

            {/* ERRO */}

            {form.error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-xl px-4 py-3 text-sm">
                {form.error}
              </div>
            )}

            {/* BOTÕES */}

            <div className="grid grid-cols-2 gap-3 pt-2">

              <button
                type="button"
                onClick={handleDelete}
                className="py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-600 transition"
              >
                Apagar
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                className="py-3 rounded-xl bg-[#16A34A] text-white font-bold hover:brightness-90 transition"
              >
                Salvar
              </button>

            </div>

            {/* CANCELAR */}

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gray-600 text-white font-bold hover:bg-gray-500 transition"
            >
              Cancelar
            </button>

          </div>
        </div>
      </div>

      {/* =========================
          CONFIRMAÇÃO DE EXCLUSÃO
      ========================= */}

      {deleteConfirmVisible && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5">

          <div className="w-full max-w-sm bg-[#0B1D39] rounded-2xl shadow-2xl border border-[#1E3558] p-6">

            <div className="text-center">

              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">

                <span className="text-red-400 text-2xl font-bold">
                  !
                </span>

              </div>

              <h3 className="text-white text-xl font-bold mb-2">
                Apagar dívida?
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Tem certeza que deseja apagar esta dívida?
                <br />
                Essa ação não poderá ser desfeita.
              </p>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={cancelDelete}
                  className="py-3 rounded-xl bg-gray-600 text-white font-bold hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-600 transition"
                >
                  Apagar
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}