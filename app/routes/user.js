const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');

module.exports = (router) => {

    /**
     * Check si Email exist on register
     */
    router.get('/checkEmail/:email', (req, res, next) => {
        if (!req.params.email) {
            return res.status(409).json({
                success: false,
                message: 'email not provided'
            });
        } else {
            User.findOne({ email: req.params.email }).select('email').exec((err, user) => {
                if (err) return next(err);
                if (!user) {
                    // Email non enregistré => valid
                    res.status(200).json({
                        success: true,
                        message: 'user not find'
                    });
                } else {
                    // Email enregistré => invalid
                    return res.status(200).json({
                        success: false,
                        message: 'Un compte existe déjà avec cette adresse email.'
                    });
                }
            });
        }
    });

    /**
     * Get Compte by Email
     */
    router.get('/email/:email', (req, res, next) => {
        if (!req.params.email) {
            return res.status(409).json({
                success: false,
                message: 'email not provided'
            });
        } else {
            User.findOne({ email: req.params.email }).select('nom prenom email adresse numTel').exec((err, user) => {
                if (err) return next(err);
                if (!user) {
                    res.status(409).json({
                        success: false,
                        message: 'user not find'
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        obj: user
                    });
                }
            });
        }
    });

    /**
     * Get Compte by Id
     */
    router.get('/id/:_id', (req, res, next) => {
        if (!req.params._id) {
            res.status(409).json({
                success: false,
                message: 'id not provided'
            });
        } else {
            User.findOne({ _id: req.params._id }).select('nom prenom email adresse numTel').exec((err, user) => {
                if (err) return next(err);
                if (!user) {
                    res.status(409).json({
                        success: false,
                        message: 'user not find'
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        obj: user
                    });
                }
            });
        }
    });

    /**
     * Réinitialise password
     */
    router.put('/init-password/:_id', (req, res, next) => {
        if (!req.body.password) {
            res.status(409).json({
                success: false,
                message: 'password not provided'
            });
        } else if (!req.params._id) {
            res.status(409).json({
                success: false,
                message: 'id not provided'
            });
        } else {
            User.findById(req.params._id, (err, user) => {
                if (err) return next(err);
                if (!user) {
                    res.status(409).json({
                        success: false,
                        message: 'user not find'
                    });
                } else {
                    console.log(req.body.password);
                    User.update({ _id: req.params._id }, { password: req.body.password }, (err, raw) => {
                        if (err) return next(err);
                        if (!raw) {
                            res.status(409).json({
                                success: false,
                                message: 'user not find'
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: 'Mot de passe réinitialisé',
                                obj: raw
                            });
                        }
                    });
                }
            });
        }
    });

    /**
     * Validate account
     */
    router.put('/validate-account/:_id', (req, res, next) => {
        if (!req.body) {
            res.status(409).json({
                success: false,
                message: 'body not provided'
            });
        } else if (!req.params._id) {
            res.status(409).json({
                success: false,
                message: 'id not provided'
            });
        } else {
            User.findByIdAndUpdate(req.params._id, { validAccount: req.body.validAccount }, { new: true }, (err, user) => {
                if (err) return next(err);
                if (!user) {
                    res.status(409).json({
                        success: false,
                        message: 'user not find'
                    });
                } else if (!user.validAccount) {
                    res.status(409).json({
                        success: false,
                        message: 'Erreur. Compte non validé'
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Compte validé',
                        obj: user
                    });
                }
            });
        }
    });


    return router;
}