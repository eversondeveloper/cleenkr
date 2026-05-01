import React from 'react';

const ControlesSelecaoComponent = ({
  empresas,
  empresaSelecionada, 
  vendas,
  vendaSelecionada,
  handleVendaChange,
  formatarMoeda
}) => {
  const possuiEmpresa = empresas.length > 0;
  
  return (
    <div className="flex flex-col items-center gap-5 w-full p-6 bg-card rounded-xl mb-8 border border-border">
      <h2 className="text-lg text-foreground font-medium m-0 text-center">
        Seleção de Dados para Comprovante
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center w-full pt-2">
        
        {/* Grupo de Exibição da Empresa */}
        <div className="flex flex-col w-full max-w-[320px]">
          <label className="text-foreground mb-2 font-light text-[13px] text-center">
            Empresa Emissora:
          </label>
          <div className="flex justify-center w-full">
            {possuiEmpresa ? (
              <div className="flex flex-col items-center justify-center w-full h-[40px] md:h-[54px] px-3 bg-background rounded-md border border-border text-success text-[13px] font-bold text-center leading-tight overflow-hidden">
                <span className="truncate w-full">{empresaSelecionada?.nome_fantasia || empresaSelecionada?.razao_social}</span>
                <span className="text-[10px] text-muted-foreground font-normal tracking-wide mt-0.5 truncate w-full">
                  CNPJ: {empresaSelecionada?.cnpj}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[40px] md:h-[54px] px-3 bg-background rounded-md border border-border">
                <span className="text-warning font-bold text-[13px] text-center">
                  ⚠️ Nenhuma empresa configurada.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grupo de Seleção da Venda */}
        <div className="flex flex-col w-full max-w-[320px]">
          <label className="text-foreground mb-2 font-light text-[13px] text-center">
            Selecionar Venda:
          </label>
          <select
            value={vendaSelecionada?.id_venda || ""}
            onChange={(e) => handleVendaChange(e.target.value)}
            disabled={vendas.length === 0}
            className="w-full h-[40px] md:h-[54px] px-3 bg-background text-foreground border border-border rounded-md text-[13px] outline-none focus:border-primary transition-colors disabled:opacity-50 appearance-none bg-no-repeat bg-position-[right_15px_center] bg-size-[8px_10px]"
            style={{
              cursor: vendas.length > 0 ? 'pointer' : 'not-allowed',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23E0E0E0' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")`
            }}
          >
            {vendas.length === 0 ? (
              <option value="">Nenhuma venda encontrada</option>
            ) : (
              vendas.map((venda) => (
                <option key={venda.id_venda} value={venda.id_venda}>
                  ID: {venda.id_venda} — R$ {formatarMoeda(venda.valor_total_bruto)}
                </option>
              ))
            )}
          </select>
        </div>
        
      </div>
    </div>
  );
};

export default ControlesSelecaoComponent;