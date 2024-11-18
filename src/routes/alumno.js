const express = require('express')
const router = express.Router()
const Students = require('../controllers/StudentController')
const authenticateToken = require('../middlewares/authmiddleware')

router.get('/panel-alumno/:dni', authenticateToken, Students.showInfoStudent) 

module.exports = router