/**
 * ==========================================================================
 * VIEW LAYER - TOAST & CONFIRMATION VIEW (src/js/views/ToastView.js)
 * ==========================================================================
 */

export class ToastView {
  static mostrarToast(mensagem, icone = "✅") {
    let toast = document.getElementById("toast");
    if (!toast) return;

    // Se houver algum <dialog> aberto no top-layer, insere dentro dele para não ficar oculto
    const modalAberto = document.querySelector("dialog[open]");
    if (modalAberto) {
      if (toast.parentElement !== modalAberto) {
        modalAberto.appendChild(toast);
      }
    } else {
      if (toast.parentElement !== document.body) {
        document.body.appendChild(toast);
      }
    }

    toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;
    toast.classList.add("show");

    clearTimeout(toast.tempo);
    toast.tempo = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  static solicitarConfirmacao(titulo, mensagem, icone, acao) {
    const modalConf = document.getElementById("modal-confirmacao");
    const elTitulo = document.getElementById("confirm-titulo");
    const elMensagem = document.getElementById("confirm-mensagem");
    const elIcone = document.getElementById("confirm-icon");

    if (!modalConf) {
      if (confirm(mensagem)) acao();
      return;
    }

    if (elTitulo) elTitulo.textContent = titulo;
    if (elMensagem) elMensagem.textContent = mensagem;
    if (elIcone) elIcone.textContent = icone || "⚠️";

    window.acaoConfirmacaoPendente = acao;

    if (typeof modalConf.showModal === "function") {
      modalConf.showModal();
    } else {
      modalConf.setAttribute("open", "true");
    }
    document.body.classList.add("modal-aberto");
  }

  static fecharModalConfirmacao() {
    const modalConf = document.getElementById("modal-confirmacao");
    if (modalConf) {
      if (typeof modalConf.close === "function") modalConf.close();
      else modalConf.removeAttribute("open");
    }
    window.acaoConfirmacaoPendente = null;
    const modaisAbertos = document.querySelectorAll("dialog[open]");
    if (modaisAbertos.length === 0) {
      document.body.classList.remove("modal-aberto");
    }
  }
}
