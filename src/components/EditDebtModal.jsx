import { useState, useEffect } from "react";

export default function EditDebtModal({ visible, onClose, debt, updateDebt, deleteDebt }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    dueDay: "",
    amount: "",
    rawAmount: "",
    status: null,
    error: "",
  });

  const formatAmountFromCents = (cents) => {
    if (!cents) return "";
    const numberValue = parseInt(cents, 10);
    const c = numberValue % 100;
    const i = Math.floor(numberValue / 100);
    return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + c.toString().padStart(2, "0");
  };

  // 🟢 TRAVAR SCROLL DO FUNDO
  useEffect(() => {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [visible]);

  useEffect(() => {
    if (!(visible && debt)) return;

    const cents = debt.amount ? Math.round(debt.amount * 100).toString() : "";
    const newFormState = {
      name: debt.name || "",
      description: debt.description || "",
      dueDay: debt.dueDay ? String(debt.dueDay) : "",
      status: debt.status || null,
      rawAmount: cents,
      amount: formatAmountFromCents(cents),
      error: "",
    };

    requestAnimationFrame(() => setForm(newFormState));
  }, [visible, debt]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      dueDay: "",
      amount: "",
      rawAmount: "",
      status: null,
      error: "",
    });
  };

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (!cleaned) {
      setForm({ ...form, rawAmount: "", amount: "" });
      return;
    }

    const numberValue = parseInt(cleaned, 10);
    const cents = numberValue % 100;
    const integerPart = Math.floor(numberValue / 100);
    const decimalPart = cents.toString().padStart(2, "0");
    const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setForm({ ...form, rawAmount: cleaned, amount: formattedInteger + "," + decimalPart });
  };

  const getAmountColor = (itemStatus) => {
    switch (itemStatus) {
      case "pagos":
        return "bg-green-500 text-black border-green-500";
      case "a-vencer":
        return "bg-red-800 text-white border-red-800";
      default:
        return "bg-white text-black border-white";
    }
  };

  const handleUpdate = () => {
    if (!debt) return;

    if (!form.name.trim()) return setForm({ ...form, error: "Nome é obrigatório" });
    if (!form.rawAmount) return setForm({ ...form, error: "Informe um valor válido" });
    if (!form.status) return setForm({ ...form, error: "Selecione um status" });

    updateDebt(debt.id, {
      name: form.name,
      description: form.description,
      dueDay: form.dueDay ? Number(form.dueDay) : null,
      amount: Number(form.rawAmount) / 100,
      status: form.status,
    });

    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (!debt) return;
    if (window.confirm("Deseja realmente apagar esta dívida?")) {
      deleteDebt(debt.id);
      resetForm();
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-5 z-50"
      onClick={() => { resetForm(); onClose(); }}
    >
      <div
        className="bg-zinc-900 rounded-xl p-5 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-white text-xl font-semibold">Editar Dívida</h2>
          <button className="text-gray-400 text-2xl" onClick={() => { resetForm(); onClose(); }}>✕</button>
        </div>

        {form.error && <p className="text-red-500 mb-2">{form.error}</p>}

        {/* Nome */}
        <label className="text-white mb-1 block">Nome</label>
        <input
          className="w-full bg-zinc-800 text-white p-3 rounded-lg mb-3 border-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Descrição */}
        <label className="text-white mb-1 block">Descrição</label>
        <textarea
          className="w-full bg-zinc-800 text-white p-3 rounded-lg mb-3 border-none min-h-[80px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Dia do vencimento */}
        <label className="text-white mb-1 block">Dia do vencimento</label>
        <input
          type="number"
          className="w-full bg-zinc-800 text-white p-3 rounded-lg mb-3 border-none"
          value={form.dueDay}
          onChange={(e) => setForm({ ...form, dueDay: e.target.value })}
        />

        {/* Valor */}
        <label className="text-white mb-1 block">Valor</label>
        <div className="flex items-center bg-zinc-800 rounded-lg p-3 mb-3">
          <span className="text-gray-400 font-semibold mr-2">R$</span>
          <input
            type="text"
            className="flex-1 bg-transparent text-white border-none p-0 outline-none"
            value={form.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
        </div>

        {/* Status */}
        <label className="text-white mb-1 block">Status</label>
        <div className="flex gap-2 mb-5">
          {["a-vencer", "dividas", "pagos"].map((item) => (
            <button
              key={item}
              className={`flex-1 py-2 rounded-lg border font-semibold ${form.status === item ? getAmountColor(item) : "bg-transparent text-white"}`}
              onClick={() => setForm({ ...form, status: item })}
            >
              {item === "a-vencer" ? "A Vencer" : item === "dividas" ? "Dívidas" : "Pagos"}
            </button>
          ))}
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 rounded-lg bg-gray-600 text-white font-semibold"
            onClick={handleDelete}
          >
            Apagar dívida
          </button>
          <button
            className="flex-1 py-3 rounded-lg bg-white text-black font-semibold"
            onClick={handleUpdate}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}