const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises
const Student = require('../models/Student')
const {generarContrasenaAleatoria} = require('../utils/funciones')
const Students = require('../controllers/StudentController')

router.get('/panel-administrador', (req, res) => {
    res.render('panel-administrador')
})


router.post('/registrar-estudiante', Students.addStudent) /*=> {
    
        
        //Crear usuario en user.json
        const filePathUser = path.join(__dirname, '../jsons/users.json')
        const dataUser = await fs.readFile(filePathUser, 'utf-8')
        const users = JSON.parse(dataUser)

        passwordGenerado = generarContrasenaAleatoria()

        const nuevoUser = {
            [dni]: {
                password: passwordGenerado,
                role: 'alumno'
            } 
        }

        users.push(nuevoUser)
        await fs.writeFile(filePathUser, JSON.stringify(users, null, 2))

        //Crear la relación entre alumnos y materias
        const filePathAlumnoMateria = path.join(__dirname, '../jsons/alumnos-materias.json')
        const dataAlumnoMateria = await fs.readFile(filePathAlumnoMateria, 'utf-8')
        const alumnosMaterias = JSON.parse(dataAlumnoMateria)

        const alumnoMateria = {
            dni,
            materias: []
        }

        //Leer las materias y agregarlas al alumno
        const filePathMaterias = path.join(__dirname, '../jsons/materias.json');
        const materiasData = await fs.readFile(filePathMaterias, 'utf-8');
        const materiasDisponibles = JSON.parse(materiasData);


        materiasDisponibles.forEach(mat => {
            const materiaNota = {
                nombreMateria: mat.nombreMateria,
                nota: 0,
                inscripto: false
            };
            alumnoMateria.materias.push(materiaNota);
        });

        alumnosMaterias.push(alumnoMateria)
        await fs.writeFile(filePathAlumnoMateria, JSON.stringify(alumnosMaterias, null, 2))

        //res.status(201).render('panel-administrador', {success: 'Alumno y usuario creado. Contraseña: ' + passwordGenerado})
        res.status(201).send('Alumno y usuario creado. Contraseña: ' + passwordGenerado)
    } catch(error) {
        console.error('Error:', error)
        res.status(500).send('Error en el servidor')
    }
})*/

router.get('/buscar-alumno', async (req,res) => {
        
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
}

router.post('/inscripcion-materias', async (req, res) => {
    const { dni, inscripcionMaterias } = req.body

    if(!inscripcionMaterias || inscripcionMaterias.length === 0) return res.status(400).render('panel-administrador', {warning: 'Debe seleccionar al menos una materia'})
    
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
    
})

module.exports = router
