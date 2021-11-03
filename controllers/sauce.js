const Sauce = require('../models/sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    delete sauceObject._id
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne( {_id: req.params.id})
    .then( sauce => {
        const filname = sauce.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}`, () => {
            Sauce.deleteOne({
                _id: req.params.id
            })
            .then(() => res.status(200).json({
                message: 'Sauce supprimée !'
            }))
            .catch(error => res.status(400).json({
                error
            }))
        })
    })
    .catch(error => res.status(500).json({error})) 
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error
        }))
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }))
}