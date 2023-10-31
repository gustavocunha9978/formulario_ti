const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
require ('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


const absolutePath = "C:\\Users\\gustavo.santos\\Documents\\GitHub\\formulario_ti_v2";


app.use(express.static(absolutePath));

app.post("/sendmail", async (request, response) => {
    console.log(request.body);
    
    const formData = request.body;
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
             to: `${mail}, ti@sorrisodetoledo.com.br`,// mudar o email aqui 
            subject: "Formulário",
            text: `
                Item: ${formData.Item}
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


app.get('/', (req, res) => {
    res.sendFile(path.join(absolutePath, 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server on http://10.0.8.121:${PORT}`);
});
