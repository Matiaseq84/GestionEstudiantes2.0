const express = require('express')
const router = express.Router()
const Students = require('../controllers/StudentController')
const authenticateToken = require('../middlewares/authmiddleware')

router.get('/panel-administrador', authenticateToken, (req, res) => {
    console.log(req.user.role)
    if(req.user.role !== 'admin') return res.status(403).send('Acceso denegado')
    res.render('panel-administrador', {user: req.user})
})

router.post('/registrar-estudiante', Students.addStudent) 
    
router.get('/buscar-alumno', Students.findStudentByDni) 

router.post('/inscripcion-materias', Students.enrolSubjects) 

module.exports = router
