import { useEffect, useState } from "react";

export default function BackToTopButton() {

  const [visible, setVisible] = useState(false);


  useEffect(() => {

    const handleScroll = () => {

      setVisible(window.scrollY > 150);

    };


    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );


    handleScroll();


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  const handleBackToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  if (!visible) {
    return null;
  }


  return (

    <button
      type="button"
      onClick={handleBackToTop}
      className="
        fixed
        bottom-10
        left-1/2
        -translate-x-1/2
        z-50
        flex
        items-center
        gap-2
        px-5
        py-3
        rounded-full
        bg-orange-500
        text-white
        shadow-2xl
        backdrop-blur-md
        hover:brightness-110
        active:scale-95
        transition-all
      "
    >

      <span className="text-lg leading-none">
        ⮝
      </span>

      <span className="text-sm font-semibold">
        Voltar ao Topo
      </span>

    </button>

  );

}