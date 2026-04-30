import React, { useRef, useEffect } from 'react';

export const ModalObservacao = ({
  mostrar,
  onClose,
  texto,
  setTexto,
  onSalvar,
  onApagar,
  carregando,
  dataSelecionada
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (mostrar && editorRef.current) {
      if (editorRef.current.innerHTML !== texto) {
        editorRef.current.innerHTML = texto || "";
      }

      setTimeout(() => {
        editorRef.current.focus();
        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 50);
    }
  }, [mostrar]);

  if (!mostrar) return null;

  const dataFormatada = dataSelecionada 
    ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR') 
    : '';

  const aplicarComando = (comando, valor = null) => {
    editorRef.current.focus();
    document.execCommand(comando, false, valor);
    if (editorRef.current) {
      setTexto(editorRef.current.innerHTML);
    }
  };

  /**
   * FUNÇÃO PARA COLAR APENAS TEXTO PURO
   */
  const handlePaste = (e) => {
    e.preventDefault();
    // Obtém apenas o texto puro do clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insere o texto puro no local do cursor
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text);
    } else {
      // Fallback para navegadores que não suportam insertText
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
    }
    
    // Atualiza o estado
    setTexto(editorRef.current.innerHTML);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5 animate-in fade-in duration-200">
      <div className="bg-[#2d2d2d] flex flex-col p-6 rounded-lg w-full max-w-[800px] max-h-[90vh] border border-[#444] shadow-2xl">
        <h3 className="text-[#E0E0E0] mt-0 mb-4 pb-3 border-b border-[#333] text-[20px] font-medium shrink-0">
          Observações do Dia: <span className="text-[#64ff8a] font-bold">{dataFormatada}</span>
        </h3>

        <div className="flex flex-col flex-1 overflow-hidden mb-2.5">
          <label className="text-[13px] text-muted-foreground mb-2 shrink-0">Relato / Notas do Dia:</label>
          
          {/* BARRA DE FERRAMENTAS DO EDITOR */}
          <div className="flex flex-wrap gap-2.5 mb-2.5 p-2 bg-[#1e1e1e] border border-[#444] rounded shrink-0">
            
            {/* Formatação Básica */}
            <div className="flex items-center gap-1 border-r border-[#444] pr-2.5">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('bold'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] min-w-[32px] transition-colors" title="Negrito"><b>B</b></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('italic'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] min-w-[32px] transition-colors" title="Itálico"><i>I</i></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('underline'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] min-w-[32px] transition-colors" title="Sublinhado"><u>U</u></button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="flex items-center gap-1 border-r border-[#444] pr-2.5">
              <select 
                onChange={(e) => aplicarComando('fontSize', e.target.value)}
                defaultValue="3"
                className="bg-[#333] text-[#eee] border border-[#555] rounded px-1.5 py-1 text-xs outline-none focus:border-[#2196F3] cursor-pointer"
              >
                <option value="1">Pequeno</option>
                <option value="3">Normal</option>
                <option value="5">Título</option>
                <option value="7">Extra Grande</option>
              </select>
            </div>

            {/* Alinhamento e Listas */}
            <div className="flex items-center gap-1 border-r border-[#444] pr-2.5">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('insertUnorderedList'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors" title="Lista">• Lista</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyLeft'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors" title="Alinhar Esquerda">Esq</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyCenter'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors" title="Centralizar">Centro</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyRight'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors" title="Alinhar Direita">Dir</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyFull'); }} className="bg-[#333] text-[#eee] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors" title="Justificar">Just</button>
            </div>

            {/* Limpar Formatação */}
            <div className="flex items-center gap-1">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('removeFormat'); }} className="bg-[#333] text-[#ff5252] border border-[#555] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[#444] transition-colors font-medium" title="Limpar Formatação">Limpar</button>
            </div>
          </div>

          {/* ÁREA EDITÁVEL */}
          <div
            ref={editorRef}
            className="editor-rich-text flex-1 overflow-y-auto bg-[#0c0c0c] text-[#64ff8a] border border-[#555] rounded p-4 text-[16px] leading-[1.6] outline-none transition-colors focus:border-[#2196F3]"
            contentEditable={!carregando}
            onInput={(e) => setTexto(e.currentTarget.innerHTML)}
            onPaste={handlePaste}
          />
        </div>

        {/* Estilos injetados para o conteúdo gerado pelo document.execCommand - CORRIGIDO AS LISTAS */}
        <style>{`
          .editor-rich-text ul { list-style-type: disc; padding-left: 25px; margin: 10px 0; }
          .editor-rich-text ol { list-style-type: decimal; padding-left: 25px; margin: 10px 0; }
          .editor-rich-text li { margin-bottom: 5px; display: list-item; }
          .editor-rich-text font[size="1"] { font-size: 12px; }
          .editor-rich-text font[size="3"] { font-size: 16px; }
          .editor-rich-text font[size="5"] { font-size: 20px; font-weight: bold; }
          .editor-rich-text font[size="7"] { font-size: 30px; font-weight: bold; }
        `}</style>

        {/* RODAPÉ DO MODAL (AÇÕES) */}
        <div className="flex items-center shrink-0 mt-4 pt-4 border-t border-[#333] gap-3">
          <button 
            onClick={onApagar} 
            disabled={carregando || !texto}
            className="mr-auto px-4 py-2 bg-transparent text-[#ff5252] border border-[#ff5252] rounded font-medium cursor-pointer transition-colors hover:bg-[#ff5252]/10 disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          >
            Excluir Nota
          </button>
          
          <button 
            onClick={onClose} 
            disabled={carregando}
            className="px-4 py-2 bg-[#444] text-[#E0E0E0] rounded border-none font-medium cursor-pointer transition-colors hover:bg-[#555] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          >
            Cancelar
          </button>
          
          <button 
            onClick={onSalvar} 
            disabled={carregando}
            className="px-4 py-2 bg-[#2196F3] text-white rounded border-none font-bold cursor-pointer transition-colors hover:bg-[#1e88e5] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[14px] active:scale-95"
          >
            {carregando ? 'Salvando...' : 'Salvar Observação'}
          </button>
        </div>
      </div>
    </div>
  );
};