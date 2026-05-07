// src/components/layout/AppLayout.tsx
import { useState, useEffect, useCallback } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import { useAtendentes } from '@/pages/cadastro_atendentes/hooks/useAtendentes';
import { useSessoesCaixa } from '@/pages/cadastro_atendentes/hooks/useSessoesCaixa';
import { Header } from './Header';
import { Footer } from './Footer';
import { AppContext } from '@/contexts/AppContext';
import type { Empresa } from '@/lib/models/Empresa';
import { getToken } from '@/lib/utils/token';

export function AppLayout() {
  const token = getToken();
  // Se não tem token, nem perde tempo renderizando o layout ou buscando dados
  if (!token) {
    return <Navigate to="/scleenkr/login" replace />;
  };
  
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [carregandoSistema, setCarregandoSistema] = useState<boolean>(true);
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [statusSom] = useState<boolean>(false);

  const { atendentes, buscarAtendentes, setAtendentes } = useAtendentes();
  const { sessaoAtual, buscarSessaoAtual, setSessaoAtual } = useSessoesCaixa();

  const resetarSistemaLocal = useCallback(
    (tipo: 'EMPRESA' | 'SESSAO' | 'ATENDENTE') => {
      if (tipo === 'EMPRESA') {
        setEmpresaSelecionada(null);
        setSessaoAtual(null);
        setAtendentes([]);
      }
      if (tipo === 'SESSAO' || tipo === 'ATENDENTE') {
        setSessaoAtual(null);
        buscarAtendentes();
      }
    },
    [setSessaoAtual, setAtendentes, buscarAtendentes]
  );

  const carregarDadosEmpresa = useCallback(async () => {
    try {
      const dados = await apiClient.get<Empresa[]>('/empresas');
      setEmpresaSelecionada(dados && dados.length > 0 ? dados[0] : null);
    } catch (erro) {
      console.error('Erro ao carregar empresas:', erro);
      setEmpresaSelecionada(null);
    } finally {
      setCarregandoSistema(false);
    }
  }, []);

  useEffect(() => {
    const inicializarSistema = async () => {
      await carregarDadosEmpresa();
      await buscarAtendentes();
      await buscarSessaoAtual();
    };
    inicializarSistema();
  }, [carregarDadosEmpresa, buscarAtendentes, buscarSessaoAtual]);

  const fecharMenu = () => setMenuAberto(false);
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAberto(!menuAberto);
  };

  if (carregandoSistema) {
    return (
      <div className="bg-background h-screen text-white flex items-center justify-center animate-pulse">
        Sincronizando $CLEENKR...
      </div>
    );
  }

  const temAtendentes = atendentes && atendentes.length > 0;

  return (
    <AppContext.Provider
      value={{
        empresaSelecionada,
        sessaoAtual,
        temAtendentes,
        statusSom,
        resetarSistemaLocal,
        carregarDadosEmpresa,
        buscarSessaoAtual,
      }}
    >
      <div className="w-screen h-screen overflow-hidden bg-background flex flex-col font-sans">
        <Header
          empresaSelecionada={empresaSelecionada}
          sessaoAtual={sessaoAtual}
          menuAberto={menuAberto}
          toggleMenu={toggleMenu}
          fecharMenu={fecharMenu}
        />
        <div
          className="flex-1 w-full flex justify-center overflow-hidden pt-5 pb-5 px-2 md:px-5"
          onClick={fecharMenu}
        >
          <main className="w-full h-full bg-card rounded-xl shadow-2xl border border-border overflow-y-auto box-border [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}