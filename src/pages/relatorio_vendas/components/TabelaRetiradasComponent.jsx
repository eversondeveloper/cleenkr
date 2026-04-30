import React from 'react';

export const TabelaRetiradasComponent = ({
  retiradasFiltradas,
  filtroDataInicio,
  filtroDataFim,
  onEditarRetirada,
  onDeletarRetirada,
}) => {
    
  const formatarDataHora = (dataString) => {
      if (!dataString) return '-';
      try {
          const data = new Date(dataString);
          return data.toLocaleString("pt-BR", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false 
          });
      } catch (error) {
          return 'Data Inválida';
      }
  };

  return (
    <div className="mt-10 w-full">
      <h2 className="m-0 text-foreground text-xl font-semibold mb-4">
        Retiradas do Caixa{" "}
        {(filtroDataInicio || filtroDataFim) && (
          <span className="text-sm text-muted-foreground font-normal ml-2">
            (Filtradas pelo mesmo período das vendas: {filtroDataInicio || 'Início'} 
            {filtroDataFim ? ` à ${filtroDataFim}` : ''})
          </span>
        )}
      </h2>
      
      {retiradasFiltradas.length === 0 ? (
        <p className="text-center p-5 text-muted-foreground bg-card rounded-lg border border-border">
          {filtroDataInicio || filtroDataFim
            ? "Nenhuma retirada registrada no período filtrado."
            : "Nenhuma retirada registrada."}
        </p>
      ) : (
        <div className="w-full overflow-x-auto bg-card rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm text-left text-foreground border-collapse">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium w-[180px]">Data/Hora</th>
                <th className="px-4 py-3 font-medium w-[150px]">Valor</th>
                <th className="px-4 py-3 font-medium">Motivo</th>
                <th className="px-4 py-3 font-medium">Observação</th>
                <th className="px-4 py-3 font-medium text-center w-[180px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {retiradasFiltradas.map((retirada, index) => (
                <tr 
                  key={retirada.id_retirada}
                  className={`border-b border-border transition-colors hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-card'}`}
                >
                  <td className="px-4 py-4 align-middle whitespace-nowrap text-muted-foreground">
                    {formatarDataHora(retirada.data_retirada)}
                  </td>
                  
                  <td className="px-4 py-4 align-middle font-bold text-warning">
                    R$ {parseFloat(retirada.valor).toFixed(2).replace(".", ",")}
                  </td>
                  
                  <td className="px-4 py-4 align-middle font-medium text-foreground">
                    {retirada.motivo}
                  </td>
                  
                  <td className="px-4 py-4 align-middle text-muted-foreground italic">
                    {retirada.observacao || "-"}
                  </td>
                  
                  <td className="px-4 py-4 align-middle">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEditarRetirada(retirada)}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeletarRetirada(retirada.id_retirada)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};