// src/lib/modules/auth/service.js
import { api } from '../../../api/client';

export const authService = {
  async login(credenciais) {
    const resposta = await api.post('/auth/login', credenciais);
    if (resposta && resposta.token) {
      localStorage.setItem('scleenkr_token', resposta.token);
    }
    return resposta;
  },

  async logout() {
    try {
    } catch (erro) {
      console.error("Erro ao invalidar token no backend:", erro);
    } finally {
      // OBRIGATÓRIO: Remove o token localmente, bloqueando o acesso do usuário
      localStorage.removeItem('scleenkr_token');
    }
  }
};