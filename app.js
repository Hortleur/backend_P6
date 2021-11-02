const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Sauce = require('./models/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://KevinBrun:Kev040355@kbrunp6.b1wrm.mongodb.net/KbrunP6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.post('/api/sauce', (req, res, next) => {
  delete req.body._id
  const sauce = new Sauce({
    ...req.body
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}))
});

app.use('/api/auth', userRoutes);

module.exports = app;