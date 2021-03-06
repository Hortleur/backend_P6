const Sauce = require('../models/sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [' '],
        userDisliked: [' ']
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
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
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
        .catch(error => res.status(403).json({
            error
        }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne( {_id: req.params.id})
    .then( sauce => {
        const filename = sauce.imageUrl.split('/image/')[1];
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

exports.likes = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    switch (like) {
        case 1 : 
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: 'j\'aime cette sauce' }))
        .catch((error) => res.status(400).json({ error }))
        break;
    
        case 0 :
            Sauce.findOne({ _id: sauceId})
                .then((sauce) => {
                    if(sauce.usersLiked.includes(userId)){
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                        .then(() => res.status(200).json({ message: 'Pas d\'avis' }))
                        .catch((error) => res.status(400).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(userId)) { 
                      Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                        .then(() => res.status(200).json({ message: 'Pas d\'avis'}))
                        .catch((error) => res.status(400).json({ error }))
                    }
                  })
                .catch((error) => res.status(404).json({ error }))        
        break;

        case -1:
            Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId}, $inc: {dislikes: +1}})
                .then(() => res.status(200).json({message: 'je n\' aime pas cette sauce'}))
                .catch((error) => res.status(400).jsonj({error}))    
        break;
    }
}
