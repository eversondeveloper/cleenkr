import React from 'react';

export const TabelaAtendentes = ({ 
  atendentes, 
  carregando, 
  sessaoAtual, 
  onEditarAtendente, 
  onDeletarAtendente, 
  onAbrirSessao 
}) => {
  
  if (atendentes.length === 0 && !carregando) {
    return (
      <div className="p-10 text-center bg-card rounded-xl text-muted-foreground border border-dashed border-border w-full">
        <h3 className="text-lg text-foreground font-medium mb-2 m-0">Nenhum atendente encontrado</h3>
        <p className="text-sm m-0">Cadastre o primeiro atendente para começar</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full border-collapse text-sm text-left">
        <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
          <tr>
            <th className="p-4 w-[20%] font-medium">Atendente</th>
            <th className="p-4 w-[30%] font-medium">Contato</th>
            <th className="p-4 w-[15%] font-medium">Status</th>
            <th className="p-4 w-[15%] font-medium">Sessão</th>
            <th className="p-4 font-medium text-center min-w-[200px]">Ações</th>
          </tr>
        </thead>
        
        <tbody>
          {atendentes.map((atendente) => {
            // Verifica se este atendente específico é o dono da sessão ativa
            const temSessaoAberta = sessaoAtual?.id_atendente === atendente.id_atendente;
            
            // Lógica de Negócio:
            // 1. Deve estar ativo no cadastro.
            // 2. Não pode ter sessão já aberta.
            // 3. O terminal não pode ter nenhuma outra sessão aberta (Trava Global).
            const podeAbrirSessao = atendente.ativo && !temSessaoAberta && !sessaoAtual; 

            return (
              <tr 
                key={atendente.id_atendente} 
                className={`border-b border-border hover:bg-muted/20 transition-colors ${atendente.ativo ? 'opacity-100' : 'opacity-60'}`}
              >
                <td className="p-4 align-top">
                  <div>
                    <div className="font-semibold text-foreground mb-1">
                      {atendente.nome}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {atendente.id_atendente}
                    </div>
                  </div>
                </td>

                <td className="p-4 align-top">
                  <div>
                    <div className="text-foreground mb-1">{atendente.email}</div>
                    {atendente.telefone && (
                      <div className="text-xs text-muted-foreground">📞 {atendente.telefone}</div>
                    )}
                    {atendente.cpf && (
                      <div className="text-xs text-muted-foreground mt-1">🆔 {atendente.cpf}</div>
                    )}
                  </div>
                </td>

                <td className="p-4 align-top">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${atendente.ativo ? 'bg-success text-black' : 'bg-destructive text-white'}`}>
                    {atendente.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="text-xs text-muted-foreground mt-2.5">
                    Desde: {new Date(atendente.data_cadastro).toLocaleDateString('pt-BR')}
                  </div>
                </td>

                <td className="p-4 align-top">
                  {temSessaoAberta ? (
                    <div>
                      <span className="inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase bg-info text-white">
                        Sessão Aberta
                      </span>
                      <div className="text-xs text-muted-foreground mt-2.5">
                        Início: {new Date(sessaoAtual.data_abertura).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase bg-muted text-muted-foreground">
                      Offline
                    </span>
                  )}
                </td>

                <td className="p-4 align-top text-center">
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    <button 
                        onClick={() => onEditarAtendente(atendente)} 
                        title="Editar"
                        className="px-3 py-1.5 bg-muted text-foreground hover:bg-muted-foreground/20 rounded text-xs font-medium cursor-pointer transition-colors border-none active:scale-95"
                    >
                      ✏️ Editar
                    </button>

                    {podeAbrirSessao && (
                      <button 
                        onClick={() => onAbrirSessao(atendente.id_atendente)} 
                        title="Abrir Caixa"
                        className="px-3 py-1.5 bg-success text-black hover:brightness-110 rounded text-xs font-bold cursor-pointer transition-colors border-none shadow-sm active:scale-95"
                      >
                        💰 Abrir Caixa
                      </button>
                    )}

                    {!temSessaoAberta && (
                      <button 
                        onClick={() => onDeletarAtendente(atendente.id_atendente, atendente.nome)} 
                        title="Remover"
                        className="px-3 py-1.5 bg-destructive text-white hover:brightness-110 rounded text-xs font-medium cursor-pointer transition-colors border-none shadow-sm active:scale-95"
                      >
                        🗑️ Deletar
                      </button>
                    )}

                    {temSessaoAberta && (
                      <span className="text-[11px] text-destructive italic font-medium ml-1">
                        Em operação
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {carregando && (
        <div className="p-4 text-center text-primary text-sm font-medium animate-pulse border-t border-border">
          Atualizando lista...
        </div>
      )}
    </div>
  );
};