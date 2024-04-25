const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cron = require('node-cron');
const PORT = 3001;

require('dotenv').config();

const ABSOLUTE_PATH = process.env.ABSOLUTE_PATH || path.join(__dirname, 'public');

app.use(express.static(ABSOLUTE_PATH));
app.use(bodyParser.urlencoded({ extended: true }));

let dataDevolucao = null;

app.post("/sendmail", async (req, res) => {
    console.log(req.body);

    const formData = req.body;
    const mail = formData.emailget;

    const transport = nodemailer.createTransport({
        host: "smtp.emailarray.com",
        port: "587",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        let message = await transport.sendMail({
            from: '"Gustavo Cunha" <ti@sorrisodetoledo.com.br>',
            to: `${mail}, ti@sorrisodetoledo.com.br`,
            subject: "Formulário",
            text: `
                Item: ${formData.Item}
                Data de Entrega: ${formData.dataEntrega}
                Data de Devolução: ${formData.dataDevolucao || ''}
                Nome do Responsável pela Entrega: ${formData.responsavel}
                Nome do Receptor: ${formData.receptor}
                Departamento/Setor: ${formData.departamento}
                Observações: ${formData.observacoes || ''}
            `
        });

        if (dataDevolucao && formData.checkbox) {
            // Enviar e-mail de devolução
            let devolucaoMessage = await transport.sendMail({
                from: '"Gustavo Cunha" <ti@sorrisodetoledo.com.br>',
                to: `${mail}, ti@sorrisodetoledo.com.br`,
                subject: "Devolução de Equipamento",
                text: 'O equipamento que foi emprestado á você precisa ser devolvido até as 17:00h'
            });
            console.log("E-mail de devolução enviado com sucesso:", devolucaoMessage);
        }

    } catch (error) {
        console.error("Erro ao enviar o email:", error);
    }

    res.send("<span>OK</span>");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(ABSOLUTE_PATH, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server on http://10.0.8.160:${PORT}`);
});
