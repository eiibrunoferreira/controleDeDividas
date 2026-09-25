import {
  useState,
  useEffect,
  useRef,
} from "react";


// =========================================================
// MESES
// =========================================================

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


// =========================================================
// COMPONENTE
// =========================================================

export default function MonthWeekSelector({
  onChange,
  onWeekToggle,
}) {

  // =======================================================
  // REFERÊNCIA DO CONTAINER DAS SEMANAS
  // =======================================================

  const weekContainerRef = useRef(null);

  const isDragging = useRef(false);

  const startX = useRef(0);

  const scrollLeft = useRef(0);

  const didDrag = useRef(false);


  // =======================================================
  // DATA ATUAL
  // =======================================================

  const today = new Date();

  const currentMonth =
    today.getMonth();

  const currentYear =
    today.getFullYear();


  // =======================================================
  // SEMANA ATUAL DO CALENDÁRIO
  // =======================================================

  const firstDayOfCurrentMonth =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();


  const currentWeek =
    Math.ceil(
      (
        today.getDate() +
        firstDayOfCurrentMonth
      ) / 7
    );


  // =======================================================
  // MÊS SELECIONADO
  // =======================================================

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [selectedYear, setSelectedYear] =
    useState(currentYear);


  // =======================================================
  // SEMANA SELECIONADA
  // =======================================================

  const [selectedWeek, setSelectedWeek] =
    useState(currentWeek);


  // =======================================================
  // QUANTIDADE DE SEMANAS DO MÊS
  // =======================================================

  const getWeeksInMonth = (
    month,
    year
  ) => {

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    const lastWeek =
      Math.ceil(
        (
          daysInMonth +
          firstDay
        ) / 7
      );


    return lastWeek;

  };


  // =======================================================
  // QUANTIDADE DE SEMANAS DO MÊS SELECIONADO
  // =======================================================

  const weeksInSelectedMonth =
    getWeeksInMonth(
      selectedMonth,
      selectedYear
    );


  // =======================================================
  // ENVIAR PERÍODO INICIAL
  // =======================================================

  useEffect(() => {

    if (onChange) {

      onChange({

        month: currentMonth + 1,

        year: currentYear,

        week: currentWeek,

      });

    }


    // Começa com todas as semanas fechadas.

    if (onWeekToggle) {

      onWeekToggle(null);

    }

  }, []);


  // =======================================================
  // VERIFICAR SE É O MÊS ATUAL
  // =======================================================

  const isCurrentMonth =
    selectedMonth === currentMonth &&
    selectedYear === currentYear;


  // =======================================================
  // ALTERAR MÊS
  // =======================================================

  const changeMonth = (direction) => {

    let newMonth =
      selectedMonth + direction;

    let newYear =
      selectedYear;


    // -----------------------------------------------------
    // VOLTOU ANTES DE JANEIRO
    // -----------------------------------------------------

    if (newMonth < 0) {

      newMonth = 11;

      newYear--;

    }


    // -----------------------------------------------------
    // PASSOU DE DEZEMBRO
    // -----------------------------------------------------

    if (newMonth > 11) {

      newMonth = 0;

      newYear++;

    }


    setSelectedMonth(newMonth);

    setSelectedYear(newYear);


    // Sempre começa pela Semana 1.

    setSelectedWeek(1);


    // Quando muda de mês,
    // todas as semanas ficam fechadas.

    if (onWeekToggle) {

      onWeekToggle(null);

    }


    if (onChange) {

      onChange({

        month: newMonth + 1,

        year: newYear,

        week: 1,

      });

    }

  };


  // =======================================================
  // ALTERAR SEMANA
  // =======================================================

  const changeWeek = (week) => {

    setSelectedWeek(week);


    if (onChange) {

      onChange({

        month: selectedMonth + 1,

        year: selectedYear,

        week,

      });

    }


    // Avisar o Home para abrir/fechar
    // a semana clicada.

    if (onWeekToggle) {

      onWeekToggle(week);

    }

  };


  // =======================================================
  // COMEÇAR ARRASTO COM MOUSE
  // =======================================================

  const handleMouseDown = (event) => {

    if (event.button !== 0) {
      return;
    }


    const container =
      weekContainerRef.current;

    if (!container) {
      return;
    }


    isDragging.current = true;

    didDrag.current = false;


    startX.current =
      event.pageX -
      container.offsetLeft;


    scrollLeft.current =
      container.scrollLeft;


    container.style.cursor =
      "grabbing";

  };


  // =======================================================
  // MOVER COM MOUSE
  // =======================================================

  const handleMouseMove = (event) => {

    if (!isDragging.current) {
      return;
    }


    const container =
      weekContainerRef.current;

    if (!container) {
      return;
    }


    event.preventDefault();


    const x =
      event.pageX -
      container.offsetLeft;


    const walk =
      x -
      startX.current;


    if (Math.abs(walk) > 5) {

      didDrag.current = true;

    }


    container.scrollLeft =
      scrollLeft.current -
      walk;

  };


  // =======================================================
  // FINALIZAR ARRASTO
  // =======================================================

  const stopDragging = () => {

    isDragging.current = false;


    const container =
      weekContainerRef.current;


    if (container) {

      container.style.cursor =
        "grab";

    }

  };


  // =======================================================
  // CLICAR NA SEMANA
  // =======================================================

  const handleWeekClick = (week) => {

    if (didDrag.current) {

      didDrag.current = false;

      return;

    }


    changeWeek(week);

  };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="w-full px-5">

      {/* ================================================= */}
      {/* CSS PARA ESCONDER A BARRA DE ROLAGEM */}
      {/* ================================================= */}

      <style>
        {`
          .week-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>


      {/* ================================================= */}
      {/* MÊS */}
      {/* ================================================= */}

      <div className="flex items-center justify-between mb-4">

        {/* BOTÃO ANTERIOR */}

        <button
          onClick={() =>
            changeMonth(-1)
          }

          className="text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          ‹
        </button>


        {/* MÊS E ANO */}

        <div className="text-center">

          <h2 className="text-white text-xl font-semibold">

            {months[selectedMonth]}{" "}

            <span className="text-gray-400 font-normal">
              {selectedYear}
            </span>

          </h2>


          {/* INDICADOR DO MÊS ATUAL */}

          {isCurrentMonth && (

            <p className="text-orange-400 text-xs font-medium mt-1">

              Mês atual

            </p>

          )}

        </div>


        {/* BOTÃO PRÓXIMO */}

        <button
          onClick={() =>
            changeMonth(1)
          }

          className="text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          ›

        </button>

      </div>


      {/* ================================================= */}
      {/* SEMANAS */}
      {/* ================================================= */}

      <div
        ref={weekContainerRef}

        className="week-scroll flex gap-2 overflow-x-auto pb-2"

        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-x",
        }}

        onMouseDown={
          handleMouseDown
        }

        onMouseMove={
          handleMouseMove
        }

        onMouseUp={
          stopDragging
        }

        onMouseLeave={
          stopDragging
        }
      >

        {Array.from(
          {
            length:
              weeksInSelectedMonth,
          },
          (_, index) =>
            index + 1
        ).map(
          (week) => (

            <button
              key={week}

              onClick={() =>
                handleWeekClick(week)
              }

              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedWeek === week
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
              }`}
            >

              Semana {week}

            </button>

          )
        )}

      </div>

    </div>

  );

}