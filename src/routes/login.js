const express = require('express')
const router = express.Router()
const Users = require('../controllers/UserController')


router.get("/", (req, res) => {
    res.render('login')
})

router.post("/", Users.validateLogin)  

module.exports = router