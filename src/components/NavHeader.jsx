import { useNavigate } from "react-router-dom";

export default function NavHeader() {
  const navigate = useNavigate();

  return (
    <div className="fixed ml-2 -mt-1 p-2 px-3.5 flex text-center justify-center items-center bg-zinc-800 rounded-full hover:brightness-90 transition-all">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="text-white text-xl text-center font-bold hover:text-zinc-300 transition"
      >
        ⭠
      </button>

    </div>
  );
}