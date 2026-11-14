export type Prioridade = "baixa" | "media" | "alta";
export type Status = "aberto" | "em_andamento" | "resolvido";
export type Urgencia = "Nivel 1" | "Nivel 2" | "Nivel 3";

export interface Chamado {
  readonly id: number;
  titulo: string;
  descricao?: string | null;
  prioridade: Prioridade;
  status: Status;
  urgencia: Urgencia;
  criadaEm: string;
}

export type NovoChamado = Omit<Chamado, "id" | "status" | "criadaEm">;

export interface Sessao {
  token: string;
  nome: string;
}