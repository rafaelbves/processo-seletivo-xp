DROP DATABASE IF EXISTS XPSel;

CREATE DATABASE XPSel;

USE XPSel;

CREATE TABLE users (
    id INT NOT NULL auto_increment,
    nome VARCHAR(30) NOT NULL,
    senha VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE ativos (
    id INT NOT NULL auto_increment,
    nome VARCHAR(30) NOT NULL,
    valor DECIMAL(5,2) NOT NULL,
    quantidade INTEGER NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE contas (
    id_user INT NOT NULL,
    transacao DECIMAL(8,2),
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_user),
    FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE compras_vendas (
    id INT NOT NULL auto_increment,
    id_user INT NOT NULL,
    id_ativo INT NOT NULL,
    quantidade INT NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(id),
    FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (id_ativo)
        REFERENCES ativos (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;

SET SQL_SAFE_UPDATES = 0;

INSERT INTO XPSel.users (nome, senha) VALUES
    ("Alícia Raquel Figueiredo", "123456"),
    ("Ian Renan Aragão", "523684"),
    ("Tomás Julio Henry Melo", "125776"),
    ("Lorenzo Kaique Cavalcanti", "166544"),
    ("Heloisa Ayla Luciana Vieira", "153547");

INSERT INTO XPSel.ativos (nome, valor, quantidade, data) VALUES
    ("PETR4", 28.37, 1000, NOW()),
    ("XP", 18.22, 1000, NOW()),
    ("VALE", 13.04, 1000, NOW()),
    ("BBAS3", 33.60, 1000, NOW()),
    ("ELET6", 45.66, 1000, NOW());

INSERT INTO XPSel.contas (id_user, transacao, data) VALUES
    (1, 10000.00, NOW()),
    (2, 18250.00, NOW()),
    (3, 1500.00, NOW()),
    (4, 7000.00, NOW()),
    (5, 4000.00, NOW());
