// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/pages/auth/AuthLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { CadastroPage } from '@/pages/auth/CadastroPage';
import { RecuperarSenhaPage } from '@/pages/auth/RecuperarSenhaPage';
import { AppLayout } from '@/components/layout/AppLayout';
import ComponenteVendas from '@/pages/pdv/ComponenteVendas';
import { Relatorios } from '@/pages/relatorio_vendas/Relatorios';
import { Produtos } from '@/pages/cadastro_produtos/Produtos';
import { GerarCupom } from '@/pages/gerar_cupom/GerarCupom';
import { CadastroAtendentes } from '@/pages/cadastro_atendentes/CadastroAtendentes';

export default function App() {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/scleenkr/login" element={<LoginPage />} />
        <Route path="/scleenkr/cadastro" element={<CadastroPage />} />
        <Route path="/scleenkr/recuperar-senha" element={<RecuperarSenhaPage />} />
      </Route>

      {/* Rotas do painel */}
      <Route element={<AppLayout />}>
        <Route path="/scleenkr/" element={<Navigate to="/scleenkr/pdv" replace />} />
        <Route path="/scleenkr/pdv" element={<ComponenteVendas />} />
        <Route path="/scleenkr/relatorios" element={<Relatorios />} />
        <Route path="/scleenkr/produtos" element={<Produtos />} />
        <Route path="/scleenkr/gerarcupom" element={<GerarCupom />} />
        <Route path="/scleenkr/atendentes_sessao" element={<CadastroAtendentes />} />
        <Route path="*" element={<Navigate to="/scleenkr/pdv" replace />} />
      </Route>

      {/* Redirecionamento raiz */}
      <Route path="/" element={<Navigate to="/scleenkr/login" replace />} />
    </Routes>
  );
}