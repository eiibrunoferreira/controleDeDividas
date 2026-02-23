// src/components/ButtonsCards.jsx
import { useNavigate } from "react-router-dom";

export default function ButtonsCards() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl p-4">
      <h2 className="text-white text-xl font-semibold mb-3">Botões de Acessos</h2>

      <div className="flex flex-col gap-4">
        <button
          className="bg-zinc-800 rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={() => navigate("/a-vencer")}
        >
          Á VENCER
        </button>

        <button
          className="bg-zinc-800 rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={() => navigate("/dividas")}
        >
          DÍVIDAS
        </button>

        <button
          className="bg-zinc-800 rounded-lg py-6 text-white font-medium hover:brightness-90 transition-all"
          onClick={() => navigate("/pagos")}
        >
          PAGOS
        </button>
      </div>
    </div>
  );
}