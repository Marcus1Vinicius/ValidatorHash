const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const mysql = require('mysql2');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

app.post('/api/validar-evidencia', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        }

        const hashPolicia = req.body.hashPolicia.toLowerCase(); 
        const arquivoBuffer = req.file.buffer;
        const nomeArquivo = req.file.originalname;

        const hashCalculado = crypto
            .createHash('sha256') 
            .update(arquivoBuffer)
            .digest('hex');

        if (hashCalculado === hashPolicia) {
            const mimeType = req.file.mimetype; 

            const sql = `INSERT INTO TB_ARQUIVOS 
                (arq_nome, arq_mime_type, arq_dados, arq_hash_policia, arq_status_validacao) 
                VALUES (?, ?, ?, ?, ?)`;

            connection.query(sql, [nomeArquivo, mimeType, arquivoBuffer, hashPolicia, 'INTEGRO'], (err) => {
                if (err) {
                    console.error("Erro ao salvar no banco:", err);
                    return res.status(500).json({ message: 'Erro ao salvar a evidência no banco de dados.' });
                }
                
                return res.status(200).json({ 
                    message: 'O arquivo é autêntico! O hash gerado confere exatamente com o fornecido. Evidência salva com segurança.' 
                });
            });
        } else {
            return res.status(400).json({ 
                message: `ALERTA DE ALTERAÇÃO! O hash do arquivo enviado não bate com o hash informado.\n\nHash Informado: ${hashPolicia}\nHash Real do Arquivo: ${hashCalculado}` 
            });
        }
            
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando perfeitamente na porta 3000!');
});