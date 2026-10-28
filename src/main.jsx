
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DebtProvider } from "./context/DebtProvider";
import "./index.css";

const API_URL = "https://controlededividas.onrender.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DebtProvider>
      <App />
    </DebtProvider>
  </React.StrictMode>
);

// Aguarda os recursos do navegador terminarem de carregar.
const navegadorPronto =
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => {
        window.addEventListener("load", resolve, { once: true });
      });

// Elementos da splash screen.
const splash = document.getElementById("splash-screen");

async function verificarBackend() {
  while (true) {
    try {
      // Mantém a verificação ativa por até 2 minutos por tentativa.
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 120000);

      let response;

      try {
        response = await fetch(`${API_URL}/health`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error("Backend indisponível.");
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error("Backend ainda não está pronto.");
      }

      // Backend pronto: podemos continuar.
      return;
    } catch (error) {
      console.error("Erro ao verificar o backend:", error);

      if (!splash) {
        throw error;
      }

      // Mantém a splash visível e oferece uma nova tentativa.
      const conteudo = splash.querySelector(".splash-content");

      let mensagem = splash.querySelector("#splash-error");

      if (!mensagem) {
        mensagem = document.createElement("p");
        mensagem.id = "splash-error";
        mensagem.style.cssText =
          "max-width:280px;margin:0;padding:0 20px;" +
          "font:14px sans-serif;text-align:center;color:#ccc;";

        conteudo.appendChild(mensagem);
      }

      mensagem.textContent =
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

      let botao = splash.querySelector("#splash-retry");

      if (!botao) {
        botao = document.createElement("button");
        botao.id = "splash-retry";
        botao.type = "button";
        botao.textContent = "Tentar novamente";

        botao.style.cssText =
          "padding:12px 22px;border:0;border-radius:12px;" +
          "background:#168F95;color:white;font-size:14px;" +
          "font-weight:600;cursor:pointer;";

        conteudo.appendChild(botao);
      }

      // Aguarda o usuário solicitar outra tentativa.
      await new Promise((resolve) => {
        botao.addEventListener("click", resolve, { once: true });
      });

      mensagem.remove();
      botao.remove();
    }
  }
}

async function iniciarAplicativo() {
  if (!splash) {
    console.error("Splash screen não encontrada.");
    return;
  }

  try {
    // As duas condições precisam ser atendidas.
    await Promise.all([
      navegadorPronto,
      verificarBackend(),
    ]);

    splash.classList.add("fade-out");

    setTimeout(() => {
      splash.remove();
    }, 500);
  } catch (error) {
    console.error("Erro ao iniciar o aplicativo:", error);
  }
}

// A verificação começa imediatamente, sem esperar o navegador terminar.
iniciarAplicativo();
