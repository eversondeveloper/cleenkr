import React from 'react';

export const SecaoFiltros = ({
  filtroDataInicio,
  setFiltroDataInicio,
  filtroDataFim,
  setFiltroDataFim,
  filtroMetodosPagamento,
  toggleMetodoPagamento,
  limparFiltros,
  limparFiltrosMetodos,
  METODOS_PAGAMENTO,
}) => {
  return (
    <div className="bg-card p-5 mb-[30px] rounded-lg border border-border w-full box-border">
      
      {/* DATAS */}
      <div className="flex flex-wrap gap-5 mb-5">
        <div className="flex flex-col min-w-[180px]">
          <label className="text-[13px] text-muted-foreground mb-1.5 font-light">Data Início:</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            className="p-2.5 bg-background text-foreground border border-border rounded text-[13px] outline-none transition-colors focus:border-[#FF9800]"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-[13px] text-muted-foreground mb-1.5 font-light">Data Fim:</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            className="p-2.5 bg-background text-foreground border border-border rounded text-[13px] outline-none transition-colors focus:border-[#FF9800]"
          />
        </div>
      </div>

      {/* MÉTODOS DE PAGAMENTO */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <label className="text-[14px] text-foreground font-bold">Métodos de Pagamento:</label>
          {filtroMetodosPagamento.length > 0 && (
            <button 
              onClick={limparFiltrosMetodos} 
              className="bg-transparent border-none text-muted-foreground text-[12px] font-light cursor-pointer hover:text-foreground transition-colors px-1"
            >
              Limpar Métodos
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {METODOS_PAGAMENTO.map((metodo) => {
            const ativo = filtroMetodosPagamento.includes(metodo);
            return (
              <button
                key={metodo}
                type="button"
                onClick={() => toggleMetodoPagamento(metodo)}
                className={`
                  px-3.5 py-2 rounded text-[13px] cursor-pointer transition-colors border
                  ${ativo 
                    ? 'bg-[#64ff8a] text-[#1e1e1e] border-[#64ff8a] font-bold' 
                    : 'bg-background text-foreground border-border font-medium hover:bg-muted'
                  }
                `}
              >
                {metodo}
              </button>
            );
          })}
        </div>
      </div>

      {/* AÇÕES DE LIMPEZA */}
      <div className="flex justify-end pt-3 mt-4 border-t border-border">
        <button 
          onClick={limparFiltros} 
          className="px-3.5 py-2 bg-[#444] text-[#E0E0E0] border-none rounded text-[12px] font-medium cursor-pointer transition-colors hover:bg-[#555]"
        >
          Limpar Todos os Filtros
        </button>
      </div>
      
    </div>
  );
};