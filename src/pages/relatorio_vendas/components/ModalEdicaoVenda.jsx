import React, { useState, useEffect, useRef } from "react";

const METODOS_PAGAMENTO = ["Dinheiro", "Pix", "Crédito", "Débito"];

export const ModalEdicaoVenda = ({
  mostrar,
  onClose,
  vendaEditando,
  onAtualizar,
}) => {
  const [pagamentos, setPagamentos] = useState([]);
  const [valorTemp, setValorTemp] = useState("");
  const inputValorRef = useRef(null);

  const [novoPagamento, setNovoPagamento] = useState({
    metodo: "Dinheiro",
    valor_pago: "",
    referencia_metodo: "",
  });

  useEffect(() => {
    if (mostrar && vendaEditando) {
      const inicial = (vendaEditando.pagamentos || []).map((p) => ({
        metodo: p.metodo || "Dinheiro",
        valor_pago: parseFloat(p.valor_pago || p.valorPago || 0) || 0,
        referencia_metodo: p.referencia_metodo || p.referenciaMetodo || "",
      }));
      setPagamentos(inicial);
      sugerirValorRestante(inicial);
    }
  }, [mostrar, vendaEditando]);

  const sugerirValorRestante = (listaPagamentos) => {
    const totalBruto = parseFloat(vendaEditando?.valor_total_bruto || 0);
    const totalPago = listaPagamentos.reduce((acc, p) => acc + p.valor_pago, 0);
    const falta = Math.max(0, totalBruto - totalPago);

    if (falta > 0) {
      setNovoPagamento((prev) => ({ ...prev, valor_pago: falta.toFixed(2) }));
    }
  };

  if (!mostrar || !vendaEditando) return null;

  const adicionarPagamento = () => {
    const valorNum = parseFloat(novoPagamento.valor_pago);
    if (!novoPagamento.metodo || isNaN(valorNum) || valorNum <= 0) {
      return; 
    }

    const novaLista = [
      ...pagamentos,
      {
        metodo: novoPagamento.metodo,
        valor_pago: valorNum,
        referencia_metodo: novoPagamento.referencia_metodo,
      },
    ];

    setPagamentos(novaLista);

    const totalBruto = parseFloat(vendaEditando.valor_total_bruto || 0);
    const totalPago = novaLista.reduce((acc, p) => acc + p.valor_pago, 0);
    const falta = Math.max(0, totalBruto - totalPago);

    setNovoPagamento({
      metodo: "Dinheiro",
      valor_pago: falta > 0 ? falta.toFixed(2) : "",
      referencia_metodo: "",
    });
    setValorTemp("");

    setTimeout(() => inputValorRef.current?.focus(), 10);
  };

  const carregarParaEditar = (index) => {
    const pag = pagamentos[index];
    setNovoPagamento({
      metodo: pag.metodo,
      valor_pago: pag.valor_pago.toString(),
      referencia_metodo: pag.referencia_metodo || "",
    });
    setPagamentos(pagamentos.filter((_, i) => i !== index));
    inputValorRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarPagamento();
    }
  };

  const calcularTotalPago = () => {
    return pagamentos.reduce(
      (total, p) => total + parseFloat(p.valor_pago || 0),
      0
    );
  };

  const handleAtualizar = () => {
    const totalPago = calcularTotalPago();
    const totalBruto = parseFloat(vendaEditando.valor_total_bruto || 0);

    if (totalPago < totalBruto - 0.01) {
      alert(
        `Valor insuficiente. Falta R$ ${(totalBruto - totalPago).toFixed(2)}`
      );
      return;
    }

    const dadosParaBanco = pagamentos.map((p) => ({
      metodo: String(p.metodo || "Dinheiro"),
      valor_pago: parseFloat(p.valor_pago) || 0,
      referencia_metodo: p.referencia_metodo || "",
    }));

    onAtualizar(vendaEditando.id_venda, dadosParaBanco);
  };

  const isPagamentoSuficiente = calcularTotalPago() >= parseFloat(vendaEditando.valor_total_bruto) - 0.01;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5 animate-in fade-in duration-200">
      <div className="bg-[#2d2d2d] w-full max-w-[500px] rounded-xl border border-[#444] shadow-2xl flex flex-col max-h-[90vh]">
        
        <header className="p-5 pb-4 border-b border-[#333] shrink-0">
          <h3 className="m-0 text-[#E0E0E0] text-[18px] font-medium">Edição de Pagamentos - Venda #{vendaEditando.id_venda}</h3>
        </header>

        <div className="p-5 overflow-y-auto flex-1">
          {/* BOX DE TOTAIS */}
          <div className="mb-5 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <div className="flex justify-between text-[13px] text-muted-foreground font-medium mb-1.5">
              <span>Total da Venda:</span>
              <span>Total Pago:</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[20px] font-bold text-[#E0E0E0]">
                R$ {parseFloat(vendaEditando.valor_total_bruto).toFixed(2).replace(".", ",")}
              </span>
              <span className={`text-[20px] font-bold ${calcularTotalPago() >= parseFloat(vendaEditando.valor_total_bruto) ? "text-[#64ff8a]" : "text-[#ff5252]"}`}>
                R$ {calcularTotalPago().toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* INPUT DE NOVO PAGAMENTO */}
          <div className="mb-6">
            <label className="block mb-2 text-[11px] font-bold tracking-wider text-muted-foreground">
              MÉTODO E VALOR (ENTER PARA ADICIONAR)
            </label>
            <div className="flex gap-2">
              <select
                value={novoPagamento.metodo}
                onChange={(e) => setNovoPagamento({ ...novoPagamento, metodo: e.target.value })}
                className="flex-[0.6] p-3 bg-[#1e1e1e] text-[#BACBD9] border border-[#444] rounded-md text-[15px] font-medium outline-none focus:border-[#2196F3] cursor-pointer"
              >
                {METODOS_PAGAMENTO.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              
              <input
                ref={inputValorRef}
                type="text"
                autoFocus
                value={valorTemp !== "" ? valorTemp : novoPagamento.valor_pago}
                onFocus={() => setValorTemp("")}
                onBlur={() => setValorTemp("")}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  const val = e.target.value.replace(",", ".");
                  setValorTemp(e.target.value);
                  setNovoPagamento({ ...novoPagamento, valor_pago: val });
                }}
                placeholder="0,00"
                className="flex-1 p-3 bg-[#1e1e1e] text-success border border-[#444] rounded-md text-[16px] font-bold outline-none focus:border-[#2196F3] text-right"
              />
              
              <button
                onClick={adicionarPagamento}
                className="px-4 bg-primary text-primary-foreground rounded-md font-bold text-lg hover:bg-primary/90 transition-colors active:scale-95 border-none cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* LISTA DE PAGAMENTOS LANÇADOS */}
          <div>
            <h4 className="mb-3 text-[13px] font-semibold text-muted-foreground m-0">
              Pagamentos Lançados:
            </h4>
            
            {pagamentos.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-[#444] rounded-lg text-muted-foreground text-[13px]">
                Nenhum pagamento registrado.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pagamentos.map((pag, index) => (
                  <div
                    key={index}
                    onClick={() => carregarParaEditar(index)}
                    className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-md border-l-4 border-success cursor-pointer transition-colors hover:bg-[#333] group"
                  >
                    <span className="font-semibold text-[14px] text-foreground">{pag.metodo}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[15px] text-foreground">
                        R$ {parseFloat(pag.valor_pago).toFixed(2).replace(".", ",")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPagamentos(pagamentos.filter((_, i) => i !== index));
                        }}
                        className="bg-transparent border-none text-[#ff5252] cursor-pointer text-[20px] font-bold opacity-70 hover:opacity-100 transition-opacity p-0 leading-none h-5 w-5 flex items-center justify-center rounded-full hover:bg-[#ff5252]/10"
                        title="Remover"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AÇÕES FINAIS */}
        <div className="p-5 pt-4 border-t border-[#333] flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#444] text-[#E0E0E0] font-medium rounded border-none cursor-pointer hover:bg-[#555] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAtualizar}
            disabled={!isPagamentoSuficiente}
            className="flex-1 py-2.5 bg-success text-success-foreground font-bold rounded border-none cursor-pointer hover:bg-[#52e878] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalizar Edição
          </button>
        </div>
        
      </div>
    </div>
  );
};