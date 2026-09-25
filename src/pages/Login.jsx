import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import backgroundImage from "/images/background.png";


export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      const response = await fetch("https://controlededividas.onrender.com/users/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),

      });


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.error ||
          "Não foi possível fazer login."
        );

        return;

      }


      console.log("Login realizado:", data);

localStorage.setItem("@auth_token", data.token);

navigate("/home");


    } catch (error) {

      console.error(error);

      alert("Não foi possível conectar ao servidor.");

    }

  };


  // =========================================================
  // FUNDO - TOPO
  // =========================================================

  const imageMaskTopStyle = {

    backgroundImage:
      `url('${backgroundImage}')`,

    backgroundSize:
      "100%",

    backgroundRepeat:
      "no-repeat",

    opacity:
      "0.10",

    transform:
      "scaleY(-1) scaleX(-1)",

    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 90%)",

    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 90%)",

  };


  // =========================================================
  // FUNDO - BASE
  // =========================================================

  const imageMaskBottomStyle = {

    backgroundImage:
      `url('${backgroundImage}')`,

    backgroundSize:
      "100%",

    backgroundPosition:
      "bottom center",

    backgroundRepeat:
      "no-repeat",

    opacity:
      "0.25",

    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)",

    maskImage:
      "linear-gradient(to bottom, transparent 0%, transparent 75%, black 100%)",

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <div className="min-h-screen w-full bg-[#061224] relative overflow-hidden flex items-center justify-center px-5 py-8">


      {/* ================================================= */}
      {/* FUNDO TOPO */}
      {/* ================================================= */}

      <div
        className="fixed top-0 left-0 right-0 h-[35vh] z-0 pointer-events-none"
        style={{
          ...imageMaskTopStyle,
          backgroundPosition: "top center",
        }}
      />


      {/* ================================================= */}
      {/* FUNDO BASE */}
      {/* ================================================= */}

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={imageMaskBottomStyle}
      />


      {/* ================================================= */}
      {/* CONTEÚDO */}
      {/* ================================================= */}

      <div className="relative z-10 w-full max-w-md">


        {/* ================================================= */}
        {/* LOGO / NOME */}
        {/* ================================================= */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center">

            <span className="text-white text-xl font-bold">
              CD
            </span>

          </div>


          <h1 className="text-white text-3xl font-bold">

            Controle
            <span className="text-orange-400">
              Dívidas
            </span>

          </h1>


          <p className="text-gray-400 text-sm mt-2">
            Controle suas dívidas de forma simples.
          </p>

        </div>


        {/* ================================================= */}
        {/* CARD LOGIN */}
        {/* ================================================= */}

        <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">

          <h2 className="text-white text-2xl font-semibold">
            Entrar
          </h2>

          <p className="text-gray-400 text-sm mt-1 mb-6">
            Entre na sua conta para continuar.
          </p>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* ================================================= */}
            {/* E-MAIL */}
            {/* ================================================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                E-mail
              </label>


              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
                className="w-full h-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
              />

            </div>


            {/* ================================================= */}
            {/* SENHA */}
            {/* ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Senha
              </label>


              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  className="w-full h-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 px-4 pr-24 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2"
                >

                  {showPassword
                    ? "Ocultar"
                    : "Mostrar"}

                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* ESQUECI A SENHA */}
            {/* ================================================= */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={() =>
                  alert("Recuperação de senha será conectada ao backend.")
                }
                className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
              >
                Esqueci minha senha
              </button>

            </div>


            {/* ================================================= */}
            {/* BOTÃO ENTRAR */}
            {/* ================================================= */}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-all active:scale-[0.98]"
            >
              Entrar
            </button>

          </form>


          {/* ================================================= */}
          {/* CADASTRO */}
          {/* ================================================= */}

          <div className="mt-7 pt-6 border-t border-white/10 text-center">

            <p className="text-gray-400 text-sm">
              Ainda não possui uma conta?
            </p>


            <Link
              to="/cadastro"
              className="inline-block mt-2 text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors"
            >
              Criar minha conta
            </Link>

          </div>

        </div>


        {/* ================================================= */}
        {/* RODAPÉ */}
        {/* ================================================= */}

        <p className="text-gray-500 text-xs text-center mt-6">
          © Direitos reservados Bruno Ferreira
        </p>

      </div>

    </div>

  );

}