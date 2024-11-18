const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const Students = require('../controllers/StudentController')

router.get('/panel-alumno/:dni', Students.showInfoStudent) /*=> {
    const dni = req.params.dni

    try {
        const alumno = await busquedaAlumno(dni)
        
        const filePath = path.join(__dirname, '../jsons/alumnos-materias.json')
        const data = await fs.readFile(filePath, 'utf-8')
        const alumnosMaterias = JSON.parse(data)

        const alumnoMateria = alumnosMaterias.find(alumnoMateria => alumnoMateria.dni === dni) 


    if(alumno && alumnoMateria) res.status(201).render('panel-alumno', {
        alumno,
        materias: alumnoMateria.materias
    }
    )

    } catch(error) {
        console.error('Error', error)
        res.status(404).send('No encontrado')
    }
    
})*/



module.exports = router