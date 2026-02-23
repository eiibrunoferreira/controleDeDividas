import { useState, useEffect } from "react";
import { useDebts } from "../context/useDebts"; // ajuste se estiver usando outro arquivo

export default function AddDebtModal({ visible, onClose }) {
  const { addDebt } = useDebts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [amount, setAmount] = useState(""); // Valor formatado
  const [rawAmount, setRawAmount] = useState(""); // Valor sem formatação
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  // 🟢 TRAVAR SCROLL DO FUNDO
  useEffect(() => {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [visible]);

  function resetForm() {
    setName("");
    setDescription("");
    setDueDay("");
    setAmount("");
    setRawAmount("");
    setStatus(null);
    setError("");
  }

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    setRawAmount(cleaned);

    if (!cleaned) {
      setAmount("");
      return;
    }

    let numberValue = parseInt(cleaned, 10);
    const cents = numberValue % 100;
    let integerPart = Math.floor(numberValue / 100);
    const decimalPart = cents.toString().padStart(2, "0");
    const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedInteger + "," + decimalPart);
  };

  function handleSave() {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    if (!rawAmount) {
      setError("Informe um valor válido");
      return;
    }

    const numericAmount = Number(rawAmount) / 100;

    if (isNaN(numericAmount)) {
      setError("Informe um valor válido");
      return;
    }

    if (!status) {
      setError("Selecione um status");
      return;
    }

    addDebt({
      id: Date.now().toString(),
      name,
      description,
      dueDay: dueDay ? Number(dueDay) : null,
      amount: numericAmount,
      status,
    });

    resetForm();
    onClose();
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
      onClick={() => {
        resetForm();
        onClose();
      }}
    >
      <div
        className="bg-zinc-900 rounded-xl p-6 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-xl font-semibold mb-4">Nova Dívida</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Nome da dívida"
          className="w-full bg-zinc-800 text-white p-3 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Descrição (opcional)"
          className="w-full bg-zinc-800 text-white p-3 rounded mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Dia do vencimento (opcional)"
          className="w-full bg-zinc-800 text-white p-3 rounded mb-3"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          max={31}
        />

        <div className="flex items-center bg-zinc-800 rounded p-3 mb-3">
          <span className="text-gray-400 mr-2 font-semibold">R$</span>
          <input
            type="text"
            placeholder="0,00"
            className="flex-1 bg-transparent text-white focus:outline-none"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
        </div>

        <p className="text-white mb-2 mt-1">Status</p>
        <div className="flex gap-2 mb-4">
          {["a-vencer", "dividas", "pagos"].map((item) => (
            <button
              key={item}
              className={`flex-1 p-2 rounded border ${status === item
                  ? "bg-white text-black font-semibold"
                  : "text-white border-white"
                }`}
              onClick={() => setStatus(item)}
            >
              {item === "a-vencer"
                ? "A Vencer"
                : item === "dividas"
                  ? "Dívidas"
                  : "Pagos"}
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-2">
          <button
            className="flex-1 p-3 rounded bg-gray-600 text-white"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancelar
          </button>

          <button
            className="flex-1 p-3 rounded bg-white text-black font-semibold"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}