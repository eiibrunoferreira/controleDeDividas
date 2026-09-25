import { useState } from "react";
import { Link } from "react-router-dom";

import backgroundImage from "/images/background.png";


export default function Cadastro() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // =========================================================
  // CADASTRO
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (password !== confirmPassword) {

      alert("As senhas não são iguais.");

      return;

    }


    try {

      const response = await fetch("https://controlededividas.onrender.com/users/register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),

      });


      const data = await response.json();


      if (!response.ok) {

        alert(data.error || "Não foi possível criar a conta.");

        return;

      }


      console.log("Usuário criado:", data);

      alert("Conta criada com sucesso!");

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
            Crie sua conta e comece a se organizar.
          </p>

        </div>


        {/* ================================================= */}
        {/* CARD CADASTRO */}
        {/* ================================================= */}

        <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">

          <h2 className="text-white text-2xl font-semibold">
            Criar conta
          </h2>

          <p className="text-gray-400 text-sm mt-1 mb-6">
            Preencha seus dados abaixo.
          </p>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            {/* ================================================= */}
            {/* NOME */}
            {/* ================================================= */}

            <div>

              <label
                htmlFor="name"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Nome
              </label>


              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Digite seu nome"
                autoComplete="name"
                required
                className="w-full h-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
              />

            </div>


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
                  placeholder="Crie sua senha"
                  autoComplete="new-password"
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
            {/* CONFIRMAR SENHA */}
            {/* ================================================= */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Confirmar senha
              </label>


              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  required
                  className="w-full h-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 px-4 pr-24 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2"
                >

                  {showConfirmPassword
                    ? "Ocultar"
                    : "Mostrar"}

                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* BOTÃO CADASTRAR */}
            {/* ================================================= */}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-all active:scale-[0.98] mt-2"
            >
              Criar conta
            </button>

          </form>


          {/* ================================================= */}
          {/* VOLTAR PARA LOGIN */}
          {/* ================================================= */}

          <div className="mt-7 pt-6 border-t border-white/10 text-center">

            <p className="text-gray-400 text-sm">
              Já possui uma conta?
            </p>


            <Link
              to="/"
              className="inline-block mt-2 text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors"
            >
              Voltar para o login
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
