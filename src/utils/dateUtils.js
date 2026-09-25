export function getWeekOfMonth(dateString) {
  if (!dateString) {
    return null;
  }

  const [year, month, day] =
    dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  // Primeiro dia do mês
  const firstDayOfMonth =
    new Date(
      year,
      month - 1,
      1
    );

  // Domingo = 0
  // Segunda = 1
  // ...
  // Sábado = 6
  const firstDayWeekday =
    firstDayOfMonth.getDay();

  // Calcula a semana do calendário
  const week =
    Math.ceil(
      (day + firstDayWeekday) / 7
    );

  return week;
}


export function getYearFromDate(dateString) {
  if (!dateString) {
    return null;
  }

  const year = Number(
    dateString.split("-")[0]
  );

  return year || null;
}


export function getMonthFromDate(dateString) {
  if (!dateString) {
    return null;
  }

  const month = Number(
    dateString.split("-")[1]
  );

  return month || null;
}


export function getMonthName(monthNumber) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  if (
    !monthNumber ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return "";
  }

  return months[monthNumber - 1];
}


export function getMonthYearLabel(dateString) {
  if (!dateString) {
    return "";
  }

  const year =
    getYearFromDate(dateString);

  const month =
    getMonthFromDate(dateString);

  if (!year || !month) {
    return "";
  }

  return `${getMonthName(month)} ${year}`;
}


export function getDayFromDate(dateString) {
  if (!dateString) {
    return null;
  }

  const day = Number(
    dateString.split("-")[2]
  );

  return day || null;
}