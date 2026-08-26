/**
 * ==========================================================================
 * CONTROLLER LAYER - CHECKOUT CONTROLLER (src/js/controllers/CheckoutController.js)
 * ==========================================================================
 */

import { CartModel } from "../models/CartModel.js";
import { ConfigModel, CONFIG_PADRAO } from "../models/ConfigModel.js";
import { formatarPreco } from "../views/ProductView.js";
import { ToastView } from "../views/ToastView.js";

export class CheckoutController {
  constructor() {
    this.cartModel = new CartModel();
    this.configModel = new ConfigModel();

    this.listaItens = document.getElementById("checkout-itens-lista");
    this.subtotalEl = document.getElementById("checkout-subtotal-valor");
    this.taxaEl = document.getElementById("checkout-taxa-valor");
    this.totalEl = document.getElementById("checkout-valor-total");
    this.linhaTaxa = document.getElementById("linha-taxa-entrega");

    this.clienteNomeInput = document.getElementById("cliente-nome");
    this.tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
    this.clienteLocalInput = document.getElementById("cliente-local");
    this.rotuloLocal = document.getElementById("rotulo-local");
    this.formaPagamentoSelect = document.getElementById("forma-pagamento");
    this.grupoPix = document.getElementById("grupo-pix");
    this.grupoTroco = document.getElementById("grupo-troco");
    this.pedidoTrocoInput = document.getElementById("pedido-troco");
    this.pedidoObsInput = document.getElementById("pedido-obs");
  }

  iniciar() {
    this.configurarEventos();
    this.atualizarInterface();
  }

  atualizarInterface() {
    const config = this.configModel.obter();

    const elNomeLoja = document.getElementById("display-nome-loja");
    const elPixChave = document.getElementById("pix-chave-texto");
    if (elNomeLoja) elNomeLoja.textContent = config.nomeLoja;
    if (elPixChave) elPixChave.textContent = config.chavePix || CONFIG_PADRAO.chavePix;

    const itens = this.cartModel.obterItens();
    this.renderizarItens(itens);

    const tipoAtendimento = this.tipoAtendimentoSelect ? this.tipoAtendimentoSelect.value : "Delivery";
    const ehDelivery = (tipoAtendimento === "Delivery");
    const totais = this.cartModel.calcularTotais(config.taxaEntrega, ehDelivery);

    if (this.subtotalEl) this.subtotalEl.textContent = formatarPreco(totais.subtotalValor);
    if (this.taxaEl) this.taxaEl.textContent = formatarPreco(totais.taxaEntrega);
    if (this.totalEl) this.totalEl.textContent = formatarPreco(totais.totalGeral);
    if (this.linhaTaxa) this.linhaTaxa.style.display = ehDelivery ? "flex" : "none";
  }

  renderizarItens(itens) {
    if (!this.listaItens) return;

    if (itens.length === 0) {
      this.listaItens.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: #64748b;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🛒</span>
          <p style="font-size: 1.1rem; font-weight: 800; color: var(--dark); margin-bottom: 6px;">Seu carrinho está vazio</p>
          <p style="font-size: 0.85rem; margin-bottom: 16px;">Selecione opções do cardápio para fazer seu pedido.</p>
          <a href="index.html" class="btn-secundario-vazio" style="text-decoration: none; display: inline-block;">Ver Cardápio</a>
        </div>
      `;
      return;
    }

    this.listaItens.innerHTML = itens.map(item => `
      <div class="modal-item-linha">
        <div class="modal-item-detalhes">
          <div class="modal-item-nome">${item.icone || '🍽️'} ${item.nome}</div>
          <div class="modal-item-unit">${item.quantidade}x de ${formatarPreco(item.preco)}</div>
        </div>
        <div class="stepper-box">
          <button class="btn-step btn-checkout-diminuir" data-id="${item.id}" title="Diminuir" aria-label="Diminuir">-</button>
          <span class="step-valor">${item.quantidade}</span>
          <button class="btn-step btn-checkout-aumentar" data-id="${item.id}" title="Aumentar" aria-label="Aumentar">+</button>
        </div>
        <div class="modal-item-subtotal">${formatarPreco(item.preco * item.quantidade)}</div>
      </div>
    `).join("");
  }

  configurarEventos() {
    // Steppers da lista de itens
    if (this.listaItens) {
      this.listaItens.addEventListener("click", (e) => {
        const btnAumentar = e.target.closest(".btn-checkout-aumentar");
        const btnDiminuir = e.target.closest(".btn-checkout-diminuir");

        if (btnAumentar) {
          const id = parseInt(btnAumentar.dataset.id);
          this.cartModel.alterarQuantidade(id, 1);
          this.atualizarInterface();
        } else if (btnDiminuir) {
          const id = parseInt(btnDiminuir.dataset.id);
          this.cartModel.alterarQuantidade(id, -1);
          this.atualizarInterface();
        }
      });
    }

    // Botão Limpar
    const btnLimpar = document.getElementById("btn-limpar-checkout");
    if (btnLimpar) {
      btnLimpar.addEventListener("click", () => {
        if (this.cartModel.obterItens().length === 0) return;
        ToastView.solicitarConfirmacao(
          "Esvaziar Carrinho?",
          "Deseja remover todos os itens selecionados do seu pedido?",
          "🧹",
          () => {
            this.cartModel.limpar();
            this.atualizarInterface();
            ToastView.fecharModalConfirmacao();
            ToastView.mostrarToast("Carrinho esvaziado!", "🧹");
          }
        );
      });
    }

    // Select Tipo Atendimento
    if (this.tipoAtendimentoSelect) {
      this.tipoAtendimentoSelect.addEventListener("change", () => {
        const tipo = this.tipoAtendimentoSelect.value;
        if (tipo === "Delivery") {
          if (this.rotuloLocal) this.rotuloLocal.textContent = "Endereço Completo de Entrega *";
          if (this.clienteLocalInput) {
            this.clienteLocalInput.placeholder = "Rua, Número, Bairro, Ponto de Referência";
            this.clienteLocalInput.required = true;
          }
        } else if (tipo === "Mesa") {
          if (this.rotuloLocal) this.rotuloLocal.textContent = "Número da Mesa *";
          if (this.clienteLocalInput) {
            this.clienteLocalInput.placeholder = "Ex: Mesa 05";
            this.clienteLocalInput.required = true;
          }
        } else {
          if (this.rotuloLocal) this.rotuloLocal.textContent = "Ponto de Retirada";
          if (this.clienteLocalInput) {
            this.clienteLocalInput.placeholder = "Retirada no Balcão do Restaurante";
            this.clienteLocalInput.required = false;
          }
        }
        this.atualizarInterface();
      });
    }

    // Select Forma Pagamento
    if (this.formaPagamentoSelect) {
      this.formaPagamentoSelect.addEventListener("change", () => {
        const forma = this.formaPagamentoSelect.value;
        if (this.grupoPix) this.grupoPix.style.display = (forma === "PIX") ? "block" : "none";
        if (this.grupoTroco) this.grupoTroco.style.display = (forma === "Dinheiro") ? "block" : "none";
      });
    }

    // Copiar PIX
    const btnCopiarPix = document.getElementById("btn-copiar-pix");
    if (btnCopiarPix) {
      btnCopiarPix.addEventListener("click", () => {
        const chave = this.configModel.obter().chavePix || CONFIG_PADRAO.chavePix;
        navigator.clipboard.writeText(chave).then(() => {
          ToastView.mostrarToast("Chave PIX copiada!", "⚡");
        }).catch(() => {
          ToastView.mostrarToast("Chave: " + chave, "📋");
        });
      });
    }

    // Botão Enviar Pedido via WhatsApp
    const btnEnviarWhats = document.getElementById("btn-enviar-whatsapp");
    if (btnEnviarWhats) {
      btnEnviarWhats.addEventListener("click", () => this.finalizarPedidoWhatsApp());
    }

    // Modal Confirmação
    const btnCancelConfirm = document.getElementById("btn-confirm-cancelar");
    const btnOkConfirm = document.getElementById("btn-confirm-ok");
    if (btnCancelConfirm) btnCancelConfirm.addEventListener("click", ToastView.fecharModalConfirmacao);
    if (btnOkConfirm) {
      btnOkConfirm.addEventListener("click", () => {
        if (typeof window.acaoConfirmacaoPendente === "function") {
          window.acaoConfirmacaoPendente();
        } else {
          ToastView.fecharModalConfirmacao();
        }
      });
    }
  }

  finalizarPedidoWhatsApp() {
    const itens = this.cartModel.obterItens();
    if (itens.length === 0) {
      ToastView.mostrarToast("Seu carrinho está vazio!", "⚠️");
      return;
    }

    const nome = this.clienteNomeInput ? this.clienteNomeInput.value.trim() : "";
    const tipo = this.tipoAtendimentoSelect ? this.tipoAtendimentoSelect.value : "Delivery";
    const local = this.clienteLocalInput ? this.clienteLocalInput.value.trim() : "";
    const pagamento = this.formaPagamentoSelect ? this.formaPagamentoSelect.value : "PIX";
    const troco = this.pedidoTrocoInput ? this.pedidoTrocoInput.value.trim() : "";
    const obs = this.pedidoObsInput ? this.pedidoObsInput.value.trim() : "";

    if (!nome) {
      ToastView.mostrarToast("Informe seu nome completo!", "⚠️");
      if (this.clienteNomeInput) this.clienteNomeInput.focus();
      return;
    }

    if (tipo !== "Balcão" && !local) {
      ToastView.mostrarToast("Informe o endereço de entrega ou mesa!", "⚠️");
      if (this.clienteLocalInput) this.clienteLocalInput.focus();
      return;
    }

    const config = this.configModel.obter();
    const ehDelivery = (tipo === "Delivery");
    const { subtotalValor, taxaEntrega, totalGeral } = this.cartModel.calcularTotais(config.taxaEntrega, ehDelivery);
    const agora = new Date().toLocaleString("pt-BR");

    let texto = `*🍽️ NOVO PEDIDO - ${config.nomeLoja.toUpperCase()}*\n`;
    texto += `_Data/Hora: ${agora}_\n`;
    texto += `----------------------------------------\n`;
    texto += `👤 *Cliente:* ${nome}\n`;
    texto += `📍 *Atendimento:* ${tipo} ${local ? `(${local})` : ''}\n`;
    texto += `💳 *Forma de Pagamento:* ${pagamento}\n`;
    if (pagamento === "Dinheiro" && troco) {
      texto += `💵 *Troco para:* ${troco}\n`;
    }
    texto += `----------------------------------------\n`;
    texto += `📋 *ITENS DO PEDIDO:*\n`;

    itens.forEach(it => {
      texto += `• ${it.quantidade}x ${it.nome} - ${formatarPreco(it.preco * it.quantidade)}\n`;
    });

    texto += `----------------------------------------\n`;
    texto += `💰 *Subtotal:* ${formatarPreco(subtotalValor)}\n`;
    if (ehDelivery) {
      texto += `🛵 *Taxa de Entrega:* ${formatarPreco(taxaEntrega)}\n`;
    }
    texto += `✨ *TOTAL A PAGAR:* ${formatarPreco(totalGeral)}\n`;
    texto += `----------------------------------------\n`;

    if (obs) {
      texto += `📝 *Observações:* ${obs}\n`;
    }

    const numeroWhats = config.whatsapp || CONFIG_PADRAO.whatsapp;
    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");

    ToastView.solicitarConfirmacao(
      "Pedido Enviado!",
      "Seu pedido foi enviado para o WhatsApp. Deseja limpar o carrinho agora?",
      "📲",
      () => {
        this.cartModel.limpar();
        this.atualizarInterface();
        ToastView.fecharModalConfirmacao();
      }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkout = new CheckoutController();
  checkout.iniciar();
});
