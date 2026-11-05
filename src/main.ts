import { campo, elemento, selecao } from "./dom";
import { tarefas } from "./dados";
import type { Prioridade, Tarefa, Urgencia } from "./tipo.ts";
import { adicionarTarefa, transformar } from "./servicos";
elemento("nome-do-sistema").textContent = "Chamados de Suporte";
elemento("versao").textContent = "v0.2.0";
elemento("data-de-hoje").textContent = new Date().toLocaleDateString("pt-BR");

const lista: Tarefa[] = [...tarefas];

function criarItem(tarefa: Tarefa): HTMLLIElement {
    const item = document.createElement("li");
    item.className = `tarefa tarefa--${tarefa.prioridade}`;
    const titulo = document.createElement("h3");
    titulo.className = "tarefa__titulo";
    titulo.textContent = `#${tarefa.id} ${tarefa.titulo}`;
    const etiqueta = document.createElement("span");
    etiqueta.className = `etiqueta etiqueta--${tarefa.prioridade}`;
    etiqueta.textContent = tarefa.prioridade;
    item.append(titulo, etiqueta);
    return item;
}

function desenhar(): void {
    const itens = transformar(lista, criarItem); 
    elemento("lista").replaceChildren(...itens);
    let pendentes = 0;
    let contador = 0;
    for (const tarefa of lista) {
        if (tarefa.status === "aberto") {
            pendentes++;
        }

        if (tarefa.urgencia === "Nivel 1") {
            contador++;
        }      
    }
    console.log(contador)
elemento("total").textContent = String(lista.length);
elemento("pendentes").textContent = String(pendentes);
elemento("mais-importantes").textContent = String(contador);
}

elemento("formulario").addEventListener("submit", (evento) => {
    evento.preventDefault();
    elemento("erro").textContent = "";
    try {
        adicionarTarefa(lista, {
            titulo: campo("titulo").value.trim(),
            prioridade: selecao("prioridade").value as Prioridade,
            urgencia: selecao("urgencia").value as Urgencia,
            tags: [],
        });
        campo("titulo").value = "";
        desenhar();
    } catch (erro) {
        if (erro instanceof Error) {
            elemento("erro").textContent = erro.message;
        }
    }
});
desenhar();