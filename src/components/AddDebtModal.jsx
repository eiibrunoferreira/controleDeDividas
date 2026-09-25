import { useEffect, useState } from "react";

import { useDebts } from "../context/useDebts";

export default function AddDebtModal({ visible, onClose }) {
  const { addDebt } = useDebts();

  // =========================
  // BLOQUEIA O SCROLL DE TRÁS
  // =========================
  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // =========================
  // DADOS PRINCIPAIS
  // =========================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // =========================
  // RECORRÊNCIA
  // =========================

  const [recurring, setRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("");

  // Mensal
  const [monthlyDueMode, setMonthlyDueMode] = useState("");
  const [recurrenceWeekday, setRecurrenceWeekday] = useState("");

  // Data para dívida normal ou mensal por dia
  const [dueDate, setDueDate] = useState("");

  // Anual
  const [recurrenceMonths, setRecurrenceMonths] = useState([]);

  // Quantidade de parcelas
  const [hasRecurrenceLimit, setHasRecurrenceLimit] =
    useState(false);

  const [recurrenceLimit, setRecurrenceLimit] =
    useState("");

  const [error, setError] = useState("");

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
  // FORMATA VALOR
  // =========================

  function formatAmount(value) {
    let numbers = value.replace(/\D/g, "");

    if (!numbers) {
      setAmount("");
      return;
    }

    numbers = numbers.padStart(3, "0");

    const integerPart = numbers.slice(0, -2);
    const decimalPart = numbers.slice(-2);

    const formattedInteger =
      Number(integerPart).toLocaleString("pt-BR");

    setAmount(`${formattedInteger},${decimalPart}`);
  }

  // =========================
  // ALTERA TIPO DE RECORRÊNCIA
  // =========================

  function handleRecurrenceTypeChange(type) {
    setRecurrenceType(type);

    setMonthlyDueMode("");
    setRecurrenceWeekday("");
    setDueDate("");
    setRecurrenceMonths([]);
  }

  // =========================
  // ATIVA / DESATIVA RECORRÊNCIA
  // =========================

  function handleRecurringChange(value) {
    setRecurring(value);
    setError("");

    if (!value) {
      setRecurrenceType("");
      setMonthlyDueMode("");
      setRecurrenceWeekday("");
      setRecurrenceMonths([]);
      setDueDate("");
      setHasRecurrenceLimit(false);
      setRecurrenceLimit("");
    }
  }

  // =========================
  // SELECIONA MÊS ANUAL
  // =========================

  function toggleAnnualMonth(month) {
    setRecurrenceMonths((current) => {
      if (current.includes(month)) {
        return current.filter((item) => item !== month);
      }

      return [...current, month].sort((a, b) => a - b);
    });
  }

  // =========================
  // SALVAR
  // =========================

function getNextWeekdayDate(weekday) {

  const today = new Date();

  const currentWeekday = today.getDay();

  const selectedWeekday = Number(weekday);

  const daysUntil =
    (selectedWeekday - currentWeekday + 7) % 7;

  const nextDate = new Date(today);

  nextDate.setDate(
    today.getDate() + daysUntil
  );

  const year =
    nextDate.getFullYear();

  const month =
    String(
      nextDate.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      nextDate.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

  async function handleSubmit(e) {

  e.preventDefault();

  setError("");

  // -------------------------
  // NOME
  // -------------------------

  if (!name.trim()) {

    setError("Digite o nome da dívida.");

    return;

  }

  // -------------------------
  // VALOR
  // -------------------------

  if (!amount) {

    setError("Digite o valor da dívida.");

    return;

  }

  const numericAmount = Number(
    amount
      .replace(/\./g, "")
      .replace(",", ".")
  );

  if (!numericAmount || numericAmount <= 0) {

    setError("Digite um valor válido.");

    return;

  }

  // -------------------------
  // DÍVIDA NÃO RECORRENTE
  // -------------------------

  if (!recurring) {

    if (!dueDate) {

      setError("Informe a data de vencimento.");

      return;

    }

  }

  // -------------------------
  // DÍVIDA RECORRENTE
  // -------------------------

  if (recurring) {

    if (!recurrenceType) {

      setError("Escolha o tipo de recorrência.");

      return;

    }

    // =======================
    // MENSAL
    // =======================

    if (recurrenceType === "monthly") {

      if (!monthlyDueMode) {

        setError("Escolha como a dívida será repetida.");

        return;

      }

      if (
        monthlyDueMode === "date" &&
        !dueDate
      ) {

        setError("Informe o dia de vencimento.");

        return;

      }

      if (
        monthlyDueMode === "weekday" &&
        recurrenceWeekday === ""
      ) {

        setError("Escolha o dia da semana.");

        return;

      }

    }

    // =======================
    // SEMANAL
    // =======================

    if (recurrenceType === "weekly") {

      if (recurrenceWeekday === "") {

        setError("Escolha o dia da semana.");

        return;

      }

    }

    // =======================
    // ANUAL
    // =======================

    if (recurrenceType === "annual") {

      if (recurrenceMonths.length === 0) {

        setError("Escolha pelo menos um mês.");

        return;

      }

    }

  }

  // -------------------------
  // LIMITE DE PARCELAS
  // -------------------------

  let finalRecurrenceLimit = null;

  if (
    recurring &&
    (recurrenceType === "monthly" ||
      recurrenceType === "weekly") &&
    hasRecurrenceLimit
  ) {

    const limit = Number(recurrenceLimit);

    if (!Number.isInteger(limit) || limit <= 0) {

      setError(
        "Informe uma quantidade válida de parcelas."
      );

      return;

    }

    finalRecurrenceLimit = limit;

  }

  // -------------------------
  // PRIMEIRO MÊS ANUAL
  // -------------------------

  const firstAnnualMonth =
    recurrenceType === "annual" &&
    recurrenceMonths.length > 0
      ? recurrenceMonths[0]
      : null;

      let firstDueDate = dueDate;

if (
  recurring &&
  recurrenceType === "weekly" &&
  recurrenceWeekday !== ""
) {

  firstDueDate =
    getNextWeekdayDate(
      recurrenceWeekday
    );

}

  // -------------------------
  // DADOS DA DÍVIDA
  // -------------------------

  const debtData = {

    name: name.trim(),

    description: description.trim(),

    amount: numericAmount,

    status: "a-vencer",

    recurring,

    recurrenceType: recurring
      ? recurrenceType
      : null,

    dueDate:
  !recurring ||
  (
    recurring &&
    recurrenceType === "monthly" &&
    monthlyDueMode === "date"
  ) ||
  (
    recurring &&
    recurrenceType === "weekly"
  )
    ? firstDueDate || null
    : null,

    monthlyDueMode:
      recurring &&
      recurrenceType === "monthly"
        ? monthlyDueMode
        : null,

    recurrenceWeekday:
      recurring &&
      (
        recurrenceType === "weekly" ||
        (
          recurrenceType === "monthly" &&
          monthlyDueMode === "weekday"
        )
      )
        ? Number(recurrenceWeekday)
        : null,

    recurrenceLimit:
      finalRecurrenceLimit,

    recurrenceNumber:
      recurring ? 1 : null,

    recurrenceMonth:
      recurring &&
      recurrenceType === "annual"
        ? firstAnnualMonth
        : null,

    recurrenceMonths:
      recurring &&
      recurrenceType === "annual"
        ? recurrenceMonths
        : null,

  };

  // -------------------------
  // ENVIA PARA O BACKEND
  // -------------------------

  const token = localStorage.getItem("@auth_token");

  if (!token) {

    setError("Usuário não autenticado.");

    return;

  }

  try {

    const response = await fetch(
      "https://controlededividas.onrender.com/debts",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(debtData),

      }
    );

    const data = await response.json();

    if (!response.ok) {

      setError(
        data.error ||
        "Não foi possível salvar a dívida."
      );

      return;

    }

    // -------------------------
    // ATUALIZA A TELA
    // -------------------------

    addDebt(data);

    // -------------------------
    // LIMPA FORMULÁRIO
    // -------------------------

    setName("");

    setDescription("");

    setAmount("");

    setRecurring(false);

    setRecurrenceType("");

    setMonthlyDueMode("");

    setRecurrenceWeekday("");

    setDueDate("");

    setRecurrenceMonths([]);

    setHasRecurrenceLimit(false);

    setRecurrenceLimit("");

    setError("");

    onClose();

  } catch (error) {

    console.error(error);

    setError(
      "Não foi possível conectar ao servidor."
    );

  }

}

  // =========================
  // FECHAR
  // =========================

  function handleClose() {
    setError("");
    onClose();
  }

  // =========================
  // NÃO MOSTRA MODAL
  // =========================

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0B1D39] rounded-2xl shadow-2xl border border-[#1E3558]">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#243B5D]">

          <h2 className="text-white text-xl font-bold">
            Adicionar dívida
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-300 hover:text-white text-2xl leading-none"
          >
            ×
          </button>

        </div>

        {/* =========================
            FORMULÁRIO
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4"
        >

          {/* NOME */}

          <div>
            <label className="block text-white text-sm font-semibold mb-1">
              Nome da dívida
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Ex: Internet de casa"
              rows={2}
              className="w-full bg-[#10284D] text-white placeholder-gray-400 border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {/* =========================
              RECORRENTE?
          ========================= */}

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
                  !recurring
                    ? "bg-orange-600 text-white"
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
                  recurring
                    ? "bg-orange-600 text-white"
                    : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                }`}
              >
                Sim
              </button>

            </div>
          </div>

          {/* =========================
              NÃO RECORRENTE
          ========================= */}

          {!recurring && (
            <div>

              <label className="block text-white text-sm font-semibold mb-1">
                Data de vencimento
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none"
              />

            </div>
          )}

          {/* =========================
              RECORRENTE
          ========================= */}

          {recurring && (
            <>

              {/* TIPO */}

              <div>

                <label className="block text-white text-sm font-semibold mb-2">
                  Tipo de recorrência
                </label>

                <div className="grid grid-cols-3 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleRecurrenceTypeChange(
                        "monthly"
                      )
                    }
                    className={`py-3 rounded-xl text-sm font-semibold ${
                      recurrenceType === "monthly"
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
                      recurrenceType === "weekly"
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
                        "annual"
                      )
                    }
                    className={`py-3 rounded-xl text-sm font-semibold ${
                      recurrenceType === "annual"
                        ? "bg-orange-600 text-white"
                        : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                    }`}
                  >
                    Anual
                  </button>

                </div>

              </div>

              {/* =========================
                  MENSAL
              ========================= */}

              {recurrenceType === "monthly" && (
                <div className="space-y-3">

                  <div>

                    <label className="block text-white text-sm font-semibold mb-2">
                      Como deve repetir?
                    </label>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyDueMode("date");
                          setRecurrenceWeekday("");
                        }}
                        className={`py-3 rounded-xl text-sm font-semibold ${
                          monthlyDueMode === "date"
                            ? "bg-blue-600 text-white"
                            : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                        }`}
                      >
                        Por dia
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyDueMode(
                            "weekday"
                          );
                          setDueDate("");
                        }}
                        className={`py-3 rounded-xl text-sm font-semibold ${
                          monthlyDueMode === "weekday"
                            ? "bg-blue-600 text-white"
                            : "bg-[#10284D] text-gray-300 border border-[#29466D]"
                        }`}
                      >
                        Por dia da semana
                      </button>

                    </div>

                  </div>

                  {/* MENSAL POR DATA */}

                  {monthlyDueMode === "date" && (
                    <div>

                      <label className="block text-white text-sm font-semibold mb-1">
                        Data do primeiro vencimento
                      </label>

                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                          setDueDate(e.target.value)
                        }
                        className="w-full bg-[#10284D] text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                      />

                      <p className="text-gray-400 text-xs mt-1">
                        A dívida será repetida pelo mesmo dia de cada mês.
                      </p>

                    </div>
                  )}

                  {/* MENSAL POR DIA DA SEMANA */}

                  {monthlyDueMode === "weekday" && (
                    <div>

                      <label className="block text-white text-sm font-semibold mb-1">
                        Dia da semana
                      </label>

                      <select
                        value={recurrenceWeekday}
                        onChange={(e) =>
                          setRecurrenceWeekday(
                            e.target.value
                          )
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

                    </div>
                  )}

                </div>
              )}

              {/* =========================
                  SEMANAL
              ========================= */}

              {recurrenceType === "weekly" && (
                <div>

                  <label className="block text-white text-sm font-semibold mb-1">
                    Dia da semana
                  </label>

                  <select
                    value={recurrenceWeekday}
                    onChange={(e) =>
                      setRecurrenceWeekday(
                        e.target.value
                      )
                    }
                    className="w-full bg-[#10284D] cursor-pointer text-white border border-[#29466D] rounded-xl px-4 py-3 outline-none"
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

              {/* =========================
                  ANUAL
              ========================= */}

              {recurrenceType === "annual" && (
                <div>

                  <label className="block text-white text-sm font-semibold mb-2">
                    Em quais meses?
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {months.map((month) => {
                      const selected =
                        recurrenceMonths.includes(
                          month.value
                        );

                      return (
                        <button
                          key={month.value}
                          type="button"
                          onClick={() =>
                            toggleAnnualMonth(
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

              {/* =========================
                  LIMITE DE PARCELAS
              ========================= */}

              {(recurrenceType === "monthly" ||
                recurrenceType === "weekly") && (
                <div className="bg-[#10284D] border border-[#29466D] rounded-xl p-3">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={hasRecurrenceLimit}
                      onChange={(e) => {
                        setHasRecurrenceLimit(
                          e.target.checked
                        );

                        if (!e.target.checked) {
                          setRecurrenceLimit("");
                        }
                      }}
                      className="w-5 h-5 accent-orange-600"
                    />

                    <span className="text-white text-sm font-semibold">
                      Definir quantidade de parcelas
                    </span>

                  </label>

                  {hasRecurrenceLimit && (
                    <input
                      type="number"
                      min="1"
                      value={recurrenceLimit}
                      onChange={(e) =>
                        setRecurrenceLimit(
                          e.target.value
                        )
                      }
                      placeholder="Ex: 12"
                      className="mt-3 w-full bg-[#0B1D39] text-white placeholder-gray-400 border border-[#29466D] rounded-xl px-4 py-3 outline-none focus:border-blue-400"
                    />
                  )}

                </div>
              )}

            </>
          )}

          {/* =========================
              VALOR
          ========================= */}

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
                value={amount}
                onChange={(e) =>
                  formatAmount(e.target.value)
                }
                placeholder="0,00"
                className="w-full bg-[#10284D] text-white placeholder-gray-400 border border-[#29466D] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-400"
              />

            </div>

          </div>

          {/* =========================
              ERRO
          ========================= */}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* =========================
              BOTÕES
          ========================= */}

          <div className="grid grid-cols-2 gap-3 pt-2">

            <button
              type="button"
              onClick={handleClose}
              className="py-3 rounded-xl bg-gray-600 text-white font-bold hover:bg-gray-500 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="py-3 rounded-xl bg-[#16A34A] text-white font-bold hover:brightness-90 transition"
            >
              Salvar
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}