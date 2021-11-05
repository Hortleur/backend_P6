const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce');


// C Création
router.post('/', auth, multer, sauceCtrl.createSauce);
// R Lecture
router.get('/', auth, sauceCtrl.getAllSauce);
// R Lecture
router.get('/:id', auth, sauceCtrl.getOneSauce)
// U Mise à jour
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
// D Suppression
router.delete('/:id', auth, sauceCtrl.deleteSauce)


module.exports = router;