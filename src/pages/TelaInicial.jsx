
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebts } from "../context/useDebts";

const STORAGE_KEY = "@saved_accounts";
const API_URL = "https://controlededividas.onrender.com";

export default function TelaInicial() {
  const navigate = useNavigate();
  const { loadDebts } = useDebts();

  const [contasSalvas, setContasSalvas] = useState(() => {
    try {
      const contas = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(contas) ? contas : [];
    } catch {
      return [];
    }
  });


  useEffect(() => {
  const atualizarPerfis = () => {
    try {
      const contas = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      setContasSalvas(
        Array.isArray(contas) ? contas : []
      );
    } catch (error) {
      console.error("Erro ao carregar perfis salvos:", error);
      setContasSalvas([]);
    }
  };

  atualizarPerfis();

  window.addEventListener(
    "savedAccountsUpdated",
    atualizarPerfis
  );

  window.addEventListener("focus", atualizarPerfis);

  return () => {
    window.removeEventListener(
      "savedAccountsUpdated",
      atualizarPerfis
    );

    window.removeEventListener("focus", atualizarPerfis);
  };
}, []);


  const carrosselRef = useRef(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const totalSlides = contasSalvas.length + 1;

  

const atualizarSlide = useCallback(() => {
  const carrossel = carrosselRef.current;

  if (!carrossel) return;

  const largura = carrossel.clientWidth;

  if (largura <= 0) return;

  const scrollLeft = carrossel.scrollLeft;
  const indice = Math.round(scrollLeft / largura);

  setIndiceAtivo((anterior) =>
    anterior === indice ? anterior : indice
  );
}, []);



  useEffect(() => {
    atualizarSlide();

    const carrossel = carrosselRef.current;

    if (!carrossel) return;

    const observer = new ResizeObserver(atualizarSlide);
    observer.observe(carrossel);

    return () => observer.disconnect();
  }, [atualizarSlide, contasSalvas.length]);

  const irParaSlide = (indice) => {
    carrosselRef.current?.scrollTo({
      left: indice * carrosselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const [modalAberto, setModalAberto] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const modalRef = useRef(null);

  
  

  
  // Bloqueia a rolagem do fundo enquanto o modal estiver aberto.
  useEffect(() => {
    if (!modalAberto) return;

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    

    const bloquearFundo = (event) => {
  if (
    event.target instanceof Element &&
    event.target.closest(".modal-scroll-content")
  ) {
    const modal = modalRef.current;

    if (modal && modal.contains(event.target)) {
      return;
    }
  }

  event.preventDefault();
};

    document.addEventListener("touchmove", bloquearFundo, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = overflowAnterior;

      document.removeEventListener("touchmove", bloquearFundo);
    };
  }, [modalAberto]);

  // Ajusta o modal ao abrir ou fechar o teclado.
  useEffect(() => {
    if (!modalAberto) return;

    const viewport = window.visualViewport;

    if (!viewport) return;

    const atualizarPosicaoModal = () => {
      const modal = modalRef.current;

      if (!modal) return;

      const tecladoAberto =
        viewport.height < window.innerHeight * 0.75;

        if (tecladoAberto) {
  document.body.style.overflow = "hidden";
} else {
  document.body.style.overflow = "";
}

      if (tecladoAberto) {
        const topSpace = 10;
const bottomSpace = 10;

        modal.style.position = "fixed";
        modal.style.maxHeight = "none";
        modal.style.left = "50%";
        modal.style.transform = "translateX(-50%)";
        modal.style.width = "calc(100% - 32px)";
        modal.style.marginTop = "0";
        modal.style.maxHeight =
          `${Math.max(160, viewport.height - topSpace - bottomSpace)}px`;
      } else {
        modal.style.position = "";
        modal.style.top = "";
        modal.style.left = "";
        modal.style.transform = "";
        modal.style.width = "";
        modal.style.marginTop = "";
        modal.style.maxHeight = "90vh";
      }
    };

    atualizarPosicaoModal();

    viewport.addEventListener("resize", atualizarPosicaoModal);
    viewport.addEventListener("scroll", atualizarPosicaoModal);

    return () => {
      viewport.removeEventListener("resize", atualizarPosicaoModal);
      viewport.removeEventListener("scroll", atualizarPosicaoModal);

      const modal = modalRef.current;

      if (modal) {
        modal.style.position = "";
        modal.style.top = "";
        modal.style.left = "";
        modal.style.transform = "";
        modal.style.width = "";
        modal.style.marginTop = "";
        modal.style.maxHeight = "";
      }
    };
  }, [modalAberto]);




  // Mantém o campo selecionado visível dentro do modal.
 
  const abrirModalAdicionar = () => {
    setContaSelecionada(null);
    setEmail("");
    setSenha("");
    setErro("");
    setMostrarSenha(false);
    setConfirmarExclusao(false);
    setModalAberto(true);
  };

  const abrirModalPerfil = (conta) => {
    setContaSelecionada(conta);
    setEmail(conta.email);
    setSenha("");
    setErro("");
    setMostrarSenha(false);
    setConfirmarExclusao(false);
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (carregando) return;

    setModalAberto(false);
    setContaSelecionada(null);
    setSenha("");
    setErro("");
    setMostrarSenha(false);
    setConfirmarExclusao(false);
  };

  const apagarConta = () => {
    if (!contaSelecionada || carregando) return;

    const contasAtualizadas = contasSalvas.filter(
      (conta) =>
        !(
          conta.email === contaSelecionada.email &&
          (
            conta.id == null ||
            contaSelecionada.id == null ||
            conta.id === contaSelecionada.id
          )
        )
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(contasAtualizadas)
    );

    setContasSalvas(contasAtualizadas);
    setConfirmarExclusao(false);
    setModalAberto(false);
    setContaSelecionada(null);
    setEmail("");
    setSenha("");
    setErro("");
    setMostrarSenha(false);

    const novoTotalSlides = contasAtualizadas.length + 1;
    const novoIndice = Math.min(
      indiceAtivo,
      novoTotalSlides - 1
    );

    setIndiceAtivo(novoIndice);

    requestAnimationFrame(() => {
      const carrossel = carrosselRef.current;

      if (!carrossel) return;

      carrossel.scrollTo({
        left: novoIndice * carrossel.clientWidth,
        behavior: "smooth",
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(
          data.error || "Não foi possível entrar na conta."
        );
        return;
      }

      
if (contaSelecionada) {
  const profileResponse = await fetch(
    `${API_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  if (!profileResponse.ok) {
    setErro(
      "Não foi possível carregar seu perfil atualizado."
    );
    return;
  }

  const profile = await profileResponse.json();

  const contasAtualizadas = contasSalvas.map((conta) => {
    const mesmoEmail =
      conta.email?.toLowerCase() ===
      profile.email?.toLowerCase();

    const mesmoId =
      conta.id != null &&
      profile.id != null &&
      String(conta.id) === String(profile.id);

    if (!mesmoEmail && !mesmoId) {
      return conta;
    }

    return {
      ...conta,
      id: profile.id ?? conta.id,
      name: profile.name ?? conta.name,
      email: profile.email ?? conta.email,
      profileImage: profile.profileImage ?? null,
    };
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(contasAtualizadas)
  );

  setContasSalvas(contasAtualizadas);

  localStorage.removeItem("@auth_token");
  sessionStorage.removeItem("@auth_token");

  sessionStorage.setItem("@auth_token", data.token);
  localStorage.setItem("@user_name", profile.name);

  if (profile.profileImage) {
    localStorage.setItem(
      "@user_profile_image",
      profile.profileImage
    );
  } else {
    localStorage.removeItem("@user_profile_image");
  }

  await loadDebts();

  setModalAberto(false);
  navigate("/home");
  return;
}


      const profileResponse = await fetch(
        `${API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      let profile = data.user;

      if (profileResponse.ok) {
        profile = await profileResponse.json();
      }

      const novaConta = {
        id: profile.id || data.user.id,
        name: profile.name || data.user.name,
        email: profile.email || data.user.email,
        profileImage:
          profile.profileImage ||
          localStorage.getItem("@user_profile_image") ||
          null,
      };

      const contasAtualizadas = [
        ...contasSalvas.filter(
          (conta) => conta.email !== novaConta.email
        ),
        novaConta,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(contasAtualizadas)
      );

      setContasSalvas(contasAtualizadas);

      localStorage.removeItem("@auth_token");
      sessionStorage.removeItem("@auth_token");
      localStorage.setItem("@user_name", novaConta.name);

      setModalAberto(false);
      setSenha("");
      setEmail("");
      setContaSelecionada(null);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
<div className="min-h-screen w-full bg-[#161616] text-white flex flex-col">     
<main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8">        {/* Cabeçalho */}
        <header className="text-center mb-14">
          <img
src={`${import.meta.env.BASE_URL}images/iconeApp.png`}  alt="Logo Controle de Dívidas"
  className="mx-auto mb-5 h-24 w-24 object-contain"
/>
          <h1 className="text-3xl font-bold">
            Controle
            <span className="text-[#ffffff]"> de Dívidas</span>
          </h1>

          <p className="text-gray-400 text-sm mt-3">
            Controle suas dívidas de forma simples.
          </p>
        </header>

        {/* Seleção de perfil */}
        <section>


          {/* Carrossel */}
          <div className="relative w-full">
           

            <div
              ref={carrosselRef}
              onScroll={atualizarSlide}
className="relative  z-10 flex w-full overflow-x-auto -mt-12 overflow-y-hidden overscroll-x-contain touch-pan-x snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"            >
              {contasSalvas.map((conta) => (
                <div
                  key={conta.id || conta.email}
                  className="w-full min-w-full shrink-0 snap-start flex justify-center px-2"
                >
<div className="flex max-w-full flex-col items-center gap-4 pt-8 pb-2 px-4">                  <div className="relative w-28 h-28 shrink-0">
  <span
    className="profile-pulse-ring"
    aria-hidden="true"
  />

  <button
                        type="button"
                        onClick={() => abrirModalPerfil(conta)}
                        aria-label={`Entrar no perfil ${conta.name || conta.email}`}
                        className="relative z-10 w-28 h-28 rounded-full overflow-hidden bg-[#090909] border-2 border-[#168F95] flex items-center justify-center shadow-lg shadow-[#168F95]/10 cursor-pointer transition-transform duration-300 ease-out hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168F95]"
                      >
                        {conta.profileImage ? (
                          <img
                            src={conta.profileImage}
                            alt={conta.name || "Foto do perfil"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-semibold text-[#168F95]">
                            {(conta.name || conta.email || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </button>
                    </div>

                    <span className="max-w-full truncate text-white text-lg font-semibold">
                      {conta.name || conta.email}
                    </span>

                    <span className="text-gray-500 text-sm">
                      Toque para entrar
                    </span>
                  </div>
                </div>
              ))}

              {/* Adicionar conta */}
              <div className="w-full min-w-full shrink-0 snap-start flex justify-center px-2">
<div className="flex max-w-full flex-col items-center gap-4 pt-8 pb-2 px-4">

  <div className="relative w-28 h-28 shrink-0">
  <span
    className="profile-pulse-ring"
    aria-hidden="true"
  />

  <button
                    type="button"
                    onClick={abrirModalAdicionar}
                    aria-label="Adicionar conta"
                    className="w-28 h-28 shrink-0 rounded-full bg-[#090909] border-2 border-dashed border-[#168F95] flex items-center justify-center text-[#168F95] cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:bg-[#168F95]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168F95]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    </button>
</div>

                  <span className="text-white text-lg font-semibold">
                    Adicionar conta
                  </span>
                  <span className="text-gray-500 text-sm">
                      Toque para adicionar uma conta
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores */}
          {totalSlides > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5">
              {Array.from({ length: totalSlides }).map((_, indice) => (
                <button
                  key={indice}
                  type="button"
                  aria-label={`Ir para ${
                    indice < contasSalvas.length
                      ? `o perfil ${contasSalvas[indice].name || contasSalvas[indice].email}`
                      : "adicionar conta"
                  }`}
                  aria-current={
                    indiceAtivo === indice ? "true" : undefined
                  }
                  onClick={() => irParaSlide(indice)}
                  className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                    indiceAtivo === indice
                      ? "w-6 bg-[#168F95]"
                      : "w-2 bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Rodapé */}
<footer className="mt-auto w-full rounded-t-[2rem] bg-[#168F95] px-6 pt-8 pb-7 text-center shadow-[0_-8px_30px_rgba(22,143,149,0.08)]">
  <p className="text-sm text-white/80">
    Não tem uma conta?
  </p>

  <Link
    to="/cadastro"
    className="mt-2 inline-block text-base font-semibold text-white transition-colors hover:text-white/80"
  >
    Cadastre-se agora
  </Link>

  <div className="mx-auto mt-6 mb-4 h-px w-16 bg-white/25" />

  <p className="text-xs text-white/70">
    © Direitos reservados Bruno Ferreira
  </p>
</footer>

      {/* Modal de autenticação */}
      {modalAberto && (
        

  
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 overflow-hidden backdrop-blur-sm"
  onMouseDown={(event) => {
    if (event.target === event.currentTarget) {
      fecharModal();
    }
  }}
>



          
  <section
  ref={modalRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="titulo-modal"
  className="w-full max-w-md max-h-[90vh] touch-none bg-[#0e0d0d] border border-white/10 rounded-3xl shadow-2xl"
>
  <div
    className="modal-scroll-content max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y p-6 sm:p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    style={{
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
    }}
  >

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2
                  id="titulo-modal"
                  className="text-white text-2xl font-semibold"
                >
                  {contaSelecionada
                    ? "Bem-vindo de volta!"
                    : "Adicionar conta"}
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  {contaSelecionada
                    ? `Entre na conta de ${contaSelecionada.name || contaSelecionada.email}.`
                    : "Entre com os dados da conta que deseja salvar."}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={carregando}
                aria-label="Fechar modal"
                className="text-gray-400 hover:text-white text-2xl leading-none disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!contaSelecionada && (
                <div>
                  <label
                    htmlFor="modal-email"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    E-mail
                  </label>

                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    required
                    className="w-full h-12 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-gray-500 px-4 outline-none focus:border-[#168F95] focus:ring-2 focus:ring-[#168F95]/20 transition-all"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="modal-senha"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="modal-senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                    className="w-full h-12 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-gray-500 px-4 pr-24 outline-none focus:border-[#168F95] focus:ring-2 focus:ring-[#168F95]/20 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-medium px-2 py-2"
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {erro && (
                <p role="alert" className="text-red-400 text-sm">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full h-12 rounded-xl bg-[#168F95] hover:bg-[#117b80] text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {carregando
                  ? "Aguarde..."
                  : contaSelecionada
                    ? "Entrar"
                    : "Salvar conta"}
              </button>

              <button
                type="button"
                onClick={fecharModal}
                disabled={carregando}
                className="w-full h-11 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </form>

            {/* Apagar conta */}
            {contaSelecionada && (
              <button
                type="button"
                onClick={() => setConfirmarExclusao(true)}
                disabled={carregando}
                className="w-full h-11 mt-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                Apagar perfil
              </button>
            )}
            </div>
          </section>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmarExclusao && contaSelecionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-5 py-6">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-exclusao"
            className="w-full max-w-sm bg-[#0e0d0d] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <h2
              id="titulo-exclusao"
              className="text-white text-xl font-semibold"
            >
              Apagar Perfil?
            </h2>

            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Tem certeza de que deseja apagar o perfil de{" "}
              <span className="text-white font-medium">
                {contaSelecionada.name || contaSelecionada.email}
              </span>
              ? Essa ação removerá o perfil salvo desta tela.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmarExclusao(false)}
                className="flex-1 h-11 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={apagarConta}
                disabled={carregando}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
