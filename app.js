require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View engine setup
app.set('view engine', 'ejs');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Port address
const PORT = process.env.PORT || 3300

app.get('/', (req, res) =>{
    res.render('contact', {msg: 'Hello User'});
})


app.post('/send', (req, res) =>{

    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    ${req.body.message}
    `

    let transporter = nodemailer.createTransport({
        host: "Sujon Hasan",
        port: 587,
        secure: false,
        service: "gmail",
        auth:{
            user: process.env.SEND_MAIL,
            pass: process.env.PASSWORD
        },
    })

    let mailOption = {
        // from: "2020200010005@seu.edu.bd", // sender address
        // to: "sujonislamjoy@gmail.com", // list of receiver
        to: process.env.TO_MAIL,
        subject: "Node contace Request", // subject line
        text: 'hello world', // plain text body
        html: output // html body

    }


    transporter.sendMail(mailOption, (err, info) =>{

        if(err) return console.log(err);
        console.log('Message sent : %s', info.messageId);
        // console.log('Preview URL : %s', info.getTestMessageUrl(info));
        res.render('contact', {msg: 'Email has been sent'});
        // res.render('contact');
        // res.redirect('contact');
    });
})


app.listen(PORT, ()=>{
    console.log(`listening port ${PORT}`);
})