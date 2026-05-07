// src/contexts/AppContext.tsx
import { createContext, useContext } from 'react';
import type { Empresa } from '@/lib/models/Empresa';
import type { SessaoCaixa } from '@/lib/models/SessaoCaixa';

export interface AppContextType {
  empresaSelecionada: Empresa | null;
  sessaoAtual: SessaoCaixa | null;
  temAtendentes: boolean;
  statusSom: boolean;
  resetarSistemaLocal: (tipo: 'EMPRESA' | 'SESSAO' | 'ATENDENTE') => void;
  carregarDadosEmpresa: () => Promise<void>;
  buscarSessaoAtual: () => Promise<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider (AppLayout)');
  }
  return context;
}