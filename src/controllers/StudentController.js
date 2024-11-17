const Student = require('../models/Student')
const UserController = require('../controllers/UserController')
const SubjectController = require('../controllers/SubjectController')


exports.addStudent = async function(req,res) {
    try {
        
        const { name, lastname, dni, bornDate, email, parentName, parentDni} = req.body
        
        const exists = await Student.findOne({ dni })
        if(exists) return res.status(409).render('panel-administrador', {warning: 'Alumno existente'})
        
        const newStudent = new Student({
            name,
            lastname,
            dni,
            bornDate: new Date(bornDate), 
            email,
            parents: {
                parentName,
                parentDni
            },
        });

        const savedStudent = await newStudent.save()

        const userResult = await UserController.addUser(dni)

        if(!userResult.success) {
            await Student.findByIdAndDelete(savedStudent._id)
            return res.status(500).render('panel-administrador', {error: 'Error al crear el usuario asociado: ' + userResult.message})
        }

        res.status(201).render('panel-administrador', {success: `Alumno registrado exitosamente. Usuario creado con contraseña: ${userResult.password}`, data: savedStudent})

    } catch (err) {
        console.error('Error al guardar el estudiante: ', err)
        res.status(500).render('panel-administrador', {error: 'Error al registrar el Alumno'})
    }
}

exports.findStudentByDni = async function (req, res) {
    try {
        const {dni} = req.query
        
        const student = await Student.findOne({dni})
        
        if(!student) return res.send(`<p> Alumno no encontrado`)
        
        const subjects = await SubjectController.getSubjects()

        const enrolledSubjects = student.subjects.map(subject => subject.subjectName)

        const unenrolledSubjects = subjects.filter(subject => !enrolledSubjects.includes(subject))

        res.send(`
            <p> Nombre: ${student.name}</p>
            <p> Apellido: ${student.lastname} </p>
            <p> DNI: ${student.dni} </p>
            <ul>
                ${unenrolledSubjects
                    .map(subjectName => 
                        `
                        <li>
                            <span>${subjectName}
                            <input type="checkbox" name= "selectedSubjects[]" value=${subjectName}>
                        </li>`
                    )
                    .join('')}
            `)

        //res.status(200).json({success: true, data: student})
    } catch(err) {
        res.status(500).json({success: false, message: 'Error al obtener el alumno'})
    }
}

exports.enrolSubjects = async function(req,res) {
    try {
        const { dni, selectedSubjects } = req.body

        console.log(req.body)

        if(!selectedSubjects || selectedSubjects.length === 0) return res.status(400).render('panel-administrador', {warning: 'Debe seleccionar al menos una materia'})

        const student = await Student.findOne({dni})                

        if(!student) return res.status(404).render('panel-administrador', 'Alumno no encontrado')
    
        selectedSubjects.forEach(subjectName => {
            student.subjects.push({subjectName, score: 0})
            
        })

        await student.save()

        res.status(200).render('panel-administrador', {success: 'Alumno inscripto'})
    } catch(err) {
        console.error('Error al registrar materias', err)
        res.status(500).render('panel-administrador', {error: 'Error al registrar'})
    }
    
}