const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises

router.get('/panel-profesor', (req,res) => {
    res.render('panel-profesor')
})

router.get('/buscar-alumno', async (req,res) => {
    const {dni} = req.query
    const filePath = path.join(__dirname, '../jsons/alumnos.json')

    try {
        const data = await fs.readFile(filePath, 'utf-8')
        const alumnos = JSON.parse(data)

        const alumno = alumnos.find(alumno => alumno.dni === dni)

        if(alumno) {
            const alumnoMateria = await buscarAlumnoMaterias(dni)
            res.send(`
                <p>Nombre: ${alumno.nombre}</p>
                <p>Apellido: ${alumno.apellido}</p>
                <p>DNI: ${alumno.dni}</p>
                <ul>
                    ${alumnoMateria.materias
                        .filter(materia => materia.inscripto === true)
                        .map(materia => {
                            return`
                            <li style= "padding: 10px">
                                <span>${materia.nombreMateria}
                                <input type="number" name="notas[${materia.nombreMateria}]" value="${materia.nota}" style="width: 25px">    
                            </li>` 
                        }).join('')}
                </ul>
                    
            `) 
        } else {
            res.status(404).send('<p>Alumno no encontrado')
        }

    } catch(error) {

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

router.post('/registrar-notas', async (req,res) => {
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

})

module.exports = router