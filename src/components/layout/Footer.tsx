import { JSX } from "react";

const dataAnoAtual: number = new Date().getFullYear();

export function Footer(): JSX.Element {
  return (
    <footer className="w-full h-[6%] flex items-center justify-center bg-card border-t border-border">
      <div className="flex justify-between items-center w-[98%] text-text-muted-foreground text-[14px]">
        <p>© $CLEENKR {dataAnoAtual} - Todos os direitos reservados</p>
      </div>
    </footer>
  );
}