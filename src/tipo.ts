export type Prioridade = "baixa" | "media" | "alta";
export type Status = "aberto" | "em_andamento" | "resolvido";
export type Urgencia = "Nivel 1" | "Nivel2" | "Nivel3";

export interface Tarefa {
    readonly id: number;
    titulo: string;
    descricao?: string;
    prioridade: Prioridade;
    status: Status;
    tags: string[];
    criadaEm: Date;
    urgencia: Urgencia;
}

export type NovaTarefa = Omit<Tarefa, "id" | "status" | "criadaEm">;