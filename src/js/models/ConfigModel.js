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
      if (!salvos) {
        localStorage.setItem("cardapio_pro_config", JSON.stringify(CONFIG_PADRAO));
        return { ...CONFIG_PADRAO };
      }
      const config = JSON.parse(salvos);
      // Garante atualização do número oficial do WhatsApp se for o genérico antigo
      if (!config.whatsapp || config.whatsapp === "5579999999999") {
        config.whatsapp = CONFIG_PADRAO.whatsapp;
        localStorage.setItem("cardapio_pro_config", JSON.stringify(config));
      }
      return config;
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
