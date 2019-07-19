const express = require('express')
const request = require('request')
const config = require('config')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
    check,
    validationResult
} = require('express-validator/check')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

// @route GET api/profile/me
// @desc  Get cuurent users profile
// @acces Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['userName', 'avatar'])

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user'
            })
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route Post api/profile
// @desc  Create or udate user profile
// @acces Private

router.post('/', [auth, [
        check('location', 'Location is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            location,
            bio
        } = req.body

        //Build profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio

        try {
            let profile = await Profile.findOne({
                user: req.user.id
            })

            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                })
                return res.json(profile)
            }
            // Create profile
            profile = new Profile(profileFields)

            await profile.save()
            return res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    })

// @route Get api/profile/
// @desc Get all profiles
// @acces Public

router.get('/', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route Get api/profile/user/:user_id
// @desc  Get profile by User ID
// @acces Public

router.get('/user/:user_id', async (req, res) => {

    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({
            msg: "Profile not found"
        })
        
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.status(500).send('Server Error')
    }
})

// @route Delete api/profile/
// @desc Delete profile, user & post
// @acces Private

router.delete('/', auth, async (req, res) => {

    try {
        //Remove user posts
        await Post.deleteMany({user: req.user.id})
        //TO DO: add check if user dont have a single post or Profile

        // Remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        })
        // Remove user
        await User.findOneAndRemove({
            _id: req.user.id
        })
        res.json({
            msg: "User deleted"
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route PUT api/profile/subscribe/:id
// @decs  Subscribe to a user and update user`s subscribers list
// @acces Private

router.put("/subscribe/:id", auth, async (req, res) => {

    try {
        if (req.params.id === req.user.id)
        return res.status(404).json({
            msg: "You cant subscribe to yourself"
        })

        // Profile of subscription user
        const subsscriberProfile = await Profile.findOne({user: req.params.id})
        
        const profile = await Profile.findOne({user: req.user.id})

        if (!subsscriberProfile)
            return res.status(404).json({
                msg: "User not found"
            })

        // Check if the User has already been subscribe to a user

        if (
            profile.subscriptions.filter(subscription => subscription.user.toString() === req.params.id).length > 0
        ) {
            return res.status(400).json({
                msg: "You have been already subscribe to this user"
            })
        }

        profile.subscriptions.unshift({
            user: req.params.id
        })

        subsscriberProfile.subscribers.unshift({
            user: req.user.id
        })

        await profile.save()
        await subsscriberProfile.save()

        res.json(profile.subscriptions)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
})

// @route PUT api/profile/unsubscribe/:id
// @decs  Unsubscribe from a user and update user`s subscribers list
// @acces Private

router.put("/unsubscribe/:id", auth, async (req, res) => {

    try {
        if (req.params.id === req.user.id)
        return res.status(404).json({
            msg: "You cant unsubscribe from yourself"
        })

        const profile = await Profile.findOne({user: req.user.id})
        // Profile of subscription user
        const subsscriberProfile = await Profile.findOne({user: req.params.id})

        if (!subsscriberProfile)
            return res.status(404).json({
                msg: "Profile not found"
            })

        // Check if the User has already been subscribe to a user

        if (
            profile.subscriptions.filter(subscription => subscription.user.toString() === req.params.id).length === 0
        ) {
            return res.status(400).json({
                msg: "You haven`t been subscribe to this user yet"
            })
        }

        // Get the remove index

        const removeIndex = profile.subscriptions.map(subscription => subscription.user.toString()).indexOf(req.params.id)

        // Get the remove index for subscriber

        const removeIndexSubcriber = subsscriberProfile.subscribers.map(subscription => subscription.user.toString()).indexOf(req.params.id)

        profile.subscriptions.splice(removeIndex, 1)

        subsscriberProfile.subscribers.splice(removeIndexSubcriber, 1)

        await profile.save()
        await subsscriberProfile.save()

        res.json(profile.subscriptions)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
})


module.exports = router