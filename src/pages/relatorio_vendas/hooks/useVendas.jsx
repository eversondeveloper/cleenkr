import { useState, useEffect, useCallback, useMemo } from 'react';

const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_LIMPAR_PERIODO = "http://localhost:3000/vendas/deletar-periodo";
const URL_API_LIMPAR_TOTAL = "http://localhost:3000/limpar-dados/total";

export const useVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarVendas = useCallback(async (inicio = null, fim = null) => {
    setCarregando(true);
    setErro(null);
    try {
      let url = URL_API_VENDAS;
      const params = new URLSearchParams();
      if (inicio) params.append("inicio", inicio);
      if (fim) params.append("fim", fim);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

      const dados = await resposta.json();
      setVendas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
      setErro("Erro ao carregar dados. Verifique a conexão com a API.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // Lógica de Totais corrigida: O troco é apenas informativo e NÃO deduz o saldo.
  // O que deduz o saldo são as retiradas (sangrias).
  const totais = useMemo(() => {
    return vendas.reduce((acc, venda) => {
      const bruto = parseFloat(venda.valor_total_bruto || 0);
      const sangria = parseFloat(venda.valor_sangria || 0);
      const troco = parseFloat(venda.valor_troco || 0);

      acc.faturamentoBruto += bruto;
      acc.totalSangrias += sangria;
      acc.totalTrocosRegistrados += troco;
      // Saldo Líquido: Apenas Vendas menos as Retiradas (Sangrias).
      acc.saldoLiquido += (bruto - sangria);

      return acc;
    }, {
      faturamentoBruto: 0,
      totalSangrias: 0,
      totalTrocosRegistrados: 0,
      saldoLiquido: 0
    });
  }, [vendas]);

  const deletarVenda = useCallback(async (id) => {
    try {
      const resp = await fetch(`${URL_API_VENDAS}/${id}`, { method: "DELETE" });
      if (resp.ok) {
        await buscarVendas();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
      return false;
    }
  }, [buscarVendas]);

  const deletarTudoPorPeriodo = useCallback(async (inicio, fim) => {
    try {
      const resp = await fetch(URL_API_LIMPAR_PERIODO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idsVendas: [] }), 
      });
      
      if (resp.ok) {
        await buscarVendas(inicio, fim);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao deletar período em massa:", error);
      return false;
    }
  }, [buscarVendas]);

  const limparHistoricoTotal = useCallback(async () => {
    try {
      const resp = await fetch(URL_API_LIMPAR_TOTAL, {
        method: "DELETE",
      });
      
      if (resp.ok) {
        setVendas([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao limpar histórico total:", error);
      return false;
    }
  }, []);

  const atualizarPagamentosVenda = useCallback(async (idVenda, novosPagamentos) => {
    try {
        const vendaAtual = vendas.find(v => v.id_venda === idVenda);
        if (!vendaAtual) return false;

        const pagamentosParaEnviar = (novosPagamentos || []).map(p => ({
            metodo: String(p.metodo || "Dinheiro"),
            valor_pago: parseFloat(p.valor_pago ?? p.valorPago ?? 0),
            referencia_metodo: p.referencia_metodo ?? p.referenciaMetodo ?? ""
        }));

        const novoValorPagoTotal = pagamentosParaEnviar.reduce((acc, p) => acc + p.valor_pago, 0);
        const valorBruto = parseFloat(vendaAtual.valor_total_bruto || 0);
        const novoTroco = Math.max(0, novoValorPagoTotal - valorBruto);

        const payload = { 
            pagamentos: pagamentosParaEnviar,
            valor_pago_total: novoValorPagoTotal,
            valor_troco: novoTroco
        };
        
        const resposta = await fetch(`${URL_API_VENDAS}/${idVenda}/pagamentos`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (resposta.ok) {
          await buscarVendas();
          return true;
        }
        return false;
    } catch (error) {
        console.error("Erro ao atualizar pagamentos:", error);
        return false;
    }
  }, [vendas, buscarVendas]);

  const atualizarVenda = useCallback(async (idVenda, dadosVenda) => {
    try {
        const resposta = await fetch(`${URL_API_VENDAS}/${idVenda}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosVenda),
        });

        if (resposta.ok) {
          await buscarVendas();
          return true;
        }
        return false;
    } catch (error) {
        console.error("Erro ao atualizar venda:", error);
        return false;
    }
  }, [buscarVendas]);

  useEffect(() => {
    buscarVendas();
  }, [buscarVendas]);

  return {
    vendas,
    totais, // Agora você tem totais.saldoLiquido e totais.faturamentoBruto prontos
    carregando,
    erro,
    buscarVendas,
    deletarVenda,
    deletarTudoPorPeriodo,
    limparHistoricoTotal,
    atualizarPagamentosVenda,
    atualizarVenda,
  };
};