/**
 * ==========================================================================
 * MODEL LAYER - CONFIG MODEL (src/js/models/ConfigModel.js)
 * ==========================================================================
 */

export const CONFIG_PADRAO = {
  nomeLoja: "Sabor & Arte Gourmet",
  whatsapp: "5579999820686",
  taxaEntrega: 5.00,
  chavePix: "pix@saborearte.com.br"
};

export class ConfigModel {
  constructor() {
    this.config = this.carregarConfig();
  }

  carregarConfig() {
    try {
      const salvos = localStorage.getItem("cardapio_pro_config");
      if (!salvos) return { ...CONFIG_PADRAO };
      const parsed = JSON.parse(salvos);
      // Se tiver o número genérico antigo de teste, atualiza para o número do usuário
      if (parsed.whatsapp === "5579999999999") {
        parsed.whatsapp = CONFIG_PADRAO.whatsapp;
      }
      return { ...CONFIG_PADRAO, ...parsed };
    } catch (e) {
      return { ...CONFIG_PADRAO };
    }
  }

  salvarConfig(novosDados) {
    this.config = {
      ...this.config,
      ...novosDados
    };
    try {
      localStorage.setItem("cardapio_pro_config", JSON.stringify(this.config));
    } catch (e) {
      console.error("Erro ao salvar configurações:", e);
    }
  }

  obter() {
    return this.config;
  }
}
