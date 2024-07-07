const express = require('express')
const router = new express.Router()
const userController = require ('../../controllers/user/index')
const otpController = require("../../controllers/otp");
const { UserAuth } = require('../../middleware/auth')


router.post('/test', userController.test)
router.get('/test', userController.test)
router.post('/register', userController.create)
router.post('/login', userController.login)
router.post('/social-login', userController.socialLogin)
router.post('/forgot-password', userController.forgotPassword)
router.post('/verify-otp', userController.verifyOTP)
router.post('/reset-password', userController.resetPassword)
router.post('/send-otp', otpController.sendEmailVerification);
module.exports = router;