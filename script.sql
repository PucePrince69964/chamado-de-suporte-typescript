CREATE DATABASE IF NOT EXISTS chamados_suporte
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chamados_suporte;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chamados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NULL,
  prioridade ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'media',
  status ENUM('aberto', 'em_andamento', 'resolvido') NOT NULL DEFAULT 'aberto',
  urgencia VARCHAR(20) NOT NULL DEFAULT 'Nivel 2',
  usuario_id INT NOT NULL,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chamados_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- Usuários de teste da Aula 5 (senha de todos: senha123)
INSERT INTO usuarios (nome, email, senha_hash) VALUES
  ('Marcelo Macrino', 'marcelo@email.com', '$2b$10$mDxl2ubcI70/KrG/h4H0n.Pok4jKJZfmh4R0QPSiWszf340mDT9e.'),
  ('João Silva', 'joao@email.com', '$2b$10$mDxl2ubcI70/KrG/h4H0n.Pok4jKJZfmh4R0QPSiWszf340mDT9e.'),
  ('Maria Souza', 'maria@email.com', '$2b$10$mDxl2ubcI70/KrG/h4H0n.Pok4jKJZfmh4R0QPSiWszf340mDT9e.');

-- Chamados iniciais separados por usuário
INSERT INTO chamados (titulo, prioridade, status, urgencia, usuario_id) VALUES
  ('Servidor de arquivos sem acesso na rede', 'alta', 'aberto', 'Nivel 1', 1),
  ('Atualizar certificado SSL do portal', 'media', 'em_andamento', 'Nivel 2', 1),
  ('Trocar teclado com defeito no RH', 'baixa', 'aberto', 'Nivel 3', 2),
  ('Erro 500 ao emitir nota fiscal', 'alta', 'aberto', 'Nivel 1', 3);