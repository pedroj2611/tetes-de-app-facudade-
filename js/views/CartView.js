/**
 * ==========================================================================
 * VIEW LAYER - CART VIEW (src/js/views/CartView.js)
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";

export class CartView {
  constructor() {
    this.carrinhoQtd = document.getElementById("carrinho-qtd");
    this.carrinhoResumo = document.getElementById("carrinho-resumo-texto");
    this.carrinhoTotal = document.getElementById("carrinho-total-valor");

    this.listaModal = document.getElementById("pedido-itens-lista");
    this.modalSubtotalValor = document.getElementById("modal-subtotal-valor");
    this.modalTaxaValor = document.getElementById("modal-taxa-valor");
    this.modalValorTotal = document.getElementById("modal-valor-total");
  }

  atualizarDock(totais) {
    if (this.carrinhoQtd) this.carrinhoQtd.textContent = totais.totalQtd;
    if (this.carrinhoResumo) {
      this.carrinhoResumo.textContent = totais.totalQtd === 0 
        ? "Nenhum item selecionado" 
        : `${totais.totalQtd} ${totais.totalQtd === 1 ? "item selecionado" : "itens selecionados"}`;
    }
    if (this.carrinhoTotal) this.carrinhoTotal.textContent = formatarPreco(totais.subtotalValor);
  }

  renderizarModalItens(carrinho, totais) {
    if (this.listaModal) {
      if (carrinho.length === 0) {
        this.listaModal.innerHTML = `
          <div style="text-align: center; padding: 20px 14px; color: #64748b; background: #fff5f5; border-radius: var(--radius-md); border: 1.5px dashed #fca5a5; margin-bottom: 16px;">
            <span style="font-size: 2.2rem; display: block; margin-bottom: 4px;">🛒</span>
            <p style="font-size: 1.05rem; font-weight: 800; color: #991b1b; margin-bottom: 4px;">Seu carrinho está vazio</p>
            <p style="font-size: 0.84rem; color: #7f1d1d; margin-bottom: 12px;">Selecione produtos deliciosos no cardápio antes de enviar o pedido.</p>
            <button type="button" id="btn-modal-escolher-prod" class="btn-pedir-card" style="padding: 8px 16px; font-size: 0.84rem;">+ Escolher Produtos no Cardápio</button>
          </div>
        `;
      } else {
        this.listaModal.innerHTML = carrinho.map(item => `
          <div class="modal-item-linha">
            <div class="modal-item-detalhes">
              <div class="modal-item-nome">${item.icone || '🍽️'} ${item.nome}</div>
              <div class="modal-item-unit">${item.quantidade}x de ${formatarPreco(item.preco)}</div>
            </div>
            <div class="stepper-box">
              <button class="btn-step btn-modal-diminuir" data-id="${item.id}" title="Diminuir" aria-label="Diminuir">-</button>
              <span class="step-valor">${item.quantidade}</span>
              <button class="btn-step btn-modal-aumentar" data-id="${item.id}" title="Aumentar" aria-label="Aumentar">+</button>
            </div>
            <div class="modal-item-subtotal">${formatarPreco(item.preco * item.quantidade)}</div>
          </div>
        `).join("");
      }
    }

    if (this.modalSubtotalValor) this.modalSubtotalValor.textContent = formatarPreco(totais.subtotalValor);
    if (this.modalTaxaValor) this.modalTaxaValor.textContent = formatarPreco(totais.taxaEntrega);
    if (this.modalValorTotal) this.modalValorTotal.textContent = formatarPreco(totais.totalGeral);
  }
}
