// src/pages/auth/CadastroPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersService } from '@/lib/modules/users/service';

export const CadastroPage = () => {
  const navigate = useNavigate();

  const [dados, setDados] = useState({ nome: '', cpf: '', senha: '' });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  // O sucesso agora é tratado pelo redirecionamento, não precisamos mais exibir aqui,
  // mas manteremos o estado caso queira usar localmente.
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorProcessado = value;
    if (name === 'cpf') valorProcessado = value.replace(/\D/g, '').slice(0, 11);
    setDados((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      await usersService.cadastrar(dados);
      
      // Redireciona para login com mensagem de sucesso
      navigate('/login', {
        state: { mensagem: 'Usuário cadastrado com sucesso! Faça seu login.' },
      });
    } catch (error) {
      setErro(error.message || 'Falha ao cadastrar usuário.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleCadastro} className="flex flex-col gap-4">
      {erro && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold text-center p-3 rounded-xl">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="bg-success/10 border border-success/30 text-success text-sm font-semibold text-center p-3 rounded-xl">
          {sucesso}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="nomeCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          Nome Completo
        </label>
        <input
          id="nomeCadastro"
          name="nome"
          type="text"
          placeholder="Ex: João da Silva"
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
          value={dados.nome}
          onChange={handleChange}
          disabled={carregando}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cpfCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          CPF
        </label>
        <input
          id="cpfCadastro"
          name="cpf"
          type="text"
          inputMode="numeric"
          placeholder="Apenas números..."
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
          value={dados.cpf}
          onChange={handleChange}
          disabled={carregando}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="senhaCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          Senha de Acesso
        </label>
        <input
          id="senhaCadastro"
          name="senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
          value={dados.senha}
          onChange={handleChange}
          disabled={carregando}
        />
      </div>

      <button
        type="submit"
        disabled={carregando || dados.cpf.length !== 11 || !dados.senha || !dados.nome}
        className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
      >
        {carregando ? (
          <span className="animate-pulse tracking-widest">CRIANDO...</span>
        ) : (
          'CRIAR ATENDENTE'
        )}
      </button>

      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground">Já tem uma conta? </span>
        <Link to="/scleenkr/login" className="text-primary text-xs font-bold hover:underline">
          Faça login
        </Link>
      </div>
    </form>
  );
};