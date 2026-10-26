
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://controlededividas.onrender.com";
const STORAGE_KEY = "@saved_accounts";

export default function Cadastro() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Informe seu nome.";
    }

    if (!email.trim()) {
      newErrors.email = "Informe seu e-mail.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (!password) {
      newErrors.password = "Informe uma senha.";
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não são iguais.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    setModal({ type: "loading" });

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setModal({
          type: "error",
          title: "Não foi possível criar a conta",
          message:
            response.status === 409
              ? "Este e-mail já está cadastrado. Tente entrar ou utilize outro e-mail."
              : data.error || "Verifique os dados e tente novamente.",
        });

        return;
      }

      /*
       * Monta o perfil com os dados retornados pelo backend,
       * usando os dados do formulário como alternativa.
       */
      const usuario = data.user || data.usuario || data;

      const novoPerfil = {
        id:
          usuario.id ||
          usuario._id ||
          usuario.userId ||
          email.trim().toLowerCase(),
        name: usuario.name || name.trim(),
        email: (usuario.email || email.trim()).toLowerCase(),
        profileImage: usuario.profileImage || null,
      };

      /*
       * Atualiza a lista de perfis da tela inicial.
       * Se o e-mail já existir, substitui o registro.
       */
      let contasSalvas = [];

      try {
        const armazenadas = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (Array.isArray(armazenadas)) {
          contasSalvas = armazenadas;
        }
      } catch {
        contasSalvas = [];
      }

      const contasAtualizadas = [
        ...contasSalvas.filter(
          (conta) =>
            conta.email?.toLowerCase() !== novoPerfil.email
        ),
        novoPerfil,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(contasAtualizadas)
      );

      setModal({
        type: "success",
        title: "Conta criada com sucesso!",
        message:
          "Sua conta foi criada e adicionada à lista de perfis.",
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      setModal({
        type: "error",
        title: "Erro de conexão",
        message:
          "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (modal?.type === "success") {
      navigate("/");
      return;
    }

    setModal(null);
  };

  const inputClass = (field) =>
    `w-full h-12 rounded-xl bg-[#161616] border ${
      errors[field]
        ? "border-red-500"
        : "border-white/10 focus:border-[#138e92]"
    } text-white placeholder:text-gray-500 px-4 outline-none focus:ring-2 ${
      errors[field]
        ? "focus:ring-red-500/20"
        : "focus:ring-[#138e92]/20"
    } transition-all`;

  return (
<div className="min-h-screen w-full bg-[#161616] text-white flex flex-col items-center justify-start px-5 pt-12 pb-8 sm:justify-center sm:py-8">      <main className="relative z-10 w-full max-w-md">
        {/* Cabeçalho */}
        <header className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold">
            Controle
            <span className="text-[#138e92]"> Dívidas</span>
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Controle suas dívidas de forma simples.
          </p>
        </header>

        {/* Card de cadastro */}
        <section className="bg-[#0e0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-white text-2xl font-semibold">
            Criar conta
          </h2>

          <p className="text-gray-400 text-sm mt-1 mb-6">
            Preencha seus dados para começar.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Nome */}
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
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    name: "",
                  }));
                }}
                placeholder="Digite seu nome"
                autoComplete="name"
                disabled={loading}
                className={inputClass("name")}
              />

              {errors.name && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* E-mail */}
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
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    email: "",
                  }));
                }}
                placeholder="Digite seu e-mail"
                autoComplete="email"
                disabled={loading}
                className={inputClass("email")}
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      password: "",
                      confirmPassword: "",
                    }));
                  }}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${inputClass("password")} pr-24`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      confirmPassword: "",
                    }));
                  }}
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${inputClass("confirmPassword")} pr-24`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2"
                >
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#138e92] hover:bg-[#10777a] text-white font-semibold transition-all active:scale-[0.98] shadow-lg shadow-[#138e92]/15 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          {/* Voltar */}
          <div className="mt-7 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Já possui uma conta?
            </p>

            <Link
              to="/"
              className="inline-block mt-2 text-[#138e92] hover:text-[#19adb1] font-semibold text-sm transition-colors"
            >
              Voltar para a tela inicial
            </Link>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="text-gray-500 text-xs text-center mt-6">
          © Direitos reservados Bruno Ferreira
        </footer>
      </main>

      {/* Modal de carregamento, sucesso ou erro */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-5 py-6"
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-sm bg-[#0e0d0d] border border-white/10 rounded-3xl p-7 shadow-2xl text-center"
          >
            {modal.type === "loading" ? (
              <>
                <div className="mx-auto mb-5 w-14 h-14 rounded-full border-4 border-white/10 border-t-[#138e92] animate-spin" />

                <h2
                  id="modal-title"
                  className="text-white text-xl font-semibold"
                >
                  Criando sua conta
                </h2>

                <p className="text-gray-400 text-sm mt-3">
                  Aguarde enquanto processamos seus dados...
                </p>
              </>
            ) : (
              <>
                <div
                  className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center ${
                    modal.type === "success"
                      ? "bg-[#138e92]/15 text-[#138e92]"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {modal.type === "success" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-7 h-7"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="text-2xl font-bold">!</span>
                  )}
                </div>

                <h2
                  id="modal-title"
                  className="text-white text-xl font-semibold"
                >
                  {modal.title}
                </h2>

                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {modal.message}
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full h-12 mt-7 rounded-xl bg-[#138e92] hover:bg-[#10777a] text-white font-semibold transition-all active:scale-[0.98]"
                >
                  OK
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
