import type { Tarefa } from './tipo';

export const tarefas: Tarefa[] = [
    { id: 1, titulo: "Estudar Interface", prioridade: "alta", status: "pendente", tags: ["estudo"], criadaEm: new Date() },
    
    { id: 2, titulo: "Algo em Andamento", prioridade: "baixa", status: "em_andamento", tags: ["estudo", "aleatório"], criadaEm: new Date() },

    { id: 3, titulo: "Mais uma tarefa", prioridade: "media", status: "concluida", tags: ["estudo", "aleatório"], criadaEm: new Date() },

    { id: 4, titulo: "Enfim outra tarefa", prioridade: "media", status: "pendente", tags: ["estudo", "aleatório"], criadaEm: new Date() },

    { id: 5, titulo: "Buenos Dias - Introdução ao Espanhol Argentino", prioridade: "alta", status: "em_andamento", tags: ["estudo", "linguagem"], criadaEm: new Date() },

     { id: 5, titulo: "Minezin Sábado", prioridade: "alta", status: "pendente", tags: ["diversão", "estudo"], criadaEm: new Date() },
]