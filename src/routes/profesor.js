const express = require('express')
const router = express.Router()
const Students = require('../controllers/StudentController')
const authenticateToken = require('../middlewares/authmiddleware')

router.get('/panel-profesor', authenticateToken, (req,res) => {
    if(req.user.role !== 'teacher') return res.status(403).send('Acceso denegado')
    res.render('panel-profesor', {user:req.user})
})

router.get('/buscar-alumno', Students.findStudentByDni)

router.post('/registrar-notas', Students.registerStudentScores) 

module.exports = router