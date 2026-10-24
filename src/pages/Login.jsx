import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebts } from "../context/useDebts";


export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { loadDebts } = useDebts();

  useEffect(() => {

  const token =
    localStorage.getItem("@auth_token") ||
    sessionStorage.getItem("@auth_token");

  if (!token) {
    return;
  }

  const enterAutomatically = async () => {

    await loadDebts();

    navigate("/home");

  };

  enterAutomatically();

}, [loadDebts, navigate]);


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

localStorage.removeItem("@auth_token");
sessionStorage.removeItem("@auth_token");

if (rememberMe) {

  localStorage.setItem(
    "@auth_token",
    data.token
  );

} else {

  sessionStorage.setItem(
    "@auth_token",
    data.token
  );

}

await loadDebts();

navigate("/home");


    } catch (error) {

      console.error(error);

      alert("Não foi possível conectar ao servidor.");

    }

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (

    <div className="min-h-screen w-full bg-[#161616] relative overflow-hidden flex items-center justify-center px-5 py-8">


      {/* ================================================= */}
      {/* CONTEÚDO */}
      {/* ================================================= */}

      <div className="relative z-10 w-full max-w-md">


        {/* ================================================= */}
        {/* LOGO / NOME */}
        {/* ================================================= */}

        <div className="text-center mb-8">

        


          <h1 className="text-white text-3xl font-bold">

            Controle
<span className="text-[#138e92]">              Dívidas
            </span>

          </h1>


          <p className="text-gray-400 text-sm mt-2">
            Controle suas dívidas de forma simples.
          </p>

        </div>


        {/* ================================================= */}
        {/* CARD LOGIN */}
        {/* ================================================= */}

        <div className="bg-[#0e0d0d] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">

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
className="w-full h-12 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-gray-500 px-4 outline-none focus:border-[#138e92] focus:ring-2 focus:ring-[#138e92]/20 transition-all"              />

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
className="w-full h-12 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-gray-500 px-4 pr-24 outline-none focus:border-[#138e92] focus:ring-2 focus:ring-[#138e92]/20 transition-all"                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2 transition-colors"
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

            <div className="flex items-center justify-between gap-3">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
className="w-4 h-4 accent-[#138e92]"                />

                <span className="text-gray-400 text-sm">
                  Lembrar de mim
                </span>

              </label>


              <button
                type="button"
                onClick={() =>
                  alert("Recuperação de senha será conectada ao backend.")
                }
className="text-[#138e92] hover:text-[#19adb1] text-sm transition-colors"              >
                Esqueci minha senha
              </button>

            </div>


            {/* ================================================= */}
            {/* BOTÃO ENTRAR */}
            {/* ================================================= */}

            <button
              type="submit"
className="w-full h-12 rounded-xl bg-[#138e92] hover:bg-[#10777a] text-white font-semibold transition-all active:scale-[0.98] shadow-lg shadow-[#138e92]/15"            >
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
className="inline-block mt-2 text-[#138e92] hover:text-[#19adb1] font-semibold text-sm transition-colors"            >
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