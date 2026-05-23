export default function AddDividaButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mx-5 my-6 py-4 bg-[#16A34A] rounded-2xl text-white font-bold text-base hover:brightness-90 transition-all"
    >
      + Adicionar dívida
    </button>
  );
}