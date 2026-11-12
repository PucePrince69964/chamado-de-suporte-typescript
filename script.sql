CREATE DATABASE IF NOT EXISTS chamado_suporte
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE chamado_suporte;

SHOW DATABASES;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,

    tipo ENUM(
        'solicitante',
        'tecnico',
        'administrador'
    ) NOT NULL DEFAULT 'solicitante',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    tecnico_id INT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT NOT NULL,

    prioridade ENUM(
        'baixa',
        'media',
        'alta'
    ) NOT NULL DEFAULT 'media',

    status ENUM(
        'aberto',
        'em_andamento',
        'concluido'
    ) NOT NULL DEFAULT 'aberto',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    concluido_em TIMESTAMP NULL,

    CONSTRAINT fk_chamado_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_chamado_tecnico
        FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id),

    CONSTRAINT chk_titulo
        CHECK (CHAR_LENGTH(titulo) >= 3),

    CONSTRAINT chk_descricao
        CHECK (CHAR_LENGTH(descricao) >= 10)
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS chamado_tag (
    chamado_id INT NOT NULL,

    tag_id INT NOT NULL,

    PRIMARY KEY (chamado_id, tag_id),

    CONSTRAINT fk_ct_chamado
        FOREIGN KEY (chamado_id)
        REFERENCES chamados(id),

    CONSTRAINT fk_ct_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
);

INSERT INTO usuarios (id, nome, email, tipo) VALUES
(1, 'Ana Silva', 'ana@email.com', 'solicitante'),
(2, 'Bruno Santos', 'bruno@email.com', 'solicitante'),
(3, 'Carlos Oliveira', 'carlos@email.com', 'tecnico'),
(4, 'Mariana Costa', 'mariana@email.com', 'administrador');

INSERT INTO chamados (
    id,
    usuario_id,
    tecnico_id,
    titulo,
    descricao,
    prioridade,
    status
) VALUES

(1, 1, 3,
 'Computador não liga',
 'O computador não apresenta nenhum sinal de funcionamento.',
 'alta',
 'em_andamento'),

(2, 2, NULL,
 'Problema com internet',
 'A conexão com a internet está apresentando instabilidade.',
 'media',
 'aberto'),

(3, 1, 3,
 'Erro no sistema',
 'O sistema apresenta uma mensagem de erro ao realizar login.',
 'alta',
 'concluido'),

(4, 2, NULL,
 'Solicitação de acesso',
 'Preciso de acesso ao sistema interno da empresa.',
 'baixa',
 'aberto'),

(5, 1, 3,
 'Impressora não funciona',
 'A impressora não está reconhecendo os documentos enviados.',
 'media',
 'em_andamento'),

(6, 2, NULL,
 'Atualização de software',
 'Solicito a atualização do software instalado no computador.',
 'baixa',
 'aberto');
 
INSERT INTO tags (id, nome) VALUES
(1, 'Hardware'),
(2, 'Software'),
(3, 'Rede'),
(4, 'Acesso'),
(5, 'Impressora');

INSERT INTO chamado_tag (chamado_id, tag_id) VALUES
(1, 1),
(2, 3),
(3, 2),
(4, 4),
(5, 5),
(6, 2);

SELECT * FROM usuarios;
SELECT * FROM tags;
SELECT * FROM chamados;
SELECT * FROM chamado_tag;

SELECT
    chamados.id,
    chamados.titulo,
    usuarios.nome AS solicitante,
    chamados.prioridade,
    chamados.status,
    tags.nome AS categoria

FROM chamados

INNER JOIN usuarios
    ON chamados.usuario_id = usuarios.id

INNER JOIN chamado_tag
    ON chamados.id = chamado_tag.chamado_id

INNER JOIN tags
    ON chamado_tag.tag_id = tags.id;
    
INSERT INTO chamados (
    usuario_id,
    titulo,
    descricao,
    prioridade,
    status
) VALUES (
    1,
    'Teste de ENUM',
    'Verificando valores permitidos.',
    'urgente',
    'aberto'
);

INSERT INTO chamados (
    usuario_id,
    titulo,
    descricao,
    prioridade,
    status
) VALUES (
    1,
    'OI',
    'Verificando a restrição de tamanho.',
    'baixa',
    'aberto'
);

INSERT INTO chamados (
    usuario_id,
    titulo,
    descricao,
    prioridade,
    status
) VALUES (
    9999,
    'Teste de chave estrangeira',
    'Verificando a integridade referencial.',
    'media',
    'aberto'
);

