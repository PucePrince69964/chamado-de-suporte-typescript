import "dotenv/config"; // primeira linha: carrega o .env antes de tudo
import bcrypt from "bcryptjs";
import express, { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { exigirLogin, SEGREDO, usuarioDe } from "./autenticacao";
import { banco } from "./banco";

const app = express();
app.use(express.json());

const PORTA = Number(process.env.PORTA ?? 3000);

interface ChamadoLinha extends RowDataPacket {
  id: number;
  titulo: string;
  descricao: string | null;
  prioridade: "baixa" | "media" | "alta";
  status: "aberto" | "em_andamento" | "resolvido";
  urgencia: string;
  criadaEm: string;
}

// ==================== CHAMADOS DE SUPORTE (Protegidos) ====================

// Listar apenas os chamados do usuário logado
app.get("/api/chamados", exigirLogin, async (_req: Request, res: Response) => {
  const [linhas] = await banco.execute<ChamadoLinha[]>(
    `SELECT id, titulo, descricao, prioridade, status, urgencia, criada_em AS criadaEm
     FROM chamados
     WHERE usuario_id = ?
     ORDER BY id DESC`,
    [usuarioDe(res)]
  );
  res.json(linhas);
});

// Criar novo chamado para o usuário logado
app.post("/api/chamados", exigirLogin, async (req: Request, res: Response) => {
  const { titulo, descricao, prioridade, urgencia } = req.body as {
    titulo?: string;
    descricao?: string;
    prioridade?: "baixa" | "media" | "alta";
    urgencia?: string;
  };

  if (!titulo || titulo.trim().length < 3) {
    res.status(400).json({ erro: "O título precisa ter pelo menos 3 caracteres." });
    return;
  }

  const prioridadeValida = prioridade ?? "media";
  const urgenciaValida = urgencia ?? "Nivel 2";

  const [resultado] = await banco.execute<ResultSetHeader>(
    `INSERT INTO chamados (titulo, descricao, prioridade, status, urgencia, usuario_id)
     VALUES (?, ?, ?, 'aberto', ?, ?)`,
    [titulo.trim(), descricao?.trim() ?? null, prioridadeValida, urgenciaValida, usuarioDe(res)]
  );

  const [criados] = await banco.execute<ChamadoLinha[]>(
    `SELECT id, titulo, descricao, prioridade, status, urgencia, criada_em AS criadaEm
     FROM chamados
     WHERE id = ? AND usuario_id = ?`,
    [resultado.insertId, usuarioDe(res)]
  );

  res.status(201).json(criados[0]);
});

// Atualizar status do chamado (apenas se pertencer ao usuário logado)
app.patch("/api/chamados/:id", exigirLogin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status?: "aberto" | "em_andamento" | "resolvido" };

  if (!status || !["aberto", "em_andamento", "resolvido"].includes(status)) {
    res.status(400).json({ erro: "Status inválido." });
    return;
  }

  const [resultado] = await banco.execute<ResultSetHeader>(
    "UPDATE chamados SET status = ? WHERE id = ? AND usuario_id = ?",
    [status, id, usuarioDe(res)]
  );

  if (resultado.affectedRows === 0) {
    res.status(404).json({ erro: "Chamado não encontrado." });
    return;
  }

  res.json({ id, status });
});

// Excluir chamado (apenas se pertencer ao usuário logado)
app.delete("/api/chamados/:id", exigirLogin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const [resultado] = await banco.execute<ResultSetHeader>(
    "DELETE FROM chamados WHERE id = ? AND usuario_id = ?",
    [id, usuarioDe(res)]
  );

  if (resultado.affectedRows === 0) {
    res.status(404).json({ erro: "Chamado não encontrado." });
    return;
  }

  res.status(204).send();
});

// ==================== USUÁRIOS E AUTENTICAÇÃO (Aula 5) ====================

app.post("/api/usuarios", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body as {
    nome?: string;
    email?: string;
    senha?: string;
  };

  if (!nome?.trim() || !email?.includes("@") || !senha || senha.length < 6) {
    res.status(400).json({
      erro: "Preencha nome, e-mail válido e senha de 6 caracteres ou mais.",
    });
    return;
  }

  const hash = await bcrypt.hash(senha, 10);

  try {
    const [resultado] = await banco.execute<ResultSetHeader>(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome.trim(), email.trim().toLowerCase(), hash]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if ((erro as { code?: string }).code === "ER_DUP_ENTRY") {
      res.status(409).json({ erro: "Este e-mail já está cadastrado." });
      return;
    }
    throw erro;
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body as { email?: string; senha?: string };

  const [linhas] = await banco.execute<RowDataPacket[]>(
    "SELECT id, nome, senha_hash FROM usuarios WHERE email = ?",
    [email?.trim().toLowerCase() ?? ""]
  );

  const usuario = linhas[0];
  if (!usuario || !senha || !(await bcrypt.compare(senha, usuario.senha_hash))) {
    res.status(401).json({ erro: "E-mail ou senha inválidos." });
    return;
  }

  const token = jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: "8h" });
  res.json({ token, nome: usuario.nome });
});

// Rota protegida de perfil (Desafio Prata da Aula 5)
app.get("/api/eu", exigirLogin, async (_req: Request, res: Response) => {
  const [linhas] = await banco.execute<RowDataPacket[]>(
    "SELECT id, nome, email FROM usuarios WHERE id = ?",
    [usuarioDe(res)]
  );
  res.json(linhas[0]);
});

app.listen(PORTA, () => {
  console.log(`API de Chamados de Suporte rodando em http://localhost:${PORTA}`);
});