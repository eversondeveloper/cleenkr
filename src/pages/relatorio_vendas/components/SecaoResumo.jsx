import React from 'react';

export const SecaoResumo = ({
  filtroDataInicio,
  filtroDataFim,
  filtroMetodosPagamento,
  quantidadeVendas,
  totalVendasBruto,
  totalValorPago,
  totalTroco,
  totalRetiradas,
  totalLiquido,
  totaisPorMetodo,
  dadosEmpresa,
}) => {
  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const periodoTexto = (filtroDataInicio || filtroDataFim)
    ? `${formatarData(filtroDataInicio) || "Início"} ${filtroDataFim ? `à ${formatarData(filtroDataFim)}` : ''}`
    : "Todas as datas";

  const seguro = (valor) => parseFloat(valor || 0);

  return (
    <div className="bg-card p-5 mb-[30px] rounded-lg w-full text-foreground shadow-md border border-border box-border">
      
      {/* CABEÇALHO DA EMPRESA */}
      {dadosEmpresa && (
        <div className="pb-4 mb-[25px] border-b border-border w-full">
          <h2 className="mb-1 text-[18px] font-medium text-[#4180B9]">
            {dadosEmpresa.nome_fantasia || dadosEmpresa.razao_social || "EMPRESA NÃO CADASTRADA"}
          </h2>
          <p className="text-[12px] my-0.5 text-muted-foreground">
            {dadosEmpresa.cnpj && `CNPJ: ${dadosEmpresa.cnpj} `}
            {dadosEmpresa.telefone && `| Tel: ${dadosEmpresa.telefone}`}
          </p>
          <p className="font-bold text-[14px] mt-4 pt-2.5 border-t border-border tracking-normal">
            RELATÓRIO FINANCEIRO DETALHADO
          </p>
          <p className="text-[12px] text-muted-foreground mt-1">
            Período: {periodoTexto}
          </p>
        </div>
      )}

      {/* INFO DE FILTROS APLICADOS */}
      <div className="flex flex-col mb-4 pb-4 border-b border-dashed border-border gap-2.5">
        <div className="text-[13px] text-muted-foreground">
          <strong className="text-foreground font-bold mr-1">Filtros de Pagamento:</strong>
          {filtroMetodosPagamento.length > 0
            ? filtroMetodosPagamento.join(", ")
            : "Todos os métodos"}
        </div>
        <div className="text-[14px] text-foreground font-medium">
          Total de Vendas no Período: <span className="text-success font-bold mx-0.5">{quantidadeVendas}</span> registro(s)
        </div>
      </div>

      {/* FLUXO DE CAIXA (GRID FINANCEIRO) */}
      <div className="bg-background p-5 rounded-lg border border-border">
        <div className="text-foreground mb-4 font-bold text-[14px]">
          Fluxo de Caixa do Período:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div className="flex flex-col">
            <span className="text-[12px] text-muted-foreground mb-1">Vendas Brutas (+):</span>
            <span className="text-success font-bold text-[16px]">
              R$ {seguro(totalVendasBruto).toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[12px] text-muted-foreground mb-1">Trocos Devolvidos (-):</span>
            <span className="text-warning font-bold text-[16px]">
              R$ {seguro(totalTroco).toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[12px] text-muted-foreground mb-1">Sangrias/Retiradas (-):</span>
            <span className="text-warning font-bold text-[16px]">
              R$ {seguro(totalRetiradas).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div className="pt-4 mt-5 border-t border-border flex justify-end">
          <div className="text-right">
            <span className="text-[14px] text-foreground block mb-1 font-medium">Saldo Líquido Estimado em Caixa:</span>
            <span className={`font-bold text-[24px] ${seguro(totalLiquido) >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {seguro(totalLiquido).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      {/* TOTALIZAÇÃO POR MÉTODOS DE PAGAMENTO */}
      <div className="pt-4 mt-[25px] border-t border-border">
        <div className="text-[14px] mb-3 text-muted-foreground font-medium">
          Totalização por Meio de Recebimento:
        </div>
        <div className="flex flex-wrap gap-5">
          {Object.entries(totaisPorMetodo || {}).map(([metodo, total]) => {
            return (
              <div key={metodo} className="bg-secondary px-4 py-2.5 rounded border border-border flex flex-col min-w-[120px]">
                <span className="text-[12px] text-muted-foreground mb-1 block">{metodo}</span>
                <span className="text-success font-bold text-[15px]">
                  R$ {seguro(total).toFixed(2).replace(".", ",")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};