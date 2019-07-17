const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {
    check,
    validationResult
} = require('express-validator/check')

const User = require('../../models/User')

// @route POST api/users
// @desс  Register user
// @acces Public
router.post('/', [
        check('userName', "User name is required")
        .not()
        .isEmpty(),
        check('email', 'Please include a valid email')
        .isEmail(),
        check('password', "Please enter a password with 6 or more charachters")
        .isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            userName,
            email,
            password
        } = req.body
        try {
            //see if user exist
            let user = await User.findOne({
                email
            })
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: "User already exist"
                    }]
                })
            }
            //Get users gravatar

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                userName,
                email,
                avatar,
                password
            })

            //Encrypt password

            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            await user.save()

            //Return jsonwebtoken

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err
                    res.json({
                        token
                    })
                })

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')

        }
    })

module.exports = router;