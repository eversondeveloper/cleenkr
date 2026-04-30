import React from 'react';

export const SecaoObservacoes = ({ 
  texto, 
  setTexto, 
  onSalvar, 
  onApagar, 
  carregando,
  dataSelecionada 
}) => {
  
  // Só exibe se houver uma data de início selecionada
  if (!dataSelecionada) return null;

  const dataFormatada = new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <div className="mt-10 p-6 bg-card rounded-lg border border-border shadow-md w-full box-border">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-muted-foreground m-0 text-lg font-medium">
          Observações do Dia: <span className="text-success font-bold ml-1">{dataFormatada}</span>
        </h3>
        {carregando && <span className="text-muted-foreground text-xs animate-pulse">Processando...</span>}
      </div>
      
      {/* Área de Texto */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Registre aqui ocorrências, notas sobre o fechamento ou lembretes importantes deste dia específico..."
        disabled={carregando}
        className="w-full min-h-[150px] bg-background text-foreground border border-border rounded-md p-4 text-[15px] leading-relaxed resize-y outline-none transition-colors focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground/50"
      />

      {/* Botões de Ação */}
      <div className="flex gap-3 mt-4 justify-end">
        <button
          onClick={onApagar}
          disabled={carregando || !texto}
          className="px-5 py-2.5 bg-transparent text-destructive border border-destructive rounded font-medium transition-colors hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Excluir Registro
        </button>
        <button
          onClick={onSalvar}
          disabled={carregando}
          className="px-7 py-2.5 bg-blue-500 text-white border-none rounded font-bold shadow-sm transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {carregando ? 'Salvando...' : 'Salvar Observação'}
        </button>
      </div>
      
    </div>
  );
};