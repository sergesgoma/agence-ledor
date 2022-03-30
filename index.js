const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path:'./.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// connexion à la DB 
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true}, { useUnifiedTopology: true});

// charge les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));


// Schéma de la BDD du formulaire
const contactSchema = ({
    name: String,
    email: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

const db = mongoose.connection;

// pour savoir si on est bien connectés à la DB
db.on('error', () => console.log('Error in connecting to Database'));
db.once('open', () => console.log('Connected to Database'));

// route post du formulaire contact
app.post('/', (req, res) => {
    let newContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });
    newContact.save();
    res.redirect('/');
})

// route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})