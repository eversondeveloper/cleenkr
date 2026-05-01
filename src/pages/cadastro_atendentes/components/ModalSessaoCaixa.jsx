import React, { useState, useEffect, useRef } from 'react';
import { useEmpresa } from '../hooks/useEmpresa'; 

export const ModalSessaoCaixa = ({ 
  mostrar, 
  onClose, 
  atendentes, 
  onAbrirSessao,
  sessaoAtual,
  atendentePreSelecionado 
}) => {
  // ACESSA OS DADOS DA EMPRESA
  const { empresa } = useEmpresa();

  const [dadosSessao, setDadosSessao] = useState({
    id_atendente: '',
    valor_inicial: '0,00' 
  });
  
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const inputValorRef = useRef(null);

  useEffect(() => {
    if (mostrar) {
      const idInicial = atendentePreSelecionado || '';
      setDadosSessao({
        id_atendente: idInicial,
        valor_inicial: idInicial ? '' : '0,00'
      });
      setErros({});
      if (idInicial) {
        setTimeout(() => {
          inputValorRef.current?.focus();
        }, 100);
      }
    }
  }, [mostrar, atendentePreSelecionado]);

  const validarFormulario = () => {
    const novosErros = {};
    if (!dadosSessao.id_atendente) novosErros.id_atendente = 'Selecione um atendente';
    const valorStr = dadosSessao.valor_inicial.replace(',', '.');
    const valor = parseFloat(valorStr);
    if (isNaN(valor) || valor < 0) novosErros.valor_inicial = 'Valor inválido';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (campo, valor) => {
    setDadosSessao(prev => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros(prev => ({ ...prev, [campo]: '' }));
    if (campo === 'id_atendente' && valor !== '') {
      setDadosSessao(prev => ({ ...prev, id_atendente: valor, valor_inicial: '' }));
      setTimeout(() => inputValorRef.current?.focus(), 10);
    }
  };

  const formatarValor = (valor) => {
    valor = valor.replace(/[^\d,]/g, '');
    const partes = valor.split(',');
    if (partes.length > 2) valor = partes[0] + ',' + partes.slice(1).join('');
    if (partes.length === 2 && partes[1].length > 2) valor = partes[0] + ',' + partes[1].substring(0, 2);
    return valor;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validarFormulario()) return;
    setEnviando(true);
    try {
      const valorLimpo = dadosSessao.valor_inicial === '' ? '0' : dadosSessao.valor_inicial.replace(',', '.');
      await onAbrirSessao(dadosSessao.id_atendente, parseFloat(valorLimpo));
    } catch (error) {
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  if (!mostrar) return null;
  const atendentesDisponiveis = atendentes.filter(a => a.ativo);
  
  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card p-6 md:p-8 rounded-xl w-full max-w-[550px] border border-border shadow-2xl relative">
        
        {/* CABEÇALHO DO MODAL COM DADOS DA EMPRESA */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-border">
          <div className="flex flex-col">
            <h2 className="text-primary m-0 text-xl md:text-2xl font-medium">
              💰 Abrir Sessão de Caixa
            </h2>
            {empresa && (
              <p className="text-success mt-1.5 mb-0 text-[13px] font-bold tracking-wide">
                {empresa.nome_fantasia || empresa.razao_social} <span className="text-muted-foreground font-normal ml-1">| CNPJ: {empresa.cnpj}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-muted-foreground text-3xl cursor-pointer hover:text-foreground transition-colors leading-none p-0"
          >
            ✕
          </button>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="m-0">
            <div className="flex flex-col mb-5">
              <label className="text-foreground text-sm font-medium mb-2">Selecione o Atendente *</label>
              <select
                value={dadosSessao.id_atendente}
                onChange={(e) => handleChange('id_atendente', e.target.value)}
                disabled={enviando || sessaoAtual}
                className={`w-full p-2.5 bg-background text-foreground border rounded-md text-sm outline-none transition-colors appearance-none bg-no-repeat bg-position-[right_10px_center] bg-size-[8px_10px] ${erros.id_atendente ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23E0E0E0' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")`
                }}
              >
                <option value="">Escolha um operador disponível...</option>
                {atendentesDisponiveis.map(atendente => (
                  <option key={atendente.id_atendente} value={atendente.id_atendente}>
                    {atendente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-foreground text-sm font-medium mb-2">
                Valor de Fundo de Caixa (Troco Inicial)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">R$</span>
                <input
                  ref={inputValorRef}
                  type="text"
                  placeholder="0,00"
                  value={dadosSessao.valor_inicial}
                  onChange={(e) => handleChange('valor_inicial', formatarValor(e.target.value))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={enviando || sessaoAtual}
                  className={`w-full p-2.5 pl-9 bg-background text-foreground border rounded-md text-sm outline-none transition-colors ${erros.valor_inicial ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={enviando}
                className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium border-none cursor-pointer hover:bg-muted-foreground/20 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={enviando || sessaoAtual || !dadosSessao.id_atendente}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold border-none cursor-pointer hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
              >
                {enviando ? 'Processando...' : 'Confirmar Abertura'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};