const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require ('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sendmail", async (request, response) => {
    console.log(request.body);

    
    const formData = request.body;

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
            to: "estatistica@sorrisodetoledo.com.br, ti@sorrisodetoledo.com.br ", // mudar o email aqui 
            subject: "Formulário",
            text: `
                Modelo: ${formData.modelo}
                Data de Entrega: ${formData.dataEntrega}
                Nome do Responsável pela Entrega: ${formData.responsavel}
                Nome do Receptor: ${formData.receptor}
                Departamento/Setor: ${formData.departamento}
                Observações: ${formData.observacoes}
            `
        });
        response.send("Deu boa!");
    } catch (error) {
        console.error("Erro ao enviar o email:", error);
        response.status(500).send("Deu ruim.");
    }
});

app.listen(3001, () => {
    console.log("Rodando!");
});