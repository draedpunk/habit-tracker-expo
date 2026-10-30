// Atividade aplicada · Aula 7 — a lista de hábitos compartilhada entre as telas.
//
// Enquanto só a lista lia os hábitos, o `useState` podia morar nela. Agora o detalhe
// (`habit/[id]`) precisa enxergar o mesmo dado: buscando direto no mock, um hábito recém-
// registrado apareceria como "não encontrado" e o status alternado voltaria ao original.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { HABITOS } from '../data/habitos';
import type { Habito } from '../types/habito';

type HabitosContexto = {
  habitos: Habito[];
  alternar: (id: string) => void;
  remover: (id: string) => void;
  adicionar: (novo: Habito) => void;
  recarregar: () => void;
};

const Contexto = createContext<HabitosContexto | null>(null);

export function HabitosProvider({ children }: { children: ReactNode }) {
  const [habitos, setHabitos] = useState<Habito[]>(HABITOS);

  const valor = useMemo<HabitosContexto>(
    () => ({
      habitos,
      alternar(id) {
        setHabitos((prev) =>
          prev.map((h) =>
            h.id === id
              ? { ...h, status: h.status === 'pendente' ? 'concluido' : 'pendente' }
              : h
          )
        );
      },
      remover(id) {
        setHabitos((prev) => prev.filter((h) => h.id !== id));
      },
      adicionar(novo) {
        // Array NOVO, como na Aula 4 — nunca `push` no anterior. E ele entra no TOPO: no fim
        // da lista o usuário teria que rolar para ver o resultado do que acabou de fazer.
        setHabitos((prev) => [novo, ...prev]);
      },
      recarregar() {
        // Recarregar volta ao mock, mas NÃO joga fora o que o usuário registrou: um hábito
        // que custou duas permissões não pode sumir no primeiro puxão de tela. Os
        // registrados são os que não estão no mock — os do topo continuam no topo.
        setHabitos((prev) => {
          const idsDoMock = new Set(HABITOS.map((h) => h.id));
          const registrados = prev.filter((h) => !idsDoMock.has(h.id));
          return [...registrados, ...HABITOS];
        });
      },
    }),
    [habitos]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useHabitos(): HabitosContexto {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error('useHabitos precisa estar dentro de <HabitosProvider>.');
  }
  return contexto;
}
