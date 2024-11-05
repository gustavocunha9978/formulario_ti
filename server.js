const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const os = require('os');
const app = express();
const cron = require('node-cron');
const PORT = 3001;

const cors = require('cors');
app.use(cors());


require('dotenv').config();

const ABSOLUTE_PATH = process.env.ABSOLUTE_PATH || path.join(__dirname, 'public');
const localIP = os.networkInterfaces()['en0']?.find(ip => ip.family === 'IPv4')?.address || 'localhost';

app.use(express.static(ABSOLUTE_PATH));
app.use(bodyParser.urlencoded({ extended: true }));

let dataDevolucao = null;

app.post("/sendmail", async (req, res) => {
    console.log(req.body);

    const formData = req.body;
    const mail = formData.emailget;

    const transport = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        let message = await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: `${mail}, gustavo.cunha@biopark.com`, //trocar o email se for outra pessoa que for fazer o envio do Formulário
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
            let devolucaoMessage = await transport.sendMail({
                from:process.env.EMAIL_USER,
                to: `${mail}, gustavo.cunha@biopark.com.br`,
                subject: "Devolução de Equipamento",
                text: 'O equipamento que foi emprestado á você precisa ser devolvido até as 17:00h'
            });
            console.log("E-mail de devolução enviado com sucesso:", devolucaoMessage);
        }

        console.log("Deu Boa");
        res.status(200).json({ status: "success", message: "Deu Boa" });
    } catch (error) {
        console.error("Deu ruim", error);
        res.status(500).json({ status: "error", message: "Deu ruim" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(ABSOLUTE_PATH, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server on http://${localIP}:${PORT}`);
});
