import { useNavigate } from "react-router-dom";

export default function NavHeader() {
  const navigate = useNavigate();

  return (
    <div className="fixed ml-2 -mt-1.5 w-11 h-11 flex items-center justify-center bg-[#10284D] rounded-full hover:brightness-90 transition-all">
      <button
        onClick={() => navigate(-1)}
        className="text-white text-xl font-bold transition"
      >
        ⤶
      </button>
    </div>
  );
}