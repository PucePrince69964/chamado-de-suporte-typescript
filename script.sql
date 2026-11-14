
-- =====================================
-- BANCO DE DADOS: CHAMADOS DE SUPORTE
-- =====================================

-- Criar tabela
CREATE TABLE chamados (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome TEXT NOT NULL,
    nivel TEXT NOT NULL,
    urgencia TEXT NOT NULL,
    prioridade TEXT NOT NULL
);

-- =====================================
-- INSERIR CHAMADOS
-- =====================================

INSERT INTO chamados (nome, nivel, urgencia, prioridade)
VALUES
('Computador não liga', 'Nivel 1', 'Nivel 1', 'alta'),
('Problema na impressora', 'Nivel 2', 'Nivel 2', 'media'),
('Erro no sistema', 'Nivel 3', 'Nivel 1', 'alta'),
('Solicitação de acesso', 'Nivel 2', 'Nivel 3', 'baixa'),
('Internet indisponível', 'Nivel 1', 'Nivel 1', 'alta'),
('Problema com senha', 'Nivel 3', 'Nivel 2', 'media');

-- =====================================
-- CONSULTAR TODOS OS CHAMADOS
-- =====================================

SELECT * FROM chamados;

-- =====================================
-- CONTAR TOTAL DE CHAMADOS
-- =====================================

SELECT COUNT(*) AS total
FROM chamados;

-- =====================================
-- CONTAR CHAMADOS DE NIVEL 1
-- =====================================

SELECT COUNT(*) AS mais_importantes
FROM chamados
WHERE urgencia = 'Nivel 1';

-- =====================================
-- CONTAR CHAMADOS POR PRIORIDADE
-- =====================================

SELECT prioridade, COUNT(*) AS quantidade
FROM chamados
GROUP BY prioridade;

-- =====================================
-- CONTAR CHAMADOS POR NIVEL
-- =====================================

SELECT nivel, COUNT(*) AS quantidade
FROM chamados
GROUP BY nivel;

-- =====================================
-- ORDENAR POR URGENCIA E PRIORIDADE
-- =====================================

SELECT *
FROM chamados
ORDER BY urgencia ASC, prioridade ASC;
