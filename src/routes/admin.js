const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises
const Student = require('../models/Student')
const Students = require('../controllers/StudentController')

router.get('/panel-administrador', (req, res) => {
    res.render('panel-administrador')
})


router.post('/registrar-estudiante', Students.addStudent) 
    

router.get('/buscar-alumno', Students.findStudentByDni) /* => {
        
        const {dni} = req.query
        const filePath = path.join(__dirname, '../jsons/alumnos.json')

    try {
        const dataAlumnos = await fs.readFile(filePath, 'utf-8') 
        const alumnos = JSON.parse(dataAlumnos)

        const alumno = alumnos.find(alumno => alumno.dni === dni)
    
        if(alumno) {
            const alumnoMateria = await buscarAlumnoMaterias(dni)
            
            res.send(`
                <p>Nombre: ${alumno.nombre}</p>
                <p>Apellido: ${alumno.apellido}</p>
                <p>DNI: ${alumno.dni}</p>
                <ul>
                    ${alumnoMateria.materias
                        .filter(materia => materia.inscripto === false)
                        .map(materia => {
                            return`
                        <li>
                                <span>${materia.nombreMateria} 
                                <input type="checkbox" name="inscripcionMaterias[]" value=${materia.nombreMateria}  >
                        </li>`    
                    }).join('')}
                </ul>
            `)
        } else {
                res.status(404).send('<p>Alumno no encontrado')   
        }
    
    } catch(error) {
        console.error('Error', error)
        res.status(500).send('Error en el servidor')
    }
    
})

async function buscarAlumnoMaterias(dni) {
    try {
        const filePathAlumnnosMaterias = path.join(__dirname, '../jsons/alumnos-materias.json')
        const dataAlumnosMaterias = await fs.readFile(filePathAlumnnosMaterias, 'utf-8') 
        const alumnosMaterias = JSON.parse(dataAlumnosMaterias)

        const alumnoMateria = alumnosMaterias.find(alumno => alumno.dni === dni)

        return alumnoMateria


    } catch(error) {
        console.error('Error', error)
        res.status(500).send('Error en el Servidor')
    }
}*/

router.post('/inscripcion-materias', Students.enrolSubjects) /*=> {
    const { dni, registerSubjects } = req.body

    if(!registerSubjects || registerSubjects.length === 0) return res.status(400).render('panel-administrador', {warning: 'Debe seleccionar al menos una materia'})
    
    const filePath = path.join(__dirname, '../jsons/alumnos-materias.json')
    try {
        const data = await fs.readFile(filePath, 'utf-8')
        const alumnosMaterias = JSON.parse(data)

        const alumnoMateria = alumnosMaterias.find(alumno => alumno.dni === dni)

        if(!alumnoMateria) return res.status(404).send('Alumno no encontrado')

        //Actualizar estado de la materia
        alumnoMateria.materias.forEach(materia => {
            if(inscripcionMaterias.includes(materia.nombreMateria)) {
                materia.inscripto = true
            }
        })

        await fs.writeFile(filePath, JSON.stringify(alumnosMaterias, null, 2) )

        //res.status(200).render('panel-administrador', {success: 'Alumno inscripto'})
        res.status(200).send( 'Alumno inscripto')

    } catch (error) {
        console.error('Error', error)
        res.status(500).send('Error en el servidor')
    }
    
})*/

module.exports = router
