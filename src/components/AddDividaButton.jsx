export default function AddDividaButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mx-5 my-6 py-4 bg-green-500 rounded-2xl text-white font-bold text-base hover:brightness-90 transition-all"
    >
      + Adicionar dívida
    </button>
  );
}