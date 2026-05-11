// src/components/ui/DialogBase.tsx
import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./internal/Dialog";

interface DialogBaseProps {
  aberto: boolean;
  onClose: () => void;
  titulo: string;
  descricao?: string;
  children: ReactNode;
  className?: string;
}

export function DialogBase({
  aberto,
  onClose,
  titulo,
  descricao,
  children,
  className = "sm:max-w-125"
}: DialogBaseProps) {
  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">{titulo}</DialogTitle>
          {descricao && <DialogDescription>{descricao}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}