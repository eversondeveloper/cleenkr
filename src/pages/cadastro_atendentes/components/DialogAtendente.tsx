import { useState, useEffect } from 'react';
import { DialogBase } from '@/components/ui/AppDialog';
import { Button } from '@/components/ui/internal/Button';
import { Input } from '@/components/ui/internal/input';

// Tipos

/** Dados do formulário (os campos que o modal manipula) */
interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  ativo: boolean;
}

/** Dados do atendente que vêm da API / tabela (usado na edição) */
interface AtendenteEditando {
  id_atendente?: string | number;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  ativo?: boolean;
}

interface DialogAtendenteProps {
  mostrar: boolean;
  onClose: () => void;
  atendenteEditando: AtendenteEditando | null;
  onSalvar: (dados: FormData) => void;
}

// ---------------------------------------------------------
// Componente
// ---------------------------------------------------------
export const DialogAtendente: React.FC<DialogAtendenteProps> = ({
  mostrar,
  onClose,
  atendenteEditando,
  onSalvar,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    ativo: true,
  });

  // Carregar dados do atendente quando o modal abre para edição
  useEffect(() => {
    if (atendenteEditando) {
      setFormData({
        nome: atendenteEditando.nome || '',
        email: atendenteEditando.email || '',
        telefone: atendenteEditando.telefone || '',
        cpf: atendenteEditando.cpf || '',
        ativo: atendenteEditando.ativo ?? true,
      });
    } else {
      // Reset para criação de um novo atendente
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        ativo: true,
      });
    }
  }, [atendenteEditando, mostrar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert('Nome e Email são obrigatórios!');
      return;
    }
    onSalvar(formData);
  };

  return (
    <DialogBase
      aberto={mostrar}
      onClose={onClose}
      titulo={atendenteEditando ? '✏️ Editar Atendente' : '👤 Novo Atendente'}
      descricao="Preencha os dados abaixo para salvar no sistema."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Nome Completo *</label>
          <Input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: João Silva"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">E-mail *</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@empresa.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">CPF *</label>
            <Input
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            />
          </div>
        </div>

        {atendenteEditando && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="ativo" className="text-sm cursor-pointer">Atendente Ativo</label>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-success text-black hover:bg-success/90">
            {atendenteEditando ? 'Atualizar Dados' : 'Cadastrar Atendente'}
          </Button>
        </div>
      </form>
    </DialogBase>
  );
};