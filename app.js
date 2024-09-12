require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
};
const bodyParser = require('body-parser');

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json())

//Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});


//Rota para enviar email
app.post('/send-email', (req, res) =>{
    const{name, email, message} = req.body;

    console.log(`monitorando: name ${name}, email ${email}, message ${message}`);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Mensagem recebida no seu site de portfólio. Mensagem de: ${name}`,
        text: message


    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.error('Erro ao enviar e-mail:',error);
            return res.status(500).json({success: false, message: 'Erro ao enviar e-mail'});
        
        }
        console.log('E-mail enviado: ', info.response);
        res.status(200).json({success: true, message: 'E-mail enviado com sucesso!'});
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`)
});