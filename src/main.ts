import {
  atualizarStatusChamado,
  criarChamado,
  criarConta,
  encerrarSessao,
  entrar,
  excluirChamado,
  guardarSessao,
  listarChamados,
  sessaoAtual,
} from "./api";
import { campo, elemento, selecao } from "./dom";
import type { Chamado, Prioridade, Status, Urgencia } from "./tipo";

elemento("nome-do-sistema").textContent = "Chamados de Suporte";
elemento("versao").textContent = "v1.0.0";
elemento("data-de-hoje").textContent = new Date().toLocaleDateString("pt-BR");

let lista: Chamado[] = [];

const ROTULOS_STATUS: Record<Status, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

const PROXIMO_STATUS: Record<Status, Status> = {
  aberto: "em_andamento",
  em_andamento: "resolvido",
  resolvido: "aberto",
};

function mostrarErro(erro: unknown): void {
  const mensagem = erro instanceof Error ? erro.message : "Erro inesperado.";
  elemento("erro").textContent = mensagem;
}

function criarItem(chamado: Chamado): HTMLLIElement {
  const item = document.createElement("li");
  item.className = `tarefa tarefa--${chamado.prioridade}`;

  const titulo = document.createElement("h3");
  titulo.className = "tarefa__titulo";
  titulo.textContent = `#${chamado.id} ${chamado.titulo}`;

  const urgencia = document.createElement("span");
  urgencia.className = "etiqueta etiqueta--status";
  urgencia.textContent = chamado.urgencia.replace("Nivel ", "Nível ");

  const etiqueta = document.createElement("span");
  etiqueta.className = `etiqueta etiqueta--${chamado.prioridade}`;
  etiqueta.textContent = chamado.prioridade;

  const botaoStatus = document.createElement("button");
  botaoStatus.type = "button";
  botaoStatus.className = "botao botao--pequeno";
  botaoStatus.textContent = ROTULOS_STATUS[chamado.status];
  botaoStatus.addEventListener("click", async () => {
    try {
      elemento("erro").textContent = "";
      const proximo = PROXIMO_STATUS[chamado.status];
      await atualizarStatusChamado(chamado.id, proximo);
      chamado.status = proximo;
      desenhar();
    } catch (erro) {
      mostrarErro(erro);
    }
  });

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "botao botao--pequeno";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", async () => {
    try {
      elemento("erro").textContent = "";
      await excluirChamado(chamado.id);
      lista = lista.filter((c) => c.id !== chamado.id);
      desenhar();
    } catch (erro) {
      mostrarErro(erro);
    }
  });

  const meta = document.createElement("div");
  meta.className = "tarefa__meta";
  meta.append(urgencia, etiqueta, botaoStatus, botaoExcluir);

  item.append(titulo, meta);
  return item;
}

function desenhar(): void {
  const itens = lista.map(criarItem);
  elemento("lista").replaceChildren(...itens);

  let pendentes = 0;
  let urgentes = 0;

  for (const chamado of lista) {
    if (chamado.status === "aberto") {
      pendentes++;
    }
    if (chamado.urgencia === "Nivel 1") {
      urgentes++;
    }
  }

  elemento("total").textContent = String(lista.length);
  elemento("pendentes").textContent = String(pendentes);
  elemento("mais-importantes").textContent = String(urgentes);

  const aviso = elemento("comece-por");
  aviso.hidden = lista.length > 0;
  aviso.textContent = "Nenhum chamado cadastrado ainda. Use o formulário acima para abrir o primeiro.";
}

elemento("formulario").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  elemento("erro").textContent = "";

  try {
    const novo = await criarChamado({
      titulo: campo("titulo").value.trim(),
      prioridade: selecao("prioridade").value as Prioridade,
      urgencia: selecao("urgencia").value as Urgencia,
    });
    lista.unshift(novo);
    campo("titulo").value = "";
    desenhar();
  } catch (erro) {
    mostrarErro(erro);
  }
});

// ==================== TELA DE ENTRADA (Aula 5) ====================

function mostrarErroEntrada(erro: unknown): void {
  const mensagem = erro instanceof Error ? erro.message : "Erro inesperado.";
  elemento("erro-entrada").textContent = mensagem;
}

function mostrarFormulario(criando: boolean): void {
  elemento("form-criar").hidden = !criando;
  elemento("form-entrar").hidden = criando;
  elemento("alternar-entrada").textContent = criando
    ? "Já tenho conta"
    : "Ainda não tenho conta";
  elemento("erro-entrada").textContent = "";
}

elemento("alternar-entrada").addEventListener("click", () => {
  mostrarFormulario(elemento("form-criar").hidden === true);
});

elemento("form-entrar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try {
    guardarSessao(await entrar(campo("entrar-email").value, campo("entrar-senha").value));
    campo("entrar-senha").value = "";
    await iniciar();
  } catch (erro) {
    mostrarErroEntrada(erro);
  }
});

elemento("form-criar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const email = campo("criar-email").value;
  const senha = campo("criar-senha").value;

  try {
    await criarConta(campo("criar-nome").value, email, senha);
    guardarSessao(await entrar(email, senha));
    (elemento("form-criar") as HTMLFormElement).reset();
    await iniciar();
  } catch (erro) {
    mostrarErroEntrada(erro);
  }
});

elemento("botao-sair").addEventListener("click", () => {
  encerrarSessao();
  lista = [];
  (elemento("form-entrar") as HTMLFormElement).reset();
  mostrarFormulario(false);
  iniciar();
});

async function iniciar(): Promise<void> {
  const sessao = sessaoAtual();
  elemento("tela-entrada").hidden = sessao !== undefined;
  elemento("tela-app").hidden = sessao === undefined;
  elemento("botao-sair").hidden = sessao === undefined;
  elemento("usuario-nome").textContent = sessao?.nome ?? "";

  if (!sessao) {
    return;
  }

  elemento("erro-entrada").textContent = "";

  try {
    lista = await listarChamados();
    desenhar();
  } catch (erro) {
    mostrarErro(erro);
  }
}

iniciar();