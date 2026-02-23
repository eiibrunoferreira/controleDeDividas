import { useDebts } from "../context/useDebts";

export default function TotalToPay() {
  const { totalAVencer } = useDebts();

  const formattedValue = totalAVencer.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="mx-5 mt-5 p-6 rounded-2xl bg-zinc-800">
      <p className="text-sm text-zinc-400 mb-1">
        Total a vencer:
      </p>

      <h2 className="text-3xl font-bold text-white">
        {formattedValue}
      </h2>
    </div>
  );
}