require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();

// View engine setup
app.set('view engine', 'ejs');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Port address
const PORT = process.env.PORT || 3300

// user multer dependence and code 
const multer = require('multer');
// file upload folder
const UPLOADS_FOLDER = "./images/";
// define the storage
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {

        // import file, pdf 
        const fileExt = path.extname(file.originalname);
        const filename = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("_") + "_" + Date.now();
        cb(null, filename + fileExt);
    },
});
var upload = multer({
    storage: Storage
}).single('image');


app.get('/', (req, res) => {
    res.render('contact', { msg: 'Hello User' });
})

app.post('/send', (req, res) =>{

    upload(req, res, (err)=>{

        if(err){
            console.log(err);
            return res.end("something went worng")
        }
        else{
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
                to: process.env.TO_MAIL,
                subject: "Node contace Request", // subject line
                text: 'hello world', // plain text body
                html: output, // html body
                attachments: [
                    {path: req.file.path}
                ]
            }
        
            transporter.sendMail(mailOption, (err, info) =>{
                if(err) return console.log(err);
                fs.unlink(req.file.path, (err)=>{

                    if(err) return res.end(err)

                    console.log('Message sent : %s', info.messageId);
                    res.render('contact', {msg: 'Email has been sent'});
                })
            });
        }
    })
    
})


app.listen(PORT, () => {
    console.log(`listening port ${PORT}`);
})