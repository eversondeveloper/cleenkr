import React, { useState, useEffect, useRef } from 'react';
import comSom from '/comsom.svg';
import semSom from '/semsom.svg';
import pauseIcon from '/pause.svg';
import prevIcon from '/prev.svg';
import nextIcon from '/next.svg';

// ---------------------------------------------------------
// Tipos (mantidos)
// ---------------------------------------------------------
interface FaixaMusical {
  nome: string;
  origem: string;
}

interface ModuloAudio {
  default: string;
}

const contextoArquivosMusica: Record<string, ModuloAudio> = import.meta.glob(
  '../../public/sounds/musics/*.mp3',
  { eager: true }
);

const LISTA_OPCOES_MUSICA: FaixaMusical[] = Object.keys(contextoArquivosMusica).map(
  (caminho) => {
    const nomeArquivo = caminho.split('/').pop()?.replace('.mp3', '') ?? '';
    const nome = nomeArquivo.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
    const origem = contextoArquivosMusica[caminho].default;
    return { nome, origem };
  }
);

// ---------------------------------------------------------
// Função auxiliar
// ---------------------------------------------------------
const formatarTempo = (segundos: number): string => {
  if (isNaN(segundos) || segundos < 0) return '00:00';
  const minutos = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${String(minutos).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ---------------------------------------------------------
// Componente (agora sem styled‑components)
// ---------------------------------------------------------
const PlayerMusica: React.FC = () => {
  // ... estados e hooks mantidos exatamente iguais ...
  const [statusSom, setStatusSom] = useState<boolean>(false);
  const [emPausa, setEmPausa] = useState<boolean>(false);
  const [indiceMusica, setIndiceMusica] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [listaMusicas] = useState<FaixaMusical[]>(LISTA_OPCOES_MUSICA);
  const [tempoAtual, setTempoAtual] = useState<{ atual: number; duracao: number }>({
    atual: 0,
    duracao: 0,
  });

  const origemInicial = listaMusicas.length > 0 ? listaMusicas[0].origem : '';
  const referenciaAudio = useRef<HTMLAudioElement>(new Audio(origemInicial));

  // ---------- Controles (inalterados) ----------
  const tocarProximaMusica = () => {
    if (listaMusicas.length === 0) return;
    setEmPausa(false);
    const proximoIndice = (indiceMusica + 1) % listaMusicas.length;
    setIndiceMusica(proximoIndice);
  };

  const tocarMusicaAnterior = () => {
    if (listaMusicas.length === 0) return;
    setEmPausa(false);
    const indiceAnterior =
      (indiceMusica - 1 + listaMusicas.length) % listaMusicas.length;
    setIndiceMusica(indiceAnterior);
  };

  const tocarParar = () => {
    const audio = referenciaAudio.current;

    if (statusSom) {
      audio.pause();
      audio.currentTime = 0;
      setStatusSom(false);
      setEmPausa(false);
      setTempoAtual({ atual: 0, duracao: audio.duration });
    } else {
      setStatusSom(true);
      setEmPausa(false);
    }
  };

  const pausarContinuar = () => {
    const audio = referenciaAudio.current;
    if (!statusSom) return;

    if (emPausa) {
      audio.play().catch((erro) => console.error('Erro ao continuar a música:', erro));
      setEmPausa(false);
    } else {
      audio.pause();
      setEmPausa(true);
    }
  };

  const lidarMudancaVolume = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const novoVolume = parseFloat(evento.target.value);
    setVolume(novoVolume);
    referenciaAudio.current.volume = novoVolume;
  };

  // ---------- Efeitos (inalterados) ----------
  useEffect(() => {
    const audio = referenciaAudio.current;

    if (listaMusicas.length === 0) {
      audio.pause();
      return;
    }

    const tocarAutomaticamente = statusSom && !emPausa;

    if (audio.src !== listaMusicas[indiceMusica].origem) {
      audio.src = listaMusicas[indiceMusica].origem;
      audio.load();
      if (tocarAutomaticamente) {
        audio.play().catch((erro) => console.error('Erro ao tocar nova faixa:', erro));
      }
    }

    audio.loop = false;

    const aoFinalizar = () => {
      tocarProximaMusica();
    };

    audio.removeEventListener('ended', aoFinalizar);
    audio.addEventListener('ended', aoFinalizar);

    return () => {
      audio.removeEventListener('ended', aoFinalizar);
    };
  }, [indiceMusica, listaMusicas, statusSom, emPausa]);

  useEffect(() => {
    const audio = referenciaAudio.current;

    if (listaMusicas.length === 0) {
      audio.pause();
      return;
    }

    if (statusSom && !emPausa) {
      audio.play().catch((erro) => console.error('Erro ao tocar a música:', erro));
    } else if (!statusSom) {
      audio.pause();
      audio.currentTime = 0;
    } else if (emPausa) {
      audio.pause();
    }
  }, [statusSom, emPausa, listaMusicas]);

  useEffect(() => {
    const audio = referenciaAudio.current;

    const aoAtualizarTempo = () => {
      setTempoAtual((prev) => ({ ...prev, atual: audio.currentTime }));
    };

    const aoCarregarMetadados = () => {
      setTempoAtual(() => ({ atual: audio.currentTime, duracao: audio.duration }));
    };

    audio.addEventListener('timeupdate', aoAtualizarTempo);
    audio.addEventListener('loadedmetadata', aoCarregarMetadados);

    return () => {
      audio.removeEventListener('timeupdate', aoAtualizarTempo);
      audio.removeEventListener('loadedmetadata', aoCarregarMetadados);
    };
  }, [listaMusicas, indiceMusica]);

  // ---------- Estilos inline para o slider de volume (mantendo a aparência) ----------
  const volumeSliderStyle: React.CSSProperties = {
    width: '80px',
    height: '4px',
    background: '#555',
    borderRadius: '2px',
    cursor: 'pointer',
    accentColor: '#fff', // não é perfeito, mas ajuda
  };

  return (
    <div className="flex items-center gap-[1.5vmin] px-2.5 bg-[#333] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-full">
      {/* Botões de navegação */}
      <button
        type="button"
        className="bg-transparent border-none cursor-pointer p-0.75 flex items-center transition-transform duration-100 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={tocarMusicaAnterior}
        title="Música Anterior"
      >
        <img src={prevIcon} alt="Música Anterior" className="w-[2.8vh] h-[2.8vh]" />
      </button>

      <button
        type="button"
        className="bg-transparent border-none cursor-pointer p-0.75 flex items-center transition-transform duration-100 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={tocarParar}
        title={statusSom ? 'Parar (Resetar)' : 'Tocar'}
      >
        <img
          src={statusSom ? semSom : comSom}
          alt="Tocar / Parar Geral"
          className="w-[3.5vh] h-[3.5vh]"
        />
      </button>

      <button
        type="button"
        className="bg-transparent border-none cursor-pointer p-0.75 flex items-center transition-transform duration-100 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={pausarContinuar}
        title={emPausa ? 'Continuar' : 'Pausar'}
        disabled={!statusSom}
      >
        <img
          src={emPausa ? comSom : pauseIcon}
          alt="Pausar / Continuar"
          className="w-[3.5vh] h-[3.5vh]"
        />
      </button>

      <button
        type="button"
        className="bg-transparent border-none cursor-pointer p-0.75 flex items-center transition-transform duration-100 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={tocarProximaMusica}
        title="Próxima Música"
      >
        <img src={nextIcon} alt="Próxima Música" className="w-[2.8vh] h-[2.8vh]" />
      </button>

      {/* Informações da faixa */}
      <div className="flex flex-col text-white text-[1.75vh] min-w-25 max-w-50 overflow-hidden whitespace-nowrap text-ellipsis leading-tight">
        <span>
          {listaMusicas.length > 0
            ? listaMusicas[indiceMusica].nome
            : 'Nenhuma Música Encontrada'}
        </span>
        <div className="text-[1.25vh] text-[#aaa]">
          {formatarTempo(tempoAtual.atual)} / {formatarTempo(tempoAtual.duracao)}
        </div>
      </div>

      {/* Controle de volume */}
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={lidarMudancaVolume}
          title={`Volume: ${Math.round(volume * 100)}%`}
          style={volumeSliderStyle}
          className="appearance-none"
        />
      </div>
    </div>
  );
};

export default PlayerMusica;