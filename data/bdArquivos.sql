CREATE DATABASE DB_HASH_VALIDATOR;
USE DB_HASH_VALIDATOR;

CREATE TABLE TB_ARQUIVOS (
    arq_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    arq_nome VARCHAR(255) NOT NULL,
    arq_mime_type VARCHAR(100), -- Guarda o tipo do arquivo (ex: 'application/zip', 'audio/mp3')
    arq_dados LONGBLOB NOT NULL, -- AQUI ficam guardados os bytes do áudio/zip de fato
    arq_hash_policia VARCHAR(64) NOT NULL, -- O texto do hash que a advogada colou (SHA-256 tem 64 caracteres)
    arq_status_validacao VARCHAR(20) NOT NULL, -- 'INTEGRO' ou 'CORROMPIDO'
    arq_criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data e hora exata da validação
);