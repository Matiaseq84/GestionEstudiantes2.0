const Student = require('../models/Student')
const UserController = require('../controllers/UserController')


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
        const student = await Alumno.findById(req.params.dni)
        if(!student) return res.status(404).json({success: false, message: 'Alumno no encontrado'})
        console.log(student)
        res.status(200).json({success: true, data: student})
    } catch(err) {
        res.status(500).json({success: false, message: 'Error al obtener el alumno'})
    }
}