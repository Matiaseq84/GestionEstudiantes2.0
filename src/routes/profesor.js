const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises
const Students = require('../controllers/StudentController')

router.get('/panel-profesor', (req,res) => {
    res.render('panel-profesor')
})

router.get('/buscar-alumno', Students.findStudentByDni)

router.post('/registrar-notas', Students.registerStudentScores) /* => {
    const {dni, notas} = req.body

    console.log(notas + '' + dni)

    if(!notas) return res.status(400).send('Debés proporcionar el DNI del estudiante y al menos una nota')

    const filePath = path.join(__dirname, '../jsons/alumnos-materias.json')

    try {
        const dataAlumnosMateria = await fs.readFile(filePath, 'utf-8')
        const alumnosMaterias = JSON.parse(dataAlumnosMateria)

        const alumnoMateria = alumnosMaterias.find(alumno => alumno.dni === dni)

        if(!alumnoMateria) return res.send(404).send('Alumno no encontrado')

        for(let [nombreMateria, nuevaNota] of Object.entries(notas)) {
            const materia = alumnoMateria.materias.find(materia => materia.nombreMateria === nombreMateria)
            if(materia && materia.inscripto) {
                materia.nota = nuevaNota
            }
        }

        await fs.writeFile(filePath, JSON.stringify(alumnosMaterias, null, 2))

        res.status(200).send('Notas actualizadas correctamente')

    } catch (error) {
        console.error('Error', error)
        res.status(500).send('Error en el servidor')
    }

})*/

module.exports = router