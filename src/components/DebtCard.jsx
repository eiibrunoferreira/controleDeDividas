export default function DebtCard({ debt, onPress }) {
  function getCircleColor() {
    switch (debt.status) {
      case "pagos":
        return "bg-green-500";
      case "a-vencer":
        return "bg-red-700";
      case "dividas":
      default:
        return "bg-white";
    }
  }

  function getAmountColor() {
    switch (debt.status) {
      case "pagos":
        return "text-green-500";
      case "a-vencer":
        return "text-red-500";
      default:
        return "text-white";
    }
  }

  const formatAmount = (value) => {
    if (value == null) return "0,00";

    const integerPart = Math.floor(value);
    const decimalPart = Math.round((value - integerPart) * 100)
      .toString()
      .padStart(2, "0");

    const formattedInteger = integerPart
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${formattedInteger},${decimalPart}`;
  };

  const circleColor = getCircleColor();
  const amountColor = getAmountColor();
  const textColor = circleColor === "bg-white" ? "text-black" : "text-white";

  return (
    <div
      onClick={() => onPress && onPress(debt)}
      className="cursor-pointer bg-zinc-800 p-4 rounded-lg mx-2 mb-3 flex justify-between items-center hover:bg-zinc-700 transition"
    >
      <div className="flex items-center">
        <div
          className={`${circleColor} w-12 h-12 rounded-full flex items-center justify-center mr-4`}
        >
          <span className={`${textColor} font-bold text-base`}>
            {debt.dueDay ? debt.dueDay : "-"}
          </span>
        </div>

        <div>
          <p className="text-white font-semibold text-base">{debt.name}</p>
        </div>
      </div>

      <span className={`${amountColor} font-bold text-base`}>
        R$ {formatAmount(debt.amount)}
      </span>
    </div>
  );
}