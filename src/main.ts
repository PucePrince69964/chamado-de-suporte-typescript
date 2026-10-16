import { elemento } from "./dom";
import { tarefas } from "./dados";

const nomeDoSistema: string = "TaskFlow"
const versao: string = "0.1.0"
const hoje:string = new Date().toLocaleDateString("pt-BR")
const autor: string = "Turma COO - A - Vinicius"

elemento("nome-do-sistema").textContent = nomeDoSistema
elemento("versao").textContent = versao
elemento("data-de-hoje").textContent = hoje

console.log(`${nomeDoSistema.toUpperCase()} criado. Autor: ${autor}`)

const lista = elemento("lista")
for (const tarefa of tarefas){
    const item = document.createElement("li")
    item.className = `tarefa tarefa--${tarefa.prioridade}`
    const titulo = document.createElement("h3")
    item.className = "tarefa__titulo"
    titulo.textContent = `#${tarefa.id} ${tarefa.titulo}`
    const etiqueta = document.createElement('span')
    etiqueta.className = `etiqueta etiqueta--${tarefa.prioridade}`
    etiqueta.className = tarefa.prioridade
    lista.append(titulo, etiqueta)
    lista.append(item)
}